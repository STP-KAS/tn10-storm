// desk-capture.mjs (3 Nov a22): read-only. Every 60 s: desk TN10 kaspad peer info (count, per-peer ping, in/outbound, version);
// every 10 s: host CPU, free RAM and top processes by CPU (incl. other kaspad pids, only observed). Private files only (peer
// addresses stay out of git). Sends nothing, restarts nothing. args: --dir --sdk --until [--url]
import fs from "node:fs"; import path from "node:path"; import os from "node:os"; import { execFile } from "node:child_process"; import { createRequire } from "node:module"; import { pathToFileURL } from "node:url";
const a=(n,d)=>{const i=process.argv.indexOf("--"+n);return i>0?process.argv[i+1]:d;};
const DIR=a("dir"),SDK=a("sdk"),URL=a("url","ws://127.0.0.1:17210"),UNTIL=Date.parse(a("until"));
const req=createRequire(SDK); globalThis.WebSocket=globalThis.WebSocket||req(path.join(path.dirname(SDK),"..","..","node_modules","websocket")).w3cwebsocket;
const k=req(SDK); for(const s of ["private","logs"]) fs.mkdirSync(path.join(DIR,s),{recursive:true});
const P=fs.createWriteStream(path.join(DIR,"private","peers.jsonl"),{flags:"a"}), H=fs.createWriteStream(path.join(DIR,"private","host.jsonl"),{flags:"a"});
const ph=m=>fs.appendFileSync(path.join(DIR,"logs","capture.log"),new Date().toISOString()+" "+m+"\n");
const r=new k.RpcClient({url:URL,encoding:k.Encoding.Borsh,networkId:"testnet-10"}); await r.connect({timeoutDuration:15000});
const si=await r.getServerInfo(); if(si.networkId!=="testnet-10"){ph("ABORT net="+si.networkId);process.exit(2);} ph("CAPTURE_ON");
const peers=async()=>{try{const t0=Date.now();const x=await r.getConnectedPeerInfo();const L=(x.peerInfo||[]).map(p=>({id:p.id,addr:p.address?.toString?.()??String(p.address),out:p.is_outbound,ping_ms:Number(p.last_ping_duration),off_ms:Number(p.time_offset),ver:p.user_agent,since_ms:Number(p.time_connected),ibd:p.is_ibd_peer}));
  P.write(JSON.stringify({t:new Date().toISOString(),rpc_ms:Date.now()-t0,n:L.length,peers:L})+"\n");}catch(e){ph("PEER_ERR "+String(e.message||e).slice(0,100));}};
let prev=os.cpus().map(c=>c.times);
const host=()=>{const cur=os.cpus().map(c=>c.times);let idle=0,tot=0;cur.forEach((c,i)=>{const p=prev[i];const d=Object.keys(c).reduce((s,q)=>s+c[q]-p[q],0);tot+=d;idle+=c.idle-p.idle;});prev=cur;
  const cpu=tot?+(100*(1-idle/tot)).toFixed(1):null, free=Math.round(os.freemem()/1048576);
  execFile("powershell.exe",["-NoProfile","-Command","Get-Process | sort CPU -desc | select -first 12 Id,ProcessName,CPU,WS | ConvertTo-Json -Compress"],{timeout:8000},(e,out)=>{
    let top=null;try{top=JSON.parse(out).map(p=>({pid:p.Id,n:p.ProcessName,cpu_s:Math.round(p.CPU||0),ws_mb:Math.round(p.WS/1048576)}));}catch{}
    H.write(JSON.stringify({t:new Date().toISOString(),cpu_pct:cpu,free_mb:free,top})+"\n");});};
await peers(); host();
const iP=setInterval(peers,60000), iH=setInterval(()=>{host(); if(Date.now()>UNTIL){clearInterval(iP);clearInterval(iH);ph("CAPTURE_OFF");P.end();H.end();setTimeout(()=>{r.disconnect().catch(()=>{});process.exit(0);},1500);}},10000);
