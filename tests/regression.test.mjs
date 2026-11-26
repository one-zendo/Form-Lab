import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const js=fs.readFileSync(new URL('../core/app.js',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../styles/app.css',import.meta.url),'utf8');
const headlineCss=fs.readFileSync(new URL('../styles/headlines.css',import.meta.url),'utf8');
const manifest=JSON.parse(fs.readFileSync(new URL('../version.json',import.meta.url),'utf8'));
test('script parses and build versions match',()=>{new vm.Script(js);assert.equal(Number(js.match(/const BUILD=(\d+)/)[1]),manifest.build);assert.ok(html.includes('id="build-number">Build '+manifest.build));assert.ok(html.includes('app.js?v='+manifest.build));assert.ok(html.includes('app.css?v='+manifest.build))});
const storageCode=fs.readFileSync(new URL('../core/storage.js',import.meta.url),'utf8')+'\n'+js.slice(js.indexOf("const WORKOUT_STORAGE="),js.indexOf("const setCount="));
const key='form.lab.workouts.v1';
const routine={id:'r1',name:'Test',exercises:[{name:'Squat',sets:[{weight:20,reps:10,rest:90}]}]};
const legacy={routines:[routine],history:[],session:null};
function storage(initial={}){const map=new Map(Object.entries(initial));const ctx=vm.createContext({localStorage:{getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)}});vm.runInContext(storageCode,ctx);return {map,run:code=>vm.runInContext(code,ctx)}}
test('legacy data migrates without losing routines',()=>{const x=storage({[key]:JSON.stringify(legacy)});assert.equal(x.run('workoutData.routines[0].name'),'Test');assert.equal(x.run('saveWorkouts()'),true);assert.equal(JSON.parse(x.map.get(key)).schemaVersion,1);assert.deepEqual(JSON.parse(x.map.get(key+'.backup')),legacy)});
test('invalid primary is never overwritten',()=>{const x=storage({[key]:'broken',[key+'.backup']:JSON.stringify(legacy)});assert.equal(x.run('workoutData.routines.length'),1);assert.equal(x.run('saveWorkouts()'),false);assert.equal(x.map.get(key),'broken')});
test('invalid types rejected',()=>{const x=storage();assert.equal(Boolean(x.run('validWorkoutData(42)')),false);assert.equal(Boolean(x.run('validWorkoutData([])')),false)});
test('production landscape shell no longer uses calibrated offsets',()=>{assert.ok(!css.includes('--folded-landscape-90-x:'));assert.ok(css.includes('body[data-layout=folded-landscape][data-calibrating=true] main'));assert.ok(css.includes('--fl-shell-edge:var(--space-3)'))});
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

test('FL Home uses side-rail bottom clearance and intrinsic card rows',()=>{assert.ok(css.includes('main:has(.home-page){overflow-y:auto;padding-bottom:calc(var(--fl-bottom-clearance) + var(--safe-bottom))}'));assert.ok(css.includes('.home-dashboard{flex:1 0 auto;min-height:min-content;'));assert.ok(css.includes('.home-streak-footer{flex:none;padding-top:var(--space-2);margin-top:0}'))});

test('Safe inset fallback identifies dominant side',()=>{const classify=vm.runInNewContext(js.match(/function foldedLandscapeSide\([^]*?\}/)[0]+';foldedLandscapeSide');assert.equal(classify(0,40),'right');assert.equal(classify(40,0),'left');assert.equal(classify(0,0),'unknown');assert.equal(classify(20,20),'unknown');assert.equal(classify(20,21),'unknown')});

test('adaptive layout supports measured and full-screen dimensions without exact signatures',()=>{const classify=vm.runInNewContext(js.match(/function adaptiveLayout\([^\n]+/)[0]+';adaptiveLayout');for(const [w,h,a,expected] of [[382,678,0,"FP"],[466,678,0,"FP"],[594,466,90,"FL1"],[678,466,270,"FL2"],[669,869,0,"UP"],[669,951,0,"UP"],[867,669,270,"UL"],[951,669,90,"UL"],[610,480,90,"FL1"]])assert.equal(classify(w,h,466/678,a).orientation,expected);assert.equal(classify(390,844,.46,0).mode,'standard-portrait');assert.ok(!css.includes('[data-duo-orientation=FL1]'));assert.ok(css.includes('--fl-shell-edge:var(--space-3)'))});

test('shared layout primitives are fluid and token driven',()=>{for(const name of ['form-page','form-stack','form-grid','form-card'])assert.ok(css.includes(':where(.'+name+'){'));assert.ok(css.includes('repeat(auto-fit,minmax(min(100%,var(--layout-card-min)),1fr))'))});

test('existing pages use shared layout primitives without replacing semantic selectors',()=>{for(const name of ['page form-page home-page','page form-page workouts-page','form-grid home-dashboard','form-card home-streak-card','form-card workouts-card'])assert.ok(js.includes(name));assert.ok(css.indexOf(':where(.form-grid)')<css.indexOf('.home-page {'));assert.ok(css.includes('env(viewport-segment-right 0 0,50vw)'));assert.ok(css.includes('env(viewport-segment-bottom 0 0,50vh)'))});

test('Duo orientation fixtures preserve layout and dock at measured and reference sizes',()=>{const fixtures=JSON.parse(fs.readFileSync(new URL('./fixtures/duo-orientations.json',import.meta.url),'utf8'));const classify=vm.runInNewContext(js.match(/function adaptiveLayout[^\n]+/)[0]+';adaptiveLayout');for(const f of fixtures){for(const dims of [f.viewport,f.display]){const state=classify(...dims,466/678,f.rotation);assert.equal(state.orientation,f.orientation);assert.equal(state.mode,f.mode);assert.equal(state.dock,f.dock)}const svg=fs.readFileSync(new URL('../design/duo/'+f.orientation+'.svg',import.meta.url),'utf8');assert.ok(svg.includes('id="camera"'));assert.ok(svg.includes('id="display"'))}});

test('shared controls retain existing semantic tokens and legacy selectors',()=>{assert.ok(css.includes(':where(.form-button),.workouts-action {'));assert.ok(css.includes(':where(.form-input),.workouts-input { padding:'));assert.ok(js.includes('class="form-button workouts-action'));assert.ok(js.includes('class="form-input workouts-input'));assert.ok(css.includes('min-height:var(--touch-target)'));assert.ok(css.includes('font-variant-numeric:tabular-nums'))});

test('shared interaction surfaces preserve native dialog markup and legacy sizing',()=>{assert.equal((html.match(/<dialog /g)||[]).length,(html.match(/form-dialog form-dialog-legacy/g)||[]).length);assert.ok(css.includes('dialog.form-dialog:not(.form-dialog-legacy)'));assert.ok(css.includes('dialog.form-sheet'));assert.ok(css.includes('.form-selection'));assert.ok(css.includes(':where(.form-menu)'))});

test('persistent viewport outline shares diagnostic border and never intercepts touches',()=>{assert.ok(html.includes('id="viewport-outline" aria-hidden="true"'));assert.ok(css.includes('#viewport-outline{position:fixed;inset:0;'));assert.ok(css.match(/#viewport-outline\{[^}]+pointer-events:none/));assert.ok(css.includes('body[data-diagnostics=true] #viewport-outline{visibility:hidden}'));assert.equal((css.match(/--viewport-outline-color:#0088ff/g)||[]).length,1)});

test('FORM headline toggles diagnostics without navigation menu',()=>{assert.ok(js.includes('id="open-diagnostics"'));assert.ok(html.includes('id="close-diagnostics" class="form-diagnostics-headline"'));assert.ok(!js.includes('pageTabMenu'));assert.ok(!html.includes('id="page-tab-menu"'));assert.ok(js.includes("setDiagnostics(b.id==='open-diagnostics')"))});

test('Home uses shared numeric typography and semantic date and button markup',()=>{assert.ok(js.includes('home-streak-number form-numeric'));assert.ok(js.includes('home-streak-footer form-numeric'));assert.ok(js.includes('class="home-date" datetime='));assert.ok(js.includes('type="button" id="home-calendar"'))});

test('normalized shared tokens preserve approved runtime values',()=>{for(const token of ['--motion-standard:320ms','--motion-duration:var(--motion-standard)','--motion-color-duration:var(--motion-swipe)','--motion-hinge-retarget-ms:500','--routine-row-min:76px','--exercise-picker-max:560px','--dialog-compact-max:320px'])assert.ok(css.includes(token));assert.ok(js.includes('LAYOUT_THRESHOLDS.compactShort'));assert.ok(js.includes("getPropertyValue('--motion-hinge-retarget-ms')"));assert.ok(css.includes('pointer-events:none;background:none'))});


test('approved Duo headline and FL1 content calibration matches CSS tokens',()=>{
 assert.ok(headlineCss.includes('--headline-optical-gap:10.5px'));
 assert.ok(headlineCss.includes('--fl1-native-headline-inset:84px'));
 assert.ok(headlineCss.includes('--fl1-native-content-inset:29.5px'));
 assert.ok(headlineCss.includes('--fl1-safari-excluded:84px'));
 assert.ok(headlineCss.includes('--fl1-safari-content-inset:max(0px,calc(var(--fl1-native-content-inset) - var(--fl1-safari-excluded)))'));
});
test('Duo hardware notes defer to the approved camera and diagnostics standard',()=>{
 const notes=fs.readFileSync(new URL('../DUO_HARDWARE.md',import.meta.url),'utf8');
 assert.ok(notes.includes('FP (418,48), FL1 (48,48), FL2 (630,418)'));
 assert.ok(notes.includes('Guides are diagnostics-only'));
 assert.ok(!notes.includes('Provisional FL1 camera center (48,42), FP (424,48), FL2 (630,424)'));
});
