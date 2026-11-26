(function(){
'use strict';
const dialog=document.getElementById('exercise-picker'),q=dialog.querySelector('#exercise-query'),muscle=dialog.querySelector('#exercise-muscle'),equipment=dialog.querySelector('#exercise-equipment'),results=dialog.querySelector('#exercise-results'),status=dialog.querySelector('#exercise-status'),custom=dialog.querySelector('#exercise-custom');
let select=null;
function options(el,values,first){el.add(new Option(first,''));for(const v of values)el.add(new Option(v,v))}
options(muscle,FormExercises.muscles,'All muscles');options(equipment,FormExercises.equipmentTypes,'All equipment');
function refresh(){results.replaceChildren();const matches=FormExercises.search(q.value,muscle.value,equipment.value);status.textContent=matches.length+' exercises';for(const e of matches){const b=document.createElement('button');b.type='button';b.className='workouts-card exercise-choice';const art=document.createElement('span');art.className='form-artwork';const fallback=document.createElement('span');fallback.className='form-artwork-fallback';fallback.textContent='—';art.append(fallback);const copy=document.createElement('span'),name=document.createElement('strong'),meta=document.createElement('small');name.textContent=e.name;meta.textContent=e.muscle+' · '+e.equipment;copy.append(name,meta);b.append(art,copy);FormArtwork.mount(art,e);b.onclick=()=>{const cb=select;dialog.close();cb?.(e)};results.append(b)}}
for(const el of [q,muscle,equipment])el.addEventListener('input',refresh);
dialog.querySelector('#exercise-close').onclick=()=>dialog.close();
dialog.querySelector('#exercise-create').onclick=()=>{try{const e=FormExercises.create(custom.value,muscle.value||'Other',equipment.value||'Other');custom.value='';const cb=select;dialog.close();cb?.(e)}catch(err){status.textContent=err.message}};
dialog.addEventListener('close',()=>{if(!dialog.open)select=null});
window.openFormExercisePicker=cb=>{select=cb;q.value='';muscle.value='';equipment.value='';custom.value='';refresh();dialog.showModal();q.focus()};
})();
