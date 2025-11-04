const CACHE_NAME = 'dreem15-cache-v3';
const urlsToCache = [
  './',
  'index.html',
  'admin.html',
  'english-course.html',
  // Add other files if you have them
  // 'styles.css',
  // 'script.js'
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

// Fetch Event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      return response || fetch(event.request);
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
});