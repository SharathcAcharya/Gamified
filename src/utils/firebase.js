import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
let messaging = null;
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  messaging = getMessaging(app);
}

export { messaging };

// Request notification permission and get FCM token
export const requestNotificationPermission = async () => {
  if (!messaging) return null;
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      
      // Register service worker
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker registered:', registration);
      
      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration
      });
      
      if (token) {
        console.log('FCM Token:', token);
        return token;
      } else {
        console.log('No registration token available.');
        return null;
      }
    } else {
      console.log('Unable to get permission to notify.');
      return null;
    }
  } catch (error) {
    console.error('An error occurred while retrieving token:', error);
    return null;
  }
};

// Listen for foreground messages
export const onMessageListener = () => {
  if (!messaging) return Promise.resolve();
  
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      resolve(payload);
    });
  });
};

// Send token to backend
export const sendTokenToBackend = async (token) => {
  try {
    const response = await fetch('/api/notifications/register-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ fcmToken: token })
    });
    
    if (response.ok) {
      console.log('Token sent to backend successfully');
    } else {
      console.error('Failed to send token to backend');
    }
  } catch (error) {
    console.error('Error sending token to backend:', error);
  }
};
