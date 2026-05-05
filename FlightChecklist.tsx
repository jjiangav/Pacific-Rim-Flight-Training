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
type AircraftHotspots = Record<string, Hotspot>;

// ─── C-GWTE (calibrated) ────────────────────────────────────────────────────
const HOTSPOTS_GWTE: AircraftHotspots = {
  'pfi-3':  { image: 'real',    x: 2,  y: 18, w: 30, h: 44 },
  'pfi-4':  { image: 'real',    x: 40, y: 58, w: 5,  h: 15 },
  'pfi-5':  { image: 'real',    x: 5,  y: 35, w: 42, h: 24 },
  'pfi-6':  { image: 'real',    x: 14, y: 40, w: 5,  h: 12 },
  'pfi-7':  { image: 'real',    x: 55, y: 40, w: 12, h: 10 },
  'pfi-8':  { image: 'real',    x: 60, y: 10, w: 35, h: 18 },
  'pfi-9':  { image: 'diagram', x: 17, y: 55, w: 15, h: 7  },
  'psc-1':  { image: 'real',    x: 38, y: 60, w: 20, h: 10 },
  'psc-4':  { image: 'real',    x: 20, y: 42, w: 20, h: 10 },
  'psc-5':  { image: 'real',    x: 5,  y: 17, w: 22, h: 34 },
  'psc-6':  { image: 'real',    x: 2,  y: 15, w: 48, h: 34 },
  'psc-7':  { image: 'real',    x: 40, y: 80, w: 16, h: 23 },
  'sc-1':   { image: 'real',    x: 44, y: 38, w: 10, h: 12 },
  'sc-2':   { image: 'real',    x: 38, y: 38, w: 12, h: 12 },
  'sc-3':   { image: 'real',    x: 50, y: 38, w: 12, h: 12 },
  'sc-4':   { image: 'real',    x: 7,  y: 46, w: 10, h: 10 },
  'sc-5':   { image: 'real',    x: 10, y: 62, w: 38, h: 16 },
  'sc-6':   { image: 'real',    x: 10, y: 40, w: 10, h: 12 },
  'sc-7':   { image: 'real',    x: 35, y: 48, w: 5,  h: 7  },
  'sc-9':   { image: 'real',    x: 12, y: 40, w: 13, h: 16 },
  'sc-10':  { image: 'real',    x: 36, y: 38, w: 12, h: 12 },
  'sc-11':  { image: 'real',    x: 60, y: 10, w: 35, h: 18 },
  'sc-12':  { image: 'real',    x: 14, y: 40, w: 5,  h: 10 },
  'sc-13':  { image: 'real',    x: 60, y: 10, w: 35, h: 18 },
  'ptc-1':  { image: 'real',    x: 50, y: 38, w: 12, h: 12 },
  'ptc-2':  { image: 'real',    x: 55, y: 40, w: 12, h: 10 },
  'ptc-3':  { image: 'real',    x: 48, y: 10, w: 22, h: 14 },
  'ptc-4':  { image: 'real',    x: 48, y: 27, w: 22, h: 14 },
  'ptc-5':  { image: 'diagram', x: 14, y: 53, w: 15, h: 7  },
  'ptc-6':  { image: 'real',    x: 12, y: 40, w: 13, h: 16 },
  'ptc-7':  { image: 'real',    x: 40, y: 80, w: 16, h: 23 },
  'ptc-8':  { image: 'real',    x: 48, y: 10, w: 22, h: 14 },
  'ptc-9':  { image: 'real',    x: 7,  y: 10, w: 30, h: 23 },
  'ptc-10': { image: 'real',    x: 48, y: 10, w: 22, h: 14 },
  'ptc-11': { image: 'real',    x: 2,  y: 20, w: 28, h: 24 },
  'ptc-12': { image: 'real',    x: 20, y: 62, w: 38, h: 16 },
  'ptc-13': { image: 'real',    x: 7,  y: 16, w: 30, h: 23 },
  'ruc-3':  { image: 'real',    x: 20, y: 62, w: 38, h: 16 },
  'ruc-4':  { image: 'real',    x: 40, y: 80, w: 16, h: 23 },
  'ruc-5':  { image: 'real',    x: 50, y: 38, w: 12, h: 12 },
  'ruc-6':  { image: 'real',    x: 60, y: 10, w: 35, h: 18 },
  'ruc-8':  { image: 'real',    x: 38, y: 38, w: 12, h: 12 },
  'ruc-9':  { image: 'real',    x: 60, y: 10, w: 35, h: 18 },
  'ruc-10': { image: 'real',    x: 60, y: 10, w: 35, h: 18 },
  'ruc-11': { image: 'real',    x: 60, y: 10, w: 35, h: 18 },
  'ruc-12': { image: 'real',    x: 44, y: 38, w: 10, h: 12 },
  'ruc-13': { image: 'real',    x: 50, y: 38, w: 12, h: 12 },
  'ruc-14': { image: 'real',    x: 18, y: 48, w: 10, h: 12 },
  'ruc-15': { image: 'real',    x: 12, y: 40, w: 13, h: 16 },
  'ruc-16': { image: 'real',    x: 44, y: 38, w: 10, h: 12 },
  'ruc-17': { image: 'real',    x: 38, y: 38, w: 12, h: 12 },
  'ruc-18': { image: 'real',    x: 38, y: 38, w: 12, h: 12 },
  'ruc-19': { image: 'real',    x: 24, y: 48, w: 10, h: 12 },
  'ptof-1': { image: 'real',    x: 7,  y: 46, w: 10, h: 10 },
  'ptof-2': { image: 'real',    x: 14, y: 40, w: 14, h: 12 },
  'ptof-3': { image: 'diagram', x: 20, y: 42, w: 20, h: 10 },
  'ptof-4': { image: 'real',    x: 44, y: 38, w: 10, h: 12 },
  'ptof-5': { image: 'real',    x: 50, y: 38, w: 12, h: 12 },
  'ptof-6': { image: 'real',    x: 60, y: 10, w: 35, h: 18 },
  'ptof-7': { image: 'real',    x: 40, y: 80, w: 16, h: 23 },
  'ptof-8': { image: 'real',    x: 55, y: 40, w: 12, h: 10 },
  'ptof-9': { image: 'real',    x: 7,  y: 10, w: 30, h: 23 },
  'ptof-12':{ image: 'real',    x: 2,  y: 20, w: 28, h: 24 },
};

