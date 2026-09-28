import {createContext,useCallback,useContext,useEffect,useMemo,useRef,useState,type ReactNode} from 'react';
import {chooseQuality,MediaQueue,type Quality} from './capabilities';
type Connection=EventTarget&{saveData?:boolean;effectiveType?:string;downlink?:number;rtt?:number};
type Device=Navigator&{deviceMemory?:number;connection?:Connection};
type Experience={quality:Quality;ready:boolean;mediaReady:boolean;maxPlayers:number;light:boolean;setLight:(value:boolean)=>void;reportFrame:(ms:number)=>void;resumeSection:string};
const noop=()=>{};
const Context=createContext<Experience>({quality:'balanced',ready:false,mediaReady:false,maxPlayers:0,light:false,setLight:noop,reportFrame:noop,resumeSection:''});
const mediaQueue=new MediaQueue();
export function usePerformance(){return useContext(Context)}
export function useVideoPermit(wanted:boolean,priority=0){
 const {mediaReady,quality}=usePerformance(),[permit,setPermit]=useState(false);
 useEffect(()=>{setPermit(false);if(!wanted||!mediaReady||quality==='simple')return;let mounted=true;const release=mediaQueue.request(value=>{if(mounted)setPermit(value)},priority);return()=>{mounted=false;release()}},[wanted,mediaReady,quality,priority]);
 return wanted&&permit;
}
export function listenMedia(query:MediaQueryList,callback:()=>void){if(query.addEventListener){query.addEventListener('change',callback);return()=>query.removeEventListener('change',callback)}query.addListener(callback);return()=>query.removeListener(callback)}
function detect(){const n=navigator as Device;return chooseQuality({supported:!!(window.IntersectionObserver&&window.ResizeObserver&&typeof Element.prototype.animate==='function'&&window.CSS?.supports('transform-style','preserve-3d')),memory:n.deviceMemory,cores:n.hardwareConcurrency,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,...n.connection&&{saveData:n.connection.saveData,effectiveType:n.connection.effectiveType,downlink:n.connection.downlink,rtt:n.connection.rtt}})}
export function PerformanceProvider({children}:{children:ReactNode}){
 const [quality,setQuality]=useState<Quality>('balanced'),[ready,setReady]=useState(false),[mediaReady,setMediaReady]=useState(false),[light,setLightState]=useState(false),[resumeSection,setResumeSection]=useState('');
 const tier=useRef(quality);tier.current=quality;const tally=useRef({count:0,slow:0,last:0});
 const setLight=useCallback((value:boolean)=>{setLightState(value);setQuality(value?'simple':detect());try{localStorage.setItem('portfolio-light',value?'1':'0')}catch{}},[]);
 const reportFrame=useCallback((ms:number)=>{
  if(document.hidden||ms<4)return;const b=tally.current,now=performance.now();if(now-b.last>700)b.count=b.slow=0;b.last=now;b.count++;if(ms>34)b.slow++;
  if(b.count>=45){if(b.slow/b.count>.28){const next=tier.current==='full'?'balanced':'simple';if(next==='simple')setResumeSection(document.querySelector('.zoom-world:not([inert])')?.getAttribute('data-section')||'');setQuality(next)}b.count=b.slow=0}
 },[]);
 useEffect(()=>{
  let disposed=false,frame=0,timer:ReturnType<typeof setTimeout>,idle:number|undefined;
  const n=navigator as Device;let manual=false;try{manual=localStorage.getItem('portfolio-light')==='1'}catch{}
  const sync=()=>{try{manual=localStorage.getItem('portfolio-light')==='1'}catch{}setLightState(manual);setQuality(manual?'simple':detect())};sync();const stopMotion=listenMedia(matchMedia('(prefers-reduced-motion: reduce)'),sync);n.connection?.addEventListener?.('change',sync);
  // The prerendered interface paints before optional media and WebGL are admitted.
  frame=requestAnimationFrame(()=>{frame=requestAnimationFrame(()=>{if(disposed)return;setReady(true);document.documentElement.classList.add('ui-ready')})});
  const idleStart=()=>{const nav=window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming|undefined;if(!n.connection&&nav&&nav.responseEnd-nav.requestStart>2500)setQuality('simple');timer=setTimeout(()=>{if(disposed)return;if('requestIdleCallback' in window)idle=window.requestIdleCallback(()=>{if(!disposed)setMediaReady(true)},{timeout:2500});else setMediaReady(true)},1200)};
  if(document.readyState==='complete')idleStart();else window.addEventListener('load',idleStart,{once:true});
  return()=>{disposed=true;stopMotion();cancelAnimationFrame(frame);clearTimeout(timer);if(idle!==undefined)window.cancelIdleCallback?.(idle);window.removeEventListener('load',idleStart);n.connection?.removeEventListener?.('change',sync)};
 },[]);
 const maxPlayers=!mediaReady||quality==='simple'?0:quality==='full'?3:1;
 useEffect(()=>{
  const html=document.documentElement;html.dataset.quality=quality;let timer:ReturnType<typeof setTimeout>;
  const sync=()=>{html.classList.toggle('page-hidden',document.hidden);mediaQueue.configure(maxPlayers,document.hidden||html.classList.contains('is-scrolling'))};
  const scroll=()=>{if(!html.classList.contains('is-scrolling')){html.classList.add('is-scrolling');sync()}clearTimeout(timer);timer=setTimeout(()=>{html.classList.remove('is-scrolling');sync()},400)};
  sync();document.addEventListener('visibilitychange',sync);window.addEventListener('scroll',scroll,{capture:true,passive:true});
  return()=>{clearTimeout(timer);document.removeEventListener('visibilitychange',sync);window.removeEventListener('scroll',scroll,true);mediaQueue.configure(0,true);html.classList.remove('is-scrolling')};
 },[quality,maxPlayers]);
 const value=useMemo(()=>({quality,ready,mediaReady,maxPlayers,light,setLight,reportFrame,resumeSection}),[quality,ready,mediaReady,maxPlayers,light,setLight,reportFrame,resumeSection]);
 return <Context.Provider value={value}>{children}</Context.Provider>;
}
