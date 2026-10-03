import {asset,previewAsset,previewSrcSet, type Project} from './content';

export const chapterNames=['THE ARCHIVE','THE IMPRESSION','THE COLLAGE','THE LANGUAGE','THE FRAME'];
export const wrapChapter=(n:number)=>((n%5)+5)%5;
export function ArchiveArt({projects,chapter=0,onProject}:{projects:Project[];chapter?:number;onProject?:(p:Project)=>void}){
 const c=wrapChapter(chapter),labels=['IDEA / IMAGE / IMPACT','CONTACT / TRACE / MEMORY','CUT / REFRAME / REPEAT','FORM FOLLOWS FEELING','EVERY FRAME COUNTS'];
 return <div className={'archive-art art-'+c} aria-hidden={!onProject}>
  <div className="art-floor"/><div className="art-pillar pillar-left"/><div className="art-pillar pillar-right"/>
  <div className="art-type">{['PRANTIK','IMPRESSION','PLAY / REPEAT','IDEA → IMAGE','LOOK CLOSER'][c]}</div>
  <div className="art-issue">{String(c+1).padStart(2,'0')}<span> / VISUAL STUDIES</span></div>
  {Array.from({length:3},(_,i)=>{const p=projects[(c+i)%projects.length];return p&&<div className={'art-frame frame-'+i} key={i}>{onProject?<button aria-label={'Open '+p.title} onClick={()=>onProject(p)}>{p.poster?<img src={previewAsset(p.poster)} srcSet={previewSrcSet(p.poster)} sizes="(max-width:699px) 75vw, 42vw" alt="" draggable={false}/>:<b>{p.title}</b>}</button>:p.poster?<img src={previewAsset(p.poster)} srcSet={previewSrcSet(p.poster)} sizes="(max-width:699px) 75vw, 42vw" alt="" draggable={false}/>:<b>{p.title}</b>}<span className="art-tape">{i===0?labels[c]:p.category.toUpperCase()+' / '+p.id.toUpperCase()}</span></div>})}
  {c===1&&<div className="contact-strips" aria-hidden="true"/>}
  {c===2&&<div className="collage-type" aria-hidden="true">CUT /<br/>REPEAT /<br/>REFRAME.</div>}
  {c===3&&<div className="language-type" aria-hidden="true">DIRECTION<br/><span>PRODUCTION</span><br/>AI VISUALS</div>}
  {c===4&&<div className="frame-sprockets" aria-hidden="true"/>}
  <div className="art-facet facet-one"/><div className="art-facet facet-two"/><div className="art-registration"/>
  <div className="art-footer">PRANTIK DUTTA / CREATIVE & VISUAL DIRECTION</div>
 </div>;
}
