import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const script=path.resolve('scripts/update-project.mjs');
function run(fields,initial=[]){
 const dir=mkdtempSync(path.join(tmpdir(),'portfolio-content-'));mkdirSync(path.join(dir,'content'));writeFileSync(path.join(dir,'content/projects.json'),JSON.stringify(initial));
 const env={...process.env};for(const [k,v] of Object.entries(fields))env['INPUT_'+k]=v;
 const result=spawnSync(process.execPath,[script],{cwd:dir,env,encoding:'utf8'});const items=JSON.parse(readFileSync(path.join(dir,'content/projects.json'),'utf8'));rmSync(dir,{recursive:true});return {result,items};
}
test('new featured work actually appears first and keeps four featured projects',()=>{const initial=Array.from({length:4},(_,i)=>({id:'old-'+i,title:'Existing '+i,featured:true}));const {result,items}=run({TITLE:'New campaign',URL:'https://example.com/work',CATEGORY:'brands',FEATURED:'true'},initial);assert.equal(result.status,0);assert.equal(items[0].title,'New campaign');assert.equal(items.filter(x=>x.featured).length,4);assert.equal(items.length,5)});
test('Instagram link becomes a bounded embed and preserves the AI disclosure',()=>{const {result,items}=run({TITLE:'AI film',URL:'https://www.instagram.com/reel/ABC_123/',CATEGORY:'short-form',DISCLOSURE:'AI-generated shots.'});assert.equal(result.status,0);assert.equal(items[0].embedUrl,'https://www.instagram.com/p/ABC_123/embed/');assert.equal(items[0].disclosure,'AI-generated shots.');assert.equal(items[0].aspect,9/16)});
test('unsafe links and unknown edit IDs cannot overwrite content',()=>{const old=[{id:'safe',title:'Keep me'}];for(const fields of [{URL:'javascript:alert(1)'},{URL:'https://example.com',PROJECT_ID:'missing'}]){const {result,items}=run({TITLE:'Edit',CATEGORY:'brands',...fields},old);assert.notEqual(result.status,0);assert.deepEqual(items,old)}});
test('editing a source removes a stale thumbnail and keeps the same project ID',()=>{const {result,items}=run({TITLE:'Updated',URL:'https://example.com/new',CATEGORY:'brands',PROJECT_ID:'existing'},[{id:'existing',title:'Old',sourceUrl:'https://example.com/old',poster:'media/old.jpg',embedUrl:'https://www.youtube.com/embed/abcdefghijk'}]);assert.equal(result.status,0);assert.equal(items.length,1);assert.equal(items[0].id,'existing');assert.equal(items[0].poster,undefined);assert.equal(items[0].embedUrl,undefined)});
