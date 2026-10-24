const CACHE='arbaa-revaim-v11';
const ASSETS=['./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('arbaa-revaim-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET')return;
 if(req.mode==='navigate'||req.destination==='document'){
  event.respondWith(fetch(new Request(req,{cache:'no-store'})).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put('./index.html',copy)))}return response}).catch(()=>caches.match('./index.html').then(saved=>saved||Response.error())));
  return;
 }
 event.respondWith(fetch(req).catch(()=>caches.match(req)));
});