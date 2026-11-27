/* Resolve headline and content anchors independently from viewport exclusions.
 * Calibrated targets come from docs/DUO-HARDWARE-STANDARD.md. */
(function(root){
  function resolve(g,id,mode){
    if(!g||mode==='Unmatched')return {headline:16,content:16,center:48,contentCenter:48,landscape:false,matched:false};
    const safari=mode==='Safari-sized';
    const headline=g.headline;
    const content=safari&&id==='FL1'?84:g.content;
    const center=id==='UP'&&safari?130:48;
    return {headline,content,center,contentCenter:48,landscape:g.w>g.h,matched:true};
  }
  function apply(g,id,mode){
    const a=resolve(g,id,mode),el=document.querySelector('#calibration');
    for(const [k,v] of Object.entries({headline:a.headline,content:a.content,center:a.center,'content-center':a.contentCenter}))
      el.style.setProperty('--layout-'+k,v+'px');
    el.dataset.landscape=String(a.landscape);
    el.dataset.guides=String(document.querySelector('#guides').checked);
    document.querySelector('#layout-status').textContent=(a.matched?'Matched reference calibration target':'Unmatched viewport: generic fallback')+' · '+mode+' · headline X '+a.headline+' / content X '+a.content+' / headline center Y '+a.center+' px';
  }
  root.FormLayout={resolve,apply};
  if(typeof module!=='undefined')module.exports={resolve};
})(typeof window==='undefined'?globalThis:window);