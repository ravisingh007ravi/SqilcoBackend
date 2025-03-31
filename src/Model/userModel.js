const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userImg: { type: String, required: false, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    NewEmail: { type: String, required: false, unique: true, trim: true },
    NewEmailOtp: { type: String, required: false, trim: true },
    newEmailOtpExpires: { type: String, required: false, trim: true },
    NewEmailisVerify:{type: Boolean, default: false},
    password: { type: String, required: true, trim: true },
    UserVerifyOtp: { type: String, required: true, trim: true },
    AdminOtp: { type: String, required: false, trim: true },
    role:{type: String, enum: ['user','shopkeeper', 'admin'], required: true, trim: true },
    isdelete:{type: Boolean, default: false},
    isVerify:{type: Boolean, default: false},
    isVerifyAdmin:{type: Boolean, default: false},
    isAccountActive:{type: Boolean, default: true},
    socialMedia:{type:Object,required:false},
},
{timestamps: true}
);

module.exports = mongoose.model('userDB', userSchema);