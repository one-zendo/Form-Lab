(()=>{
const dock=document.querySelector('#dock'),lens=dock.querySelector('.dock-lens'),buttons=[...dock.querySelectorAll('button[data-page]')],reduce=matchMedia('(prefers-reduced-motion: reduce)');
let selected=buttons.findIndex(b=>b.getAttribute('aria-pressed')==='true');if(selected<0)selected=0;
let gesture=null,blockedClick=false,frame=0;
const rail=()=>document.body.dataset.nav==='rail';
const rects=()=>buttons.map(b=>({x:b.offsetLeft,y:b.offsetTop,w:b.offsetWidth,h:b.offsetHeight}));
function place(r){lens.style.setProperty('--lens-x',r.x+'px');lens.style.setProperty('--lens-y',r.y+'px');lens.style.setProperty('--lens-w',r.w+'px');lens.style.setProperty('--lens-h',r.h+'px')}
function preview(i){buttons.forEach((b,j)=>b.classList.toggle('lens-preview',i===j))}
function snap(instant=false){if(instant)dock.dataset.lensInstant='true';place(rects()[selected]);preview(selected);if(instant){cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{delete dock.dataset.lensInstant})}}
function select(i){if(i<0||i>=buttons.length)return;selected=i;buttons.forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));snap();document.dispatchEvent(new CustomEvent('form-page',{detail:buttons[i].dataset.page}))}
function cancel(){if(!gesture)return;const id=gesture.id;gesture=null;delete dock.dataset.dragging;if(dock.hasPointerCapture(id))dock.releasePointerCapture(id);snap(true)}
function update(){cancel();const {orientation,hinge,viewportMode}=document.body.dataset;document.body.dataset.nav=hinge==='book'?'rail':hinge==='laptop'?'bottom':orientation==='FP'&&viewportMode==='Safari-sized'?'bottom':['FP','FL1','FL2','UL'].includes(orientation)?'rail':'bottom';snap(true)}
function point(e){const d=dock.getBoundingClientRect();return rail()?e.clientY-d.top+dock.scrollTop:e.clientX-d.left+dock.scrollLeft}
function center(r){return rail()?r.y+r.h/2:r.x+r.w/2}
function follow(e){const rs=rects(),p=point(e),cs=rs.map(center);let i=0;while(i<cs.length-2&&p>cs[i+1])i++;const k=Math.max(0,Math.min(1,(p-cs[i])/(cs[i+1]-cs[i]||1))),a=rs[i],b=rs[i+1];const n=k>.5?i+1:i;gesture.target=n;preview(n);if(!reduce.matches)place(Object.fromEntries(['x','y','w','h'].map(key=>[key,a[key]+(b[key]-a[key])*k])))}
dock.addEventListener('pointerdown',e=>{if(gesture||!e.isPrimary||e.button!==0||dock.dataset.overflow==='true')return;blockedClick=false;gesture={id:e.pointerId,target:selected,start:point(e)};dock.dataset.dragging='true';dock.setPointerCapture(e.pointerId);follow(e);e.preventDefault()});
dock.addEventListener('pointermove',e=>{if(gesture?.id===e.pointerId)follow(e)});
dock.addEventListener('pointerup',e=>{if(gesture?.id!==e.pointerId)return;follow(e);const i=gesture.target;gesture=null;delete dock.dataset.dragging;blockedClick=true;if(dock.hasPointerCapture(e.pointerId))dock.releasePointerCapture(e.pointerId);select(i);e.preventDefault()});
dock.addEventListener('pointercancel',cancel);dock.addEventListener('lostpointercapture',cancel);
dock.addEventListener('click',e=>{if(blockedClick&&e.detail>0){blockedClick=false;return}const button=e.target.closest('button[data-page]');if(button)select(buttons.indexOf(button))});
function layout(){cancel();dock.dataset.overflow=String(rail()?dock.scrollHeight>dock.clientHeight+1:dock.scrollWidth>dock.clientWidth+1);snap(true)}
new MutationObserver(update).observe(document.body,{attributes:true,attributeFilter:['data-orientation','data-hinge','data-viewport-mode']});
if(window.ResizeObserver){const ro=new ResizeObserver(layout);ro.observe(dock);buttons.forEach(b=>ro.observe(b))}
window.addEventListener('resize',layout);window.visualViewport?.addEventListener('resize',layout);update();layout();dock.dataset.lensReady='true';
for(const name of ['gesturestart','gesturechange'])document.addEventListener(name,e=>{if(e.cancelable)e.preventDefault()},{passive:false});
})();