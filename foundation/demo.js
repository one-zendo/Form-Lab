function validPrivateTraining(data) {
  if (!data || !Array.isArray(data.routines) || !data.routines.length || !Array.isArray(data.records)) return false;
  const ids = new Set();
  for (const routine of data.routines) {
    if (!routine || typeof routine.id !== 'string' || !routine.id || ids.has(routine.id) ||
        typeof routine.name !== 'string' || !Array.isArray(routine.exercises) ||
        !routine.exercises.every(exercise => Array.isArray(exercise) && typeof exercise[0] === 'string' &&
          Number.isInteger(exercise[1]) && exercise[1] > 0 && exercise[1] <= 100 && Number.isFinite(exercise[2]))) return false;
    ids.add(routine.id);
  }
  return data.records.every(record => record && typeof record.routine === 'string' &&
    typeof record.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(record.date) &&
    Number.isFinite(Date.parse(record.date + 'T12:00:00')) &&
    Number.isFinite(record.duration) && Number.isFinite(record.volume) &&
    (record.detail == null || (Array.isArray(record.detail) && record.detail.every(exercise =>
      exercise && typeof exercise.name === 'string' && Array.isArray(exercise.sets) &&
      exercise.sets.every(set => set && typeof set === 'object' && !Array.isArray(set))))));
}

const privateTrainingKey = 'form.private.training.v1';
const sampleDatasetId = 'sample';

function datasetPayload({ datasetId, archivedDatasets, ...payload }) {
  return payload;
}

function canonicalJSON(value) {
  if (Array.isArray(value)) return '[' + value.map(canonicalJSON).join(',') + ']';
  if (value && typeof value === 'object') {
    return '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + canonicalJSON(value[key])).join(',') + '}';
  }
  return JSON.stringify(value);
}

function datasetSnapshot(data) {
  const payload = datasetPayload(data);
  const records = payload.records.map(record => ({ record, key: canonicalJSON(record) }));
  records.sort((a, b) => a.record.date.localeCompare(b.record.date) ||
    (a.key < b.key ? -1 : Number(a.key > b.key)));
  return { ...payload, profile: payload.profile || {}, records: records.map(entry => entry.record) };
}

function readPrivateTraining(data) {
  if (data === null) return null;
  if (!validPrivateTraining(data)) throw Error('Invalid saved private training data');
  if (!Object.hasOwn(data, 'datasetId') && !Object.hasOwn(data, 'archivedDatasets')) {
    return { ...data, datasetId: 'private:legacy', archivedDatasets: [] };
  }
  if (!Array.isArray(data.archivedDatasets)) throw Error('Invalid saved dataset archive');
  const ids = new Set();
  for (const entry of [data, ...data.archivedDatasets]) {
    if (!validPrivateTraining(entry) || !/^private:(legacy|[0-9a-f]{32})$/.test(entry.datasetId) || ids.has(entry.datasetId)) {
      throw Error('Invalid saved dataset identity');
    }
    ids.add(entry.datasetId);
  }
  return data;
}

function selectPrivateDataset(current, data) {
  const incoming = datasetSnapshot(data);
  const identity = canonicalJSON(incoming);
  const archive = current ? [...current.archivedDatasets] : [];
  if (current && canonicalJSON(datasetSnapshot(current)) === identity) return current;
  const index = archive.findIndex(entry => canonicalJSON(datasetSnapshot(entry)) === identity);
  let selected;
  if (index >= 0) {
    [selected] = archive.splice(index, 1);
  } else {
    const used = new Set([current?.datasetId, ...archive.map(entry => entry.datasetId)]);
    let datasetId;
    do {
      const bytes = crypto.getRandomValues(new Uint8Array(16));
      datasetId = 'private:' + Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
    } while (used.has(datasetId));
    selected = { ...incoming, datasetId };
  }
  if (current) {
    const { archivedDatasets, ...entry } = current;
    archive.push(entry);
  }
  return { ...selected, archivedDatasets: archive };
}

