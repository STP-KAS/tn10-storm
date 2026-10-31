# a13 — 2-hour run, same setup as a12, Sat 31 Oct 2026

> Kaspa Testnet-10 only. Times UTC (CET = UTC+1).

- Why: a12 scored 5/10, failed by 3 home-network outages (RUNBOOK 15). stp 19:54 CET: "Keep going until 10/10. Full authority." Same code, config and funding as a12; landing rule unchanged (99 %, stp's decision).
- Config: tag s3a13, 4 families, rate 5, lanes desk/mini/muon/boson, `usable_min_tkas` desk 7,000 / mini 9,000 / muon 11,000 / boson 32,000. Family check 19:35Z, **START 19:45Z (20:45 CET), END 21:45Z (22:45 CET)**, RBF sweep END+75 s / 3 / 6 min, census 21:55Z, recovery to 22:05Z.
- Desk NIC (checklist 18, RUNBOOK 15): no link-down event since the last a12 outage (16:29Z). Energy-Efficient Ethernet and Idle power down restriction were already off on the desk card; Windows "allow the computer to turn off this device" is at its default (allowed) and could not be changed: the agent session on the desk is not elevated. Nothing changed on the NIC, no driver update.
- Pre-launch RBF sweep 18:59Z (dry run): desk 1 own / mini 1 own, both with no live input, so nothing to replace. They stay as pre-START leftovers.
- Funding 18:56–19:06Z (`fund-lanes13.mjs` = a12 script, 76 txs, fees 1.37 tKAS): desk 1,022 coins / 8,060 usable tKAS, mini 984 / 10,355, muon 1,407 / 12,651, boson 4,292 / 36,809.
- Pre-START census 19:06Z (`mempool-ro.mjs --save-pre`): desk 1 own, mini 1 own (the two leftovers above).
- Mini: `mini-a8.ps1` (kit8) started 19:07Z, `PREFLIGHT_GENESIS exit=0`; free RAM 1.9 GB before launch. Mini kaspad untouched since the 11:10Z restart.
- Desk: `desk-a11.ps1` (kit10, pwsh 7, detached) started 19:08Z, clock +1.3 / +0.8 ms, `GUARD_PRE exit=2 refused=1`.
- Genesis 4 families on the mini, `HANDOFF ok`, desk `PREFLIGHT exit=0` 19:35:05Z (desk 1,022 coins / 8,060 usable, mini 984 / 10,355, muon 1,407 / 12,651, boson 4,292 / 36,809; clock +1.5 ms), `guard exit=0`, `LAUNCH exit=0`.
- **START 19:45:00Z (20:45 CET)** (`START senders=desk,mini,muon,boson families=4 rate=5`). **END 21:45:00Z (22:45 CET).** No desk link-down event between launch and START.
- END 21:45:00Z, `SENDERS_EXITED left=0` 21:45:03Z. Sweep END+75 s: desk 16 own (15 replaced, 1 no live input), mini 4 own (3 replaced, 1 no live input), 0 failed; END+3 and +6 min nothing left to replace. Census 21:55:07Z, `RECOVERY_DONE` 22:05Z on both. Nothing was stopped by hand; kaspad untouched on both machines.

## Result · scored Sat 31 Oct 2026, ~23:40 CET · **7/10**

`score.mjs` (on the box, from logs copied read-only from desk and mini) + `mempool-ours.jsonl`; the recount ran on the mini after END (`recount.mjs`, kit8). Data: [data/](data/) (counts only, no ids).

| # | Criterion | Result | Numbers |
|---|---|---|---|
| 1 | Pre-checks (clock, sync, peers, disk) | PASS | desk clock +1.3 / +0.8 ms (19:08Z), +1.5 ms preflight, −0.7 ms after END; mini +10.9 ms (19:07Z), +25.8 ms after END (rule: within 100 ms); synced, 8 peers at preflight |
| 2 | Every lane every second | **FAIL** | desk **7,086** · mini 7,200 · muon 7,200 · boson 7,200 of 7,200 s. All 114 missing desk seconds are after 21:15:38Z, when the desk lane had run out of coins |
| 3 | Landing ≥ 99 % of seconds | **FAIL** | **98.31 %** (7,078 / 7,200), 122 missed in 112 gaps (108 single seconds, longest 5 s). Per 10 min: 7 17 9 8 13 10 8 6 8 8 18 10. Before the desk ran dry (first 80 min) 98.38 %, so the desk pool is not the cause |
| 4 | Non-contention errors ≤ 1 % | PASS | **0 on every lane** (desk 103,480 · mini 137,756 · muon 130,875 · boson 137,275 attempts). Contention: desk 71,026, mini 96,993, muon 95,574, boson 96,865 |
| 5 | Desk lane | **FAIL** | 0 errors, but attempts in 7,086 / 7,200 s (lane out of coins from 21:13Z); share **22.62 %** (reported; a12 12.04 %) |
| 6 | Other lanes | PASS | every second on mini, muon, boson, 0 errors; shares mini 2.12 %, muon 15.67 %, boson 59.60 % (reported) |
| 7 | Node RPC p95 < 50 ms, max < 250 ms | PASS | desk p95 2, max 16 ms; mini p95 2, max 25 ms. Sender RPC: desk p95 1 / max 188, mini 44 / 322, muon 130 / 391, boson 37 / 557 ms |
| 8 | Logs every 5 s | PASS | 1,437 / 1,438 node-watch rows in the window, max gap 5.017 / 5.046 s, 0 unsynced rows, peers never below 8 |
| 9 | 0 own tx at END + 10 min (new since START) | PASS | 21:55:07Z: desk 1 own (**0 new**, 1 pre-START), mini 1 own (**0 new**, 1 pre-START). **New 0 · strict 2** (the two old leftovers with no live input, unchanged since before START) |
| 10 | Handoff, guard, post-end, recount | PASS | `GUARD_PRE exit=2 refused=1`, `HANDOFF ok`, preflight 0, `RECOUNT_OK rows=4`, `RECOUNT_MATCH hoplog=39457 recount=39461 diff_pct=0.010` |

**Hops:** recount **39,461 = 5.48 hops/s, the best 2-hour rate so far** (f1 9,946 · f2 9,813 · f3 9,886 · f4 9,816); hop log 39,499 lines, 39,457 unique, 483 back-fill, 74 resync, 0 revert. Landed (non-back-fill) per 10 min (hops/s): 5.59 5.65 5.67 5.66 5.57 5.61 5.53 5.59 5.55 **4.87 4.84 4.89** (the drop is the desk lane running dry).
**Freezes / stalls:** 0 `STALL`, 0 `PROC_EXIT`, 0 `SENDER_OFF`, 197 `TIP_BACK`, 3,964 `UNACCEPT`. Longest all-family landing gap 5.3 s (20:13:46Z); per family 6.2–6.5 s. No sender stderr output.
**Network:** **no outage.** Desk `e2fnexpress` 27/32: none after 16:29Z (a12); mini NCSI 4042 on the main adapter: none after 16:29Z ([lan-events](data/lan-events-a13.csv)). (The mini event log also holds five NCSI entries from another adapter stamped in the year 2096, a bad timestamp on that adapter, not in the run.)
**Mempool:** desk 54 before START (52–147 during, other people's traffic), mini 2 before START. Post-end: desk 53–126, mini 2–62.
**Pools (coins > 3 tKAS, start → min → end):** desk **1,022 → 0 (21:13:04Z) → 0**, mini 984 → 842 → 895, muon 1,407 → 783 → 819, boson 4,292 → 2,303 → 2,390. `POOL_LOW sender=desk` from 21:05:24Z.

### What failed and why
- **Desk lane ran out of coins (criteria 2 and 5).** The desk lane landed **22.6 %** of the hops (a12: 12.0 %), so it spent its 8,060 usable tKAS on 8,805 landed hops by 21:13Z. After that it still submitted (1,200 ok, 1,212 rejected after 21:13Z) on small leftover coins, but not every second (first missing second 21:15:38Z). The funding was sized from the a12 desk burn, which was half of this. **Fix (a14):** desk `usable_min_tkas` 7,000 → **16,000** (≈ 2 h at the a13 pre-dry rate, 12,000 hops × ≈ 0.92 tKAS, × 1.3 headroom), funded to × 1.15. Other lanes unchanged (each ended with ≥ 783 coins).
- **Criterion 3 floor (98.31 %).** No outage, no freeze, no node stall: 108 of 112 gaps are single empty seconds spread over the whole run, the same pattern as a11 (98.92 %) and a12 outside the outages (98.66 %), slightly worse here. a7–a13: 99.28 / 99.49 / 99.32 / 98.85 / 98.92 / 98.66* / 98.31 % (*outside outages). This is not fixed by the funding change. The 99 % rule is unchanged (stp's rule).

### What worked
- No home-network outage, no node freeze, no desk RPC spike, 0 non-contention errors in 509,386 attempts.
- Best 2-hour rate (5.48 hops/s), recount matched to 0.010 %.
- RBF sweep replaced 18 of 20 own leftovers; criterion 9 has **0 new own tx** (as in a11).
