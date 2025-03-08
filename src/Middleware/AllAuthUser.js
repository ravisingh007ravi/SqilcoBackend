const {validName,validEmail,validPassword} = require('../validation/AllValidation')

exports.userAuthValidation = async (req, res, next) => {
    try {
        const data = req.body;

        const { name, email, password } = data;

        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, msg: "provide data first!" }) }

        if (!name) return res.status(400).send({ status: false, msg: 'Pls Provided Name' })
        if (!validName(name)) return res.status(400).send({ status: false, msg: 'Pls Provided Valid Name' })

        if (!email) return res.status(400).send({ status: false, msg: 'Pls Provided email' })
        if (!validEmail(email)) return res.status(400).send({ status: false, msg: 'Pls Provided Valid email' })

        if (!password) return res.status(400).send({ status: false, msg: 'Pls Provided password' })
        if (!validPassword(password)) return res.status(400).send({ status: false, msg: 'Pls Provided Valid password' })
           
            next()
    }
    catch (err) { return res.status(500).send({ status: false, msg: err.message }) }
}


exports.LogInAuthValidation = async (req, res, next) => {
    try {
        const data = req.body;
        const { email, password } = data;

        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, msg: "provide data first!" }) }

        if (!email) return res.status(400).send({ status: false, msg: 'Pls Provided email' })
        if (!validEmail(email)) return res.status(400).send({ status: false, msg: 'Pls Provided Valid email' })

        if (!password) return res.status(400).send({ status: false, msg: 'Pls Provided password' })
        if (!validPassword(password)) return res.status(400).send({ status: false, msg: 'Pls Provided Valid password' })
           
            next()
    }
    catch (err) { return res.status(500).send({ status: false, msg: err.message }) }
}