# a15 — ladder step 4: 4 families at 3× rate, 30 min, Sun 1 Nov 2026

> Kaspa Testnet-10 only. Times UTC (CET = UTC+1).

- Why: a13/a14 accepted as proof the setup is stable (stp 31 Oct 23:47 CET, "Ok go"): next is the 3× scaling ladder. The 3× step was held after a14 because the mini went to 736 MB free RAM at 1×. stp, 1 Nov 08:50 CET: "Yes, restart the mini node and launch the 3x step".
- **Change vs a14: rate 5 → 15 per family (3×), window 2 h → 30 min, mini kaspad restarted fresh, mini RAM guard.** Same code, kits, lanes, families (4) and lane funding targets as a14. Landing rule unchanged (99 %); the proposed rule (≥ 98 %, ≤ 5 s missed in a row) is scored alongside.

## Mini kaspad restart (stp's OK, 1 Nov 08:50 CET)
- Same procedure as 31 Oct (RUNBOOK 13): Ctrl+C to the kaspad console (`AttachConsole` + `GenerateConsoleCtrlEvent`) at **07:52:46Z**, `Kaspad has stopped...` at **07:52:49Z** (3 s, graceful). Restarted **07:52:58Z** from its own unchanged start script: same TN10 args, data dir, `--ram-scale 0.4`, `--utxoindex`. Desk kaspad untouched (up since 30 Oct).
- Memory, mini (12 GB): before kaspad private **7.60 GB** (working set 3.95 GB), free RAM **2,077 MB**, free virtual 2.6 GB. After: 20 s private 0.49 GB / free **6,983 MB**; 08:05Z private 0.90 GB / free 6,166 MB; 08:08Z free 5,836 MB (checklist 20: ≥ 2 GB, pass).
- Side effect as on 31 Oct: the mini mempool was emptied (pre-START census 08:07Z: mini 0 entries / 0 own).

## Preflight (08:00–08:08Z)
- Clocks vs pool.ntp.org: desk +3.4 ms, mini +21.6 ms. Both kaspad synced (desk/mini `PREFLIGHT_GENESIS` and desk guard run against them).
- Desk NIC (checklist 18): I226-V up at 1 Gbps; the only `e2fnexpress` 27/32 events in the last 8 h are the planned 23:54–23:55Z reset (a14).
- Funding 07:53–08:05Z (`fund-lanes15.mjs` = a14 script, targets as a14, min coins 450 → 600; 78 txs + 1 prep tx, fees 1.40 tKAS, 0 retries): desk **1,501 coins / 18,405 usable tKAS**, mini 1,072 / 10,351, muon 1,427 / 12,660, boson 4,183 / 36,803. a14 burned ≈ 29.7 k usable tKAS on boson in 2 h at 1×; 30 min at 3× ≈ 0.75 × that if hops scale with rate.
- Pre-launch RBF sweep (dry run) 08:07Z: desk 1 own (no live input, the old leftover), mini 0. Pre-START census (`--save-pre`): desk 1 own (2 in mempool), mini 0 (0).

## RAM guard (new, `tools/storm/ram-guard.mjs` + `ram-guard-recv.mjs`)
- Mini: free RAM logged every 5 s (`ram-guard.csv`). Armed START−60 s to END: **2 reads in a row below 1,024 MB** → mini `control/STOP` (coordinator) and an authenticated POST to the desk receiver (port 18601, handoff token) → desk `control/STOP` (all senders exit). Both sides log `RAM_GUARD_TRIP` / `GUARD_STOP` in `phase.log`. Desk health check from the mini at start: 200.

## Launch
- Desk `desk-a11.ps1` (kit10, pwsh 7, detached) 08:07:37Z, `GUARD_PRE exit=2 refused=1`. Mini `mini-a8.ps1` (kit8, detached) 08:08Z, `PREFLIGHT_GENESIS exit=0`, guard on 08:08:18Z.
- Config: tag s3a15, 4 families, **rate 15**, lanes desk/mini/muon/boson, `usable_min_tkas` desk 16,000 / mini 9,000 / muon 11,000 / boson 32,000. **Family check 08:25Z, START 08:35:00Z (09:35 CET), END 09:05:00Z (10:05 CET)**, RBF sweep END+75 s / 3 / 6 min, census END+10 min, recovery to 09:25Z.

## First slot aborted (muon public node down), no hop sent
- Mini genesis 4 families 08:24:56–08:24:59Z, `HANDOFF ok` 08:24:59Z, desk `HANDOFF seen_on_desk` 08:25:02Z.
- Desk `PREFLIGHT exit=20` 08:25:28Z → `LAUNCH_ABORT reason=preflight`: lane muon `err=timeout` (desk, mini, boson pass: 1,501 / 1,072 / 4,183 coins; clock +1.6 ms). Manual preflight 08:26Z: muon timeout again. From the box the public muon endpoint gave no HTTP answer at all from 08:27 to 08:38Z (boson answered), so the public node is down, not our side.
- Stopped cleanly 08:27Z: mini orchestrator, coordinator, broker, post-end, watch, RAM guard; desk orchestrator, receiver, watch, post-end, guard receiver. Both run dirs kept as `step3-a15-abort1`. No sender ever started; kaspad untouched (mini still on the 07:52:58Z restart).
- Mini free RAM by then: 4,664 MB at 08:24Z (5,836 MB at 08:08Z): the fresh node is warming up.
- Relaunch needs muon back (fresh genesis, new slot), or a decision to run step 4 on 3 lanes.

