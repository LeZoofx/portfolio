import {Suspense,lazy,useEffect,useRef,useState} from 'react';
import {asset,projects,type Project} from './content';
import showcase from '../content/showcase.json';
import KineticName from './KineticName';
import ClientMarquee from './ClientMarquee';
const SecretPlayer=lazy(()=>import('./SecretPlayer'));
const curated=showcase.filter(item=>projects.some(p=>p.id===item.id));
if(!curated.length)curated.push(...projects.slice(0,7).map(p=>({id:p.id,title:p.title.split(' | ')[0],label:p.category})));


export default function HomeIntro({onOpen,onFun,reduced}:{onOpen:(p:Project)=>void;onFun:()=>void;reduced:boolean}){
 const [secret,setSecret]=useState<Project|null>(null),secretTimer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 const [index,setIndex]=useState(0),[changing,setChanging]=useState(false),[held,setHeld]=useState(false);
 const timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined),deck=useRef<HTMLDivElement>(null);
 const previous=useRef(-1);
 function shuffle(){if(changing)return;setChanging(true);timer.current=setTimeout(()=>{setIndex(current=>{let choices=curated.map((_,i)=>i).filter(i=>i!==current&&i!==previous.current);if(!choices.length)choices=curated.map((_,i)=>i).filter(i=>i!==current);previous.current=current;return choices.length?choices[Math.floor(Math.random()*choices.length)]:current});setChanging(false)},reduced?0:340)}
 useEffect(()=>{if(reduced||held)return;const tick=setInterval(()=>{if(!document.hidden)shuffle()},6500);return()=>clearInterval(tick)},[reduced,held,changing]);
 useEffect(()=>()=>{clearTimeout(timer.current);clearTimeout(secretTimer.current)},[]);
 const item=curated[index],p=projects.find(x=>x.id===item.id)!;
 const next=projects.find(x=>x.id===curated[(index+1)%curated.length].id)!;
 return <><section className="home-intro" aria-label="Selected portfolio" onPointerMove={e=>{if(reduced||e.pointerType==='touch')return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--home-x',String((e.clientX-r.left)/r.width*2-1));e.currentTarget.style.setProperty('--home-y',String((e.clientY-r.top)/r.height*2-1))}}>
  <div className="home-floaters" aria-label="Hidden films">{['social-02','videos-04','brands-15'].map((id,i)=><button key={id} className={'floating-art floating-art-'+i} aria-label={'Discover '+projects.find(p=>p.id===id)?.title} onPointerEnter={e=>{if(e.pointerType==='mouse')secretTimer.current=setTimeout(()=>setSecret(projects.find(p=>p.id===id)!),650)}} onPointerLeave={()=>clearTimeout(secretTimer.current)} onWheel={()=>setSecret(projects.find(p=>p.id===id)!)} onClick={()=>setSecret(projects.find(p=>p.id===id)!)}><span className="float-solid">{Array.from({length:6},(_,j)=><i key={j}/>)}</span><span className="float-signal" aria-hidden="true">↗</span></button>)}</div>
  <div className="intro-identity"><p className="intro-kicker">CREATIVE PRODUCTION / POST / AI</p><h1><KineticName/></h1><p className="intro-location">Mumbai. Working everywhere.</p><button className="journey-entry" onClick={onFun}><span className="entry-prism" aria-hidden="true"><i/><i/><i/></span><span>Enter the other side<small>Five worlds. One practice.</small></span><span aria-hidden="true">↗</span></button></div>
  <div className={'showcase-deck'+(changing?' is-shuffling':'')} ref={deck} onPointerEnter={()=>setHeld(true)} onPointerLeave={()=>{setHeld(false);deck.current?.style.setProperty('--deck-x','0deg');deck.current?.style.setProperty('--deck-y','0deg')}} onFocusCapture={()=>setHeld(true)} onBlurCapture={()=>setHeld(false)} onPointerMove={e=>{if(reduced||e.pointerType==='touch')return;const r=e.currentTarget.getBoundingClientRect();deck.current?.style.setProperty('--deck-x',`${-(e.clientY-r.top-r.height/2)/r.height*6}deg`);deck.current?.style.setProperty('--deck-y',`${(e.clientX-r.left-r.width/2)/r.width*8}deg`)}}>
   <div className="deck-under" aria-hidden="true"><img src={asset(next.poster)} alt=""/></div>
   <button className={'deck-front'+((p.aspect||16/9)<1?' portrait-feature':'')} onClick={()=>onOpen(p)} aria-label={'Watch '+item.title}><img key={p.id} src={asset(p.poster)} alt={item.title} fetchPriority="high"/><span className="deck-play" aria-hidden="true">↗</span></button>
   <div className="deck-caption"><div><span>{item.label}</span><h2>{item.title}</h2></div><button className="shuffle-button" onClick={shuffle} aria-label="Shuffle selected work" disabled={curated.length<2}><span aria-hidden="true">⇄</span> Shuffle</button></div>
  </div>
  <div className="opening-stats" aria-label="Selected results"><div><strong>5.2M</strong><span>Views in one month<small>Trunativ</small></span></div><div><strong>+305%</strong><span>Viewership growth<small>Schbang</small></span></div><div><strong>{projects.length}</strong><span>Projects<small>In the archive</small></span></div></div>
 </section><ClientMarquee/>{secret&&<Suspense fallback={null}><SecretPlayer project={secret} kind="aperture" onClose={()=>setSecret(null)} onOpen={()=>onOpen(secret)}/></Suspense>}</>;
}
