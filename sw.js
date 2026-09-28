// Keeps NicheNotes working offline (handy for demos on bad Wi-Fi).
// Pages: network first, so updates arrive as soon as there's a connection.
// Built files: cache first, since their names change whenever their contents do.
const CACHE = 'nichenotes-v2'

// The built script and stylesheet have hashed names, so read them out of the page itself.
// That way the very first visit is enough to work offline.
async function precache() {
  const cache = await caches.open(CACHE)
  const page = await fetch('./', { cache: 'no-cache' })
  const html = await page.clone().text()
  const assets = [...html.matchAll(/(?:src|href)="(\.\/assets\/[^"]+)"/g)].map((m) => m[1])
  await cache.put('./', page)
  await cache.addAll(['./manifest.webmanifest', './icon.svg', './icons/apple-touch-icon.png', ...assets])
}

self.addEventListener('install', (event) => {
  event.waitUntil(precache())
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put('./', copy))
          return res
        })
        .catch(() => caches.match('./')),
    )
    return
  }

  event.respondWith(
    caches.match(req).then(
      (hit) =>
        hit ||
        fetch(req).then((res) => {
          if (res.ok) {
            const copy = res.clone()
            caches.open(CACHE).then((c) => c.put(req, copy))
          }
          return res
        }),
    ),
  )
})
