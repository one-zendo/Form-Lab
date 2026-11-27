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

const { readPrivateTraining, selectPrivateDataset } = require('../foundation/demo.js');

test('dataset selection archives prior data and reuses identity for equivalent reordered records', () => {
  const first = {
    routines: [{ id: 'same', name: 'First', exercises: [['Row', 1, 8]] }],
    records: [
      { routine: 'same', date: '2026-11-26', duration: 15, volume: 80 },
      { routine: 'same', date: '2026-11-26', duration: 15, volume: 90 },
    ],
  };
  const second = { routines: [{ ...first.routines[0], name: 'Second' }], records: [] };
  const a = selectPrivateDataset(null, first);
  const b = selectPrivateDataset(a, second);
  assert.notEqual(a.datasetId, b.datasetId);
  assert.equal(b.archivedDatasets[0].datasetId, a.datasetId);
  const reimported = selectPrivateDataset(readPrivateTraining(JSON.parse(JSON.stringify(b))), {
    ...first, records: [...first.records].reverse(),
  });
  assert.equal(reimported.datasetId, a.datasetId);
  assert.deepEqual(reimported.records, first.records);
  assert.equal(reimported.archivedDatasets[0].datasetId, b.datasetId);
  assert.equal(selectPrivateDataset(reimported, first), reimported);
});

test('legacy snapshots keep their original payload and duplicate persisted identities are rejected', () => {
  const payload = { routines: [{ id: 'old', name: 'Old', exercises: [] }], records: [], extra: 'retained' };
  const legacy = readPrivateTraining(payload);
  assert.equal(legacy.datasetId, 'private:legacy');
  assert.equal(legacy.extra, payload.extra);
  assert.deepEqual(legacy.routines, payload.routines);
  assert.equal(Object.hasOwn(payload, 'datasetId'), false);
  assert.throws(() => readPrivateTraining({ ...legacy, archivedDatasets: [legacy] }), /identity/);
});

test('a new registry cannot reuse the identity of an older dataset with surviving workout data', () => {
  const payload = { routines: [{ id: 'same', name: 'One', exercises: [] }], records: [] };
  const older = selectPrivateDataset(null, payload);
  const afterRegistryLoss = selectPrivateDataset(null, {
    ...payload, routines: [{ ...payload.routines[0], name: 'Two' }],
  });
  assert.notEqual(afterRegistryLoss.datasetId, older.datasetId);
});
