const CACHE_NAME = 'dreem15-cache-v2'; // Cache version ko V2 me badal diya
const urlsToCache = [
  './', // Current directory root (index.html, etc.)
  '/index.html',
  '/admin.html',
  '/english-course.html', // NEW: English Course file ko add kiya
  // Zaroori Firebase/CDN files jo aapki website use karti hai, agar hon to unhe yahan add karein.
  // Agar aapke styles aur scripts alag files me hain, to unhe bhi yahan add karein:
  // '/styles/style.css', 
  // '/scripts/main.js',
];

// Service Worker: Install Event
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and adding files');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Failed to cache required files:', err);
      })
  );
});

// Service Worker: Fetch Event (Network Falling Back to Cache)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // No cache match - fetch from network
        return fetch(event.request);
      })
  );
});

// Service Worker: Activate Event (Cleaning up old caches)
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete old caches that are not in the whitelist
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Ensure the service worker controls the clients immediately
  event.waitUntil(self.clients.claim()); 
});
