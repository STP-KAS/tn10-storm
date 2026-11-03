# a19 plan (desk-only, 3 Nov 2026)

Follows Pulse's Saturday requirements; scored with `tools/storm/score-solo.py` under RUNBOOK 21 incl. the 3 Nov criteria changes (stp, voice 07:46 CET).

- **Window**: START 08:40 CET, END 09:30 CET (07:40–08:30Z), same 50 min as a18. Genesis 08:30 CET (8 families); census END+10 (09:40); recovery done 09:50 CET.
- **Load**: desk only (one sender, all families on from second one of each step). Mini = read-only counter (own kaspad, untouched).
- **Steps** (one rate per step, held for the full 8-min window): f1 1.2/s · gap 2 min · f2 1.2/s per family · gap · f4 1.2/s per family · gap · f8 1.2/s per family **only if f4 clean** (gate) · gap · ramp 4 families 5/6/8/10/12 per s, 2 min each (10 min), stops after 2 consecutive steps with < 3 % gain in acceptance per family.
- **De-lock**: `stagger_ms` 300 (a18: 700, cost f4 rate 1.07/s), `lock_ms` 150.
- **Latency**: submit time per tx in the private desk submit file, joined privately with the mini's accepted file → submit-to-acceptance p50/p95.
- **Preflight**: family ids to a private file, miner lines desk + mini, clock on desk, mini and box (≤ 100 ms), sync ≤ 5 DAA vs boson, ≥ 4 peers, mini free RAM ≥ 2 GB.
- **Criteria changes vs a18**: criterion 7 ok ratio excludes contention rejects (target still ≥ 99 %); f1 judged on union landing (≥ 99 % over all counted seconds), f2/f4/f8 per step.
- kaspad on desk and mini never restarted/reconfigured; the desk devnet left alone.
