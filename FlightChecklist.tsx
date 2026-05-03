import React, { useState, useCallback } from 'react';
import { checklists, CockpitZone } from './checklists';

type Phase = 'question' | 'correct' | 'incorrect' | 'done';

interface Hotspot {
  image: 'real' | 'diagram';
  x: number;
  y: number;
  w: number;
  h: number;
}

// Per-item hotspots as % of image dimensions.
// 'real'    → C-GWTE.jpg  (portrait ~600×800, cockpit photo)
// 'diagram' → C172 SP Cockpit.jpg  (landscape, used when control is obstructed in photo)
const HOTSPOTS: Record<string, Hotspot> = {
  // Pre-Engine Start
  'pre-4':   { image: 'real',    x: 42, y: 20, w: 15, h: 12 }, // Fuel Selector Valve (top of center pedestal)
  'pre-5':   { image: 'diagram', x: 80, y: 11, w: 16, h: 39 }, // Circuit Breakers (right panel, obstructed in photo)
  'pre-6':   { image: 'real',    x: 28, y: 2,  w: 44, h: 17 }, // Brakes (rudder pedal assembly, top of photo)
  // Engine Start
  'start-1': { image: 'real',    x: 27, y: 47, w: 12, h: 13 }, // Mixture (red knob, left lower panel)
  'start-2': { image: 'real',    x: 15, y: 47, w: 12, h: 13 }, // Throttle (left lower panel, left of mixture)
  'start-3': { image: 'real',    x: 17, y: 37, w: 14, h: 10 }, // Master Switch (left panel switch row)
  'start-4': { image: 'diagram', x: 18, y: 50, w: 6,  h: 7  }, // Beacon switch (too small to identify in photo)
  'start-6': { image: 'real',    x: 5,  y: 40, w: 13, h: 16 }, // Ignition / Magnetos (far left rotary)
  // Before Take-off
  'to-1':    { image: 'real',    x: 40, y: 34, w: 18, h: 12 }, // Parking Brake (center pedestal)
  'to-2':    { image: 'real',    x: 5,  y: 55, w: 28, h: 26 }, // Control Yoke (lower left)
  'to-3':    { image: 'real',    x: 43, y: 37, w: 44, h: 28 }, // Flight Instruments (right panel cluster)
  'to-4':    { image: 'real',    x: 56, y: 38, w: 18, h: 16 }, // Fuel Quantity gauges (right side of instruments)
  'to-5':    { image: 'real',    x: 27, y: 47, w: 12, h: 13 }, // Mixture (same as start-1)
};

