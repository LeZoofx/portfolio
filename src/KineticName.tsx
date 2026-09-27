import {useRef, type PointerEvent} from 'react';

export default function KineticName({compact=false}:{compact?:boolean}) {
 const root=useRef<HTMLSpanElement>(null);
 function move(e:PointerEvent<HTMLSpanElement>) {
  if(e.pointerType==='touch'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const letters=root.current?.querySelectorAll<HTMLElement>('.name-letter');
  letters?.forEach(letter=>{
   const r=letter.getBoundingClientRect(),distance=Math.abs(e.clientX-r.left-r.width/2);
   const force=Math.max(0,1-distance/(compact?65:190));
   letter.style.setProperty('--letter-flip',`${force*175}deg`);
   letter.style.setProperty('--letter-lift',`${-force*(compact?2:10)}px`);
  });
 }
 function clear(){root.current?.querySelectorAll<HTMLElement>('.name-letter').forEach(el=>{el.style.setProperty('--letter-flip','0deg');el.style.setProperty('--letter-lift','0px')})}
 return <span className={'kinetic-name'+(compact?' compact-name':'')} aria-label="Prantik Dutta" ref={root} onPointerMove={move} onPointerLeave={clear}>
  {['Prantik','Dutta'].map(word=><span className="name-word" key={word} aria-hidden="true">{[...word].map((letter,i)=><span className="name-letter" key={i}><span>{letter}</span><span className="letter-reverse">{letter}</span></span>)}</span>)}
 </span>;
}
