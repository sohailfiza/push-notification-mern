self.addEventListener('activate', function(event) {
    console.log('Service worker activated');
});

self.addEventListener("push", async e => {
//   const data = e.data.json();
  console.log("Push Recieved...");
  self.registration.showNotification("title", {
    body: "Notified by Daily Dose.",
    icon: "https://images.newscientist.com/wp-content/uploads/2019/06/18153152/medicineshutterstock_1421041688.jpg?width=1200"
  });
});