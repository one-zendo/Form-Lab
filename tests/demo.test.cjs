const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');const source=fs.readFileSync('foundation/demo-data.js','utf8');const context={window:{},Date};vm.runInNewContext(source,context);const data=context.window.FormDemoData.build(new Date(2026,10,26));test('demo dataset contains a rolling year of completed training',()=>{assert.equal(data.records.length,209);assert.equal(new Set(data.records.map(x=>x.date)).size,data.records.length);assert.ok(data.records.every(x=>x.completed));const start=new Date(2025,10,27),end=new Date(2026,10,27);for(const r of data.records){const d=new Date(r.date+'T12:00:00');assert.ok(d>=start&&d<end)}});test('demo routines have exercise prescriptions',()=>{assert.equal(data.routines.length,6);for(const r of data.routines){assert.ok(r.exercises.length>=4);for(const e of r.exercises){assert.equal(typeof e[0],'string');assert.ok(e[1]>0&&e[2]>0)}}});test('demo records reference known routines and remain isolated',()=>{const ids=new Set(data.routines.map(r=>r.id));assert.ok(data.records.every(r=>ids.has(r.routineId)));assert.ok(data.records.every(r=>r.id.startsWith('demo-')));assert.ok(!('localStorage' in context))});
const { validPrivateTraining } = require('../foundation/demo.js');

test('private training imports accept legacy summaries and optional workout details', () => {
  const routine = { id: 'private', name: 'Private routine', exercises: [['Squat', 3, 8]] };
  const record = { routine: 'private', date: '2026-11-26', duration: 30, volume: 72 };
  assert.equal(validPrivateTraining({ routines: [routine], records: [record] }), true);
  const detail = [{ name: 'Squat', sets: [{ done: true, weight: 3, reps: 8 }] }];
  assert.equal(validPrivateTraining({ routines: [routine], records: [{ ...record, detail }] }), true);
});

test('private training validation rejects repeated routine IDs and malformed nested records', () => {
  const routine = { id: 'private', name: 'Private routine', exercises: [['Squat', 3, 8]] };
  const record = { routine: 'private', date: '2026-11-26', duration: 30, volume: 72 };
  assert.equal(validPrivateTraining({ routines: [routine, routine], records: [] }), false);
  assert.equal(validPrivateTraining({ routines: [null], records: [] }), false);
  assert.equal(validPrivateTraining({ routines: [routine], records: [null] }), false);
  assert.equal(validPrivateTraining({ routines: [routine], records: [{ ...record, detail: [{ name: 'Squat', sets: [null] }] }] }), false);
});
