const test=require('node:test'),assert=require('node:assert/strict');
const {workoutTotals,previousExerciseSets}=require('../foundation/training.js');
test('volume and count include completed sets only',()=>{assert.deepEqual(workoutTotals([{sets:[{done:true,weight:30,reps:8},{done:false,weight:100,reps:10},{done:true,weight:null,reps:8}]}]),{completed:2,total:3,volume:240})});
test('previous sets use latest matching detailed session',()=>{const set={done:true,weight:30,reps:8};assert.deepEqual(previousExerciseSets([{detail:[{name:'Bench',sets:[set,{done:false}]}]},{detail:[{name:'Other',sets:[set]}]}],'Bench'),[set]);assert.deepEqual(previousExerciseSets([],'Bench'),[])});
