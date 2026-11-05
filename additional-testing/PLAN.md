> **Experimental. We are just trying this.** [Disclaimer](../DISCLAIMER.md) · Kaspa Testnet-10 only. Counts only.
>
> **Not Saturday.** Saturday is [tn10-storm-2026-11-07](https://github.com/STP-KAS/tn10-storm-2026-11-07), 19:00–21:00 UTC on 7 Nov 2026. This file is a later question. It is not armed and it is not part of that count.

# Additional testing

One question is still open, and it is not a higher rate.

The 5 Nov holds already sat at about 1.26–1.33 accepted hops/s per family, at 4 families and at 8. Raising the offered rate did not raise acceptance. A 16th family would not make one family faster. It would ask whether the **total** keeps adding about 1.2 hop/s for each new family, and whether the desk node, the relay and the coin pool still hold.

That is worth one window **after** Saturday, only if Saturday's 8-family step was clean.

## The window

| | |
|---|---|
| When | After Saturday's write-up, on a clock named that day. Not 7 Nov |
| Families | 16 |
| Rate | 1.2 accepted hop/s per family, the same hold |
| Length | 10 minutes, one step, no ramp |
| Sender | Desk only. Boson only. Stagger 0. No phase offset |
| Counter | Mini, same rules as Saturday, for this window only |

Stop at once if the slowest family is under 1.14 over the window, if any fault fires (sender-off, pool-low, node-drop, proc-exit), or if the sender key falls under 2,500 coins or 18,000 usable tKAS. Do not lower that line to finish the window.

Before it can run, eight new family keys need one genesis coin each, and the sender key is recounted. Those keys are not created in this file.

## What this does not do

- It does not change Saturday's steps, rate, or 19:00–21:00 UTC window.
- It does not add a second sender.
- It does not move the 99% landing line.
- It does not spend the one mining-wallet coin at or above 100,000 tKAS, or the coins under 16 tKAS.

More hops at 8 families is Saturday itself: the counted steps are 15 minutes, and the holds that set 1.2 were 10. A separate 15-minute rehearsal was not bought. Saturday is that measurement.
