const CACHE_NAME = 'assessment-praxis-v7.6'; // 🔄 Version hochzählen bei Updates
const ASSETS_TO_CACHE = [
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
  'BBS_Protokoll.pdf',
  'DEMMI_Protokoll.pdf',
  'FES_I_Deutsch.pdf',
  'FSST_protokoll.pdf',
  'GDS_15_Deutsch.pdf',
  'ISI-Deutsch.pdf',
  'PSFS_GAS_Kurzmanual.pdf',
  'SPPB_Protokoll.pdf',
  '6MWT_Protokoll.pdf',
  'MniBEST_Protokoll.pdf',
  'icon.png',
  'manifest.json',
  'index.html'
];

// Install → Cache aufbauen
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Neue Version sofort aktiv
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Activate → Alte Caches löschen
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim(); // Kontrolle übernehmen
});

// Fetch → Hybrid-Strategie
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // HTML-Seiten → Netzwerk first
  if (event.request.mode === 'navigate' || url.endsWith('.html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Kopie im Cache speichern
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request)) // Offline: Cache fallback
    );
  } else {
    // Alles andere → Cache first
    event.respondWith(
      caches.match(event.request).then((response) => response || fetch(event.request))
    );
  }
});
