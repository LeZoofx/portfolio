import {nativeSnapPage,recenterPage} from './scenePaging';

type Options={scroller:HTMLElement;root:HTMLElement;total:number;reduced:()=>boolean;paused:()=>boolean;moving:(value:boolean)=>void;invalidate:()=>void};

// One owner for input and settling. Native wheel deltas are never cancelled,
// classified or queued. CSS snapping is suspended until the gesture is over.
export class NativeSceneScroll {
 private height=1;private initialized=false;private wheeling=false;
 private origin:number|null=null;private intent=0;private destination:number|null=null;
 private releaseTimer:ReturnType<typeof setTimeout>|undefined;
 private fallbackTimer:ReturnType<typeof setTimeout>|undefined;
 private readonly scrollEnd:boolean;
 constructor(private o:Options){
  this.scrollEnd='onscrollend' in o.scroller;
  o.scroller.addEventListener('wheel',this.wheel,{passive:true});
  o.scroller.addEventListener('scroll',this.scroll,{passive:true});
  o.scroller.addEventListener('scrollend',this.end);
  document.addEventListener('visibilitychange',this.visibility);
 }
 get position(){return this.page-this.o.total}
 private get page(){return this.o.scroller.scrollTop/this.height}
 private input(value:boolean){this.o.root.dataset.nativeInput=String(value)}
 private clear(){clearTimeout(this.releaseTimer);clearTimeout(this.fallbackTimer)}
 private wheel=(event:WheelEvent)=>{
  if(!event.deltaY||event.ctrlKey||event.metaKey||this.o.paused())return;
  if((event.target as Element)?.closest('select,input,textarea,dialog'))return;
  this.clear();this.input(true);
  if(!this.wheeling){
   const top=this.o.scroller.scrollTop;
   if(this.destination!==null)this.o.scroller.scrollTo({top,behavior:'instant'});
   this.destination=null;this.origin=this.page;this.intent=0;
  }
  this.wheeling=true;this.intent+=event.deltaY;
  this.o.moving(true);this.o.invalidate();
  this.releaseTimer=setTimeout(()=>{this.wheeling=false;this.settle()},160);
 };
 private scroll=()=>{
  if(this.o.paused()||document.hidden)return;
  this.o.moving(true);this.o.invalidate();
  if(!this.scrollEnd&&!this.wheeling){clearTimeout(this.fallbackTimer);this.fallbackTimer=setTimeout(()=>this.settle(),160)}
 };
 private end=()=>{if(!this.wheeling)this.settle()};
 private settle(){
  if(this.wheeling||document.hidden||this.o.paused())return;
  clearTimeout(this.fallbackTimer);
  const page=this.destination??nativeSnapPage(this.page,this.o.total*3,this.origin,this.intent);
  if(Math.abs(this.o.scroller.scrollTop-page*this.height)>.75){
   // A new wheel event cancels this native animation at its current position.
   // Never restart an already-running correction from another scrollend event.
   if(this.destination!==page){this.destination=page;this.input(true);this.o.scroller.scrollTo({top:page*this.height,behavior:this.o.reduced()?'instant':'smooth'})}
   if(!this.scrollEnd)this.fallbackTimer=setTimeout(()=>this.settle(),180);
   return;
  }
  this.destination=null;this.origin=null;this.intent=0;
  const centered=recenterPage(page,this.o.total);
  if(centered!==page)this.o.scroller.scrollTo({top:centered*this.height,behavior:'instant'});
  this.input(false);this.o.moving(false);this.o.invalidate();
 }
 resize(){
  const height=Math.max(1,this.o.scroller.clientHeight);
  if(this.initialized&&height===this.height)return;
  const page=this.initialized?Math.round(this.page):this.o.total;
  this.clear();this.wheeling=false;this.destination=null;this.origin=null;this.intent=0;
  this.height=height;this.initialized=true;
  this.o.root.style.setProperty('--page-height',height+'px');
  this.o.scroller.scrollTo({top:page*height,behavior:'instant'});
  this.o.invalidate();
 }
 navigate(position:number){
  this.clear();this.wheeling=false;this.origin=null;this.intent=0;
  this.destination=null;this.input(true);this.o.moving(true);
  const page=Math.max(0,Math.min(this.o.total*3-1,this.o.total+position));
  this.destination=page;
  this.o.scroller.scrollTo({top:page*this.height,behavior:this.o.reduced()?'instant':'smooth'});
  this.o.invalidate();
  if(Math.abs(this.page-page)<.001)this.settle();
  else if(!this.scrollEnd)this.fallbackTimer=setTimeout(()=>this.settle(),180);
 }
 freeze(){
  this.clear();this.wheeling=false;this.destination=null;this.origin=null;this.intent=0;
  const page=recenterPage(Math.round(this.page),this.o.total);
  this.o.scroller.scrollTo({top:page*this.height,behavior:'instant'});
  this.input(false);this.o.moving(false);
 }
 private visibility=()=>{if(document.hidden)this.freeze();else this.o.invalidate()};
 destroy(){this.clear();this.o.scroller.removeEventListener('wheel',this.wheel);this.o.scroller.removeEventListener('scroll',this.scroll);this.o.scroller.removeEventListener('scrollend',this.end);document.removeEventListener('visibilitychange',this.visibility)}
}
