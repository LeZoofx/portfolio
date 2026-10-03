// Gesture transactions, not raw scroll distance. Momentum belongs to its originating gesture.
export function wheelPixels(delta:number,mode:number,height:number){return delta*(mode===1?16:mode===2?height:1)}
export class SceneGesture {
 private last=-Infinity;private start=0;private direction=0;private distance=0;private peak=0;private events=0;private pages=0;
 wheel(delta:number,time:number,height=800){
  const size=Math.abs(delta);if(size<.5)return 0;
  const direction=Math.sign(delta),fresh=time-this.last>240||(direction!==this.direction&&size>=18);
  if(fresh){this.start=time;this.direction=direction;this.distance=0;this.peak=0;this.events=0;this.pages=0}
  this.last=time;if(direction!==this.direction)return 0;
  // Only the attack can earn extra pages; a long decaying inertia tail cannot.
  if(!this.pages||time-this.start<=170){this.distance+=size;this.peak=Math.max(this.peak,size);this.events++}
  if(!this.pages&&this.distance>=14){this.pages=1;return direction}
  const threshold=Math.max(900,height*1.1);
  const strong=this.events>=3&&this.peak>=150&&time-this.start<=170;
  const next=strong?Math.min(3,1+Math.floor(this.distance/threshold)):this.pages;
  const change=Math.max(0,next-this.pages);this.pages=Math.max(this.pages,next);return change?direction*change:0;
 }
 reset(){this.last=-Infinity;this.direction=0;this.pages=0}
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