// ─── C-FBZQ (dark cockpit, head-on view — calibrated pfi) ────────────────────
const HOTSPOTS_FBZQ: AircraftHotspots = {
  'pfi-3':  { image: 'real',    x: 13, y: 47, w: 24, h: 22 }, // yoke
  'pfi-4':  { image: 'real',    x: 42, y: 54, w: 12, h: 12 }, // trim
  'pfi-5':  { image: 'real',    x: 31, y: 40, w: 24, h: 24 }, // avionics stack
  'pfi-6':  { image: 'real',    x: 17, y: 42, w: 12, h: 12 }, // master
  'pfi-7':  { image: 'real',    x: 55, y: 42, w: 12, h: 12 }, // flaps
  'pfi-8':  { image: 'real',    x: 66, y: 8,  w: 12, h: 12 }, // fuel gauges
  'pfi-9':  { image: 'real',    x: 34, y: 42, w: 12, h: 12 },
  'psc-1':  { image: 'real',    x: 45, y: 62, w: 12, h: 12 }, // hobbs
  'psc-4':  { image: 'real',    x: 28, y: 42, w: 12, h: 12 }, // circuit breakers
  'psc-5':  { image: 'real',    x: 17, y: 42, w: 12, h: 12 }, // avionics
  'psc-6':  { image: 'real',    x: 5,  y: 10, w: 30, h: 30 }, // yoke
  'psc-7':  { image: 'real',    x: 44, y: 75, w: 12, h: 12 }, // fuel selector
  'sc-1':   { image: 'real',    x: 40, y: 41, w: 12, h: 12 }, // carb heat
  'sc-2':   { image: 'real',    x: 46, y: 42, w: 12, h: 12 }, // throttle
  'sc-3':   { image: 'real',    x: 51, y: 39, w: 12, h: 12 }, // mixture
  'sc-4':   { image: 'real',    x: 12, y: 42, w: 12, h: 12 }, // primer
  'sc-5':   { image: 'real',    x: 33, y: 60, w: 20, h: 20 }, // brakes
  'sc-6':   { image: 'real',    x: 18, y: 40, w: 12, h: 12 }, // master
  'sc-7':   { image: 'real',    x: 37, y: 44, w: 12, h: 12 }, // beacon
  'sc-9':   { image: 'real',    x: 20, y: 42, w: 12, h: 12 }, // magnetos
  'sc-10':  { image: 'real',    x: 45, y: 40, w: 12, h: 12 }, // throttle
  'sc-11':  { image: 'real',    x: 65, y: 10, w: 12, h: 12 }, // oil pressure
  'sc-12':  { image: 'real',    x: 16, y: 42, w: 12, h: 12 }, // master alt
  'sc-13':  { image: 'real',    x: 75, y: 12, w: 12, h: 12 }, // ammeter
  'ptc-1':  { image: 'real',    x: 50, y: 39, w: 12, h: 12 }, // mixture
  'ptc-2':  { image: 'real',    x: 55, y: 39, w: 12, h: 12 }, // flaps
  'ptc-3':  { image: 'real',    x: 51, y: 9,  w: 12, h: 12 }, // radio
  'ptc-4':  { image: 'real',    x: 50, y: 26, w: 12, h: 12 }, // transponder
  'ptc-5':  { image: 'real',    x: 33, y: 41, w: 12, h: 12 },
  'ptc-6':  { image: 'real',    x: 20, y: 39, w: 12, h: 12 }, // magnetos
  'ptc-7':  { image: 'real',    x: 44, y: 74, w: 12, h: 12 }, // fuel selector
  'ptc-8':  { image: 'real',    x: 42, y: 20, w: 28, h: 16 }, // ATIS/radio
  'ptc-9':  { image: 'real',    x: 5,  y: 10, w: 35, h: 28 }, // instruments
  'ptc-10': { image: 'real',    x: 42, y: 20, w: 28, h: 16 }, // transponder
  'ptc-11': { image: 'real',    x: 2,  y: 15, w: 28, h: 35 }, // yoke
  'ptc-12': { image: 'real',    x: 32, y: 58, w: 12, h: 12 }, // brakes
  'ptc-13': { image: 'real',    x: 5,  y: 15, w: 35, h: 28 }, // instruments
  'ruc-3':  { image: 'real',    x: 33, y: 58, w: 12, h: 12 },
  'ruc-4':  { image: 'real',    x: 44, y: 75, w: 12, h: 12 },
  'ruc-5':  { image: 'real',    x: 52, y: 40, w: 12, h: 12 },
  'ruc-6':  { image: 'real',    x: 65, y: 9,  w: 12, h: 12 },
  'ruc-8':  { image: 'real',    x: 46, y: 41, w: 12, h: 12 },
  'ruc-9':  { image: 'real',    x: 66, y: 10, w: 12, h: 12 },
  'ruc-10': { image: 'real',    x: 74, y: 10, w: 12, h: 12 },
  'ruc-11': { image: 'real',    x: 64, y: 11, w: 12, h: 12 },
  'ruc-12': { image: 'real',    x: 40, y: 39, w: 12, h: 12 },
  'ruc-13': { image: 'real',    x: 51, y: 39, w: 12, h: 12 },
  'ruc-14': { image: 'real',    x: 40, y: 38, w: 12, h: 12 },
  'ruc-15': { image: 'real',    x: 19, y: 42, w: 12, h: 12 },
  'ruc-16': { image: 'real',    x: 41, y: 39, w: 12, h: 12 },
  'ruc-17': { image: 'real',    x: 45, y: 41, w: 12, h: 12 },
  'ruc-18': { image: 'real',    x: 44, y: 39, w: 12, h: 12 },
  'ruc-19': { image: 'real',    x: 40, y: 40, w: 12, h: 12 },
  'ptof-1': { image: 'real',    x: 11, y: 43, w: 12, h: 12 },
  'ptof-2': { image: 'real',    x: 19, y: 41, w: 12, h: 12 },
  'ptof-3': { image: 'diagram', x: 20, y: 42, w: 20, h: 10 },
  'ptof-4': { image: 'real',    x: 41, y: 41, w: 12, h: 12 },
  'ptof-5': { image: 'real',    x: 51, y: 41, w: 12, h: 12 },
  'ptof-6': { image: 'real',    x: 65, y: 10, w: 12, h: 12 },
  'ptof-7': { image: 'real',    x: 44, y: 75, w: 12, h: 12 },
  'ptof-8': { image: 'real',    x: 54, y: 40, w: 12, h: 12 },
  'ptof-9': { image: 'real',    x: 5,  y: 15, w: 35, h: 28 },
  'ptof-12':{ image: 'real',    x: 2,  y: 4,  w: 30, h: 32 },
};

