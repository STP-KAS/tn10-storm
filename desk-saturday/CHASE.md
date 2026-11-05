> **Experimental. We are just trying this.** [Disclaimer](../DISCLAIMER.md) · Kaspa Testnet-10 only. Counts only.

# Landing chase, 5 Nov 2026

These probes did not change the Saturday shape except the rate, and they did not clear 99%. The rate those probes were configured at was 1.0. The rate [PLAN.md](PLAN.md) publishes now is 1.2, from the later holds in [HOLD.md](HOLD.md). This file is the attempt to clear the 99% landing line without moving the scorer. It did not. No full scored run was started from these probes. The Saturday slot is not armed.

a23 is still 8/10, criterion 4 failed at 97.28% union landing, criterion 8 open. The holes are single seconds, shared by the families. A send-time offset would fill those seconds if one family's acceptance sat a few hundred milliseconds off the others, and the rate still held 0.95 of 1.0. Six counted probes, each 180 seconds, 4 families, configured rate 1.0, desk only, tested that. One more probe aborted at preflight and sent no counted hops.

## What was varied

Boson alone, then boson, vector and electron with one family on each node. A fire delay on every hop. The same delay once. The once-only delay applied before either send path, and only on family 2.

| Probe | What changed | Landing | Empty seconds | Accepted /s, families 1–4 |
|---|---|---:|---:|---|
| 1 | 150 ms fire delay, every hop, boson only | 96.67% | 6 | 1.35, 1.08, 0.99, 0.91 |
| 2 | Three relays, relay itself delayed 150 ms per family | 98.89% | 2, both in the first 7 s | 1.32, 1.17, 1.05, 0.94 |
| 3 | Three relays, immediate | 98.33% | 3, at 17 s, 49 s, 153 s | 1.34, 1.33, 1.38, 1.33 |
| 4 | 500 ms fire delay, every hop, three relays immediate | 98.89% | 2 | 1.34, 0.82, 0.60, 0.47 |
| 5 | 500 ms once per family | 97.22% | 5 | 1.34, 1.33, 1.32, 1.33 |
| 6 | 400 ms once, family 2 only, before either send path | 95.00% | 9 | 1.26, 1.30, 1.31, 1.28 |

Every probe attempted in all 180 seconds. The first counted submit was inside 0.05 s. Relays that were sent immediately were accepted: probe 3 was 971/971, probe 6 was the same pattern. Probe 2 delayed the relay and the later families arrived already known, which is why family 4 fell to 0.94/s.

## What the numbers say

The rate at 1.0 is not the problem. With an immediate relay and no fire delay, all four families sat near 1.3 accepted/s (probe 3). That is the same shape as a23, at a lower configured rate, and it holds.

The offset does not stick. Probe 6 did wait: family 2's first ok submit was 400 ms after family 1, and the log shows one wait of 400 ms. The nearest later submit of family 2 sits 1 ms from family 1. One hop later they are in the same header again. Probe 5 logged three waits and still had its first ok submits 5 ms apart, because the ordinary send path fired before the delay was armed. Probe 4 kept the delay on every hop, the families did spread, and family 4 fell to 0.47/s. That is under the 0.95 line, so it cannot be the Saturday shape.

The empty seconds are short shared gaps, 1.05–1.59 s, with the previous acceptance 15–170 ms before the empty second starts. A cluster that lands just after a boundary, then waits a bit over a second, skips that second. Four families in the same header skip it together. A one-hop stagger is gone before the next gap. A stagger on every hop makes the later families miss the 0.95 line.

99% of a 180 s window allows one empty second. The best window here had two. 99% of a 480 s step allows four. Probe 3's three empties in 180 s is about eight in 480 s. A long run at that rate fails criterion 4. I did not spend the lane to confirm it.

## What this does not change

The scorer stays. Two chains per family stay off. Saturday stays one sender, boson, and the f8 rule in this folder. The probes here were configured at 1.0. The published rate is now 1.2, and the ramp starts there. Three public relays were probed and did not raise landing above the boson result in a way that clears 99%, so Saturday does not gain them.

## Funding, measured during the chase

At 11:54Z, before probes 4–6, the lane read 1,132 coins and 7,739 usable tKAS. The probe gate of 8,000 aborted one launch there. Genesis for that launch had already landed. No counted hops were sent. The Saturday abort line is 2,500 coins and 18,000 usable tKAS. Usable value was under 18,000 at this reading, and three probes ran after it. A later recount is in [HOLD.md](HOLD.md). Recount again before any arm. If it is short of 18,000, shorten f8 as [REVIEW-FOR-GROKBOT.md](REVIEW-FOR-GROKBOT.md) already says. Do not lower the line quietly.
