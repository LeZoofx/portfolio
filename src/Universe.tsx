import {Canvas, createPortal, useFrame, useThree} from '@react-three/fiber';
import {useEffect,useMemo,useRef,useState} from 'react';
import * as THREE from 'three';
import {asset,type Project} from './content';

const names=['THE ARCHIVE','THE IMPRESSION','THE COLLAGE','THE LANGUAGE','THE FRAME'];
const colors=['#dfff00','#f5442c','#385bff','#dfff00','#f5442c'];
const mod=(n:number)=>((n%5)+5)%5;
type Motion={chapter:number;position:number;target:number;pointer:THREE.Vector2;dirty:boolean;paused:boolean;reduced:boolean;low:boolean};
type Props={projects:Project[];onProject:(p:Project)=>void;onIndex:()=>void;paused:boolean;reduced:boolean};
function textTexture(text:string,color:string,bg:string,width=1024,height=256){
 const c=document.createElement('canvas');c.width=width;c.height=height;
 const x=c.getContext('2d')!;x.fillStyle=bg;x.fillRect(0,0,width,height);x.fillStyle=color;
 x.font='700 '+Math.round(height*.8)+'px Display, Impact, sans-serif';x.textBaseline='middle';
 const w=x.measureText(text).width;x.save();x.scale(Math.min(1,(width-32)/w),1);x.fillText(text,16,height*.48);x.restore();
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
function Label({text,color='#f1f0ea',bg='#181818',pos=[0,0,0],size=[15,3],rot=0}:{text:string;color?:string;bg?:string;pos?:[number,number,number];size?:[number,number];rot?:number}){
 const t=useMemo(()=>textTexture(text,color,bg),[text,color,bg]);useEffect(()=>()=>t.dispose(),[t]);
 return <mesh position={pos} rotation={[0,0,rot]}><planeGeometry args={size}/><meshBasicMaterial map={t} toneMapped={false}/></mesh>;
}
function usePoster(url:string|undefined){
 const [texture,setTexture]=useState<THREE.Texture|null>(null);const invalidate=useThree(s=>s.invalidate);
 useEffect(()=>{if(!url)return;let valid=true;let t:THREE.Texture|undefined;
 new THREE.TextureLoader().load(asset(url),value=>{t=value;value.colorSpace=THREE.SRGBColorSpace;value.anisotropy=2;if(valid){setTexture(value);invalidate()}else value.dispose()},undefined,()=>invalidate());
 return()=>{valid=false;t?.dispose();setTexture(null)}},[url,invalidate]);return texture;
}
function Picture({project,pos,size,rotation=0,onOpen}:{project:Project;pos:[number,number,number];size:[number,number];rotation?:number;onOpen?:()=>void}){
 const texture=usePoster(project.poster);
 useEffect(()=>{if(!texture?.image)return;const im=texture.image as HTMLImageElement;const ratio=im.width/im.height,frame=size[0]/size[1];texture.repeat.set(Math.min(1,frame/ratio),Math.min(1,ratio/frame));texture.offset.set((1-texture.repeat.x)/2,(1-texture.repeat.y)/2);texture.needsUpdate=true},[texture,size[0],size[1]]);
 return <group position={pos} rotation={[0,0,rotation]}>
 <mesh position={[.2,-.2,-.2]}><boxGeometry args={[size[0]+.5,size[1]+.5,.28]}/><meshStandardMaterial color="#3e3e38" roughness={1}/></mesh>
 <mesh onClick={e=>{e.stopPropagation();onOpen?.()}} onPointerOver={()=>{document.body.style.cursor='pointer'}} onPointerOut={()=>{document.body.style.cursor='auto'}}>
 <planeGeometry args={size}/><meshBasicMaterial map={texture} color={texture?'white':'#b6b6a7'} toneMapped={false}/></mesh></group>;
}
function Stage({chapter,projects,aspect,onOpen,portal,portalRef}:{chapter:number;projects:Project[];aspect:number;onOpen?:(p:Project)=>void;portal?:THREE.Texture;portalRef?:React.RefObject<THREE.MeshBasicMaterial|null>}){
 const c=mod(chapter),color=colors[c],mobile=aspect<.85,w=mobile?16:29;
 const p=projects[c%projects.length],q=projects[(c+1)%projects.length],r=projects[(c+2)%projects.length];
 if(!p)return null;
 return <group>
 <ambientLight intensity={2}/><directionalLight position={[-8,14,15]} intensity={3}/>
 <mesh position={[0,0,-6]}><planeGeometry args={[250,180]}/><meshBasicMaterial color={c===2?'#162442':c===1?'#252019':'#161817'}/></mesh>
 <mesh position={[0,-12,-1]} rotation={[-.8,0,-.06]}><boxGeometry args={[w*2,10,.5]}/><meshStandardMaterial color={color} roughness={.9}/></mesh>
 <mesh position={[-w*.53,0,-2]} rotation={[0,.55,.03]}><boxGeometry args={[2,25,2]}/><meshStandardMaterial color="#797970" roughness={1}/></mesh>
 <mesh position={[w*.55,0,-2]} rotation={[0,-.5,-.06]}><boxGeometry args={[2,27,2]}/><meshStandardMaterial color="#43483c" roughness={1}/></mesh>
 <Label text={c===0?'PRANTIK':c===1?'IMPRESSION':c===2?'PLAY / REPEAT':c===3?'IDEA → IMAGE':'LOOK CLOSER'} color={color} bg={c===2?'#162442':'#171817'} pos={[0,12,-1]} size={[w*1.35,5.7]} rot={c===2?.05:-.025}/>
 <Picture project={p} pos={[0,.8,-.8]} size={[w*.83,mobile?10:12.5]} rotation={c===2?-.08:.03} onOpen={()=>onOpen?.(p)}/>
 <Picture project={q} pos={[-w*.42,-6,1]} size={[mobile?7:12,7]} rotation={-.14} onOpen={()=>onOpen?.(q)}/>
 <Picture project={r} pos={[w*.43,5,1]} size={[mobile?6:10,6.3]} rotation={.15} onOpen={()=>onOpen?.(r)}/>
 <Label text={p.category.toUpperCase()+' / '+p.id.toUpperCase()} color="#101010" bg={color} pos={[0,-10.7,2]} size={[w*.86,1.3]} rot={-.02}/>
 {c===2&&[0,1,2].map(i=><Label key={i} text="CUT / REFRAME" color={i===1?'#161616':color} bg={i===1?color:'#161616'} pos={[-w*.45+i*2,7-i*3,3]} size={[10,1.3]} rot={-.35}/>)}
 {c===3&&[0,1,2,3].map(i=><Label key={i} text={['DIRECTION','PRODUCTION','POST-PRODUCTION','AI VISUALS'][i]} color={i===2?'#161616':'#efefe4'} bg={i===2?color:'#161616'} pos={[(i%2===0?-1:1)*w*.27,8-i*4,2+i*.25]} size={[mobile?8:12,1.5]} rot={i%2===0?.07:-.07}/>)}
 {c===1&&[0,1,2,3,4,5,6,7].map(i=><mesh key={i} position={[0,9-i*2.5,3-i*.13]} rotation={[0,0,.025*Math.sin(i)]}><planeGeometry args={[w*1.2,.18+i*.02]}/><meshBasicMaterial color={i%2?color:'#edede2'} transparent opacity={.3+i*.07}/></mesh>)}
 {portal&&<mesh position={[0,0,4]} renderOrder={20}><planeGeometry args={[3.2*aspect,3.2]}/><meshBasicMaterial ref={portalRef} map={portal} toneMapped={false} transparent opacity={0}/></mesh>}
 <Label text="PRANTIK DUTTA / CREATIVE & VISUAL DIRECTION" color="#9c9d91" bg="#161817" pos={[0,-15,-2]} size={[w*.95,.95]}/>
 </group>;
}
function Runtime({motion,projects,onChapter,onOpen}:{motion:Motion;projects:Project[];onChapter:(n:number)=>void;onOpen:(p:Project)=>void}){
 const {gl,scene,camera,size,invalidate,setDpr}=useThree();const aspect=size.width/size.height;
 const nextScene=useMemo(()=>new THREE.Scene(),[]);const introCamera=useMemo(()=>new THREE.PerspectiveCamera(40,aspect,.1,300),[]);
 const target=useMemo(()=>new THREE.WebGLRenderTarget(Math.min(size.width,1024),Math.min(size.height,1024),{depthBuffer:true}),[size.width,size.height]);
 const material=useRef<THREE.MeshBasicMaterial>(null);const frame=useRef(0);const dirtyFrames=useRef(8);
 const position=useRef(new THREE.Vector2());const [chapter,setChapter]=useState(motion.chapter);
 const end=4+3.2/(2*Math.tan(THREE.MathUtils.degToRad(20))),start=4+(end-4)*10;
 useEffect(()=>()=>target.dispose(),[target]);
 useEffect(()=>{dirtyFrames.current=12;introCamera.aspect=aspect;introCamera.position.set(0,0,start);introCamera.lookAt(0,0,4);introCamera.updateProjectionMatrix();invalidate()},[aspect,chapter,projects,target,introCamera,invalidate,start]);
 useEffect(()=>{const canvas=gl.domElement;const restore=()=>{dirtyFrames.current=12;invalidate()};canvas.addEventListener('webglcontextrestored',restore);return()=>canvas.removeEventListener('webglcontextrestored',restore)},[gl,invalidate]);
 useFrame((state,rawDt)=>{
  if(motion.paused||document.hidden)return;
  const dt=Math.min(rawDt,.05);
  const factor=1-Math.exp(-12*dt);motion.position+=(motion.target-motion.position)*factor;
  if(Math.abs(motion.target-motion.position)<.0001)motion.position=motion.target;
  while(motion.position>=1){motion.position-=1;motion.target-=1;motion.chapter++;setChapter(motion.chapter);onChapter(motion.chapter);dirtyFrames.current=12;}
  while(motion.position<0){motion.position+=1;motion.target+=1;motion.chapter--;setChapter(motion.chapter);onChapter(motion.chapter);dirtyFrames.current=12;}
  const u=motion.position,fade=1-THREE.MathUtils.smoothstep(u,.6,1);
  position.current.lerp(motion.pointer,motion.reduced?1:factor);
  camera.position.set(position.current.x*.75*fade,position.current.y*.4*fade,4+(start-4)*Math.pow(.1,u));
  camera.lookAt(0,0,4);(camera as THREE.PerspectiveCamera).fov=40;camera.updateProjectionMatrix();
  if(material.current)material.current.opacity=THREE.MathUtils.smoothstep(u,.02,.15);
  {gl.setRenderTarget(target);gl.render(nextScene,introCamera);gl.setRenderTarget(null);dirtyFrames.current--;}
  gl.render(scene,camera);
  frame.current++;if(frame.current%120===0){setDpr(motion.low?1:Math.min(devicePixelRatio,aspect<.85?1:1.5));}
  if(import.meta.env.DEV)(window as any).__portfolioStats={chapter:motion.chapter,progress:u,drawCalls:gl.info.render.calls,triangles:gl.info.render.triangles,textures:gl.info.memory.textures,geometries:gl.info.memory.geometries};
  if(Math.abs(motion.target-motion.position)>.0001||position.current.distanceTo(motion.pointer)>.001||dirtyFrames.current>0)invalidate();
 },1);
 useEffect(()=>{const canvas=gl.domElement;let lastY=0,touch=false;
  const wheel=(e:WheelEvent)=>{if(e.ctrlKey||e.metaKey||motion.paused||motion.reduced)return;e.preventDefault();motion.target+=THREE.MathUtils.clamp(e.deltaY,-120,120)*.0008;invalidate()};
  const down=(e:PointerEvent)=>{if(e.pointerType==='touch'){touch=true;lastY=e.clientY}};
  const move=(e:PointerEvent)=>{if(motion.paused)return;if(touch&&e.pointerType==='touch'&&!motion.reduced){motion.target+=(lastY-e.clientY)*.002;lastY=e.clientY}else{const r=canvas.getBoundingClientRect();motion.pointer.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height*2-1))}invalidate()};
  const up=()=>{touch=false};const wake=()=>invalidate();
  canvas.addEventListener('wheel',wheel,{passive:false});canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);window.addEventListener('pointerup',up);document.addEventListener('visibilitychange',wake);
  return()=>{canvas.removeEventListener('wheel',wheel);canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);document.removeEventListener('visibilitychange',wake);document.body.style.cursor='auto'};
 },[gl,motion,invalidate]);
 useEffect(()=>{invalidate()},[motion.target,motion.paused,motion.chapter,invalidate]);
 useEffect(()=>{setDpr(motion.low?1:Math.min(devicePixelRatio,aspect<.85?1:1.5));invalidate()},[motion.low,aspect,setDpr,invalidate]);
 return <><Stage chapter={chapter} projects={projects} aspect={aspect} portal={target.texture} portalRef={material} onOpen={onOpen}/>{createPortal(<Stage chapter={chapter+1} projects={projects} aspect={aspect}/>,nextScene)}</>;
}
export default function Universe({projects,onProject,onIndex,paused,reduced}:Props){
 const [chapter,setChapter]=useState(0),[low,setLow]=useState(false),[tick,setTick]=useState(0);
 const motion=useMemo<Motion>(()=>({chapter:0,position:0,target:0,pointer:new THREE.Vector2(),dirty:true,paused:false,reduced:false,low:false}),[]);
 motion.paused=paused;motion.reduced=reduced;motion.low=low;
 function go(delta:number){if(reduced){motion.chapter+=delta;motion.position=0;motion.target=0;setChapter(motion.chapter);setTick(t=>t+1)}else{motion.target=Math.floor(motion.position)+delta;setTick(t=>t+1)}}
 const c=mod(chapter),p=projects[c%projects.length];
 return <div className="universe" data-chapter={c} data-tick={tick}><Canvas key={reduced?chapter:'continuous'} frameloop="demand" dpr={low?1:[1,1.5]} camera={{position:[0,0,48],fov:40,near:.1,far:300}} gl={{antialias:true,alpha:false,powerPreference:'high-performance'}} onCreated={({gl})=>{gl.setClearColor('#161817');gl.toneMapping=THREE.NoToneMapping}}><Runtime motion={motion} projects={projects} onChapter={setChapter} onOpen={onProject}/></Canvas>
 <div className="scene-top"><div><p className="mono">PRANTIK DUTTA / {String(c+1).padStart(2,'0')}—05</p><p className="scene-label">{names[c].split(' ')[0]}<br/>{names[c].split(' ').slice(1).join(' ')}</p></div><div className="scene-top-right"><button onClick={onIndex}>WORK INDEX ↗</button><br/><button aria-pressed={low} onClick={()=>setLow(!low)}>{low?'LOW':'AUTO'} QUALITY</button></div></div>
 <div className="scene-caption">{reduced?'USE THE CHAPTER CONTROLS':'SCROLL / DRAG TO GO DEEPER. CLICK A FRAME TO WATCH.'}</div>
 <div className="scene-bottom"><div className="scene-controls" aria-label="Scene navigation"><button aria-label="Previous chapter" onClick={()=>go(-1)}>←</button>{names.map((n,i)=><button key={n} className="chapter-dot" aria-label={n} aria-pressed={c===i} onClick={()=>{if(reduced){motion.chapter+=i-c;motion.position=motion.target=0;setChapter(motion.chapter);setTick(t=>t+1)}else{motion.target+=i-c;setTick(t=>t+1)}}}>{String(i+1).padStart(2,'0')}</button>)}<button aria-label="Next chapter" onClick={()=>go(1)}>→</button></div><p className="mono">A WORLD WITHIN A FRAME.<br/>KEEP GOING. COME BACK. LOOK CLOSER.</p>{p&&<button className="scene-open" onClick={()=>onProject(p)}>OPEN PROJECT ↗<small>{p.title}</small></button>}</div></div>;
}