if(typeof module!=='undefined'&&module.exports)module.exports={validPrivateTraining,readPrivateTraining,selectPrivateDataset};
if(typeof document!=='undefined')
(()=>{const q=s=>document.querySelector(s),key='form.demo-mode.v1';let enabled=false,data=null;let imported=null;try{imported=readPrivateTraining(JSON.parse(localStorage.getItem(privateTrainingKey)||'null'))}catch{}try{enabled=localStorage.getItem(key)==='true'}catch{}const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));function streak(records){const weeks=new Map();for(const r of records){const d=new Date(r.date+'T12:00:00');d.setDate(d.getDate()-((d.getDay()+6)%7));const k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');weeks.set(k,(weeks.get(k)||0)+1)}const now=new Date(),m=new Date(now.getFullYear(),now.getMonth(),now.getDate());m.setDate(m.getDate()-((m.getDay()+6)%7));let n=0;for(let i=0;i<54;i++){const d=new Date(m);d.setDate(m.getDate()-7*i);const k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');if((weeks.get(k)||0)>=(window.FormPrefs?.get('weekly')||3))n++;else break}return n}function render(){data=enabled?(imported||FormDemoData.build()):null;const records=data?(window.FormTraining?.recordsForDataset?.()||data.records):[];q('#home-greeting').textContent='Hello, '+(window.FormPrefs?.get('name')||data?.profile?.displayName||'there')+'.';const dow=new Date().getDay(),id=({1:'push',2:'pull',4:'legs',6:'upper'})[dow]||'core',r=data?.routines.find(x=>imported?x.day===dow:x.id===id);q('#home-workout-name').textContent=r?.name||'Ready to train?';q('#home-workout-focus').textContent=r?.focus||'Choose your workout';q('#home-workout-meta').textContent=r?r.exercises.length+' exercises · '+r.duration+' min':'Your next session starts here';q('#home-streak-current').textContent=data?streak(records)+' week streak':'Current streak';const today=new Date(),start=new Date(today.getFullYear(),today.getMonth(),today.getDate());start.setDate(start.getDate()-((start.getDay()+6)%7));q('#home-days').replaceChildren(...Array.from({length:7},(_,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);const iso=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'),done=!!data&&records.some(x=>x.date===iso),el=document.createElement('span');el.textContent=new Intl.DateTimeFormat(undefined,{weekday:'narrow'}).format(d);el.classList.toggle('is-complete',done);el.classList.toggle('is-today',d.toDateString()===today.toDateString());el.setAttribute('aria-label',new Intl.DateTimeFormat(undefined,{weekday:'long',month:'short',day:'numeric'}).format(d)+(done?', completed workout':', no workout'));return el}));q('#home-streak-footer').textContent=data?records.length+' workouts in the past year':'Your weekly activity';const routines=q('#routine-list'),history=q('#history-list'),progress=q('#progress-summary');if(data){routines.innerHTML=data.routines.map(x=>'<button type="button" class="form-card routine-item routine-open" data-routine="'+esc(x.id)+'"><div><h3>'+esc(x.name)+'</h3><p>'+esc(x.focus)+'</p></div><span>'+x.exercises.length+' exercises</span></button>').join('');history.innerHTML=records.slice(-12).reverse().map(x=>x.localSession?'<article class="form-card history-item">'+esc(x.routine)+' · Demo · '+new Date(x.finished).toLocaleDateString()+' · '+x.sets+' sets</article>':'<article class="form-card history-item"><div><h3>'+esc(x.routine)+'</h3><p>'+new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric',year:'numeric'}).format(new Date(x.date+'T12:00:00'))+' · '+x.duration+' min</p></div><strong>'+x.volume.toLocaleString()+' kg</strong></article>').join('');const vol=records.reduce((s,x)=>s+x.volume,0),hours=Math.round(records.reduce((s,x)=>s+x.duration,0)/60);progress.innerHTML='<div class="page-grid"><article class="form-card"><p>Workouts</p><strong>'+records.length+'</strong></article><article class="form-card"><p>Training time</p><strong>'+hours+' h</strong></article><article class="form-card"><p>Training volume</p><strong>'+Math.round(vol/1000).toLocaleString()+'k kg</strong></article><article class="form-card"><p>Personal records</p><strong>'+records.filter(x=>x.personalRecord).length+'</strong></article></div>'}else{routines.innerHTML='<article class="form-card"><p>No routines yet.</p></article>';history.innerHTML='<article class="form-card"><p>No completed workouts.</p></article>';progress.innerHTML='<article class="form-card"><p>Complete your first workout to begin tracking.</p></article>'}document.body.dataset.demo=String(enabled);document.dispatchEvent(new Event('form-demo-change'))}function set(v){enabled=!!v;try{localStorage.setItem(key,String(enabled))}catch{}q('#demo-mode').checked=enabled;render()}const picker=document.createElement('input');picker.type='file';picker.accept='.json,application/json';picker.hidden=true;const importButton=document.createElement('button');importButton.type='button';importButton.className='form-card';importButton.textContent='Import private Hevy data';const status=document.createElement('p');status.setAttribute('role','status');q('#demo-mode').closest('label')?.after(importButton,picker,status);if(!importButton.isConnected)q('#demo-mode').parentElement.after(importButton,picker,status);importButton.onclick=()=>picker.click();
let importing = false;
picker.onchange = async () => {
  if (importing) return;
  importing = true;
  try {
    const training = window.FormTraining;
    if (training?.blocksImport() !== false) throw Error('Finish your active workout or edits first');
    const file = picker.files[0];
    if (!file) return;
    if (file.size > 20000000) throw Error('File too large');
    const payload = JSON.parse(await file.text());
    if (!validPrivateTraining(payload)) throw Error('Invalid FORM import format');
    if (training.blocksImport()) throw Error('Finish your active workout or edits first');
    const prompt = imported ? 'Switch to this private dataset? The previous dataset will be kept.' :
      'Use this private dataset instead of the sample routines and history?';
    if (!confirm(prompt)) return;
    const next = selectPrivateDataset(imported, payload);
    if (!training.saveImport(next)) throw Error('Could not save private training data. Reload before retrying.');
    imported = next;
    set(true);
    status.textContent = 'Imported ' + payload.routines.length + ' routines and ' + payload.records.length + ' workouts locally.';
  } catch (error) {
    status.textContent = error.message;
  } finally {
    picker.value = '';
    importing = false;
  }
};
q('#demo-mode').addEventListener('change',e=>set(e.target.checked));render();window.FormDemo={isEnabled:()=>enabled,getData:()=>data,datasetId:()=>enabled?(imported?.datasetId||sampleDatasetId):null,isPrivate:()=>enabled&&!!imported,refresh:render}})();
