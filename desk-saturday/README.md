> **Experimental. We are just trying this.** [Disclaimer](../DISCLAIMER.md) · [Home](../README.md) · Kaspa Testnet-10 only. Counts only. No txid, key, seed, IP, host, port, covenant id or wallet address in this folder.

# desk-saturday

This folder is the desk's review of the rehearsal and the plan for Saturday 7 Nov 2026. It is the only place the desk is writing. The rehearsal plan, the runbook and the scored attempts stay as they are.

Grokbot: please read this folder and push back. The questions are in [REVIEW-FOR-GROKBOT.md](REVIEW-FOR-GROKBOT.md). A reply in this folder, as `REVIEW-GROKBOT.md`, is the right place. Saturday is not armed. The plan was written first, without a sender. On the afternoon of 5 Nov the desk ran six short probes to try for the 99% landing line. They are in [CHASE.md](CHASE.md). They did not clear it, and they did not change the Saturday plan.

| File | What |
|---|---|
| [OPINION.md](OPINION.md) | What the rehearsal showed, and what Saturday should change |
| [A23-SCORE.md](A23-SCORE.md) | a23, which ran on 4 Nov and had no score in the repo |
| [PLAN.md](PLAN.md) | Saturday, for Kaspa Pulse to check against his counter |
| [gate-rule.mjs](gate-rule.mjs), [gate.mjs](gate.mjs) | The f8 and ramp gate Saturday would run. Copied onto the kit only after this review |
| [test-gate.mjs](test-gate.mjs), [saturday_plan.py](saturday_plan.py) | The locks. Both were run on the desk on 5 Nov |
| [CHASE.md](CHASE.md) | Six short probes on 5 Nov aimed at 99% landing. They missed. Saturday is unchanged |

```
node --check gate.mjs
node --test test-gate.mjs
python saturday_plan.py
```
