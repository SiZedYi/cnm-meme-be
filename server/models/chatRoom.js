const Mongoose = require('mongoose');
const { Schema, Types } = Mongoose;

//"active": true,
// "thumbnailURL": "",
// "lastMessage": "Hello",
// "createdAt": {
//   "$date": "2023-05-01T00:00:00.000Z"
// },
// "updatedAt": {
//   "$date": "2023-05-01T00:00:00.000Z"
// },
// "messages": [
//   {
const chatRoomSchema = new Schema({
    active: {
        type: Boolean,
        default: true
    },
    thumbnailURL: {
        type: String,
        default: ''
    },
    lastMessage: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    messages: [
        {
            type: Types.ObjectId,
            ref: 'Message'
        }
    ]
});


module.exports = Mongoose.model('ChatRoom', chatRoomSchema, 'chatRooms');