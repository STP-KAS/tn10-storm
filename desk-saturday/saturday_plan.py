"""Saturday 7 Nov 2026 schedule. Run this file: it prints the plan and exits
non-zero if a lock fails. Counts only. No node, no keys."""
from datetime import datetime, timedelta, timezone

HOLD = 1.0
RAMP_ON_S = 50
RAMP_GAP_S = 10
RAMP_STEPS = 10
DECISION_DELAY_S = 3
T0 = datetime(2026, 11, 7, 19, 0, tzinfo=timezone.utc)


def iso(t):
    return t.strftime("%Y-%m-%dT%H:%M:%SZ")


def add(steps, t, seconds, step, families, rate):
    end = t + timedelta(seconds=seconds)
    steps.append({"step": step, "from": t, "to": end, "families": families, "rate": rate, "seconds": seconds})
    return end


def counted_steps(t0):
    """f1, f2, f4, f8. Fifteen minutes, five-minute gaps, one rate."""
    steps = []
    t = t0
    for name, fam in (("f1", 1), ("f2", 2), ("f4", 4), ("f8", 8)):
        t = add(steps, t, 15 * 60, name, fam, HOLD)
        t = add(steps, t, 5 * 60, "gap", 0, 0)
    return steps


def ramp(start):
    steps = []
    t = start
    for i in range(RAMP_STEPS):
        rate = round(HOLD + 0.1 * i, 1)
        t = add(steps, t, RAMP_ON_S, f"r{i + 1}", 4, rate)
        t = add(steps, t, RAMP_GAP_S, "gap", 0, 0)
    return steps


def check(steps):
    errs = []
    counted = [s for s in steps if s["step"] in ("f1", "f2", "f4", "f8")]
    if [s["families"] for s in counted] != [1, 2, 4, 8]:
        errs.append("family order")
    if any(s["rate"] != HOLD or s["seconds"] != 900 for s in counted):
        errs.append("counted steps are 900 s at the hold rate")
    if any(s["from"].second or s["from"].microsecond for s in counted):
        errs.append("counted steps open on a UTC second")
    # first submit of a step is the step's `from`; the sender is on from that second
    gaps = [s for s in steps if s["step"] == "gap"]
    if any(s["seconds"] != 300 for s in gaps):
        errs.append("counted gaps are 300 s, long enough for the f8 decision")
    r = ramp(datetime(2026, 11, 7, 20, 20, tzinfo=timezone.utc))
    ons = [s for s in r if s["step"] != "gap"]
    if [s["rate"] for s in ons] != [round(1.0 + 0.1 * i, 1) for i in range(10)]:
        errs.append("ramp rates")
    if any(s["families"] != 4 for s in ons):
        errs.append("ramp families")
    for on, gap in zip(ons, [s for s in r if s["step"] == "gap"]):
        if gap["from"] != on["to"]:
            errs.append("ramp gap does not follow its step")
        if not (on["seconds"] == RAMP_ON_S and gap["seconds"] == RAMP_GAP_S):
            errs.append("ramp shape")
        if DECISION_DELAY_S >= gap["seconds"]:
            errs.append("gate decision lands on the next ramp step")
    # 10 on-steps and 9 interior gaps fit in 10 minutes; the last gap ends the block
    send = sum(s["seconds"] for s in ons)
    if send != 500:
        errs.append(f"ramp send {send}s")
    if (ons[-1]["to"] - ons[0]["from"]).total_seconds() != 590:
        errs.append("ramp span")
    # a23 back-to-back ramp: decision at end+3 s is already inside the next step
    a23_step = 120
    if DECISION_DELAY_S < 0:
        errs.append("delay")
    a23_overshoot = DECISION_DELAY_S  # next step starts at the same instant the previous ends
    if a23_overshoot <= 0:
        errs.append("a23 overshoot vanished")
    return errs


def main():
    steps = counted_steps(T0)
    errs = check(steps)
    if errs:
        for e in errs:
            print("FAIL", e)
        raise SystemExit(1)
    print("HOLD", HOLD, "per family per second, every counted step")
    print("proposed T0", iso(T0), "(not armed)")
    print("step from to families rate seconds")
    for s in steps:
        print(s["step"], iso(s["from"]), iso(s["to"]), s["families"], s["rate"], s["seconds"])
    print("--- ramp if f8 runs, from 20:20Z; if f8 is skipped the same ramp starts 20:00Z ---")
    for s in ramp(datetime(2026, 11, 7, 20, 20, tzinfo=timezone.utc)):
        if s["step"] == "gap":
            continue
        print(s["step"], iso(s["from"]), iso(s["to"]), s["families"], s["rate"], s["seconds"])
    print("PASS schedule locks")


if __name__ == "__main__":
    main()
