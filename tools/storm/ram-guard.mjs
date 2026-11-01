// ram-guard.mjs (mini, 1 Nov a15): mini free-RAM guard for runs above 1x (RUNBOOK checklist 20). TESTNET-10 ONLY. Never touches kaspad.
//   node ram-guard.mjs --run <mini run_dir> [--min-mb 1024] [--reads 2] [--port 18601]
// Every 5 s logs free RAM to logs/ram-guard.csv. From START-60 s to END, if free RAM < min-mb on `reads` reads in a row:
// POST /stop to the desk guard receiver (same host as private/desk.url, port 18601, handoff token) -> desk control/STOP,
// and writes the mini control/STOP (coordinator stops). Heartbeat to the desk /health every 60 s. Counts only, no host in logs.
import fs from "node:fs"; import os from "node:os"; import path from "node:path";
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const run = arg("--run"); const MIN = Number(arg("--min-mb", 1024)); const N = Number(arg("--reads", 2)); const port = Number(arg("--port", 18601));
const raw = fs.readFileSync(path.join(run, "config.json"), "utf8").replace(/^\uFEFF/, "");
const T0 = Date.parse(raw.match(/"from":\s*"([^"]+)"/)[1]); const END = Date.parse(raw.match(/"end_utc":\s*"([^"]+)"/)[1]);
const u = new URL(fs.readFileSync(path.join(run, "private", "desk.url"), "utf8").trim()); u.port = String(port);
const token = fs.readFileSync(path.join(run, "private", "handoff.token"), "utf8").trim();
const csv = path.join(run, "logs", "ram-guard.csv"); if (!fs.existsSync(csv)) fs.writeFileSync(csv, "ts_utc,free_mb,armed,below\n");
const ph = (m) => fs.appendFileSync(path.join(run, "logs", "phase.log"), `${new Date().toISOString().slice(0, 19)}Z ${m}\n`);
const hit = async (p, method = "GET") => { try { const r = await fetch(new URL(p, u), { method, headers: { "x-handoff-token": token }, signal: AbortSignal.timeout(4000) }); return r.status; } catch { return 0; } };
ph(`RAM_GUARD on min_mb=${MIN} reads=${N} desk_health=${await hit("/health")}`);
let below = 0, tripped = false, lastHb = Date.now();
while (Date.now() < END + 5000) {
  const now = Date.now(), free = Math.round(os.freemem() / 1048576), armed = now >= T0 - 60000 && now < END;
  below = free < MIN ? below + 1 : 0;
  fs.appendFileSync(csv, `${new Date(now).toISOString()},${free},${armed ? 1 : 0},${below}\n`);
  if (armed && !tripped && below >= N) {
    tripped = true; fs.mkdirSync(path.join(run, "control"), { recursive: true }); fs.writeFileSync(path.join(run, "control", "STOP"), "");
    let st = 0; for (let i = 0; i < 5 && st !== 200; i++) { st = await hit(`/stop?why=mini_free_mb=${free}`, "POST"); if (st !== 200) await new Promise((z) => setTimeout(z, 1000)); }
    ph(`RAM_GUARD_TRIP free_mb=${free} desk_stop_http=${st}`);
  }
  if (now - lastHb > 60000) { lastHb = now; const h = await hit("/health"); if (h !== 200) ph(`RAM_GUARD desk_health=${h}`); }
  await new Promise((z) => setTimeout(z, 5000 - (Date.now() - now)));
}
ph(`RAM_GUARD off tripped=${tripped ? 1 : 0}`);
