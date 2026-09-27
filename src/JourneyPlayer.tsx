import {useEffect,useRef,useState} from 'react';
import {asset,type Project} from './content';
import {filmId} from './journeyData';
type Player={mute:()=>void;unMute:()=>void;playVideo:()=>void;pauseVideo:()=>void;destroy:()=>void;loadVideoById:(id:string)=>void;seekTo:(n:number,allow:boolean)=>void;getVideoData:()=>{video_id?:string}};
declare global {interface Window {YT?:{Player:new(el:HTMLElement,opts:Record<string,unknown>)=>Player};onYouTubeIframeAPIReady?:()=>void}}
let apiPromise:Promise<void>|undefined;
function playerAPI(){
 if(window.YT?.Player)return Promise.resolve();
 if(!apiPromise)apiPromise=new Promise<void>((resolve,reject)=>{
  const previous=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{previous?.();resolve()};
  const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.async=true;script.onerror=()=>{apiPromise=undefined;reject(new Error('Player unavailable'))};document.head.appendChild(script);
 });return apiPromise;
}
export default function JourneyPlayer({project,enabled,muted,playing,onOpen}:{project:Project;enabled:boolean;muted:boolean;playing:boolean;onOpen:()=>void}){
 const host=useRef<HTMLDivElement>(null),player=useRef<Player|null>(null),ready=useRef(false),latest=useRef({project,muted,playing});latest.current={project,muted,playing};
 const [status,setStatus]=useState<'poster'|'loading'|'playing'|'blocked'>('poster');
 const [requested,setRequested]=useState(false),currentId=useRef(''),timeout=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 const id=filmId(project),allowed=(enabled||requested)&&!!id;
 function startDeadline(){clearTimeout(timeout.current);timeout.current=setTimeout(()=>setStatus(s=>s==='playing'?s:'blocked'),10000)}
 useEffect(()=>{
  if(!allowed){setStatus('poster');return}
  let disposed=false;ready.current=false;setStatus('loading');startDeadline();
  playerAPI().then(()=>{
   if(disposed||!host.current||!window.YT)return;
   const mount=document.createElement('div');host.current.replaceChildren(mount);currentId.current=filmId(latest.current.project)||'';
   player.current=new window.YT.Player(mount,{host:'https://www.youtube-nocookie.com',videoId:currentId.current,playerVars:{autoplay:1,mute:1,playsinline:1,controls:0,rel:0,enablejsapi:1,origin:location.origin},events:{
    onReady:()=>{if(disposed||!player.current)return;ready.current=true;player.current.mute();const wanted=filmId(latest.current.project);if(wanted&&wanted!==currentId.current){currentId.current=wanted;player.current.loadVideoById(wanted)}if(latest.current.playing&&!document.hidden)player.current.playVideo();else player.current.pauseVideo()},
    onStateChange:(event:{data:number})=>{if(disposed||!ready.current)return;const actual=player.current?.getVideoData().video_id;if(actual&&actual!==filmId(latest.current.project))return;if(event.data===1){setStatus('playing');clearTimeout(timeout.current);if(!latest.current.playing||document.hidden)player.current?.pauseVideo();else if(!latest.current.muted)player.current?.unMute()}if(event.data===0){player.current?.seekTo(0,true);if(latest.current.playing&&!document.hidden)player.current?.playVideo()}},
    onAutoplayBlocked:()=>!disposed&&setStatus('blocked'),onError:()=>!disposed&&setStatus('blocked')
   }});
  }).catch(()=>!disposed&&setStatus('blocked'));
  return()=>{disposed=true;ready.current=false;clearTimeout(timeout.current);player.current?.destroy();player.current=null;host.current?.replaceChildren()};
 },[allowed]);
 useEffect(()=>{if(!id||currentId.current===id)return;setStatus(allowed?'loading':'poster');if(!allowed)return;startDeadline();const timer=setTimeout(()=>{if(ready.current&&player.current){currentId.current=id;player.current.mute();player.current.loadVideoById(id)}},260);return()=>clearTimeout(timer)},[id,allowed]);
 useEffect(()=>{if(!ready.current)return;if(muted)player.current?.mute();else player.current?.unMute()},[muted,status]);
 useEffect(()=>{if(!ready.current)return;if(playing&&!document.hidden)player.current?.playVideo();else player.current?.pauseVideo()},[playing]);
 useEffect(()=>{const visibility=()=>{if(!ready.current)return;if(document.hidden)player.current?.pauseVideo();else if(latest.current.playing)player.current?.playVideo()};document.addEventListener('visibilitychange',visibility);return()=>document.removeEventListener('visibilitychange',visibility)},[]);
 function play(){setRequested(true);if(ready.current){player.current?.mute();player.current?.playVideo();startDeadline()}}
 return <div className={'journey-picture '+(status==='playing'?'is-playing':'')} data-player-state={status}>
  {project.poster&&<img className="journey-poster" src={asset(project.poster)} alt={project.title} decoding="async"/>}
  <div className="journey-player-host" ref={host}/>
  {(status==='poster'||status==='blocked')&&<button className="ambient-play" onClick={id?play:onOpen} aria-label={'Play '+project.title}><span aria-hidden="true">▶</span></button>}
  <button className="film-expand" aria-label={'Open '+project.title} onClick={onOpen}>↗</button>
 </div>;
}
