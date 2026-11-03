# a19 score (desk-only, 3 Nov 2026) — 7/10

Window 08:40–09:30 CET (07:40–08:30Z), plan `PLAN-a19.md` (Saturday-plan rehearsal 1 of 3, stagger 300 ms). Scored with `tools/storm/score-solo.py` (RUNBOOK 21, 3 Nov criteria: ok ratio excludes contention rejects, f1 on union landing).

| # | Criterion (RUNBOOK 21) | Result |
|---|---|---|
| 1 | Preflight | PASS (desk clock −1 ms, mini +21 ms; miners none) |
| 2 | On from first second, every second attempted | FAIL: f1 427/480 (first 0.85 s); f2 469/480; f4 478/480; ramp 120/120 each |
| 3 | One held rate (≥ 95 % of 1.2) | FAIL: f1 0.79, f2 0.91, f4 0.87 ok per family/s |
| 4 | Landing ≥ 99 % | FAIL: f1 76.67, f2 90.83, f4 92.29 (ramp 89.17 / 94.17 / 95.83 / 92.5 / 90.0) |
| 5 | Every family moves (≤ 30 s gap) | PASS (max 3.8 s fixed, 6.1 s ramp) |
| 6 | No faults | PASS (f8 gate-skipped: f4 not clean) |
| 7 | Submit health | PASS: ok ratio 100 % excl. 886 contention rejects (raw 76.76 %), rpc p99 4 ms |
| 8 | Independent recount | PASS: coordinator 4,979 = mini 4,979 |
| 9 | Clean end | PASS: census 0 own on desk and mini |
| 10 | Latency + ramp | PASS: 100 % covered, p50 1,142 ms, p95 1,779 ms; ramp ran to ramp12, gate stop after ramp12 |

Accepted own hops: f1 380 · f2 875 · f4 1,665 · f8 skipped · ramp5 402 · ramp6 401 · ramp8 424 · ramp10 414 · ramp12 418.

## Findings
1. **Worse than a18 on every fixed step.** Contention rejects rose sharply: f1 195 of 576 attempts (a18: 13 of 670), f4 469 of 2,138 (a18: 72 of 2,117).
2. **Cause looks network-side, not the kit.** Submit-to-acceptance p50 rose 778 → 1,142 ms, longer than the 0.83 s fire interval at 1.2/s, so one chain fires again on a tip that hasn't advanced and loses the race (already_spent / orphan). Desk had a brief network outage (switch bump) ~08:00 CET but was synced (1 DAA, 7 peers) at 08:01.
3. **Nothing broke in the kit**: gates, sweep, census, recount and private files all worked. f8 shows a STEP line and STALL lines while gate-skipped (cosmetic; sender idle, scorer excludes it).

## a20
Identical plan (no change; nothing broke). Rehearsal 2 of 3.
