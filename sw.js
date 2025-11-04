const CACHE_NAME = 'dreem15-cache-v4';
const urlsToCache = [
  '/dreem15-webapp/',
  '/dreem15-webapp/index.html',
  '/dreem15-webapp/admin.html',
  '/dreem15-webapp/english-course.html',
  '/dreem15-webapp/quiz.html',
  '/dreem15-webapp/manifest.json'
];

// Install Event
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => {
      console.log('Opened cache and adding files');
      return cache.addAll(urlsToCache);
    })
    .catch(err => {
      console.error('Failed to cache files:', err);
    })
  );
});

// Fetch Event - Network First Strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
    .then(response => {
      // Network se mil gaya - cache mein save karo
      return caches.open(CACHE_NAME)
        .then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
    })
    .catch(() => {
      // Network fail - cache se serve karo
      return caches.match(event.request);
    })
  );
});

// Activate Event  
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Immediately claim clients
  self.clients.claim();
});