import {useRef,type CSSProperties,type PointerEvent} from 'react';
export default function KineticType({text,variant}:{text:string;variant:number}){
 const root=useRef<HTMLSpanElement>(null);
 function move(e:PointerEvent<HTMLSpanElement>){if(e.pointerType==='touch'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const box=e.currentTarget.getBoundingClientRect();root.current?.style.setProperty('--type-x',String((e.clientX-box.left)/box.width-.5));root.current?.style.setProperty('--type-y',String((e.clientY-box.top)/box.height-.5))}
 return <span className={'kinetic-type type-motion-'+variant} aria-label={text} ref={root} onPointerMove={move} onPointerLeave={()=>{root.current?.style.setProperty('--type-x','0');root.current?.style.setProperty('--type-y','0')}}>{text.split(' ').map((word,w)=><span className="type-word" key={w} aria-hidden="true">{[...word].map((letter,i)=><span className="type-glyph" key={i} style={{'--glyph':i+w*4,'--parity':i%2?1:-1} as CSSProperties}><span className="glyph-front">{letter}</span><span className="glyph-echo">{letter}</span></span>)}</span>)}</span>
}
