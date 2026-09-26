import fs from 'node:fs';
const data=JSON.parse(fs.readFileSync('content/projects.json','utf8'));
const ids=new Set();
for(const p of data){
 if(!/^[a-z0-9-]+$/.test(p.id)||ids.has(p.id))throw Error('Invalid/duplicate project ID: '+p.id);ids.add(p.id);
 if(!p.title||!['youtube','trailers','short-form','events','brands'].includes(p.category))throw Error('Missing project title/category: '+p.id);
 for(const key of ['sourceUrl','embedUrl']){if(p[key]){const u=new URL(p[key]);if(u.protocol!=='https:')throw Error('HTTPS required: '+p.id);if(key==='embedUrl'&&!['www.youtube.com','www.youtube-nocookie.com','www.instagram.com','drive.google.com'].includes(u.hostname))throw Error('Unsupported embed host: '+p.id);}}
 for(const key of ['poster','image'])if(p[key]&&!/^https:/.test(p[key])&&!fs.existsSync('public/'+p[key]))throw Error('Missing image: '+p[key]);
}
console.log('Validated '+data.length+' projects.');
