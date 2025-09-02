// Firebase Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase
firebase.initializeApp({
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
});

// Retrieve Firebase Messaging object
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png',
    badge: '/logo192.png',
    tag: payload.data.type || 'default',
    data: payload.data,
    requireInteraction: false,
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icons/view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/dismiss.png'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  console.log('[firebase-messaging-sw.js] Notification click received.');

  event.notification.close();

  if (event.action === 'view') {
    // Open the app with the appropriate URL
    const urlToOpen = event.notification.data.url || '/';
    
    event.waitUntil(
      clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      })
      .then(function(clientList) {
        // If a window is already open, focus it
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise, open a new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
  // For 'dismiss' action or default, just close the notification (already done above)
});

// Handle push events (for browsers that don't support Firebase)
self.addEventListener('push', function(event) {
  if (event.data) {
    const payload = event.data.json();
    console.log('[firebase-messaging-sw.js] Push event received: ', payload);
    
    const notificationTitle = payload.title || 'Gamified Challenge';
    const notificationOptions = {
      body: payload.body || 'You have a new notification',
      icon: '/logo192.png',
      badge: '/logo192.png',
      tag: payload.tag || 'default',
      data: payload.data || {},
      requireInteraction: false
    };

    event.waitUntil(
      self.registration.showNotification(notificationTitle, notificationOptions)
    );
  }
});
