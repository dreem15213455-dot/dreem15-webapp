// ✅ Service Worker for Dreem15 Web App
const CACHE_NAME = 'dreem15-cache-v5';
const urlsToCache = [
  '/dreem15-webapp/',
  '/dreem15-webapp/index.html',
  '/dreem15-webapp/admin.html',
  '/dreem15-webapp/english-course.html',
  '/dreem15-webapp/quiz.html',
  '/dreem15-webapp/manifest.json',
  '/dreem15-webapp/sw.js'
];

// ✅ Install Event
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => {
      console.log('Opened cache and adding files...');
      return cache.addAll(urlsToCache);
    })
    .catch(err => console.error('Failed to cache files:', err))
  );
  self.skipWaiting(); // Activate immediately
});

// ✅ Fetch Event (Network First, then Cache)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
    .then(response => {
      // Save latest response in cache
      const clonedResponse = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, clonedResponse));
      return response;
    })
    .catch(() => caches.match(event.request)) // If offline, use cache
  );
});

// ✅ Activate Event
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
  self.clients.claim(); // Take control immediately
});