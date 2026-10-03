// Gesture transactions, not raw scroll distance. Momentum belongs to its originating gesture.
export function wheelPixels(delta:number,mode:number,height:number){return delta*(mode===1?16:mode===2?height:1)}
export class SceneGesture {
 private last=-Infinity;private start=0;private direction=0;private distance=0;private peak=0;private events=0;private pages=0;
 private previous=0;private trough=Infinity;private falling=0;
 wheel(delta:number,time:number,height=800,mode=0){
  const size=Math.abs(delta);if(size<.5)return 0;
  const direction=Math.sign(delta),gap=time-this.last,age=time-this.start;
  // A renewed push interrupts the inertia tail immediately, even while the zoom is moving.
  const renewed=this.pages>0&&age>80&&size>=10&&(
   (this.falling>=2&&size>=this.trough*1.45&&size-this.trough>=5)||
   (gap>55&&size>=this.previous*.8)
  );
  const fresh=gap>110||(direction!==this.direction&&size>=4)||renewed;
  if(fresh){this.start=time;this.direction=direction;this.distance=0;this.peak=0;this.events=0;this.pages=0;this.previous=0;this.trough=Infinity;this.falling=0}
  this.last=time;if(direction!==this.direction)return 0;
  if(size<this.previous*.92){this.falling++;this.trough=Math.min(this.trough,size)}
  this.previous=size;
  // Normal input selects one scene; energy in a fast burst can select more. No per-event peak gate.
  const attack=time-this.start<=260;
  if(!this.pages||attack){this.distance+=size;this.peak=Math.max(this.peak,size);this.events++}
  let next=this.pages||Number(this.distance>=14);
  const threshold=Math.max(360,Math.min(520,height*.55));
  const fast=attack&&this.events>=2&&this.peak>=28&&this.distance/Math.max(48,time-this.start)>=1.2;
  if(next&&fast)next=Math.max(next,Math.min(3,1+Math.floor(this.distance/threshold)));
  // Browsers may coalesce a forceful trackpad/wheel movement into just one event.
  if(next&&attack&&mode===0&&size>=600)next=Math.max(next,Math.min(3,1+Math.floor(size/600)));
  const change=Math.max(0,next-this.pages);this.pages=Math.max(this.pages,next);return change?direction*change:0;
 }
 reset(){this.last=-Infinity;this.direction=0;this.pages=0;this.previous=0;this.trough=Infinity;this.falling=0}
}
export function swipePages(distance:number,duration:number,height:number){
 if(Math.abs(distance)<28)return 0;
 const strong=Math.abs(distance)>height*.62&&Math.abs(distance)/Math.max(80,duration)>1.35;
 return Math.sign(distance)*(strong?Math.min(3,1+Math.floor(Math.abs(distance)/(height*.62))):1);
}
export function advanceTarget(position:number,target:number,step:number){
 // Reverse immediately, and bound the queue so a burst never leaves the interface catching up.
 const direction=Math.sign(target-position),reverse=direction!==0&&Math.sign(step)!==direction;
 const origin=reverse?Math.round(position):target;
 return Math.max(Math.floor(position)-3,Math.min(Math.ceil(position)+3,origin+step));
}
