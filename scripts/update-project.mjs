import fs from 'node:fs/promises';
const input=name=>(process.env['INPUT_'+name]||'').trim();
const title=input('TITLE'),url=new URL(input('URL')),category=input('CATEGORY');
if(!title||title.length>240)throw Error('Enter a title under 240 characters.');
if(url.protocol!=='https:')throw Error('Use an HTTPS project URL.');
if(!['short-form','brands','youtube','trailers','events'].includes(category))throw Error('Choose a listed category.');
const items=JSON.parse(await fs.readFile('content/projects.json','utf8'));
let id=input('PROJECT_ID');if(id&&!items.some(p=>p.id===id))throw Error('That project ID does not exist; leave it blank to add a project.');
if(!id){id=title.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70)||'project';const stem=id;let n=2;while(items.some(p=>p.id===id))id=stem+'-'+n++;}
if(!/^[a-z0-9-]+$/.test(id))throw Error('Invalid project ID.');
const old=items.find(p=>p.id===id)||{};
const p={...old,id,title,category,sourceUrl:url.href,description:input('DESCRIPTION'),role:input('ROLE'),disclosure:input('DISCLOSURE'),featured:input('FEATURED')==='true',order:old.order||items.length+1,provider:'external'};
if(old.sourceUrl&&old.sourceUrl!==p.sourceUrl){delete p.poster;delete p.embedUrl;}
const host=url.hostname.replace(/^www\./,'');
let yt='';if(host==='youtu.be')yt=url.pathname.split('/')[1];if(host==='youtube.com')yt=url.searchParams.get('v')||url.pathname.match(/\/(?:shorts|embed)\/([^/]+)/)?.[1]||'';
if(yt&&/^[\w-]{11}$/.test(yt)){p.provider='youtube';p.embedUrl='https://www.youtube.com/embed/'+yt;p.aspect=url.pathname.includes('/shorts/')?9/16:16/9;try{const r=await fetch('https://img.youtube.com/vi/'+yt+'/hqdefault.jpg',{signal:AbortSignal.timeout(10000)});if(r.ok&&r.headers.get('content-type')?.startsWith('image/')){const bytes=Buffer.from(await r.arrayBuffer());if(bytes.length<5*1024*1024){await fs.mkdir('public/media',{recursive:true});await fs.writeFile('public/media/'+id+'.jpg',bytes);p.poster='media/'+id+'.jpg'}}}catch{}}
else if(host==='instagram.com'){const post=url.pathname.match(/\/(?:p|reel|reels)\/([\w-]+)/)?.[1];if(post){p.provider='instagram';p.embedUrl='https://www.instagram.com/p/'+post+'/embed/';p.aspect=9/16}}
else if(host==='drive.google.com'){const file=url.pathname.match(/\/file\/d\/([\w-]+)/)?.[1];if(file){p.provider='drive';p.embedUrl='https://drive.google.com/file/d/'+file+'/preview';p.aspect=16/9}}
if(p.provider==='external')delete p.embedUrl;
const index=items.findIndex(x=>x.id===id);if(index>=0)items[index]=p;else items.push(p);
if(p.featured){items.splice(items.indexOf(p),1);items.unshift(p);items.filter(x=>x.featured).slice(4).forEach(x=>x.featured=false);}
await fs.writeFile('content/projects.json',JSON.stringify(items,null,2)+'\n');
console.log('Saved '+id+'. The publishing workflow will now build the updated site.');
