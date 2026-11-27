/* Storage helpers are also exercised directly by Node regression tests. */
function validExercises(v){return Array.isArray(v)&&v.every(e=>e&&typeof e.name==='string'&&Array.isArray(e.sets)&&e.sets.every(s=>s&&typeof s==='object'&&!Array.isArray(s)))}
function validSession(v){return !!(v&&typeof v.id==='string'&&typeof v.name==='string'&&Number.isFinite(v.started)&&validExercises(v.exercises))}
function remainingRest(session,now=Date.now()){if(!session)return 0;const value=session.restPaused??(session.restEnd-now);return Number.isFinite(value)?Math.max(0,value):0}
function createTrainingStorage(storage,key,historyKey){
 const snapshots=new Map();
 const conflicted=()=>{try{return [...snapshots].some(([k,v])=>storage.getItem(k)!==v)}catch{return true}};
 const write=(k,v)=>{try{if(conflicted())return false;const raw=JSON.stringify(v);storage.setItem(k,raw);if(storage.getItem(k)!==raw)return false;snapshots.set(k,raw);return true}catch{return false}};
 const read=(k,fallback,valid)=>{try{const raw=storage.getItem(k),value=raw===null?fallback:JSON.parse(raw);snapshots.set(k,raw);return valid(value)?{ok:true,value}:{ok:false,value:fallback}}catch{return {ok:false,value:fallback}}};
 const recover=(session,history)=>{if(session&&history.some(r=>r.id===session.id))return {session:null,ok:write(key,null)};return {session,ok:true}};
 const finish=(session,history,now)=>{const existing=history.find(r=>r.id===session.id);const next=existing?history:[...history,{...JSON.parse(JSON.stringify(session)),finished:now}];if(!existing&&!write(historyKey,next))return {history,session,ok:false,saved:false};return {history:next,session:null,ok:write(key,null),saved:true}};
 return {write,read,recover,finish,conflicted};
}
if(typeof module!=='undefined'&&module.exports)module.exports={createTrainingStorage,validExercises,validSession,remainingRest};
function acquireTrainingLock(locks,start,blocked){if(!locks?.request){start(false);return}return locks.request('form.training.writer.v1',{ifAvailable:true},lock=>{if(!lock){blocked();return}start(true);return new Promise(()=>{})}).catch(blocked)}
if(typeof module!=='undefined'&&module.exports)module.exports.acquireTrainingLock=acquireTrainingLock;

// Calendar windows are inclusive local calendar dates, represented as UTC days to avoid DST drift.
const performanceDays={ '1W':7,'4W':28,'12W':84,'1Y':365 };
function performanceDate(date){const t=Date.parse(date+'T00:00:00Z');return Number.isFinite(t)?t/86400000:NaN}
function performanceWindow(records,metric,range,offset,today,convert=n=>n){
 const days=performanceDays[range]||84,end=performanceDate(today)-offset*days,start=end-days+1;
 const value=r=>metric==='Density'?(Number.isFinite(r.volume)&&r.duration>0?convert(r.volume)/r.duration:null):metric==='Volume'?(Number.isFinite(r.volume)?convert(r.volume):null):r[metric.toLowerCase()];
 const all=records.map(r=>({...r,day:performanceDate(r.date),value:value(r)})).filter(r=>Number.isFinite(r.day)&&Number.isFinite(r.value)).sort((a,b)=>a.day-b.day||(a.finished||0)-(b.finished||0));
 const points=all.filter(r=>r.day>=start&&r.day<=end),latest=points.at(-1);
 const monday=latest?latest.day-((new Date(latest.day*86400000).getUTCDay()+6)%7):null;
 const previous=latest?all.filter(r=>r.day>=monday-7&&r.day<monday).at(-1):null;
 return {start,end,days,points,latest,delta:previous?latest.value-previous.value:null,average:points.length?points.reduce((s,p)=>s+p.value,0)/points.length:null,best:points.length?Math.max(...points.map(p=>p.value)):null,canBack:all.some(p=>p.day<start)};
}
if(typeof module!=='undefined'&&module.exports)module.exports.performanceWindow=performanceWindow;

