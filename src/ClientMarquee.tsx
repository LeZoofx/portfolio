import {useState,type CSSProperties} from 'react';
import clients from '../content/clients.json';
const rows=[0,1,2].map(row=>clients.filter((_,i)=>i%3===row));
export default function ClientMarquee({compact=false}:{compact?:boolean}){
 const [paused,setPaused]=useState(false);
 return <section className={'client-marquee triple-marquee'+(compact?' compact-clients':'')} aria-label="Clients and collaborators">
  <h2><span>Clients &amp;<br/>collaborators</span><button onClick={()=>setPaused(!paused)} aria-pressed={paused} aria-label={paused?'Resume client animation':'Pause client animation'}>{paused?'▶':'Ⅱ'}</button></h2>
  <div className="client-rows">{rows.map((names,row)=><div className={'client-viewport client-row-'+row} key={row}>
   <div className="client-track" style={{animationPlayState:paused?'paused':'running','--row-duration':(row===1?42:row===2?49:46)+'s'} as CSSProperties}>
    {[0,1].map(copy=><div className="client-run" key={copy} aria-hidden={copy===1?true:undefined}>
     {names.map((name,i)=><span key={name} className={'client-name client-type-'+(i+row)%5+(name==='Google'?' client-google':'')}>{name}<i aria-hidden="true">✳</i></span>)}
    </div>)}
   </div>
  </div>)}</div>
 </section>;
}
