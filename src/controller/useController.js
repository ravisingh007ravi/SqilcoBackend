const userModel = require('../Model/userModel')
const bcrypt = require('bcrypt')
const { userImageURL } = require('../Image/ImageURL')
const { verifyOtp } = require('../Mail/AllMailFormate')

exports.createUSer = async (req, res) => {
    try {

        const data = req.body;
        const img = req.file;

        const { name, email, password } = data;
        const randomOTP = Math.floor(1000 + Math.random() * 9000);

        const chekMail = await userModel.findOneAndUpdate({ email: email }, { $set: { UserVerifyOtp: randomOTP } }, { new: true })

        if (chekMail) {
            if (!chekMail.isAccountActive) return res.status(400).send({ status: false, message: "Your Account is Blocked" });
            if (chekMail.isdelete) return res.status(400).send({ status: false, message: "Your Account is Deleted" });
            if (chekMail.isVerify) return res.status(400).send({ status: false, message: "Your Account is Already Verify pls LogIn" });

            verifyOtp(name, email, randomOTP)
            return res.status(200).send({ status: true, message: "OTP sent successfully", id: chekMail._id });
        }

        if (img) {
            const url = await userImageURL(img.path)
            data.userImg = url;
        }

        const bcryptPassword = await bcrypt.hash(password, 10);
        data.password = bcryptPassword
        data.role = 'user';
        data.UserVerifyOtp = randomOTP;

        const tempData = { name: data.name, email: data.email }

        verifyOtp(name, email, randomOTP)
        const USerDAta = await userModel.create(data)
        res.status(201).send({ status: true, msg: 'Successfully Register', id: USerDAta._id, data: tempData })
    }
    catch (e) { res.status(500).send({ status: false, message: e.message }) }

}


exports.VerifyUserOtp = async (req, res) => {
    try {

        const data = req.body;
        const id = req.params.userId;


        if (!data.otp) return res.status(400).send({ status: false, message: "provide otp" })

        const chekMail = await userModel.findById({ _id: id })

        if (chekMail) {
            if (!chekMail.isAccountActive) return res.status(400).send({ status: false, message: "Your Account is Blocked" });
            if (chekMail.isdelete) return res.status(400).send({ status: false, message: "Your Account is Deleted" });
            if (chekMail.isVerify) return res.status(400).send({ status: false, message: "Your Account is Already Verify pls LogIn" });
        }

        if (!(data.otp == chekMail.UserVerifyOtp)) return res.status(400).send({ status: false, message: "Wrong Otp" })

        await userModel.findByIdAndUpdate({ _id: id }, { $set: { isVerify: true } });
        res.status(200).send({ status: true, msg: "User Verify successfully" });

    }
    catch (e) { res.status(500).send({ status: false, message: e.message }) }

}