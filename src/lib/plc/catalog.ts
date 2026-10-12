export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type PlcSignal = {
  name: string;
  address: string;
  kind: "input" | "output";
  dataType: "BOOL" | "INT";
  description: string;
  initialValue: boolean | number;
  required: boolean;
};

export type Challenge = {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  summary: string;
  objective: string;
  estimatedMinutes: number;
  publicTestCount: number;
  extraTestCount: number;
  hiddenTestCount: number;
  instructions: string[];
  signals: PlcSignal[];
};

type ChallengeSeed = [string, string, string, string[], string[], string[]];

const seeds: ChallengeSeed[] = [
  ["Motor Start/Stop Control", "Motor Control", "Build a seal-in circuit that starts a motor, stops on demand, and drops out safely on emergency stop.", ["Start pushbutton", "Stop pushbutton", "Emergency stop"], ["Motor contactor"], ["NO", "NC", "Coil"]],
  ["Dual Pushbutton Lamp Control", "Sensors", "Turn a pilot lamp on only while both operator pushbuttons are pressed.", ["Pushbutton A", "Pushbutton B"], ["Pilot lamp"], ["NO", "Coil"]],
  ["AND/OR Logic Trainer", "Sensors", "Combine series and parallel conditions to control a status lamp.", ["Input A", "Input B", "Input C"], ["Logic output"], ["NO", "NC", "Coil"]],
  ["Emergency-Stop Logic Demonstrator", "Safety Interlocks", "Remove the machine-enable output whenever the emergency circuit opens.", ["Run request", "Emergency stop"], ["Machine enable", "Trip indicator"], ["NO", "NC", "Coil"]],
  ["Run/Stop Status Indicators", "Motor Control", "Show distinct running and stopped states from the motor command.", ["Run request", "Stop request"], ["Running lamp", "Stopped lamp"], ["NO", "NC", "Coil"]],
  ["Conveyor Start/Stop", "Conveyors", "Create a maintained conveyor run command with a direct stop condition.", ["Start button", "Stop button"], ["Conveyor motor"], ["NO", "NC", "Coil"]],
  ["Forward/Reverse Interlock", "Motor Control", "Prevent forward and reverse contactors from being energized together.", ["Forward request", "Reverse request", "Forward feedback", "Reverse feedback"], ["Forward contactor", "Reverse contactor"], ["NO", "NC", "Coil"]],
  ["Door-Open Motor Interlock", "Safety Interlocks", "Permit motor operation only with the guard closed and a run request active.", ["Run request", "Guard closed"], ["Motor contactor"], ["NO", "Coil"]],
  ["Pump Manual Control", "Process Control", "Control a pump manually while honoring the stop and low-level permissives.", ["Run request", "Stop request", "Low-level permissive"], ["Pump contactor"], ["NO", "NC", "Coil"]],
  ["Three-State Machine Indicator", "Sequencing", "Indicate stopped, running, or faulted machine states without ambiguous outputs.", ["Run feedback", "Fault input"], ["Stopped lamp", "Running lamp", "Fault lamp"], ["NO", "NC", "Coil"]],
  ["Object Detection Indicator", "Sensors", "Drive an indicator from a photoeye without retaining a stale detection state.", ["Photoeye"], ["Object lamp"], ["NO", "Coil"]],
  ["Two-Condition Start Permission", "Safety Interlocks", "Allow a start only when the process-ready and guard-closed permissives are true.", ["Start button", "Process ready", "Guard closed"], ["Machine enable"], ["NO", "Coil"]],
  ["Pneumatic Cylinder Control", "Sequencing", "Extend a cylinder on a command and retract it when the command is removed.", ["Extend command", "Retracted limit", "Extended limit"], ["Extend valve", "Retract valve"], ["NO", "NC", "Coil"]],
  ["Alarm Latch and Reset", "Fault Diagnosis", "Latch an alarm condition and clear it only after an operator reset.", ["Fault input", "Reset button"], ["Alarm output"], ["NO", "Set", "Reset"]],
  ["Product Detection Counter", "Counters", "Count product sensor events and indicate when a small target batch is reached.", ["Product sensor", "Counter reset"], ["Batch complete"], ["Rising edge", "CTU", "Reset"]],
  ["Delayed Motor Start", "Timers", "Delay a motor start until a valid run request remains present for the preset time.", ["Run request", "Stop request"], ["Motor contactor"], ["NO", "NC", "TON", "Coil"]],
  ["Fan Off-Delay", "Timers", "Keep an extraction fan running for a preset interval after the process stops.", ["Process running"], ["Extraction fan"], ["NO", "TOF", "Coil"]],
  ["Flashing Warning Beacon", "Timers", "Flash a warning beacon at a repeatable virtual interval while a warning is active.", ["Warning active"], ["Beacon"], ["TON", "TP", "Coil"]],
  ["Traffic Light Sequencer", "Sequencing", "Sequence red, green, and amber lamps with defined timing and safe all-red transitions.", ["Sequence start", "Stop request"], ["Red lamp", "Amber lamp", "Green lamp"], ["TON", "Coil"]],
  ["Conveyor Product Counter", "Counters", "Count items on a conveyor and stop it at the configured batch size.", ["Start button", "Stop button", "Product sensor", "Reset button"], ["Conveyor motor", "Batch complete"], ["Rising edge", "CTU", "NO", "NC"]],
  ["Two-Conveyor Coordination", "Conveyors", "Start downstream equipment first and stop upstream feed when the downstream conveyor is unavailable.", ["Start request", "Downstream ready", "Jam sensor"], ["Upstream motor", "Downstream motor"], ["NO", "NC", "TON"]],
  ["Water Tank Fill Control", "Process Control", "Start filling at low level and stop at high level with hysteresis.", ["Low-level switch", "High-level switch", "Overflow switch"], ["Inlet valve", "High-level alarm"], ["NO", "NC", "Set", "Reset"]],
  ["Automatic Bottle Filling", "Process Control", "Index a bottle, open the fill valve, and stop filling when the level sensor is reached.", ["Bottle present", "Fill level reached", "Cycle start"], ["Index motor", "Fill valve"], ["NO", "TON", "Coil"]],
  ["Temperature-Controlled Fan", "Process Control", "Start cooling above the high temperature setpoint and stop below the low setpoint.", ["Temperature process value", "Fan fault"], ["Cooling fan", "Temperature alarm"], ["Analog compare", "Set", "Reset"]],
  ["Automatic Stamping Machine", "Sequencing", "Run a guarded press cycle and return to its home position before accepting another cycle.", ["Cycle start", "Guard closed", "Home limit", "Press limit"], ["Press solenoid", "Cycle complete"], ["NO", "NC", "TON"]],
  ["Product Sorting System", "Sensors", "Detect product type and actuate the matching diverter for a timed pulse.", ["Product present", "Type sensor", "Diverter home"], ["Reject diverter", "Accept diverter"], ["Rising edge", "TP", "Coil"]],
  ["Two-Floor Elevator", "Sequencing", "Move between two floors, stop at the selected limit, and prevent conflicting travel commands.", ["Floor one call", "Floor two call", "Floor one limit", "Floor two limit"], ["Up contactor", "Down contactor", "Door unlock"], ["NO", "NC", "Set", "Reset"]],
  ["Automatic Car Wash Sequence", "Sequencing", "Sequence wash, rinse, and dry stages only while a vehicle is present.", ["Vehicle present", "Cycle start", "Wash complete", "Rinse complete"], ["Wash pump", "Rinse valve", "Dryer"], ["TON", "NO", "Coil"]],
  ["Batch Mixing Process", "Process Control", "Fill, mix for a timed duration, and discharge a batch in order.", ["Batch start", "High level", "Mix complete", "Tank empty"], ["Inlet valve", "Mixer motor", "Discharge valve"], ["TON", "Set", "Reset"]],
  ["Alternating Dual Pumps", "Process Control", "Alternate lead pump assignment each time a duty cycle completes.", ["Demand active", "Lead pump fault", "Lag pump fault"], ["Pump A", "Pump B", "Pump fault alarm"], ["Set", "Reset", "NO", "NC"]],
  ["Automatic Drilling Machine", "Sequencing", "Advance a guarded drilling cycle and retract on depth reached or timeout.", ["Cycle start", "Guard closed", "Depth reached", "Retracted limit"], ["Drill motor", "Feed valve", "Cycle alarm"], ["TON", "NO", "NC"]],
  ["Bottle Capping Station", "Sequencing", "Clamp a detected bottle, run the capper for a timed cycle, and release it.", ["Bottle present", "Clamp confirmed", "Cap complete"], ["Clamp solenoid", "Capper motor", "Release gate"], ["TON", "NO", "Coil"]],
  ["Automatic Parking Barrier", "Safety Interlocks", "Raise the barrier for a vehicle and prevent lowering while the safety loop is occupied.", ["Vehicle detected", "Barrier up limit", "Barrier down limit", "Safety loop clear"], ["Raise motor", "Lower motor"], ["NO", "NC", "TON"]],
  ["Pressure Monitoring and Alarm", "Process Control", "Compare pressure with alarm thresholds and latch a high-pressure alarm until reset.", ["Pressure process value", "Operator reset"], ["Pressure alarm", "Relief valve"], ["Analog compare", "Set", "Reset"]],
  ["Production Batch Completion", "Counters", "Count completed units, stop the line at target, and reset for a new batch.", ["Product complete pulse", "Batch reset", "Line start"], ["Line motor", "Batch complete"], ["Rising edge", "CTU", "Reset"]],
  ["Star-Delta Starter Simulator", "Motor Control", "Transition from star to delta after a safe timed startup, with electrical and mechanical interlocks.", ["Start request", "Stop request", "Motor overload", "Star feedback", "Delta feedback"], ["Main contactor", "Star contactor", "Delta contactor"], ["TON", "NO", "NC"]],
  ["Conveyor Jam Detection", "Fault Diagnosis", "Detect a stalled belt when the drive is on but no product movement is seen before timeout.", ["Conveyor running", "Movement sensor", "Jam reset"], ["Conveyor motor", "Jam alarm"], ["TON", "Set", "Reset"]],
  ["Robotic Pick-and-Place Sequence", "Sequencing", "Execute a guarded pick, transfer, and place sequence with position confirmation at each stage.", ["Cycle start", "Pick position", "Part gripped", "Place position"], ["Robot pick command", "Robot transfer command", "Robot release command"], ["NO", "TON", "Set", "Reset"]],
  ["Multi-Station Material Transfer", "Conveyors", "Coordinate a transfer across stations while honoring downstream-ready and station-full handshakes.", ["Transfer request", "Station one full", "Station two ready", "Transfer complete"], ["Transfer conveyor", "Station one gate", "Transfer fault"], ["NO", "NC", "TON"]],
  ["Wastewater Level and Pump Control", "Process Control", "Stage pumps by level, alternate lead duty, and alarm on high-high level.", ["Low level", "High level", "High-high level", "Pump A fault", "Pump B fault"], ["Pump A", "Pump B", "High-high alarm"], ["Set", "Reset", "NO", "NC"]],
  ["Multi-Ingredient Batch Mixer", "Process Control", "Dose three ingredients in order, verify weights, then mix for the required duration.", ["Batch start", "Ingredient A ready", "Ingredient B ready", "Ingredient C ready", "Target weight reached"], ["Ingredient A valve", "Ingredient B valve", "Ingredient C valve", "Mixer motor"], ["TON", "Analog compare", "Set", "Reset"]],
  ["Quality Inspection and Rejection", "Sensors", "Inspect each item, track quality state, and divert failed pieces at the reject station.", ["Inspection trigger", "Quality pass", "Reject station sensor", "Diverter home"], ["Reject diverter", "Reject counter pulse", "Inspection alarm"], ["Rising edge", "CTU", "TP"]],
  ["Multi-Parameter Process Interlock", "Safety Interlocks", "Permit process output only while temperature, pressure, level, and safety permissives remain valid.", ["Temperature process value", "Pressure process value", "Level process value", "Guard closed", "Emergency stop"], ["Process enable", "Interlock alarm"], ["Analog compare", "NO", "NC", "Coil"]],
  ["Sensor Fault Diagnosis and Recovery", "Fault Diagnosis", "Detect disagreeing or stale sensors, enter a safe state, and require a verified reset.", ["Primary sensor", "Backup sensor", "Sensor health", "Operator reset"], ["Process enable", "Sensor fault alarm", "Recovery ready"], ["TON", "Set", "Reset", "NC"]],
  ["Primary/Standby Equipment Changeover", "Fault Diagnosis", "Transfer the duty command to standby equipment after a primary fault and verify recovery conditions.", ["Demand active", "Primary fault", "Standby fault", "Primary healthy"], ["Primary equipment", "Standby equipment", "Changeover alarm"], ["Set", "Reset", "NO", "NC"]],
  ["Production Line Bottleneck Management", "Smart Factory", "Control buffer release based on downstream capacity and detect a persistent line bottleneck.", ["Line demand", "Buffer high", "Downstream blocked", "Flow sensor"], ["Upstream feed", "Buffer release", "Bottleneck alarm"], ["TON", "CTU", "NO", "NC"]],
  ["Product Tracking and Timed Sorting", "Sequencing", "Track a product to a downstream sorting point and actuate the correct timed diverter.", ["Entry sensor", "Sort sensor", "Product class bit", "Diverter home"], ["Reject diverter", "Accept diverter", "Tracking fault"], ["Rising edge", "TON", "TP", "Set"]],
  ["Runtime and Maintenance Alert", "Smart Factory", "Track equipment run hours and assert a maintenance alert at the configured service interval.", ["Motor running", "Maintenance reset"], ["Maintenance alert", "Runtime pulse"], ["CTU", "Rising edge", "Set", "Reset"]],
  ["Fault Recovery and Restart Management", "Fault Diagnosis", "Latch faults, prevent automatic restart, and require clear permissives plus operator acknowledgement.", ["Fault input", "Safety loop healthy", "Restart request", "Operator reset"], ["Machine enable", "Fault latched", "Restart permitted"], ["Set", "Reset", "NO", "NC"]],
  ["Integrated Smart Factory Challenge", "Smart Factory", "Coordinate a monitored production cell with traceable count, process interlocks, and fault recovery.", ["Production request", "Part present", "Quality pass", "Guard closed", "Cell fault"], ["Cell motor", "Reject actuator", "Batch complete", "Cell alarm"], ["NO", "NC", "TON", "CTU", "Set", "Reset"]],
];

