import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {ArchiveArt,chapterNames,wrapChapter} from './ArchiveArt';
import {type Project} from './content';

export default function LightUniverse({projects,onProject,onIndex,paused,reduced}:{projects:Project[];onProject:(p:Project)=>void;onIndex:()=>void;paused:boolean;reduced:boolean}){
 const [chapter,setChapter]=useState(0),[progress,setProgress]=useState(0);
 const view=useRef<HTMLDivElement>(null),world=useRef<HTMLDivElement>(null);
 const motion=useRef({chapter:0,p:0,target:0,raf:0,last:0,paused:false,reduced:false,wake:()=>{},pointerX:0,pointerY:0});
 const m=motion.current;m.paused=paused;m.reduced=reduced;
 useEffect(()=>{
  const el=view.current;if(!el)return;let y=0,dragging=false,startY=0,moved=false;
  function frame(t:number){m.raf=0;if(m.paused||document.hidden)return;const dt=Math.min((t-m.last)/1000||.016,.05);m.last=t;m.p+=(m.target-m.p)*(1-Math.exp(-13*dt));if(Math.abs(m.target-m.p)<.0002)m.p=m.target;
   while(m.p>=1){m.p--;m.target--;m.chapter++;setChapter(m.chapter)}while(m.p<0){m.p++;m.target++;m.chapter--;setChapter(m.chapter)}
   setProgress(m.p);if(Math.abs(m.target-m.p)>.0002)m.raf=requestAnimationFrame(frame);
  }
  const wake=()=>{if(!m.raf){m.last=performance.now();m.raf=requestAnimationFrame(frame)}};m.wake=wake;
  const wheel=(e:WheelEvent)=>{if(e.ctrlKey||e.metaKey||m.paused||m.reduced)return;e.preventDefault();m.target+=Math.max(-120,Math.min(120,e.deltaY))*.001;wake()};
  const down=(e:PointerEvent)=>{if(e.pointerType==='touch'){dragging=true;y=startY=e.clientY;moved=false}};
  const move=(e:PointerEvent)=>{if(m.paused||m.reduced)return;if(dragging){m.target+=(y-e.clientY)*.0025;y=e.clientY;moved=Math.abs(y-startY)>8;wake()}else if(world.current){const r=el!.getBoundingClientRect();world.current.style.setProperty('--look-x',((e.clientX-r.left)/r.width-.5)*10+'px');world.current.style.setProperty('--look-y',((e.clientY-r.top)/r.height-.5)*7+'px')}};
  const up=()=>{dragging=false};const click=(e:MouseEvent)=>{if(moved){e.preventDefault();e.stopPropagation();moved=false}};
  el.addEventListener('wheel',wheel,{passive:false});el.addEventListener('pointerdown',down);el.addEventListener('pointermove',move);el.addEventListener('click',click,true);window.addEventListener('pointerup',up);document.addEventListener('visibilitychange',wake);wake();
  return()=>{cancelAnimationFrame(m.raf);el.removeEventListener('wheel',wheel);el.removeEventListener('pointerdown',down);el.removeEventListener('pointermove',move);el.removeEventListener('click',click,true);window.removeEventListener('pointerup',up);document.removeEventListener('visibilitychange',wake)};
 },[m]);
 useEffect(()=>{if(!paused)m.wake()},[paused,m]);
 function go(delta:number){if(reduced){m.chapter+=delta;m.p=m.target=0;setChapter(m.chapter);setProgress(0)}else{m.target=delta;m.wake()}}
 const c=wrapChapter(chapter),p=projects[c%projects.length];
 return <div className="universe light-universe" data-chapter={c} data-renderer="lightweight">
  <div className="zoom-viewport" ref={view} tabIndex={0} aria-label="Interactive portfolio. Scroll to zoom. Use chapter buttons to explore." onKeyDown={e=>{if(e.target!==e.currentTarget)return;if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();go(1)}if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();go(-1)}}}>
   <div className="zoom-world" ref={world} style={{'--zoom':Math.pow(20,progress),'--parallax':Math.min(1,progress*10, (1-progress)*10)} as CSSProperties}>
    <ArchiveArt projects={projects} chapter={chapter} onProject={onProject}/>
    <div className="zoom-next" style={{opacity:Math.min(1,progress*12)}}><ArchiveArt projects={projects} chapter={chapter+1}/></div>
   </div>
  </div>
  <div className="scene-top"><div><p className="mono">PRANTIK DUTTA / {String(c+1).padStart(2,'0')}—05</p><p className="scene-label">{chapterNames[c].split(' ')[0]}<br/>{chapterNames[c].split(' ').slice(1).join(' ')}</p></div><div className="scene-top-right"><button onClick={onIndex}>WORK INDEX ↗</button><p className="compatibility-label mono">LIGHTWEIGHT VIEW</p></div></div>
  <div className="scene-caption">{reduced?'USE THE CHAPTER CONTROLS':'SCROLL / DRAG TO GO DEEPER. CLICK A FRAME TO WATCH.'}</div>
  <div className="scene-bottom"><div className="scene-controls" aria-label="Scene navigation"><button aria-label="Previous chapter" onClick={()=>go(-1)}>←</button>{chapterNames.map((n,i)=><button key={n} className="chapter-dot" aria-label={n} aria-pressed={c===i} onClick={()=>go(i-c)}>{String(i+1).padStart(2,'0')}</button>)}<button aria-label="Next chapter" onClick={()=>go(1)}>→</button></div><p className="mono">A WORLD WITHIN A FRAME.<br/>KEEP GOING. COME BACK. LOOK CLOSER.</p>{p&&<button className="scene-open" onClick={()=>onProject(p)}>OPEN PROJECT ↗<small>{p.title}</small></button>}</div>
 </div>;
}
