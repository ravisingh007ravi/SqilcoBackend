const userModel = require('../Model/userModel')
const bcrypt = require('bcrypt')
const { userImageURL } = require('../Image/ImageURL')
const { verifyOtp } = require('../Mail/AllMailFormate')
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.createUSer = async (req, res) => {
    try {

        const data = req.body;
        const img = req.file;

        const { name, email, password } = data;
        const randomOTP = Math.floor(1000 + Math.random() * 9000);

        const chekMail = await userModel.findOneAndUpdate({ email: email }, { $set: { UserVerifyOtp: randomOTP } }, { new: true })

        if (chekMail) {
            const UserStatus = { isAccountActive: chekMail.isAccountActive, isVerify: chekMail.isVerify, isdelete: chekMail.isdelete }
            if (!chekMail.isAccountActive) return res.status(400).send({ status: false, msg: "Your Account is Blocked", data: UserStatus });
            if (chekMail.isdelete) return res.status(400).send({ status: false, msg: "Your Account is Deleted", data: UserStatus });
            if (chekMail.isVerify) return res.status(400).send({ status: false, msg: "Your Account is Already Verify pls LogIn", data: UserStatus });

            verifyOtp(name, email, randomOTP)
            return res.status(200).send({ status: true, msg: "OTP sent successfully", id: chekMail._id, email: chekMail.email });
        }

        if (img) {
            const url = await userImageURL(img.path)
            data.userImg = url;
        }

        const bcryptPassword = await bcrypt.hash(password, 10);
        data.password = bcryptPassword
        data.role = 'user';
        data.UserVerifyOtp = randomOTP;


        verifyOtp(name, email, randomOTP)
        const USerDAta = await userModel.create(data)
        res.status(201).send({ status: true, msg: 'Successfully Register', id: USerDAta._id, email: data.email })
    }
    catch (e) { res.status(500).send({ status: false, msg: e.message }) }

}


exports.VerifyUserOtp = async (req, res) => {
    try {

        const data = req.body;
        const id = req.params.userId;


        if (!data.otp) return res.status(400).send({ status: false, msg: "provide otp" })

        const chekMail = await userModel.findById({ _id: id })

        if (chekMail) {
            if (!chekMail.isAccountActive) return res.status(400).send({ status: false, msg: "Your Account is Blocked" });
            if (chekMail.isdelete) return res.status(400).send({ status: false, msg: "Your Account is Deleted" });
            if (chekMail.isVerify) return res.status(400).send({ status: false, msg: "Your Account is Already Verify pls LogIn" });
        }

        if (!(data.otp == chekMail.UserVerifyOtp)) return res.status(400).send({ status: false, msg: "Wrong Otp" })

        await userModel.findByIdAndUpdate({ _id: id }, { $set: { isVerify: true } });
        res.status(200).send({ status: true, msg: "User Verify successfully" });

    }
    catch (e) { res.status(500).send({ status: false, msg: e.message }) }

}



exports.LogInUser = async (req, res) => {
    try {

        const chekMail = await userModel.findOne({ email: req.body.email });

        if (chekMail) {
            const { isAccountActive, isdelete, isVerify, _id } = chekMail
            const temp = { isAccountActive, isdelete, isVerify, _id }
            if (!chekMail.isAccountActive) return res.status(400).send({ status: false, msg: "Your Account is Blocked", data: temp });
            if (chekMail.isdelete) return res.status(400).send({ status: false, msg: "Your Account is Deleted", data: temp });
            if (!chekMail.isVerify) return res.status(400).send({ status: false, msg: "pls Verify Otp", data: temp });
        }

        if (!chekMail) {
            return res.status(404).send({ status: false, msg: "User Not Found" })
        }
        const compareBcrypt = await bcrypt.compare(req.body.password, chekMail.password)

        if (!compareBcrypt) return res.status(400).send({ status: false, msg: "Wrong Password" })

        const token = jwt.sign({ userId: chekMail._id }, process.env.UserJWTToken, { expiresIn: '1d' });
        res.status(200).send({ status: true, msg: "User LogIn successfully", token: token, id: chekMail._id });
    }
    catch (e) { res.status(500).send({ status: false, msg: e.message }) }

}


exports.ResendUSerOTP = async (req, res) => {
    try {

        const userId = req.params.userId;
        const randomOTP = Math.floor(1000 + Math.random() * 9000);

        await userModel.findByIdAndUpdate({ _id: userId }, { $set: { UserVerifyOtp: randomOTP } });

        res.send({ status: true, msg: "OTP sent successfully" })
    }
    catch (e) { res.status(500).send({ status: false, msg: e.message }) }

}






exports.LogInAdmin = async (req, res) => {
    try {

        const email = req.body.email
        
        const randomOtp = Math.floor(1000 + Math.random() * 9000);
        const chekMail = await userModel.findOneAndUpdate({ email: email, role: 'admin' }, { $set: { AdminOtp: randomOtp } });

        if (!chekMail) {
            return res.status(404).send({ status: false, msg: "Admin Not Found" })
        }
        const compareBcrypt = await bcrypt.compare(req.body.password, chekMail.password)

        if (!compareBcrypt) return res.status(400).send({ status: false, msg: "Wrong Password" })

        verifyOtp(chekMail.name, email, randomOtp)
        const token = jwt.sign({ userId: chekMail._id }, process.env.AdminJWTToken, { expiresIn: '1d' });
        res.status(200).send({ status: true, msg: "User LogIn successfully", token: token, id: chekMail._id });
    }
    catch (e) { res.status(500).send({ status: false, msg: e.message }) }

}
