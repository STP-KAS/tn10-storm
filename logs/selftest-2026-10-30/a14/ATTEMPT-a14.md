# a14 — 2-hour run, a13 setup + desk lane funding, Sat 31 Oct / Sun 1 Nov 2026

> Kaspa Testnet-10 only. Times UTC (CET = UTC+1).

- Why: a13 scored 7/10 (criteria 2 and 5: desk lane ran out of coins at 21:13Z; 3: landing 98.31 %). stp 31 Oct 19:54 CET: "Keep going until 10/10. Full authority." Same code, config and kits as a13; **only change: desk `usable_min_tkas` 7,000 → 16,000** (RUNBOOK 16). Landing rule unchanged (99 %).
- Config: tag s3a14, 4 families, rate 5, lanes desk/mini/muon/boson, `usable_min_tkas` desk 16,000 / mini 9,000 / muon 11,000 / boson 32,000. Family check 23:35Z, **START 23:45Z (00:45 CET 1 Nov), END 01:45Z (02:45 CET)**, RBF sweep END+75 s / 3 / 6 min, census 01:55Z, recovery to 02:05Z.
- Funding 22:30–22:41Z (`fund-lanes14.mjs`, 96 txs + 1 prep tx, fees 1.73 tKAS, 0 retries): desk 1,415 coins / 18,403 usable tKAS, mini 1,018 / 10,352, muon 1,484 / 12,660, boson 4,123 / 36,808. Genesis keys topped up 1 → 4 coins each (`fund-gen8.mjs`, 1 tx).
- Network (checklist 18): desk `e2fnexpress` 27/32 last at 16:29Z (a12), none since; mini NCSI on the main adapter none since 16:29Z.
- Pre-launch RBF sweep 22:42Z (dry run): desk 1 own / mini 1 own, both no live input (the same two old leftovers). Pre-START census 22:42Z (`--save-pre`): desk 1 own (9 in mempool), mini 1 own (2).
- Desk: `desk-a11.ps1` (kit10, pwsh 7, detached) started 22:42Z, clock +1.5 ms, `GUARD_PRE exit=2 refused=1`.
- Mini: `mini-a8.ps1` (kit8, detached) started 22:42Z, `PREFLIGHT_GENESIS exit=0` (4 coins ≥ 15 tKAS per genesis key), clock +13.1 ms, free RAM 1.6 GB. Mini kaspad untouched since the 11:10Z restart, desk kaspad untouched.
- Genesis 4 families on the mini 23:34:56–23:34:59Z, `HANDOFF ok` 23:34:59Z, desk `HANDOFF seen_on_desk` 23:35:02Z, `PREFLIGHT exit=0` 23:35:04Z (desk 1,415 coins / 18,403 usable, mini 1,018 / 10,352, muon 1,484 / 12,660, boson 4,123 / 36,808; clock −1.6 ms), `guard exit=0`, `LAUNCH exit=0`.
- **START 23:45:00Z (00:45 CET 1 Nov)** (`START senders=desk,mini,muon,boson families=4 rate=5`). **END 01:45:00Z (02:45 CET)**, `SENDERS_EXITED left=0` 01:45:03Z. Sweep END+75 s: desk 24 own (23 replaced, 1 no live input), mini 9 own (8 replaced, 1 no live input), 0 failed; END+3 and +6 min nothing left to replace. Census 01:55:07Z, `RECOVERY_DONE` 02:05Z on both. Nothing was stopped by hand; kaspad untouched on both machines.
- **Planned NIC reset during the run (not a home-network fault).** At about 00:54–00:55 CET stp ran the NIC power-management fix in his own admin PowerShell on the desk (Intel I226-V: "allow the computer to turn off this device" set to Disabled, Wake-on-LAN / ARP offload / NS offload off) and restarted the adapter. The desk logged two short link resets: `e2fnexpress` 27 → 32 at **23:54:11.8 → 23:54:14.5Z** and **23:55:13.4 → 23:55:16.2Z** (2.7 s and 2.9 s), link back at 1 Gbps. The desk node went to 0 peers for one row each time (back to 8 peers by 23:57:23Z), and the desk-side senders saw it: `SENDER_OFF` desk 23:54:15–23:54:17Z, mini 23:54:15–23:54:23Z and 23:55:17–23:55:25Z (the mini lane runs through the desk tunnel). This is the **planned window 23:54:11–23:55:26Z (75 s)** below. No other desk link drop since 16:29Z on 31 Oct and 0 mini NCSI events since 23:00Z ([lan-events](data/lan-events-a14.csv)).

