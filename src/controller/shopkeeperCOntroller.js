const userModel = require('../Model/userModel')
const bcrypt = require('bcrypt')
const { userImageURL } = require('../Image/ImageURL')
const { verifyOtp } = require('../Mail/AllMailFormate')
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.createShopkeeper = async (req, res) => {
    try {

        const data = req.body;
        const img = req.file;

        const { name, email, password } = data;
        const randomOTP = Math.floor(1000 + Math.random() * 9000);

        const chekMail = await userModel.findOneAndUpdate({ email: email }, { $set: { UserVerifyOtp: randomOTP } }, { new: true })

        if (chekMail) {
            if (!chekMail.isAccountActive) return res.status(400).send({ status: false, msg: "Your Account is Blocked" });
            if (chekMail.isdelete) return res.status(400).send({ status: false, msg: "Your Account is Deleted" });
            if (chekMail.isVerify) return res.status(400).send({ status: false, msg: "Your Account is Already Verify pls LogIn" });

            verifyOtp(name, email, randomOTP)
            return res.status(200).send({ status: true, msg: "OTP sent successfully", id: chekMail._id });
        }

        if (img) {
            const url = await userImageURL(img.path)
            data.userImg = url;
        }

        const bcryptPassword = await bcrypt.hash(password, 10);
        data.password = bcryptPassword
        data.role = 'shopkeeper';
        data.UserVerifyOtp = randomOTP;

        const tempData = { name: data.name, email: data.email }

        verifyOtp(name, email, randomOTP)
        const USerDAta = await userModel.create(data)
        res.status(201).send({ status: true, msg: 'Successfully Register', id: USerDAta._id, data: tempData })
    }
    catch (e) { res.status(500).send({ status: false, msg: e.message }) }

}




exports.LogInShopkeeper = async (req, res) => {
    try {

        const chekMail = await userModel.findOne({ email: req.body.email });

        if (chekMail) {
            if (!chekMail.isAccountActive) return res.status(400).send({ status: false, msg: "Your Account is Blocked" });
            if (chekMail.isdelete) return res.status(400).send({ status: false, msg: "Your Account is Deleted" });
            if (!chekMail.isVerify) return res.status(400).send({ status: false, msg: "pls Verify Otp" });
        }

        if (!chekMail) return res.status(400).send({ status: false, msg: "User Not Found" })

        const compareBcrypt = await bcrypt.compare(req.body.password, chekMail.password)

        if (!compareBcrypt) return res.status(400).send({ status: false, msg: "Wrong Password" })
       
            const token = jwt.sign({ userId: chekMail._id }, process.env.ShopkeeperJWTToken, { expiresIn: '1d' });
            res.status(200).send({ status: true, msg: "User LogIn successfully", token: token, id: chekMail._id });
    }
    catch (e) { res.status(500).send({ status: false, msg: e.message }) }

}