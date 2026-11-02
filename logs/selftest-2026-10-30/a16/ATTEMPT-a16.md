# ATTEMPT a16: not run (usage outage + LAN switch unplugged)

Planned: ladder step 5, 8 families at 1x rate, 30 min, RAM guard on, muon only if reachable.

- 1 Nov ~13:00Z: a16 kit prepared (kit10, 13:05Z) but never armed. No run directory, no START, no hop sent. Cause: agent usage ran out after ~13:00Z, restored 2 Nov ~18:15Z.
- 2 Nov ~18:30Z: the home LAN switch was unplugged by accident. Desk Intel NIC event at 18:30:22Z; back at 1 Gbps.
- Recovery check 2 Nov 18:31Z (read-only):
  - Machine identity verified from the machines: desk = the I226-V machine, mini = the "SER" machine running the mini kaspad (`--ram-scale=0.4`, uacomment stp-mini). Agent labels for the two machines may be swapped; trust the machine itself.
  - No a16 sender, orchestrator or RAM-guard (port 18601) process on either machine. Only the tunnels (`rtunnel.mjs`), the mini wasm listener and long-lived helpers are running. Nothing stopped.
  - Desk clock offset within 1 ms. Desk node RPC port answers.
  - **Mini free RAM 1,668 MB (< 2 GB checklist 20); mini kaspad private memory 7.9 GB again, 34 h after the 1 Nov restart.** Launch blocked; kaspad not touched (restart only with stp's OK).
- Result: not run. Relaunch needs a mini kaspad restart (stp OK) or a lower-RAM plan.

## Relaunch as a desk-only rehearsal (stp, 2 Nov 19:31–19:35 CET)
Direction: Saturday's Pulse rerun has only the desk sending. a16 rehearses it. **The desk is the only sender** and runs genesis. **The mini sends nothing**; it is the independent counter (`counter.cjs`, read-only, logs acceptance time per txid from its own kaspad, stops itself under 1 GB free RAM). No mini kaspad restart. The desk devnet (separate kaspad + node process, admin) is left alone; our processes only use the desk TN10 kaspad's local port.

### Preflight (18:35–18:52Z)
- After the LAN-switch outage both TN10 nodes were behind: 18:35Z desk 134k DAA behind boson, mini 252k (mini re-ran header IBD, then block bodies). No restart; waited. **18:40Z desk synced (lag 1); 18:51:45Z mini synced (lag 3)**; both 8 peers.
- Clocks: desk +1.7 ms (18:44Z), mini +13.8 ms (18:52Z).
- Desk lane 1,520 coins / 18,408 usable tKAS (min 9,000). Genesis keys: every family ≥ 307 coins ≥ 15 tKAS (8 families on 4 keys, two per key).
- Pre-START census desk: 0 in mempool, 0 own.
- Mini free RAM 1,229 MB (kaspad still warm after IBD). Counter RSS ≈ 78 MB.
- Desk devnet sharing the machine: second kaspad 379 MB private / 10 CPU-s, devnet node process 277 MB / 998 CPU-s. Desk TN10 kaspad 13.5 GB private.

### Plan (tag s3a16, rate 5 per family, every family on from the first second of its step)
| Step | UTC | CET | Families | Rate |
|---|---|---|---|---|
| f1 | 19:15–19:23 | 20:15–20:23 | 1 | 5 |
| gap | 19:23–19:25 | | 0 | |
| f2 | 19:25–19:33 | 20:25–20:33 | 2 | 5 |
| gap | 19:33–19:35 | | 0 | |
| f4 | 19:35–19:43 | 20:35–20:43 | 4 | 5 |
| gap | 19:43–19:45 | | 0 | |
| f8 | 19:45–19:53 | 20:45–20:53 | 8 | 5 (scored only if f4 is clean) |
| gap | 19:53–19:55 | | 0 | |
| ramp | 19:55–20:05 | 20:55–21:05 | 4 | 5 → 6 → 8 → 10 → 12, 2 min each; scored up to the step where acceptance per family stops growing |
- Family check (genesis) 19:05Z, **START 19:15:00Z (20:15 CET), END 20:05:00Z (21:05 CET)**, recovery to 20:25Z.
- Per-tx submit time: desk `private/submit-desk.jsonl` (already logged by `sender.mjs`); acceptance: desk coordinator `private/hops.jsonl` and the mini counter `private/accepted.jsonl`. Both private, never in git; only counts and latency percentiles get published.
- Launch: mini counter 18:52:02Z (`COUNTER_ON`), desk `desk-solo.ps1` (pwsh 7, detached) 18:52:28Z `SOLO_ARMED`.
