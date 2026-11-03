# a22 armed (3 Nov 2026, desk-only, rehearsal 4)

Times CET (UTC+1), **postponed +2 h 30 at stp's request (19:43 CET)**: genesis 23:50 (3 Nov), **START 00:00, END 00:50 (4 Nov)**, census 01:00, recovery done 01:10. Score after 01:10.
Original slot was genesis 21:20, START 21:30, END 22:20.
Schedule identical to a19–a21: f1/f2/f4/f8 8 min each with 2 min gaps at 1.2/s per family (f8 only if f4 clean), ramp 5/6/8/10/12 per s, 4 families, 2 min each, 2×<3 % stop rule. Stagger 300 ms. Criteria unchanged (RUNBOOK 21 + 3 Nov changes).

## What changed vs a21
1. Slot: evening (a16–a18 latency ≈ 0.57 s vs ≈ 1.0 s daytime).
2. Kit: `tools/storm/sender.mjs` with `heartbeat_ms: 900` in the run config (commit 049a798). Installed on the desk kit, hash equal to the repo file.
   Offline check (`hb-sim`, same bucket/fire/heartbeat logic, one family at 1.2/s, 480 s): seconds with an attempt
   | acceptance latency | heartbeat off | heartbeat 900 ms |
   |---|---|---|
   | 0.57 s | 480 | 480 |
   | 1.0 s | 480 | 480 |
   | 1.2 s | 431 | 480 |
   Heartbeat off at 1.2 s reproduces a21 f1 (432/480). No live test: a live test needs a funded genesis chain on the desk lane outside a run window; the offline check covers the logic and `node --check` passes.
3. Funding: desk lane top-up sent before arming, 257 × 16 tKAS in 7 TN10 transactions (fee 0.1173 tKAS) from the prepared treasury coins. Desk lane 1,479 coins / 7,009 usable → **1,736 coins / 10,350 usable** (min 9,000).
4. Read-only capture added (no sends, no restarts; private files only):
   - `tools/storm/desk-capture.mjs` on the desk: peer info every 60 s (count, per-peer ping, outbound, time offset), host CPU, free RAM and top 12 processes every 10 s. Window 23:40–01:10 CET. Tested: 8 peers, all outbound, ping 11–154 ms.
   - `tools/storm/mini-firstseen.cjs` on the mini: mempool poll every 250 ms, first-seen time per txid (joined offline with the desk submit file → desk→mini propagation). Window 23:40–01:10 CET. Tested 60 s: 62 polls, 507 txids, 0 errors, RPC max 14 ms.
   - Mini acceptance counter as before (counter.cjs), window 21:10–22:40 CET.

## Arm state at 17:54 CET
- Desk solo task: running, `SOLO_ARMED start=20:30Z end=21:20Z` (= 21:30–22:20 CET), watchers up.
- Desk capture task and the two mini tasks: scheduled 21:10 CET.
- kaspad on desk and mini not restarted; devnet processes untouched; no miners.

## Forecast (unchanged from PLAN-a22)
Crit 2 expected fixed; crit 3 likely in the evening; crit 4 likely 97–98 % (one chain per family). Honest forecast 9/10.

## Postponed at 19:45 CET (3 Nov)
- Desk solo run stopped before genesis (only its own broker, coordinator and post-end processes; nothing had been sent). Pre-shift logs moved to a private `preshift` folder.
- Every timestamp in the run config shifted +150 min (schedule, sec_from, family_check, end).
- Desk solo task now has a one-time trigger at 23:40 CET; it then waits for genesis at 23:50.
- Desk capture task and both mini tasks: trigger 23:40 CET, run until 01:10 CET.
- Checked: no a22 process running and no a22 task with a trigger before 23:40 CET. kaspad on desk and mini not touched; devnet untouched; no miners.
