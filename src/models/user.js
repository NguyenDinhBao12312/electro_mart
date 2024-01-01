const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
});
const db2 = mongoose.connection.useDb('user');
const User = db2.model('User', UserSchema, 'register'); 
module.exports = User