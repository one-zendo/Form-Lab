const test=require('node:test'),assert=require('node:assert/strict');
const {createTrainingStorage}=require('../foundation/training.js');
function fixture(){const data=new Map();let fail=null;const storage={getItem:k=>data.get(k)??null,setItem(k,v){if(k===fail)throw Error('blocked');data.set(k,v)}};return {data,store:createTrainingStorage(storage,'active','history'),fail:k=>fail=k}}
const session={id:'one',exercises:[]};
test('failed history write preserves active workout',()=>{const f=fixture();f.store.write('active',session);f.fail('history');const r=f.store.finish(session,[],123);assert.equal(r.saved,false);assert.deepEqual(r.session,session);assert.deepEqual(JSON.parse(f.data.get('active')),session)});
test('interrupted completion recovers without duplicate or changed timestamp',()=>{const f=fixture();f.store.write('active',session);f.fail('active');const r=f.store.finish(session,[],123);assert.equal(r.saved,true);assert.equal(r.ok,false);assert.equal(r.session,null);f.fail(null);const history=JSON.parse(f.data.get('history'));assert.deepEqual(f.store.recover(session,history),{session:null,ok:true});assert.equal(JSON.parse(f.data.get('active')),null);assert.deepEqual(f.store.finish(session,history,456).history,history)});
test('corrupt storage is reported without overwriting it',()=>{const f=fixture();f.data.set('history','broken');assert.equal(f.store.read('history',[],Array.isArray).ok,false);assert.equal(f.data.get('history'),'broken')});
test('failed active write is reported',()=>{const f=fixture();f.fail('active');assert.equal(f.store.write('active',session),false)});
test('successful completion clears active state and stores history',()=>{const f=fixture();f.store.write('active',session);const r=f.store.finish(session,[],123);assert.equal(r.ok,true);assert.equal(JSON.parse(f.data.get('active')),null);assert.equal(JSON.parse(f.data.get('history'))[0].finished,123)});

const {validExercises,validSession}=require('../foundation/training.js');
test('nested malformed exercises and records are rejected',()=>{assert.equal(validExercises([null]),false);assert.equal(validExercises([{name:'Squat',sets:[null]}]),false);assert.equal(validSession({id:'x',name:'Workout',started:1,exercises:[{name:'Squat',sets:[]}]}),true);assert.equal(validSession({id:'x',exercises:[]}),false)});
