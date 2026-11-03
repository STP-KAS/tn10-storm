# a20 score (desk-only, 3 Nov 2026) — 7/10

Window 10:20–11:10 CET (09:20–10:10Z), plan identical to `../a19/PLAN-a19.md` (Saturday-plan rehearsal 2 of 3, stagger 300 ms). Scored with `tools/storm/score-solo.py` (RUNBOOK 21, 3 Nov criteria).

| # | Criterion (RUNBOOK 21) | Result |
|---|---|---|
| 1 | Preflight | PASS (desk clock +0.4 ms, mini +29 ms; miners none; mini 5.7 GB free) |
| 2 | On from first second, every second attempted | FAIL: f1 429/480 (first 0.87 s); f2 460/480; f4 477/480; ramp 120/120 each |
| 3 | One held rate (≥ 95 % of 1.2) | FAIL: f1 0.85, f2 0.76, f4 0.77 ok per family/s |
| 4 | Landing ≥ 99 % | FAIL: f1 81.67, f2 79.79, f4 88.12, union 85.73 (ramp 94.17 / 89.17 / 95.0 / 95.0) |
| 5 | Every family moves (≤ 30 s gap) | PASS (max 13.5 s in f2) |
| 6 | No faults | PASS (f8 gate-skipped: f4 landing 88.13) |
| 7 | Submit health | PASS: ok ratio 100 % excl. 1,211 contention rejects (raw 68.3 %), rpc p99 7 ms |
| 8 | Independent recount | PASS: coordinator 4,319 = mini 4,319 |
| 9 | Clean end | PASS: census 0 own on desk and mini at END+10 |
| 10 | Latency + ramp | PASS: 100 % covered, p50 1,248 ms, p95 2,080 ms; ramp stopped by rule after ramp10 (gains 5.4 %, 0.9 %, 0.5 %) |

Accepted own hops: f1 409 · f2 727 · f4 1,467 · f8 skipped · ramp5 410 · ramp6 432 · ramp8 436 · ramp10 438 · ramp12 skipped (rule stop).

## Findings
1. **Same failure pattern as a19, slightly worse on f2/f4.** Contention rejects 1,211 (a19 886); f2 landing fell 90.8 → 79.8, f4 92.3 → 88.1; f1 improved 76.7 → 81.7.
2. **Network latency still the likely cause.** Submit→acceptance p50 over the first 5 min of f1: a18 770 ms, a19 1,261 ms, a20 1,227 ms; full-run p50 1,248 ms (a19 1,142). Above the 0.83 s fire interval, so chains re-fire on un-advanced tips and lose races.
3. **Nothing broke in the kit**: gate, ramp rule stop, sweep, census, recount, private files all worked.

## a21
Identical plan. Rehearsal 3 of 3.
