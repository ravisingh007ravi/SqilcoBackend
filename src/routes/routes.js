const express = require('express')
const {createUSer} = require('../controller/useController')

const router = express.Router();


router.get('/test',createUSer);

router.all('/*', (req, res) => {
    res.status(404).send({ status: false, msg: 'Invalid URL' });
});

module.exports = router 