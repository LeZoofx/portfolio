import type {Project} from './content';
export const worlds=[
 {name:'Glass',kind:'glass',film:'videos-03',cards:['videos-02','social-02','videos-04'],egg:'social-02',icon:'aperture'},
 {name:'Mass',kind:'mass',film:'videos-02',cards:['videos-01','videos-03','stand-up-events-03'],egg:'videos-04',icon:'film'},
 {name:'Cut',kind:'cut',film:'social-12',cards:['brands-07','brands-11','brands-13'],egg:'brands-15',icon:'ticket'},
 {name:'1998',kind:'desktop',film:'social-short-format-11',cards:['social-short-format-03','brands-22','social-short-format-01'],egg:'brands-28',icon:'window'},
 {name:'Afterimage',kind:'afterimage',film:'social-short-format-01',cards:['videos-06','social-short-format-11','videos-04'],egg:'stand-up-events-03',icon:'frame'},
] as const;
export const wrap=(n:number)=>((n%worlds.length)+worlds.length)%worlds.length;
export const filmId=(p:Project)=>p.provider==='youtube'?p.embedUrl?.match(/embed\/([\w-]{11})/)?.[1]:undefined;
export type JourneyMotion={position:number;target:number;pointerX:number;pointerY:number;velocity:number;time:number;active:boolean;low:boolean;reduced:boolean;invalidate:()=>void};
