export type ContactType = "NO" | "NC";
export type CoilType = "COIL" | "SET" | "RESET";

export type Contact = { signal: string; type: ContactType };
export type LadderRung = {
  id: string;
  branches: Contact[][];
  output: string;
  coil: CoilType;
};
export type LadderProgram = { version: 1; rungs: LadderRung[] };
export type PlcState = {
  inputs: Record<string, boolean | number>;
  outputs: Record<string, boolean>;
  memory: Record<string, boolean>;
  scan: number;
  timeMs: number;
  trace: Array<{ scan: number; timeMs: number; rung: string; energized: boolean; output: string }>;
};

export const defaultMotorProgram: LadderProgram = {
  version: 1,
  rungs: [
    {
      id: "Rung 1",
      branches: [
        [
          { signal: "I0.0", type: "NO" },
          { signal: "I0.1", type: "NC" },
          { signal: "I0.2", type: "NC" },
        ],
        [
          { signal: "Q0.0", type: "NO" },
          { signal: "I0.1", type: "NC" }.
        ],
      ],
      output: "Q0.0",
      coil: "COIL",
    },
  ],
};

export function createInitialState(inputOverrides: Record<string, boolean | number> = {}): PlcState {
  return {
    inputs: { "I0.0": false, "I0.1": false, "I0.2": false, ...inputOverrides },
    outputs: { "Q0.0": false },
    memory: {},
    scan: 0,
    timeMs: 0,
    trace: [],
  };
}

export function validateProgram(program: LadderProgram): string[] {
  const errors: string[] = [];
  if (program.version !== 1) errors.push("Unsupported ladder program version.");
  if (!Array.isArray(program.rungs) || program.rungs.length < 1 || program.rungs.length > 32) {
    errors.push("A program must contain between 1 and 32 rungs.");
    return errors;
  }
  for (const [index, rung] of program.rungs.entries()) {
    if (!/^Q[01]\.\d$/.test(rung.output) && !/^M\d+\.\d$/.test(rung.output)) {
      errors.push(`Rung ${index + 1} has an unsupported output address.`);
    }
    if (!Array.isArray(rung.branches) || rung.branches.length < 1 || rung.branches.length > 8) {
      errors.push(`Rung ${index + 1} must have 1–8 parallel paths.`);
      continue;
    }
    for (const branch of rung.branches) {
      if (!Array.isArray(branch) || branch.length > 16) {
        errors.push(`Rung ${index + 1} has an invalid contact path.`);
        continue;
      }
      for (const contact of branch) {
        if (!/^([IQ][01]\.\d|M\d+\.\d)$/.test(contact.signal)) {
          errors.push(`Rung ${index + 1} references an unsupported signal address.`);
        }
        if (contact.type !== "NO" && contact.type !== "NC") {
          errors.push(`Rung ${index + 1} contains an unsupported contact instruction.`);
        }
      }
    }
    if (rung.coil !== "COIL" && rung.coil !== "SET" && rung.coil !== "RESET") {
      errors.push(`Rung ${index + 1} contains an unsupported output instruction.`);
    }
  }
  return [...new Set(errors)];
}

function readSignal(signal: string, state: PlcState): boolean {
  if (signal.startsWith("Q")) return state.outputs[signal] ?? false;
  if (signal.startsWith("M")) return state.memory[signal] ?? false;
  return Boolean(state.inputs[signal]);
}

