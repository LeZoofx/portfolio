import {type CSSProperties} from 'react';
export default function KineticType({text,variant}:{text:string;variant:number}){return <span className={'kinetic-type type-motion-'+variant} aria-label={text}>{[...text].map((letter,i)=><span key={i} aria-hidden="true" style={{'--glyph':i} as CSSProperties}>{letter===' '?'\u00a0':letter}</span>)}</span>}
