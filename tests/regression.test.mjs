import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const js=fs.readFileSync(new URL('../core/app.js',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../styles/app.css',import.meta.url),'utf8');
const manifest=JSON.parse(fs.readFileSync(new URL('../version.json',import.meta.url),'utf8'));
test('script parses and build versions match',()=>{new vm.Script(js);assert.equal(Number(js.match(/const BUILD=(\d+)/)[1]),manifest.build);assert.ok(html.includes('const BUILD='+manifest.build));assert.ok(html.includes('app.js?v='+manifest.build));assert.ok(html.includes('app.css?v='+manifest.build))});
const storageCode=js.slice(js.indexOf("const WORKOUT_STORAGE="),js.indexOf("const setCount="));
const key='form.lab.workouts.v1';
const routine={id:'r1',name:'Test',exercises:[{name:'Squat',sets:[{weight:20,reps:10,rest:90}]}]};
const legacy={routines:[routine],history:[],session:null};
function storage(initial={}){const map=new Map(Object.entries(initial));const ctx=vm.createContext({localStorage:{getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)}});vm.runInContext(storageCode,ctx);return {map,run:code=>vm.runInContext(code,ctx)}}
test('legacy data migrates without losing routines',()=>{const x=storage({[key]:JSON.stringify(legacy)});assert.equal(x.run('workoutData.routines[0].name'),'Test');assert.equal(x.run('saveWorkouts()'),true);assert.equal(JSON.parse(x.map.get(key)).schemaVersion,1);assert.deepEqual(JSON.parse(x.map.get(key+'.backup')),legacy)});
test('invalid primary is never overwritten',()=>{const x=storage({[key]:'broken',[key+'.backup']:JSON.stringify(legacy)});assert.equal(x.run('workoutData.routines.length'),1);assert.equal(x.run('saveWorkouts()'),false);assert.equal(x.map.get(key),'broken')});
test('invalid types rejected',()=>{const x=storage();assert.equal(Boolean(x.run('validWorkoutData(42)')),false);assert.equal(Boolean(x.run('validWorkoutData([])')),false)});
test('calibrated geometry remains present',()=>{assert.ok(css.includes('--folded-landscape-90-x:1px;--folded-landscape-90-y:24px;--folded-landscape-90-nav-right:24px'))});
test('update guard protects session and draft',()=>{const line=js.split('\n').find(x=>x.startsWith('function reloadLatest()'));for(const state of ['workoutData.session','workoutDraft','storageDirty','storageReadBlocked'])assert.ok(line.includes(state))});
