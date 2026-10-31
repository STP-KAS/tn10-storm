# a14 — 2-hour run, a13 setup + desk lane funding, Sat 31 Oct / Sun 1 Nov 2026

> Kaspa Testnet-10 only. Times UTC (CET = UTC+1).

- Why: a13 scored 7/10 (criteria 2 and 5: desk lane ran out of coins at 21:13Z; 3: landing 98.31 %). stp 31 Oct 19:54 CET: "Keep going until 10/10. Full authority." Same code, config and kits as a13; **only change: desk `usable_min_tkas` 7,000 → 16,000** (RUNBOOK 16). Landing rule unchanged (99 %).
- Config: tag s3a14, 4 families, rate 5, lanes desk/mini/muon/boson, `usable_min_tkas` desk 16,000 / mini 9,000 / muon 11,000 / boson 32,000. Family check 23:35Z, **START 23:45Z (00:45 CET 1 Nov), END 01:45Z (02:45 CET)**, RBF sweep END+75 s / 3 / 6 min, census 01:55Z, recovery to 02:05Z.
- Funding 22:30–22:41Z (`fund-lanes14.mjs`, 96 txs + 1 prep tx, fees 1.73 tKAS, 0 retries): desk 1,415 coins / 18,403 usable tKAS, mini 1,018 / 10,352, muon 1,484 / 12,660, boson 4,123 / 36,808. Genesis keys topped up 1 → 4 coins each (`fund-gen8.mjs`, 1 tx).
- Network (checklist 18): desk `e2fnexpress` 27/32 last at 16:29Z (a12), none since; mini NCSI on the main adapter none since 16:29Z.
- Pre-launch RBF sweep 22:42Z (dry run): desk 1 own / mini 1 own, both no live input (the same two old leftovers). Pre-START census 22:42Z (`--save-pre`): desk 1 own (9 in mempool), mini 1 own (2).
- Desk: `desk-a11.ps1` (kit10, pwsh 7, detached) started 22:42Z, clock +1.5 ms, `GUARD_PRE exit=2 refused=1`.
- Mini: `mini-a8.ps1` (kit8, detached) started 22:42Z, `PREFLIGHT_GENESIS exit=0` (4 coins ≥ 15 tKAS per genesis key), clock +13.1 ms, free RAM 1.6 GB. Mini kaspad untouched since the 11:10Z restart, desk kaspad untouched.