const digitalInputAddresses = Array.from({ length: 16 }, (_, index) => `I${Math.floor(index / 8)}.${index % 8}`);
const digitalOutputAddresses = Array.from({ length: 16 }, (_, index) => `Q${Math.floor(index / 8)}.${index % 8}`);

function toSignals(seed: ChallengeSeed): PlcSignal[] {
  const [, , , inputNames, outputNames] = seed;
  const analogInputs = new Set(["Temperature process value", "Pressure process value", "Level process value"]);
  const inputSignals = inputNames.map((name, index): PlcSignal => {
    const analog = analogInputs.has(name);
    const analogIndex = [...analogInputs].filter((signal) => inputNames.slice(0, index + 1).includes(signal)).length - 1;
    return {
      name,
      address: analog ? `AI${Math.max(analogIndex, 0)}` : digitalInputAddresses[index % digitalInputAddresses.length] ?? "I0.0",
      kind: "input",
      dataType: analog ? "INT" : "BOOL",
      description: `${name} signal for this challenge`,
      initialValue: analog ? 0 : false,
      required: true,
    };
  });
  const outputSignals = outputNames.map((name, index): PlcSignal => ({
    name,
    address: digitalOutputAddresses[index % digitalOutputAddresses.length] ?? "Q0.0",
    kind: "output",
    dataType: "BOOL",
    description: `${name} output for this challenge`,
    initialValue: false,
    required: true,
  }));
  return [...inputSignals, ...outputSignals];
}

function publicCount(difficulty: Difficulty): number {
  if (difficulty === "Beginner") return 5;
  if (difficulty === "Intermediate") return 6;
  return 8;
}

export const challenges: Challenge[] = seeds.map((seed, index) => {
  const difficulty: Difficulty = index < 15 ? "Beginner" : index < 35 ? "Intermediate" : "Advanced";
  const count = publicCount(difficulty);
  return {
    id: `PLC-${String(index + 1).padStart(3, "0")}`,
    title: seed[0],
    difficulty,
    category: seed[1],
    summary: seed[2],
    objective: seed[2],
    estimatedMinutes: 12 + (index % 5) * 6 + (difficulty === "Advanced" ? 12 : 0),
    publicTestCount: count,
    extraTestCount: count,
    hiddenTestCount: difficulty === "Beginner" ? 5 : difficulty === "Intermediate" ? 8 : 12,
    instructions: seed[5],
    signals: toSignals(seed),
  };
});

export const challengeCategories = [...new Set(challenges.map((challenge) => challenge.category))];
export const firstChallenge = challenges[0];

export function getChallenge(id: string): Challenge | undefined {
  return challenges.find((challenge) => challenge.id === id);
}