const express = require('express');
const multer = require('multer');
const { authenticate, authorize } = require('../Middleware/AuthUser');
const { createUSer, VerifyUserOtp, LogInUser, ResendUSerOTP, LogInAdmin,
    UserUpdated, updateUserEmail, verifyUserEmail } = require('../controller/useController');
const { createShopkeeper, LogInShopkeeper } = require('../controller/shopkeeperCOntroller');
const { CreateProduct } = require('../controller/productController');
const { userAuthValidation, LogInAuthValidation } = require('../Middleware/AllAuthUser');

const router = express.Router();

const storage = multer.memoryStorage(); 
const upload = multer({ storage });

// User APIs
router.post('/createUSer', upload.single('userImg'), userAuthValidation, createUSer);
router.post('/VerifyUserOtp/:userId', VerifyUserOtp);
router.post('/LogInUser', LogInAuthValidation, LogInUser);
router.get('/ResendUSerOTP/:userId', ResendUSerOTP);
router.put('/UserUpdated/:userId', authenticate, authorize, UserUpdated);
router.put('/updateUserEmail/:userId', authenticate, authorize, updateUserEmail);
router.post('/verifyUserEmail/:userId', authenticate, authorize, verifyUserEmail);

// In your router file
router.post('/products', upload.array('productImgALL', 5), CreateProduct);

// Admin APIs
router.post('/LogInAdmin', LogInAuthValidation, LogInAdmin);

// Shopkeeper APIs
router.post('/createShopkeeper', upload.single('userImg'), userAuthValidation, createShopkeeper);
router.post('/LogInShopkeeper', LogInAuthValidation, LogInShopkeeper);

// 404 Handler
router.all('/*', (req, res) => { res.status(404).send({ status: false, msg: 'Invalid URL' }); });

module.exports = router;