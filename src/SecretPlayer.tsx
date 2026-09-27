import {useState,type CSSProperties} from 'react';
import type {Project} from './content';
import JourneyPlayer from './JourneyPlayer';
import './journey.css';
export default function SecretPlayer({project,kind,onClose,onOpen}:{project:Project;kind:string;onClose:()=>void;onOpen:()=>void}){
 const [muted,setMuted]=useState(true);
 return <aside className={'secret-reveal secret-'+kind+((project.aspect||16/9)<1?' secret-portrait':'')} aria-label="Featured project" style={{'--film-ratio':project.aspect||16/9} as CSSProperties}><div className="secret-bar"><span>Featured project</span><button onClick={onClose} aria-label="Close featured project">×</button></div><JourneyPlayer project={project} enabled muted={muted} playing onOpen={()=>{onClose();onOpen()}}/><div className="secret-caption"><span>{project.title.split(' | ')[0]}</span><button onClick={()=>setMuted(!muted)}>{muted?'Sound off':'Sound on'}</button></div></aside>
}
