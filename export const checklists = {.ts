export const checklists = {
  "Pre-Engine Start": [
    { id: "pre-1", task: "Preflight Inspection", action: "COMPLETE", zone: "walkaround" },
    { id: "pre-2", task: "Passenger Briefing", action: "COMPLETED", zone: "cabin" },
    { id: "pre-3", task: "Seats and Seat Belts", action: "ADJUSTED & LOCKED", zone: "cabin" },
    { id: "pre-4", task: "Fuel Selector Valve", action: "BOTH", zone: "pedestal" },
    { id: "pre-5", task: "Circuit Breakers", action: "CHECK IN", zone: "right-panel" },
    { id: "pre-6", task: "Brakes", action: "TEST & HOLD", zone: "floor" },
  ],
  "Engine Start": [
    { id: "start-1", task: "Mixture", action: "RICH", zone: "center-panel" },
    { id: "start-2", task: "Throttle", action: "OPEN 1/4 INCH", zone: "center-panel" },
    { id: "start-3", task: "Master Switch", action: "ON", zone: "left-panel" },
    { id: "start-4", task: "Beacon", action: "ON", zone: "left-panel" },
    { id: "start-5", task: "Propeller Area", action: "CLEAR", zone: "external" },
    { id: "start-6", task: "Ignition Switch", action: "START", zone: "left-panel" },
  ],
  "Before Take-off": [
    { id: "to-1", task: "Parking Brake", action: "SET", zone: "floor" },
    { id: "to-2", task: "Flight Controls", action: "FREE & CORRECT", zone: "yoke" },
    { id: "to-3", task: "Flight Instruments", action: "CHECK & SET", zone: "main-panel" },
    { id: "to-4", task: "Fuel Quantity", action: "CHECK", zone: "main-panel" },
    { id: "to-5", task: "Mixture", action: "RICH", zone: "center-panel" },
  ]
};
