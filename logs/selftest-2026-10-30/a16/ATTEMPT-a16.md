# ATTEMPT a16: not run (usage outage + LAN switch unplugged)

Planned: ladder step 5, 8 families at 1x rate, 30 min, RAM guard on, muon only if reachable.

- 1 Nov ~13:00Z: a16 kit prepared (kit10, 13:05Z) but never armed. No run directory, no START, no hop sent. Cause: agent usage ran out after ~13:00Z, restored 2 Nov ~18:15Z.
- 2 Nov ~18:30Z: the home LAN switch was unplugged by accident. Desk Intel NIC event at 18:30:22Z; back at 1 Gbps.
- Recovery check 2 Nov 18:31Z (read-only):
  - Machine identity verified from the machines: desk = the I226-V machine, mini = the "SER" machine running the mini kaspad (`--ram-scale=0.4`, uacomment stp-mini). Agent labels for the two machines may be swapped; trust the machine itself.
  - No a16 sender, orchestrator or RAM-guard (port 18601) process on either machine. Only the tunnels (`rtunnel.mjs`), the mini wasm listener and long-lived helpers are running. Nothing stopped.
  - Desk clock offset within 1 ms. Desk node RPC port answers.
  - **Mini free RAM 1,668 MB (< 2 GB checklist 20); mini kaspad private memory 7.9 GB again, 34 h after the 1 Nov restart.** Launch blocked; kaspad not touched (restart only with stp's OK).
- Result: not run. Relaunch needs a mini kaspad restart (stp OK) or a lower-RAM plan.
