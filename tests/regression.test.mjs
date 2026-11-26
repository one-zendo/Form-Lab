import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const js=fs.readFileSync(new URL('../core/app.js',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../styles/app.css',import.meta.url),'utf8');
const manifest=JSON.parse(fs.readFileSync(new URL('../version.json',import.meta.url),'utf8'));
test('script parses and build versions match',()=>{new vm.Script(js);assert.equal(Number(js.match(/const BUILD=(\d+)/)[1]),manifest.build);assert.ok(html.includes('id="build-number"'));assert.ok(html.includes('app.js?v='+manifest.build));assert.ok(html.includes('app.css?v='+manifest.build))});
const storageCode=fs.readFileSync(new URL('../core/storage.js',import.meta.url),'utf8')+'\n'+js.slice(js.indexOf("const WORKOUT_STORAGE="),js.indexOf("const setCount="));
const key='form.lab.workouts.v1';
const routine={id:'r1',name:'Test',exercises:[{name:'Squat',sets:[{weight:20,reps:10,rest:90}]}]};
const legacy={routines:[routine],history:[],session:null};
function storage(initial={}){const map=new Map(Object.entries(initial));const ctx=vm.createContext({localStorage:{getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)}});vm.runInContext(storageCode,ctx);return {map,run:code=>vm.runInContext(code,ctx)}}
test('legacy data migrates without losing routines',()=>{const x=storage({[key]:JSON.stringify(legacy)});assert.equal(x.run('workoutData.routines[0].name'),'Test');assert.equal(x.run('saveWorkouts()'),true);assert.equal(JSON.parse(x.map.get(key)).schemaVersion,1);assert.deepEqual(JSON.parse(x.map.get(key+'.backup')),legacy)});
test('invalid primary is never overwritten',()=>{const x=storage({[key]:'broken',[key+'.backup']:JSON.stringify(legacy)});assert.equal(x.run('workoutData.routines.length'),1);assert.equal(x.run('saveWorkouts()'),false);assert.equal(x.map.get(key),'broken')});
test('invalid types rejected',()=>{const x=storage();assert.equal(Boolean(x.run('validWorkoutData(42)')),false);assert.equal(Boolean(x.run('validWorkoutData([])')),false)});
test('calibrated geometry remains present',()=>{assert.ok(css.includes('--folded-landscape-90-x:1px;--folded-landscape-90-y:24px;--folded-landscape-90-nav-right:24px'))});
test('update guard protects session and draft',()=>{const line=js.split('\n').find(x=>x.startsWith('function reloadLatest()'));for(const state of ['workoutData.session','workoutDraft','storageDirty','storageReadBlocked'])assert.ok(line.includes(state))});

test('invalid numeric set data rejected',()=>{const x=storage();assert.equal(x.run("validRecord({id:'x',name:'x',exercises:[{name:'x',sets:[{weight:-1}]}]})"),false)});
test('demo storage does not overwrite real storage',()=>{const x=storage({[key]:JSON.stringify(legacy)});x.run("demoMode=true;workoutData={routines:[],history:[],session:null};saveWorkouts()");assert.deepEqual(JSON.parse(x.map.get(key)),legacy);assert.ok(x.map.has('form.lab.demo-workouts.v1'))});
test('all local scripts parse',()=>{for(const m of html.matchAll(/<script src="(core\/[^"?]+)\?v=\d+"/g))new vm.Script(fs.readFileSync(new URL('../'+m[1],import.meta.url),'utf8'))});

const home=vm.runInNewContext(fs.readFileSync(new URL('../core/home.js',import.meta.url),'utf8')+';FormHome');
test('weekly streak counts distinct days and consecutive weeks',()=>{const history=[16,17,18,23,23,24,25].map(d=>({finished:new Date(2026,10,d,8)}));const s=home.stats(history,new Date(2026,10,26,12),3);assert.equal(s.current,2);assert.equal(s.best,2);assert.equal(s.count,3);assert.equal(s.days[3].today,true)});
test('empty, invalid and future history are ignored',()=>{const now=new Date(2026,10,26,12);assert.equal(home.stats([null,{finished:'invalid'},{finished:new Date(2026,10,26,20)}],now,0).count,0)});
test('incomplete current week preserves prior streak',()=>{assert.equal(home.stats([16,17,18].map(d=>({finished:new Date(2026,10,d,8)})),new Date(2026,10,26),3).current,1)});
test('greeting boundaries',()=>{for(const [h,g] of [[0,'Good morning'],[11,'Good morning'],[12,'Good afternoon'],[18,'Good evening']])assert.equal(home.greeting(new Date(2026,10,26,h)),g)});
test('shared day indicator preserves state classes',()=>{const ui=vm.runInNewContext(fs.readFileSync(new URL('../core/components.js',import.meta.url),'utf8')+';FormUI');assert.ok(ui.dayIndicator({done:true,today:true}).includes('done today'));assert.ok(ui.dayIndicator({done:false,today:false}).includes('Scheduled training'))});
test('Home modules load before app',()=>{for(const name of ['home','components'])assert.ok(html.indexOf('core/'+name+'.js?v=')>=0&&html.indexOf('core/'+name+'.js?v=')<html.indexOf('core/app.js?v='))});

test('recovery schedule preserves earlier weeks',()=>{const now=new Date(2026,10,26,12),from=home.weekStart(now),history=[16,17,18,23,24,25].map(d=>({finished:new Date(2026,10,d,8)}));const s=home.stats(history,now,3,[{from,rest:[0]}]);assert.equal(s.best,1);assert.equal(s.goal,6);assert.equal(s.days[0].rest,true)});

test('recovery credit starts after the day ends',()=>{const now=new Date(2026,10,26,12),from=home.weekStart(now),s=home.stats([],now,3,[{from,rest:[0,3,5]}]);assert.equal(s.onTrack,1);assert.equal(s.days[0].recovered,true);assert.equal(s.days[3].recovered,false)});
test('current day breathing is limited to unfinished days',()=>{const ui=vm.runInNewContext(fs.readFileSync(new URL('../core/components.js',import.meta.url),'utf8')+';FormUI');assert.ok(ui.dayIndicator({today:true}).includes('breathing'));assert.ok(!ui.dayIndicator({today:true,done:true}).includes('breathing'));assert.ok(!ui.dayIndicator({today:false}).includes('<svg'))});

test('physical posture classification requires folded signal and segment direction',()=>{const p=vm.runInNewContext(fs.readFileSync(new URL('../core/posture.js',import.meta.url),'utf8')+';FormPosture');assert.equal(p.classify('folded',2,1),'book');assert.equal(p.classify('folded',1,2),'laptop');assert.equal(p.classify('folded',1,1),'folded-unknown');assert.equal(p.classify('continuous',2,1),'flat')});

test('consolidated dock and hinge tokens retain approved values',()=>{for(const token of ['--bottom-bar-height:56px','--bottom-bar-icon:22px','--bottom-bar-capsule-width:54px','--bottom-bar-capsule-height:40px','--hinge-motion-ms:320','--unfold-motion-ms:460'])assert.ok(css.includes(token));assert.equal((css.match(/--bottom-bar-height:/g)||[]).length,1)});
test('recovery indicator retains distinct class and accessible label',()=>{const ui=vm.runInNewContext(fs.readFileSync(new URL('../core/components.js',import.meta.url),'utf8')+';FormUI');const markup=ui.dayIndicator({rest:true,recovered:true});assert.ok(markup.includes('done recovered'));assert.ok(markup.includes('Recovery completed'))});
