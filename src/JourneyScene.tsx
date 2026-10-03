import {memo,useEffect,useRef} from 'react';
import {asset} from './content';
import type {ArtStyle} from './artStyles';
// Geometry, lighting and facets are baked at build time. CSS moves the cached planes.
function JourneyScene({art}:{art:ArtStyle}){
 const image=useRef<HTMLImageElement>(null);
 useEffect(()=>{const el=image.current;if(el?.complete)el.dataset.decoded="true"},[]);
 return <div className="journey-canvas baked-scenery" aria-hidden="true"><img ref={image} onLoad={e=>{e.currentTarget.dataset.decoded="true"}} src={asset('scenery/'+art+'.svg')} alt="" decoding="async" draggable="false"/></div>;
}
export default memo(JourneyScene);
