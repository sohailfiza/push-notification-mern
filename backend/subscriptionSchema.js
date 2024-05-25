const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Subscription = new Schema({
    endpoint: {
        type: String,
        unique: true
    },
    expirationTime: {
        type: Number,
        default: 259200
    },
    keys: {
        p256dh: String,
        auth: String,
    },
});
module.exports = mongoose.model('subscription', Subscription);