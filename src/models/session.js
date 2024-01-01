const mongoose = require('mongoose');
const { Schema } = mongoose;

const sessionSchema = new Schema({
  sessionId: { type: String, required: true },
  userId: { type: String, required: true },
});

module.exports = mongoose.model('Session', sessionSchema);
