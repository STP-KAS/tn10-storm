# one-lane scorer (RUNBOOK 21). usage: score.py <dir with config.json phase.log submit-desk.jsonl hops.jsonl accepted.jsonl>
import json,sys,os,statistics as st
from datetime import datetime
D=sys.argv[1]
def T(s): return datetime.fromisoformat(s.replace('Z','+00:00')).timestamp()
def jl(f):
  p=os.path.join(D,f); return [json.loads(l) for l in open(p) if l.strip()] if os.path.exists(p) else []
cfg=json.load(open(os.path.join(D,'config.json'))); ph=open(os.path.join(D,'phase.log')).read().splitlines()
sub=jl('submit-desk.jsonl'); hops=jl('hops.jsonl'); acc=jl('accepted.jsonl')
skipped={l.split('step=')[1].strip() for l in ph if 'GATE_SKIP' in l}
stop=[l for l in ph if 'GATE_RAMP_STOP' in l]
if stop:
  after=stop[0].split('after=')[1].strip(); R=[s['step'] for s in cfg['schedule'] if s['step'].startswith('ramp')]
  skipped|=set(R[R.index(after)+1:])
steps=[s for s in cfg['schedule'] if s['step']!='gap' and s['step'] not in skipped]
for s in sub: s['_t']=T(s['ts'])
for h in hops: h['_t']=T(h['seen_utc'])
def at(x): return x/1000 if x>1e11 else x
accT={}
for a in acc:
  t=a['t']; accT[a['id']]=at(t) if not isinstance(t,str) else T(t)
res={};det={}
pre=[l for l in ph if 'PREFLIGHT exit=0' in l] and any('FAMILY_IDS n=%d'%len(cfg['families']) in l for l in ph) and not any('LAUNCH_ABORT' in l for l in ph)
res[1]=bool(pre)
c2=c3=c4=c5=True;land={};
for s in steps:
  a,b=T(s['from']),T(s['to']);n=int(b-a)
  ss=[x for x in sub if a<=x['_t']<b]; hh=[x for x in hops if a<=x['_t']<b]
  first=min([x['_t'] for x in ss],default=1e18)-a; secs={int(x['_t']-a) for x in ss}
  if first>1 or len(secs)<n: c2=False
  ok=[x for x in ss if x.get('result')=='ok']; ach=len(ok)/s['families']/n
  if ach<0.95*s['rate'] and not s['step'].startswith('ramp'): c3=False
  L=len({int(x['_t']-a) for x in hh})/n; land[s['step']]=round(L*100,2)
  if L<0.99 and s['families']>1: c4=False  # 3 Nov (stp 07:46): f1 judged on union landing below, not alone
  mg=0
  for f in range(1,s['families']+1):
    ts=sorted([a]+[x['_t'] for x in hh if x['family']==f]+[b]); mg=max(mg,max(y-x for x,y in zip(ts,ts[1:])))
  if mg>30: c5=False
  det[s['step']]=dict(first_s=round(first,2),attempt_secs=f'{len(secs)}/{n}',ok_per_fam_s=round(ach,2),rate=s['rate'],landing=land[s['step']],max_family_gap_s=round(mg,1),hops=len(hh))
allsec=set();tot=0
for s in steps:
  a,b=T(s['from']),T(s['to']);tot+=int(b-a);allsec|={int(x['_t']) for x in hops if a<=x['_t']<b}
union=len(allsec)/max(1,tot)
if union<0.99: c4=False
res[2],res[3],res[4],res[5]=c2,c3,c4,c5
res[6]=not any(k in l for l in ph for k in('SENDER_OFF','NODE_DROP','PROC_EXIT','POOL_LOW'))
W=[x for x in sub if any(T(s['from'])<=x['_t']<T(s['to']) for s in steps if not s['step'].startswith('ramp'))]
# 3 Nov fix (stp 07:46): contention rejects (already_spent, orphan, double-spend race losers) are the point of the test
# (RUNBOOK 5.2), so ok ratio = 1 - non-contention errors / attempts; contention reported separately. Before: ok/attempts.
CONT=('already_spent','orphan','double_spend','double-spend','race','already spent')
iscont=lambda x: x.get('result')!='ok' and any(k in (str(x.get('reason',''))+' '+str(x.get('err',''))).lower() for k in CONT)
ncont=sum(1 for x in W if x.get('result')!='ok' and not iscont(x)); cont=sum(1 for x in W if iscont(x))
okr=1-ncont/max(1,len(W)); okr_raw=sum(x.get('result')=='ok' for x in W)/max(1,len(W)); rp=sorted(x.get('rpc_ms',0) for x in W); p99=rp[int(.99*(len(rp)-1))] if rp else None
res[7]=okr>=0.99 and p99 is not None and p99<1000
HW=[x for x in hops if any(T(s['from'])<=x['_t']<T(s['to']) for s in steps)]
mini=sum(1 for x in HW if x['txid'] in accT)
res[8]=len(HW)>0 and abs(mini-len(HW))/len(HW)<=0.01
c9=[l for l in ph if 'CRIT9' in l]; res[9]=len(c9)==2 and all(('ours_new=0' in l) or ('ours=0 ' in l) for l in c9)
# 3 Nov (a17): the desk CRIT9 line can come out empty (stdout parse); the census file logs/mempool-ours.jsonl is the source of truth
mo=jl('mempool-ours.jsonl'); last={m['label']:m for m in mo}
if {'desk','mini'}<=set(last): res[9]=all(last[n]['snap1'].get('ours',1)==0 for n in ('desk','mini'))
subT={x['txid']:x['_t'] for x in sub if x.get('result')=='ok'}
lat=[accT[t]-subT[t] for t in (x['txid'] for x in HW) if t in accT and t in subT]
ramp_ok=bool(stop) or not any(s['step'].startswith('ramp') and s['step'] in skipped for s in cfg['schedule'])
res[10]=len(HW)>0 and len(lat)/len(HW)>=0.99 and ramp_ok
q=lambda v,p: round(sorted(v)[int(p*(len(v)-1))]*1000) if v else None
out=dict(score=sum(res.values()),criteria=res,skipped=sorted(skipped),steps=det,ok_ratio=round(okr,4),ok_ratio_raw=round(okr_raw,4),contention_rejects=cont,noncontention_errors=ncont,union_landing=round(union*100,2),rpc_p99_ms=p99,coord_hops=len(HW),mini_counted=mini,lat_cover=round(len(lat)/max(1,len(HW)),4),lat_p50_ms=q(lat,.5),lat_p95_ms=q(lat,.95),gates=[l[21:] for l in ph if 'GATE' in l or 'CLOCK' in l or 'MINERS' in l])
print(json.dumps(out,indent=1))
