const CACHE_NAME = 'OMNIA-App-v4.2'; // Version hochzählen bei jedem Update

const ASSETS_TO_CACHE = [
  'index.html',
  'index_praxis.html',
  'index_flying.html',
  'index_flying_wait.html',
  'manifest.json',
  'icon.png',
  'app-style.css',
  'app-core.js',
  // Assessment-Dateien
  '30s_assissted.html',
  '6MWT.html',
  '5xsit-stand.html',
  'BBS.html',
  'DEMMI.html',
  'FiST.html',
  'FSMC.html',
  'FSST.html',
  'FES-I.html',
  'GDS.html',
  'Gaitspeed.html',
  'ISI.html',
  'MCTSIB.html',
  'PSFS_GAS.html',
  'SARA.html',
  'SPPB.html',
  'TUG.html',
  'Trunk Impairment Scale.html',
  'tinetti.html',
  'MiniBEST.html',
  'DGI.html',
  'DHI.html',
  'Braincheck.html',
  'CTSIB_full.html',
  'PRTEE.html',
  'KOOS.html',
  'HOOS.html',
  'DASH.html',
  'ACL-RSI.html',
  'START-Back.html',
  'NDI.html',
  // PDFs
  'BBS_Protokoll.pdf',
  'DEMMI_Protokoll.pdf',
  'FES_I_Deutsch.pdf',
  'FSST_protokoll.pdf',
  'GDS_15_Deutsch.pdf',
  'ISI-Deutsch.pdf',
  'PSFS_GAS_Kurzmanual.pdf',
  'SPPB_Protokoll.pdf',
  'MiniBEST_Protokoll.pdf' // ✅ Tippfehler korrigiert!
];

// 🔹 INSTALL: Cache aufbauen
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .catch((err) => console.warn('Cache-Fehler:', err))
  );
  self.skipWaiting(); // neuen SW direkt aktivieren
});

// 🔹 ACTIVATE: alte Caches löschen
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim(); // Kontrolle sofort übernehmen
});

// 🔹 FETCH: Netzwerk-first für HTML, Cache-first für alles andere
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Netzwerk-First für HTML-Seiten
  if (req.mode === 'navigate' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req))
    );
  } else {
    // Cache-First für statische Assets
    event.respondWith(
      caches.match(req).then((res) => res || fetch(req))
    );
  }
});
