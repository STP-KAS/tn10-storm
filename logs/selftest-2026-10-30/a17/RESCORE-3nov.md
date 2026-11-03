# a17 rescore (3 Nov 2026, fixed scorer)

`score-solo.py` criterion 7 counted contention rejects as failures (ok / attempts). Fixed (RUNBOOK 21, 3 Nov change): ok ratio = 1 − non-contention errors / attempts.
Fixed steps f1/f2/f4: 4,618 ok, 116 rejects (2+12+21 = 35 already_spent, 3+23+55 = 81 orphan), all contention, 0 non-contention errors.

| | Original | Fixed scorer |
|---|---|---|
| Ok ratio (crit 7) | 97.55 % FAIL | 100 % PASS (raw ok/attempts 97.55 %), rpc p99 3 ms |
| Score | 7/10 | **8/10** (fails 2, 4) |

With the 3 Nov f1 union rule, criterion 4 still fails: union landing 97.40 %. [SCORE-a17](SCORE-a17.md) is unchanged.
