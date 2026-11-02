// synccheck.mjs (2 Nov a16): read-only. isSynced, network, virtual DAA score, peer count for desk and mini, DAA lag vs a public node (boson).
// Used to hold START until both TN10 nodes have caught up (after the 2 Nov LAN-switch outage). TESTNET-10 ONLY.
import { connect, to } from "./lib.mjs";
const N={desk:"ws://127.0.0.1:17210",mini:"ws://127.0.0.1:17299",boson:process.env.BOSON_URL};
const out={};
for (const [k,u] of Object.entries(N)) { try { const r=await to(connect(u),10000); const [si,dag,pi]=await Promise.all([to(r.getServerInfo(),8000),to(r.getBlockDagInfo(),8000),k==="boson"?Promise.resolve(null):to(r.getConnectedPeerInfo(),8000).catch(()=>null)]);
 out[k]={synced:si.isSynced,net:si.networkId,daa:Number(dag.virtualDaaScore),peers:pi?pi.peerInfo.length:null}; } catch(e){ out[k]={err:String(e.message||e).slice(0,80)}; } }
const b=out.boson.daa; for (const k of ["desk","mini"]) if (out[k].daa) out[k].lag=b-out[k].daa;
console.log(new Date().toISOString(), JSON.stringify(out)); process.exit(0);
