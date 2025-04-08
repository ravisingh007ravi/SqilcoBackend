const userModel = require('../Model/userModel')
const bcrypt = require('bcrypt')
const { uploadToCloudinary } = require('../Image/ImageURL')
const { verifyOtp, ChangeUserEmail } = require('../Mail/AllMailFormate')
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
      const url =  await uploadToCloudinary(img.buffer) 
      data.userImg = url;
    }

    const bcryptPassword = await bcrypt.hash(password, 10);
    data.password = bcryptPassword
    data.role = 'user';
    data.UserVerifyOtp = randomOTP;


    verifyOtp(name, email, randomOTP)
    const USerDAta = await userModel.create(data)
    res.status(201).send({ status: true, msg: 'Successfully Register', id: USerDAta._id, email: data.email });
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
    const user = await userModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ status: false, msg: "User Not Found" });
    }

    const { isAccountActive, isdelete, isVerify, _id, password, userImg, name, email, role } = user;

    if (!isAccountActive) {
      return res.status(400).json({ status: false, msg: "Your Account is Blocked", data: { isAccountActive, isdelete, isVerify, _id } });
    }
    if (isdelete) {
      return res.status(400).json({ status: false, msg: "Your Account is Deleted", data: { isAccountActive, isdelete, isVerify, _id } });
    }
    if (!isVerify) {
      return res.status(400).json({ status: false, msg: "Please Verify OTP", data: { isAccountActive, isdelete, isVerify, _id } });
    }

    const isPasswordCorrect = await bcrypt.compare(req.body.password, password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ status: false, msg: "Wrong Password" });
    }

    const token = jwt.sign({ userId: _id }, process.env.UserJWTToken, { expiresIn: "1d" });

    return res.status(200).json({
      status: true,
      msg: "User Logged In Successfully",
      token,
      id: _id,
      profileImage: userImg,
      name,
      email,
      role
    });

  } catch (error) {
    res.status(500).json({ status: false, msg: error.message });
  }
};



exports.ResendUSerOTP = async (req, res) => {
  try {

    const userId = req.params.userId;
    const randomOTP = Math.floor(1000 + Math.random() * 9000);

    await userModel.findByIdAndUpdate({ _id: userId }, { $set: { UserVerifyOtp: randomOTP } });

    res.send({ status: true, msg: "OTP sent successfully" })
  }
  catch (e) { res.status(500).send({ status: false, msg: e.message }) }

}



exports.UserUpdated = async (req, res) => {
  try {
    let data = req.body;


    res.send('updated')
  }
  catch (e) { res.status(500).send({ status: false, msg: e.message }) }

}





exports.ChangePassword = async (req, res) => {
  try {

    const data = req.body;

    const { currentPassword, NewPassword, id } = data;

    const user = await userModel.findById(id);

    if (!user) return res.status(404).send({ status: false, msg: "User Not Found" })

    const BcryptPass = user.password;

    const isPasswordCorrect = await bcrypt.compare(currentPassword, BcryptPass);
    if (!isPasswordCorrect) return res.status(404).send({ status: false, msg: "Wrong Password" })

    const bcryptPassword = await bcrypt.hash(NewPassword, 10);
    await userModel.findByIdAndUpdate({ _id: id }, { $set: { password: bcryptPassword } });

    res.status(200).send({ status: true, msg: "Password Change Successfully" })

  }
  catch (e) { res.status(500).send({ status: false, msg: e.message }) }

}

exports.updateUserEmail = async (req, res) => {
  try {
    const data = req.body;
    const { email, password } = data;

    if (!email) return res.status(400).send({ status: false, msg: "Email is required" });
    if (!password) return res.status(400).send({ status: false, msg: "Password is required" });

    const findUser = await userModel.findById(req.params.userId);
    if (!findUser) return res.status(404).send({ status: false, msg: "User not found" });

    const emailExists = await userModel.findOne({ email: email });
    if (emailExists) return res.status(400).send({ status: false, msg: "Email already in use" });

    const isPasswordCorrect = await bcrypt.compare(password, findUser.password);
    if (!isPasswordCorrect) return res.status(401).send({ status: false, msg: "Incorrect password" });

    const randomOtp = Math.floor(1000 + Math.random() * 9000);

    ChangeUserEmail(findUser.name, email, randomOtp); 

    const updatedData =await userModel.findByIdAndUpdate(req.params.userId, { NewEmail: email, NewEmailOtp: randomOtp, newEmailOtpExpires: Date.now() + 1000*60*5 }, { new: true });
    res.status(200).send({ status: true, msg: "Verification email sent", data: { email: email } });

  } catch (e) {
    console.error("Error in updateUserEmail:", e);
    res.status(500).send({ status: false, msg: "Internal server error" });
  }
};

exports.verifyUserEmail = async (req, res) => {
  try {

    const id = req.params.userId;
    const OTP = req.body.otp;

    const user = await userModel.findById(id);
    
    if (!user) return res.status(404).send({ status: false, msg: "User not found" });

    if (user.NewEmailOtp !== OTP) return res.status(400).send({ status: false, msg: "Invalid OTP" });

    const now = Date.now();
    if (now > user.newEmailOtpExpires) return res.status(400).send({ status: false, msg: "OTP has expired" });

    user.email = user.NewEmail;
    user.NewEmail = null;
    user.NewEmailOtp = null;
    user.newEmailOtpExpires = null;

    await user.save();

    res.status(200).send({ status: true, msg: "Email updated successfully" });
  } catch (e) {
    console.error("Error in verifyUserEmail:", e);
    res.status(500).send({ status: false, msg: "Internal server error" });
  }
};



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
