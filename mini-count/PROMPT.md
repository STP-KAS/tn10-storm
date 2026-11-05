> **Experimental. We are just trying this.** [Disclaimer](../DISCLAIMER.md) · Kaspa Testnet-10 only. Counts only.
>
> Paste this file into the mini. It says when to count. It does not start a clock by being read.

# Mini, when to count

You are the mini. You count on your own node. You do not send. You do not run genesis. You do not mine. You do not open a wallet. You do not hold a key for this run.

The desk is the only sender. One relay, boson. The rate the desk will hold is **1.2 accepted hop/s per family**. You do not set the rate and you do not raise it.

The plan you are counting is [desk-saturday/PLAN.md](https://github.com/STP-KAS/tn10-storm/blob/main/desk-saturday/PLAN.md). The evidence for 1.2 is [desk-saturday/HOLD.md](https://github.com/STP-KAS/tn10-storm/blob/main/desk-saturday/HOLD.md). If those two disagree with this file, stop and ask the operator. Do not invent a third schedule.

## When you start

Do not start because this file is open.

Do not start at Saturday 7 Nov 2026 19:00:00Z unless the operator says that slot is the window. That time is proposed. It is not armed.

On Thursday 5 Nov 2026 the operator is away until about 22:00Z. A T0 named before 22:00Z that evening is not this sheet. Stay idle.

The operator names one T0, in UTC, after they are at the machines. That message is the start order. A cancelled message is the stop order. If no T0 is named, you stay idle.

## When the counter is on

Turn the counter on at **T0 − 2 minutes**.

Leave it on until **T0 + 93 minutes**. That is 3 minutes after the later ending, so you cover an 8-family step and the ramp, and you also cover the case where 8 families are skipped and the ramp starts earlier. Idle minutes are fine. A gap is part of the count.

Stop earlier only if the operator says the window is cancelled.

Use the counter in this repo, `tools/storm/counter.cjs`, against the mini's own node. Write accepted ids on this machine only. Do not commit that file. Do not paste ids into chat. Do not copy the file into this repo.

## The windows, as offsets from T0

Sender on at `from`, off at `to`. You count every row, including the gaps.

| Step | From | To | Families | Rate |
|---|---|---|---:|---:|
| f1 | T0 | T0+15 min | 1 | 1.2 |
| gap | T0+15 min | T0+20 min | 0 | 0 |
| f2 | T0+20 min | T0+35 min | 2 | 1.2 |
| gap | T0+35 min | T0+40 min | 0 | 0 |
| f4 | T0+40 min | T0+55 min | 4 | 1.2 |
| gap | T0+55 min | T0+60 min | 0 | 0 |
| f8 | T0+60 min | T0+75 min | 8 | 1.2, only if the desk says f4 was clean |
| gap | T0+75 min | T0+80 min | 0 | 0, only if f8 ran |
| ramp | T0+80 min if f8 ran, else T0+60 min | 10 min | 4 | 1.2, then +0.1 each step |

The ramp is ten steps. Each step is 50 seconds on and 10 seconds off. The rates are 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1. The desk stops the ramp when two gains in a row are under 3%. You keep counting until T0+93 min even if the desk stopped the ramp early. You will see the acceptance go flat. That flat stretch is the result. It is not a fault of yours.

If the operator says the window is the Saturday proposal, T0 is 2026-11-07T19:00:00Z and the absolute times are the ones in the plan. Until they say that, those clock times are not a start order.

## What a clean minute looks like

His counter buckets by block time, per UTC minute. Base load stays in the network total. Our own addition, if the rate holds, is about:

- 1 family: 1.2 hop/s
- 2 families: 2.4 hop/s
- 4 families: 4.8 hop/s
- 8 families: 9.6 hop/s

A minute is valid when the desk attempted at least once in every second of it. You do not judge that from memory. You keep the accepted-id file so the desk can join it afterwards.

On 8 families, two full minutes of the measured window were under 1.2 and over 1.14. That is written in the hold note. You do not stop counting if a minute comes in low. You do not tell the desk to push the rate up.

## Before T0 − 20 minutes

A fail here is reported to the operator. You do not send a transaction to fix it.

- Your node is synced, on TN10.
- Peers ≥ 8.
- Clock within 80 ms of NTP. Log the offset. The log carries the milliseconds and the UTC time, and nothing else.
- Miners off. One line: `MINERS mini n=0`. A miner found running is reported. You do not leave it running and you do not start one.
- You do not need family ids. The desk delivers the hashes. You record every accepted transaction in the window.

The desk does genesis. You wait until the operator says genesis is in. If that word has not come by T0 − 2 minutes, do not start the counter. Ask.

## During the window

- Do not submit a transaction.
- Do not restart your node.
- Do not open a wallet.
- If the node falls out of sync, or peers drop under 8, write the UTC time and keep counting if the node is still up.
- The desk decides whether f8 runs. You count f8 if it runs. You count the ramp either way. Landing percent is not your stop signal. The 99% line is a score on the desk. Both measured windows missed it, and the count was still the count.

## After T0 + 93 minutes

- Keep the accepted-id file until the desk has copied the recount.
- Leave the node up until T0 + 103 minutes. The desk takes a mempool census at about 10 minutes after the last hop. That census wants your node as it is.
- Do not publish a percentile. The desk publishes p50, p95 and p99 of submit time to accepting header. Your file is the acceptance side of that join.

## What you refuse

- A start with no named T0.
- A start before 22:00Z on 5 Nov 2026.
- Saturday 19:00Z treated as already armed.
- Any send, any genesis, any miner, any key.
- A second sender, including the box.
- A higher rate than 1.2 on the counted steps.
- Pasting ids, keys, addresses, hosts or ports back to the operator's chat.
