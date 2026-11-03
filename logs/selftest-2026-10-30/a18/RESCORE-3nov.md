# a18 rescore (3 Nov 2026, fixed scorer)

`score-solo.py` criterion 7 counted contention rejects as failures (ok / attempts). Fixed (RUNBOOK 21, 3 Nov change): ok ratio = 1 − non-contention errors / attempts.
Fixed steps f1/f2/f4: 112 rejects (34 already_spent, 78 orphan), all contention, 0 non-contention errors.

| | Original | Fixed scorer |
|---|---|---|
| Ok ratio (crit 7) | 97.16 % FAIL | 100 % PASS (raw ok/attempts 97.16 %), rpc p99 4 ms |
| Score | 6/10 | **7/10** (fails 2, 3, 4) |

With the 3 Nov f1 union rule, criterion 4 still fails: union landing 97.75 %. [SCORE-a18](SCORE-a18.md) is unchanged.
