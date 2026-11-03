# a22 score (desk-only, rehearsal 4, 3 Nov 2026) — 7/10

Window 23:00–23:50 CET (22:00–22:50Z), evening slot, plan identical to a19–a21 (f1/f2/f4/f8 8 min at 1.2/s per family, f8 only if f4 clean, ramp 5/6/8/10/12 per s, stagger 300 ms) plus `heartbeat_ms: 900`. Scored with `tools/storm/score-solo.py` (RUNBOOK 21, 3 Nov criteria). Scored 4 Nov ~00:50 CET.

| # | Criterion (RUNBOOK 21) | Result |
|---|---|---|
| 1 | Preflight | PASS (desk clock +0.2–0.7 ms; miners none; mini clock +31 ms, 5.2 GB free) |
| 2 | On from first second, every second attempted | FAIL by one second: f1 480/480, f2 480/480, **f4 479/480** (second 76 of f4 had no attempt), ramp 120/120 each; first submit 0.00–0.09 s |
| 3 | One held rate (≥ 95 % of 1.2) | FAIL: f1 0.95, f2 0.88, f4 0.83 ok per family/s |
| 4 | Landing ≥ 99 % | FAIL: f1 86.46, f2 89.79, f4 92.71, union 90.64 (ramp 91.67–95.0) |
| 5 | Every family moves (≤ 30 s gap) | PASS (max 5.6 s, ramp12) |
| 6 | No faults | PASS (f8 gate-skipped: f4 landing 92.71) |
| 7 | Submit health | PASS: ok ratio 100 % excl. 2,363 contention rejects (raw 55.0 %), rpc p99 2 ms |
| 8 | Independent recount | PASS: coordinator 4,995 = mini 4,995 |
| 9 | Clean end | PASS: census 0 own on desk and mini at END+10 |
| 10 | Latency + ramp | PASS: 100 % covered, p50 1,169 ms, p95 1,804 ms; ramp ran to 12/s (gains −0.5, +6.0, +4.5, −2.2 %) |

Accepted own hops: f1 456 · f2 839 · f4 1,588 · f8 skipped · ramp5 404 · ramp6 402 · ramp8 426 · ramp10 445 · ramp12 435.

## What the heartbeat fixed
Criterion 2 went from f1 432/480 (a21) to 480/480 and f2 473 → 480. One second in f4 was still missed (the heartbeat skips a family while its fire is in flight). Every ok submit in f1/f2/f4 was a fire-on-new-tip (457/457, 841/841, 1,592/1,592); every heartbeat and tick attempt was a contention reject. So the ok rate per family is exactly 1 / (submit → acceptance cycle).

## Root cause of 3 and 4: the desk's relay path, not time of day
1. **Time of day is refuted.** a22 ran at 23:00 CET, the a17 slot. Submit → accepting header (fixed steps, same method as the SCORE-a21 table): **p50 913 ms / p95 1,445 ms**, the same as daytime a19–a21 (910–1,073 / 1,395–1,579), not evening a16–a18 (557–584 / 1,013–1,057).
2. **Where the time goes (new capture, `tools/storm/latency-decomp.py`):** desk submit → first seen in the mini's mempool p50 **785–860 ms** per step (p95 1.11–1.19 s); mini first seen → accepting header p50 only **141–221 ms**. 1,319 of 5,002 accepted hops (26 %) never showed in the mini mempool before acceptance (the block reached the mini before the transaction did). So about 80 % of the cycle is the transaction travelling out of the desk node into the network, not inclusion by miners and not our node (desk RPC p99 2 ms, host CPU p50 9.8 %, max 51.9 %, free RAM ≥ 6.1 GB, top processes kaspad/chrome/nvsphelper64).
3. **Why the relay is slow, from the kaspad source** (`protocol/flows/src/flowcontext/transactions.rs`, same in 2.0.1 and 2.1.0): a node queues new transaction ids and only sends the inventory once 500 ms (`BROADCAST_INTERVAL`) have passed since its last broadcast, so each relay hop adds up to ~0.5 s. The fewer hops between the desk and the miners' nodes, the faster.
4. **What changed on 3 Nov ~08:00 CET:** the desk node listens on 127.0.0.1 only (no inbound peers), so its 8 outbound peers are its only route out. In the a22 capture, **7 of the 8 peers had connected between 07:57 and 08:02 CET on 3 Nov**, the moment of the switch bump noted in SCORE-a19 (8th peer: 20:49 CET). All runs before that reconnect (a16–a18) were at ~0.57 s; every run after it (a19–a22, morning, midday and evening) is at ~0.9–1.07 s. Same node, same kit, same network load (stp: TN10 is steady at 60–70 TPS); the peer set is the one thing that changed at that moment. Peer pings are low (11–27 ms, one 2.0.1 peer at 154 ms), so the extra time is relay hops behind those peers, not link speed.
5. Limits of the proof: no peer capture exists for a16–a18, so the old peer set can't be compared directly. The kaspad log on the desk has been empty since 31 Oct (rotation), so it can't fill the gap. The fix below tests the hypothesis directly.

## Fix for a23
Multi-entry relay (`sender.mjs`, `relay_urls`): after the desk node returns ok, the same signed transaction is also submitted to the public TN10 node boson (2.1.0, 29 peers, inbound open; checked 4 Nov 00:40 CET: synced, connect 131 ms). Only ok transactions are relayed, so no conflicting copy can exist; the desk row, bucket and fire logic are unchanged and relay results go to a private file. Still one sending machine (the desk); kaspad is not touched. If propagation drops back toward the a17 level (~0.55 s cycle), criterion 3 should pass (a17 held 1.36–1.44 ok/s at night) and landing should rise; one chain per family has never reached 99 % per step, so criterion 4 may still fail.
