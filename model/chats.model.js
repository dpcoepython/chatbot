const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    chatId: {
        type: String,
        required: true
    },
    chat: {
        type: String,
        required: true
    },

    chatCreated: {
        type: Date,
        default: Date.now
    },
    userName: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
});

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = {Chat};