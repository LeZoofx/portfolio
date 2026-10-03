import type {WheelEventState} from 'wheel-gestures';

// WheelGestures owns device normalization and momentum recognition. This only selects pages.
export class SceneGesture {
 private pages=0;private direction=0;private distance=0;private started=0;private last=-Infinity;
 private fastSamples=0;private veryFastSamples=0;private repeated=0;private previousDelta=0;private samples=0;
 update(state:WheelEventState,height=800){
  if(state.isEnding){this.reset();return 0}
  const delta=state.axisDelta[1],size=Math.abs(delta),time=state.event.timeStamp,direction=Math.sign(delta);
  if(!size||state.isMomentum)return 0;
  const gap=time-this.last;
  if(state.isStart||gap>120||(direction!==this.direction&&size>=4)){
   this.reset();this.direction=direction;this.started=time;
  }
  this.last=time;if(direction!==this.direction)return 0;
  this.distance+=size;this.samples++;
  let next=this.pages||Number(this.distance>=8);
  // A single large delta is still one gesture. Multiple pages require measured speed over time.
  const discrete=state.event.deltaMode!==0||(Number.isInteger(delta)&&size>=40);
  this.repeated=discrete&&delta===this.previousDelta&&gap<=40?this.repeated+1:1;
  if(this.samples>=4&&time-this.started<=280){
   const velocity=Math.abs(state.axisVelocity[1]),fast=Math.max(12,Math.min(16,height*.0175));
   this.fastSamples=velocity>fast?this.fastSamples+1:0;
   this.veryFastSamples=velocity>fast*1.55?this.veryFastSamples+1:0;
   if(next&&(this.fastSamples>=2||this.repeated>=4))next=Math.max(next,2);
   if(next&&(this.veryFastSamples>=2||this.repeated>=8))next=3;
  }
  this.previousDelta=delta;
  const change=next-this.pages;this.pages=next;return change?direction*change:0;
 }
 reset(){this.pages=0;this.direction=0;this.distance=0;this.last=-Infinity;this.fastSamples=0;this.veryFastSamples=0;this.repeated=0;this.previousDelta=0;this.samples=0}
}

// Page transactions never depend on the duration of a wheel stream or on an easing epsilon.
export class ScenePager {
 position=0;target=0;
 private from=0;private to=0;private started=0;private duration=380;private active=false;
 get moving(){return this.active}
 private begin(time:number){
  if(this.position===this.target){this.active=false;return}
  this.from=this.position;this.to=this.position+Math.sign(this.target-this.position);
  this.started=time;this.active=true;
 }
 advance(step:number,time:number){
  if(!step)return;
  this.sample(time);
  const direction=Math.sign(step);
  if(this.active&&direction!==Math.sign(this.to-this.from)){
   // Reversal also ends on a whole page, never at the current fractional position.
   this.from=this.position;this.to=direction>0?Math.ceil(this.position):Math.floor(this.position);
   this.target=this.to+direction*(Math.abs(step)-1);this.started=time;
  }else{this.target+=Math.trunc(step);if(!this.active)this.begin(time)}
 }
 navigate(target:number,time:number){
  this.sample(time);this.target=Math.round(target);this.from=this.position;this.to=this.target;
  if(Math.abs(this.to-this.from)>3)this.from=this.position=this.to-Math.sign(this.to-this.from)*.85;
  this.started=time;this.active=this.position!==this.target;
 }
 sample(time:number,reduced=false){
  if(reduced){this.position=this.target;this.active=false;return this.position}
  while(this.active&&time>=this.started+this.duration){
   const nextTime=this.started+this.duration;this.position=this.to;this.begin(nextTime);
  }
  if(this.active){const u=Math.max(0,Math.min(1,(time-this.started)/this.duration));this.position=this.from+(this.to-this.from)*(u*u*(3-2*u))}
  return this.position;
 }
 settle(){this.position=this.active?this.to:Math.round(this.position);this.target=this.position;this.active=false;return this.position}
}

export function swipePages(distance:number,duration:number,height:number){
 if(Math.abs(distance)<28)return 0;
 const strong=Math.abs(distance)>height*.62&&Math.abs(distance)/Math.max(80,duration)>1.35;
 return Math.sign(distance)*(strong?Math.min(3,1+Math.floor(Math.abs(distance)/(height*.62))):1);
}
