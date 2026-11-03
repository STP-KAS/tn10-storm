> Kaspa Testnet-10 only. Internal self-test, no Pulse. Running status, updated with each attempt.

# Status · 30 Oct 2026 · a6 scored 8/10 · desk clock FIXED · share rule dropped (plan 2b, 18:06 CET) · **a7 SCORED 10/10** (5.32 hops/s) · **a8 (2 h) SCORED 7/10** (5.06 hops/s, boson lane ran out of coins) · a9 9/10, **criterion 9 changed 31 Oct 07:36 CET (stp): 0 own tx at END+10 min** → a9 unconfirmed (counts not logged; 3+6 stuck own tx seen at END+75 min) · **a10 (2 h) SCORED 7/10** (5.08 hops/s; fails 3 mini node freeze, 7 desk RPC spike, 9 stuck race losers → RBF sweep fix) · **a11 (2 h) SCORED 9/10** (5.41 hops/s, best yet; only fail 3: landing 98.92 %, no freeze) · **a12 (2 h) SCORED 5/10** (5.34 hops/s; 3 home-network outages: fails 2, 3, 5, 6; plus 9: 1 new own tx) · **a13 (2 h) SCORED 7/10** (5.48 hops/s, best 2 h rate; no outage; fails 2 and 5: desk lane ran out of coins at 21:13Z; 3: landing 98.31 %) · **a14 (2 h) SCORED 6/10 strict, 9/10 without the planned NIC reset window** (5.57 hops/s, best 2 h rate; only 3 fails outside the window: landing 98.44 %) · **stp 31 Oct 23:47 CET: next is the 3× ladder** · 3× step held for mini RAM → **stp OK 1 Nov 08:50 CET: mini kaspad restarted 07:52Z (private 7.6 → 0.5 GB, free RAM 2.1 → 7.0 GB); a15 = step 4 (4 families, 3× rate, 30 min) with mini RAM guard: first slot (08:35Z) aborted at preflight, public muon node down; no hop sent; **relaunched on 3 lanes (muon skipped, stp 11:49 CET; not comparable with a14): START 11:15Z, END 11:45Z** · **a15 SCORED 9/10** (6.13 hops/s; only 3 fails: landing 97.50 %; 3× rate ≈ +10 % hops, not 3×; RAM guard never tripped) · proposed next: 8 families at 1× rate · **a16 NOT RUN** (agent usage outage 1 Nov 13:00Z–2 Nov 18:15Z, then LAN switch unplugged ~18:30Z; recovery 18:31Z clean, but mini free RAM 1,668 MB < 2 GB: held for a mini kaspad restart OK) · **stp 19:31 CET: a16 relaunched as a desk-only rehearsal for Saturday (mini = read-only counter, no restart): steps 1/2/4/8 families + 10 min ramp, first slot aborted at genesis (launch-path allow-list), re-armed for 19:30Z, genesis OK, **postponed to 3 Nov at stp's call (stopped 19:29Z before START, 0 hops)**

**[RUNBOOK](RUNBOOK.md)**: every problem a1–a7, how it was solved, and the launch checklist.

