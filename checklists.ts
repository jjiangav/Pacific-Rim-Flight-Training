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
  "Pre-Flight Inspection": [
    { id: "pfi-3",  task: "Control Lock",                   action: "REMOVE",                  zone: "yoke"         },
    { id: "pfi-4",  task: "Trim",                           action: "CONFIRM FUNCTION",        zone: "pedestal"     },
    { id: "pfi-5",  task: "Avionics & Electrics",           action: "OFF (Except Beacon)",     zone: "left-panel"   },
    { id: "pfi-6",  task: "Master / Battery Side",          action: "ON",                      zone: "left-panel"   },
    { id: "pfi-7",  task: "Flaps",                          action: "DOWN",                    zone: "left-panel"   },
    { id: "pfi-8",  task: "Fuel Gauges",                    action: "CONFIRM FUNCTION",        zone: "main-panel"   },
    { id: "pfi-9",  task: "All Interior & Exterior Lights", action: "CHECK AS REQUIRED",       zone: "left-panel"   },
    { id: "pfi-10", task: "Master / Battery Side",          action: "DIP TANKS & SECURE CAPS", zone: "walkaround"   },
    { id: "pfi-11", task: "Fuel Quantity",                  action: "CLEAR & BRIGHT",          zone: "walkaround"   },
    { id: "pfi-12", task: "Fuel",                           action: "CONFIRM 7 QUARTS",        zone: "walkaround"   },
    { id: "pfi-13", task: "Oil Quantity",                   action: "CHECK",                   zone: "walkaround"   },
    { id: "pfi-14", task: "Exterior Inspection",            action: "COMPLETE",                zone: "walkaround"   },
  ],
  "Pre-Start Check": [
    { id: "psc-1", task: "Hobbs Time",                  action: "RECORD",          zone: "main-panel"  },
    { id: "psc-2", task: "Loose Articles",              action: "SECURE",          zone: "cabin"       },
    { id: "psc-3", task: "Seat Belts / Harnesses / Doors", action: "SECURE",      zone: "cabin"       },
    { id: "psc-4", task: "Circuit Breakers",            action: "IN",             zone: "right-panel" },
    { id: "psc-5", task: "Avionics & Electrics",        action: "OFF",            zone: "left-panel"  },
    { id: "psc-6", task: "Controls",                    action: "FREE & CORRECT", zone: "yoke"        },
    { id: "psc-7", task: "Fuel",                        action: "LEFT TANK",      zone: "pedestal"    },
  ],
  "Start Check": [
    { id: "sc-1",  task: "Carb Heat",              action: "COLD",                    zone: "center-panel" },
    { id: "sc-2",  task: "Throttle / Friction Lock",action: "SET (1/8 INCH OPEN)",   zone: "center-panel" },
    { id: "sc-3",  task: "Mixture",                action: "RICH",                    zone: "center-panel" },
    { id: "sc-4",  task: "Prime",                  action: "AS REQUIRED",             zone: "left-panel"   },
    { id: "sc-5",  task: "Brakes",                 action: "TEST & SET",              zone: "floor"        },
    { id: "sc-6",  task: "Master / Battery Side",  action: "ON",                      zone: "left-panel"   },
    { id: "sc-7",  task: "Beacon Light",           action: "CHECK ON",                zone: "left-panel"   },
    { id: "sc-8",  task: "Prop and Area",          action: "CLEAR ALL QUADRANTS",     zone: "external"     },
    { id: "sc-9",  task: "Magnetos",               action: "START",                   zone: "left-panel"   },
    { id: "sc-10", task: "Throttle",               action: "1000 RPM",                zone: "center-panel" },
    { id: "sc-11", task: "Oil Pressure",           action: "NORMAL (within 30 sec)", zone: "main-panel"   },
    { id: "sc-12", task: "Master / Alternator Side",action: "ON",                    zone: "left-panel"   },
    { id: "sc-13", task: "Ammeter",                action: "CHARGING",                zone: "main-panel"   },
  ],
  "Pre-Taxi Check": [
    { id: "ptc-1",  task: "Mixture",                      action: "GROUND LEAN 1 INCH",  zone: "center-panel" },
    { id: "ptc-2",  task: "Flaps",                        action: "UP & CONFIRM",        zone: "left-panel"   },
    { id: "ptc-3",  task: "Radio",                        action: "ON",                  zone: "main-panel"   },
    { id: "ptc-4",  task: "Transponder",                  action: "STANDBY",             zone: "main-panel"   },
    { id: "ptc-5",  task: "Lights",                       action: "AS REQUIRED",         zone: "left-panel"   },
    { id: "ptc-6",  task: "Dead Mag Check",               action: "BOTH-LEFT-RIGHT-BOTH",zone: "left-panel"   },
    { id: "ptc-7",  task: "Fuel",                         action: "RIGHT TANK",          zone: "pedestal"     },
    { id: "ptc-8",  task: "ATIS",                         action: "OBTAIN",              zone: "main-panel"   },
    { id: "ptc-9",  task: "Instruments",                  action: "CHECK & SET",         zone: "main-panel"   },
    { id: "ptc-10", task: "Taxi Clearance / Transponder", action: "OBTAIN & SET CODE",   zone: "main-panel"   },
    { id: "ptc-11", task: "Controls",                     action: "WIND CORRECTION",     zone: "yoke"         },
    { id: "ptc-12", task: "Brakes",                       action: "TEST",                zone: "floor"        },
    { id: "ptc-13", task: "Instruments",                  action: "CHECK DURING TAXI",   zone: "main-panel"   },
  ],
  "Run-Up Check": [
    { id: "ruc-1",  task: "Aircraft",                action: "INTO WIND",               zone: "external"     },
    { id: "ruc-2",  task: "Nose Wheel",              action: "STRAIGHT",                zone: "external"     },
    { id: "ruc-3",  task: "Brakes",                  action: "ON",                      zone: "floor"        },
    { id: "ruc-4",  task: "Fuel",                    action: "BOTH TANKS",              zone: "pedestal"     },
    { id: "ruc-5",  task: "Mixture",                 action: "RICH",                    zone: "center-panel" },
    { id: "ruc-6",  task: "Oil Pressure / Temperature", action: "CLEAR ALL QUADRANTS",  zone: "main-panel"   },
    { id: "ruc-7",  task: "Area",                    action: "CLEAR",                   zone: "external"     },
    { id: "ruc-8",  task: "Throttle",                action: "1700 RPM",                zone: "center-panel" },
    { id: "ruc-9",  task: "Oil Pressure",            action: "GREEN",                   zone: "main-panel"   },
    { id: "ruc-10", task: "Oil Temperature",         action: "NORMAL",                  zone: "main-panel"   },
    { id: "ruc-11", task: "Suction",                 action: "GREEN (4.6–5.4)",         zone: "main-panel"   },
    { id: "ruc-12", task: "Carb Heat",               action: "HOT (RPM; ICE?)",         zone: "center-panel" },
    { id: "ruc-13", task: "Mixture",                 action: "CONFIRM FUNCTION",        zone: "center-panel" },
    { id: "ruc-14", task: "Carb Heat",               action: "COLD",                    zone: "center-panel" },
    { id: "ruc-15", task: "Magnetos",                action: "BOTH-LEFT-BOTH-RIGHT-BOTH", zone: "left-panel" },
    { id: "ruc-16", task: "Carb Heat",               action: "HOT",                     zone: "center-panel" },
    { id: "ruc-17", task: "Throttle",                action: "IDLE CHECK (500–700 rpm)",zone: "center-panel" },
    { id: "ruc-18", task: "Throttle",                action: "1000 RPM",                zone: "center-panel" },
    { id: "ruc-19", task: "Carb Heat",               action: "COLD",                    zone: "center-panel" },
  ],
  "Pre-Takeoff Check": [
    { id: "ptof-1",  task: "Primer",                   action: "IN & LOCKED",           zone: "left-panel"   },
    { id: "ptof-2",  task: "Masters / Magnetos",       action: "ON / BOTH",             zone: "left-panel"   },
    { id: "ptof-3",  task: "Circuit Breakers",         action: "IN",                    zone: "right-panel"  },
    { id: "ptof-4",  task: "Carb Heat",                action: "COLD",                  zone: "center-panel" },
    { id: "ptof-5",  task: "Mixture",                  action: "AS REQUIRED",           zone: "center-panel" },
    { id: "ptof-6",  task: "Oil Pressure / Temperature",action: "NORMAL",               zone: "main-panel"   },
    { id: "ptof-7",  task: "Fuel",                     action: "ON BOTH / SUFFICIENT",  zone: "pedestal"     },
    { id: "ptof-8",  task: "Trim & Flaps",             action: "CHECK / SET AS REQUIRED",zone: "left-panel"  },
    { id: "ptof-9",  task: "Instruments",              action: "CHECK & SET",           zone: "main-panel"   },
    { id: "ptof-10", task: "Doors / Windows",          action: "SECURE",                zone: "cabin"        },
    { id: "ptof-11", task: "Seat Belts / Harnesses",   action: "SECURE",                zone: "cabin"        },
    { id: "ptof-12", task: "Controls",                 action: "FREE",                  zone: "yoke"         },
    { id: "ptof-13", task: "Wind Sock",                action: "CONFIRM DIRECTION",     zone: "external"     },
  ],
};
