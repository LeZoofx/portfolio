import fs from 'node:fs/promises';
const path='content/video-metrics.json';
const prior=JSON.parse(await fs.readFile(path,'utf8'));
const projects=JSON.parse(await fs.readFile('content/projects.json','utf8')).filter(p=>p.provider==='youtube');
const verified=new Map(prior.videos.map(v=>[v.projectId,v]));
let next=0,updated=0;
async function worker(){
 while(next<projects.length){const p=projects[next++];try{
  const res=await fetch(p.sourceUrl,{signal:AbortSignal.timeout(18000)});
  if(!res.ok)continue;
  const html=await res.text();
  const fields=Object.fromEntries(['viewCount','channelId','author','videoId'].map(key=>[key,html.match(new RegExp('"'+key+'"\\s*:\\s*"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"'))?.[1]]));
  if(!/^\d+$/.test(fields.viewCount||'')||!fields.channelId||!fields.author||fields.videoId!==new URL(p.sourceUrl).searchParams.get('v'))continue;
  verified.set(p.id,{projectId:p.id,videoId:fields.videoId,title:p.title,url:p.sourceUrl,views:Number(fields.viewCount),channelId:fields.channelId,channel:JSON.parse('"'+fields.author+'"'),checkedAt:new Date().toISOString()});updated++;
 }catch{/* Keep the previous dated source when a public counter is unavailable. */}}
}
await Promise.all(Array.from({length:4},worker));
if(updated)await fs.writeFile(path,JSON.stringify({...prior,updatedAt:new Date().toISOString(),videos:projects.map(p=>verified.get(p.id)).filter(Boolean)},null,2)+'\n');
console.log(`Refreshed ${updated} public counters; retained dated snapshots for unavailable counters.`);
