// mkcfg4.cjs (2 Nov): desk-only config. args: src dst run_dir label startISO [base_rate=5]
const fs=require('fs');const [src,dst,run,label,st,br]=process.argv.slice(2);const BR=Number(br||5);const c=JSON.parse(fs.readFileSync(src,'utf8'));
c.run_dir=run;c.senders=['desk'];c.lanes={desk:{...c.lanes.desk,usable_min_tkas:9000}};
c.families=[...Array(8)].map((_,i)=>({key:i%4,launch_path:`launch::storm-2026-10-30-${label}-f${i+1}`,family:i+1}));
const T0=Date.parse(st);const z=(m)=>new Date(T0+m*60000).toISOString().slice(0,19)+'Z';const S=[];const add=(s,a,b,f,r)=>S.push({step:s,from:z(a),to:z(b),families:f,rate:r});
add('f1',0,8,1,BR);add('gap',8,10,0,0);add('f2',10,18,2,BR);add('gap',18,20,0,0);add('f4',20,28,4,BR);add('gap',28,30,0,0);
add('f8',30,38,8,BR);add('gap',38,40,0,0);[5,6,8,10,12].forEach((r,i)=>add('ramp'+r,40+2*i,42+2*i,4,r));
c.stagger_ms=Number(process.env.STAGGER_MS||700);c.lock_ms=150;c.schedule=S;  // 3 Nov a18 de-lock
c.family_check_utc=z(-10);c.sec_from_utc=z(-10);c.end_utc=z(50);fs.writeFileSync(dst,JSON.stringify(c,null,2));console.log('ok',S.length,z(0),c.end_utc);
