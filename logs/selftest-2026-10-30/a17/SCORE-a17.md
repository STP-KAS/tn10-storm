# a17 score (desk-only, 2 Nov 2026) — 7/10

Window 23:00–23:50 CET (22:00–22:50Z). Desk = only sender, mini = read-only counter. Fixed steps f1/f2/f4 at 1.2 tx/s per family (below the a16 ceiling), f8 gated, ramp 5→12 (4 families). Scored with `tools/storm/score-solo.py` (RUNBOOK 21).

| # | Criterion (RUNBOOK 21) | Result |
|---|---|---|
| 1 | Preflight (desk + mini synced, lag 2, 8 peers; clocks desk +0.6 ms / mini +9 ms; 8 family ids in a private file; miners: none) | PASS |
| 2 | On from first second, every second attempted | FAIL: first submit ≤ 0.86 s, but 471/480 (f1), 467/480 (f2), 471/480 (f4) seconds had an attempt |
| 3 | One held rate | PASS: 1.44 / 1.38 / 1.36 accepted-ok per family/s against 1.2 |
| 4 | Landing ≥ 99 % | FAIL: f1 97.71, f2 96.88, f4 97.71 (ramp 96.7–98.3) |
| 5 | Every family moves (≤ 30 s gap) | PASS (max 5.6 s) |
| 6 | No faults | PASS (0 SENDER_OFF / NODE_DROP / PROC_EXIT / POOL_LOW; desk TN10 kaspad same pid since 30 Oct; the elevated non-TN10 kaspads untouched) |
| 7 | Submit health | FAIL: fixed-step ok ratio 97.55 % (orphan 81, already_spent 35 of 4,734); rpc p99 3 ms |
| 8 | Independent recount | PASS: coordinator 7,418 = mini 7,418 |
| 9 | Clean end | PASS: census at END+10, desk 0 own / mini 0 own in mempool (`logs/mempool-ours.jsonl`) |
| 10 | Latency + ramp | PASS: submit→acceptance for 100 %, p50 741 ms, p95 1,331 ms; ramp stopped by the rule after ramp10 (+8.3 %, −3.7 %, −1.6 %) |

Gates: f4 landing 97.71 % → f8 skipped; ramp stopped after ramp10.

Scorer note: the desk `CRIT9` line came out empty (`ours= ours_new=`), a stdout-parse glitch in the census step; the census file itself logged 0 own txs on both nodes. The scorer now reads `logs/mempool-ours.jsonl` (strict line parse gave 6/10).

## Findings
1. **Not a network floor.** The mini saw accepted transactions (anyone's) in every second of every step. The empty seconds are ours alone.
2. **The families are phase-locked.** Each family fires its next hop the moment it sees its tip, and all tips arrive in the same accepting block, so all families fire together, land together and miss the same seconds. f4: 579 of 707 accepting blocks carried all 4 families. Per family landing was 93.8–96.0 %; four independent families would union to ~99.99 %, but the union was 97.71 %.
3. **One family cannot reach 99 % on its own.** A single covenant chain moves ~1.45 hops/s with a p95 hop latency of 1.33 s, so some seconds are always empty (f1: 11 of 480) and some seconds have no attempt (the next hop waits for the tip). Criteria 2 and 4 for f1 look unreachable as written; that is a criteria question for stp, not a fix.

## Fix for a18 (logged, not a criteria change)
- `sender.mjs` de-lock: when a family sees its new tip within 150 ms of a lower-numbered active family, it waits k × (700 ms / families) before firing. Only on a collision, so free-running families keep full speed. New config keys `stagger_ms` (700) and `lock_ms` (150); `DELOCK` line at sender exit.
- `score-solo.py`: criterion 9 from the census file.
- Desk lane topped up before a18 (a17 used ~7,500 usable tKAS; 2,684 left, below the 9,000 minimum): 31 txs from the box treasury, now 2,131 coins / 18,401 usable tKAS.