// ─── C-GREI (tan, traditional instruments — calibrated) ──────────────────────
const HOTSPOTS_GREI: AircraftHotspots = {
  'pfi-3':  { image: 'real',    x: 16, y: 52, w: 12, h: 12 },
  'pfi-4':  { image: 'real',    x: 47, y: 62, w: 12, h: 12 },
  'pfi-5':  { image: 'real',    x: 41, y: 48, w: 12, h: 12 },
  'pfi-6':  { image: 'real',    x: 16, y: 52, w: 12, h: 12 },
  'pfi-7':  { image: 'real',    x: 58, y: 46, w: 12, h: 12 },
  'pfi-8':  { image: 'real',    x: 14, y: 31, w: 12, h: 12 },
  'pfi-9':  { image: 'real',    x: 41, y: 50, w: 12, h: 12 },
  'pfi-10': { image: 'real',    x: 17, y: 51, w: 12, h: 12 },
  'psc-1':  { image: 'real',    x: 83, y: 20, w: 12, h: 12 }, // hobbs
  'psc-4':  { image: 'real',    x: 31, y: 49, w: 12, h: 12 }, // circuit breakers
  'psc-5':  { image: 'real',    x: 18, y: 51, w: 42, h: 12 }, // avionics
  'psc-6':  { image: 'real',    x: 11, y: 33, w: 32, h: 32 }, // yoke
  'psc-7':  { image: 'real',    x: 50, y: 85, w: 12, h: 12 }, // fuel selector
  'sc-1':   { image: 'real',    x: 45, y: 47, w: 12, h: 12 }, // carb heat
  'sc-2':   { image: 'real',    x: 49, y: 48, w: 12, h: 12 }, // throttle
  'sc-3':   { image: 'real',    x: 55, y: 47, w: 12, h: 12 }, // mixture
  'sc-4':   { image: 'real',    x: 13, y: 48, w: 12, h: 12 }, // primer
  'sc-5':   { image: 'real',    x: 18, y: 65, w: 42, h: 16 }, // brakes
  'sc-6':   { image: 'real',    x: 15, y: 52, w: 12, h: 12 }, // master
  'sc-7':   { image: 'real',    x: 41, y: 49, w: 12, h: 12 }, // beacon
  'sc-9':   { image: 'real',    x: 18, y: 50, w: 12, h: 12 }, // magnetos
  'sc-10':  { image: 'real',    x: 50, y: 47, w: 12, h: 12 }, // throttle
  'sc-11':  { image: 'real',    x: 13, y: 31, w: 12, h: 12 }, // oil pressure
  'sc-12':  { image: 'real',    x: 19, y: 52, w: 12, h: 12 }, // master alt
  'sc-13':  { image: 'real',    x: 66, y: 27, w: 12, h: 12 }, // ammeter
  'ptc-1':  { image: 'real',    x: 53, y: 45, w: 12, h: 12 }, // mixture
  'ptc-2':  { image: 'real',    x: 57, y: 46, w: 12, h: 12 }, // flaps
  'ptc-3':  { image: 'real',    x: 45, y: 15, w: 28, h: 16 }, // radio
  'ptc-4':  { image: 'real',    x: 45, y: 31, w: 28, h: 14 }, // transponder
  'ptc-5':  { image: 'real',    x: 37, y: 49, w: 12, h: 12 },
  'ptc-6':  { image: 'real',    x: 17, y: 50, w: 12, h: 12 }, // magnetos
  'ptc-7':  { image: 'real',    x: 51, y: 84, w: 12, h: 12 }, // fuel selector
  'ptc-8':  { image: 'real',    x: 45, y: 15, w: 28, h: 16 }, // ATIS/radio
  'ptc-9':  { image: 'real',    x: 5,  y: 10, w: 35, h: 26 }, // instruments
  'ptc-10': { image: 'real',    x: 45, y: 15, w: 28, h: 16 }, // transponder
  'ptc-11': { image: 'real',    x: 2,  y: 18, w: 32, h: 42 }, // yoke
  'ptc-12': { image: 'real',    x: 18, y: 65, w: 42, h: 16 }, // brakes
  'ptc-13': { image: 'real',    x: 5,  y: 10, w: 35, h: 26 }, // instruments
  'ruc-2':  { image: 'real',    x: 36, y: 67, w: 12, h: 12 },
  'ruc-3':  { image: 'real',    x: 18, y: 65, w: 42, h: 16 },
  'ruc-4':  { image: 'real',    x: 50, y: 85, w: 12, h: 12 },
  'ruc-5':  { image: 'real',    x: 55, y: 48, w: 12, h: 12 },
  'ruc-6':  { image: 'real',    x: 14, y: 30, w: 12, h: 12 },
  'ruc-8':  { image: 'real',    x: 51, y: 47, w: 12, h: 12 },
  'ruc-9':  { image: 'real',    x: 14, y: 30, w: 12, h: 12 },
  'ruc-10': { image: 'real',    x: 14, y: 31, w: 12, h: 12 },
  'ruc-11': { image: 'real',    x: 12, y: 30, w: 12, h: 12 },
  'ruc-12': { image: 'real',    x: 47, y: 47, w: 12, h: 12 },
  'ruc-13': { image: 'real',    x: 55, y: 47, w: 12, h: 12 },
  'ruc-14': { image: 'real',    x: 46, y: 47, w: 12, h: 12 },
  'ruc-15': { image: 'real',    x: 18, y: 49, w: 12, h: 12 },
  'ruc-16': { image: 'real',    x: 45, y: 46, w: 12, h: 12 },
  'ruc-17': { image: 'real',    x: 51, y: 47, w: 12, h: 12 },
  'ruc-18': { image: 'real',    x: 50, y: 48, w: 12, h: 12 },
  'ruc-19': { image: 'real',    x: 46, y: 48, w: 12, h: 12 },
  'ptof-1': { image: 'real',    x: 16, y: 52, w: 12, h: 12 },
  'ptof-2': { image: 'real',    x: 17, y: 52, w: 12, h: 12 },
  'ptof-3': { image: 'real',    x: 33, y: 46, w: 12, h: 12 },
  'ptof-4': { image: 'real',    x: 46, y: 47, w: 12, h: 12 },
  'ptof-5': { image: 'real',    x: 55, y: 46, w: 12, h: 12 },
  'ptof-6': { image: 'real',    x: 13, y: 30, w: 12, h: 12 },
  'ptof-7': { image: 'real',    x: 13, y: 31, w: 12, h: 12 },
  'ptof-8': { image: 'real',    x: 45, y: 62, w: 12, h: 12 },
  'ptof-9': { image: 'real',    x: 5,  y: 10, w: 35, h: 26 },
  'ptof-12':{ image: 'real',    x: 2,  y: 18, w: 32, h: 42 },
};

