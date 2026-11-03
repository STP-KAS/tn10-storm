# a23 armed (4 Nov 2026, desk-only, rehearsal 5)

Times CET (UTC+1): tasks 01:50, genesis 02:00, **START 02:10, END 03:00**, census 03:10, recovery done 03:20. Score after 03:20. Night slot, ≥ 20 min after a22's recovery.
Schedule identical to a19–a22 (f1/f2/f4/f8 8 min each with 2 min gaps at 1.2/s per family, f8 only if f4 clean; ramp 5/6/8/10/12 per s, 4 families, 2 min each, 2×<3 % stop rule). Stagger 300 ms, heartbeat 900 ms. Criteria unchanged (RUNBOOK 21 + 3 Nov changes).

## One change vs a22 (so its effect can be measured)
- **Multi-entry relay** (`tools/storm/sender.mjs` `relay_urls`, `covenant.mjs` keeps the builder's raw tx): every ok hop is also submitted to `boson-10.kaspa.red` (public TN10 wRPC). Root cause in `../a22/SCORE-a22.md`: ~80 % of the cycle is desk → network relay (desk listens on localhost only; its 8 outbound peers all reconnected at 07:57–08:02 CET on 3 Nov; kaspad relays tx inventories at most every 500 ms per hop). muon was not used: connect timeout at 00:40 CET.
- Desk kit `kit13` = kit12 + these two files (hashes equal to the repo files). `node --check` passes on the desk. No live relay test (it needs a funded chain outside a window); a dead or failing relay only writes `RELAY_OFF` or a private reject row and never touches the desk submit path.

## Arm state (00:41 CET)
- Desk: `stp-desk-solo` → kit13 / step3-a23, one-time trigger 01:50 CET; `stp-desk-capture-a23` (peers + host) 01:50–03:20 CET.
- Mini: `stp-mini-counter-a23` and `stp-mini-firstseen-a23`, 01:50–03:20 CET. Mini free RAM 5,238 MB, clock +31 ms.
- Funding: desk lane topped up from the prepared treasury coins, 377 × 16 tKAS in 10 TN10 transactions (fee 0.1716 tKAS): 1,134 coins / 5,457 usable → **1,511 coins / 10,358 usable** (min 9,000). 33 prepared 700-tKAS treasury coins left.
- kaspad on desk and mini not restarted; devnet processes untouched; no miners.

## What a23 decides
- Desk → mini first-seen and submit → header latency back near a17 (~0.55 s) = relay path confirmed as the cause; expect 3 to pass and 4 to rise.
- No change = the cause is not the entry point; next look is boson's own relay results (private `relay-desk.jsonl`).
- If 4 still fails with 3 passing: next shape change is 2 chains per family (landing is per family union), documented before it runs.
