import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const code=ts.transpileModule(readFileSync(new URL('../src/scenePaging.ts',import.meta.url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.ES2022}}).outputText;
const {SceneGesture,wheelPixels,swipePages,advanceTarget}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const run=events=>{const gesture=new SceneGesture();return events.reduce((pages,[delta,time])=>pages+gesture.wheel(delta,time,800),0)};

test('normal wheel and trackpad gestures advance once',()=>{
 for(const delta of [16,60,120,240])assert.equal(run([[delta,0]]),1);
 assert.equal(run([40,90,80,60,45,30,20,15,8,4,2,1].map((delta,i)=>[delta,i*40])),1);
});
test('slow intentional input still works, and an inertia tail never becomes another scene',()=>{
 assert.equal(run(Array.from({length:40},(_,i)=>[1,i*25])),1);
 assert.equal(run(Array.from({length:50},(_,i)=>[i<3?70:10,i*35])),1);
});
test('fast trackpad, mouse-wheel and coalesced gestures advance multiple scenes',()=>{
 assert.equal(run([25,45,60,82,78,68,57,40].map((delta,i)=>[delta,i*16])),2);
 assert.equal(run(Array.from({length:8},(_,i)=>[120,i*25])),3);
 assert.equal(run([[800,0]]),2);assert.equal(run([[1600,0]]),3);
 assert.equal(run(Array.from({length:10},(_,i)=>[350,i*15])),3);
 const pageWheel=new SceneGesture();assert.equal(pageWheel.wheel(800,0,800,2),1);
});
test('a second gesture interrupts residual momentum without a release lockout',()=>{
 const gesture=new SceneGesture();
 for(const [delta,time] of [[70,0],[60,16],[40,32],[20,48],[8,64]])gesture.wheel(delta,time);
 assert.equal(gesture.wheel(30,100),1);
 assert.equal(gesture.wheel(45,116),0);
 assert.equal(gesture.wheel(60,200),1);
});
test('a brief gap and a gentle new push both rearm quickly',()=>{
 const gesture=new SceneGesture();
 assert.equal(gesture.wheel(80,0),1);assert.equal(gesture.wheel(80,120),1);
 const tail=new SceneGesture();
 for(const [delta,time] of [[60,0],[40,16],[20,32],[4,48],[2,64],[4,90],[8,106]])tail.wheel(delta,time);
 assert.equal(tail.wheel(16,122),1);
});
test('separate gestures work immediately after release and direction reversal responds',()=>{
 const gesture=new SceneGesture();
 assert.equal(gesture.wheel(80,0),1);
 assert.equal(gesture.wheel(60,50),0);
 assert.equal(gesture.wheel(80,350),1);
 assert.equal(gesture.wheel(-80,390),-1);
 assert.equal(gesture.wheel(-40,440),0);
});
test('mouse delta modes normalize, swipes require intent, and pending motion stays bounded',()=>{
 assert.equal(wheelPixels(3,1,800),48);assert.equal(wheelPixels(1,2,800),800);
 assert.equal(swipePages(20,100,800),0);assert.equal(swipePages(300,300,800),1);
 assert.equal(swipePages(-600,250,800),-2);assert.equal(swipePages(600,800,800),1);
 assert.equal(swipePages(1800,100,800),3);
 assert.equal(advanceTarget(.2,3,3),4);assert.equal(advanceTarget(.8,3,-1),0);
});
