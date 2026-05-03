import React, { useState, useCallback } from 'react';
import { checklists, CockpitZone } from './checklists';

type ZoneBounds = { x: number; y: number; w: number; h: number };
type Phase = 'question' | 'correct' | 'incorrect' | 'done';

// Bounding boxes as % of image width/height — calibrated to C172 SP Cockpit.jpg
const ZONE_BOUNDS: Partial<Record<CockpitZone, ZoneBounds>> = {
  'main-panel':   { x: 4,  y: 10, w: 58, h: 33 },
  'left-panel':   { x: 4,  y: 44, w: 42, h: 13 },
  'center-panel': { x: 44, y: 44, w: 23, h: 13 },
  'right-panel':  { x: 79, y: 10, w: 17, h: 47 },
  'pedestal':     { x: 37, y: 58, w: 26, h: 20 },
  'yoke':         { x: 5,  y: 57, w: 28, h: 26 },
  'floor':        { x: 33, y: 78, w: 34, h: 12 },
};

const ZONE_LABELS: Record<CockpitZone, string> = {
  'main-panel':   'Main Instrument Panel',
  'left-panel':   'Left Switch Panel',
  'center-panel': 'Center Controls (Throttle / Mixture)',
  'right-panel':  'Right Panel (Circuit Breakers)',
  'pedestal':     'Center Pedestal (Fuel Selector)',
  'yoke':         'Control Yoke',
  'floor':        'Floor (Parking Brake / Brakes)',
  'walkaround':   'Pre-flight Walkaround',
  'cabin':        'Cabin (Seats & Seatbelts)',
  'external':     'External (Propeller Area)',
};

const ZONE_BORDER: Partial<Record<CockpitZone, string>> = {
  'main-panel':   'border-sky-400',
  'left-panel':   'border-indigo-400',
  'center-panel': 'border-emerald-400',
  'right-panel':  'border-purple-400',
  'pedestal':     'border-amber-400',
  'yoke':         'border-cyan-400',
  'floor':        'border-orange-400',
};

const EXTERNAL_ZONES = new Set<CockpitZone>(['walkaround', 'cabin', 'external']);

