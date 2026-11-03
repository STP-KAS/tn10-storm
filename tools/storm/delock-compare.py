# per-family vs union landing and accepting-block sharing, a17 vs a18 (3 Nov). usage: delock-compare.py <private-runs dir>
import json,sys
from datetime import datetime
from collections import defaultdict,Counter
T=lambda s: datetime.fromisoformat(s.replace('Z','+00:00')).timestamp()
for run in ('a17','a18'):
  D=(sys.argv[1] if len(sys.argv)>1 else '/workspace/private-runs')+'/'+run
  cfg=json.load(open(D+'/config.json'))
  hops=[json.loads(l) for l in open(D+'/hops.jsonl') if l.strip()]
  ids={h['txid'] for h in hops}
  blk={}
  for l in open(D+'/accepted.jsonl'):
    if not l.strip(): continue
    a=json.loads(l)
    if a['id'] in ids: blk[a['id']]=a['b']
  sub=[json.loads(l) for l in open(D+'/submit-desk.jsonl') if l.strip()]
  print('==',run, 'stagger' , cfg.get('stagger_ms'))
  for s in cfg['schedule']:
    if s['step'] in('gap',) : continue
    a,b=T(s['from']),T(s['to']);n=int(b-a);F=s['families']
    hh=[h for h in hops if a<=T(h['seen_utc'])<b]
    if not hh: continue
    fams=sorted({h['family'] for h in hh})
    per={f:round(100*len({int(T(h['seen_utc'])-a) for h in hh if h['family']==f})/n,1) for f in fams}
    uni=round(100*len({int(T(h['seen_utc'])-a) for h in hh})/n,2)
    # independent expectation
    import math
    p=1
    for f in fams: p*= (1-per[f]/100)
    bf=defaultdict(set)
    for h in hh:
      if h['txid'] in blk: bf[blk[h['txid']]].add(h['family'])
    sh=Counter(len(v) for v in bf.values())
    ss=[x for x in sub if a<=T(x['ts'])<b]
    rc=Counter(x['result'] if x['result']=='ok' else x.get('reason') for x in ss)
    print(f"{s['step']:7} fam={len(fams)} hops={len(hh)} per={per} union={uni} indep={round(100*(1-p),2)} blocks={len(bf)} share={dict(sorted(sh.items()))} submits={dict(rc)}")
