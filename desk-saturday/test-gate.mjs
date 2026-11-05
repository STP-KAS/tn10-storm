// Locks the Saturday gate rules against the a23 counts.
import test from "node:test";
import assert from "node:assert/strict";
import { f8Clean, nextRamp, decisionInsideGap } from "./gate-rule.mjs";

test("a23 f4 opens f8 under the Saturday rule", () => {
  // f4: 480/480 seconds attempted, first submit 0.02 s, 1.182 acc/s at rate 1.2, 0 faults.
  // Landing was 97.50%. That number is not an input to this rule.
  assert.equal(f8Clean({
    attemptSeconds: 480, windowSeconds: 480, firstSubmitS: 0.02,
    acceptedPerFamilyS: 1.182, rate: 1.2, faults: 0,
  }), true);
});

test("one missed second keeps f8 off", () => {
  // a22 f4 was 479/480.
  assert.equal(f8Clean({
    attemptSeconds: 479, windowSeconds: 480, firstSubmitS: 0.04,
    acceptedPerFamilyS: 1.182, rate: 1.2, faults: 0,
  }), false);
});

test("a rate that was not held keeps f8 off", () => {
  // 95% of 1.2 is 1.14. 1.10 is under it.
  assert.equal(f8Clean({
    attemptSeconds: 480, windowSeconds: 480, firstSubmitS: 0.02,
    acceptedPerFamilyS: 1.10, rate: 1.2, faults: 0,
  }), false);
});

test("a fault keeps f8 off", () => {
  assert.equal(f8Clean({
    attemptSeconds: 480, windowSeconds: 480, firstSubmitS: 0.02,
    acceptedPerFamilyS: 1.182, rate: 1.2, faults: 1,
  }), false);
});

test("a step that holds its configured rate opens f8", () => {
  assert.equal(f8Clean({
    attemptSeconds: 900, windowSeconds: 900, firstSubmitS: 0.02,
    acceptedPerFamilyS: 1.2, rate: 1.2, faults: 0,
  }), true);
  assert.equal(f8Clean({
    attemptSeconds: 900, windowSeconds: 900, firstSubmitS: 0.02,
    acceptedPerFamilyS: 1.0, rate: 1.0, faults: 0,
  }), true);
});

test("5 Nov 8-family hold opens f8 at rate 1.2", () => {
  // Slowest family over 600 s was 1.260. Worst full minute was 1.167.
  // 0.95 * 1.2 = 1.14. The gate uses the step average, not the minute floor.
  assert.equal(f8Clean({
    attemptSeconds: 600, windowSeconds: 600, firstSubmitS: 0.026,
    acceptedPerFamilyS: 1.260, rate: 1.2, faults: 0,
  }), true);
  assert.ok(1.167 >= 0.95 * 1.2);
  assert.ok(1.167 < 1.2);
});

test("a23 ramp stops after the third step, same as the live gate", () => {
  // acc/s: 1.294, 1.312 (gain 1.4%), 1.323 (gain 0.8%). Stop after the third.
  const series = [1.294, 1.312, 1.323, 1.323];
  let st = { prev: null, low: 0, stop: false };
  let stoppedAt = -1;
  for (let i = 0; i < series.length; i++) {
    st = nextRamp(st.prev, st.low, series[i]);
    if (st.stop) { stoppedAt = i; break; }
  }
  assert.equal(stoppedAt, 2);
});

test("a rising ramp does not stop", () => {
  let st = { prev: null, low: 0, stop: false };
  for (const per of [1.0, 1.1, 1.2, 1.3]) {
    st = nextRamp(st.prev, st.low, per);
    assert.equal(st.stop, false);
  }
});

test("the ramp decision falls inside a 10 s gap and not inside a 0 s gap", () => {
  assert.equal(decisionInsideGap(10, 3000), true);
  assert.equal(decisionInsideGap(0, 3000), false);
  assert.equal(decisionInsideGap(3, 3000), false);
});
