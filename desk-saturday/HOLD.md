> **Experimental. We are just trying this.** [Disclaimer](../DISCLAIMER.md) · Kaspa Testnet-10 only. Counts only. No txid, key, seed, IP, host, port, covenant id or wallet address.

# Holds, 5 Nov 2026

Two internal windows, desk only, after the landing chase in [CHASE.md](CHASE.md). They are not the Saturday slot. Saturday stays proposed. The rate in [PLAN.md](PLAN.md) is **1.2** because of these windows.

Configured rate 1.2 accepted hop/s per family. One relay, boson. No phase offset. Stagger 0. Heartbeat 900 ms. The mini counted both windows on its own node and matched every hop.

The landing line was not moved. Both windows miss 99%.

## 4 families, 10 minutes

14:59:55Z–15:09:55Z. 600 seconds. First submit at 0.026 s. An attempt in every second, on every family. No sender-off, pool-low, node-drop, proc-exit or family-drop.

| Family | Accepted /s |
|---|---:|
| 1 | 1.328 |
| 2 | 1.308 |
| 3 | 1.287 |
| 4 | 1.302 |

The pass line is 1.14, which is 0.95 × 1.2. All four are above it. The slowest full minute, across the families, was 1.200. Nine full minutes, plus a 5 s head at 1.6 and a 55 s tail at 1.236.

Union landing 97.33% (16 empty seconds of 600). Included hops 3,131. Submit → accepting header: n=3,131, p50 582 ms, p95 1,022 ms, p99 1,378 ms. Relay submissions accepted 3,134 of 3,135. Mini recount matched 3,131 of 3,131.

The kit still had the old gate. It logged a skip of an 8-family step because landing was under 99%. That step was not in this window. Under the rule in [gate-rule.mjs](gate-rule.mjs) this window would have opened f8.

## 8 families, 10 minutes

15:18:07Z–15:28:07Z. 600 seconds. First submit at 0.026 s. An attempt in every second, on every family. No fault of the kinds listed above.

| Family | Accepted /s |
|---|---:|
| 1 | 1.328 |
| 2 | 1.295 |
| 3 | 1.270 |
| 4 | 1.285 |
| 5 | 1.283 |
| 6 | 1.285 |
| 7 | 1.278 |
| 8 | 1.260 |

Slowest family 1.260, against 1.14. Acceptance did not rise from 4 families to 8. The slowest family went from 1.287 to 1.260.

Nine full minutes. The worst of them was 1.167. Another was 1.183. Both clear 1.14. Neither is at or above 1.2. The head was 53 s at 1.245 and the tail was 7 s at 1.143. Those two clips are not full minutes.

Union landing 98.33% (10 empty seconds of 600). Included hops 6,163. Header time was present on 6,155 of them: p50 576 ms, p95 1,043 ms, p99 1,277 ms. Relay submissions accepted 6,163 of 6,171. Mini recount matched 6,163 of 6,163.

Sweeps at 75 s, 180 s and 360 s after the end found nothing of ours to replace. At end + 10 min the mempool census was 0 of ours on the desk and 0 of ours on the mini. The 4-family census is not used here: its end + 10 min fell inside this window.

## What is stable, and what was not bought

1.2 is the highest rate I will print. a23's ramp was already flat near 1.32/s once the offered rate was above the chain, and these windows sat in the same place. A higher printed rate would miss the 0.95 line on the 8-family minute floor.

If the published number has to be at or under every full minute, print **1.15**. The worst full minute was 1.167. I am not printing 1.15. I am printing 1.2, and the two minutes under it are in the table above so the counter can be checked against them.

1.0 still has more room. It is no longer the proposal. The reason it was 1.0 is in [REVIEW-FOR-GROKBOT.md](REVIEW-FOR-GROKBOT.md), and that point is updated.

These windows are 10 minutes. Saturday's counted steps are 15. I did not buy a 15-minute confirmation. The sender key, after the windows and after putting a genesis coin back on each family that the 8-family window had spent, read **2,515 coins and 19,812 usable tKAS**. The abort stays 2,500 coins and 18,000 usable tKAS. A 15-minute step at 4 families would spend that margin. a23 already showed the plateau, so another ramp was not worth the coins.

Each of the eight family keys holds at least one genesis coin after that refill. Recount both the sender key and the genesis coins before any arm.

## What this does not change

The scorer stays. 99% landing stays a score, and it is still a miss. The f8 rule stays the one in this folder. One sender. Boson only. No phase offset. The mining wallet that was offered was not spent. No wallet on this desk is named GovBuild. Listing that wallet's coins over RPC does not return, and a capped public page is not the balance, so it was not split into the lane.