## Result · scored Sun 1 Nov 2026, ~03:45 CET · **6/10 strict · 9/10 without the planned NIC window**

`score.mjs` (on the box, from logs copied read-only from desk and mini) + `mempool-ours.jsonl`; the recount ran on the mini after END (`recount.mjs`, kit8). Window split and gap lengths from the same hop log and submit log (counts only). Data: [data/](data/) (counts only, no ids).

| # | Criterion | Strict | Without planned NIC window | Numbers |
|---|---|---|---|---|
| 1 | Pre-checks (clock, sync, peers, disk) | PASS | PASS | desk clock +0.9 / +1.2 ms (22:42Z), −1.6 ms preflight, −0.2 ms after END; mini +13.1 ms (22:42Z), +27.8 ms after END (rule: within 100 ms); synced, 8 peers at preflight |
| 2 | Every lane every second | **FAIL** | PASS | desk **7,199** · mini **7,186** · muon 7,200 · boson 7,200 of 7,200 s. All 15 missing seconds (desk 1, mini 14) are inside the planned window; outside it every lane attempted in every second |
| 3 | Landing ≥ 99 % of seconds | **FAIL** | **FAIL** | **98.44 %** (7,088 / 7,200), 112 missed in 95 gaps (88 single seconds, longest 5 s at 00:34:24Z). 7 missed inside the window; outside it **98.53 %** (105 missed of 7,125). Per 10 min: 11 12 8 13 20 10 8 4 10 4 8 4 |
| 3′ | *Proposed rule (not adopted): ≥ 98 % and no more than 5 s missed in a row* | PASS | PASS | 98.44 % ≥ 98 %, longest run of missed seconds 5 s (00:34:24Z); inside the window the longest is 4 s |
| 4 | Non-contention errors ≤ 1 % | PASS | PASS | desk 0 / 138,166 · mini 162 / 137,611 (0.12 %) · muon 143 / 130,811 (0.11 %) · boson 136 / 137,142 (0.10 %); all 441 are `rpc` rejects **inside the planned window**, 0 outside. Contention: desk 96,536, mini 96,172, muon 94,321, boson 95,887 |
| 5 | Desk lane | **FAIL** | PASS | 0 errors, attempts in 7,199 / 7,200 s (the missing second is 23:54:16Z, in the window); share **2.76 %** (reported; a13 22.62 %, a12 12.04 %) |
| 6 | Other lanes | **FAIL** | PASS | mini 7,186 / 7,200 s (14 missing, all in the window); muon and boson every second; shares mini 2.55 %, muon 16.90 %, boson 77.80 % (reported) |
| 7 | Node RPC p95 < 50 ms, max < 250 ms | PASS | PASS | desk p95 3, max 17 ms; mini p95 2, max 28 ms. Sender RPC: desk p95 1 / max 45, mini 44 / 120, muon 129 / 440, boson 32 / 611 ms |
| 8 | Logs every 5 s | PASS | PASS | 1,438 / 1,437 node-watch rows in the window, max gap 5.017 / 5.046 s; desk 2 unsynced rows and peers down to 0 only in the planned window; mini peers never below 8 |
| 9 | 0 own tx at END + 10 min (new since START) | PASS | PASS | 01:55:07Z: desk 1 own (**0 new**, 1 pre-START), mini 1 own (**0 new**, 1 pre-START). **New 0 · strict 2** (the same two old leftovers with no live input, unchanged since before a13) |
| 10 | Handoff, guard, post-end, recount | PASS | PASS | `GUARD_PRE exit=2 refused=1`, `HANDOFF ok`, preflight 0, `RECOUNT_OK rows=4`, `RECOUNT_MATCH hoplog=40065 recount=40069 diff_pct=0.010` |

