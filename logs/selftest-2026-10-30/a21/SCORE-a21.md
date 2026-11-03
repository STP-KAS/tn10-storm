# a21 score (desk-only, 3 Nov 2026) — 7/10

Window 12:10–13:00 CET (11:10–12:00Z), plan identical to `../a19/PLAN-a19.md` (Saturday-plan rehearsal 3 of 3, stagger 300 ms). Scored with `tools/storm/score-solo.py` (RUNBOOK 21, 3 Nov criteria).

| # | Criterion (RUNBOOK 21) | Result |
|---|---|---|
| 1 | Preflight | PASS (desk clock +0.7–1.0 ms; miners none; mini synced, 4.36 GB free at arm) |
| 2 | On from first second, every second attempted | FAIL: f1 432/480 (first 0.84 s); f2 473/480; f4 478/480; ramp 120/120 each |
| 3 | One held rate (≥ 95 % of 1.2) | FAIL: f1 0.88, f2 0.83, f4 0.79 ok per family/s |
| 4 | Landing ≥ 99 % | FAIL: f1 81.46, f2 90.0, f4 90.0, union 88.49 (ramp5 92.5 / ramp6 92.5 / ramp8 93.33 / ramp10 91.67) |
| 5 | Every family moves (≤ 30 s gap) | PASS (max 3.4 s in f4) |
| 6 | No faults | PASS (f8 gate-skipped: f4 landing 90.00) |
| 7 | Submit health | PASS: ok ratio 100 % excl. 1,074 contention rejects (raw 71.9 %), rpc p99 2 ms |
| 8 | Independent recount | PASS: coordinator 4,417 = mini 4,417 |
| 9 | Clean end | PASS: census 0 own on desk and mini at END+10 |
| 10 | Latency + ramp | PASS: 100 % covered, p50 1,179 ms, p95 1,833 ms; ramp stopped by rule after ramp10 (gains 3.7 %, 0.9 %, −0.7 %) |

Accepted own hops: f1 420 · f2 799 · f4 1,516 · f8 skipped · ramp5 408 · ramp6 423 · ramp8 427 · ramp10 424 · ramp12 skipped (rule stop).

## Why submit-to-acceptance latency rose (a16–a21, fixed steps f1+f2+f4, 28 min each)

Latency here = desk submit time to the accepting chain block's header time (own private files; the scorer's p50 uses a slightly different end point, so its numbers are higher, the trend is the same).

| Run | CET start | Chain blocks/s | Block interval p50 / p95 ms | Network tx per block (mean) | Own tx per block (mean) | Contention rejects / attempt | Desk RPC p50 / p99 / max ms | Latency p50 / p95 ms |
|---|---|---|---|---|---|---|---|---|
| a16 | 21:30 (2 Nov) | 7.08 | 102 / 414 | 11.6 | 0.51 | 0.698 (older kit) | 1 / 3 / 36 | 573 / 1,057 |
| a17 | 23:00 (2 Nov) | 7.40 | 99 / 394 | 10.9 | 0.46 | 0.025 | 1 / 4 / 34 | 557 / 1,013 |
| a18 | 01:00 | 7.09 | 104 / 414 | 11.3 | 0.41 | 0.028 | 1 / 4 / 45 | 584 / 1,056 |
| a19 | 08:40 | 7.00 | 100 / 442 | 10.9 | 0.30 | 0.232 | 1 / 4 / 43 | 910 / 1,395 |
| a20 | 10:20 | 6.25 | 118 / 458 | 14.1 | 0.38 | 0.317 | 1 / 7 / 460 | 1,073 / 1,579 |
| a21 | 12:10 | 6.91 | 106 / 419 | 11.2 | 0.30 | 0.281 | 1 / 2 / 28 | 1,016 / 1,485 |

Single family (f1) only: latency p50 a17 543, a18 569, a19 1,004, a20 1,035, a21 1,000 ms; contention rejects 1–2 % (a17, a18) vs 27–34 % (a19–a21).

Facts:
1. Chain block rate and interval, network transactions per block and desk RPC times are about the same in all runs (a20 slightly slower blocks, 6.25/s). Nothing on our node side changed.
2. Our own sends per accepting block fell (0.41–0.46 → 0.30–0.38) because more of our attempts were rejected, not because we sent more.
3. The only kit change between a18 and a19 is the de-lock stagger 700 → 300 ms. The single-family step f1, where there is nothing to stagger against, jumped the same way (≈ 0.56 → ≈ 1.0 s), so the stagger change does not explain it.
4. The split is by time of day: all three evening/night runs (a16, a17, a18) sit at ≈ 0.56–0.58 s, all three morning/midday runs (a19, a20, a21) at ≈ 0.91–1.07 s.
5. The extra ≈ 0.45 s is between our node accepting the transaction and a chain block accepting it, i.e. outside our node (propagation to and inclusion by the network's miners). Which miners, and why it is slower during the day, cannot be determined from our data.
6. Contention rejects (already_spent / orphan) are the consequence: with latency above the 0.83 s fire interval at 1.2/s, chains re-fire on tips that have not advanced (fire-on-new-tip share fell from ≈ 98 % to ≈ 70 %).

## Verdict across the 3 rehearsals
a19 7/10, a20 7/10, a21 7/10: same three failures (2, 3, 4) every time, everything else (gate, ramp rule, sweep, census, mini recount, private files, latency coverage) worked in all three.
