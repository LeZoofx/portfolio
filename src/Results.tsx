import {useState} from 'react';
import positioning from '../content/positioning.json';
import './positioning.css';
export function ResultsRibbon({compact=false}:{compact?:boolean}){
 const [paused,setPaused]=useState(false);
 return <section className={'results-ribbon'+(compact?' is-compact':'')} aria-label="Selected career results"><div className="results-label"><span>Selected results</span><button aria-label={paused?'Resume results animation':'Pause results animation'} onClick={()=>setPaused(!paused)} aria-pressed={paused}>{paused?'▶':'Ⅱ'}</button></div><div className="results-window"><div className="results-track" style={{animationPlayState:paused?'paused':'running'}}>{[0,1].map(copy=><div className="results-run" key={copy} aria-hidden={copy===1?true:undefined}>{positioning.statistics.map(s=><div className="result-item" key={s.value} title={s.detail}><strong>{s.value}</strong><div><span>{s.label}</span><small>{s.brand}</small></div></div>)}</div>)}</div></div></section>
}
export function WorkContext(){return <section className="work-context" aria-label="Approach and results"><div className="context-heading"><p>POST-PRODUCTION / PERFORMANCE</p><h2>The work behind<br/>the results.</h2><span>Creative decisions, grounded in how people watch.</span></div><div className="context-stories">{positioning.stories.map(s=><article key={s.brand}><p className="context-brand">{s.brand}</p><h3>{s.title}</h3><strong>{s.outcome}</strong><p>{s.text}</p></article>)}</div></section>}
