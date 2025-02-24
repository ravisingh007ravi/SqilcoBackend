const userModel = require('../Model/userModel')
const bcrypt = require('bcrypt')
const {userImageURL} = require('../Image/ImageURL')

exports.createUSer = async (req, res) => {
    try {

        const data = req.body;
        const img = req.file;

        const { email, password } = data;


        const chekMail = await userModel.findOne({ email: email })
        if (chekMail) { return res.status(400).send({ status: false, message: "email already exist" }) }

        if(img){
            const url =await userImageURL(img.path)
            data.userImg = url;
        }

        const bcryptPassword = await bcrypt.hash(password, 10);
        data.password = bcryptPassword

        const USerDAta = await userModel.create(data)
        res.status(201).send(USerDAta)
    }
    catch (e) { res.status(500).send({ status: false, message: e.message }) }

}


exports.getAllUSerData = async (req, res) => {
    try {
        const a = req.params.cat

        if (a == 'all') {
            const allUSerData = await userModel.find({ isdelet: false }).sort({ createdAt: -1 })
            return res.send(allUSerData)
        }

        const allUSerData = await userModel.find({ name: a }).sort({ createdAt: -1 })
        res.send(allUSerData)
    }
    catch (e) { res.status(500).send({ status: false, message: e.message }) }
}


exports.updateUserData = async (req, res) => {
    try {
        const a = req.params.id
        const NewName = req.body.name;

        const updatedata = await userModel.findOneAndUpdate({ _id: a }, { name: NewName }, { new: true })

        res.send(updatedata)
    }
    catch (e) { res.status(500).send({ status: false, message: e.message }) }
}

exports.deletedUserData = async (req, res) => {
    try {
        const a = req.params.id


        const updatedata = await userModel.findByIdAndUpdate({ _id: a }, { isdelet: true }, { new: true })

        res.send({ msg: 'deleted data', data: updatedata })
    }
    catch (e) { res.status(500).send({ status: false, message: e.message }) }
}