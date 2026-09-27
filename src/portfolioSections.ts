import type {Category,Project} from './content';
export type PortfolioSection={id:string;category:Category|'selected';title:string;items:Project[];theme:number;layout:number;offset:number};
const groups:{category:Category;title:string;theme:number}[]=[
 {category:'trailers',title:'Trailers & film',theme:1},
 {category:'brands',title:'Brand campaigns',theme:2},
 {category:'short-form',title:'Short form & AI',theme:3},
 {category:'youtube',title:'YouTube & entertainment',theme:0},
 {category:'events',title:'Comedy & live events',theme:4},
];
export function buildSections(projects:Project[]):PortfolioSection[]{
 const lead=[...projects.filter(p=>p.featured),...projects].filter((p,i,a)=>a.findIndex(x=>x.id===p.id)===i).slice(0,7);
 const included=new Set(lead.map(p=>p.id));
 const sections:PortfolioSection[]=[{id:'selected',category:'selected',title:'Selected work',items:lead,theme:0,layout:0,offset:0}];
 const queues=groups.map(g=>({...g,items:projects.filter(p=>p.category===g.category&&!included.has(p.id)),page:0}));
 let offset=lead.length,round=0;
 while(queues.some(q=>q.items.length)){
  for(const q of queues){if(!q.items.length)continue;const items=q.items.splice(0,6);q.page++;sections.push({id:q.category+'-'+q.page,category:q.category,title:q.title,items,theme:q.theme,layout:(sections.length+round)%6,offset});offset+=items.length;}
  round++;
 }
 return sections;
}
