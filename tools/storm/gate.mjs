// gate.mjs (2 Nov a16): live gates for the desk-only rehearsal. Reads the coordinator's private/hops.jsonl (seen_utc per
// accepted own hop) and phase.log. (a) after step f4: clean = landing >= 99 % of its seconds, every family 1-4 landed,
// no SENDER_OFF/POOL_LOW/NODE_* in the window -> else writes control/SKIP-f8. (b) ramp: accepted hops per family per s for
// each ramp step; 2 consecutive steps with < 3 % gain -> SKIP-<every later ramp step>. Logs GATE_* lines to phase.log. TESTNET-10 ONLY.
import fs from "node:fs";
import { CFG, P, phase, sleep, T } from "./lib.mjs";
const S = CFG.schedule.filter((s) => s.step !== "gap");
function hops(a, b) { const out = []; try { for (const l of fs.readFileSync(P("private", "hops.jsonl"), "utf8").split("\n")) { if (!l) continue; const j = JSON.parse(l); const t = Date.parse(j.seen_utc); if (t >= a && t < b) out.push({ t, f: j.family }); } } catch {} return out; }
function events(a, b) { try { return fs.readFileSync(P("logs", "phase.log"), "utf8").split("\n").filter((l) => /SENDER_OFF|POOL_LOW|NODE_SKIP|NODE_DROP|PROC_EXIT/.test(l)).filter((l) => { const t = Date.parse(l.slice(0, 20)); return t >= a && t < b; }).length; } catch { return 0; } }
async function until(ms) { while (Date.now() < ms) await sleep(500); }
const f4 = S.find((s) => s.step === "f4");
if (f4) { const a = T(f4.from), b = T(f4.to); await until(b + 5000);
  const h = hops(a, b); const secs = new Set(h.map((x) => Math.floor(x.t / 1000))).size; const n = (b - a) / 1000; const land = secs / n;
  const fams = new Set(h.map((x) => x.f)); const ev = events(a, b); const clean = land >= 0.99 && [1, 2, 3, 4].every((f) => fams.has(f)) && ev === 0;
  phase(`GATE_F4 landing=${(land * 100).toFixed(2)} families=${fams.size} events=${ev} clean=${clean ? 1 : 0}`);
  if (!clean) { fs.writeFileSync(P("control", "SKIP-f8"), "gate f4 not clean\n"); phase("GATE_SKIP step=f8"); } }
const R = S.filter((s) => /^ramp/.test(s.step)); let prev = null, low = 0;
for (let i = 0; i < R.length; i++) { const a = T(R[i].from), b = T(R[i].to); await until(b + 3000);
  if (fs.existsSync(P("control", "SKIP-" + R[i].step))) break;
  const per = hops(a, b).length / R[i].families / ((b - a) / 1000); const gain = prev ? (per - prev) / prev : null;
  phase(`GATE_RAMP step=${R[i].step} rate=${R[i].rate} acc_per_family_s=${per.toFixed(3)} gain=${gain == null ? "na" : (gain * 100).toFixed(1)}`);
  if (gain != null) low = gain < 0.03 ? low + 1 : 0; prev = per;
  if (low >= 2) { for (const r of R.slice(i + 1)) fs.writeFileSync(P("control", "SKIP-" + r.step), "ramp plateau\n"); phase(`GATE_RAMP_STOP after=${R[i].step}`); break; } }
process.exit(0);
