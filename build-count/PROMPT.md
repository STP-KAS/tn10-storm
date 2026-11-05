> **Experimental. We are just trying this.** [Disclaimer](../DISCLAIMER.md) · Kaspa Testnet-10 only. Counts only.
>
> Paste this file into the desk. It is the Saturday send. Reading it today does not start the sender.

# Desk, Saturday 7 Nov 2026

You are the desk. You are the only sender. You run genesis. You keep the private submit file. You do not start a second sender. The mini counts. The box does not send.

This is the Saturday storm, [tn10-storm-2026-11-07](https://github.com/STP-KAS/tn10-storm-2026-11-07). The plan is [desk-saturday/PLAN.md](../desk-saturday/PLAN.md).

One relay, boson. The rate you hold is **1.2 accepted hop/s per family**. You do not raise it on a counted step.

| | UTC | Desk local (CET, UTC+1) |
|---|---|---|
| Checks | Sat 7 Nov 2026, **18:40** | **19:40** |
| Genesis | **18:55** | **19:55** |
| START, f1 | **19:00** | **20:00** |
| Sends finished | **20:30** | **21:30** |
| Count stays up until | **21:00** | **22:00** |

The agreed window is 19:00–21:00 UTC, which is 20:00–22:00 CET. You do not send before 19:00 UTC.

## When you start

Do not start because this file was pasted.

At **18:40 UTC** (19:40 CET) the checks below have to pass. A miss aborts. No hop is sent early.

- Desk node synced, on TN10. Peers at least 8.
- Clock within 80 ms of NTP. Log the offset in milliseconds and the UTC time.
- Miners off. One line: `MINERS desk n=0`.
- Boson answers. If it does not, abort.
- Family-id hashes delivered before 18:40 UTC. The ids themselves stay in a private file.
- Sender key at least 2,500 coins and 18,000 usable tKAS. Do not lower that line. If the recount is short, top up or shorten the 8-family step. Do not start short.

Genesis at **18:55 UTC** (19:55 CET), eight families, so the 8-family step does not need a second genesis.

Sender on at **19:00 UTC** (20:00 CET) and not before.

## The windows

Sender on at `from`, off at `to`.

| Step | UTC | CET | Families | Rate |
|---|---|---|---:|---:|
| f1 | 19:00–19:15 | 20:00–20:15 | 1 | 1.2 |
| gap | 19:15–19:20 | 20:15–20:20 | 0 | 0 |
| f2 | 19:20–19:35 | 20:20–20:35 | 2 | 1.2 |
| gap | 19:35–19:40 | 20:35–20:40 | 0 | 0 |
| f4 | 19:40–19:55 | 20:40–20:55 | 4 | 1.2 |
| gap | 19:55–20:00 | 20:55–21:00 | 0 | 0 |
| f8 | 20:00–20:15 | 21:00–21:15 | 8 | 1.2, only if f4 was clean |
| gap | 20:15–20:20 | 21:15–21:20 | 0 | 0, only if f8 ran |
| ramp | 20:20–20:30 | 21:20–21:30 | 4 | 1.2, then +0.1 each step |
| quiet | 20:30–21:00 | 21:30–22:00 | 0 | 0 |

f4 is clean when every second of that step had an attempt, acceptance was at least 1.14 per family, and nothing fired sender-off, pool-low, node-drop or proc-exit. Landing percent is written down. It does not open or close f8.

If f8 is skipped, the same ramp starts at 20:00 UTC (21:00 CET) and ends at 20:10 UTC (21:10 CET).

The ramp is ten steps. Each step is 50 seconds on and 10 seconds off. The rates are 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1. Stop the ramp when two gains in a row are under 3%. A flat stretch is the result.

## What you keep

On the desk, a private file, one row per included hop: submit time, family, step, and the id. That file is how submit time meets acceptance. It does not go in the repo and it does not go into chat.

After 21:00 UTC the public numbers are p50, p95 and p99 of submit time to the accepting header, and the accepted hops per family per step.

## During the window

- No phase offset. No stagger. No second sender. No box lane.
- Do not restart the node.
- If the pool falls under the abort line, stop. Do not lower the line to finish the step.
- Leave the node up until 21:10 UTC for the mempool census.

## What you refuse

- Starting on any day except Saturday 7 Nov 2026.
- Sending before 19:00 UTC that day.
- A rate above 1.2 on f1, f2, f4 or f8.
- A second sender, including the box.
- Pasting ids, keys, addresses, hosts or ports into chat.
- Treating any other window, or [additional testing](../additional-testing/PLAN.md), as this window.
