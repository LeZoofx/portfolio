import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import type {JourneyMotion} from './journeyData';
type Box={x:number;y:number;width:number;angle:number;filter:string};
export default function useFrameOrbit(count:number,enabled:boolean,motion:JourneyMotion){
 const gallery=useRef<HTMLDivElement>(null),[turn,setTurn]=useState(0),before=useRef(new Map<string,Box>()),animations=useRef<Animation[]>([]);
 useEffect(()=>{
  if(!enabled||count<2)return;
  let timer:ReturnType<typeof setTimeout>,pressed=false;
  const el=gallery.current;if(!el)return;
  const down=()=>{pressed=true},up=()=>{pressed=false};
  el.addEventListener('pointerdown',down);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',up);
  function rotate(){
   timer=setTimeout(rotate,5400);
   // A resting pointer does not freeze the gallery. Hold only during deliberate interaction.
   if(!el||document.hidden||pressed||Math.abs(motion.velocity)>.025||Math.abs(motion.target-motion.position)>.015||el.querySelector(':focus-visible')||animations.current.some(a=>a.playState==='running'))return;
   before.current=new Map(Array.from(el.querySelectorAll<HTMLElement>('.depth-film')).map(card=>[card.dataset.film!,{x:card.offsetLeft,y:card.offsetTop,width:card.offsetWidth,angle:parseFloat(getComputedStyle(card).rotate)||0,filter:getComputedStyle(card.querySelector('.depth-film-body')!).filter}]));
   setTurn(value=>(value+1)%count);
  }
  timer=setTimeout(rotate,2800);
  return()=>{clearTimeout(timer);el.removeEventListener('pointerdown',down);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',up)};
 },[count,enabled,motion]);
 useLayoutEffect(()=>{
  const el=gallery.current;if(!el||!before.current.size)return;
  const moves=Array.from(el.querySelectorAll<HTMLElement>('.depth-film')).map(card=>({card,body:card.querySelector<HTMLElement>('.depth-film-body')!,old:before.current.get(card.dataset.film!),x:card.offsetLeft,y:card.offsetTop,width:card.offsetWidth,angle:parseFloat(getComputedStyle(card).rotate)||0}));
  const targets=moves.map(move=>({...move,filter:getComputedStyle(move.body).filter}));
  animations.current=[];
  for(const {card,body,old,x,y,width,angle,filter} of targets){
   if(!old||!body?.animate||!width)continue;
   const dx=old.x-x,dy=old.y-y,scale=old.width/width,rotation=old.angle-angle,incoming=card.classList.contains('slot-0');
   animations.current.push(body.animate([
    {transform:`translate3d(${dx}px,${dy}px,0) rotateZ(${rotation}deg) scale(${scale})`,filter:old.filter},
    {offset:.5,transform:`translate3d(${dx*.47+(incoming?-30:30)}px,${dy*.47-35}px,${incoming?55:-65}px) rotateY(${incoming?-11:11}deg) rotateZ(${rotation*.47}deg) scale(${scale+(1-scale)*.53})`,filter:incoming?'blur(.7px) brightness(.92)':'blur(1.7px) brightness(.72)'},
    {transform:'translate3d(0,0,0) rotateY(0deg) rotateZ(0deg) scale(1)',filter}
   ],{duration:2200,easing:'cubic-bezier(.4,0,.2,1)'}));
  }
  const world=el.closest<HTMLElement>('.zoom-world');if(world){world.dataset.layoutVersion=String(turn);world.dispatchEvent(new Event('portfolio-layout',{bubbles:true}))}
  before.current.clear();
 },[turn]);
 useEffect(()=>()=>animations.current.forEach(a=>a.cancel()),[]);
 return {gallery,turn};
}
