(()=>{
const dock=document.querySelector('#dock'),lens=dock.querySelector('.dock-lens'),buttons=[...dock.querySelectorAll('button[data-page]')],reduce=matchMedia('(prefers-reduced-motion: reduce)');
let selected=Math.max(0,buttons.findIndex(b=>b.getAttribute('aria-pressed')==='true'));
let gesture=null,blockedClick=false,frame=0,dragFrame=0,pendingPoint=null,position=selected,lastGeometry='';
const rail=()=>document.body.dataset.nav==='rail';
const rects=()=>buttons.map(b=>({x:b.offsetLeft,y:b.offsetTop,w:b.offsetWidth,h:b.offsetHeight}));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function place(r){for(const [key,value] of Object.entries(r))lens.style.setProperty('--lens-'+key,value+'px')}
function preview(p){buttons.forEach((b,j)=>{b.classList.toggle('lens-preview',Math.round(p)===j);b.style.setProperty('--lens-weight',Math.max(0,1-Math.abs(p-j))*100+'%')})}
function render(p,rs=rects()){position=clamp(p,0,rs.length-1);const i=Math.min(rs.length-2,Math.floor(position)),k=position-i,a=rs[i],b=rs[i+1];place(Object.fromEntries(['x','y','w','h'].map(key=>[key,a[key]+(b[key]-a[key])*k])));preview(position)}
function stop(){cancelAnimationFrame(frame);frame=0;cancelAnimationFrame(dragFrame);dragFrame=0}
function snap(instant=false,velocity=0){stop();if(instant||reduce.matches){render(selected);return}let v=clamp(velocity,-12,12),last=null,elapsed=0;function spring(now){const dt=last===null?1/60:Math.min(.032,(now-last)/1000);last=now;elapsed+=dt;const target=selected;v+=(230*(target-position)-28*v)*dt;render(position+v*dt);if((Math.abs(target-position)<.002&&Math.abs(v)<.02)||elapsed>.75){render(target);frame=0;return}frame=requestAnimationFrame(spring)}frame=requestAnimationFrame(spring)}
function select(i,velocity=0){if(i<0||i>=buttons.length)return;selected=i;buttons.forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));snap(false,velocity);document.dispatchEvent(new CustomEvent('form-page',{detail:buttons[i].dataset.page}))}
document.addEventListener('form-page',e=>{const i=buttons.findIndex(b=>b.dataset.page===(e.detail==='Diagnostics'?'Profile':e.detail));if(i>=0&&i!==selected){selected=i;buttons.forEach((b,j)=>b.setAttribute('aria-pressed',String(j===selected)));snap()}});
function cancel(e,instant=false){if(!gesture||e&&gesture.id!==e.pointerId)return;const id=gesture.id;gesture=null;stop();delete dock.dataset.dragging;if(dock.hasPointerCapture(id))dock.releasePointerCapture(id);snap(instant)}
function update(){cancel(null,true);const {orientation,hinge,viewportMode}=document.body.dataset;document.body.dataset.nav=hinge==='book'?'rail':hinge==='laptop'?'bottom':orientation==='FP'&&viewportMode==='Safari-sized'?'bottom':['FP','FL1','FL2','FL1 / FL2','UL'].includes(orientation)?'rail':'bottom';lastGeometry='';layout()}
function point(e){const d=dock.getBoundingClientRect();return rail()?e.clientY-d.top-dock.clientTop+dock.scrollTop:e.clientX-d.left-dock.clientLeft+dock.scrollLeft}
function center(r){return rail()?r.y+r.h/2:r.x+r.w/2}
function indexAt(p,rs){const cs=rs.map(center);let i=0;while(i<cs.length-2&&p>cs[i+1])i++;return i+clamp((p-cs[i])/(cs[i+1]-cs[i]||1),0,1)}
function followPoint(p,time){if(!gesture)return;const g=gesture;if(!g.moved&&Math.abs(p-g.start)<4)return;g.moved=true;const next=clamp(g.origin+indexAt(p,g.rects)-g.startIndex,0,buttons.length-1);const dt=time-g.time;if(dt>0){const raw=(next-g.last)*1000/dt;g.velocity=dt>100?0:.65*g.velocity+.35*raw}g.last=next;g.time=time;render(next,g.rects)}
function follow(e){pendingPoint={p:point(e),time:e.timeStamp};if(!dragFrame)dragFrame=requestAnimationFrame(()=>{dragFrame=0;if(gesture)followPoint(pendingPoint.p,pendingPoint.time)})}
dock.addEventListener('pointerdown',e=>{if(gesture||!e.isPrimary||e.button!==0||dock.dataset.overflow==='true')return;stop();blockedClick=false;const rs=rects(),p=point(e);gesture={id:e.pointerId,rects:rs,start:p,startIndex:indexAt(p,rs),origin:position,last:position,time:e.timeStamp,velocity:0,moved:false,tap:buttons.indexOf(e.target.closest('button[data-page]'))};dock.dataset.dragging='true';dock.setPointerCapture(e.pointerId);e.preventDefault()});
dock.addEventListener('pointermove',e=>{if(gesture?.id===e.pointerId)follow(e)});
dock.addEventListener('pointerup',e=>{if(gesture?.id!==e.pointerId)return;cancelAnimationFrame(dragFrame);dragFrame=0;followPoint(point(e),e.timeStamp);const g=gesture,v=e.timeStamp-g.time>100?0:g.velocity,i=g.moved?Math.round(clamp(position+clamp(v*.07,-.35,.35),0,buttons.length-1)):g.tap>=0?g.tap:Math.round(indexAt(point(e),g.rects));gesture=null;delete dock.dataset.dragging;blockedClick=true;if(dock.hasPointerCapture(e.pointerId))dock.releasePointerCapture(e.pointerId);select(i,v);e.preventDefault()});
dock.addEventListener('pointercancel',e=>cancel(e));dock.addEventListener('lostpointercapture',e=>cancel(e));
dock.addEventListener('click',e=>{if(blockedClick&&e.detail>0){blockedClick=false;return}const button=e.target.closest('button[data-page]');if(button)select(buttons.indexOf(button))});
function layout(){const rs=rects(),key=JSON.stringify([rail(),rs]);dock.dataset.overflow=String(rail()?dock.scrollHeight>dock.clientHeight+1:dock.scrollWidth>dock.clientWidth+1);if(key===lastGeometry)return;lastGeometry=key;cancel(null,true);snap(true)}
new MutationObserver(update).observe(document.body,{attributes:true,attributeFilter:['data-orientation','data-hinge','data-viewport-mode']});
if(window.ResizeObserver){const ro=new ResizeObserver(layout);ro.observe(dock);buttons.forEach(b=>ro.observe(b))}
window.addEventListener('resize',layout);window.visualViewport?.addEventListener('resize',layout);reduce.addEventListener?.('change',()=>{cancel(null,true);snap(true)});update();layout();dock.dataset.lensReady='true';
for(const name of ['gesturestart','gesturechange'])document.addEventListener(name,e=>{if(e.cancelable)e.preventDefault()},{passive:false});
})();