// Saturday f8 and ramp decisions. Pure functions, no I/O.
// The internal 99% landing line stays in the scorer. It is not this gate.
// Testnet-10 rehearsal rule only.

// f8 runs when the sender was on from the first second, acceptance held the
// configured rate, and the step had no fault. One missed second keeps f8 off.
export function f8Clean({ attemptSeconds, windowSeconds, firstSubmitS, acceptedPerFamilyS, rate, faults }) {
  const on = Number(firstSubmitS) <= 1 && Number(attemptSeconds) >= Number(windowSeconds);
  const held = Number(acceptedPerFamilyS) >= 0.95 * Number(rate);
  return Boolean(on && held && Number(faults) === 0);
}

// prev/low carry across ramp steps. Two gains in a row under 3% stop the ramp.
// The caller writes SKIP for every later ramp step and does it inside the gap,
// before the next step's `from`.
export function nextRamp(prev, low, per) {
  if (prev == null) return { prev: per, low: 0, gain: null, stop: false };
  const gain = (per - prev) / prev;
  const nlow = gain < 0.03 ? low + 1 : 0;
  return { prev: per, low: nlow, gain, stop: nlow >= 2 };
}

// The gate decides at step end + decisionDelayS. That instant has to fall
// inside the following gap, strictly before the next step opens.
export function decisionInsideGap(gapS, decisionDelayS = 3000) {
  return decisionDelayS < gapS * 1000;
}
