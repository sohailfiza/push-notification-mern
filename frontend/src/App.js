import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const subscribeToPushNotifications = async () => {
      try {
        const registration = await navigator.serviceWorker.ready;

        // Get any existing subscription
        const existingSubscription = await registration.pushManager.getSubscription();
        
        // Unsubscribe if there's an existing subscription
        if (existingSubscription) {
          await existingSubscription.unsubscribe();
        }

        const response = await axios.get('http://localhost:9000/vapidPublicKey');
        const vapidPublicKey = response.data;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
        });
        await axios.post('http://localhost:9000/subscribe', subscription);
      } catch (error) {
        console.error('Error subscribing to push notifications:', error);
      }
    };

    if ('serviceWorker' in navigator) {
      subscribeToPushNotifications();
    }
  }, []);

  const urlBase64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const sendNotification = async () => {
    try {
      await axios.post('http://localhost:9000/sendNotification', { title, message },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      setTitle('');
      setMessage('');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  return (
    <div>
      <h1>Push Notifications</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button onClick={sendNotification}>Send Notification</button>
    </div>
  );
};

export default App;