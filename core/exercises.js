(function(root){
'use strict';
const rows=[
['bench-press','Barbell Bench Press','Chest','Barbell'],['incline-bench','Incline Dumbbell Press','Chest','Dumbbell'],['push-up','Push-Up','Chest','Bodyweight'],['cable-fly','Cable Fly','Chest','Cable'],['chest-press','Machine Chest Press','Chest','Machine'],
['squat','Barbell Back Squat','Quadriceps','Barbell'],['front-squat','Front Squat','Quadriceps','Barbell'],['leg-press','Leg Press','Quadriceps','Machine'],['leg-extension','Leg Extension','Quadriceps','Machine'],['goblet-squat','Goblet Squat','Quadriceps','Dumbbell'],['split-squat','Bulgarian Split Squat','Quadriceps','Dumbbell'],
['rdl','Romanian Deadlift','Hamstrings','Barbell'],['leg-curl','Seated Leg Curl','Hamstrings','Machine'],['deadlift','Deadlift','Glutes','Barbell'],['hip-thrust','Hip Thrust','Glutes','Barbell'],['glute-bridge','Glute Bridge','Glutes','Bodyweight'],
['pull-up','Pull-Up','Back','Bodyweight'],['lat-pulldown','Lat Pulldown','Back','Cable'],['barbell-row','Barbell Row','Back','Barbell'],['db-row','Dumbbell Row','Back','Dumbbell'],['seated-row','Seated Cable Row','Back','Cable'],
['overhead-press','Overhead Press','Shoulders','Barbell'],['lateral-raise','Lateral Raise','Shoulders','Dumbbell'],['rear-delt-fly','Rear Delt Fly','Shoulders','Dumbbell'],['face-pull','Face Pull','Shoulders','Cable'],
['db-curl','Dumbbell Curl','Biceps','Dumbbell'],['hammer-curl','Hammer Curl','Biceps','Dumbbell'],['barbell-curl','Barbell Curl','Biceps','Barbell'],['pushdown','Triceps Pushdown','Triceps','Cable'],['overhead-extension','Overhead Triceps Extension','Triceps','Dumbbell'],['dip','Dip','Triceps','Bodyweight'],
['calf-raise','Standing Calf Raise','Calves','Machine'],['seated-calf','Seated Calf Raise','Calves','Machine'],['plank','Plank','Core','Bodyweight'],['crunch','Crunch','Core','Bodyweight'],['cable-crunch','Cable Crunch','Core','Cable']
];
const key='form.lab.custom-exercises.v1';
const built=rows.map(([id,name,muscle,equipment])=>Object.freeze({exerciseId:'form-'+id,name,muscle,equipment}));
let custom=[],blocked=false;
try{const raw=localStorage.getItem(key);if(raw){const data=JSON.parse(raw);if(!Array.isArray(data)||data.some(e=>!e||!['exerciseId','name','muscle','equipment'].every(k=>typeof e[k]==='string')||!e.exerciseId.startsWith('custom-'))||new Set(data.map(e=>e.exerciseId)).size!==data.length)throw Error('Invalid catalog');custom=data}}catch{blocked=true}
let demoCustom=[];const all=()=>[...built,...(root.formDemoMode?demoCustom:custom)].map(e=>({...e}));
function create(name,muscle,equipment){name=name.trim();if(!name||blocked)throw Error(blocked?'Custom exercise storage unavailable':'Enter a name');if(!muscles.includes(muscle)||!equipmentTypes.includes(equipment))throw Error('Invalid category');const e={exerciseId:'custom-'+crypto.randomUUID(),name,muscle,equipment};if(root.formDemoMode){demoCustom.push(e)}else{localStorage.setItem(key,JSON.stringify([...custom,e]));custom.push(e)}return {...e}}
const muscles=[...new Set(built.map(e=>e.muscle)),'Other'].sort();
const equipmentTypes=[...new Set(built.map(e=>e.equipment)),'Other'].sort();
function search(query='',muscle='',equipment=''){const q=query.trim().toLowerCase();return all().filter(e=>(!muscle||e.muscle===muscle)&&(!equipment||e.equipment===equipment)&&[e.name,e.muscle,e.equipment].some(v=>v.toLowerCase().includes(q))).sort((a,b)=>a.name.localeCompare(b.name))}
root.FormExercises=Object.freeze({all,search,create,muscles:Object.freeze(muscles),equipmentTypes:Object.freeze(equipmentTypes)});
})(globalThis);