// ─── C-GUZD (glass cockpit — calibrated) ─────────────────────────────────────
const HOTSPOTS_GUZD: AircraftHotspots = {
  'pfi-3':  { image: 'real',    x: 2,  y: 20, w: 32, h: 42 }, // yoke
  'pfi-4':  { image: 'real',    x: 44, y: 56, w: 12, h: 12 }, // trim
  'pfi-5':  { image: 'real',    x: 36, y: 42, w: 32, h: 22 }, // avionics
  'pfi-6':  { image: 'real',    x: 18, y: 43, w: 12, h: 12 }, // master
  'pfi-7':  { image: 'real',    x: 60, y: 45, w: 10, h: 10 }, // flaps
  'pfi-8':  { image: 'real',    x: 13, y: 23, w: 12, h: 12 }, // fuel (on glass)
  'pfi-9':  { image: 'real',    x: 37, y: 43, w: 12, h: 12 },
  'psc-1':  { image: 'real',    x: 80, y: 12, w: 12, h: 12 }, // hobbs
  'psc-4':  { image: 'real',    x: 28, y: 42, w: 12, h: 12 }, // circuit breakers
  'psc-5':  { image: 'real',    x: 12, y: 10, w: 32, h: 22 }, // avionics
  'psc-6':  { image: 'real',    x: 2,  y: 20, w: 35, h: 42 }, // yoke
  'psc-7':  { image: 'real',    x: 48, y: 77, w: 12, h: 12 }, // fuel selector
  'sc-1':   { image: 'real',    x: 43, y: 42, w: 12, h: 12 }, // carb heat
  'sc-2':   { image: 'real',    x: 48, y: 43, w: 12, h: 12 }, // throttle
  'sc-3':   { image: 'real',    x: 54, y: 42, w: 12, h: 12 }, // mixture
  'sc-4':   { image: 'real',    x: 15, y: 47, w: 12, h: 12 }, // primer
  'sc-5':   { image: 'real',    x: 18, y: 65, w: 42, h: 16 }, // brakes
  'sc-6':   { image: 'real',    x: 17, y: 42, w: 12, h: 12 }, // master
  'sc-7':   { image: 'real',    x: 38, y: 42, w: 12, h: 12 }, // beacon
  'sc-9':   { image: 'real',    x: 22, y: 44, w: 12, h: 12 }, // magnetos
  'sc-10':  { image: 'real',    x: 48, y: 42, w: 12, h: 12 }, // throttle
  'sc-11':  { image: 'real',    x: 14, y: 24, w: 12, h: 12 }, // oil (on glass)
  'sc-12':  { image: 'real',    x: 16, y: 42, w: 12, h: 12 }, // master alt
  'sc-13':  { image: 'real',    x: 36, y: 31, w: 12, h: 12 }, // ammeter (on glass)
  'ptc-1':  { image: 'real',    x: 51, y: 42, w: 12, h: 12 }, // mixture
  'ptc-2':  { image: 'real',    x: 60, y: 45, w: 10, h: 10 }, // flaps
  'ptc-3':  { image: 'real',    x: 48, y: 15, w: 28, h: 18 }, // radio
  'ptc-4':  { image: 'real',    x: 52, y: 21, w: 12, h: 12 }, // transponder
  'ptc-5':  { image: 'real',    x: 37, y: 44, w: 12, h: 12 },
  'ptc-6':  { image: 'real',    x: 20, y: 43, w: 12, h: 12 }, // magnetos
  'ptc-7':  { image: 'real',    x: 47, y: 77, w: 12, h: 12 }, // fuel selector
  'ptc-8':  { image: 'real',    x: 48, y: 15, w: 28, h: 18 }, // ATIS/radio
  'ptc-9':  { image: 'real',    x: 10, y: 8,  w: 42, h: 30 }, // glass displays
  'ptc-10': { image: 'real',    x: 48, y: 15, w: 28, h: 18 }, // transponder
  'ptc-11': { image: 'real',    x: 2,  y: 20, w: 32, h: 42 }, // yoke
  'ptc-12': { image: 'real',    x: 18, y: 65, w: 42, h: 16 }, // brakes
  'ptc-13': { image: 'real',    x: 10, y: 8,  w: 42, h: 30 }, // glass displays
  'ruc-3':  { image: 'real',    x: 18, y: 65, w: 42, h: 16 },
  'ruc-4':  { image: 'real',    x: 47, y: 77, w: 12, h: 12 },
  'ruc-5':  { image: 'real',    x: 53, y: 42, w: 12, h: 12 },
  'ruc-6':  { image: 'real',    x: 13, y: 24, w: 12, h: 12 },
  'ruc-8':  { image: 'real',    x: 46, y: 38, w: 12, h: 12 },
  'ruc-9':  { image: 'real',    x: 13, y: 24, w: 12, h: 12 },
  'ruc-10': { image: 'real',    x: 12, y: 20, w: 12, h: 12 },
  'ruc-11': { image: 'real',    x: 12, y: 22, w: 12, h: 12 },
  'ruc-12': { image: 'real',    x: 44, y: 42, w: 12, h: 12 },
  'ruc-13': { image: 'real',    x: 20, y: 45, w: 12, h: 12 },
  'ruc-14': { image: 'real',    x: 42, y: 42, w: 12, h: 12 },
  'ruc-15': { image: 'real',    x: 23, y: 44, w: 12, h: 12 },
  'ruc-16': { image: 'real',    x: 41, y: 40, w: 12, h: 12 },
  'ruc-17': { image: 'real',    x: 47, y: 40, w: 12, h: 12 },
  'ruc-18': { image: 'real',    x: 48, y: 41, w: 12, h: 12 },
  'ruc-19': { image: 'real',    x: 44, y: 42, w: 12, h: 12 },
  'ptof-1': { image: 'real',    x: 16, y: 47, w: 12, h: 12 },
  'ptof-2': { image: 'real',    x: 23, y: 45, w: 12, h: 12 },
  'ptof-3': { image: 'diagram', x: 20, y: 42, w: 20, h: 10 },
  'ptof-4': { image: 'real',    x: 44, y: 43, w: 12, h: 12 },
  'ptof-5': { image: 'real',    x: 53, y: 41, w: 12, h: 12 },
  'ptof-6': { image: 'real',    x: 13, y: 24, w: 12, h: 12 },
  'ptof-7': { image: 'real',    x: 47, y: 77, w: 12, h: 12 },
  'ptof-8': { image: 'real',    x: 60, y: 45, w: 10, h: 10 },
  'ptof-9': { image: 'real',    x: 10, y: 8,  w: 42, h: 30 },
  'ptof-12':{ image: 'real',    x: 2,  y: 20, w: 32, h: 42 },
};

