'use strict';
const Store=(()=>{
const id=()=>globalThis.crypto?.randomUUID?.()||Math.random().toString(36).slice(2)+Date.now();
const blank=()=>({version:1,routines:[],history:[],active:null,unit:'kg',rest:90,custom:[],appearance:'system'});
const set=()=>({weight:0,reps:10,done:false,type:'normal',rir:'',rpe:''});
const exercise=name=>({id:id(),name,sets:[set(),set(),set()],notes:'',group:''});
const clone=x=>JSON.parse(JSON.stringify(x));
const start=(r,now=Date.now())=>({id:id(),name:r?.name||'Quick workout',started:now,pausedAt:0,pausedMs:0,restUntil:0,exercises:clone(r?.exercises||[]).map(e=>({...e,sets:e.sets.map(s=>({...s,done:false}))}))});
const volume=w=>w.exercises.reduce((n,e)=>n+e.sets.reduce((a,s)=>a+(s.done?s.weight*s.reps:0),0),0);
const duration=(w,now=Date.now())=>Math.max(0,(w.ended||w.pausedAt||now)-w.started-(w.pausedMs||0));
const validSet=s=>s&&Number.isFinite(s.weight)&&s.weight>=0&&Number.isFinite(s.reps)&&s.reps>=0&&typeof s.done==='boolean';
const validExercise=e=>e&&typeof e.id==='string'&&typeof e.name==='string'&&Array.isArray(e.sets)&&e.sets.every(validSet);
const validWorkout=w=>w&&typeof w.id==='string'&&typeof w.name==='string'&&Array.isArray(w.exercises)&&w.exercises.every(validExercise);
const valid=d=>d&&d.version===1&&Array.isArray(d.routines)&&d.routines.every(validWorkout)&&Array.isArray(d.history)&&d.history.every(w=>validWorkout(w)&&Number.isFinite(w.started)&&Number.isFinite(w.ended))&&(!d.active||validWorkout(d.active)&&Number.isFinite(d.active.started))&&['kg','lb'].includes(d.unit)&&Number.isFinite(d.rest)&&d.rest>=0&&d.rest<=600&&Array.isArray(d.custom)&&d.custom.every(x=>typeof x==='string');
return {id,blank,set,exercise,clone,start,volume,duration,valid};
})();if(typeof module!=='undefined')module.exports=Store;