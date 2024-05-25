require('dotenv').config();

const express = require('express');
const webPush = require('web-push');
const mongoose = require('mongoose');
const cors = require('cors');
const SubscriptionModel = require('./subscriptionSchema'); // Ensure this file is correctly defined
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const vapidKeys = {
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY,
};

webPush.setVapidDetails(
    'mailto:uct8417uun@tidissajiiu.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

app.post('/subscribe', async (req, res) => {
    try {
        const newSubscription = await SubscriptionModel.create(req.body);
        res.status(201).json(newSubscription);
    } catch (error) {
        console.error('Error subscribing:', error);
        res.sendStatus(500);
    }
});

app.get('/vapidPublicKey', (req, res) => {
    res.send(vapidKeys.publicKey);
});

app.post('/sendNotification', async (req, res) => {
    try {
        const subscriptions = await SubscriptionModel.find();
        const notificationPayload = JSON.stringify({
            title: 'Hello from server',
            description: 'This message is coming from the server',
            image: 'https://cdn2.vectorstock.com/i/thumb-large/94/66/emoji-smile-icon-symbol-smiley-face-vector-26119466.jpg',
        });

        const options = {
            TTL: 60,
        };

        await Promise.all(
            subscriptions.map(sub => 
                webPush.sendNotification(sub, notificationPayload, options)
                    .catch(error => {
                        console.error('Error sending notification:', error);
                    })
            )
        );

        res.sendStatus(200);
    } catch (error) {
        console.error('Error sending notification:', error);
        res.sendStatus(500);
    }
});

const port = process.env.PORT || 9000;
const DatabaseName = 'pushDb';
const DatabaseURI = process.env.MONGODB_URI || `mongodb+srv://admin:admin12345@cluster0.uqsov2y.mongodb.net/${DatabaseName}`;

mongoose.connect(DatabaseURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

app.listen(port, () => console.log(`App running on port ${port}`));