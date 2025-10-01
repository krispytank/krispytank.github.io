// Service Worker for Offline Functionality

const CACHE_NAME = 'teachers-assistant-v1';
const OFFLINE_CACHE = 'teachers-assistant-offline-v1';

// Resources to cache for offline use
const CACHE_RESOURCES = [
    '/',
    '/index.html',
    '/src/styles/main.css',
    '/src/scripts/app.js',
    '/src/scripts/charts.js',
    '/src/scripts/lessonGenerator.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Resources that can be used offline
const OFFLINE_RESOURCES = [
    // Sample lesson plans
    {
        id: 'lesson-math-fractions',
        title: 'Introduction to Fractions',
        subject: 'Mathematics',
        grade: 'Grade 4',
        content: '...' // Full lesson plan content
    },
    // Sample resources
    {
        id: 'resource-math-worksheets',
        title: 'Mathematics Worksheets Grade 4',
        type: 'worksheet',
        content: '...' // Resource content
    }
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        Promise.all([
            caches.open(CACHE_NAME).then((cache) => {
                return cache.addAll(CACHE_RESOURCES);
            }),
            caches.open(OFFLINE_CACHE).then((cache) => {
                // Store offline resources
                return Promise.all(
                    OFFLINE_RESOURCES.map(resource => {
                        return cache.put(
                            new Request(`/offline/${resource.id}`),
                            new Response(JSON.stringify(resource), {
                                headers: { 'Content-Type': 'application/json' }
                            })
                        );
                    })
                );
            })
        ])
    );
    
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_CACHE) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    
    self.clients.claim();
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Return cached version if available
            if (cachedResponse) {
                return cachedResponse;
            }

            // Try to fetch from network
            return fetch(event.request).then((networkResponse) => {
                // Cache successful responses
                if (networkResponse.status === 200) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                
                return networkResponse;
            }).catch(() => {
                // Network failed, try to serve offline alternative
                return caches.match('/offline.html').then((offlineResponse) => {
                    return offlineResponse || new Response('Offline', { 
                        status: 503, 
                        statusText: 'Service Unavailable' 
                    });
                });
            });
        })
    );
});

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(
            // Sync any pending data when connection is restored
            syncPendingData()
        );
    }
});

async function syncPendingData() {
    // Get pending data from IndexedDB
    const pendingLessons = await getPendingLessons();
    const pendingGrades = await getPendingGrades();
    
    // Sync lesson plans
    for (const lesson of pendingLessons) {
        try {
            await fetch('/api/lessons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lesson)
            });
            // Remove from pending after successful sync
            await removePendingLesson(lesson.id);
        } catch (error) {
            console.log('Failed to sync lesson:', error);
        }
    }
    
    // Sync grades
    for (const grade of pendingGrades) {
        try {
            await fetch('/api/grades', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(grade)
            });
            await removePendingGrade(grade.id);
        } catch (error) {
            console.log('Failed to sync grade:', error);
        }
    }
}

// IndexedDB operations for offline storage
async function getPendingLessons() {
    return new Promise((resolve) => {
        const request = indexedDB.open('TeachersAssistantDB', 1);
        
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['pendingLessons'], 'readonly');
            const store = transaction.objectStore('pendingLessons');
            const getAllRequest = store.getAll();
            
            getAllRequest.onsuccess = () => {
                resolve(getAllRequest.result);
            };
        };
        
        request.onerror = () => {
            resolve([]);
        };
    });
}

async function getPendingGrades() {
    return new Promise((resolve) => {
        const request = indexedDB.open('TeachersAssistantDB', 1);
        
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['pendingGrades'], 'readonly');
            const store = transaction.objectStore('pendingGrades');
            const getAllRequest = store.getAll();
            
            getAllRequest.onsuccess = () => {
                resolve(getAllRequest.result);
            };
        };
        
        request.onerror = () => {
            resolve([]);
        };
    });
}

async function removePendingLesson(lessonId) {
    return new Promise((resolve) => {
        const request = indexedDB.open('TeachersAssistantDB', 1);
        
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['pendingLessons'], 'readwrite');
            const store = transaction.objectStore('pendingLessons');
            
            store.delete(lessonId);
            transaction.oncomplete = () => resolve();
        };
    });
}

async function removePendingGrade(gradeId) {
    return new Promise((resolve) => {
        const request = indexedDB.open('TeachersAssistantDB', 1);
        
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['pendingGrades'], 'readwrite');
            const store = transaction.objectStore('pendingGrades');
            
            store.delete(gradeId);
            transaction.oncomplete = () => resolve();
        };
    });
}

// Message handling for communication with main app
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});