| Attempt | Score | hops/s | Main flaw |
|---|---|---|---|
| a4 | 6/10 | 4.09 | fade after 15 min (shared builder, walk pile-up) |
| a5 | 7/10 (8/10 under the 30 Oct RPC rule, record unchanged) | 2.93 | 3 families frozen on a phantom tip one hop ahead |
| a6 | **8/10** | **4.30** | desk clock −146 ms (needs admin); desk share 14.973 % (< 15 %, 3 hops short) |
| a7 | **10/10** | 5.32 | — |
| a8 (2 h) | 7/10 | 5.06 | boson lane out of coins; foreign mempool |
| a9 (2 h) | 9/10 | 5.21 | criterion 9 (foreign mempool, old rule) |
| a10 (2 h) | 7/10 | 5.08 | 3: mini node froze 40 s at the end (memory); 7: desk RPC 1,785 ms; 9: 22 own race losers stuck (fixed: `sweep-ours.mjs`) |
| a11 (2 h) | **9/10** | **5.41** | 3: landing 98.92 % (78 single empty seconds, network floor; no freeze). a10 fixes all held |
| a12 (2 h) | 5/10 | 5.34 | 3 local network outages (desk NIC link down + mini lost internet, 9–16 s each): 2, 3, 5, 6; landing 97.33 % (98.66 % outside the outages); 9: 1 new own tx with no live input |
| a13 (2 h) | 7/10 | 5.48 | 2, 5: desk lane out of coins from 21:13Z (desk landed 22.6 %, twice a12's share); 3: landing 98.31 % (single empty seconds, no outage). 9 passed (0 new own tx) |
| a15 (30 min, 3×, 3 lanes) | **9/10** (also 9/10 under the proposed rule) | 6.13 | 3: landing 97.50 % (36 single empty seconds + one 5 s and one 4 s gap; no outage, no freeze). 3× rate gave only ≈ +10 % hops (contention ≈ 90 %). RAM guard not tripped (mini min 1,661 MB free). Muon skipped (stp): **not comparable with a14** ([ATTEMPT-a15](logs/selftest-2026-10-30/a15/ATTEMPT-a15.md)) |
| a14 (2 h) | 6/10 strict · **9/10 without the planned NIC window** · 10/10 under the proposed landing rule without it | **5.57** | 2, 5, 6: stp's planned desk NIC power-management fix + adapter restart (23:54:11–23:55:26Z, 15 lane-seconds, 441 rpc rejects, all in the window); 3: landing 98.44 % (98.53 % outside the window, 88 single empty seconds, longest 5 s). Desk funding fix held (0 POOL_LOW), 9 passed (0 new own tx) |
| a16 (desk-only, 50 min) | 7/10 | — | 3: 5/s per family cannot be held (one chain ~1.5 hops/s); 4: landing 95.6–98.3 %; 7: ok ratio 30 % from over-driving. f8 gated off |
| a17 (desk-only, 50 min, 1.2/s per family) | 7/10 | — | 2: 467–471 of 480 s attempted; 4: landing 96.9–97.7 %, families phase-locked (f4: 579 of 707 accepting blocks carried all 4); 7: ok ratio 97.55 %. f8 gated off. [SCORE](logs/selftest-2026-10-30/a17/SCORE-a17.md) |
| a18 (desk-only, 50 min, de-lock) | 6/10 | — | De-lock worked (f4 all-four blocks 579/707 → 129/842; union f4 98.33 %, ramp 99.17–100 %) but cost rate: 3: f4 1.07/s; 2: f1 463/480; 4: f1 95.83, f2 97.29, f4 98.33; 7: ok 97.16 %. a19 waits for stp (f1 criteria). [SCORE](logs/selftest-2026-10-30/a18/SCORE-a18.md) |

a6 (15:00–15:30Z): no freeze. 3 phantom tips, each recovered in ~5.4 s. 843 `UNACCEPT`, 0 `STALL`. Landing seconds 99.22 %, node RPC p95 4 / 2 ms. `RECOUNT_OK rows=4` (7,732 vs hop log 7,734). [ATTEMPT-a6](logs/selftest-2026-10-30/step3-base/ATTEMPT-a6.md) · [REVIEW](logs/selftest-2026-10-30/step3-base/REVIEW.md)

## Open flaws and issues
- **Landing-seconds floor (a13, criterion 3):** 98.31 % with no outage, no freeze, 108 of 112 gaps single seconds. a7–a13: 99.28 / 99.49 / 99.32 / 98.85 / 98.92 / 98.66 (outside outages) / 98.31 %. The last four 2-hour runs are all below 99 %. Not fixed by code so far; the 99 % rule stays (stp's rule). [ATTEMPT-a13](logs/selftest-2026-10-30/a13/ATTEMPT-a13.md)
- ~~**Desk lane burn (a13)**~~ desk lane landed 22.6 % (a12 12.0 %) and ran dry at 21:13Z. a14: desk `usable_min_tkas` 7,000 → 16,000 (RUNBOOK 16).
- **Home network drops (a12, 31 Oct):** desk NIC link down 3 times in the run (16:14, 16:16, 16:29Z) and the mini lost internet in the same seconds; 15 such drops on the desk on 29–31 Oct. Cost a12 four criteria. stp to check router/switch/cable (RUNBOOK 15). [ATTEMPT-a12](logs/selftest-2026-10-30/a12/ATTEMPT-a12.md)
- ~~**Mini memory (31 Oct, a10)**~~ fixed 31 Oct 11:10Z with stp's OK: mini kaspad restarted gracefully, `--ram-scale 0.4`, private 13.9 → 1.8 GB. See [RUNBOOK](RUNBOOK.md) 13.
- **Stuck own txs with no live input** (1 a10 hop on both nodes, 1 a9 leftover): cannot be swept; stay until a kaspad restart. See [RUNBOOK](RUNBOOK.md) 12.
- **Landing-seconds floor (a11, criterion 3):** 98.92 % with no freeze; empty seconds are single, evenly spread, and the next second carries extra hops (6.06 vs 5.21), so no accepting chain block took our hops in those seconds. a7–a11: 99.28 / 99.49 / 99.32 / 98.85 / 98.92 %. Rule unchanged; stp's call whether 99 % stays (see [ATTEMPT-a11](logs/selftest-2026-10-30/a11/ATTEMPT-a11.md)).
- **Lane burn with the 1 tKAS token (a11):** muon fell to 8 coins and mini to 72 by END. a12 funding targets raised (RUNBOOK 14).
- ~~**Desk lane share**~~ resolved by the plan 2b criteria change (18:06 CET). a7 rehearsal 16:55–17:05Z ([REHEARSAL-a7](logs/selftest-2026-10-30/step3-base/REHEARSAL-a7.md)): fire-on-new-tip makes the desk fire first (tip age p50 221 ms) and its node accepts as many submits as boson's, but only 13 % of them land vs 76 % for boson. Share **13.191 %** (< 17 % gate). The winner is set after submit by propagation to the miners, so code cannot fix it. **stp's decision (plan 2b)**: score the desk lane like the others, or keep the rule.
- ~~**Desk clock** −146.3 ms at a6 preflight, −154.0 ms after END, −157.2 ms at 16:00Z. w32time "syncs" with time.nist.gov but does not correct the offset. The fix needs admin on the desk (the agent session is not elevated). ~~ **FIXED 30 Oct 2026, 16:45–16:47Z by stp (admin)**: NTP peer `pool.ntp.org,0x8`, manual sync, SpecialPollInterval 900, **MaxAllowedPhaseOffset 0** (the key step: Windows only steps the clock above 300 s by default), restart w32time, resync /force. Readings: −0.162 s at 16:46Z (before MaxAllowedPhaseOffset), **+0.0008 / +0.0004 / +0.0004 s at 16:47:50Z**, rehearsal preflight +2.0 ms at 16:54Z. a7 config: `clock_gate: fail`. Commands in [RUNBOOK](RUNBOOK.md) 6.5.
- **Desk lane share** 14.973 % (rule ≥ 15 %). Boson wins 67.7 % of the races, most likely because of its network position. Planned fix: fire-on-new-tip in `sender.mjs` plus `tip_age_ms` logging, rehearsed first. If that does not lift it, the share rule is stp's decision.
- **The hop log counts reverted hops** (+2 vs the recount in a6). The coordinator fix runs on the mini, so it goes to the mini bot.
- Guard refusal without a handoff was not shown again in a6 (the relaunch ran the guard after the handoff arrived).
- Mini node 24 libuv assert at exit after the wRPC disconnect (worked around by parsing preflight lines).
- Desk orchestrator must run under pwsh 7 (Windows PowerShell 5 died silently in the guard step).

## Fixed
- a6: tip step-back (proven under load: 3 of 3 phantom tips recovered), coordinator `UNACCEPT` + back probe, preflight clock gate (log mode) + genesis-key check, `proc-host-desk.csv`, broker `EPIPE`.
- After a6: `score.mjs` checks the share rule on the unrounded share (`share_exact_pct`, `share_pass`). a6 showed 15.0 for 14.973 %.

## Being done / next
1. ~~stp: admin clock fix~~ done.
2. ~~Desk: fire-on-new-tip + `tip_age_ms` (`sender.mjs`), guard-refusal hard pre-check + pwsh 7 check (`desk-a7.ps1`), 10 min rehearsal~~ done: rehearsal FAIL on the share gate (13.19 %).
2b. ~~share rule~~ decided 18:06 CET (plan 2b, dated in PLAN): desk scored like the others, all shares reported.
2c. **a7 running** ([ATTEMPT-a7](logs/selftest-2026-10-30/step3-base/ATTEMPT-a7.md)): START 17:35:00Z, END 18:05:00Z, recovery to 18:25Z. First 2 min clean: all 4 lanes 120/120 s, 0 errors, ≈ 5.3 hops/s.
3. Mini bot: hop-log revert marking + `seq` in `coordinator.mjs` (kit6).
4. a7 (same base). After the first 10/10: a **2-hour run of the same setup that must also score 10/10**, then 3× rate, then 8 families.

## Paused — Fri 30 Oct 2026, 19:35 CET (18:35 UTC)

Testing is paused at stp's request: he is using the desk for gaming and will restart the desk and its node afterwards.

- a7 ran its full window (17:35–18:05 UTC) and recovery; its logs are on disk. **Scored 10/10 at ~19:50 CET** from logs copied read-only before the restart ([ATTEMPT-a7](logs/selftest-2026-10-30/step3-base/ATTEMPT-a7.md)).
- No sender, builder or coordinator is running. The 2-hour confirmation run has not started.
- The desk clock fix (NTP via pool.ntp.org, MaxAllowedPhaseOffset 0) should survive the restart. Re-check it in preflight.
- Resume order once the desk node is back and synced: score a7, then the 2-hour run if a7 is 10/10, otherwise a8. Top up the mini genesis keys before the next launch (see RUNBOOK).

## a7 scored — 30 Oct 2026, ~19:50 CET
- **10 / 10**, the first. 9,573 hops (recount) = 5.32 hops/s, 99.28 % landing seconds, 0 non-contention errors, desk clock +5.0 / −1.1 ms, node RPC max 16 ms (desk) / 35 ms (mini), `RECOUNT_OK rows=4`.
- New open flaws (measurement only): hop log misses 220 hops skipped by coordinator resyncs; `RECOUNT_OK` checks row count, not agreement. Fix both in the next kit.
- **Next: 2-hour 10/10 confirmation run of the a7 setup.** Not launched; testing is paused until stp says the desk node is back and synced. Before launch: top up mini genesis keys, explicit kit paths.

## b1 scored — 30 Oct 2026, ~21:05 CET
Box-only senders, mini counts, desk untouched: **6/10**. 6,035 hops (3.35 hops/s), 0 errors / 121,110 attempts, landing 92.0 %, RECOUNT_MATCH (6,038 vs 6,035). Held-awake segment 19:24:30–19:50Z: 3.56 hops/s, 97.65 % landing, every second on all lanes, **no freeze**. Detached keepalive alone did not stop the box suspend. Fails: clock (known), every-second (start lost to suspend), landing. Desk 2-hour confirmation of a7 still pending stp.

## b2 scored — 30 Oct 2026, ~22:30 CET
Box-only senders, mini counts, 20-min window 21:00–21:20Z **completed**: **7/10**. 4,333 hops (recount) = 3.61 hops/s, 0 errors / 86,220 attempts, every lane 1,200/1,200 s, landing 92.83 %. **0 box freezes** (health max gap 5.03 s, 20:37–21:24Z) even though the agent session holding the box was cut off. Reconnect fix proven in rehearsal (379 ms), not needed in the run. Fails: clock (known), landing and recount (mini kaspad lost all peers 21:03:19–21:04:14; hop log not back-filled after the resync: 4,028 vs 4,333). [ATTEMPT-b2](logs/selftest-2026-10-30/box-b2/ATTEMPT-b2.md)

## a8 running — 2-hour confirmation of a7 (started 31 Oct 2026, 00:47 CET)
stp is back from gaming and gave full control of the desk and mini. The box is not part of the run.
- Preflight: desk kaspad up and synced, desk clock **+0.7…+1.0 ms** (admin fix survived the reboot), mini synced via the tunnel (desk tunnel end restarted after the reboot).
- Mini genesis keys topped up to 4 coins each. The **boson lane key was down to 3 usable coins** (used by the box runs), caught by preflight in rehearsal 1 (safe abort); all lane keys topped up to 400.
- New in kit8: **hop-log back-fill** on resync and **`RECOUNT_MATCH`/`RECOUNT_DIFF`** (≤ 0.5 %). Rehearsal 2: `RECOUNT_MATCH` 1,833 vs 1,837 (0.22 %).
- **START 00:05Z (01:05 CET), END 02:05Z (03:05 CET)**, recovery to ~02:25Z. [ATTEMPT-a8](logs/selftest-2026-10-30/a8/ATTEMPT-a8.md)

## a8 scored — Sat 31 Oct 2026, ~03:45 CET
2-hour confirmation of a7 (00:05–02:05Z = 01:05–03:05 CET): **7/10, not passed**. Scaling stays blocked.
- **36,418 hops by recount = 5.06 hops/s** (f1 9,142 · f2 9,089 · f3 9,052 · f4 9,135). **`RECOUNT_OK rows=4`, `RECOUNT_MATCH hoplog=36415 recount=36418 diff_pct=0.008`** (kit8 back-fill works: 365 back-fill lines, 60 resyncs).
- Clean: 0 freezes/`STALL`/`PROC_EXIT`, 0 non-contention errors in 518,831 attempts, landing 99.49 %, node RPC p95 6 / 2 ms (max 17 / 26), clocks desk +4.2 / +4.5 ms, mini +8.8 / +17.1 ms, node-watch full window.
- **Fail 1+2 (criteria 2 and 6): boson lane funding pool ran dry** (first 0 coins 01:40:21Z): 39 seconds without a boson attempt (7,161 / 7,200), boson landed nothing after ~01:45Z, total fell to ≈ 4.4 hops/s for the last 20 min. Boson lands 56.6 % of hops, so it burns coins fastest (≈ 0.26 tKAS per landed hop, estimate). Fix: size lane funding to the run (boson ≥ 800 × 16 tKAS), `POOL_LOW` phase line, value-based preflight.
- **Fail 3 (criterion 9): mempool ≤ 5 not reachable**: desk 52–56, mini 676–726 after END, but the same levels were there before any sender started (since 23:06Z; a3–b2: 2–10). Identify those entries read-only; if foreign, the rule needs a dated change (stp's decision).
- Shares (reported): desk 12.35 · mini 5.43 · muon 25.60 · boson 56.63 %. [ATTEMPT-a8](logs/selftest-2026-10-30/a8/ATTEMPT-a8.md)
- **Next:** fix lane funding, settle the mempool rule, rerun the same 2-hour setup. Not launched.

## a9 running — second 2-hour confirmation (31 Oct 2026, launched 04:07 CET)
a8 scored 7/10 (boson pool ran dry 01:40Z; mempool rule vs a background of other TN10 traffic). Fixes: lanes funded for the window (boson 800, others 600), preflight on usable value, `POOL_LOW` alert. Mempool census: 0 of the backlog entries are ours (desk 52 stuck, mini ~700). Criterion 9 strict + unofficial baseline + 5 line.
**START 03:25Z (04:25 CET), END 05:25Z (06:25 CET).** [ATTEMPT-a9](logs/selftest-2026-10-30/a9/ATTEMPT-a9.md)

## a9 scored — Sat 31 Oct 2026, ~07:10 CET
Second 2-hour confirmation (03:25–05:25Z = 04:25–06:25 CET): **9/10, not passed (criterion 9 only)**. Scaling stays blocked.
- **37,487 hops by recount = 5.21 hops/s** (f1 9,401 · f2 9,361 · f3 9,404 · f4 9,321). **`RECOUNT_OK rows=4`, `RECOUNT_MATCH hoplog=37483 recount=37487 diff_pct=0.011`**. 0 freezes, landing 99.32 %, 0 non-contention errors except 32 boson WebSocket-drop rejects (0.02 %), node RPC p95 5 / 2 ms, clocks desk +1.8…+6.3 ms, mini +18.9 / +20.8 ms.
- **Funding fix worked**: no `POOL_LOW`; END pools desk 537 · mini 554 · muon 353 · boson 733. Every lane attempted in all 7,200 s.
- **Fail (criterion 9, strict)**: mempool desk 55–114, mini 676–726 after END vs pre-run 52 / 676 (foreign TN10 backlog). Unofficial baseline + 5: reached at 0 s on both (PASS), short foreign spikes later.
- Shares (reported): desk 12.54 · mini 4.57 · muon 17.29 · boson 65.60 %. [ATTEMPT-a9](logs/selftest-2026-10-30/a9/ATTEMPT-a9.md)
- **Next:** stp decides the criterion-9 rule; top up genesis keys; deploy the `clock-offset.mjs` fix; a10 = same 2-hour setup. Not launched.

## a11 scored — Sat 31 Oct 2026, ~16:00 CET
2-hour run after the a10 fixes (12:00–14:00Z = 13:00–15:00 CET): **9/10**. Scaling stays blocked.
- **38,975 hops by recount = 5.41 hops/s** (best 2-hour rate), `RECOUNT_MATCH` 0.010 %, 0 freezes/`STALL`/`PROC_EXIT`, all lanes 7,200/7,200 s, non-contention errors ≤ 0.02 %, node RPC max 17 / 16 ms (no desk spike), mini kaspad no freeze, clocks within ±20 ms.
- Criterion 9 PASS: 0 own tx new since START at END+10 min on both nodes (strict 1: the desk pre-START leftover with no live input). The RBF sweep replaced 13 losers at END+75 s, 0 failed.
- **Only fail: criterion 3, landing 98.92 %** (78 empty seconds, 6 over the limit), a network floor, not a freeze. [ATTEMPT-a11](logs/selftest-2026-10-30/a11/ATTEMPT-a11.md)
- Shares (reported): desk 4.26 · mini 12.88 · muon 17.59 · boson 65.27 %.

## a12 — next 2-hour 10/10 try (launched 31 Oct 2026, 15:58 CET)
Same setup as a11. Fix: lane funding sized to the a11 burn (`usable_min_tkas` mini 9,000, muon 11,000, boson 32,000, desk 7,000). Tag s3a12, family check 15:35Z, **START 15:45Z (16:45 CET), END 17:45Z (18:45 CET)**, census 17:55Z, recovery to 18:05Z. Scoring routine ~19:15 CET.
- Funding 14:59–15:06Z: 111 txs, fees 1.99 tKAS → desk 808 coins / 8,056 usable, mini 918 / 10,359, muon 1,028 / 12,660, boson 3,579 / 36,807. Mini genesis keys 3 coins ≥ 15 tKAS each (`PREFLIGHT_GENESIS exit=0` 14:58Z). Desk `GUARD_PRE exit=2 refused=1` 14:58Z, clock +1.6 / +2.2 ms. Pre-START census 15:06Z: desk 1 own (the old leftover), mini 0.

## a14 scored — Sun 1 Nov 2026, ~03:45 CET
2-hour run (23:45–01:45Z = 00:45–02:45 CET), a13 setup + desk lane funding: **6/10 strict, 9/10 without the planned NIC window**. [ATTEMPT-a14](logs/selftest-2026-10-30/a14/ATTEMPT-a14.md)
- **40,069 hops by recount = 5.57 hops/s** (best 2-hour rate), `RECOUNT_MATCH` 0.010 %, 0 freezes/`STALL`/`PROC_EXIT`, node RPC max 17 / 28 ms, clocks within ±30 ms, 0 `POOL_LOW` (desk funding fix held).
- **Planned NIC reset (ours, not a home-network fault):** stp's admin fix on the desk I226-V at 00:54–00:55 CET restarted the adapter twice (link down 2.7 s and 2.9 s). It cost 15 lane-seconds (desk 1, mini 14) and 441 `rpc` rejects, all inside 23:54:11–23:55:26Z → criteria 2, 5, 6 fail strictly, pass without the window.
- **Criterion 3:** 98.44 % (98.53 % outside the window); 88 of 95 gaps single seconds, longest 5 s. Proposed rule (≥ 98 %, ≤ 5 s in a row): PASS.
- **Criterion 9 PASS:** 0 new own tx at END + 10 min (strict 2 old leftovers); RBF sweep replaced 31.
- Shares (reported): desk 2.76 · mini 2.55 · muon 16.90 · boson 77.80 %.
- **Decision (stp, 31 Oct 23:47 CET, "Ok go"):** whatever a14 scores, the next step is the 3× ladder; a13/a14 accepted as proof that the setup is stable. 99 % landing wording unchanged; the proposed alternative is scored alongside.
- **3× step held:** mini free RAM 806 MB at START, 736 MB minimum, below 1 GB for the first 12 min of a14 at 1×; mini kaspad private 7.86 GB (2.84 GB after the 31 Oct restart), commit 15.6 / 18.3 GB. At 3× the < 1 GB stop rule would very likely trip early. **Next:** stp's OK for a graceful mini kaspad restart (RUNBOOK 13) right before the 3× launch, then step 4 (4 families, rate 15, 30 min) with a mini RAM guard.
