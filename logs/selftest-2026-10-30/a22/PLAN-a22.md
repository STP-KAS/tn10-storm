# a22 plan (desk-only, prepared 3 Nov 2026, NOT armed)

Base: `../a19/PLAN-a19.md` (Saturday plan: f1/f2/f4 8 min each with 2 min gaps, f8 if f4 clean, ramp 5/6/8/10/12 per s with the 2×<3 % stop rule, mini counts only). Scored with `tools/storm/score-solo.py` against RUNBOOK 21.

## The three criteria a19–a21 failed (exact RUNBOOK 21 wording)
- **2. On from the first second** (Pulse 1): in every counted step the desk's first submit is within 1 s of the step start, and every second of the step has ≥ 1 submit attempt.
- **3. One held rate** (Pulse 2): each step's achieved submits per family per s ≥ 95 % of its configured rate across the full window (no throttling, no POOL_LOW). (Scorer: accepted-ok submits per family per s, fixed steps only.)
- **4. Landing**: ≥ 99 % of counted seconds have ≥ 1 accepted own hop (coordinator seen time). (3 Nov change: f1 judged on union landing; f2/f4/f8 per step.)

## Root causes from a21 run data (private submit/hop files)
**Criterion 2 (f1 432/480).** f1 made 577 attempts: 421 fire-on-new-tip attempts (all 421 ok) and 156 tick attempts (all rejected: 107 already_spent, 49 orphan, i.e. sent on a tip that had not moved). All 261 gaps > 1 s between f1 attempts start right after an ok fire (gap p50 1.08 s, max 1.59 s). Cause: a fire debits the family's token bucket to −1, so at 1.2/s the next tick comes 1.67 s later; the next fire only comes when the hop is accepted, which took ≈ 1.0 s in daytime (≈ 0.57 s at night). Any second that falls between the two has no attempt. RPC (max 20 ms) and catch-up (max 3 ms) played no part.
**Criterion 3 (0.79–0.88 vs ≥ 1.14).** One family is one chain; a hop can only be built on an accepted tip, so ok hops per family per s ≤ 1 / (submit→acceptance cycle). Daytime cycle ≈ 1.0–1.2 s caps it near 0.85–1.0/s; the extra ticks on the unmoved tip are contention rejects and do not count. At night (a17: 1.36–1.44) the same kit passes at 1.2/s. So at 1.2/s criterion 3 is reachable only when latency is ≈ < 0.8 s.
**Criterion 4 (f1 81.5 %, f2 90 %, f4 90 %, union 88.5 %).** Same cap: with ≈ 0.85 ok hops/s per family and acceptances bunched in shared blocks, 10–18 % of seconds get no accepted own hop. Note: even at night (a16–a18) landing was 95.6–98.3 %, so the evening slot alone is not expected to reach 99 %.

## Changes for a22
1. **Kit (no criteria change):** `sender.mjs` heartbeat: `heartbeat_ms: 900` in the a22 config. If a family has had no attempt for 900 ms (and no fire in flight) it attempts on the cached tip. Expected: criterion 2 480/480 on every step. Cost: more contention rejects (excluded from crit 7 by the 3 Nov rule). Default 0 = old behaviour.
2. **Slot:** evening, earliest **today 3 Nov 21:30 CET** (a16 slot; a16–a18 latency ≈ 0.57 s). Rate stays 1.2/s per family, stagger 300 ms, everything else identical to a19–a21.
3. **Funding:** desk lane 7,009 usable / 1,479 coins, minimum 9,000. Top-up prepared (dry-run only): 257 × 16 tKAS = 4,112 tKAS from the prepared 700-tKAS treasury coins (≈ 7 of 50). To be sent before arming, then re-checked ≥ 9,000 usable.

## Needs stp's yes (not applied)
- **Criterion 3 / plan rate:** if a daytime slot is wanted, rate 1.2 → 0.8/s per family (target then 0.76). That changes Pulse's Saturday rate, so it needs stp (and Pulse). Not done; a22 keeps 1.2.
- **Criterion 4:** with one chain per family, ≥ 99 % per-step landing has not been reached in any run (best 98.3 %). Options: (a) more chains per family (kit + test-shape change), or (b) a lower landing target. Either is a criteria/plan change. Not done.
- Arming the desk task and broadcasting the top-up: waiting for go.

## Expected
Crit 2 fixed by the kit change; crit 3 likely to pass in the evening slot; crit 4 likely still 97–98 % without one of the changes above. Honest forecast: 9/10.

## Daytime latency: what our data shows and what it can't decide (correction to SCORE-a21 fact 5)
stp: TN10 network load is always about 60–70 TPS and the only high loads come from us, so outside network load is not the cause. SCORE-a21 fact 5 ("outside our node") is withdrawn as a cause. It only describes where the time is spent: after the desk RPC returned ok and before the accepting block's header.

What the run data shows:
- **Our rejects don't cause it.** Median latency of ok hops sent right after one of our own rejects vs right after an ok hop: a17 568 vs 557 ms, a18 618 vs 584, a19 1,013 vs 891, a20 1,028 vs 1,034, a21 1,010 vs 999. Inside each run the gap is small. Between the night and day runs the step is about 0.45 s, and it's there even after an ok hop.
- **Our send pattern doesn't cause it.** Fire and tick attempts have the same latency within each run. f1 (one family, nothing to stagger) moved the same as f4. Our transactions per block went down, not up.
- **The desk node side looks the same.** RPC p50 is 1 ms and p99 is 2–7 ms in all runs. The miner count on the desk is 0 in all runs. Block interval is about the same.

What the data can't decide, because it wasn't recorded: desk peer count and which peers relay our transactions, mini mempool first-seen time (that would split propagation from inclusion), the network's miner mix by hour, and desk host load (other processes, the devnet, Windows scheduled tasks). This is the open question. Day vs night is the only factor that lines up, and the data can't name the cause behind it.

**Added capture for a22 (read-only, nothing restarted):** desk peer info (count, per-peer ping) every 60 s; mini mempool first-seen time per own txid (desk→mini propagation); desk host CPU and the top processes every 10 s (including devnet pids, only observed); and the miner payout script of each accepting block, to get the miner mix by hour. If a22 (evening) comes in at about 0.57 s again, one daytime capture run is needed to compare the same fields.
