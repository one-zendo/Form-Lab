/* Continuous corner fallback. Geometry is a cubic approximation, not native iOS. */
(function(){
'use strict';
function curve(w,h,r,i=0){
w-=2*i;h-=2*i;
if(!(w>0&&h>0&&r>i))return '';
r=Math.min((r-i)*1.25,w/2,h/2);
const k=r*.48,p=(x,y)=>[+(x+i).toFixed(3),+(y+i).toFixed(3)].join(' ');
return 'M '+p(r,0)+' L '+p(w-r,0)+' C '+p(w-k,0)+' '+p(w,k)+' '+p(w,r)+' L '+p(w,h-r)+' C '+p(w,h-k)+' '+p(w-k,h)+' '+p(w-r,h)+' L '+p(r,h)+' C '+p(k,h)+' '+p(0,h-k)+' '+p(0,h-r)+' L '+p(0,r)+' C '+p(0,k)+' '+p(k,0)+' '+p(r,0)+' Z';
}
if(typeof module==='object'&&module.exports){module.exports={curve};return;}
if(!window.CSS||CSS.supports('corner-shape','squircle')||!CSS.supports('clip-path','path("M 0 0 L 1 0 L 1 1 Z")')||!window.ResizeObserver)return;
const selector='article,.settings-group,.set,dialog,button,input:not([type=checkbox]):not([type=radio]),textarea,.theme-swatch,#theme-options label';
const excluded='#timer,#timer *,nav,nav *,#week-days *, .progress-segments *, .routine-headline>button';
const watched=new Set();let frame=0;
function paint(el){
el.removeAttribute('data-continuous-corner');
const s=getComputedStyle(el),w=el.offsetWidth,h=el.offsetHeight,r=parseFloat(s.borderTopLeftRadius);
if(!w||!h||!r||r>=999||[s.borderTopLeftRadius,s.borderTopRightRadius,s.borderBottomLeftRadius,s.borderBottomRightRadius].some(v=>v!==s.borderTopLeftRadius||v.includes('%'))||s.backgroundImage!=='none'||el.matches('#theme-options label:not(:has(input:checked))'))return;
const d=curve(w,h,r);if(!d)return;
el.style.setProperty('--continuous-path','path("'+d+'")');
const sw=parseFloat(s.borderTopWidth),uniform=['Right','Bottom','Left'].every(side=>s['border'+side+'Width']===s.borderTopWidth&&s['border'+side+'Color']===s.borderTopColor);
if(sw>0&&uniform){
const outline=curve(w,h,r,sw/2),color=s.borderTopColor.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+w+' '+h+'"><path d="'+outline+'" fill="none" stroke="'+color+'" stroke-width="'+sw+'"/></svg>';
el.style.setProperty('--continuous-outline','url("data:image/svg+xml,'+encodeURIComponent(svg)+'")');
el.setAttribute('data-continuous-corner','outlined');
}else if(!sw&&['Right','Bottom','Left'].every(side=>parseFloat(s['border'+side+'Width'])===0)){el.setAttribute('data-continuous-corner','plain');}
}
function flush(){frame=0;for(const el of watched)if(!el.isConnected){resize.unobserve(el);watched.delete(el);}for(const el of document.querySelectorAll(selector))if(!el.matches(excluded)){if(!watched.has(el)){watched.add(el);resize.observe(el);}paint(el);}}
function queue(){if(!frame)frame=requestAnimationFrame(flush);}
const resize=new ResizeObserver(queue);
new MutationObserver(queue).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['data-theme','hidden','open','checked']});
document.addEventListener('change',queue);queue();
})();
