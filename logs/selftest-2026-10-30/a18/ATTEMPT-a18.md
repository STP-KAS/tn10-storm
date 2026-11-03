# ATTEMPT a18 (desk-only, 3 Nov 2026)

- Armed 23:30Z 2 Nov (run dir `step3-a18`, kit12), genesis 23:50Z (8 families), `PREFLIGHT exit=0`, desk lane 2,131 coins / 18,381 usable tKAS, desk clock +0.1–0.4 ms, miners none. Mini counter on 23:29:50Z (read-only, own kaspad), off 01:20Z.
- START 00:00Z, END 00:50Z (01:00–01:50 CET). Steps f1, f2, f4 at 1.2 tx/s per family; f8 skipped by the gate (f4 landing 98.33 %); ramp 5/6/8/10/12 all ran (gains n/a, +5.8, −3.0, +4.0, +3.3 %: never two in a row under 3 %, so the plateau rule did not stop it).
- New in a18: sender de-lock (`stagger_ms` 700, `lock_ms` 150). The sender started and ran the whole window, no `PROC_EXIT`; exit line `DELOCK sender=desk delayed_fires=3033 stagger_ms=700 lock_ms=150`.
- 20,084 submit attempts, 6,694 ok; 6,641 own hops accepted in scored steps (coordinator = mini counter). 6 resyncs (families 1–3, 00:42–00:46Z, ramp). Sweeps at END+75/180/360 s: 0 own on both nodes. Census at END+10: 0 own on both nodes. Recovery done 01:10Z. No fault events.
- Mini free RAM never below ~4.9 GB; RAM guards not tripped.
- kaspad untouched on both machines; the elevated non-TN10 kaspads on the desk left alone.
- Score: [SCORE-a18](SCORE-a18.md), 6/10.
