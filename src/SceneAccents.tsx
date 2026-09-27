import type {ArtStyle} from './artStyles';
const flourish='M4 76C4 34 26 3 70 4C38 10 32 27 42 35C50 43 66 29 55 22C77 12 91 35 78 48C61 68 34 49 24 70C44 50 57 80 80 65M10 63C15 43 27 33 42 24M15 81C36 65 50 89 83 72';
const thorn='M150 10 143 50 120 34 135 67 105 61 133 83 111 100 140 98 150 148M150 38 171 14 159 67 195 40 174 81 213 75 177 106 205 123 166 116 150 148M150 148 126 168 134 202 113 185 124 218 99 238 137 226 150 272M150 160 181 183 171 209 202 202 178 229 190 255 159 235 150 272';
export default function SceneAccents({theme,art}:{theme:number;art?:ArtStyle}){
 return <div className={'scene-accents accents-'+theme} data-decoration={art} aria-hidden="true"><div className="accent-orbit"/><div className="accent-slab"/><div className="accent-halftone"/><div className="accent-cross"/><div className="accent-scan"/><div className="accent-perforations"/><div className="accent-bars">{Array.from({length:9},(_,i)=><i key={i}/>)}</div><div className="accent-pixel"><i/><i/><i/><i/></div>
 {art==='baroque'&&<><svg className="ornament ornament-a" viewBox="0 0 90 90"><path d={flourish}/></svg><svg className="ornament ornament-b" viewBox="0 0 90 90"><path d={flourish}/></svg><div className="ornate-oval"/></>}
 {(art==='sigil'||art==='curse')&&<svg className="cyber-emblem" viewBox="0 0 300 300"><g><path d={thorn}/><path d={thorn} transform="translate(300 0) scale(-1 1)"/><ellipse cx="150" cy="150" rx="24" ry="84"/><path d="M58 150 122 136 150 150 178 136 242 150 178 164 150 150 122 164Z"/></g></svg>}
 {art==='matchbox'&&<><div className="match-strike"/><svg className="match-emblem" viewBox="0 0 100 100"><path d="M50 7 60 36 91 25 74 50 91 75 60 64 50 93 40 64 9 75 26 50 9 25 40 36Z"/><circle cx="50" cy="50" r="18"/><path d="m42 36 22 14-22 14Z"/></svg></>}
 {art==='calendar'&&<div className="calendar-sheet"><div>चित्र · ध्वनि · संपादन</div><div className="calendar-rule"/><div className="calendar-cells">{['EDIT','MOTION','VFX','AI','COLOUR','SOUND','POST'].map(s=><span key={s}>{s}</span>)}</div></div>}
 {art==='aero'&&<><div className="aero-orb orb-one"/><div className="aero-orb orb-two"/><div className="aero-land"/><div className="aero-cloud"/></>}
 {art==='liquid'&&<><div className="liquid-lens lens-one"/><div className="liquid-lens lens-two"/></>}
 {art==='retro'&&<div className="retro-taskbar"><span>▦</span><i/><i/><i/><span>◷</span></div>}
 {art==='noir'&&<div className="noir-blinds"/>}
 {art==='pixel'&&<div className="pixel-grid"/>}
 {art==='anti'&&<div className="anti-stamp">POST<br/>PROD.</div>}
 {art==='brutal'&&<div className="brutal-arrow">↙</div>}
 </div>;
}
