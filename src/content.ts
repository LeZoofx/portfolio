import site from '../content/site.json';
import projectData from '../content/projects.json';
export type Category = 'youtube' | 'trailers' | 'short-form' | 'events' | 'brands';
export type Project = {
  id: string; title: string; category: Category; provider: 'youtube'|'instagram'|'drive'|'image'|'external';
  sourceUrl: string; embedUrl?: string; poster?: string; image?: string;
  description?: string; disclosure?: string; role?: string; featured?: boolean;
  aspect?: number; order: number; status?: string;
};
export const projects = projectData as Project[];
export {site};
export const categories: {id:Category;label:string;short:string;route:string}[] = [
 {id:'short-form',label:'AI & short format',short:'SHORT FORM',route:'social-short-format'},
 {id:'brands',label:'Brand campaigns',short:'CAMPAIGNS',route:'brands'},
 {id:'youtube',label:'YouTube',short:'YOUTUBE',route:'social'},
 {id:'trailers',label:'Trailers',short:'TRAILERS',route:'videos'},
 {id:'events',label:'Stand-up & events',short:'LIVE',route:'stand-up-events'},
];
export const asset = (path: string|undefined) => path ? (/^https?:/.test(path) ? path : import.meta.env.BASE_URL + path.replace(/^\//,'')) : '';
export const href = (path='') => import.meta.env.BASE_URL + path.replace(/^\//,'');
export const projectPath = (id:string) => href('work/'+id+'/');
