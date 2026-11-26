/* FORM artwork: empty by default; no vendor assets or network requests. */
(function(root){
'use strict';
const catalog=new Map();
let baseURL=null;
function configure(entries,assetBase){
 const url=new URL(assetBase,document.baseURI);
 if(url.protocol!=='https:'&&!(url.protocol==='http:'&&url.origin===location.origin))throw Error('Invalid artwork base');
 if(!url.pathname.endsWith('/')||url.search||url.hash)throw Error('Artwork base must be a directory');
 const next=new Map();
 for(const e of entries){
  if(typeof e.exerciseId!=='string'||!e.exerciseId||next.has(e.exerciseId))throw Error('Invalid exercise ID');
  const variants={};
  for(const character of ['male','female']){
   if(!e[character])continue;
   const v={};
   for(const pose of ['start','peak','animation']){
    const path=e[character][pose];
    if(path==null)continue;
    if(typeof path!=='string'||! /^(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_.-]+\.(?:webp|png|jpg|jpeg)$/i.test(path)||path.split('/').some(p=>p==='..'))throw Error('Invalid artwork path');
    v[pose]=path;
   }
   variants[character]=v;
  }
  next.set(e.exerciseId,variants);
 }
 catalog.clear();for(const [id,v] of next)catalog.set(id,v);baseURL=url;
}
function resolve(id,{character='male',pose='start',reducedMotion=false}={}){
 const entry=catalog.get(id);if(!entry||!baseURL)return null;
 const v=entry[character]||entry.male;if(!v)return null;
 const path=(pose==='animation'&&!reducedMotion?v.animation:pose==='peak'?v.peak:null)||v.start||v.peak;
 return path?new URL(path,baseURL).href:null;
}
function mount(container,exercise,options={}){
 const fallback=container.querySelector('.form-artwork-fallback');
 if(!fallback)return;
 const previous=container.querySelector('img');if(previous)previous.remove();
 fallback.hidden=false;
 const src=resolve(exercise.exerciseId,{...options,reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches});
 if(!src)return;
 const img=document.createElement('img');img.alt='';img.loading='lazy';img.decoding='async';img.hidden=true;
 img.addEventListener('load',()=>{img.hidden=false;fallback.hidden=true},{once:true});
 img.addEventListener('error',()=>{img.remove();fallback.hidden=false},{once:true});
 container.append(img);img.src=src;
}
 root.FormArtwork=Object.freeze({configure,resolve,mount});
})(globalThis);
