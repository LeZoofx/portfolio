import {useRef,useState} from 'react';
import clients from '../content/clients.json';
export default function ClientMarquee({compact=false}:{compact?:boolean}){
 const [paused,setPaused]=useState(false);
 const root=useRef<HTMLElement>(null);
 return <section className={'client-marquee'+(compact?' compact-clients':'')} ref={root} aria-label="Clients and collaborators" onPointerMove={e=>{const r=e.currentTarget.getBoundingClientRect();root.current?.style.setProperty('--brand-tilt',`${(e.clientX-r.left)/r.width*2-1}`)}}><h2>Clients &amp; collaborators<button onClick={()=>setPaused(!paused)} aria-pressed={paused} aria-label={paused?'Resume client animation':'Pause client animation'}>{paused?'▶':'Ⅱ'}</button></h2><div className="client-viewport"><div className="client-track" style={{animationPlayState:paused?'paused':'running'}}>{[0,1].map(copy=><div className="client-run" key={copy} aria-hidden={copy===1?true:undefined}>{clients.map((name,i)=><span key={name} className={'client-name client-type-'+i%5}>{name}<i aria-hidden="true">/</i></span>)}</div>)}</div></div></section>
}
