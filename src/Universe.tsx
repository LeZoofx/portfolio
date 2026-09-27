import {Component,Suspense,lazy,useEffect,useMemo,useRef,useState,type ReactNode} from 'react';
import type {Project} from './content';
import type {JourneyMotion} from './journeyData';
import type {PortfolioSection} from './portfolioSections';
import PortfolioScroll from './PortfolioScroll';
import './journey.css';
const Scene=lazy(()=>import('./JourneyScene'));
const SecretPlayer=lazy(()=>import('./SecretPlayer'));
class GeometryBoundary extends Component<{children:ReactNode;onFailure:()=>void},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true}}componentDidCatch(){this.props.onFailure()}render(){return this.state.failed?null:this.props.children}}
export default function Universe({projects,onProject,onIndex,paused,reduced}:{projects:Project[];onProject:(p:Project)=>void;onIndex:()=>void;paused:boolean;reduced:boolean}){
 const root=useRef<HTMLDivElement>(null),[graphics,setGraphics]=useState(true),[secret,setSecret]=useState<Project|null>(null),[theme,setTheme]=useState(0);
 const motion=useMemo<JourneyMotion>(()=>({position:0,target:0,pointerX:0,pointerY:0,velocity:0,time:0,active:true,low:false,reduced:false,invalidate:()=>{}}),[]);
 const wake=useRef(()=>{}),settings=useRef({paused,reduced});settings.current={paused,reduced};motion.active=!paused;motion.reduced=reduced;
 useEffect(()=>{motion.low=(navigator.hardwareConcurrency||8)<=4},[motion]);
 useEffect(()=>{const el=root.current;if(!el)return;let raf=0,last=0,px=0,py=0;
  function frame(t:number){raf=0;if(settings.current.paused||document.hidden)return;const dt=Math.min((t-last)/1000,.035)||.016;last=t;const old=motion.position;motion.position+=(motion.target-motion.position)*(1-Math.exp(-7*dt));motion.velocity=(motion.position-old)/dt;motion.pointerX+=(px-motion.pointerX)*.12;motion.pointerY+=(py-motion.pointerY)*.12;motion.time=t/1000;el!.style.setProperty('--pointer-x',String(motion.pointerX));el!.style.setProperty('--pointer-y',String(motion.pointerY));motion.invalidate();if(Math.abs(motion.target-motion.position)>.001||Math.abs(px-motion.pointerX)+Math.abs(py-motion.pointerY)>.004)raf=requestAnimationFrame(frame)}
  function start(){if(!raf){last=performance.now();raf=requestAnimationFrame(frame)}}wake.current=start;
  const pointer=(e:PointerEvent)=>{if(settings.current.reduced||e.pointerType==='touch')return;const r=el.getBoundingClientRect();px=(e.clientX-r.left)/r.width*2-1;py=1-(e.clientY-r.top)/r.height*2;start()};const leave=()=>{px=py=0;start()};el.addEventListener('pointermove',pointer,{passive:true});el.addEventListener('pointerleave',leave);document.addEventListener('visibilitychange',start);start();return()=>{cancelAnimationFrame(raf);el.removeEventListener('pointermove',pointer);el.removeEventListener('pointerleave',leave);document.removeEventListener('visibilitychange',start)};
 },[motion]);
 useEffect(()=>{wake.current()},[paused,reduced,graphics]);
 function sectionChanged(section:PortfolioSection,_index:number,progress:number){setTheme(section.theme);motion.target=section.theme+Math.max(0,progress)*.22;wake.current()}
 return <div className="journey portfolio-experience" ref={root} data-theme={['glass','mass','cut','desktop','afterimage'][theme]}>
  <div className="portfolio-geometry" aria-hidden="true">{graphics&&!reduced?<GeometryBoundary onFailure={()=>setGraphics(false)}><Suspense fallback={null}><Scene motion={motion} onDiscover={()=>setSecret(projects[0])} onFailure={()=>setGraphics(false)}/></Suspense></GeometryBoundary>:<div className="compatible-geometry"><div className="compatible-cube">{Array.from({length:6},(_,i)=><i key={i}/>)}</div><div className="compatible-ring"/></div>}</div>
  <div className="portfolio-scroller" style={{overflowY:paused?'hidden':'auto'}} tabIndex={0} aria-label="Complete portfolio"><PortfolioScroll projects={projects} onProject={onProject} onIndex={onIndex} paused={paused||!!secret} reduced={reduced} immersive onSection={sectionChanged} onDiscover={setSecret}/></div>
  {secret&&!paused&&<Suspense fallback={null}><SecretPlayer project={secret} kind={['aperture','film','ticket','window','frame'][theme]} onClose={()=>setSecret(null)} onOpen={()=>onProject(secret)}/></Suspense>}
 </div>;
}
