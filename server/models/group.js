const Mongoose = require('mongoose');
const { Schema, Types } = Mongoose;
// groups: name, photoURL, ownerId, chatRoomId, members (userId, addByUserId, roles [], addAt):

const GroupSchema = new Schema({
  name: {
    type: String,
    default: 'New Group'
  },
  ownerId: {
    type: Types.ObjectId,
    default: ''
  },
  photoURL: {
    type: String,
    default: ''
  },
  chatRoomId: {
    type: Types.ObjectId,
    ref: 'ChatRoom'
  },
  members: [
    {
      userId: {
        type: Types.ObjectId,
        ref: 'User'
      },
      addByUserId: {
        type: Types.ObjectId,
        ref: 'User'
      },
      roles: {
        type: Array,
        default: []
      },
      addAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = Mongoose.model('Group', GroupSchema, 'groups');
