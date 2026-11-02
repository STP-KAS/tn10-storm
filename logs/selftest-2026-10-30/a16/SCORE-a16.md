# a16 score (desk-only, 2 Nov 2026) — 7/10

Window 21:30–22:20 CET (20:30–21:20Z). Desk = only sender, mini = read-only counter. Steps f1/f2/f4 at 5 tx/s per family, f8 gated, ramp 5→12 (4 families).

| # | Criterion (RUNBOOK 21) | Result |
|---|---|---|
| 1 | Preflight (sync, clocks desk +2.7 ms / mini +39 ms / box ~+20 ms, 8 family ids in a private file, miners: none) | PASS |
| 2 | On from first second, every second attempted | PASS (first submit ≤ 0.22 s, 480/480 s every step) |
| 3 | One held rate | FAIL: 1.43–1.48 accepted-ok per family/s against a configured 5 |
| 4 | Landing ≥ 99 % | FAIL: f1 97.08, f2 98.33, f4 95.62, ramp 97.5–100 |
| 5 | Every family moves (≤ 30 s gap) | PASS (max 6.4 s) |
| 6 | No faults | PASS |
| 7 | Submit health | FAIL: ok ratio 30 % (already_spent / orphan rejections from over-driving the chain); rpc p99 3 ms |
| 8 | Independent recount | PASS: coordinator 7,640 = mini 7,640 |
| 9 | Clean end | PASS: 0 own txs in mempool on desk and mini at END+10 |
| 10 | Latency + ramp | PASS: submit→acceptance measured for 100 %, p50 749 ms, p95 1,405 ms; ramp stopped by the rule after ramp10 |

Gates worked: f4 landing 95.63 % → **f8 skipped automatically**; ramp acceptance per family/s 1.419 → 1.529 (+7.8 %) → 1.523 (−0.4 %) → 1.475 (−3.1 %) → **stopped, ramp12 skipped**.

Finding: one covenant family's chain carries ~1.5 hops/s (each hop spends the previous one; p50 acceptance 0.75 s). A 5/s per-family rate cannot be held.
Decision for a17 (logged, no question asked): the fixed steps (f1–f8) use **1.2 tx/s per family**, below the measured ceiling, so Pulse point 2 ("one rate it can hold") is honoured. The ramp stays 5/6/8/10/12 as briefed. Scorer clarification: criteria 3 and 7 apply to the fixed-rate steps; the ramp is judged by criterion 10, because it is meant to go past the ceiling. Re-scored under that clarification, a16 is still 7/10.
