# a18 score (desk-only, 3 Nov 2026) — 6/10

Window 01:00–01:50 CET (00:00–00:50Z). Same plan as a17 plus the sender de-lock. Scored with `tools/storm/score-solo.py` (RUNBOOK 21); family comparison with `tools/storm/delock-compare.py`.

| # | Criterion (RUNBOOK 21) | Result |
|---|---|---|
| 1 | Preflight | PASS |
| 2 | On from first second, every second attempted | FAIL: f1 463/480 (first 0.85 s); f2 480/480; f4 478/480 |
| 3 | One held rate (≥ 95 % of 1.2) | FAIL: f1 1.37, f2 1.17, **f4 1.07** ok per family/s (de-lock delays cost throughput) |
| 4 | Landing ≥ 99 % | FAIL: f1 95.83, f2 97.29, f4 98.33 (ramp 97.5 / 100 / 99.17 / 100 / 99.17) |
| 5 | Every family moves (≤ 30 s gap) | PASS (fixed steps max 3.2 s; ramp max 11.5 s) |
| 6 | No faults | PASS |
| 7 | Submit health | FAIL: fixed-step ok ratio 97.16 % (rpc p99 4 ms) |
| 8 | Independent recount | PASS: coordinator 6,641 = mini 6,641 |
| 9 | Clean end | PASS: census 0 own on desk and mini |
| 10 | Latency + ramp | PASS: 100 % covered, p50 778 ms, p95 1,451 ms; ramp ran to the end |

## De-lock vs a17 (same steps, same rate)

| Step | a17 per family % | a17 union | a18 per family % | a18 union | Accepting blocks with all 4 families |
|---|---|---|---|---|---|
| f2 | 95.8 / 94.6 | 96.88 | 94.6 / 86.2 | 97.29 | — (both: a17 628 of 692, a18 360 of 761) |
| f4 | 95.8 / 96.0 / 96.0 / 93.8 | 97.71 | 95.0 / 90.8 / 84.6 / 81.2 | **98.33** | a17 579 of 707 → a18 **129 of 842** |
| ramp6–12 | 92.5–98.3 | 96.7–98.3 | 81.7–99.2 | **99.17–100** | a17 ~90 % → a18 ~20–28 % |

## Findings
1. **The de-lock works.** Families stopped landing in the same block (f4 all-four blocks 82 % → 15 %), and union landing rose: f4 97.71 → 98.33 %, ramp steps 96.7–98.3 → 99.17–100 %.
2. **It costs throughput at a fixed 1.2/s.** Stagger delays (3,033 delayed fires) lowered f4 hops 2,601 → 2,043 and dropped f4 to 1.07 ok per family/s, so criterion 3 now fails. In the ramp (rate cap above what a chain can do) families free-run and the union hit ≥ 99 % at ~1.2 per family/s.
3. **f1 still can't pass 2 and 4 alone** (95.83 %, 463/480): one chain, p95 hop latency 1.45 s. Same as a17. Criteria question for stp.
4. **Criterion 7 (ok ratio ≥ 99 %)** fails in all three desk-only runs (97.16–97.55 %): orphan and already_spent races are inherent to one chain per family. Also a criteria question.

## Possible a19 (not armed; waits for stp)
Shorter stagger (e.g. 300 ms) to keep the de-lock without losing the 1.2/s rate. Even if that fixes 3 and 4 for f2/f4, 10/10 isn't reachable while f1 must reach 99 % landing and every second attempted, and the ok ratio must reach 99 %.