- Relaunch check 09:21–09:22Z (scheduled): public muon node still down. 5 HTTP probes from the box timed out at 8 s with no answer and a WebSocket upgrade timed out at 10 s; boson answered every probe (101 on upgrade). No relaunch: running step 4 on 3 lanes is stp's call. Nothing started on desk or mini; kaspad untouched.

## Second slot: 3 lanes, muon skipped (stp decision, 1 Nov 11:49 CET: "If down. Skip it.")
- Muon public node still down at 10:50Z (no HTTP answer). **muon removed from `lanes` and `senders` in both run configs: lanes desk, mini, boson. Not comparable with a14 (4 lanes).** Families stay 4, rate 15, 30 min.
- Mini (checklist 20): free RAM **2,354 MB** at 10:50Z (kaspad private 5.06 GB, up since the 07:52:58Z restart), 2,061 MB at 10:51Z after the run processes started. Clock +20.4 ms.
- Desk preflight 10:50:43Z: desk 1,501 coins / 18,405 usable (min 16,000), mini 1,072 / 10,351 (9,000), boson 4,183 / 36,803 (32,000), all synced, RPC 21 / 5 / 79 ms, clock +0.7 ms. Desk NIC up at 1 Gbps, 0 `e2fnexpress` events in the last 10 h (the planned 23:54Z reset is just outside that window).
- Sweep dry run and pre-START census 10:50Z: desk 0 own (1 in mempool), mini 0 own (1). The old desk leftover has left the mempool.
- Launch: desk `desk-a11.ps1` 10:50:56Z, `GUARD_PRE exit=2 refused=1`, guard receiver health 200. Mini `mini-a8.ps1` 10:51Z, `PREFLIGHT_GENESIS exit=0`, RAM guard on 10:51:33Z (desk health 200).
- Tag s3a15b. **Family check 11:05Z, START 11:15:00Z (12:15 CET), END 11:45:00Z (12:45 CET)**, recovery to 12:05Z.

## Run (second slot)
- Mini genesis + `HANDOFF ok` 11:04:59Z, desk `PREFLIGHT exit=0` 11:05:05Z, `guard exit=0`, `LAUNCH exit=0` 11:05:09Z.
- **START 11:15:00Z (12:15 CET)** (`START senders=desk,mini,boson families=4 rate=15`). **END 11:45:00Z (12:45 CET)**, `SENDERS_EXITED left=0` 11:45:03Z. RBF sweep END+75 s / 3 / 6 min: 0 own tx on either node, nothing to replace. Census 11:55:07Z, `RECOVERY_DONE` 12:05Z on both.
- **RAM guard: no trip.** Mini `RAM_GUARD off tripped=0` (11:45:07Z), no `RAM_GUARD_TRIP` in the mini phase log, no `GUARD_STOP` in the desk phase log. Mini free RAM ([ram-guard](data/ram-guard-mini-a15.csv)): **2,180 MB at START, minimum 1,661 MB (11:29:51Z), 1,841 MB at END**, 0 of 360 window reads below 1,024 MB (0 below 1,500). After scoring (~12:25Z): 2,333 MB free, kaspad private 5.15 GB (up since the 07:52:58Z restart).
- Network: 0 desk `e2fnexpress` events from 10:40Z to scoring, adapter up at 1 Gbps; both nodes 8 peers and synced in every window row; 0 `SENDER_OFF`. The mini NCSI log shows 5 entries 4042 with an invalid timestamp (year 2096) that cannot be placed in time; nothing in the run logs points to a network loss.
- Housekeeping: the desk RAM-guard receiver (port 18601) was still running after `RECOVERY_DONE`; stopped at scoring (~12:25Z). Nothing else stopped by hand; kaspad untouched on both machines.

## Result · scored Sun 1 Nov 2026, ~13:25 CET · **9/10 (strict and under the proposed rule)**

**Not comparable with a14:** 3 lanes instead of 4 (muon skipped), 30 min instead of 2 h, rate 15 instead of 5, fresh mini kaspad.

`score.mjs` (on the box, from logs copied read-only from desk and mini) + `mempool-ours.jsonl`; recount on the mini after END (`recount.mjs`, kit8). Gap lengths from the same hop log (counts only). Data: [data/](data/) (counts only, no ids).

