import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {WheelGestures} from 'wheel-gestures';
import ts from 'typescript';
const code=ts.transpileModule(readFileSync(new URL('../src/scenePaging.ts',import.meta.url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.ES2022}}).outputText;
const {SceneGesture,ScenePager,swipePages}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
function replay(events){
 const gestures=WheelGestures({reverseSign:false,preventWheelAction:false}),pages=new SceneGesture(),moves=[];
 const stop=gestures.on('wheel',state=>{const step=pages.update(state);if(step)moves.push(step)});
 gestures.feedWheel(events);stop();gestures.disconnect();return moves;
}
const wheel=(deltaY,timeStamp)=>({deltaX:0,deltaY,deltaMode:0,timeStamp});
function fixture(name,horizontal=false){
 const data=JSON.parse(readFileSync('node_modules/wheel-gestures/src/test/fixtures/'+name+'.json','utf8'));
 return data.wheelEvents.map(e=>horizontal?{...e,deltaY:e.deltaX,deltaX:0}:e);
}
test('recorded normal trackpad gestures advance exactly one page including the full inertia tail',()=>{
 for(const name of ['swipe-down-trackpad','swipe-up-trackpad'])assert.equal(Math.abs(replay(fixture(name)).reduce((a,b)=>a+b,0)),1,name);
});
test('recorded fast trackpad gestures advance multiple complete pages',()=>{
 for(const name of ['swipe-down-fast-trackpad','swipe-up-fast-trackpad']){const moves=replay(fixture(name));assert.ok(Math.abs(moves.reduce((a,b)=>a+b,0))>=2,name);assert.ok(Math.abs(moves.reduce((a,b)=>a+b,0))<=3,name)}
});
test('a recorded second push is accepted during the preceding momentum tail',()=>{
 assert.equal(replay(fixture('double-swipe-right',true)).length,2);
});
test('one large wheel event never skips pages, while fast repeated wheel ticks do',()=>{
 for(const size of [8,100,800,1800])assert.deepEqual(replay([wheel(size,0)]),[1]);
 assert.equal(replay(Array.from({length:8},(_,i)=>wheel(120,i*25))).reduce((a,b)=>a+b,0),3);
 assert.deepEqual(replay([wheel(120,0),wheel(120,180),wheel(120,360)]),[1,1,1]);
});
test('the deadline ends exactly on a page at both high and low frame rates',()=>{
 for(const frames of [[0,16,50,100,200,379,380],[0,300,900]]){
  const pager=new ScenePager();pager.advance(1,0);for(const t of frames)pager.sample(t);
  assert.equal(pager.position,1);assert.equal(pager.moving,false);
 }
});
test('new input queues another page without restarting the current transition',()=>{
 const pager=new ScenePager();pager.advance(1,0);pager.sample(200);pager.advance(1,200);
 assert.equal(pager.sample(380),1);assert.equal(pager.target,2);
 assert.equal(pager.sample(760),2);assert.equal(pager.moving,false);
 pager.advance(3,800);assert.equal(pager.sample(2000),5);assert.equal(pager.moving,false);
});
test('reversal, category jumps and interruption always finish on whole pages',()=>{
 const pager=new ScenePager();pager.advance(1,0);pager.sample(180);pager.advance(-1,180);
 assert.equal(pager.sample(560),0);assert.equal(pager.moving,false);
 pager.navigate(12,600);assert.equal(pager.sample(980),12);
 pager.advance(1,1000);pager.sample(1100);assert.equal(pager.settle(),13);
 assert.equal(pager.target,13);assert.equal(pager.moving,false);
});
test('mobile swipe thresholds are unchanged',()=>{
 assert.equal(swipePages(20,100,800),0);assert.equal(swipePages(300,300,800),1);
 assert.equal(swipePages(-600,250,800),-2);assert.equal(swipePages(600,800,800),1);
});
