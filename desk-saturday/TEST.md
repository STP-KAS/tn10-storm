> **Experimental. We are just trying this.** [Disclaimer](../DISCLAIMER.md) · Kaspa Testnet-10 only.

# Tests, 5 Nov 2026

Run on the desk from this folder. No node RPC, no sender, no key.

`node --check gate.mjs` and `node --check gate-rule.mjs`: exit 0.

`node --test test-gate.mjs`: 8 passed, 0 failed.

The locks cover the a23 f4 counts (480/480 seconds, first submit 0.02 s, 1.182 accepted/s at a configured 1.2, 0 faults → f8 opens), the a22 miss of one second (479/480 → f8 stays off), a rate under 95% of configured, a fault, the 1.0 hold, the a23 ramp series (1.294, 1.312, 1.323 → stop after the third step), a ramp that is still rising, and a 10 s gap against a 3 s decision delay.

`python saturday_plan.py`:

```
HOLD 1.0 per family per second, every counted step
proposed T0 2026-11-07T19:00:00Z (not armed)
f1  19:00:00Z–19:15:00Z  families 1  rate 1.0  900 s
gap 19:15:00Z–19:20:00Z
f2  19:20:00Z–19:35:00Z  families 2  rate 1.0  900 s
gap 19:35:00Z–19:40:00Z
f4  19:40:00Z–19:55:00Z  families 4  rate 1.0  900 s
gap 19:55:00Z–20:00:00Z
f8  20:00:00Z–20:15:00Z  families 8  rate 1.0  900 s
gap 20:15:00Z–20:20:00Z
r1–r10  20:20:00Z–20:29:50Z  families 4  rate 1.0 to 1.9 by 0.1
    each step 50 s, then 10 s off
PASS schedule locks
```

Same read-only pass, same evening: desk clock +1.3 ms. Desk and mini both synced on TN10, 8 peers, mempool 0, DAA scores 2 apart. No transaction submitted.
