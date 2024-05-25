const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const subscriptionModel = require('./subscriptionSchema');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// VAPID keys should be generated only once.
const vapidKeys = webpush.generateVAPIDKeys();

webpush.setVapidDetails(
    'mailto:abc@def.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

// Store subscriptions in memory (in a real application, store in DB)
let subscriptions = [];
let subscription

app.get('/', (req, res) => {
    res.send('server running...');
});

app.get('/vapidPublicKey', (req, res) => {
    res.send(vapidKeys.publicKey);
});

app.post('/subscribe', (req, res) => {
    subscription = req.body;
    subscriptions.push(subscription);
    saveSubscription()
    console.log(subscription);
    res.status(201).json({subscriptions});
});

app.post('/sendNotification', (req, res) => {
    const notificationPayload = JSON.stringify({
        title: req.body.title,
        message: req.body.message
    });

    const promises = subscriptions.map(subscription =>
        webpush.sendNotification(subscription, notificationPayload)
    );

    Promise.all(promises)
        .then(() => res.sendStatus(200))
        .catch(err => {
            console.error('Error sending notification, error: ', err);
            res.sendStatus(500);
        });
});


async function saveSubscription(){
    try {
        const newSubscription = await subscriptionModel.create(subscription);
    } catch (error) {
        console.error(error);
    }
    return null
}

// mongoose.set('strictQuery', true)
mongoose.connect('mongodb+srv://admin:admin12345@cluster0.uqsov2y.mongodb.net/pushMsg')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));


const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});