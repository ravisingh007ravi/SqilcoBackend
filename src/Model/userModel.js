const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userImg: { type: String, required: false, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    isdelet:{type: Boolean, default: false},
},
{timestamps: true}
);

module.exports = mongoose.model('userDB', userSchema);