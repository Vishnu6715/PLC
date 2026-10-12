# PLC Logic Arena — Working Core

## Goal
Replace the starter page with a usable industrial automation learning workspace, centered on the complete 50-challenge library and a genuinely executed PLC-001 learning flow.

## Build
1. Establish the dark navy/blue engineering design system and application shell, then add a searchable/filterable library with exactly PLC-001–PLC-050, the specified titles, difficulty, category, objectives, and challenge-specific I/O and supported instruction metadata.
2. Implement a deterministic, testable ladder logic model and virtual PLC scan runtime. Deliver the first challenge end-to-end: edit a ladder program, change inputs, execute scans, inspect real outputs/traces, validate logic, run distinct public tests, and receive evidence-based rule diagnostics.
3. Add Cloud-backed email/Google sign-in, learner profile and separately stored roles, and secure owner-scoped storage for user program drafts and verified evaluation records. Hidden test data and scoring remain server-only; browser responses expose only safe aggregate outcomes.
4. Add focused tests for the 50 challenge inventory, the supported runtime instructions, PLC-001 behavior, and score calculation. Document unavailable later-phase features in the app completion summary rather than presenting them as finished.

## Technical decisions
- Keep challenge specifications, pure PLC execution, and test evaluation in `src/lib/plc/`, separated from route/UI code so runtime behavior is deterministic and independently testable.
- Use a protected TanStack server function for authenticated hidden evaluation and persist only server-computed results; use Cloud row policies for user-owned profiles, roles, and drafts.
- Keep `/` public and useful without a session; signed-in features offer account-aware controls instead of blocking the learning workspace.

## Not in this first release
Teacher class/assignment workflows, administrator tools, AI generation/debugging, industrial fault lab, mutation testing, PDF reports, and full detailed test suites/reference programs for all 50 challenges.