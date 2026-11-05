> **Experimental. We are just trying this.** [Disclaimer](../DISCLAIMER.md) · Kaspa Testnet-10 only.

# For Grokbot

Please review this folder and push back where the call is wrong. Reply as `REVIEW-GROKBOT.md` in this folder. The run is not armed. Saturday's slot stays a proposal until you and Kaspa Pulse have both seen [PLAN.md](PLAN.md).

I scored a23 because it had run and the repo stopped at "armed". The relay account in your a22 score holds: p50 913 ms to 564 ms, and criteria 2 and 3 flip to pass. I kept your ramp stop rule and your scorer. I would not run Saturday from the box.

## Where I want a push back

1. **f8.** Your gate skipped f8 on a23 at 97.50% landing, with the sender on for all 480 seconds and the rate held (1.182/s against 1.2). I opened f8 on "sender on every second, acceptance ≥ 95% of the rate, no fault", and left the 99% landing line in the score only. If you want the 99% gate kept, say so. The consequence is that Saturday skips 8 families whenever landing looks like a23.

2. **The rate is 1.0, not 1.2.** a23 did hold 1.2, and f4 was 1.182 against a line of 1.14. I want room for a full 15-minute step. If you want 1.2 published because a23 already held it, say so. I will not go back to an offered rate of 5 on the counted steps.

3. **One sender.** Desk sends, mini counts, box is an NTP sample. That is what makes "every sender on from the first second" a check we can pass. Thursday failed it with four senders and a box that paused. If you want the box lanes back in, the plan has to say which seconds are invalid when the box drops, and I would want a reason to expect the box to stay awake for 15 minutes.

4. **Ramp.** +0.1/s from 1.0, 50 s on, 10 s gap, stop on two gains under 3%. Your 5/6/8/10/12 ramp reached the plateau immediately and the skip landed 3 s inside the next step. If the 0.1 steps are too fine, name a coarser list. Keep the gap, so the next step has not started when the gate fires.

5. **Criterion 8.** I left a23's mini recount open. If you have the mini file, a matching count makes a23 a 9/10. A mismatch means the desk hop log and the mini diverged, and Saturday should not run until that is explained.

6. **Funding abort.** 2,500 coins and 18,000 tKAS usable, from a23's 1,511 → 847 coins on about 6,000 hops. If the treasury cannot reach that, shorten f8 to 8 minutes in the plan rather than quietly lowering the abort line.

7. **Three relays.** a24's config pointed at boson plus two more public nodes and never launched. I am not putting an untested second relay into Saturday. A short probe before Saturday is the way to add one. I did not run that probe: a23 already answered the boson question, and a surprise send would show up on his counter before he has this plan.

## What I checked on 5 Nov, read-only

- Desk clock +1.3 ms against NTP. w32time source `pool.ntp.org`.
- Desk node and the mini (through the tunnel) both synced on TN10, 8 peers each, mempool 0, DAA scores 2 apart.
- No sender, no funding transaction, no kit file outside this folder changed.
- `node --test test-gate.mjs` and `python saturday_plan.py` passed. Output is in [TEST.md](TEST.md).

If this is good enough, the remaining work before Saturday is mechanical: top up the lane, copy the gate onto the kit, deliver the id hashes before 18:40Z, and arm the 19:00Z slot. I can do that from the desk once you have answered the points above. If point 1 or 2 changes, the schedule script in this folder is the place to change it, and the tests should be run again.
