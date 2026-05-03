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
// 'real'    → C-GWTE.jpg  (portrait photo, rear-seat perspective looking forward)
// 'diagram' → C172 SP Cockpit.jpg  (flat diagram, used when control is obstructed in photo)
// Items with no entry here show a Mark Complete button instead of click-to-identify.
const HOTSPOTS: Record<string, Hotspot> = {
  // Pre-Flight Inspection  (pfi-1/2 cabin, pfi-10–14 walkaround → no hotspot needed)
  'pfi-3':  { image: 'real',    x: 2,  y: 18, w: 30, h: 44 }, // Control Lock — yoke
  'pfi-4':  { image: 'real',    x: 40, y: 58, w: 5,  h: 15 }, // Trim — center console upper
  'pfi-5':  { image: 'real',    x: 5,  y: 35, w: 42, h: 24 }, // Avionics & Electrics — left avionics stack
  'pfi-6':  { image: 'real',    x: 14, y: 40, w: 5,  h: 12 }, // Master / Battery Side
  'pfi-7':  { image: 'real',    x: 55, y: 40, w: 12, h: 10 }, // Flaps — right subpanel, above ALT STATIC AIR knobs
  'pfi-8':  { image: 'real',    x: 60, y: 10, w: 35, h: 18 }, // Fuel Gauges — top two gauges, right panel
  'pfi-9':  { image: 'diagram', x: 17, y: 55, w: 15, h: 7  }, // All Lights — light switch row on diagram
  // Pre-Start Check  (psc-2/3 cabin → no hotspot)
  'psc-1':  { image: 'real',    x: 38, y: 60, w: 20, h: 10 }, // Hobbs Time — hour meter, lower-center panel
  'psc-4':  { image: 'real',    x: 20, y: 42, w: 20, h: 10 }, // Circuit Breakers — right panel on diagram
  'psc-5':  { image: 'real',    x: 5,  y: 17, w: 22, h: 34 }, // Avionics & Electrics — left avionics stack
  'psc-6':  { image: 'real',    x: 2,  y: 15, w: 48, h: 34 }, // Controls — yoke
  'psc-7':  { image: 'real',    x: 40, y: 80, w: 16, h: 23 }, // Fuel — fuel selector (left tank)
  // Start Check  (sc-8 external → no hotspot, sc-4 prime → diagram)
  'sc-1':   { image: 'real',    x: 44, y: 38, w: 10, h: 12 }, // Carb Heat — knob left of throttle
  'sc-2':   { image: 'real',    x: 38, y: 38, w: 12, h: 12 }, // Throttle — black knob, lower-center
  'sc-3':   { image: 'real',    x: 50, y: 38, w: 12, h: 12 }, // Mixture — red knob, lower-center
  'sc-4':   { image: 'real',    x: 7,  y: 46, w: 10, h: 10 }, // Prime — diagram
  'sc-5':   { image: 'real',    x: 10, y: 62, w: 38, h: 16 }, // Brakes — rudder pedals
  'sc-6':   { image: 'real',    x: 10, y: 40, w: 10, h: 12 }, // Master / Battery Side
  'sc-7':   { image: 'real',    x: 35, y: 48, w: 5,  h: 7  }, // Beacon Light — BCN switch on diagram
  'sc-9':   { image: 'real',    x: 12, y: 40, w: 13, h: 16 }, // Magnetos — far-left rotary
  'sc-10':  { image: 'real',    x: 36, y: 38, w: 12, h: 12 }, // Throttle 1000 RPM
  'sc-11':  { image: 'real',    x: 60, y: 10, w: 35, h: 18 }, // Oil Pressure — bottom two gauges, right panel
  'sc-12':  { image: 'real',    x: 14, y: 40, w: 5,  h: 10 }, // Master / Alternator Side
  'sc-13':  { image: 'real',    x: 60, y: 10, w: 35, h: 18 }, // Ammeter — right panel upper area
  // Pre-Taxi Check
  'ptc-1':  { image: 'real',    x: 50, y: 38, w: 12, h: 12 }, // Mixture — red knob
  'ptc-2':  { image: 'real',    x: 55, y: 40, w: 12, h: 10 }, // Flaps — right subpanel, above ALT STATIC AIR knobs
  'ptc-3':  { image: 'real',    x: 48, y: 10, w: 22, h: 14 }, // Radio — left avionics
  'ptc-4':  { image: 'real',    x: 48, y: 27, w: 22, h: 14 }, // Transponder — left avionics
  'ptc-5':  { image: 'diagram', x: 14, y: 53, w: 15, h: 7  }, // Lights — light switch row
  'ptc-6':  { image: 'real',    x: 12, y: 40, w: 13, h: 16 }, // Dead Mag Check — magnetos
  'ptc-7':  { image: 'real',    x: 40, y: 80, w: 16, h: 23 }, // Fuel — fuel selector (right tank)
  'ptc-8':  { image: 'real',    x: 48, y: 10, w: 22, h: 14 }, // ATIS — radio/avionics
  'ptc-9':  { image: 'real',    x: 7,  y: 10, w: 30, h: 23 }, // Instruments
  'ptc-10': { image: 'real',    x: 48, y: 10, w: 22, h: 14 }, // Taxi Clearance / Transponder
  'ptc-11': { image: 'real',    x: 2,  y: 20, w: 28, h: 24 }, // Controls — yoke
  'ptc-12': { image: 'real',    x: 20, y: 62, w: 38, h: 16 }, // Brakes
  'ptc-13': { image: 'real',    x: 7,  y: 16, w: 30, h: 23 }, // Instruments during taxi
  // Run-Up Check  (ruc-1/2/7 external → no hotspot)
  'ruc-3':  { image: 'real',    x: 20, y: 62, w: 38, h: 16 }, // Brakes
  'ruc-4':  { image: 'real',    x: 40, y: 80, w: 16, h: 23 }, // Fuel — both tanks
  'ruc-5':  { image: 'real',    x: 50, y: 38, w: 12, h: 12 }, // Mixture — red knob
  'ruc-6':  { image: 'real',    x: 60, y: 10, w: 35, h: 18 }, // Oil Pressure / Temperature — bottom two gauges
  'ruc-8':  { image: 'real',    x: 38, y: 38, w: 12, h: 12 }, // Throttle 1700 RPM
  'ruc-9':  { image: 'real',    x: 60, y: 10, w: 35, h: 18 }, // Oil Pressure green — bottom two gauges
  'ruc-10': { image: 'real',    x: 60, y: 10, w: 35, h: 18 }, // Oil Temperature — bottom two gauges
  'ruc-11': { image: 'real',    x: 60, y: 10, w: 35, h: 18 }, // Suction gauge — bottom two gauges
  'ruc-12': { image: 'real',    x: 44, y: 38, w: 10, h: 12 }, // Carb Heat HOT
  'ruc-13': { image: 'real',    x: 50, y: 38, w: 12, h: 12 }, // Mixture confirm function
  'ruc-14': { image: 'real',    x: 18, y: 48, w: 10, h: 12 }, // Carb Heat COLD
  'ruc-15': { image: 'real',    x: 12, y: 40, w: 13, h: 16 }, // Magnetos
  'ruc-16': { image: 'real',    x: 44, y: 38, w: 10, h: 12 }, // Carb Heat HOT
  'ruc-17': { image: 'real',    x: 38, y: 38, w: 12, h: 12 }, // Throttle idle check
  'ruc-18': { image: 'real',    x: 38, y: 38, w: 12, h: 12 }, // Throttle 1000 RPM
  'ruc-19': { image: 'real',    x: 24, y: 48, w: 10, h: 12 }, // Carb Heat COLD
  // Pre-Takeoff Check  (ptof-10/11 cabin, ptof-13 external → no hotspot)
  'ptof-1': { image: 'real',    x: 7,  y: 46, w: 10, h: 10 }, // Primer
  'ptof-2': { image: 'real',    x: 14, y: 40, w: 14, h: 12 }, // Masters / Magnetos
  'ptof-3': { image: 'diagram', x: 20, y: 42, w: 20, h: 10 }, // Circuit Breakers
  'ptof-4': { image: 'real',    x: 44, y: 38, w: 10, h: 12 }, // Carb Heat COLD
  'ptof-5': { image: 'real',    x: 50, y: 38, w: 12, h: 12 }, // Mixture — red knob
  'ptof-6': { image: 'real',    x: 60, y: 10, w: 35, h: 18 }, // Oil Pressure / Temperature — bottom two gauges
  'ptof-7': { image: 'real',    x: 40, y: 80, w: 16, h: 23 }, // Fuel — both tanks
  'ptof-8': { image: 'real',    x: 55, y: 40, w: 12, h: 10 }, // Flaps — right subpanel, above ALT STATIC AIR knobs
  'ptof-9': { image: 'real',    x: 7,  y: 10, w: 30, h: 23 }, // Instruments
  'ptof-12':{ image: 'real',    x: 2,  y: 20, w: 28, h: 24 }, // Controls — yoke
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
  const [confirmReset, setConfirmReset] = useState(false);

  const category = categories[catIndex];
  const items = checklists[category];
  const item = items[itemIndex];
  const showMarkComplete = EXTERNAL_ZONES.has(item.zone) || !HOTSPOTS[item.id];
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
    if (phase !== 'question' || showMarkComplete || !hotspot) return;

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
  }, [phase, showMarkComplete, hotspot, advance]);

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
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-slate-400 tabular-nums">{itemIndex + 1} / {items.length}</span>
              {confirmReset ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-300">Reset all?</span>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold transition-colors"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="text-xs text-slate-400 hover:text-slate-300 font-semibold transition-colors"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmReset(true)}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
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
                  <p className="text-slate-300 text-xs">{item.task}</p>
                </div>
              </div>
            ) : phase === 'incorrect' ? (
              <div className="flex items-center gap-3">
                <span className="text-rose-400 text-xl font-bold">✗</span>
                <div>
                  <p className="text-rose-400 font-bold text-sm">Not quite — try again</p>
                  <p className="text-slate-400 text-xs">
                    {attempts >= 2
                      ? `Hint: find the ${item.task}`
                      : 'Click the correct location on the cockpit image'}
                  </p>
                </div>
              </div>
            ) : showMarkComplete ? (
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
            {showMarkComplete ? (
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
