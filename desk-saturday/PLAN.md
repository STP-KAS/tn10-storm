> **Experimental. We are just trying this.** [Disclaimer](../DISCLAIMER.md) · Kaspa Testnet-10 only. Counts only.
>
> Proposed. Not armed. For Kaspa Pulse to check against his counter, and for Grokbot to push back first. Slot: **Saturday 7 Nov 2026, START 19:00:00Z**. Same hour as Thursday 29 Oct. The 5 Nov landing chase did not change this plan. See [CHASE.md](CHASE.md).

# Saturday plan

One sender (the desk), from the first second of each step. The mini counts. The box does not send. Relay to boson is on, as in a23. One rate: **1.0 accepted hop/s per family**.

## Before 18:40Z

Done in this order. A fail here aborts. No hop is sent.

| Check | Pass |
|---|---|
| Desk and mini nodes synced, on TN10 | yes |
| Peers on each | ≥ 8 |
| Clock vs NTP, desk and mini | within 80 ms. Measured on the desk 5 Nov 09:12Z: +1.3 ms. Measure again at 18:40Z |
| Box clock | one NTP sample. The box is not a sender and not a counter. A bad box clock is logged and does not abort. A missing sample is logged too |
| Family ids | private file written, and the SHA-256 of each id delivered the same way as 29 Oct, before 18:40Z. On 29 Oct they arrived during the run |
| Miner lines | one line per machine, `MINERS <machine> n=<count>`. Miners stay off. A miner found running stops the launch for a decision |
| Boson relay | a connect check. If boson does not answer, abort. a22 without the relay could not hold 1.0 (f4 was 0.83/s) |
| Desk lane | at least 2,500 coins and 18,000 tKAS usable. a23 went from 1,511 coins to 847 on about 6,000 included hops. Saturday's ceiling, if f8 runs, is about 17,000 included hops. The lane is topped up before genesis. This plan does not move coins |
| Own mempool | census saved, so criterion 9 can separate leftovers from new txs |

Genesis at 18:55Z for 8 families, so f8 can start without a second genesis. The sender refuses to start without the handoff, as in the rehearsal.

## Counted steps

Sender on at `from`, off at `to`. Rate is attempts per family per second, capped, and the number we publish is accepted hops per family per second over the whole step.

| Step | UTC | Families | Rate | Seconds |
|---|---|---:|---:|---:|
| f1 | 19:00:00–19:15:00 | 1 | 1.0 | 900 |
| gap | 19:15:00–19:20:00 | 0 | 0 | 300 |
| f2 | 19:20:00–19:35:00 | 2 | 1.0 | 900 |
| gap | 19:35:00–19:40:00 | 0 | 0 | 300 |
| f4 | 19:40:00–19:55:00 | 4 | 1.0 | 900 |
| gap | 19:55:00–20:00:00 | 0 | 0 | 300 |
| f8 | 20:00:00–20:15:00 | 8 | 1.0 | 900, only if f4 is clean |
| gap | 20:15:00–20:20:00 | 0 | 0 | 300 |

A minute is valid when the desk sender attempted at least once in every second of that minute. The Thursday gap was minutes with a sender missing. There is one sender in this plan, and it is required from second 0 of f1, f2, f4 and, if it runs, f8.

### f4 clean, which opens f8

All three, over 19:40–19:55Z:

- an attempt in every one of the 900 seconds, first attempt by 19:40:01Z
- accepted hops per family per second ≥ 0.95
- no sender-off, pool-low, node-drop or proc-exit

Landing percent is logged (`GATE_F4`) and is not part of this decision. The internal score still fails a run under 99% landing. That fail stays visible. It does not delete the 8-family step.

The gate decides by 19:55:03Z, inside the gap. The rule is `f8Clean` in [gate-rule.mjs](gate-rule.mjs). The kit copy happens after review: `gate.mjs` and `gate-rule.mjs` from this folder replace the kit's `gate.mjs` (the launcher starts `node gate.mjs`).

If f4 is not clean, f8 is skipped and the ramp below starts at 20:00:00Z instead of 20:20:00Z. Same ten steps.

## Ramp, 10 minutes

Four families. Offered rate starts at the hold and rises by 0.1/s. Each step is 50 seconds on and 10 seconds off. The off gap is where the gate decides (end of step + 3 s). Two gains in a row under 3% write `SKIP` for every later step, and those steps never open.

If f8 ran, the block is 20:20:00–20:30:00Z:

| Step | From | To | Rate |
|---|---|---|---:|
| r1 | 20:20:00 | 20:20:50 | 1.0 |
| r2 | 20:21:00 | 20:21:50 | 1.1 |
| r3 | 20:22:00 | 20:22:50 | 1.2 |
| r4 | 20:23:00 | 20:23:50 | 1.3 |
| r5 | 20:24:00 | 20:24:50 | 1.4 |
| r6 | 20:25:00 | 20:25:50 | 1.5 |
| r7 | 20:26:00 | 20:26:50 | 1.6 |
| r8 | 20:27:00 | 20:27:50 | 1.7 |
| r9 | 20:28:00 | 20:28:50 | 1.8 |
| r10 | 20:29:00 | 20:29:50 | 1.9 |

a23's acceptance was already flat at about 1.32/s per family under offered rates 5, 6 and 8. This ramp should stop within a step or two of that, if the network is the same. We stop there.

## Private submit file

On the desk only, not in this repo:

`submit_utc, accept_utc, family, step, txid`

`accept_utc` is the accepting header time. One row per included hop. Kaspa Pulse uses it to compute submit → acceptance under load. The public write-up after the run carries p50, p95 and p99, and the accepted hops per family per step. No txid in the repo.

Rehearsal figure, a23, fixed steps, same join: p50 564 ms, p95 1,028 ms, p99 1,290 ms (4,120 hops). Saturday measures it again at 1.0/s.

## After END

- Mini recount file copied to the desk before scoring. a23 could not score criterion 8 without it.
- Census of our own mempool txs at END+10 min, desk and mini. Pass is 0 new since START.
- Recovery watched for 20 minutes.
- Score with the existing one-lane scorer, rules unchanged. Publish the score beside his minute count, including a miss on the 99% landing line if there is one.

## What his counter should see

Base load stays in his network count, as on every storm since he set that figure (about 56 tx/s). Our own addition is the hops above. Per complete UTC minute, by block time, the same way he counted 29 Oct:

- 19:00–19:14: one family, about 1.0 hop/s of ours if the rate holds
- 19:20–19:34: two families, about 2.0
- 19:40–19:54: four families, about 4.0
- 20:00–20:14: eight families, about 8.0, only if f4 was clean
- the ramp minutes: four families, acceptance per family rising by small amounts and then flat

Gaps should show base load and no hops from us. If a gap contains our hops, the sender failed to stop and the step boundaries in his count will smear. That is a fail on our side.

## Same as the rehearsal, left alone

Heartbeat 900 ms, stagger 300 ms, de-lock, fee and mass caps, node-dead rule, loopback desk node, no miner, no box sender, no edit to the scorer. The 10 criteria in RUNBOOK 21 still apply after the run.
