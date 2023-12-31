const mongoose = require('mongoose')

const plm= require('passport-local-mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/pinterestCloneDb")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  dp: {
    type: String, // You might want to store the URL or file path of the profile picture
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  boards:{
    type: Array,
    default:[]
  },
});

userSchema.plugin(plm)
// Create the user model
const User = mongoose.model('User', userSchema);

module.exports = User;