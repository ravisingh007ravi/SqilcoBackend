const express = require('express')
const multer = require('multer');
const { createUSer, VerifyUserOtp, LogInUser } = require('../controller/useController');
const { userAuthValidation } = require('../Middleware/AllAuthUser');
const { LogInAuthValidation } = require('../Middleware/AllAuthUser');
const {createShopkeeper,LogInShopkeeper} = require('../controller/shopkeeperCOntroller')

const upload = multer({ storage: multer.diskStorage({}) });

const router = express.Router();

// Router Provide CRUD Opration C- Create, R -Read, U -update, D - Delete
// Create - POST API, Read - GET API, UPdate - PUT API, Delete - DELETE API

//User API's
router.post('/createUSer', upload.single('userImg'), userAuthValidation, createUSer);
router.post('/VerifyUserOtp/:userId', VerifyUserOtp);
router.post('/LogInUser', LogInAuthValidation, LogInUser);

//Shopkeeper API's
router.post('/createShopkeeper', upload.single('userImg'), userAuthValidation, createShopkeeper);
router.post('/LogInShopkeeper', LogInAuthValidation, LogInShopkeeper);


router.all('/*', (req, res) => {
    res.status(404).send({ status: false, msg: 'Invalid URL' });
});

module.exports = router 