| # | Criterion | Result | Numbers |
|---|---|---|---|
| 1 | Pre-checks (clock, sync, peers, disk) | PASS | desk clock +1.2 / +1.6 ms (10:50Z), −1.3 ms preflight, +1.0 ms after END; mini +26.8 ms (10:51Z), +6.8 ms after END (rule: within 100 ms); synced, 8 peers |
| 2 | Every lane every second | PASS | desk 1,800 · mini 1,800 · boson 1,800 of 1,800 s |
| 3 | Landing ≥ 99 % of seconds | **FAIL** | **97.50 %** (1,755 / 1,800), 45 missed in 38 gaps (36 single seconds, one 5 s at 11:33:10Z, one 4 s at 11:42:34Z). Per 5 min: 7 9 4 14 3 8 |
| 3′ | *Proposed rule (not adopted): ≥ 98 % and no more than 5 s missed in a row* | **FAIL** | longest run 5 s passes, but 97.50 % < 98 % |
| 4 | Non-contention errors ≤ 1 % | PASS | desk 0 / 107,996 · mini 0 / 107,992 · boson 0 / 107,678. Contention: desk 96,929 (89.8 %), mini 96,948, boson 96,663 |
| 5 | Desk lane | PASS | 0 errors, attempts in 1,800 / 1,800 s; share **2.10 %** (reported) |
| 6 | Other lanes | PASS | mini and boson every second, 0 errors; shares mini 4.63 %, boson 93.28 % (reported) |
| 7 | Node RPC p95 < 50 ms, max < 250 ms | PASS | desk p95 2, max 17 ms; mini p95 2, max 27 ms. Sender RPC (reported): desk p95 1 / max 32, mini 57 / 655, boson 43 / 2,511 ms |
| 8 | Logs every 5 s | PASS | 359 / 360 node-watch rows in the window, max gap 5.017 / 5.042 s; 0 unsynced rows, peers never below 8 |
| 9 | 0 own tx at END + 10 min | PASS | 11:55:07Z: desk 0 own (1 in mempool), mini 0 own (0). **Strict 0** (the old desk leftover is gone since the mini restart) |
| 10 | Handoff, guard, post-end, recount | PASS | `GUARD_PRE exit=2 refused=1`, `HANDOFF ok`, preflight 0, `RECOUNT_OK rows=4`, `RECOUNT_MATCH hoplog=11027 recount=11031 diff_pct=0.036` |

**Score: 9/10** (3). Under the proposed landing rule also 9/10 (3′ fails on the 98 % part).

**Hops:** recount **11,031 = 6.13 hops/s** (f1 2,788 · f2 2,764 · f3 2,752 · f4 2,727); hop log 11,027 lines, all unique, 239 back-fill, 34 resync, 0 revert. Landed (non-back-fill) per 10 min (hops/s): 5.92 5.90 6.16.
**3× rate did not triple the hops.** Attempts per lane went to ≈ 60/s (3×), but landed hops rose only to 6.13/s (a14 5.57/s at 1×, 4 lanes). Contention rejects are ≈ 90 % of attempts (a14 ≈ 70 %). Each family still lands ≈ 1.5 hops/s, so the family chain (one hop per accepted parent), not the send rate, sets the ceiling. More rate mostly adds races and lowered landing (97.5 %).
**Freezes / stalls:** 0 `STALL`, 0 `PROC_EXIT`, 0 `SENDER_OFF`, 0 `TIP_BACK`, 0 `POOL_LOW`, 1,085 `UNACCEPT`. Longest all-family landing gap 5.4 s (11:33:09Z, all 4 families at once). Sender stderr empty; mini coordinator stderr only the 34 resync lines.
**Mempool:** desk 1–58 before START, 1–56 during, 1–51 after; mini 0–58 / 0–54 / 0–51 (other people's TN10 traffic).
**Pools (coins > 3 tKAS, start → min → end):** desk 1,501 → 1,137 → 1,261, mini 1,072 → 705 → 832, boson 4,183 → 3,058 → 3,265. 0 `POOL_LOW`.

### What failed and why
- **Criterion 3 (97.50 %).** No outage, no freeze, no guard trip: 36 of 38 gaps are single seconds, plus one 5 s and one 4 s gap where all four families paused together. Lower than every 1× run (a7–a14: 98.31–99.49 %); at 3× the lanes mostly race each other (≈ 90 % contention). Rule unchanged.

### What worked
- Mini memory held at 3× after the restart (min 1,661 MB, guard never armed near the limit). Node RPC stayed fast on both nodes. 0 non-contention errors on all lanes, 0 own tx left, recount matched to 0.036 %.

### Next ladder step (proposal for stp)
Rate is not the lever: 3× the attempts gave ≈ +10 % hops and cost landing. Proposed step 5: **8 families at 1× rate (rate 5), 30 min**, same lanes (muon back in if its public node answers), mini RAM guard on, fresh genesis for 8 families; fund lanes to the a14 targets and check the mini still has ≥ 2 GB free at launch. More families should raise hops/s roughly in proportion if the per-family ceiling (≈ 1.5 hops/s) holds.
