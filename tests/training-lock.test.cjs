const test=require('node:test'),assert=require('node:assert/strict');
const {acquireTrainingLock}=require('../foundation/training.js');
test('unavailable lock blocks initialization',async()=>{let started=false,blocked=false;await acquireTrainingLock({request:async(n,o,cb)=>{assert.equal(n,'form.training.writer.v1');assert.equal(o.ifAvailable,true);return cb(null)}},()=>started=true,()=>blocked=true);assert.equal(started,false);assert.equal(blocked,true)});
test('exclusive lock stays held while controller is alive',()=>{let started=false,held;acquireTrainingLock({request:(n,o,cb)=>{held=cb({name:n});return held}},()=>started=true,()=>assert.fail());assert.equal(started,true);assert.ok(held instanceof Promise)});
test('unsupported browsers use snapshot fallback',()=>{let mode;acquireTrainingLock(undefined,v=>mode=v,()=>assert.fail());assert.equal(mode,false)});
test('lock request rejection fails closed',async()=>{let blocked=false;await acquireTrainingLock({request:()=>Promise.reject(Error('denied'))},()=>assert.fail(),()=>blocked=true);assert.equal(blocked,true)});