const ITEM_LABELS: Record<string, string> = {
  'pre-4':   'Fuel Selector Valve',
  'pre-5':   'Circuit Breakers',
  'pre-6':   'Toe Brakes / Rudder Pedals',
  'start-1': 'Mixture Control (red knob)',
  'start-2': 'Throttle',
  'start-3': 'Master Switch',
  'start-4': 'Beacon Switch (BCN)',
  'start-6': 'Ignition / Magnetos',
  'to-1':    'Parking Brake',
  'to-2':    'Control Yoke',
  'to-3':    'Flight Instruments',
  'to-4':    'Fuel Quantity Gauges',
  'to-5':    'Mixture Control (red knob)',
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

const EXTERNAL_ZONES = new Set<CockpitZone>(['walkaround', 'cabin', 'external']);

const FlightChecklist: React.FC = () => {
  const categories = Object.keys(checklists);
  const [catIndex, setCatIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('question');
  const [showHint, setShowHint] = useState(false);
  const [clickPos, setClickPos] = useState<{ x: number; y: number } | null>(null);
  const [attempts, setAttempts] = useState(0);

  const category = categories[catIndex];
  const items = checklists[category];
  const item = items[itemIndex];
  const isExternal = EXTERNAL_ZONES.has(item.zone);
  const hotspot = HOTSPOTS[item.id];
  const usingDiagram = hotspot?.image === 'diagram';
  const imgSrc = usingDiagram
    ? `${import.meta.env.BASE_URL}C172 SP Cockpit.jpg`
    : `${import.meta.env.BASE_URL}C-GWTE.jpg`;

  const advance = useCallback(() => {
    if (itemIndex < items.length - 1) {
      setItemIndex(i => i + 1);
      setPhase('question');
      setClickPos(null);
      setAttempts(0);
      setShowHint(false);
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
    setShowHint(false);
  };

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (phase !== 'question' || isExternal || !hotspot) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;

    setClickPos({ x: px, y: py });

    const hit = px >= hotspot.x && px <= hotspot.x + hotspot.w
             && py >= hotspot.y && py <= hotspot.y + hotspot.h;

    if (hit) {
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
  }, [phase, isExternal, hotspot, advance]);

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
            <span className="text-xs text-slate-400 mt-1 tabular-nums">{itemIndex + 1} / {items.length}</span>
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
            phase === 'correct'   ? 'border-emerald-500 bg-emerald-950/40' :
            phase === 'incorrect' ? 'border-rose-500 bg-rose-950/40' :
                                    'border-slate-700 bg-slate-800'
          }`}>
            {phase === 'correct' ? (
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 text-xl font-bold">✓</span>
                <div>
                  <p className="text-emerald-400 font-bold text-sm">Correct!</p>
                  <p className="text-slate-300 text-xs">{ITEM_LABELS[item.id] ?? ZONE_LABELS[item.zone]}</p>
                </div>
              </div>
            ) : phase === 'incorrect' ? (
              <div className="flex items-center gap-3">
                <span className="text-rose-400 text-xl font-bold">✗</span>
                <div>
                  <p className="text-rose-400 font-bold text-sm">Not quite — try again</p>
                  <p className="text-slate-400 text-xs">
                    {attempts >= 2
                      ? `Hint: find the ${ITEM_LABELS[item.id] ?? ZONE_LABELS[item.zone]}`
                      : 'Click the correct location on the cockpit image'}
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
                {usingDiagram && (
                  <p className="text-amber-400/70 text-[11px] mb-1.5 text-center tracking-wide">
                    Control obstructed in aircraft photo — showing diagram
                  </p>
                )}

                <div
                  className="relative select-none cursor-crosshair rounded-xl overflow-hidden border border-slate-700"
                  onClick={handleClick}
                >
                  <img
                    key={imgSrc}
                    src={imgSrc}
                    alt={usingDiagram ? 'C172 Cockpit Diagram' : 'C-GWTE Cockpit'}
                    className="w-full block"
                    draggable={false}
                  />

                  {/* Hotspot overlay — hint or correct flash */}
                  {hotspot && (showHint || phase === 'correct') && (
                    <div
                      className={`absolute pointer-events-none rounded border-2 transition-all duration-300 ${
                        phase === 'correct'
                          ? 'border-emerald-400 bg-emerald-400/20'
                          : 'border-sky-400 bg-sky-400/10 animate-pulse'
                      }`}
                      style={{
                        left:   `${hotspot.x}%`,
                        top:    `${hotspot.y}%`,
                        width:  `${hotspot.w}%`,
                        height: `${hotspot.h}%`,
                      }}
                    >
                      {showHint && phase !== 'correct' && (
                        <span className="absolute top-1 left-1 text-[9px] font-bold text-white bg-slate-900/80 px-1 py-0.5 rounded leading-none whitespace-nowrap">
                          {item.task}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Wrong-click ripple */}
                  {clickPos && phase === 'incorrect' && (
                    <div
                      className="absolute w-8 h-8 rounded-full border-2 border-rose-400 bg-rose-400/20 pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-ping"
                      style={{ left: `${clickPos.x}%`, top: `${clickPos.y}%` }}
                    />
                  )}
                </div>

                <button
                  onClick={() => setShowHint(h => !h)}
                  className={`mt-2 w-full py-2 rounded-lg text-xs font-medium border transition-colors ${
                    showHint
                      ? 'border-sky-500/60 bg-sky-950/40 text-sky-400'
                      : 'border-slate-700 bg-slate-800/50 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {showHint ? 'Hide Hint' : 'Show Hint'}
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
