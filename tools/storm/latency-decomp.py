# latency-decomp.py (4 Nov, a22): splits submit -> accepting-header time per step into desk -> mini mempool first-seen (propagation) and first-seen -> accepting header (inclusion). usage: latency-decomp.py <private run dir with submit-desk, hops, firstseen, accepted, config>. Prints aggregates only.
import json,statistics as st,sys
from datetime import datetime
T=lambda s: datetime.fromisoformat(s.replace('Z','+00:00')).timestamp()
D=sys.argv[1] if len(sys.argv)>1 else '.'
sub={};
for l in open(D+'/submit-desk.jsonl'):
  x=json.loads(l)
  if x['result']=='ok': sub[x['txid']]=x
fs={}
for l in open(D+'/firstseen.jsonl'):
  x=json.loads(l); fs.setdefault(x['id'],T(x['t']))
blk={}
for l in open(D+'/accepted.jsonl'):
  x=json.loads(l); t=x['t']; t=T(t) if isinstance(t,str) else (t/1000 if t>1e11 else t)
  blk.setdefault(x['id'],[]).append(t)
cfg=json.load(open(D+'/config.json'))
steps=[s for s in cfg['schedule'] if s['step']!='gap']
def q(v,p): v=sorted(v); return round(v[int(p*(len(v)-1))]*1000) if v else None
rows={}
for l in open(D+'/hops.jsonl'):
  h=json.loads(l); s=sub.get(h['txid'])
  if not s: continue
  ts=T(s['ts']); ah=T(h['accept_header_utc']); st_=next((x['step'] for x in steps if T(x['from'])<=ts<T(x['to'])),None)
  if not st_: continue
  r=rows.setdefault(st_,{'prop':[],'fs2acc':[],'tot':[],'firstblk':[],'blk2acc':[]})
  r['tot'].append(ah-ts)
  if h['txid'] in fs: r['prop'].append(fs[h['txid']]-ts); r['fs2acc'].append(ah-fs[h['txid']])
  if h['txid'] in blk: b=min(blk[h['txid']]); r['firstblk'].append(b-ts); r['blk2acc'].append(ah-b)
for k,r in rows.items():
  print(k,'n',len(r['tot']),'tot p50/p95',q(r['tot'],.5),q(r['tot'],.95),'| desk->mini fs p50/p95',q(r['prop'],.5),q(r['prop'],.95),'cov',len(r['prop']),'| fs->acc p50',q(r['fs2acc'],.5),'| submit->first containing blk(mini t) p50/p95',q(r['firstblk'],.5),q(r['firstblk'],.95),'| firstblk->accept hdr p50',q(r['blk2acc'],.5))
