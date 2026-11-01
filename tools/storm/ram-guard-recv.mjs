// ram-guard-recv.mjs (desk, 1 Nov a15): stop endpoint for the mini RAM guard. Node built-ins only. TESTNET-10 ONLY.
//   node ram-guard-recv.mjs --dir <run_dir> [--port 18601]
// POST /stop  header x-handoff-token (= <run_dir>/private/handoff.token) -> creates <run_dir>/control/STOP (senders exit on it).
// GET /health -> {ok}. Never touches kaspad.
import http from "node:http"; import fs from "node:fs"; import path from "node:path"; import crypto from "node:crypto";
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const dir = arg("--dir", process.cwd()); const port = Number(arg("--port", 18601));
const token = fs.readFileSync(path.join(dir, "private", "handoff.token"), "utf8").trim();
const log = (m) => { fs.appendFileSync(path.join(dir, "logs", "ram-guard-recv.log"), `${new Date().toISOString()} ${m}\n`); };
const eq = (a, b) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
http.createServer((req, res) => {
  const send = (c, o) => { res.writeHead(c, { "content-type": "application/json" }); res.end(JSON.stringify(o)); };
  if (req.method === "GET" && req.url === "/health") return send(200, { ok: true });
  if (req.method !== "POST" || !req.url.startsWith("/stop")) return send(404, { ok: false });
  if (!eq(String(req.headers["x-handoff-token"] || ""), token)) { log("REJECT bad_token"); return send(403, { ok: false }); }
  const why = (new URL(req.url, "http://x").searchParams.get("why") || "").replace(/[^\w.=-]/g, "").slice(0, 80);
  fs.mkdirSync(path.join(dir, "control"), { recursive: true }); fs.writeFileSync(path.join(dir, "control", "STOP"), "");
  log(`GUARD_STOP ${why}`); fs.appendFileSync(path.join(dir, "logs", "phase.log"), `${new Date().toISOString().slice(0, 19)}Z GUARD_STOP ${why}\n`);
  send(200, { ok: true });
}).listen(port, () => log(`listening port=${port}`));
