const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userImg: { type: String, required: false, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    UserVerifyOtp: { type: String, required: true, trim: true },
    role:{type: String, enum: ['user', 'admin'], required: true, trim: true },
    isdelete:{type: Boolean, default: false},
    isVerify:{type: Boolean, default: false},
    isAccountActive:{type: Boolean, default: true},
},
{timestamps: true}
);

module.exports = mongoose.model('userDB', userSchema);