import {memo} from 'react';
import {asset} from './content';
import type {ArtStyle} from './artStyles';
// Geometry, lighting and facets are baked at build time. CSS moves the cached planes.
function JourneyScene({art}:{art:ArtStyle}){
 return <div className="journey-canvas baked-scenery" aria-hidden="true"><img src={asset('scenery/'+art+'.svg')} alt="" decoding="async" draggable="false"/></div>;
}
export default memo(JourneyScene);
