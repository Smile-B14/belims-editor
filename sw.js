const CACHE_NAME = 'belims-editor-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/manifest.webmanifest',
  '/utils/fileUtils.ts',
  '/services/geminiService.ts',
  '/hooks/useImageEditing.ts',
  '/hooks/useTranslation.ts',
  '/context/LanguageContext.tsx',
  '/components/common/Button.tsx',
  '/components/common/Icon.tsx',
  '/components/common/Spinner.tsx',
  '/components/Header.tsx',
  '/components/ImageUploader.tsx',
  '/components/EditorCanvas.tsx',
  '/components/EditingTools.tsx',
  '/components/SuggestionBox.tsx',
  '/components/HistoryPanel.tsx',
  '/components/TextOverlay.tsx',
  '/i18n/locales/en.json',
  '/i18n/locales/ka.json'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Serve from cache
        }
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              if (!event.request.url.startsWith('https://aistudio')) {
                 return response;
              }
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      }
    )
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});