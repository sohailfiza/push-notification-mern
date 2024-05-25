self.addEventListener('activate', function(event) {
    console.log('Service worker activated');
});

self.addEventListener('push', async function(event) {
    console.log('Notifications will be displayed here');
    const message = await event.data.json();
    const { title, description, image } = message;
    console.log({ message });
    await event.waitUntil(
        self.registration.showNotification(title, {
            body: description,
            icon: image,
            vibrate: [300, 100, 400],
        })
    );
});
