// counter.cjs (2 Nov a16): read-only acceptance counter on the mini's own TN10 kaspad. Sends nothing.
// Subscribes to virtual-chain-changed and logs every accepted txid with the local receive time to private/accepted.jsonl
// (never in git). Exits if free RAM < 1 GB on 2 reads in a row (5 s apart) or at --until. TESTNET-10 ONLY.
// usage: node counter.cjs --dir <run> --sdk <kaspa.js> [--url ws://127.0.0.1:17210] --until <iso>
const os=require("os"),fs=require("fs"),path=require("path");
const a=(n,d)=>{const i=process.argv.indexOf("--"+n);return i>0?process.argv[i+1]:d;};
const DIR=a("dir"),SDK=a("sdk"),URL=a("url","ws://127.0.0.1:17210"),UNTIL=Date.parse(a("until"));
const k=require(SDK);const OUT=fs.createWriteStream(path.join(DIR,"private","accepted.jsonl"),{flags:"a"});
const ph=(m)=>fs.appendFileSync(path.join(DIR,"logs","counter.log"),new Date().toISOString()+" "+m+"\n");
(async()=>{const r=new k.RpcClient({url:URL,encoding:k.Encoding.Borsh,networkId:"testnet-10"});await r.connect();
const si=await r.getServerInfo(); if(si.networkId!=="testnet-10"){ph("ABORT net="+si.networkId);process.exit(2);}
let n=0,low=0;
r.addEventListener("virtual-chain-changed",(e)=>{const t=new Date().toISOString();for(const x of (e.data.acceptedTransactionIds||[])){for(const id of x.acceptedTransactionIds){OUT.write(`{"t":"${t}","b":"${x.acceptingBlockHash}","id":"${id}"}\n`);n++;}}});
await r.subscribeVirtualChainChanged(true); ph("COUNTER_ON");
setInterval(()=>{const f=os.freemem()/1048576;fs.appendFileSync(path.join(DIR,"logs","ram.csv"),`${new Date().toISOString()},${f.toFixed(0)},${(process.memoryUsage().rss/1048576).toFixed(0)},${n}\n`);
 low=f<1024?low+1:0; if(low>=2){ph("COUNTER_STOP reason=ram free_mb="+f.toFixed(0));process.exit(3);}
 if(Date.now()>UNTIL){ph("COUNTER_OFF n="+n);OUT.end();setTimeout(()=>process.exit(0),500);}},5000);})().catch(e=>{ph("ERR "+String(e.message||e).slice(0,100));process.exit(1);});
