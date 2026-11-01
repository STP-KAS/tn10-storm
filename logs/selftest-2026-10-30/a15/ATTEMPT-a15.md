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