const FlightChecklist: React.FC = () => {
  const categories = Object.keys(checklists);
  const [catIndex, setCatIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('question');
  const [showHints, setShowHints] = useState(false);
  const [clickPos, setClickPos] = useState<{ x: number; y: number } | null>(null);
  const [attempts, setAttempts] = useState(0);

  const category = categories[catIndex];
  const items = checklists[category];
  const item = items[itemIndex];
  const isExternal = EXTERNAL_ZONES.has(item.zone);

  const advance = useCallback(() => {
    if (itemIndex < items.length - 1) {
      setItemIndex(i => i + 1);
      setPhase('question');
      setClickPos(null);
      setAttempts(0);
      setShowHints(false);
    } else {
      setPhase('done');
    }
  }, [itemIndex, items.length]);

  const selectCategory = (idx: number) => {
    setCatIndex(idx);
    setItemIndex(0);
    setPhase('question');
    setClickPos(null);
    setAttempts(0);
    setShowHints(false);
  };

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (phase !== 'question' || isExternal) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;

    setClickPos({ x: px, y: py });

    let hit: CockpitZone | null = null;
    for (const entry of Object.entries(ZONE_BOUNDS) as Array<[CockpitZone, ZoneBounds]>) {
      const [z, b] = entry;
      if (px >= b.x && px <= b.x + b.w && py >= b.y && py <= b.y + b.h) {
        hit = z;
        break;
      }
    }

    if (hit === item.zone) {
      setPhase('correct');
      setTimeout(advance, 1500);
    } else {
      setAttempts(a => a + 1);
      setPhase('incorrect');
      setTimeout(() => {
        setPhase('question');
        setClickPos(null);
      }, 1800);
    }
  }, [phase, isExternal, item, advance]);

  const progressPct = Math.round((itemIndex / items.length) * 100);

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 flex flex-col max-w-2xl mx-auto">

      {/* Header */}
      <header className="px-4 pt-4 pb-3 border-b border-slate-700">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h1 className="text-xl font-bold text-sky-400">C172 Cockpit Trainer</h1>
            <p className="text-slate-500 text-xs">Pacific Rim Aviation Academy</p>
          </div>
          {phase !== 'done' && (
            <span className="text-xs text-slate-400 mt-1 tabular-nums">
              {itemIndex + 1} / {items.length}
            </span>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat, i) => (
            <button
              key={cat}
              onClick={() => selectCategory(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                i === catIndex
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/30'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Done screen */}
      {phase === 'done' ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-900/50 border-2 border-emerald-500 flex items-center justify-center text-2xl font-bold text-emerald-400">
            ✓
          </div>
          <div>
            <h2 className="text-2xl font-bold text-emerald-400">Checklist Complete</h2>
            <p className="text-slate-400 mt-1 text-sm">{category} — all {items.length} items verified</p>
          </div>
          <div className="flex gap-3">
            {catIndex < categories.length - 1 && (
              <button
                onClick={() => selectCategory(catIndex + 1)}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-500 rounded-lg font-bold text-sm transition-colors"
              >
                Next: {categories[catIndex + 1]}
              </button>
            )}
            <button
              onClick={() => selectCategory(catIndex)}
              className="px-5 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Instruction card */}
          <div className={`mx-4 mt-4 p-4 rounded-xl border transition-all duration-300 ${
            phase === 'correct'
              ? 'border-emerald-500 bg-emerald-950/40'
              : phase === 'incorrect'
              ? 'border-rose-500 bg-rose-950/40'
              : 'border-slate-700 bg-slate-800'
          }`}>
            {phase === 'correct' ? (
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 text-xl font-bold">✓</span>
                <div>
                  <p className="text-emerald-400 font-bold text-sm">Correct!</p>
                  <p className="text-slate-300 text-xs">{ZONE_LABELS[item.zone]}</p>
                </div>
              </div>
            ) : phase === 'incorrect' ? (
              <div className="flex items-center gap-3">
                <span className="text-rose-400 text-xl font-bold">✗</span>
                <div>
                  <p className="text-rose-400 font-bold text-sm">Not quite — try again</p>
                  <p className="text-slate-400 text-xs">
                    {attempts >= 2 ? `Hint: find the ${ZONE_LABELS[item.zone]}` : 'Click the correct location on the cockpit diagram'}
                  </p>
                </div>
              </div>
            ) : isExternal ? (
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Performed outside cockpit</p>
                <p className="text-white font-bold">{item.task}</p>
                <p className="text-sky-400 font-mono text-sm mt-0.5">→ {item.action}</p>
              </div>
            ) : (
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Tap the location of:</p>
                <p className="text-white text-lg font-bold">{item.task}</p>
                <p className="text-sky-400 font-mono text-sm mt-0.5">→ {item.action}</p>
              </div>
            )}
          </div>

          {/* Cockpit area */}
          <div className="flex-1 px-4 pt-3 pb-4">
            {isExternal ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 rounded-xl border border-slate-700 bg-slate-800/50">
                <p className="text-slate-300 font-medium">{item.task}</p>
                <p className="text-slate-500 text-sm">{ZONE_LABELS[item.zone]}</p>
                <button
                  onClick={advance}
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 rounded-lg font-bold text-sm transition-colors"
                >
                  Mark Complete
                </button>
              </div>
            ) : (
              <>
                <div
                  className="relative select-none cursor-crosshair rounded-xl overflow-hidden border border-slate-700"
                  onClick={handleClick}
                >
                  <img
                    src={`${import.meta.env.BASE_URL}C172 SP Cockpit.jpg`}
                    alt="C172 Cockpit Layout"
                    className="w-full block"
                    draggable={false}
                  />

                  {/* Zone hotspot overlays */}
                  {(Object.entries(ZONE_BOUNDS) as Array<[CockpitZone, ZoneBounds]>).map(([z, b]) => {
                    const isTarget = z === item.zone;
                    const borderClass = ZONE_BORDER[z] ?? 'border-slate-400';
                    return (
                      <div
                        key={z}
                        className={`absolute pointer-events-none rounded transition-all duration-200 border-2 ${
                          isTarget && phase === 'correct'
                            ? 'border-emerald-400 bg-emerald-400/20'
                            : isTarget && showHints
                            ? `${borderClass} bg-white/5 animate-pulse`
                            : showHints
                            ? 'border-white/20 bg-transparent'
                            : 'border-transparent bg-transparent'
                        }`}
                        style={{
                          left: `${b.x}%`,
                          top: `${b.y}%`,
                          width: `${b.w}%`,
                          height: `${b.h}%`,
                        }}
                      >
                        {showHints && isTarget && (
                          <span className="absolute top-1 left-1 text-[9px] font-bold text-white bg-slate-900/80 px-1 py-0.5 rounded leading-none">
                            {ZONE_LABELS[z]}
                          </span>
                        )}
                      </div>
                    );
                  })}

                  {/* Incorrect click ripple */}
                  {clickPos && phase === 'incorrect' && (
                    <div
                      className="absolute w-8 h-8 rounded-full border-2 border-rose-400 bg-rose-400/20 pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-ping"
                      style={{ left: `${clickPos.x}%`, top: `${clickPos.y}%` }}
                    />
                  )}
                </div>

                <button
                  onClick={() => setShowHints(h => !h)}
                  className={`mt-2 w-full py-2 rounded-lg text-xs font-medium border transition-colors ${
                    showHints
                      ? 'border-sky-500/60 bg-sky-950/40 text-sky-400'
                      : 'border-slate-700 bg-slate-800/50 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {showHints ? 'Hide Zone Hints' : 'Show Zone Hints'}
                </button>
              </>
            )}
          </div>

          {/* Progress bar */}
          <div className="px-4 pb-4 border-t border-slate-800 pt-3">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-500">{category}</span>
              <span className="text-sky-400 font-bold tabular-nums">{progressPct}%</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FlightChecklist;
