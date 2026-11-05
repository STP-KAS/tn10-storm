> **Experimental. We are just trying this.** [Disclaimer](../DISCLAIMER.md) · Kaspa Testnet-10 only. Counts only. No txid, key, seed, IP, host, port, covenant id or wallet address.

# Grokbot review of the Saturday plan

Reply to [REVIEW-FOR-GROKBOT.md](REVIEW-FOR-GROKBOT.md). Window: Saturday 7 Nov 2026, 19:00–21:00 UTC (20:00–22:00 CET).

## Verdict

Run Saturday from [PLAN.md](PLAN.md) as written. I agree with all ten calls, with three conditions:

- **f8 can run and still fail criterion 4 in public.** Say that before the window, not after it.
- **The 15-minute length at 1.2 has not been tested.** A full minute under 1.14 on Saturday breaks the claim we publish.
- **Two items abort the run if they are missing before arm:** the mini recount and the lane recount.

No line moves. The box does not send.

## Replies to the ten points

1. **f8 gate without the 99% opener: agree.**
   - What: f8 opens when the sender is on every second, held acceptance is ≥ 1.14, and there are no faults (`f8Clean` in [gate-rule.mjs](gate-rule.mjs)).
   - Why: Pulse asked for clean minutes and a held rate, plus "8 if 4 runs clean". Their "clean" means the senders were on, not that landing was 99%. Keeping the 99% gate would skip f8 again whenever landing looks like a23 (97.50%).
   - Consequence: Saturday can run f8 and still **fail criterion 4 publicly**. Every window since a23 landed 97.28–98.89%. Expect a miss and print it beside his count.

2. **Rate 1.2 with the minute floor written: agree.**
   - Print 1.2 and the 1.14 line. Do not move to 1.15. Pulse asked for "one rate per step that you can hold for the full counted window". That reads as acceptance over the step. It does not say every minute must be at or above the printed rate.
   - Pushback: the holds were 10 minutes and the Saturday steps are 15. That extra length was never tested, because the lane was too thin to buy a 15-minute confirmation.
   - The 8-family worst full minutes were 1.183 and 1.167, which leaves 0.027 above the line. If any full minute dips under 1.14 on Saturday, the "held for the full window" claim fails for that step, even if the step average passes.
   - How: log per-minute acceptance per family in the score. If a minute is under 1.14, say so; do not average it away.

3. **One sender: agree.**
   - The desk sends, the mini counts, and the box gives one NTP sample only. The box stays off the send path.
   - A sender that is not in the plan cannot miss a minute. That is the 29 Oct "8 of 41" gap closed.

4. **Ramp, +0.1/s with a 50 s on / 10 s off cycle: agree.**
   - The gap keeps the end+3 s decision inside the off time (`decisionInsideGap`).
   - Expect an early stop. a23 was flat near 1.32/s per family, and the holds sat at 1.26–1.33. The ramp should stop around r3–r4 (1.4–1.5 offered).
   - Most of the ten listed steps will be `SKIP`. That is the intended result ("we stop there"), not a failure.

5. **Criterion 8 on a23: still open.**
   - The 5 Nov holds matched the mini 1:1 (3,131/3,131 and 6,163/6,163). They do not close a23; that needs a23's own mini file.
   - For Saturday: copy the mini recount file to the desk **before** scoring. The plan already has this under "After END". Treat a missing file as a scoring blocker, not as "open".

6. **Funding: enough, if the recount holds before arm.**
   - The lane read 5,509 coins and 57,237 usable tKAS after the top-up.
   - The ceiling is about 17,000 included hops. Spend from a23 was about 664 coins per 6,000 hops, so this fits with margin.
   - Keep the abort line (2,500 coins / 18,000 tKAS). Recount before genesis. If short, top up or shorten f8. Never lower the line.

7. **Three relays: agree, boson alone on Saturday.**
   - The extra relays held the rate but did not clear 99%, and every extra relay adds a public dependency.
   - The boson connect check stays an abort.

8. **99% landing: agree, leave the line.**
   - Do not expect it to clear. The best on 5 Nov was 98.89%, over 180 s.
   - The draft to Pulse already says landing is written down and does not gate f8. That is honest. Keep it.

9. **Mining wallet: accept the description.**
   - 591 coins at or above 16 tKAS were split into 2,994 outputs of 15.5 tKAS on the sender key. The large coin and the coins under 16 tKAS stay.
   - No further drain of that wallet.

10. **Eight family keys: agree.**
    - Recount the four re-seeded genesis coins before the 18:55Z genesis.
    - A missing coin aborts, or f8 drops to 4 families. Do not improvise a fresh genesis inside the window.

## Extra pushback

- **The draft to Pulse matches their four asks:**
  - same steps with the sender on from the first second
  - one held rate
  - a private submit file
  - a 10-minute small-step ramp

  The links resolve to the right files. One gap: the draft does not name the boson relay, though PLAN.md does. Pulse may not need the name, but our load path and the latency figure depend on it. Naming it is an optional disclosure, one line.
- **Family-id hashes before 18:40 UTC:** this fixes the 29 Oct late delivery. Treat a late delivery as an **abort**, not a warning, because his counter needs the ids before the first hop.
- **"Pasting a sheet before Saturday does not start anything"** is correct and important for the mini. Keep that sentence in every paste.
- **Per-minute floor in the public write-up:** publish the step average and the worst full minute per family, so the 1.14 margin is visible.
- **This review does not send anything to Pulse.** stp decides when the plan goes out.
