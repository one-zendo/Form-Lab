'use strict';
const $=id=>document.getElementById(id);
const profiles=[['FP',466,678,'right',84,418,48],['FL1',678,466,'left',84,48,48],['FL2',678,466,'right',84,630,418],['UP',669,951,'top',82],['UL',951,669,'right',84]];
const app=$('app'), dialog=$('diagnostics'), overlay=$('overlay');
const settings=['guides','labels','colors','camera','headline','viewport','content','safe'];
const key='form.diagnostics.v1';
let saved={};try{saved=JSON.parse(localStorage.getItem(key)||'{}')||{}}catch{}
const aliases={camera:'Camera',headline:'Headline',viewport:'Viewport',content:'Content',safe:'Safe areas',labels:'guide-labels'};
for(const id of settings){const old=aliases[id]||id;$(id).checked=saved[old]??true;$(id).addEventListener('change',()=>{saved[old]=$(id).checked;try{localStorage.setItem(key,JSON.stringify(saved))}catch{};schedule()})}
function classify(w,h,angle){const matches=[];for(const p of profiles)for(const safari of [false,true]){const x=p[1]-(safari&&p[3]!=='top'?p[4]:0),y=p[2]-(safari&&p[3]==='top'?p[4]:0);const error=Math.max(Math.abs(w-x),Math.abs(h-y));if(error<=2)matches.push({p,safari,error})}matches.sort((a,b)=>a.error-b.error);if(!matches.length)return {id:'Unknown',mode:'Unmatched'};let m=matches[0];if(m.p[0]==='FL1'||m.p[0]==='FL2'){if(angle!==90&&angle!==270)return {id:'FL1 / FL2',mode:m.safari?'Safari-sized':'Native-sized'};m={...m,p:profiles[angle===90?1:2]}}return {id:m.p[0],mode:m.safari?'Safari-sized':'Native-sized',p:m.p}}
function rect(el){return el.getBoundingClientRect()}
function avoid(el,c,vertical){const r=rect(el);if(!c||r.right<=c.left||r.left>=c.right||r.bottom<=c.top||r.top>=c.bottom)return;const a=vertical?r.top:r.left,b=vertical?r.bottom:r.right,l=Math.max(a,vertical?c.top:c.left),u=Math.min(b,vertical?c.bottom:c.right);if(l-a>=b-u)el.style[vertical?'paddingBottom':'paddingRight']=(b-l)+'px';else el.style[vertical?'paddingTop':'paddingLeft']=(u-a)+'px'}
let pending=false, committed=null, candidateKey='', candidateSince=0, settleTimer=0, layoutKey='';
const guideNodes=new Map();
function schedule(){if(!pending){pending=true;requestAnimationFrame(render)}}
function render(){pending=false;const angle=screen.orientation?.angle??(typeof window.orientation==='number'?(window.orientation+360)%360:null);const observed=classify(innerWidth,innerHeight,angle);
const nextKey=observed.id+'|'+observed.mode;
if(nextKey!==candidateKey){candidateKey=nextKey;candidateSince=performance.now()}
clearTimeout(settleTimer);
const settling=!!committed && nextKey!==committed.id+'|'+committed.mode && performance.now()-candidateSince<120;
if(settling){settleTimer=setTimeout(schedule,125);overlay.style.visibility='hidden'}else{committed=observed;overlay.style.visibility=''}
const state=committed||observed,p=state.p;const rail=state.id.startsWith('FL')||(state.id==='FP'&&state.mode==='Native-sized');app.classList.toggle('rail',rail);app.classList.toggle('colors',$('colors').checked);$('timer').hidden=!$('timer-toggle').checked;
let camera=null;if(p&&p.length===7){const x=p[5]-(state.mode==='Safari-sized'&&p[3]==='left'?p[4]:0),y=p[6];camera={left:x-22.5,right:x+22.5,top:y-22.5,bottom:y+22.5}}
const nextLayoutKey=[state.id,state.mode,innerWidth,innerHeight,$('timer').hidden].join('|');
if(!settling&&nextLayoutKey!==layoutKey){layoutKey=nextLayoutKey;for(const el of [$('heading'),$('tagline'),$('main'),$('nav')]){el.style.padding='';if(!el.hidden)avoid(el,camera,el.id==='nav'&&rail)}}
if(settling)return;
overlay.hidden=!$('guides').checked;
if(!$('guides').checked&&!dialog.open)return;
const r=rect(app),v=visualViewport,css=getComputedStyle(app),probe=rect($('probe'));const size=r=>Math.round(r.width*10)/10+' × '+Math.round(r.height*10)/10;
$('readout').textContent=[state.id+' · '+state.mode,'Reference: '+(p?p[1]+' × '+p[2]+' pt':'unresolved'),'Layout viewport: '+innerWidth+' × '+innerHeight,'Visual viewport: '+(v?size(v)+'; offset '+v.offsetLeft+', '+v.offsetTop+'; scale '+v.scale:'unavailable'),'CSS probe: '+size(probe),'Rendered shell: '+size(r),'Padding incl. safe areas: '+[css.paddingTop,css.paddingRight,css.paddingBottom,css.paddingLeft].join(' / '),'Cards: '+[...document.querySelectorAll('.card')].map(sizeEl=>size(rect(sizeEl))).join(' / '),'Timer: '+($('timer').hidden?'hidden':size(rect($('timer')))),'Navigation: '+(rail?'right':'bottom')+' '+size(rect($('nav'))),'Rotation: '+angle,'Camera: '+(camera?JSON.stringify(camera):'unresolved')].join('\n');
if(!$('guides').checked)return;
let guideIndex=0;
function guide(r,color,label){const index=guideIndex++;let d=guideNodes.get(index);if(!d){d=document.createElement('div');d.className='guide';d.append(document.createElement('span'));guideNodes.set(index,d);overlay.append(d)}Object.assign(d.style,{left:r.left+'px',top:r.top+'px',width:Math.max(0,r.right-r.left)+'px',height:Math.max(0,r.bottom-r.top)+'px'});d.style.setProperty('--guide',color);d.firstChild.hidden=!$('labels').checked;if(d.firstChild.textContent!==label)d.firstChild.textContent=label;d.hidden=false}
if($('viewport').checked)guide(r,'#3478f6','Viewport '+size(r));if($('headline').checked)guide(rect($('heading')),'#8052c9','Headline');if($('content').checked)for(const el of [...document.querySelectorAll('.card'),$('timer'),$('nav')])if(!el.hidden){const b=rect(el),clip=el.classList.contains('card')?rect($('cards')):r;guide({left:Math.max(b.left,clip.left),top:Math.max(b.top,clip.top),right:Math.min(b.right,clip.right),bottom:Math.min(b.bottom,clip.bottom)},'#16834a',el.id||'Card')}
if(camera&&$('camera').checked)guide(camera,'#d97706','Camera clearance');if($('safe').checked){const [t,rr,b,l]=[css.paddingTop,css.paddingRight,css.paddingBottom,css.paddingLeft].map(x=>Math.max(0,parseFloat(x)-16));for(const q of [{left:0,top:0,right:r.width,bottom:t},{left:r.width-rr,top:0,right:r.width,bottom:r.height},{left:0,top:r.height-b,right:r.width,bottom:r.height},{left:0,top:0,right:l,bottom:r.height}])if(q.right>q.left&&q.bottom>q.top)guide(q,'#888','Safe area')}
for(const [index,node] of guideNodes)if(index>=guideIndex)node.hidden=true;
let indicator=$('indicator');if(!indicator){indicator=document.createElement('div');indicator.id='indicator';overlay.append(indicator)}const message=state.id+' · '+state.mode+' · '+size(r);if(indicator.textContent!==message)indicator.textContent=message}
$('open').onclick=()=>{dialog.showModal();schedule()};$('timer-toggle').onchange=schedule;for(const e of ['resize','orientationchange','pageshow'])window.addEventListener(e,schedule);window.visualViewport?.addEventListener('resize',schedule);window.visualViewport?.addEventListener('scroll',schedule);screen.orientation?.addEventListener?.('change',schedule);document.addEventListener('visibilitychange',schedule);$('cards').addEventListener('scroll',schedule);if(window.ResizeObserver){const ro=new ResizeObserver(schedule);ro.observe(app);ro.observe($('probe'))}schedule();