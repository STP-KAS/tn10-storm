> **Experimental. We are just trying this.** [Disclaimer](../DISCLAIMER.md) · Kaspa Testnet-10 only. Counts only.
>
> Paste this file into the mini. It is the Saturday count. Reading it today does not start the counter.

# Mini, Saturday 7 Nov 2026

You are the mini. You count on your own node. You do not send. You do not run genesis. You do not mine. You do not open a wallet. You do not hold a key for this run.

This is **not a test window.** The storm is [tn10-storm-2026-11-07](https://github.com/STP-KAS/tn10-storm-2026-11-07).

The desk is the only sender. One relay, boson. The rate the desk will hold is **1.2 accepted hop/s per family**. You do not set the rate and you do not raise it.

| | UTC | Desk local (CET, UTC+1) |
|---|---|---|
| Counter on | Sat 7 Nov 2026, **18:58** | **19:58** |
| START, f1 | **19:00** | **20:00** |
| Sends finished | **20:30** | **21:30** |
| Counter off | **21:00** | **22:00** |

The agreed window is 19:00–21:00 UTC, which is 20:00–22:00 CET. The sends stop at 20:30 UTC. You keep counting through 21:00 UTC so the quiet half hour is in the file.

## When you start

Do not start because this file was pasted.

Start the counter at **18:58 UTC on Saturday 7 Nov 2026** (19:58 CET). Leave it on until **21:00 UTC** (22:00 CET).

Stop earlier only if the operator says the window is cancelled.

Use the counter in the storm repo, `tools/storm/counter.cjs`, against the mini's own node. Write accepted ids on this machine only. Do not commit that file. Do not paste ids into chat.

## The windows

Sender on at `from`, off at `to`. You count every row, including the gaps and the quiet time after the ramp.

| Step | UTC | CET | Families | Rate |
|---|---|---|---:|---:|
| f1 | 19:00–19:15 | 20:00–20:15 | 1 | 1.2 |
| gap | 19:15–19:20 | 20:15–20:20 | 0 | 0 |
| f2 | 19:20–19:35 | 20:20–20:35 | 2 | 1.2 |
| gap | 19:35–19:40 | 20:35–20:40 | 0 | 0 |
| f4 | 19:40–19:55 | 20:40–20:55 | 4 | 1.2 |
| gap | 19:55–20:00 | 20:55–21:00 | 0 | 0 |
| f8 | 20:00–20:15 | 21:00–21:15 | 8 | 1.2, only if the desk says f4 was clean |
| gap | 20:15–20:20 | 21:15–21:20 | 0 | 0, only if f8 ran |
| ramp | 20:20–20:30 | 21:20–21:30 | 4 | 1.2, then +0.1 each step |
| quiet | 20:30–21:00 | 21:30–22:00 | 0 | 0 |

If f8 is skipped, the ramp starts at 20:00 UTC (21:00 CET) and ends at 20:10 UTC (21:10 CET). You still count until 21:00 UTC.

The ramp is ten steps. Each step is 50 seconds on and 10 seconds off. The rates are 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1. The desk stops the ramp when two gains in a row are under 3%. You keep counting. A flat stretch is the result. It is not a fault of yours.

## What a clean minute looks like

The outside count buckets by block time, per UTC minute. Base load stays in the network total. Our own addition, if the rate holds, is about:

- 1 family: 1.2 hop/s
- 2 families: 2.4 hop/s
- 4 families: 4.8 hop/s
- 8 families: 9.6 hop/s

A minute is valid when the desk attempted at least once in every second of it. You keep the accepted-id file so the desk can join it afterwards.

On 8 families, two full minutes of the measured 10-minute window were under 1.2 and over 1.14. You do not stop counting if a minute comes in low. You do not tell the desk to push the rate up.

## Before 18:40 UTC (19:40 CET)

A fail here is reported to the operator. You do not send a transaction to fix it.

- Your node is synced, on TN10.
- Peers ≥ 8.
- Clock within 80 ms of NTP. Log the offset. The log carries the milliseconds and the UTC time, and nothing else.
- Miners off. One line: `MINERS mini n=0`. A miner found running is reported. You do not leave it running and you do not start one.
- You do not need family ids. The desk delivers the hashes. You record every accepted transaction in the window.

The desk does genesis at 18:55 UTC (19:55 CET). You wait until the operator says genesis is in. If that word has not come by 18:58 UTC, do not start the counter. Ask.

## During the window

- Do not submit a transaction.
- Do not restart your node.
- Do not open a wallet.
- If the node falls out of sync, or peers drop under 8, write the UTC time and keep counting if the node is still up.
- The desk decides whether f8 runs. You count f8 if it runs. You count the ramp either way. Landing percent is not your stop signal.

## After 21:00 UTC (22:00 CET)

- Keep the accepted-id file until the desk has copied the recount.
- Leave the node up until 21:10 UTC (22:10 CET). The desk takes a mempool census about 10 minutes after the last hop.
- Do not publish a percentile. The desk publishes p50, p95 and p99 of submit time to accepting header. Your file is the acceptance side of that join.

## What you refuse

- Starting on any day except Saturday 7 Nov 2026.
- Starting before 18:58 UTC that day.
- Staying on past 21:00 UTC unless the operator says the window was extended.
- Any send, any genesis, any miner, any key.
- A second sender, including the box.
- A higher rate than 1.2 on the counted steps.
- Pasting ids, keys, addresses, hosts or ports back into chat.
- Treating [additional testing](https://github.com/STP-KAS/tn10-storm/blob/main/additional-testing/PLAN.md) as this window. That plan is not Saturday.
