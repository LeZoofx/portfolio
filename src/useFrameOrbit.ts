import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import type {JourneyMotion} from './journeyData';
type Box={x:number;y:number;width:number;angle:number};
export default function useFrameOrbit(count:number,enabled:boolean,motion:JourneyMotion){
 const gallery=useRef<HTMLDivElement>(null),[turn,setTurn]=useState(0),before=useRef(new Map<string,Box>()),animations=useRef<Animation[]>([]);
 useEffect(()=>{
  if(!enabled||count<2)return;
  const timer=setInterval(()=>{
   const el=gallery.current;if(!el||document.hidden||Math.abs(motion.velocity)>.025||Math.abs(motion.target-motion.position)>.015||el.matches(':hover')||el.contains(document.activeElement)||animations.current.some(a=>a.playState==='running'))return;
   const cards=Array.from(el.querySelectorAll<HTMLElement>('.depth-film'));
   // Read once per rotation, never once per scroll frame. Keep the DOM/player identities.
   before.current=new Map(cards.map(card=>[card.dataset.film!,{x:card.offsetLeft,y:card.offsetTop,width:card.offsetWidth,angle:parseFloat(getComputedStyle(card).rotate)||0}]));
   setTurn(value=>(value+1)%count);
  },8500);
  return()=>clearInterval(timer);
 },[count,enabled,motion]);
 useLayoutEffect(()=>{
  const el=gallery.current;if(!el||!before.current.size)return;
  const cards=Array.from(el.querySelectorAll<HTMLElement>('.depth-film'));
  const moves=cards.map(card=>({card,old:before.current.get(card.dataset.film!),x:card.offsetLeft,y:card.offsetTop,width:card.offsetWidth,angle:parseFloat(getComputedStyle(card).rotate)||0}));
  animations.current=[];
  for(const {card,old,x,y,width,angle} of moves){
   const body=card.querySelector<HTMLElement>('.depth-film-body');if(!old||!body||!width)continue;
   const dx=old.x-x,dy=old.y-y,scale=old.width/width,rotation=old.angle-angle,incoming=card.classList.contains('slot-0');
   animations.current.push(body.animate([
    {transform:`translate3d(${dx}px,${dy}px,0) rotateZ(${rotation}deg) scale(${scale})`},
    {offset:.48,transform:`translate3d(${dx*.44+(incoming?-32:32)}px,${dy*.44-26}px,${incoming?65:-50}px) rotateY(${incoming?-16:16}deg) rotateZ(${rotation*.44}deg) scale(${scale+(1-scale)*.56})`},
    {transform:'translate3d(0,0,0) rotateY(0deg) rotateZ(0deg) scale(1)'}
   ],{duration:1600,easing:'cubic-bezier(.22,.7,.2,1)'}));
  }
  const world=el.closest<HTMLElement>('.zoom-world');if(world){world.dataset.layoutVersion=String(turn);world.dispatchEvent(new Event('portfolio-layout',{bubbles:true}))}
  before.current.clear();
 },[turn]);
 useEffect(()=>()=>animations.current.forEach(a=>a.cancel()),[]);
 return {gallery,turn};
}
