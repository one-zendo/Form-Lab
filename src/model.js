'use strict';
const FormModel=(()=>{
const uid=()=>globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+Math.random().toString(36).slice(2);
const fresh=()=>({version:1,routines:[],history:[],active:null,unit:'kg',rest:90,exercises:[]});
const set=()=>({weight:0,reps:10,done:false,type:'normal',rir:''});
const exercise=name=>({id:uid(),name,sets:[set(),set(),set()]});
const start=(routine,now=Date.now())=>({id:uid(),name:routine?.name||'Quick workout',started:now,exercises:(routine?.exercises||[]).map(e=>({...e,sets:e.sets.map(s=>({...s,done:false}))})),restUntil:0});
const volume=w=>w.exercises.reduce((n,e)=>n+e.sets.filter(s=>s.done).reduce((a,s)=>a+s.weight*s.reps,0),0);
const finish=(w,now=Date.now())=>({...w,ended:now,restUntil:0});
const valid=s=>s&&s.version===1&&Array.isArray(s.routines)&&Array.isArray(s.history)&&Array.isArray(s.exercises)&&['kg','lb'].includes(s.unit)&&Number.isFinite(s.rest)&&s.rest>=0&&s.rest<=600;
return {uid,fresh,set,exercise,start,volume,finish,valid};
})();if(typeof module!=='undefined')module.exports=FormModel;
