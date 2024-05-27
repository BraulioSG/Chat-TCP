const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.ObjectId,
    user_name: {
      type: String
    },
    user_conn: {
      type: Array,
      default: [{
        user_adrr: Int,
        user_port: Int
      }
      ]
    },
    user_channels: {
      type: Array
    },
    user_request: {
      type: Array
    }
  }
)

const ChannelSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.ObjectId,
    ch_name: {
      type: String
    },
    ch_creator: {
      type: Int  //USER ID
    },
    ch_members: {
      type: Array,
      default: [{
        member_id: Int,
        member_nick: String
      }]
    },
    ch_messages: {
      type: Array,
      default: [{
        msg_from: Int,
        msg_body: String,
        msg_date: String
      }]
    }
  }
)

module.exports = { ChannelSchema, UserSchema }