**Scores:** strict **6/10** (2, 3, 5, 6). Without the planned NIC window **9/10** (3 only). Under the proposed landing rule: strict 7/10, without the window **10/10**. The official 99 % rule is unchanged.

**Hops:** recount **40,069 = 5.57 hops/s, the best 2-hour rate so far** (f1 10,058 · f2 10,016 · f3 9,967 · f4 10,028); hop log 40,112 lines, 40,065 unique, 502 back-fill, 74 resync, 0 revert. Landed (non-back-fill) per 10 min (hops/s): 5.63 5.36 5.57 5.23 5.19 5.48 5.69 5.77 5.65 5.50 5.49 5.47.
**Freezes / stalls:** 0 `STALL`, 0 `PROC_EXIT`, 3 `SENDER_OFF` (all in the planned window), 248 `TIP_BACK`, 4,096 `UNACCEPT`. Longest all-family landing gap 5.4 s (00:34:24Z); per family 6.2–6.7 s, except family 1 once 15.7 s (01:06:30Z, after an `UNACCEPT` burst 01:06:21–25Z; the other families kept landing). No sender stderr output.
**Mempool:** desk 2–60 before START, 2–87 during, 2–82 after; mini 2–59 / 2–81 / 2–73.
**Pools (coins > 3 tKAS, start → min → end):** desk 1,415 → 1,298 → 1,325, mini 1,018 → 879 → 971, muon 1,484 → 677 → 708, boson 4,123 → 1,797 → 1,810. 0 `POOL_LOW`: the a14 funding fix held.
**Mini memory:** free RAM **806 MB at START, minimum 736 MB (23:46:14Z)**, below 1 GB in 136 of 1,437 rows (23:45–23:57Z), then 1.3–2.0 GB to the end; 1,800 MB at 02:05Z, 1,957 MB at ~02:25Z. kaspad private 7.86 GB (31 Oct 11:58Z: 2.84 GB after the restart), commit 15.6 / 18.3 GB. No mini freeze. Desk free RAM 6.0–7.8 GB.

### What failed and why
- **Criteria 2, 5, 6: the planned NIC reset (caused by us, not a home-network fault).** 15 lane-seconds and 441 `rpc` rejects, all inside 23:54:11–23:55:26Z. Outside that window every lane attempted every second with 0 non-contention errors.
- **Criterion 3 floor (98.44 %).** 105 of the 112 missed seconds are outside the window: 88 single seconds spread over the run, the same pattern as a11 (98.92 %), a12 outside outages (98.66 %) and a13 (98.31 %). Not fixed by code; the 99 % rule is unchanged.

### What worked
- Best 2-hour rate (5.57 hops/s), recount matched to 0.010 %, no node freeze, no desk RPC spike.
- Desk lane funding fix held: 0 `POOL_LOW`, every pool ended well above 100 coins. The desk share swung from 22.6 % (a13) to 2.8 %, so funding each lane for its highest share seen (checklist 19) is the right rule.
- RBF sweep replaced 31 of 33 own leftovers; criterion 9 has **0 new own tx** (as in a11 and a13).
- The senders rode through two adapter restarts: back on within 2–8 s, back-fill and recount honest.

### Decision (stp, 31 Oct 23:47 CET, "Ok go")
Whatever a14 scores, the next step is the **3× scaling ladder** (step 4: 4 families, 3× rate), not another 4-family rerun. a13/a14 are accepted as proof that the setup is stable. The 99 % landing rule's wording stays; the proposed alternative (≥ 98 % and no more than 5 s missed in a row) is scored alongside (3′ above).

### 3× step: not launched (mini memory)
The mini went **below 1 GB free for the first 12 minutes of a14 at 1× rate** (min 736 MB), and its kaspad keeps growing (private 2.84 → 7.86 GB in 15 h, commit 15.6 / 18.3 GB). At 3× the load stop rule (below ~1 GB) would very likely trip in the first minutes, and a10 showed the mini kaspad freezing at about 1 GB free. Restarting kaspad is not allowed without stp. Held for stp: with his OK, a graceful mini kaspad restart (RUNBOOK 13 procedure) right before the 3× launch, then the 30-min 3× step with a mini RAM guard.
