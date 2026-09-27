import {Component,Suspense,lazy,useEffect,useMemo,useRef,useState,type CSSProperties,type ReactNode} from 'react';
import {asset,projectPath,platformLabel,type Project} from './content';
import {buildSections,brandFor,portfolioCategories,type PortfolioSection,type WorkSort} from './portfolioSections';
import type {JourneyMotion} from './journeyData';
import BrandControls from './BrandControls';
import {ResultsRibbon} from './Results';
import JourneyPlayer from './JourneyPlayer';
import KineticName from './KineticName';
import KineticType from './KineticType';
import SceneAccents from './SceneAccents';
import ClientMarquee from './ClientMarquee';
import PosterType,{KineticCopy} from './PosterType';
import {posterCopy} from './artStyles';
import showcase from '../content/showcase.json';
import positioning from '../content/positioning.json';
import './journey.css';
import './depth-journey.css';
const Scene=lazy(()=>import('./JourneyScene'));
const SecretPlayer=lazy(()=>import('./SecretPlayer'));
const themes=['glass','mass','cut','desktop','afterimage','editorial'];
const modulo=(n:number,total:number)=>((n%total)+total)%total;
const smooth=(a:number,b:number,value:number)=>{const n=Math.max(0,Math.min(1,(value-a)/(b-a)));return n*n*(3-2*n)};
const title=(p:Project)=>p.title.split(' | ')[0].replace(/\s*\(Official.*$/i,'').replace(/\s*- Official Trailer$/i,'');
class GeometryBoundary extends Component<{children:ReactNode;onFailure:()=>void},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true}}componentDidCatch(){this.props.onFailure()}render(){return this.state.failed?null:this.props.children}}
function Discovery({project,onReveal,theme}:{project:Project;onReveal:(p:Project)=>void;theme:number}){
 const timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);useEffect(()=>()=>clearTimeout(timer.current),[]);
 return <button className={'depth-discovery discovery-object-'+theme} aria-label={'Discover '+title(project)} onPointerEnter={e=>{if(e.pointerType==='mouse')timer.current=setTimeout(()=>onReveal(project),800)}} onPointerLeave={()=>clearTimeout(timer.current)} onWheel={()=>onReveal(project)} onClick={()=>onReveal(project)}><span className="discovery-solid" aria-hidden="true">{Array.from({length:6},(_,i)=><i key={i}/>)}</span></button>
}
function DepthWorld({section,active,autoplay,compact,paused,playing,muted,onProject,onDiscover}:{section:PortfolioSection;active:boolean;autoplay:boolean;compact:boolean;paused:boolean;playing:boolean;muted:boolean;onProject:(p:Project)=>void;onDiscover:(p:Project)=>void}){
 const playable=section.items.filter(p=>p.provider==='youtube').slice(0,compact?2:3).map(p=>p.id);
 return <><SceneAccents theme={section.theme} art={section.art}/><div className="depth-heading">{section.category==='selected'&&section.offset===0?<><p className="depth-specialty"><KineticCopy text={positioning.eyebrow}/></p><h1><KineticName/></h1><PosterType lines={posterCopy.selected} art={section.art} className="depth-poster-copy"/></>:<><p className="depth-specialty"><KineticCopy text={section.focus}/></p><h2><KineticType text={section.title} variant={section.theme}/></h2><PosterType lines={posterCopy[section.category]} art={section.art} className="depth-poster-copy"/></>}</div>
 <div className="depth-type-field" aria-hidden="true"><KineticType text={section.category==='selected'?'POST':section.title.toUpperCase()} variant={section.theme}/></div>
 <div className="depth-gallery">{section.items.map((p,i)=><article className={'depth-film slot-'+i+((p.aspect||16/9)<1?' portrait-film':'')} key={p.id} style={{'--film-ratio':p.aspect||16/9,'--tile':i} as CSSProperties}>
  <div className="depth-film-label"><span><KineticCopy text={brandFor(p)||section.title}/></span><span className="depth-platform">{platformLabel(p)} <i aria-hidden="true">{section.theme===3?'_ □':'↗'}</i></span></div>
  <div className="depth-film-frame">{active&&autoplay&&playable.includes(p.id)&&!paused?<JourneyPlayer project={p} enabled muted={muted||p.id!==playable[0]} playing={playing} onOpen={()=>onProject(p)}/>:<a className="depth-poster" href={projectPath(p.id)} onClick={e=>{if(!e.metaKey&&!e.ctrlKey){e.preventDefault();onProject(p)}}} aria-label={'Watch '+title(p)}>{p.poster?<img src={asset(p.poster)} alt={title(p)} decoding="async"/>:<span>{title(p)}</span>}<span className="depth-play" aria-hidden="true">▶</span></a>}</div>
  <a className="depth-caption" href={projectPath(p.id)} onClick={e=>{if(!e.metaKey&&!e.ctrlKey){e.preventDefault();onProject(p)}}}><KineticCopy text={title(p)}/><span aria-hidden="true">↗</span></a>
 </article>)}</div>
 <Discovery project={section.items[Math.min(2,section.items.length-1)]} onReveal={onDiscover} theme={section.theme}/>
 <div className="depth-registration" aria-hidden="true"><i/><i/><i/><i/></div></>;
}
export default function Universe({projects,onProject,onIndex,paused,reduced}:{projects:Project[];onProject:(p:Project)=>void;onIndex:()=>void;paused:boolean;reduced:boolean}){
 const [brand,setBrand]=useState('all'),[sort,setSort]=useState<WorkSort>('curated'),[compact,setCompact]=useState(false),[saveData,setSaveData]=useState(false),[graphics,setGraphics]=useState(true);
 const sections=useMemo(()=>buildSections(projects,sort,brand,compact?3:6),[projects,sort,brand,compact]);
 const total=sections.length,root=useRef<HTMLDivElement>(null),scroll=useRef<HTMLDivElement>(null),worldRefs=useRef(new Map<number,HTMLDivElement>()),backdropRefs=useRef(new Map<number,HTMLDivElement>());
 const [chapter,setChapter]=useState(0),[base,setBase]=useState(0),[secret,setSecret]=useState<Project|null>(null),[muted,setMuted]=useState(true),[playing,setPlaying]=useState(true),[shuffle,setShuffle]=useState(0),[held,setHeld]=useState(false);
 const motion=useMemo<JourneyMotion>(()=>({position:0,target:0,pointerX:0,pointerY:0,velocity:0,time:0,active:true,low:false,reduced:false,invalidate:()=>{}}),[]);
 const settings=useRef({paused,reduced,secret:!!secret});settings.current={paused,reduced,secret:!!secret};motion.active=!paused&&!secret;motion.reduced=reduced;
 const wake=useRef(()=>{}),navigate=useRef<(index:number)=>void>(()=>{}),current=useRef(0);
 const section=sections[modulo(chapter,total)]||sections[0];
 const shuffleProject=projects.find(p=>p.id===showcase[shuffle%showcase.length].id)||projects[0];
 useEffect(()=>{const mq=matchMedia('(max-width:699px)');const sync=()=>setCompact(mq.matches);sync();mq.addEventListener('change',sync);const n=navigator as Navigator&{connection?:{saveData?:boolean};deviceMemory?:number};setSaveData(!!n.connection?.saveData);motion.low=!!n.connection?.saveData||(n.deviceMemory||8)<=4||(n.hardwareConcurrency||8)<=4;return()=>mq.removeEventListener('change',sync)},[motion]);
 useEffect(()=>{if(reduced||held||paused)return;const timer=setInterval(()=>{if(!document.hidden)setShuffle(i=>(i+1+Math.floor(Math.random()*(showcase.length-1)))%showcase.length)},1700);return()=>clearInterval(timer)},[reduced,held,paused]);
 useEffect(()=>{
  const scroller=scroll.current,outer=root.current;if(!scroller||!outer||!total)return;let unit=1,raf=0,last=0,lastRaw=0,px=0,py=0,lastBase=-1,lastChapter=-1,lastDirection=1,snapTimer:ReturnType<typeof setTimeout>|undefined;motion.position=0;motion.target=0;current.current=0;setChapter(0);setBase(0);
  function draw(t:number){raf=0;if(settings.current.paused||settings.current.secret||document.hidden)return;const dt=Math.min((t-last)/1000,.035)||.016;last=t;const prior=motion.position;motion.position+=(motion.target-motion.position)*(settings.current.reduced?1:1-Math.exp(-8*dt));if(Math.abs(motion.target-motion.position)<.0001)motion.position=motion.target;motion.velocity=(motion.position-prior)/dt;motion.pointerX+=(px-motion.pointerX)*.09;motion.pointerY+=(py-motion.pointerY)*.09;motion.time=t/1000;
   const p=modulo(motion.position,total),nextBase=Math.floor(p),nextChapter=modulo(Math.floor(p+.48),total);
   if(nextBase!==lastBase){lastBase=nextBase;setBase(nextBase)}if(nextChapter!==lastChapter){lastChapter=nextChapter;current.current=nextChapter;setChapter(nextChapter)}
   outer!.style.setProperty('--pointer-x',String(motion.pointerX));outer!.style.setProperty('--pointer-y',String(motion.pointerY));outer!.style.setProperty('--travel-phase',String(p%1));outer!.style.setProperty('--travel-speed',String(Math.min(1,Math.abs(motion.velocity))));
   const ambience=smooth(.22,.75,p%1);backdropRefs.current.forEach((layer,index)=>{layer.style.opacity=String(index===nextBase?1-ambience:index===modulo(nextBase+1,total)?ambience:0)});
   worldRefs.current.forEach((layer,index)=>{let delta=index-p;delta-=Math.round(delta/total)*total;const nearest=index===nextChapter;let opacity=delta<0?1-smooth(.22,.68,-delta):1-smooth(.8,1.75,delta);if(settings.current.reduced)opacity=nearest?1:0;const travel=settings.current.reduced?0:delta;const x=travel*Math.sin(index*1.9)*90+motion.pointerX*7,y=travel*Math.cos(index*1.3)*45-motion.pointerY*5,depth=-travel*1550;layer.style.transform=`translate3d(${x}px,${y}px,${depth}px) rotateY(${settings.current.reduced?0:travel*Math.sin(index+1)*6+motion.pointerX*.6}deg) rotateZ(${settings.current.reduced?0:travel*Math.cos(index+2)*2}deg)`;layer.style.opacity=String(opacity);layer.style.visibility=opacity<.01?'hidden':'visible';layer.style.pointerEvents=nearest?'auto':'none';layer.inert=!nearest;layer.style.setProperty('--depth',String(travel));layer.style.zIndex=String(Math.round(100-delta*10));});
   motion.invalidate();if(Math.abs(motion.target-motion.position)>.0001||Math.abs(px-motion.pointerX)+Math.abs(py-motion.pointerY)>.005)raf=requestAnimationFrame(draw);
  }
  function start(){if(!raf){last=performance.now();raf=requestAnimationFrame(draw)}}wake.current=start;
  function resize(){unit=scroller!.clientHeight*1.55;outer!.style.setProperty('--depth-unit',unit+'px');outer!.style.setProperty('--depth-pages',String(total+2));lastRaw=modulo(motion.target,total);scroller!.scrollTop=(lastRaw+1)*unit;start()}
  function onScroll(){let raw=scroller!.scrollTop/unit-1;if(raw>=total){raw-=total;scroller!.scrollTop-=total*unit}else if(raw<0){raw+=total;scroller!.scrollTop+=total*unit}let delta=raw-lastRaw;if(delta>total/2)delta-=total;if(delta< -total/2)delta+=total;motion.target+=delta;lastRaw=raw;if(Math.abs(delta)>.0001)lastDirection=Math.sign(delta);clearTimeout(snapTimer);snapTimer=setTimeout(()=>{const p=modulo(motion.target,total),nearest=Math.round(p);if(Math.abs(p-nearest)<.005)return;const fraction=p-Math.floor(p);const destination=fraction<.12?Math.floor(p):fraction>.88?Math.ceil(p):lastDirection>0?Math.ceil(p):Math.floor(p);navigate.current(destination)},340);start()}
  navigate.current=(index:number)=>{const dest=modulo(index,total),origin=modulo(motion.position,total);let distance=dest-origin;if(distance>total/2)distance-=total;if(distance< -total/2)distance+=total;motion.target=motion.position+distance;if(Math.abs(distance)>1.2)motion.position=motion.target-Math.sign(distance)*.58;lastRaw=dest;scroller!.scrollTop=(dest+1)*unit;start()};
  const pointer=(e:PointerEvent)=>{if(settings.current.reduced||e.pointerType==='touch')return;const r=outer!.getBoundingClientRect();px=(e.clientX-r.left)/r.width*2-1;py=1-(e.clientY-r.top)/r.height*2;start()},leave=()=>{px=py=0;start()},home=()=>navigate.current(0);
  const observer=new ResizeObserver(resize);observer.observe(scroller);resize();scroller.addEventListener('scroll',onScroll,{passive:true});outer.addEventListener('pointermove',pointer,{passive:true});outer.addEventListener('pointerleave',leave);document.addEventListener('visibilitychange',start);window.addEventListener('portfolio-home',home);start();
  return()=>{clearTimeout(snapTimer);observer.disconnect();cancelAnimationFrame(raf);scroller.removeEventListener('scroll',onScroll);outer.removeEventListener('pointermove',pointer);outer.removeEventListener('pointerleave',leave);document.removeEventListener('visibilitychange',start);window.removeEventListener('portfolio-home',home)};
 },[motion,sections,total]);
 useEffect(()=>{wake.current()},[base,paused,reduced,secret,graphics]);
 const visible=[...new Set([modulo(base-1,total),base,modulo(base+1,total)])];
 return <div ref={root} className={'journey depth-journey'+(reduced?' reduced-depth':'')} data-theme={themes[section.theme]} data-category={section.category} data-art={section.art}>
  <div ref={scroll} className="depth-scroll" tabIndex={0} aria-label="Scroll through the portfolio in 3D" style={{overflowY:paused||secret?'hidden':'auto'}} onKeyDown={e=>{if(e.target!==e.currentTarget)return;if(['PageDown','ArrowRight'].includes(e.key)){e.preventDefault();navigate.current(current.current+1)}if(['PageUp','ArrowLeft'].includes(e.key)){e.preventDefault();navigate.current(current.current-1)}if(e.key==='Home'){e.preventDefault();navigate.current(0)}}}>
   <div className="depth-track"><div className="depth-stage">
    <div className="depth-atmosphere" aria-hidden="true">{visible.map(index=><div key={sections[index].id} ref={el=>{if(el)backdropRefs.current.set(index,el);else backdropRefs.current.delete(index)}} className={'depth-backdrop backdrop-'+sections[index].art} style={{opacity:index===chapter?1:0}}/>)}</div>
    <div className="depth-landscape" aria-hidden="true"><div className="depth-floor"/><div className="depth-horizon"/>{Array.from({length:8},(_,i)=><div className={'lowpoly-pillar pillar-'+i} key={i} style={{'--pillar':i} as CSSProperties}><i/><i/><i/></div>)}</div>
    {graphics&&!reduced&&<GeometryBoundary onFailure={()=>setGraphics(false)}><Suspense fallback={null}><Scene motion={motion} styles={sections.map(s=>s.art)} onDiscover={()=>setSecret(section.items[0])} onFailure={()=>setGraphics(false)}/></Suspense></GeometryBoundary>}
    <div className="depth-worlds">{visible.map(index=><div ref={el=>{if(el)worldRefs.current.set(index,el);else worldRefs.current.delete(index)}} key={sections[index].id} className={'zoom-world zoom-tone-'+themes[sections[index].theme]+' zoom-layout-'+sections[index].layout} data-depth-index={index} data-art={sections[index].art} aria-label={sections[index].title} style={{opacity:index===chapter?1:0}}><div className="depth-portal" aria-hidden="true"/><DepthWorld section={sections[index]} active={index===chapter} autoplay={!reduced&&!saveData} compact={compact} paused={paused||!!secret} muted={muted} playing={playing} onProject={onProject} onDiscover={setSecret}/></div>)}</div>
   </div></div>
  </div>
  <div className="depth-topbar"><nav aria-label="Portfolio categories">{portfolioCategories.map(c=>{const index=sections.findIndex(s=>s.category===c.id);return <button key={c.id} aria-current={section.category===c.id?'location':undefined} disabled={index<0} onClick={()=>navigate.current(index)}>{c.label}</button>})}</nav><button className="depth-index" onClick={onIndex}>All work ↗</button></div>
  <div className="depth-toolbar"><BrandControls projects={projects} brand={brand} onBrand={setBrand} sort={sort} onSort={setSort}/>{section.category==='selected'&&<button className="depth-shuffle" onMouseEnter={()=>setHeld(true)} onMouseLeave={()=>setHeld(false)} onFocus={()=>setHeld(true)} onBlur={()=>setHeld(false)} onClick={()=>onProject(shuffleProject)} aria-label={'Open '+title(shuffleProject)}><img key={shuffleProject.id} src={asset(shuffleProject.poster)} alt=""/><span>{showcase[shuffle%showcase.length].title}</span><i aria-hidden="true">⇄</i></button>}</div>
  <div className="depth-bottom"><ClientMarquee compact/><ResultsRibbon compact/><div className="depth-navigation"><div><button aria-label="Previous scene" onClick={()=>navigate.current(current.current-1)}>←</button><span>{section.title}</span><button aria-label="Next scene" onClick={()=>navigate.current(current.current+1)}>→</button></div><span className="depth-scroll-hint">Scroll to explore <i aria-hidden="true">↓</i></span><div><button onClick={()=>setMuted(!muted)} aria-pressed={!muted}>{muted?'Sound off':'Sound on'}</button><button onClick={()=>setPlaying(!playing)} aria-pressed={!playing}>{playing?'Pause films':'Play films'}</button></div></div></div>
  {secret&&!paused&&<Suspense fallback={null}><SecretPlayer project={secret} kind={['aperture','film','ticket','window','frame','aperture'][section.theme]} onClose={()=>setSecret(null)} onOpen={()=>{setSecret(null);onProject(secret)}}/></Suspense>}
 </div>;
}
