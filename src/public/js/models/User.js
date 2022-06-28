const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    // To drop duplicates if any
    dropDups: true
  },
  password: {
    type: String,
    required: true
  },
  favourites: {
    type: []
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('Users', UserSchema);