function workoutTotals(exercises){const sets=exercises.flatMap(e=>e.sets),done=sets.filter(s=>s.done);return {completed:done.length,total:sets.length,volume:done.reduce((n,s)=>n+(Number.isFinite(s.weight)&&Number.isFinite(s.reps)?s.weight*s.reps:0),0)}}
function previousExerciseSets(records,name){for(const record of [...records].reverse()){const exercise=record.detail?.find(e=>e.name===name);if(exercise?.sets.some(s=>s.done))return exercise.sets.filter(s=>s.done)}return []}
if(typeof module!=='undefined'&&module.exports){module.exports.workoutTotals=workoutTotals;module.exports.previousExerciseSets=previousExerciseSets}
if(typeof document!=='undefined')
acquireTrainingLock(navigator.locks,()=>{
const q=s=>document.querySelector(s),key='form.training.demo.v1',routineKey='form.training.routine-overrides.v2',historyKey='form.training.history.demo.v1';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clone=x=>JSON.parse(JSON.stringify(x));let session=null,selected=null,editing=false,draft=null,storageOK=true,overrides={},savedHistory=[];
const store=createTrainingStorage({getItem:k=>localStorage.getItem(k),setItem:(k,v)=>localStorage.setItem(k,v)},key,historyKey);
const active=store.read(key,null,v=>v===null||validSession(v)),history=store.read(historyKey,[],v=>Array.isArray(v)&&v.every(r=>validSession(r)&&Number.isFinite(r.finished))),routines=store.read(routineKey,{},v=>!!v&&typeof v==='object'&&!Array.isArray(v)&&Object.values(v).every(group=>group&&typeof group==='object'&&!Array.isArray(group)&&Object.values(group).every(validExercises)));
const imports=store.read(privateTrainingKey,null,value=>{readPrivateTraining(value);return true});
session=active.value;if(session){session.restPaused=Number.isFinite(session.restPaused)?Math.max(0,session.restPaused):null;session.restEnd=Number.isFinite(session.restEnd)?Math.max(0,session.restEnd):0}savedHistory=history.value;overrides=routines.value;
const readable=active.ok&&history.ok&&routines.ok;
const recovery=readable?store.recover(session,savedHistory):{session:null,ok:false};session=active.ok&& !readable?active.value:recovery.session;storageOK=readable&&recovery.ok;
let cleanupPending=readable&&!recovery.ok;
const write=(k,v)=>readable&&store.write(k,v);
function persist(){storageOK=write(key,session);q('#workout-storage').textContent=storageOK?'':'Storage unavailable — keep app open';return storageOK}
const demo=()=>window.FormDemo.isEnabled();
const go=page=>document.dispatchEvent(new CustomEvent('form-page',{detail:page}));
const workouts=()=>q('#dock [data-page="Workouts"]').click();
function routine(id){const datasetId=FormDemo.datasetId(),r=FormDemo.getData()?.routines.find(x=>x.id===id),group=overrides[datasetId]||{};return r?{...r,datasetId,exercises:clone((Object.hasOwn(group,id)?group[id]:null)||r.exercises.map(([name,count,reps])=>({name,sets:Array.from({length:count},()=>({weight:null,reps,rest:FormPrefs.get('rest')}))})))}:null}
const thumb='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+q('#dock [data-page="Workouts"] svg').innerHTML+'</svg>';
function exerciseSubtitle(e){return e.name.match(/\(([^)]+)\)\s*$/)?.[1]||''}
function exerciseThumb(){return '<span class="training-thumb">'+thumb+'</span>'}
const summary=(e)=>e.sets.length+' sets · '+e.sets.map(s=>s.reps).filter((x,i,a)=>a.indexOf(x)===i).join('/')+' reps';
function open(id){if(!demo())return;const next=routine(id);if(!next)return;if(editing&&selected.id===id&&selected.datasetId===next.datasetId){go('Routine');return}if(editing&&!confirm('Discard unsaved routine edits?'))return;if(selected?.id!==next.id||selected?.datasetId!==next.datasetId){performanceRange='12W';performanceOffset=0}selected=next;editing=false;draft=null;renderRoutine();go('Routine')}

function recordsForDataset() {
  const source = FormDemo.getData();
  if (!source) return [];
  const datasetId = FormDemo.datasetId();
  const local = savedHistory.filter(record =>
    (record.datasetId ?? (record.privateArtwork === false ? sampleDatasetId : null)) === datasetId
  ).map(record => {
    const sets = record.exercises.flatMap(exercise => exercise.sets).filter(set => set.done);
    const finished = new Date(record.finished);
    const date = [finished.getFullYear(), String(finished.getMonth() + 1).padStart(2, '0'),
      String(finished.getDate()).padStart(2, '0')].join('-');
    return {
      routineId: record.routineId, routine: record.name, date, finished: record.finished, localSession: true,
      duration: Math.max(0, (record.finished - record.started) / 60000),
      volume: sets.reduce((total, set) => total + (Number(set.weight) || 0) * (Number(set.reps) || 0), 0),
      reps: sets.reduce((total, set) => total + (Number(set.reps) || 0), 0),
      sets: sets.length, detail: record.exercises,
    };
  });
  return [...source.records.map(record => ({ ...record, localSession: false })), ...local]
    .sort((a, b) => a.date.localeCompare(b.date) || (a.localSession ? a.finished : 0) - (b.localSession ? b.finished : 0));
}

function routineRecords(routine) {
  const routines = FormDemo.getData()?.routines || [];
  return recordsForDataset().filter(record => {
    if (record.routineId) return record.routineId === routine.id;
    if (routines.some(candidate => candidate.id === record.routine)) return record.routine === routine.id;
    return record.routine === routine.name && routines.filter(candidate => candidate.name === routine.name).length === 1;
  });
}
let performanceRange='12W',performanceOffset=0;
function renderRoutineChart(){
 const r=editing?draft:selected;if(!r)return;
 const metric=q('#routine-metric').value,records=routineRecords(r),now=new Date();
 const today=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
 const model=performanceWindow(records,metric,performanceRange,performanceOffset,today,FormPrefs.weightOut);
 const {points,start,end,days,delta,average,best,canBack}=model;
 const unit=({Volume:FormPrefs.get('weight'),Reps:'reps',Duration:'min',Sets:'sets',Density:FormPrefs.get('weight')+'/min'})[metric];
 const fmt=n=>n===null?'—':Number(n.toFixed(1)).toLocaleString();
 const date=d=>new Date(d*86400000).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});
 const short=d=>new Date(d*86400000).toLocaleDateString(undefined,{month:'short',day:'numeric',timeZone:'UTC'});
 const chart=q('#routine-chart');chart.replaceChildren();
 q('#performance-period').textContent=date(start)+' – '+date(end);
 q('#performance-prev').disabled=!canBack;q('#performance-next').disabled=performanceOffset===0;
 document.querySelectorAll('[data-performance-range]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.performanceRange===performanceRange)));
 const label=document.createElement('p');label.className='note performance-selected-date';chart.append(label);
 const head=document.createElement('p');head.className='routine-value form-numeric';chart.append(head);
 const comparison=document.createElement('p');comparison.className='routine-comparison note';chart.append(comparison);
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
 svg.setAttribute('viewBox','0 0 320 125');svg.setAttribute('preserveAspectRatio','none');
 svg.setAttribute('aria-label',metric+' session chart');chart.append(svg);
 const el=(tag,attrs)=>{const node=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))node.setAttribute(k,String(v));svg.append(node);return node};
 for(const y of [12,42,72,102])el('line',{x1:8,x2:312,y1:y,y2:y,class:'performance-grid'});
 const lo=points.length?Math.min(...points.map(p=>p.value)):0,hi=points.length?Math.max(...points.map(p=>p.value)):0;
 const coords=points.map(p=>[8+(p.day-start)*304/(days-1),hi===lo?57:102-(p.value-lo)/(hi-lo)*90]);
 if(coords.length>1){el('path',{d:'M'+coords.map(p=>p.join(',')).join(' L')+' L'+coords.at(-1)[0]+',102 L'+coords[0][0]+',102 Z',class:'performance-area'});el('polyline',{points:coords.map(p=>p.join(',')).join(' '),class:'performance-line'})}
 const cursor=el('line',{y1:8,y2:102,class:'performance-cursor'}),dot=el('circle',{r:4,class:'performance-point'});
 const dates=document.createElement('div');dates.className='performance-axis';for(const day of [start,Math.floor((start+end)/2),end]){const span=document.createElement('span');span.textContent=short(day);dates.append(span)}chart.append(dates);
 let selectedIndex=points.length-1;
 function choose(i){if(!points.length)return;selectedIndex=Math.max(0,Math.min(points.length-1,i));const p=points[selectedIndex],[x,y]=coords[selectedIndex];label.textContent=date(p.day);head.textContent=fmt(p.value)+' '+unit;cursor.setAttribute('x1',x);cursor.setAttribute('x2',x);dot.setAttribute('cx',x);dot.setAttribute('cy',y);comparison.textContent=selectedIndex===points.length-1?(delta===null?'Previous week: Unavailable':(delta>0?'+':'')+fmt(delta)+' '+unit+' vs. last week'):'';comparison.dataset.direction=selectedIndex===points.length-1&&delta>0?'up':'neutral';svg.setAttribute('aria-valuenow',selectedIndex+1);svg.setAttribute('aria-valuetext',date(p.day)+' · '+fmt(p.value)+' '+unit)}
 if(points.length){svg.setAttribute('tabindex','0');svg.setAttribute('role','slider');svg.setAttribute('aria-valuemin','1');svg.setAttribute('aria-valuemax',points.length);choose(selectedIndex);
 const locate=e=>{const rect=svg.getBoundingClientRect(),x=(e.clientX-rect.left)*320/rect.width,y=(e.clientY-rect.top)*125/rect.height;let best=Infinity,index=0;coords.forEach(([cx,cy],i)=>{const distance=Math.abs(cx-x)*1000+Math.abs(cy-y);if(distance<=best){best=distance;index=i}});choose(index)};
 let pointer=null;svg.addEventListener('pointerdown',e=>{if(!e.isPrimary||e.button!==0)return;pointer=e.pointerId;svg.setPointerCapture?.(pointer);locate(e)});svg.addEventListener('pointermove',e=>{if(e.pointerId===pointer)locate(e)});for(const event of ['pointerup','pointercancel','lostpointercapture'])svg.addEventListener(event,e=>{if(e.pointerId===pointer)pointer=null});
 svg.addEventListener('keydown',e=>{const i=({ArrowLeft:selectedIndex-1,ArrowDown:selectedIndex-1,ArrowRight:selectedIndex+1,ArrowUp:selectedIndex+1,Home:0,End:points.length-1})[e.key];if(i!==undefined){e.preventDefault();choose(i)}});
 }else{cursor.remove();dot.remove();label.textContent='No sessions in this period';head.textContent='—';comparison.textContent='Choose another period or log a workout.'}
 const stats=document.createElement('div');stats.className='performance-summary';for(const [name,value] of [['Sessions',points.length],['Average',average],['Best',best]]){const cell=document.createElement('div'),title=document.createElement('strong'),caption=document.createElement('small');title.textContent=fmt(value);caption.textContent=name;cell.append(title,caption);stats.append(cell)}chart.append(stats);
}
function renderRoutineActivity(){const r=editing?draft:selected;if(!r)return;const records=routineRecords(r);renderRoutineChart();
const history=q('#routine-history');history.innerHTML='<h2>History</h2>';if(!records.length){history.insertAdjacentHTML('beforeend','<p class="note">No completed sessions yet.</p>');return}for(const x of [...records].reverse()){const d=document.createElement('details');d.className='form-card routine-history-item';const sum=document.createElement('summary');sum.textContent=x.date+' · '+(Number.isFinite(x.duration)?Math.round(x.duration)+' min':'Duration unavailable');d.append(sum);const p=document.createElement('p');p.textContent=[['Volume',x.volume],['Reps',x.reps],['Sets',x.sets]].filter(a=>Number.isFinite(a[1])).map(a=>a[0]+': '+a[1]).join(' · ')||'No additional metrics';d.append(p);for(const e of x.detail||[]){const row=document.createElement('p');row.textContent=e.name+' — '+e.sets.filter(s=>s.done).map(s=>(s.weight??'—')+' kg × '+(s.reps??'—')).join(', ');d.append(row)}if(!x.detail){const note=document.createElement('p');note.className='note';note.textContent='Summary record only';d.append(note)}history.append(d)}}
q('#routine-metric').addEventListener('change',()=>{performanceOffset=0;renderRoutineChart()});
document.querySelectorAll('[data-performance-range]').forEach(b=>b.addEventListener('click',()=>{performanceRange=b.dataset.performanceRange;performanceOffset=0;renderRoutineChart()}));
q('#performance-prev').addEventListener('click',()=>{performanceOffset++;renderRoutineChart()});
q('#performance-next').addEventListener('click',()=>{performanceOffset=Math.max(0,performanceOffset-1);renderRoutineChart()});
function renderRoutine(){const r=editing?draft:selected;if(!r)return;q('#routine-name').textContent=r.name;q('#routine-focus').textContent=r.focus;q('#routine-stats').innerHTML='<span><strong>'+r.exercises.length+'</strong>Exercises</span><span><strong>'+r.exercises.reduce((n,e)=>n+e.sets.length,0)+'</strong>Sets</span><span><strong>~'+esc(r.duration??'—')+'m</strong>Duration</span>';q('#routine-note').textContent='';renderRoutineActivity();q('#routine-edit').setAttribute('aria-label',editing?'Done editing':'Edit routine');q('#routine-edit').innerHTML=editing?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m16 3 5 5L8 21H3v-5zM13 6l5 5"/></svg>';q('#routine-start').disabled=editing;q('#routine-exercises').innerHTML=r.exercises.map((e,i)=>'<details class="form-card training-exercise" '+(editing?'open':'')+'><summary>'+exerciseThumb()+'<span class="training-copy"><strong>'+esc(e.name)+'</strong><small>'+summary(e)+'</small></span><span aria-hidden="true">⌄</span></summary><div class="training-set-grid"><span>Set</span><span>'+FormPrefs.get('weight')+'</span><span>Reps</span><span>Rest (s)</span><span></span></div>'+e.sets.map((s,j)=>'<div class="training-set-grid"><span>'+(j+1)+'</span>'+['weight','reps','rest'].map(k=>editing?'<input type="number" min="0" step="'+(k==='weight'?'0.5':'1')+'" data-edit="'+i+':'+j+':'+k+'" aria-label="'+k+' set '+(j+1)+'" value="'+((k==='weight'?FormPrefs.weightOut(s[k]):s[k])??'')+'">':'<span>'+((k==='weight'?FormPrefs.weightOut(s[k]):s[k])??'—')+'</span>').join('')+'<span></span></div>').join('')+'</details>').join('')}
q('#routine-list').addEventListener('click',e=>{const b=e.target.closest('[data-routine]');if(b)open(b.dataset.routine)});
q('#routine-back').addEventListener('click',()=>{if(editing&&!confirm('Discard unsaved routine edits?'))return;editing=false;draft=null;workouts()});
q('#routine-edit').addEventListener('click',()=>{if(!selected)return;if(editing){const datasetId=selected.datasetId;if(datasetId!==FormDemo.datasetId())return;const next={...overrides,[datasetId]:{...overrides[datasetId],[selected.id]:draft.exercises}};if(!write(routineKey,next)){q('#routine-note').textContent='Could not save changes';return}overrides=next;selected=draft;draft=null;editing=false}else{draft=clone(selected);editing=true}renderRoutine()});
q('#routine-exercises').addEventListener('input',e=>{if(!editing||!e.target.dataset.edit)return;const [i,j,k]=e.target.dataset.edit.split(':');const n=e.target.valueAsNumber;draft.exercises[i].sets[j][k]=Number.isFinite(n)?Math.max(0,k==='weight'?FormPrefs.weightIn(n):n):null});
q('#routine-start').addEventListener('click',()=>{if(!selected||editing||selected.datasetId!==FormDemo.datasetId())return;if(cleanupPending){cleanupPending=!store.write(key,null);storageOK=!cleanupPending}if(!readable||cleanupPending||store.conflicted()){q('#routine-note').textContent='Workout storage needs recovery. Reload before starting.';return}if(session){resume();return}session={id:globalThis.crypto?.randomUUID?.()||String(Date.now())+'-'+Math.random().toString(36).slice(2),datasetId:selected.datasetId,routineId:selected.id,name:selected.name,started:Date.now(),exercises:clone(selected.exercises).map(e=>({...e,sets:e.sets.map(s=>({...s,done:false}))})),restEnd:0,restPaused:null,privateArtwork:FormDemo.isPrivate()};if(!persist()){session=null;q('#routine-note').textContent='Could not save workout. Check storage permissions and try again.';return}resume()});
function resume(){if(!session||!demo())return;renderWorkout();go('Workout');syncResume()}
function syncResume(){q('#resume-workout').hidden=!session||!demo()}
q('#resume-workout').addEventListener('click',resume);
let workoutSelection=-1,workoutSessionId=null;
function renderWorkout(){if(!session)return;if(workoutSessionId!==session.id){workoutSessionId=session.id;workoutSelection=-1}if(workoutSelection<0||workoutSelection>=session.exercises.length)workoutSelection=Math.max(0,session.exercises.findIndex(e=>e.sets.some(s=>!s.done)));q('#workout-choices').innerHTML=session.exercises.map((e,i)=>'<div class="workout-swipe" data-exercise="'+i+'"><button class="form-card workout-choice" data-choice="'+i+'" aria-pressed="'+(i===workoutSelection)+'"><strong>'+esc(e.name)+'</strong><small class="workout-set-count" data-lit="'+e.sets.some(s=>s.done)+'">'+e.sets.filter(s=>s.done).length+'/'+e.sets.length+'</small></button><button class="workout-delete" data-delete="'+i+'" hidden>Delete</button></div>').join('');q('#workout-progress').innerHTML=session.exercises.map(e=>{const n=e.sets.filter(s=>s.done).length;return '<span data-state="'+(n===e.sets.length&&n?'full':n?'partial':'empty')+'" style="--exercise-fill:'+(e.sets.length?n/e.sets.length*100:0)+'%"></span>'}).join('');const history=recordsForDataset();let next=true;q('#workout-exercises').innerHTML=session.exercises.map((e,i)=>{const previous=previousExerciseSets(history,e.name);return '<div class="workout-swipe" data-exercise="'+i+'" data-selected="'+(i===workoutSelection)+'"><details class="form-card training-exercise" '+(e.collapsed===true?'':'open')+'><summary>'+exerciseThumb()+'<span class="training-copy"><strong>'+esc(e.name)+'</strong>'+(exerciseSubtitle(e)?'<small>'+esc(exerciseSubtitle(e))+'</small>':'')+'</span><span class="workout-set-count" data-lit="'+e.sets.some(s=>s.done)+'">'+e.sets.filter(s=>s.done).length+'/'+e.sets.length+'</span><span class="workout-chevron" aria-hidden="true">⌄</span></summary><div class="workout-exercise-tools"><button type="button" data-tool="rest" aria-expanded="false">Rest: '+format((e.sets.find(s=>!s.done)?.rest??e.sets[0]?.rest??0)*1000)+'</button><button type="button" data-tool="note" aria-expanded="false">'+(e.note?'Note saved':'Note')+'</button><label hidden>Rest (s)<input type="number" min="0" max="86400" step="1" data-exercise-rest="'+i+'" value="'+(e.sets[0]?.rest??0)+'" aria-label="Rest seconds for '+esc(e.name)+'"></label><label hidden>Note<input type="text" maxlength="1000" data-exercise-note="'+i+'" value="'+esc(e.note??'')+'" placeholder="Add note" aria-label="Note for '+esc(e.name)+'"></label></div><div class="training-set-grid"><span>Set</span><span>Prev.</span><span>'+FormPrefs.get('weight')+'</span><span>Reps</span><span></span></div>'+e.sets.map((s,j)=>{const isNext=next&&!s.done;if(isNext)next=false;return '<div class="set-swipe" data-set-swipe="'+i+':'+j+'"><div class="training-set-grid" data-done="'+s.done+'" data-next="'+isNext+'"><span>'+(j+1)+'</span><span class="workout-previous">'+esc(previous[j]&&Number.isFinite(previous[j].weight)&&Number.isFinite(previous[j].reps)?FormPrefs.weightOut(previous[j].weight)+' × '+previous[j].reps:'—')+'</span>'+['weight','reps'].map(k=>'<input type="number" min="0" step="'+(k==='weight'?'0.5':'1')+'" data-log="'+i+':'+j+':'+k+'" aria-label="'+esc(e.name)+' '+k+' set '+(j+1)+'" value="'+((k==='weight'?FormPrefs.weightOut(s[k]):s[k])??'')+'">').join('')+'<button data-complete="'+i+':'+j+'" aria-label="Complete set '+(j+1)+'" aria-pressed="'+s.done+'">'+(s.done?'✓':'○')+'</button></div><button class="set-delete" data-set-delete="'+i+':'+j+'" hidden>Delete</button></div>'}).join('')+'<button class="training-link workout-add-set" data-add-set="'+i+'">+ Add Set</button></details><button class="workout-delete" data-delete="'+i+'" hidden>Delete</button></div>'}).join('');tick()}
q('#workout-exercises').addEventListener('toggle',event=>{const d=event.target;if(!session||!d.matches('.training-exercise')||!d.isConnected)return;const e=session.exercises[Number(d.closest('[data-exercise]').dataset.exercise)];if(e&&Boolean(e.collapsed)===d.open){e.collapsed=!d.open;persist()}},true);
q('#workout-choices').addEventListener('click',e=>{const b=e.target.closest('[data-choice]');if(b){workoutSelection=Number(b.dataset.choice);renderWorkout();q('#workout-exercises [data-exercise="'+workoutSelection+'"]')?.scrollIntoView({block:'nearest'})}});
q('#workout-exercises').addEventListener('click',event=>{const b=event.target.closest('[data-tool]');if(!b)return;const field=b.parentElement.querySelector(b.dataset.tool==='rest'?'[data-exercise-rest]':'[data-exercise-note]');const label=field.closest('label');label.hidden=!label.hidden;b.setAttribute('aria-expanded',String(!label.hidden));if(!label.hidden)field.focus()});
q('#workout-exercises').addEventListener('input',e=>{if(!session)return;if(e.target.dataset.exerciseNote!==undefined){session.exercises[Number(e.target.dataset.exerciseNote)].note=e.target.value.slice(0,1000);persist();return}if(!e.target.dataset.log)return;const [i,j,k]=e.target.dataset.log.split(':');const n=e.target.valueAsNumber;session.exercises[i].sets[j][k]=Number.isFinite(n)?Math.max(0,k==='weight'?FormPrefs.weightIn(n):n):null;persist()});
q('#workout-exercises').addEventListener('change',e=>{if(!session||e.target.dataset.exerciseRest===undefined)return;const exercise=session.exercises[Number(e.target.dataset.exerciseRest)],n=e.target.valueAsNumber;if(!e.target.checkValidity()||!Number.isFinite(n)){e.target.value=exercise.sets[0]?.rest??0;return}for(const set of exercise.sets)if(!set.done)set.rest=n;e.target.closest('.workout-exercise-tools').querySelector('[data-tool=rest]').textContent='Rest: '+format(n*1000);persist()});
q('#workout-exercises').addEventListener('click', event => {
  const button = event.target.closest('[data-complete]');
  if (!button || !session) return;
  const position = button.dataset.complete;
  const [exerciseIndex, setIndex] = position.split(':').map(Number);
  const set = session.exercises[exerciseIndex].sets[setIndex];
  const restoreFocus = document.activeElement === button;
  workoutSelection = exerciseIndex;
  set.done = !set.done;
  if (set.done && FormPrefs.get('autoRest')) {
    session.restTotal = Math.max(0, set.rest || 0) * 1000;
    session.restEnd = Date.now() + session.restTotal;
    session.restPaused = null;
  }
  persist();
  renderWorkout();
  if (restoreFocus) q('[data-complete="' + position + '"]')?.focus({ preventScroll: true });
});
for(const root of [q('#workout-exercises'),q('#workout-choices')]){
let gesture=null,suppressUntil=0;
const close=()=>root.querySelectorAll('.workout-swipe').forEach(w=>{delete w.dataset.revealed;w.style.removeProperty('--swipe-x');w.querySelector('.workout-delete').hidden=true});
root.addEventListener('pointerdown',e=>{const w=e.target.closest('.workout-swipe');if(!w||e.target.closest('.set-swipe,input,button:not(.workout-choice),a')||e.button!==0)return;gesture={w,x:e.clientX,y:e.clientY,id:e.pointerId,base:w.dataset.revealed?84:0,drag:false};});
root.addEventListener('pointermove',e=>{if(!gesture||gesture.id!==e.pointerId)return;const g=gesture,dx=e.clientX-g.x,dy=e.clientY-g.y;if(!g.drag){if(Math.abs(dy)>10&&Math.abs(dy)>Math.abs(dx)){gesture=null;return}if(Math.abs(dx)<10||Math.abs(dx)<Math.abs(dy)*1.4)return;g.drag=true;close();g.w.querySelector('.workout-delete').hidden=false;g.w.dataset.dragging='true';try{root.setPointerCapture(e.pointerId)}catch{}}g.w.style.setProperty('--swipe-x',-Math.max(0,Math.min(84,g.base-dx))+'px');});
function endSwipe(e,cancel=false){if(!gesture||gesture.id!==e.pointerId)return;const g=gesture;gesture=null;if(!g.drag)return;delete g.w.dataset.dragging;g.w.style.removeProperty('--swipe-x');const reveal=!cancel&&g.base-(e.clientX-g.x)>42;if(reveal){g.w.dataset.revealed='true';g.w.querySelector('.workout-delete').hidden=false}else close();suppressUntil=Date.now()+400;try{root.releasePointerCapture(e.pointerId)}catch{}}
root.addEventListener('pointercancel',e=>endSwipe(e,true));
root.addEventListener('pointerup',e=>endSwipe(e));
root.addEventListener('click',e=>{if(Date.now()<suppressUntil&&!e.target.closest('[data-delete]')){e.preventDefault();e.stopImmediatePropagation();return}const b=e.target.closest('[data-delete]');if(!b||!session)return;e.preventDefault();e.stopImmediatePropagation();const i=Number(b.dataset.delete),ex=session.exercises[i];if(!ex||!confirm('Remove '+ex.name+' and its logged sets from this workout?'))return;session.exercises.splice(i,1);if(undoSet?.exercise===ex)clearSetUndo();workoutSelection=Math.min(workoutSelection,session.exercises.length-1);persist();renderWorkout()},true);
root.addEventListener('keydown',e=>{if(e.key==='Escape')close();if(e.key==='Delete'&&!e.target.closest('input,textarea')&&e.target.closest('.workout-swipe')){const w=e.target.closest('.workout-swipe');close();w.dataset.revealed='true';w.querySelector('.workout-delete').hidden=false;w.querySelector('.workout-delete').focus()}});
}
q('#workout-exercises').addEventListener('click',e=>{const b=e.target.closest('[data-add-set]');if(!b||!session)return;const i=Number(b.dataset.addSet),ex=session.exercises[i],last=ex.sets.at(-1)||{weight:null,reps:10,rest:FormPrefs.get('rest')};ex.sets.push({...last,done:false});workoutSelection=i;persist();renderWorkout()});
let setGesture=null,setSuppress=0,undoSet=null;
function clearSetUndo(){undoSet=null;undoBar.hidden=true}
const setRoot=q('#workout-exercises');
function closeSets(){setRoot.querySelectorAll('.set-swipe').forEach(w=>{delete w.dataset.revealed;delete w.dataset.dragging;w.style.removeProperty('--set-x');w.querySelector('.set-delete').hidden=true})}
setRoot.addEventListener('pointerdown',e=>{const w=e.target.closest('.set-swipe');if(!w||e.target.closest('input,button')||e.button!==0)return;setGesture={w,id:e.pointerId,x:e.clientX,y:e.clientY,base:w.dataset.revealed?70:0,drag:false}});
setRoot.addEventListener('pointermove',e=>{const g=setGesture;if(!g||g.id!==e.pointerId)return;const dx=e.clientX-g.x,dy=e.clientY-g.y;if(!g.drag){if(Math.abs(dy)>10&&Math.abs(dy)>Math.abs(dx)){setGesture=null;return}if(Math.abs(dx)<10||Math.abs(dx)<Math.abs(dy)*1.4)return;closeSets();g.drag=true;g.w.dataset.dragging='true';g.w.querySelector('.set-delete').hidden=false;try{setRoot.setPointerCapture(e.pointerId)}catch{}}g.w.style.setProperty('--set-x',-Math.max(0,Math.min(70,g.base-dx))+'px')});
function endSet(e,cancel=false){const g=setGesture;if(!g||g.id!==e.pointerId)return;setGesture=null;if(!g.drag)return;delete g.w.dataset.dragging;g.w.style.removeProperty('--set-x');if(!cancel&&g.base-(e.clientX-g.x)>35){g.w.dataset.revealed='true';g.w.querySelector('.set-delete').hidden=false}else closeSets();setSuppress=Date.now()+400;try{setRoot.releasePointerCapture(e.pointerId)}catch{}}
setRoot.addEventListener('pointerup',e=>endSet(e));setRoot.addEventListener('pointercancel',e=>endSet(e,true));
const undoBar=document.createElement('div');undoBar.className='set-undo';undoBar.hidden=true;undoBar.innerHTML='<span>Set deleted</span><button type="button">Undo</button>';setRoot.after(undoBar);
undoBar.querySelector('button').onclick=()=>{if(!undoSet||session?.id!==undoSet.sessionId)return;const {exercise,index,set}=undoSet;if(session.exercises.includes(exercise)){exercise.sets.splice(Math.min(index,exercise.sets.length),0,set);persist();renderWorkout()}clearSetUndo()};
setRoot.addEventListener('click',e=>{const b=e.target.closest('[data-set-delete]');if(!b){if(Date.now()<setSuppress){e.preventDefault();e.stopImmediatePropagation()}return}e.preventDefault();e.stopImmediatePropagation();if(!session)return;const [i,j]=b.dataset.setDelete.split(':').map(Number),exercise=session.exercises[i],set=exercise?.sets[j];if(!set)return;if(exercise.sets.length===1){alert('Keep at least one set, or delete the exercise.');return}if(set.done&&!confirm('Delete this completed set and its recorded performance?'))return;exercise.sets.splice(j,1);undoSet=set.done?null:{sessionId:session.id,exercise,index:j,set};undoBar.hidden=!undoSet;persist();renderWorkout()},true);
function remain(){return remainingRest(session)}
function format(ms){const n=Math.max(0,Math.ceil(ms/1000));return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')}
let lastRest=0;function tick(){if(!session){lastRest=0;return}const remaining=remain();if(lastRest>0&&remaining<=0&&session.restEnd>0&&Date.now()>=session.restEnd&&FormPrefs.get('sound')){try{const a=new AudioContext(),o=a.createOscillator(),g=a.createGain();o.frequency.value=660;g.gain.value=.08;o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+.18);o.onended=()=>a.close()}catch{}}lastRest=remaining;const totals=workoutTotals(session.exercises);q('#workout-sets').textContent=totals.completed+' of '+totals.total+' sets';q('#workout-elapsed').textContent=format(Date.now()-session.started);q('#workout-count').textContent=session.exercises.filter(e=>e.sets.length&&e.sets.every(s=>s.done)).length+' of '+session.exercises.length+' exercises';const rail=q('#workout-rest'),total=Math.max(remaining,session.restTotal||remaining);rail.hidden=false;rail.dataset.ready=String(!remaining);rail.style.setProperty('--rest-fill',(total?Math.min(100,remaining/total*100):0)+'%');q('#rest-count').textContent=format(remaining);q('#rest-label').textContent=remaining?(session.restPaused!==null?'Paused':'Rest'):'Ready';q('#rest-total').textContent=remaining?'of '+format(total):'';q('#rest-pause').disabled=!remaining;q('#rest-pause').setAttribute('aria-label',session.restPaused!==null?'Resume rest':'Pause rest');q('#rest-minus').disabled=!remaining;q('#rest-skip').disabled=!remaining}
function restChange(delta){if(!session)return;if(session.restPaused!==null)session.restPaused=Math.max(0,remain()+delta);else session.restEnd=Date.now()+Math.max(0,remain()+delta);session.restTotal=Math.max(remain(),session.restTotal||0);persist();tick()}
q('#rest-minus').onclick=()=>restChange(-15000);q('#rest-plus').onclick=()=>restChange(15000);q('#rest-skip').onclick=()=>{if(!session)return;session.restEnd=0;session.restPaused=null;persist();tick()};q('#rest-pause').onclick=()=>{if(!session)return;if(session.restPaused!==null){session.restEnd=Date.now()+session.restPaused;session.restPaused=null}else session.restPaused=remain();persist();tick()};
q('#workout-finish').onclick=()=>{if(!readable||store.conflicted()||!session||!confirm('Finish and save this demo workout?'))return;const result=store.finish(session,savedHistory,Date.now());if(!result.saved){storageOK=false;q('#workout-storage').textContent='Could not save workout. Try again.';return}savedHistory=result.history;session=result.session;clearSetUndo();storageOK=result.ok;cleanupPending=!result.ok;if(cleanupPending)q('#workout-storage').textContent='Workout saved; reload to retry active-session cleanup.';FormDemo.refresh();workouts()};
document.addEventListener('form-demo-change',syncResume);
document.addEventListener('form-page',e=>{if(e.detail==='Workout'&&!demo())workouts()});
setInterval(tick,250);
if(!storageOK)q('#workout-storage').textContent='Workout storage needs recovery — keep app open';
window.addEventListener('storage',e=>{if((e.key===null||[key,historyKey,routineKey,privateTrainingKey].includes(e.key))&&store.conflicted()){storageOK=false;q('#workout-storage').textContent='Another tab changed workout data — save blocked';q('#routine-note').textContent='Another tab changed workout data — reload before editing'}});
const blocksImport=()=>editing||!!session||!storageOK||!imports.ok||store.conflicted();
window.FormTraining={
  sessionName:()=>session?.name,
  routineName:()=>selected?.name,
  blocksReload:()=>editing||(!storageOK&&!!session),
  blocksImport,
  saveImport:next=>!blocksImport()&&store.write(privateTrainingKey,next),
  recordsForDataset,
};
FormDemo.refresh();

},()=>{const warn=()=>{const note=document.querySelector('#routine-note');if(note)note.textContent='Workout editing is open in another tab. Close that tab and reload.';const start=document.querySelector('#routine-start');if(start)start.disabled=true;const edit=document.querySelector('#routine-edit');if(edit)edit.disabled=true;const resume=document.querySelector('#resume-workout');if(resume)resume.hidden=true};warn();document.addEventListener('form-page',warn);window.FormTraining={sessionName:()=>undefined,blocksReload:()=>false,blocksImport:()=>true}});