const HOTSPOTS_BY_AIRCRAFT: Record<string, AircraftHotspots> = {
  'C-GWTE': HOTSPOTS_GWTE,
  'C-FBZQ': HOTSPOTS_FBZQ,
  'C-GREI': HOTSPOTS_GREI,
  'C-GUZD': HOTSPOTS_GUZD,
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

const AIRCRAFT = [
  { id: 'C-FBZQ', type: 'Cessna 172' },
  { id: 'C-GREI', type: 'Cessna 172' },
  { id: 'C-GUZD', type: 'Cessna 172' },
  { id: 'C-GWTE', type: 'Cessna 172' },
];

const FlightChecklist: React.FC = () => {
  const calibrating = new URLSearchParams(window.location.search).get('calibrate') === '1';

  const categories = Object.keys(checklists);
  const [selectedAircraft, setSelectedAircraft] = useState<string | null>(null);
  const [catIndex, setCatIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('question');
  const [showHint, setShowHint] = useState(false);
  const [clickPos, setClickPos] = useState<{ x: number; y: number } | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [confirmReset, setConfirmReset] = useState(false);
  const [calibratePos, setCalibratePos] = useState<{ x: number; y: number } | null>(null);
  const [calibrateLog, setCalibrateLog] = useState<Record<string, { x: number; y: number }>>({});
  const [showCalibrateSummary, setShowCalibrateSummary] = useState(false);

  const category = categories[catIndex];
  const items = checklists[category];
  const item = items[itemIndex];
  const hotspotMap = HOTSPOTS_BY_AIRCRAFT[selectedAircraft ?? 'C-GWTE'] ?? {};
  const showMarkComplete = EXTERNAL_ZONES.has(item.zone) || !hotspotMap[item.id];
  const hotspot = hotspotMap[item.id];
  const usingDiagram = hotspot?.image === 'diagram';
  const imgSrc = usingDiagram
    ? `${import.meta.env.BASE_URL}C172 SP Cockpit.jpg`
    : `${import.meta.env.BASE_URL}${selectedAircraft}.jpg`;

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

  const handleCalibrateClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const py = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setCalibratePos({ x: px, y: py });
    setCalibrateLog(prev => ({ ...prev, [item.id]: { x: px, y: py } }));
  }, [item.id]);

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

  if (!selectedAircraft) {
    return (
      <div className="bg-slate-900 min-h-screen text-slate-100 flex flex-col max-w-2xl mx-auto">
        <div className="px-6 pt-10 pb-6 text-center">
          <h1 className="text-2xl font-bold text-sky-400 tracking-tight">C172 Cockpit Trainer</h1>
          <p className="text-slate-500 text-xs mt-1">Pacific Rim Aviation Academy</p>
          <p className="text-slate-300 text-base font-medium mt-8 mb-5">Which aircraft are you flying today?</p>
        </div>

        <div className="grid grid-cols-2 gap-4 px-4 pb-10">
          {AIRCRAFT.map(ac => (
            <button
              key={ac.id}
              onClick={() => setSelectedAircraft(ac.id)}
              className="group rounded-2xl overflow-hidden border border-slate-700 hover:border-sky-500 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-left shadow-lg shadow-black/30 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={`${import.meta.env.BASE_URL}${ac.id}.jpg`}
                  alt={ac.id}
                  className="w-full h-full object-cover object-top group-hover:brightness-110 transition-all duration-200"
                  draggable={false}
                />
              </div>
              <div className="bg-slate-800 group-hover:bg-slate-750 px-4 py-3 transition-colors">
                <p className="text-sky-400 font-bold text-lg tracking-widest">{ac.id}</p>
                <p className="text-slate-500 text-xs mt-0.5">{ac.type}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 flex flex-col max-w-2xl mx-auto">

      {/* Calibration banner */}
      {calibrating && (
        <div className="bg-yellow-500 text-slate-900 text-center text-xs font-bold py-1.5 tracking-widest uppercase">
          Calibration Mode — tap any control to read its coordinates
        </div>
      )}

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
                    onClick={() => { setSelectedAircraft(null); setConfirmReset(false); setCatIndex(0); setItemIndex(0); setPhase('question'); }}
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
        calibrating && showCalibrateSummary ? (
          /* Calibration summary screen */
          <div className="flex-1 flex flex-col p-4 gap-3 overflow-y-auto">
            <div className="text-center">
              <h2 className="text-lg font-bold text-yellow-400">Calibration Log — {selectedAircraft}</h2>
              <p className="text-slate-500 text-xs mt-0.5">{Object.keys(calibrateLog).length} items tapped — select all and copy</p>
            </div>
            <textarea
              readOnly
              className="flex-1 min-h-[60vh] rounded-xl border border-yellow-500/30 bg-slate-800 text-yellow-200 font-mono text-[11px] p-3 resize-none focus:outline-none focus:ring-1 focus:ring-yellow-500 select-all"
              value={Object.entries(calibrateLog)
                .map(([id, pos]) => `  '${id}': { image: 'real', x: ${pos.x}, y: ${pos.y}, w: 12, h: 12 },`)
                .join('\n')}
              onClick={e => (e.target as HTMLTextAreaElement).select()}
            />
            <div className="flex gap-3">
              {catIndex < categories.length - 1 && (
                <button
                  onClick={() => { setShowCalibrateSummary(false); selectCategory(catIndex + 1); }}
                  className="flex-1 px-4 py-2.5 bg-yellow-600 hover:bg-yellow-500 rounded-lg font-bold text-sm text-slate-900 transition-colors"
                >
                  Next: {categories[catIndex + 1]}
                </button>
              )}
              <button
                onClick={() => setShowCalibrateSummary(false)}
                className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold text-sm transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8 text-center">
          <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-2xl font-bold ${
            calibrating
              ? 'bg-yellow-900/50 border-yellow-500 text-yellow-400'
              : 'bg-emerald-900/50 border-emerald-500 text-emerald-400'
          }`}>
            {calibrating ? '📋' : '✓'}
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${calibrating ? 'text-yellow-400' : 'text-emerald-400'}`}>
              {calibrating ? 'Section Done' : 'Checklist Complete'}
            </h2>
            <p className="text-slate-400 mt-1 text-sm">
              {category} — {calibrating ? `${Object.keys(calibrateLog).length} coordinates logged` : `all ${items.length} items verified`}
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            {calibrating && (
              <button
                onClick={() => setShowCalibrateSummary(true)}
                className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 rounded-lg font-bold text-sm text-slate-900 transition-colors"
              >
                View all coordinates
              </button>
            )}
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
              {calibrating ? 'Redo section' : 'Retry'}
            </button>
          </div>
        </div>
        )
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
            {showMarkComplete && !calibrating ? (
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
                {usingDiagram && !calibrating && (
                  <p className="text-amber-400/70 text-[11px] mb-1.5 text-center tracking-wide">
                    Control obstructed in aircraft photo — showing diagram
                  </p>
                )}

                <div
                  className="relative select-none cursor-crosshair rounded-xl overflow-hidden border border-slate-700"
                  onClick={calibrating ? handleCalibrateClick : handleClick}
                >
                  <img
                    key={imgSrc}
                    src={`${import.meta.env.BASE_URL}${selectedAircraft}.jpg`}
                    alt={`${selectedAircraft} Cockpit`}
                    className="w-full block"
                    draggable={false}
                  />

                  {/* Hotspot overlay — hint or correct flash */}
                  {hotspot && (showHint || phase === 'correct') && !calibrating && (
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

                  {/* Calibration: existing hotspot reference box */}
                  {calibrating && hotspot && (
                    <div
                      className="absolute pointer-events-none rounded border-2 border-yellow-400 bg-yellow-400/10"
                      style={{
                        left:   `${hotspot.x}%`,
                        top:    `${hotspot.y}%`,
                        width:  `${hotspot.w}%`,
                        height: `${hotspot.h}%`,
                      }}
                    >
                      <span className="absolute top-0.5 left-0.5 text-[8px] font-bold text-yellow-300 bg-slate-900/80 px-0.5 rounded leading-none whitespace-nowrap">
                        current
                      </span>
                    </div>
                  )}

                  {/* Calibration: tap box (12×12 default size) */}
                  {calibrating && calibratePos && (
                    <div
                      className="absolute pointer-events-none rounded border-2 border-rose-400 bg-rose-400/20"
                      style={{
                        left:   `${calibratePos.x}%`,
                        top:    `${calibratePos.y}%`,
                        width:  '12%',
                        height: '12%',
                      }}
                    >
                      <span className="absolute top-0.5 left-0.5 text-[8px] font-bold text-rose-300 bg-slate-900/80 px-0.5 rounded leading-none whitespace-nowrap">
                        new
                      </span>
                    </div>
                  )}

                  {/* Wrong-click ripple */}
                  {clickPos && phase === 'incorrect' && !calibrating && (
                    <div
                      className="absolute w-8 h-8 rounded-full border-2 border-rose-400 bg-rose-400/20 pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-ping"
                      style={{ left: `${clickPos.x}%`, top: `${clickPos.y}%` }}
                    />
                  )}
                </div>

                {/* Calibration readout */}
                {calibrating && (
                  <div className="mt-2 rounded-lg border border-yellow-500/40 bg-yellow-950/30 p-3 text-xs font-mono space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-yellow-400 font-bold">{item.id} — {item.task}</p>
                      <span className="text-[10px] text-slate-500">{Object.keys(calibrateLog).length} logged</span>
                    </div>
                    {calibratePos ? (
                      <>
                        <p className="text-yellow-200">tap: x={calibratePos.x}, y={calibratePos.y}</p>
                        <p className="text-slate-400 text-[10px] break-all select-all">
                          {`'${item.id}': { image: 'real', x: ${calibratePos.x}, y: ${calibratePos.y}, w: 12, h: 12 },`}
                        </p>
                      </>
                    ) : (
                      <p className="text-slate-500 italic">Tap the control in the image above</p>
                    )}
                  </div>
                )}

                {!calibrating && (
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
                )}

                {calibrating && (
                  <button
                    onClick={() => { setCalibratePos(null); advance(); }}
                    className="mt-2 w-full py-2 rounded-lg text-xs font-medium border border-slate-600 bg-slate-800/50 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Next item →
                  </button>
                )}
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
