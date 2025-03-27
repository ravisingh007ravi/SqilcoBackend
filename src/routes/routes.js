const express = require('express')
const multer = require('multer');
// User Controller
const { createUSer, VerifyUserOtp, LogInUser, ResendUSerOTP, LogInAdmin, 
    Test,UserUpdated } = require('../controller/useController');
// ShopKeeper Controller
const { createShopkeeper, LogInShopkeeper } = require('../controller/shopkeeperCOntroller')
// User Middleware
const { userAuthValidation, LogInAuthValidation } = require('../Middleware/AllAuthUser');
const { authenticate, authorize } = require('../Middleware/AuthUser');

const upload = multer({ storage: multer.diskStorage({}) });

const router = express.Router();

// Router Provide CRUD Opration C- Create, R -Read, U -update, D - Delete
// Create - POST API, Read - GET API, UPdate - PUT API, Delete - DELETE API

//User API's
router.post('/createUSer', upload.single('userImg'), userAuthValidation, createUSer);
router.post('/VerifyUserOtp/:userId', VerifyUserOtp);
router.post('/LogInUser', LogInAuthValidation, LogInUser);
router.get('/ResendUSerOTP/:userId', ResendUSerOTP);
router.put('/UserUpdated/:userId', authenticate, authorize, UserUpdated);

router.get('/getAllData',authenticate, Test);

//Admin API's
router.post('/LogInAdmin', LogInAuthValidation, LogInAdmin);

//Shopkeeper API's
router.post('/createShopkeeper', upload.single('userImg'), userAuthValidation, createShopkeeper);
router.post('/LogInShopkeeper', LogInAuthValidation, LogInShopkeeper);


router.all('/*', (req, res) => {
    res.status(404).send({ status: false, msg: 'Invalid URL' });
});

module.exports = router 