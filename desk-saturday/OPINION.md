> **Experimental. We are just trying this.** [Disclaimer](../DISCLAIMER.md) · Kaspa Testnet-10 only.

# Opinion

The rehearsal plan is sound. I would run Saturday from it, with four changes that come out of a23 and out of what Kaspa Pulse asked to count. I would not chase a 10/10 by moving a line.

## What the rehearsal already settled

a7 scored 10/10 on the multi-lane rules, at 5.32 hops/s, with four entrants racing each family. From a16 the rehearsal is one sender, the desk, and the mini counts. That is the right shape for Saturday. On 29 Oct the box lanes ran about 19:24–19:33Z and step 3 never had the full sender set, which is the "8 of 41 minutes" gap. A sender that is not in the plan cannot miss a minute. The box stays off the send path. It still gets an NTP sample, because he asked for all three machines.

a16 through a22, scored 6/10 to 8/10, failed the same way: the desk could not hold 1.2/s per family, and landing sat under 99%. a22 showed why. After the peer reconnect on 3 Nov at about 08:00 CET, submit-to-header was ~0.9–1.1 s at every hour of the day. About 80% of that was the transaction leaving the desk node. The desk listens on loopback, so its outbound peers are the only path out, and a kaspad relay hop waits on a 500 ms broadcast interval.

a23 was the test of that account: the same signed transaction, after the desk node accepted it, was also given to boson. It ran on 4 Nov, 01:10–02:00Z, and it was never scored in the repo. Scored now: criteria 2 and 3 pass, latency p50 913 ms → 564 ms, union landing 90.64% → 97.28%. Criterion 4 still fails. The ramp showed acceptance per family flat at about 1.32/s once the offered rate was above the chain. Details in [A23-SCORE.md](A23-SCORE.md).

So the relay stays. The 99% landing line stays too, as a score, and Saturday is allowed to fail it. a23's empty seconds are single seconds (longest family gap 2.1 s). Four families at once still left 2.5% of seconds empty, so the holes are shared, not one family falling behind. Lowering the rate a little will not fill a second in which nothing is included. Two chains per family would change what "a family" means on his counter. I would not do that on Saturday.

## What I would change for Saturday

Kaspa Pulse's note, as already recorded on 3 Nov, asks for four things. The rehearsal answers them halfway.

1. **Same steps as Thursday, every sender on from the first second.** Thursday was 15 minutes at 1 family, 15 at 2, 15 at 4, with 5-minute gaps, 19:00–20:00Z. The rehearsal shortened that to 8 minutes so we could iterate, and it was right to do so. Saturday goes back to 15 minutes, and adds 8 families when 4 was clean. "Clean" on Thursday meant the senders were actually on. a23's f4 was on for 480/480 seconds and held the rate, and our gate still skipped f8 because landing was 97.50%. That gate will skip f8 again on Saturday if we keep it. The Saturday gate in this folder opens f8 when the sender was on every second, acceptance held 95% of the configured rate, and nothing faulted. Landing is logged beside it.

2. **One rate, held for the whole window.** a23 held 1.2, and f4 finished at 1.182 against a pass line of 1.14. The ramp did not find a higher acceptance. Saturday's rate is **1.2 hop/s per family** on f1, f2, f4 and f8. Two 10-minute windows on 5 Nov held that configured rate. On 8 families the worst full minute was 1.167, which clears 1.14 and does not clear 1.2. The numbers are in [HOLD.md](HOLD.md). The publishable rate is accepted hops per family over the step, not the busiest minute.

3. **Submit time per transaction, private.** The desk already writes it. Saturday keeps a private file of `submit_utc, accept_utc, family, step, txid` and does not commit it. The public number is the percentile of submit → accepting header. On a23 that was p50 564 ms, p95 1,028 ms, p99 1,290 ms at the 1.2/s load. The 5 Nov holds, same join, were p50 582 / 576 ms. Saturday's figure is measured again, with the relay on.

4. **A 10-minute ramp, small steps, stop when acceptance per family stops growing.** The rehearsal ramp was 5, 6, 8, 10, 12. a23 was already flat at the first of those, and the gate wrote the skip 3 seconds after the next step had started. Saturday steps +0.1/s from 1.2, 50 seconds on and 10 seconds off, so the decision at end+3 s falls inside the gap. Ten steps are listed, 1.2 through 2.1. The same 2× <3% rule drops the rest. There is no step at 5/s.

## 10/10

I do not expect 10/10, and I would not edit the scorer to produce one. a23 is 8/10 with criterion 8 open, because the mini's recount file was not on the desk. If that file matches, the score is 9/10. The miss is landing, 97.28% against 99%. The two later windows matched the mini on every hop, and they still missed 99% (97.33% and 98.33%). Saturday can miss criterion 4 in the same way. A run with every counted minute valid is the run he asked for. A 10/10 with another skipped f8 is not.

The afternoon of 5 Nov tried to fill the holes with a send-time offset and with a second and third relay. Six counted probes, written up in [CHASE.md](CHASE.md). The best landing was 98.89%, and the shape that held the rate on all four families was 98.33%. A stagger that stays on every hop pulls the later families under 0.95/s. The 99% line stays where it is. The holds that followed are in [HOLD.md](HOLD.md).

## Who runs it

The desk sends, on its own node, and keeps the coordinator count. The mini counts and does not send. Both nodes were synced on 5 Nov at 09:12Z, 8 peers each, mempools empty, DAA scores 2 apart. Desk clock +1.3 ms. That check did not submit a transaction. The afternoon probes in [CHASE.md](CHASE.md) did. They are not the Saturday run.

Grokbot's oversight was the useful kind: a22's relay account is the reason a23 moved the latency. I don't need the box to operate Saturday. I do need this folder read before the slot is armed, in particular the f8 rule and the 1.2 rate, including the two 8-family minutes under 1.2. Those are the places a fair pushback changes the run.
