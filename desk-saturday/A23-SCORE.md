> **Experimental. We are just trying this.** [Disclaimer](../DISCLAIMER.md) · Kaspa Testnet-10 only. Counts only.

# a23 score (desk, 4 Nov 2026) — 8/10, criterion 8 open

Armed in [a23/ARMED](../logs/selftest-2026-10-30/a23/ARMED-a23.md). It ran. The repo has no score for it. Scored here on 5 Nov from the desk logs with the same rules as [a22/SCORE](../logs/selftest-2026-10-30/a22/SCORE-a22.md) (`tools/storm/score-solo.py`, RUNBOOK 21, the 3 Nov scorer change).

Window 02:10–03:00 CET (01:10–02:00Z). Desk only, one lane, heartbeat 900 ms, stagger 300 ms, de-lock on. One change from a22: every ok transaction was also submitted to the public node boson.

| # | Criterion | Result |
|---|---|---|
| 1 | Preflight | PASS. `PREFLIGHT exit=0`, 8 family ids on file, miners `n=0`, desk clock −0.16 to −0.51 ms |
| 2 | On from the first second, every second attempted | PASS. f1/f2/f4 480/480, first submit 0.01–0.02 s. Ramp steps that ran: 120/120. All 24 counted minutes had an attempt in every second |
| 3 | Held rate ≥ 95% of 1.2 | PASS. Ok per family per second: f1 1.344, f2 1.258, f4 1.182 (line is 1.14). Accepted hops match those figures (1.342, 1.257, 1.182) |
| 4 | Landing ≥ 99% | FAIL. f1 95.21 (one family, not scored alone), f2 98.96, f4 97.50, union of counted seconds 97.28. Ramp 97.50, 95.83, 99.17 |
| 5 | No family quiet for > 30 s | PASS. Longest family gap 2.1 s (f4) |
| 6 | No faults | PASS. No sender-off, node-drop, proc-exit or pool-low. `STALL` lines are only inside f8 and the ramp steps the gate had already skipped |
| 7 | Submit health | PASS. Ok ratio 100% aside from 1,279 contention rejects. Non-contention errors 0. RPC p99 2 ms. Fixed-step attempts 5,401 |
| 8 | Mini recount within 1% | **Open.** The mini accepted-id file is not in the desk run directory, so this was not scored. a22 passed this when that file was copied back. Fill this in if the mini file is still there |
| 9 | 0 own tx at END+10 | PASS. Desk mempool 58, ours 0. Mini mempool 50, ours 0 |
| 10 | Latency covered, ramp stopped by the rule | PASS on the header join: 4,120/4,120 fixed-step hops and 1,886/1,886 ramp hops have a submit time. Ramp stopped after ramp8 (`GATE_RAMP_STOP`). The official scorer reads the mini file for this latency; the number below is submit time to the accepting header, which is the figure Kaspa Pulse asked to publish |

Accepted hops: f1 644 · f2 1,207 · f4 2,269 · f8 skipped · ramp5 621 · ramp6 630 · ramp8 635.

## What the relay changed

Same method on both runs: desk submit time to the accepting header, fixed steps only.

| | a22, no relay | a23, relay to boson |
|---|---:|---:|
| p50 | 913 ms | 564 ms |
| p95 | 1,441 ms | 1,028 ms |
| p99 | 1,685 ms | 1,290 ms |
| Criteria 2 and 3 | fail | pass |
| Union landing | 90.64% | 97.28% |

Boson returned ok for 6,039/6,039 relayed transactions. Relay RPC p50 20 ms, p95 21 ms, max 256 ms. The shorter cycle is the propagation, not a slow RPC. a22's account (about 80% of the cycle was the desk's path out, after the 3 Nov peer reconnect) is confirmed. Time of day was already ruled out there. This run was 02:10 CET and it landed on the a17 cycle, about 0.56 s.

f4 acceptance sat at 1.182/s against a configured 1.2. That is a pass, with little room. The ramp then offered 5, 6 and 8 per second and acceptance stayed at 1.294, 1.312, 1.323 per family. Gains 1.4% then 0.8%. The stop rule fired. The chain's acceptance per family stopped growing near 1.32/s. The offered rate of 5 was already past that.

## f8

`GATE_F4 landing=97.50 clean=0`, then `GATE_SKIP step=f8`. The sender was on for all 480 seconds and the rate was held. The 99% landing line is what kept 8 families off. Saturday's gate, in this folder, uses the held rate and the every-second check, and logs landing without gating on it.

## Coin use

Desk lane coin count in the pool log: 1,511 at 01:00Z, 847 at 01:59Z. About 6,000 included hops. Saturday is a longer window. The plan aborts unless the lane has been topped up.
