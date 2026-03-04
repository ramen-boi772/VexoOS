self.addEventListener("install",e=>{
  e.waitUntil(
    caches.open("vexo-cache").then(cache=>{
      return cache.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./core.js"
      ]);
    })
  );
});

self.addEventListener("fetch",e=>{
  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request))
  );
});
