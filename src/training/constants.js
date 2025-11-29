// Replace TypeScript enums with plain JS objects
export const ComponentType = {
  BUSBAR: "BUSBAR",
  ISOLATOR: "ISOLATOR",
  BREAKER: "BREAKER",
  LINE: "LINE",
  GROUND: "GROUND",
};

export const ComponentState = {
  OPEN: "OPEN",
  CLOSED: "CLOSED",
};

// A simplified 400kV Bay setup (Double Busbar arrangement)
export const INITIAL_SUBSTATION_NODES = [
  {
    id: "BUS-A",
    name: "400kV Bus A",
    type: ComponentType.BUSBAR,
    state: ComponentState.CLOSED,
    voltageKv: 400,
    isEnergized: true,
    connectedTo: ["ISO-A-1"],
  },
  {
    id: "BUS-B",
    name: "400kV Bus B",
    type: ComponentType.BUSBAR,
    state: ComponentState.CLOSED,
    voltageKv: 400,
    isEnergized: true,
    connectedTo: ["ISO-B-1"],
  },

  // BAY 1 - LINE FEEDER
  {
    id: "ISO-A-1",
    name: "Bus A Isolator (89A)",
    type: ComponentType.ISOLATOR,
    state: ComponentState.CLOSED,
    voltageKv: 400,
    isEnergized: true,
    connectedTo: ["BUS-A", "CB-1"],
    interlocks: {
      requiredOpen: ["CB-1", "ISO-B-1"],
    },
  },
  {
    id: "ISO-B-1",
    name: "Bus B Isolator (89B)",
    type: ComponentType.ISOLATOR,
    state: ComponentState.OPEN,
    voltageKv: 400,
    isEnergized: false,
    connectedTo: ["BUS-B", "CB-1"],
    interlocks: {
      requiredOpen: ["CB-1", "ISO-A-1"],
    },
  },
  {
    id: "CB-1",
    name: "Circuit Breaker (52)",
    type: ComponentType.BREAKER,
    state: ComponentState.CLOSED,
    voltageKv: 400,
    isEnergized: true,
    connectedTo: ["ISO-A-1", "ISO-B-1", "ISO-L-1"],
  },
  {
    id: "ISO-L-1",
    name: "Line Isolator (89L)",
    type: ComponentType.ISOLATOR,
    state: ComponentState.CLOSED,
    voltageKv: 400,
    isEnergized: true,
    connectedTo: ["CB-1", "LINE-1"],
    interlocks: {
      requiredOpen: ["CB-1", "ES-1"],
    },
  },
  {
    id: "LINE-1",
    name: "Feeder Line 1",
    type: ComponentType.LINE,
    state: ComponentState.CLOSED,
    voltageKv: 400,
    isEnergized: true,
    connectedTo: ["ISO-L-1"],
  },
  {
    id: "ES-1",
    name: "Earth Switch (ES)",
    type: ComponentType.GROUND,
    state: ComponentState.OPEN,
    voltageKv: 0,
    isEnergized: false,
    connectedTo: ["LINE-1"],
    interlocks: {
      requiredOpen: ["ISO-L-1"],
    },
  },
];

export const SCENARIOS = [
  {
    id: "sc-1",
    title: "Bus Changeover Routine",
    description: "Transfer load from Bus A to Bus B without interrupting supply.",
    difficulty: "Intermediate",
  },
  {
    id: "sc-2",
    title: "Line Fault Clearance",
    description: "Diagnose and isolate a permanent fault on Line 1.",
    difficulty: "Advanced",
    initialFaults: ["LINE-1"],
  },
  {
    id: "sc-3",
    title: "Maintenance Isolation",
    description: "Safely isolate Circuit Breaker 52 for scheduled maintenance.",
    difficulty: "Beginner",
  },
];
