// serviceWorker.js - Client-side Service Worker Registration and Push Subscription
import axios from 'axios';

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

async function regSw() {
    if ('serviceWorker' in navigator) {
        try {
            const reg = await navigator.serviceWorker.register('/sw.js');
            console.log('Service worker registered:', reg);
            return reg;
        } catch (e) {
            console.error('Service worker registration failed:', e);
        }
    } else {
        throw new Error('Service worker not supported');
    }
}

let subscription = null;

async function subscribe(serviceWorkerReg) {
    subscription = await serviceWorkerReg.pushManager.getSubscription();
    if (subscription === null) {
        const response = await axios.get('http://localhost:9000/vapidPublicKey');
        const applicationServerKey = urlBase64ToUint8Array(response.data);
        subscription = await serviceWorkerReg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey,
        });
        console.log('Subscribed:', subscription);
    } else {
        console.log('Already subscribed:', subscription);
    }
}

async function sendPush() {
    console.log("Sending Push...");
    await axios.post('http://localhost:9000/subscribe', subscription, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    console.log("Push Sent...");
}

// Export functions for use in other parts of your application
export { regSw, subscribe, sendPush };