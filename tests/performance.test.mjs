import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const code=ts.transpileModule(readFileSync(new URL('../src/capabilities.ts',import.meta.url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.ES2022}}).outputText;
const {chooseQuality,MediaQueue,initialExperience}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
test('connection, accessibility and missing browser features override powerful hardware',()=>{
 const strong={supported:true,memory:16,cores:12,downlink:20};
 assert.equal(chooseQuality(strong),'full');
 for(const constraint of [{saveData:true},{effectiveType:'3g'},{downlink:.8},{rtt:900},{supported:false},{reduced:true},{memory:2},{cores:2}])assert.equal(chooseQuality({...strong,...constraint}),'simple');
 assert.equal(chooseQuality({supported:true}),'balanced');
 assert.equal(chooseQuality({...strong,memory:4}),'balanced');
});
test('players wait for the interface, stagger starts, respect one shared cap and cancel stale requests',()=>{
 let now=0,id=0;const timers=new Map(),grants=[];
 const queue=new MediaQueue(850,()=>now,(fn,ms)=>{timers.set(++id,{fn,at:now+ms});return id},key=>timers.delete(key));
 const tick=ms=>{now+=ms;for(const [key,timer] of [...timers])if(timer.at<=now){timers.delete(key);timer.fn()}};
 const first=queue.request(value=>grants.push(['first',value]));
 queue.request(value=>grants.push(['second',value]));
 const stale=queue.request(value=>grants.push(['stale',value]));
 assert.deepEqual(grants,[]);
 queue.configure(2);assert.deepEqual(grants,[['first',true]]);
 tick(849);assert.equal(grants.length,1);tick(1);assert.deepEqual(grants.at(-1),['second',true]);
 tick(2000);assert.equal(grants.length,2);
 stale();first();tick(1000);assert.equal(grants.length,2);
 queue.request(value=>grants.push(['next',value]));assert.deepEqual(grants.at(-1),['next',true]);
 queue.configure(1);assert.deepEqual(grants.at(-1),['next',false]);
 queue.configure(0);assert.deepEqual(grants.at(-1),['second',false]);
});
test('scrolling delays queued players without destroying already playing video',()=>{
 let now=0,callback;const grants=[];
 const queue=new MediaQueue(850,()=>now,fn=>{callback=fn;return 1},()=>{callback=undefined});
 queue.configure(2);queue.request(value=>grants.push(['one',value]));queue.request(value=>grants.push(['two',value]));
 queue.configure(2,true);now=2000;callback?.();assert.deepEqual(grants,[['one',true]]);
 queue.configure(2,false);assert.deepEqual(grants,[['one',true],['two',true]]);
});

test('the root opens Explore and only an explicit Overview request changes the experience',()=>{
 assert.equal(initialExperience('/'),'fun');
 assert.equal(initialExperience('/','overview'),'normal');
 assert.equal(initialExperience('/','normal'),'normal');
 assert.equal(initialExperience('/work/'),'normal');
 assert.equal(initialExperience('/work/','fun'),'fun');
 assert.equal(chooseQuality({supported:true,memory:8,cores:8,coarse:true}),'balanced');
});
