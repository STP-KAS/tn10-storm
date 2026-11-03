// mini-firstseen.cjs (3 Nov a22): read-only. Polls the mini's own TN10 kaspad mempool every --ms (default 250) and logs the
// local first-seen time of every txid (private file, never in git). Joined offline with the desk submit file -> desk->mini propagation.
// Sends nothing. Exits at --until or if free RAM < 1 GB twice.
const os=require("os"),fs=require("fs"),path=require("path");
const a=(n,d)=>{const i=process.argv.indexOf("--"+n);return i>0?process.argv[i+1]:d;};
const DIR=a("dir"),SDK=a("sdk"),URL=a("url","ws://127.0.0.1:17210"),UNTIL=Date.parse(a("until")),MS=+a("ms","250");
globalThis.WebSocket=globalThis.WebSocket||require(path.join(path.dirname(SDK),"..","..","node_modules","websocket")).w3cwebsocket;
const k=require(SDK);fs.mkdirSync(path.join(DIR,"private"),{recursive:true});fs.mkdirSync(path.join(DIR,"logs"),{recursive:true});
const OUT=fs.createWriteStream(path.join(DIR,"private","firstseen.jsonl"),{flags:"a"});
const ph=(m)=>fs.appendFileSync(path.join(DIR,"logs","firstseen.log"),new Date().toISOString()+" "+m+"\n");
(async()=>{const r=new k.RpcClient({url:URL,encoding:k.Encoding.Borsh,networkId:"testnet-10"});await r.connect();
const si=await r.getServerInfo(); if(si.networkId!=="testnet-10"){ph("ABORT net="+si.networkId);process.exit(2);}
const seen=new Map();let polls=0,errs=0,maxRpc=0,low=0;ph("FIRSTSEEN_ON ms="+MS);
setInterval(()=>{const f=os.freemem()/1048576;low=f<1024?low+1:0;if(low>=2){ph("STOP ram");process.exit(3);}
 ph(`STAT polls=${polls} txids=${seen.size} errs=${errs} rpc_max_ms=${maxRpc}`);maxRpc=0;
 if(Date.now()>UNTIL){ph("FIRSTSEEN_OFF txids="+seen.size);OUT.end();setTimeout(()=>process.exit(0),500);}
 const cut=Date.now()-600000;for(const[id,t]of seen)if(t<cut)seen.delete(id);},60000);
while(Date.now()<=UNTIL+1000){const t0=Date.now();
 try{const m=await r.getMempoolEntries({includeOrphanPool:true,filterTransactionPool:false});polls++;const t=new Date().toISOString();
  for(const e of (m.mempoolEntries||[])){const id=e.transaction?.verboseData?.transactionId||e.transaction?.id;if(id&&!seen.has(id)){seen.set(id,Date.now());OUT.write(`{"t":"${t}","id":"${id}","o":${!!e.isOrphan}}\n`);}}}
 catch(x){errs++;if(errs<5)ph("ERR "+String(x.message||x).slice(0,100));}
 const d=Date.now()-t0;if(d>maxRpc)maxRpc=d;await new Promise(z=>setTimeout(z,Math.max(20,MS-d)));}
})().catch(e=>{ph("ERR "+String(e.message||e).slice(0,100));process.exit(1);});
