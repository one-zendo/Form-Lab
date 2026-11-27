const test=require('node:test'),assert=require('node:assert/strict');global.window=global;require('../foundation/geometry.js');const {detect,geometryFor}=require('../foundation/orientation.js');for(const [id,g] of Object.entries(FormDuoGeometry)){test(id,()=>{for(const safari of [false,true]){const w=g.w-(safari&&g.side!=='top'?g.excluded:0),h=g.h-(safari&&g.side==='top'?g.excluded:0);assert.equal(detect(FormDuoGeometry,w,h).id,id.startsWith('FL')?'FL1 / FL2':id)}})}test('unknown',()=>assert.equal(detect(FormDuoGeometry,390,844).id,'Unknown'));
test('folded landscape rotation calibration',()=>{for(const w of [678,594]){assert.equal(detect(FormDuoGeometry,w,466,90).id,'FL1');assert.equal(detect(FormDuoGeometry,w,466,270).id,'FL2');assert.equal(detect(FormDuoGeometry,w,466,undefined).id,'FL1 / FL2')}});

const {resolve}=require('../foundation/layout.js');
test('calibration anchors match hardware reference',()=>{
  for(const [id,g] of Object.entries(FormDuoGeometry)){
    for(const mode of ['Native-sized','Safari-sized']){
      const a=resolve(g,id,mode);
      assert.equal(a.verified,true);
      assert.equal(a.headline,g.headline);
      assert.equal(a.content,id==='FL1'&&mode==='Safari-sized'?84:g.content);
      assert.equal(a.center,id==='UP'&&mode==='Safari-sized'?130:48);
      assert.equal(a.contentCenter,48);
    }
  }
});
test('FL1 Safari exclusion applies to content anchor, not headline anchor',()=>{
  const a=resolve(FormDuoGeometry.FL1,'FL1','Safari-sized');
  assert.equal(a.headline,84);
  assert.equal(a.content,84);
});
test('UP Safari headline center includes top exclusion',()=>{
  const a=resolve(FormDuoGeometry.UP,'UP','Safari-sized');
  assert.equal(a.center,130);
  assert.equal(a.contentCenter,48);
});
test('unmatched viewport uses safe generic fallback and is unverified',()=>{
  const a=resolve(FormDuoGeometry.FP,'FP','Unmatched');
  assert.deepEqual(a,{headline:16,content:16,center:48,contentCenter:48,landscape:false,verified:false});
});

test('ambiguous folded landscape retains shared landscape geometry without side-specific camera claims',()=>{const g=geometryFor(FormDuoGeometry,'FL1 / FL2');assert.deepEqual([g.w,g.h,g.side,g.excluded,g.headline,g.content],[678,466,null,84,84,84]);const a=resolve(g,'FL1 / FL2','Safari-sized');assert.equal(a.landscape,true);assert.equal(a.headline,84);assert.equal(a.content,84);assert.equal(a.verified,true)});
test('unresolved orientations do not borrow a folded landscape geometry',()=>{assert.equal(geometryFor(FormDuoGeometry,'Unknown'),null)});