export function scanProgram(
  program: LadderProgram,
  previous: PlcState,
  options: { scanMs?: number; inputs?: Record<string, boolean | number> } = {},
): PlcState {
  const validation = validateProgram(program);
  if (validation.length > 0) throw new Error(validation.join(" "));

  const state: PlcState = {
    ...previous,
    inputs: { ...previous.inputs, ...options.inputs },
    outputs: { ...previous.outputs },
    memory: { ...previous.memory },
    scan: previous.scan + 1,
    timeMs: previous.timeMs + (options.scanMs ?? 100),
    trace: [...previous.trace],
  };

  for (const rung of program.rungs) {
    const energized = rung.branches.some((branch) => branch.every((contact) => {
      const closed = readSignal(contact.signal, state);
      return contact.type === "NO" ? closed : !closed;
    }));
    const prior = readSignal(rung.output, state);
    if (rung.coil === "COIL") {
      if (rung.output.startsWith("M")) state.memory[rung.output] = energized;
      else state.outputs[rung.output] = energized;
    } else if (rung.coil === "SET" && energized) {
      if (rung.output.startsWith("M")) state.memory[rung.output] = true;
      else state.outputs[rung.output] = true;
    } else if (rung.coil === "RESET" && energized) {
      if (rung.output.startsWith("M")) state.memory[rung.output] = false;
      else state.outputs[rung.output] = false;
    }
    const current = readSignal(rung.output, state);
    state.trace.push({ scan: state.scan, timeMs: state.timeMs, rung: rung.id, energized, output: rung.output });
    if (prior !== current) {
      state.trace.push({ scan: state.scan, timeMs: state.timeMs, rung: `${rung.id} transition`, energized: current, output: rung.output });
    }
  }
  return state;
}

export function scanMany(
  program: LadderProgram,
  previous: PlcState,
  inputs: Record<string, boolean | number>,
  scans = 1,
): PlcState {
  let state = previous;
  for (let index = 0; index < scans; index += 1) state = scanProgram(program, state, { inputs });
  return state;
}

export function publicMotorTests(program: LadderProgram) {
  const tests = [
    { name: "Start command energizes motor", inputs: { "I0.0": true, "I0.1": false, "I0.2": false }, expected: true },
    { name: "Seal-in holds after start release", inputs: { "I0.0": false, "I0.1": false, "I0.2": false }, expected: true, startFirst: true },
    { name: "Stop command drops motor", inputs: { "I0.0": false, "I0.1": true, "I0.2": false }, expected: false, startFirst: true },
    { name: "Emergency stop drops motor", inputs: { "I0.0": false, "I0.1": false, "I0.2": true }, expected: false, startFirst: true },
    { name: "No request keeps motor off", inputs: { "I0.0": false, "I0.1": false, "I0.2": false }, expected: false },
  ];
  return tests.map((test) => {
    let state = createInitialState();
    if (test.startFirst) state = scanMany(program, state, { "I0.0": true });
    state = scanMany(program, state, test.inputs);
    const actual = state.outputs["Q0.0"] ?? false;
    return { name: test.name, inputs: test.inputs, expected: test.expected, actual, passed: actual === test.expected };
  });
}

export function diagnoseMotorProgram(program: LadderProgram): string[] {
  const validation = validateProgram(program);
  if (validation.length > 0) return validation;
  const results = publicMotorTests(program);
  const failures = results.filter((result) => !result.passed);
  if (failures.length === 0) return ["All public checks passed. The motor start, seal-in, stop, and emergency-stop behavior matches the challenge evidence."];
  const advice: string[] = [];
  if (failures.some((failure) => failure.name.includes("Emergency stop"))) advice.push("The emergency-stop input is active, but the motor output remained energized. Add a normally closed I0.2 contact in every path feeding the motor coil.");
  if (failures.some((failure) => failure.name.includes("Stop command"))) advice.push("The stop input did not drop the motor output. Check for a normally closed I0.1 contact in each seal-in path.");
  if (failures.some((failure) => failure.name.includes("Seal-in"))) advice.push("The motor dropped when the start button was released. Add a parallel normally open Q0.0 seal-in contact to retain the run command.");
  if (failures.some((failure) => failure.name.includes("Start command"))) advice.push("The start request did not energize Q0.0. Verify that I0.0 reaches the output coil through the required interlocks.");
  return advice.length > 0 ? advice : ["The trace shows an output mismatch. Compare the energized contacts in the first failed scan with the expected motor state."];
}
