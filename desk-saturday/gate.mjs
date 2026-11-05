// Saturday gate. Copy this file and gate-rule.mjs over the kit's gate.mjs
// (and beside it) at arm time. desk-solo.ps1 starts `node gate.mjs`.
// One change from the rehearsal gate: f8 follows acceptance held for the
// whole step with the sender on every second. Landing percent is logged
// and stays out of the decision. Ramp stop is the same 2 x <3% rule.
// TESTNET-10 ONLY.
import fs from "node:fs";
import { CFG, P, phase, sleep, T } from "./lib.mjs";
import { f8Clean, nextRamp } from "./gate-rule.mjs";

const S = CFG.schedule.filter((s) => s.step !== "gap");

function between(file, a, b, key) {
  const out = [];
  try {
    for (const l of fs.readFileSync(P("private", file), "utf8").split("\n")) {
      if (!l) continue;
      const j = JSON.parse(l);
      const t = Date.parse(j[key]);
      if (t >= a && t < b) out.push({ t, f: j.family });
    }
  } catch {}
  return out;
}

function faults(a, b) {
  try {
    return fs.readFileSync(P("logs", "phase.log"), "utf8").split("\n").filter((l) => /SENDER_OFF|POOL_LOW|NODE_SKIP|NODE_DROP|PROC_EXIT/.test(l)).filter((l) => {
      const t = Date.parse(l.slice(0, 20));
      return t >= a && t < b;
    }).length;
  } catch { return 0; }
}

async function until(ms) { while (Date.now() < ms) await sleep(500); }

const f4 = S.find((s) => s.step === "f4");
if (f4) {
  const a = T(f4.from), b = T(f4.to);
  await until(b + 3000);
  const n = (b - a) / 1000;
  const subs = between("submit-desk.jsonl", a, b, "ts");
  const hs = between("hops.jsonl", a, b, "seen_utc");
  const attemptSeconds = new Set(subs.map((x) => Math.floor(x.t / 1000))).size;
  const firstSubmitS = subs.length ? (Math.min(...subs.map((x) => x.t)) - a) / 1000 : 1e9;
  const acc = hs.length / f4.families / n;
  const land = new Set(hs.map((x) => Math.floor(x.t / 1000))).size / n;
  const ev = faults(a, b);
  const clean = f8Clean({ attemptSeconds, windowSeconds: n, firstSubmitS, acceptedPerFamilyS: acc, rate: f4.rate, faults: ev });
  phase(`GATE_F4 landing=${(land * 100).toFixed(2)} acc_per_family_s=${acc.toFixed(3)} attempts=${attemptSeconds}/${n} first_s=${firstSubmitS.toFixed(2)} events=${ev} clean=${clean ? 1 : 0} rule=pulse`);
  if (!clean) {
    fs.writeFileSync(P("control", "SKIP-f8"), "gate f4 not clean\n");
    phase("GATE_SKIP step=f8");
  }
}

const R = S.filter((s) => /^r/.test(s.step) && s.step !== "recovery");
let state = { prev: null, low: 0 };
for (let i = 0; i < R.length; i++) {
  const a = T(R[i].from), b = T(R[i].to);
  await until(b + 3000);
  if (fs.existsSync(P("control", "SKIP-" + R[i].step))) break;
  const per = between("hops.jsonl", a, b, "seen_utc").length / R[i].families / ((b - a) / 1000);
  state = nextRamp(state.prev, state.low, per);
  const gain = state.gain == null ? "na" : (state.gain * 100).toFixed(1);
  phase(`GATE_RAMP step=${R[i].step} rate=${R[i].rate} acc_per_family_s=${per.toFixed(3)} gain=${gain}`);
  if (state.stop) {
    for (const r of R.slice(i + 1)) fs.writeFileSync(P("control", "SKIP-" + r.step), "ramp plateau\n");
    phase(`GATE_RAMP_STOP after=${R[i].step}`);
    break;
  }
}
process.exit(0);
