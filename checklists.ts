export type CockpitZone =
  | "walkaround"
  | "cabin"
  | "pedestal"
  | "right-panel"
  | "floor"
  | "center-panel"
  | "left-panel"
  | "external"
  | "yoke"
  | "main-panel";

export interface ChecklistItem {
  id: string;
  task: string;
  action: string;
  zone: CockpitZone;
}

export interface ChecklistData {
  [category: string]: ChecklistItem[];
}

export const checklists: ChecklistData = {
  "Pre-Start Check": [
    { id: "pre-1", task: "Fire Extinguisher",    action: "CHARGED & SECURE",  zone: "cabin"       },
    { id: "pre-2", task: "Fuel Selector Valve",  action: "BOTH",              zone: "pedestal"    },
    { id: "pre-3", task: "Seats & Seatbelts",    action: "ADJUSTED & LOCKED", zone: "cabin"       },
    { id: "pre-4", task: "Circuit Breakers",     action: "CHECK IN",          zone: "right-panel" },
    { id: "pre-5", task: "Brakes",               action: "TEST & HOLD",       zone: "floor"       },
  ],
  "Start Check": [
    { id: "start-1", task: "Mixture",        action: "RICH",          zone: "center-panel" },
    { id: "start-2", task: "Throttle",       action: "OPEN 1/4 INCH", zone: "center-panel" },
    { id: "start-3", task: "Master Switch",  action: "ON",            zone: "left-panel"   },
    { id: "start-4", task: "Beacon",         action: "ON",            zone: "left-panel"   },
    { id: "start-5", task: "Propeller Area", action: "CLEAR",         zone: "external"     },
    { id: "start-6", task: "Ignition Switch",action: "START",         zone: "left-panel"   },
  ],
  "Before Take-off": [
    { id: "to-1", task: "Parking Brake",       action: "SET",             zone: "floor"        },
    { id: "to-2", task: "Flight Controls",     action: "FREE & CORRECT",  zone: "yoke"         },
    { id: "to-3", task: "Flight Instruments",  action: "CHECK & SET",     zone: "main-panel"   },
    { id: "to-4", task: "Fuel Quantity",       action: "CHECK",           zone: "main-panel"   },
    { id: "to-5", task: "Mixture",             action: "RICH",            zone: "center-panel" },
  ]
};
