const express = require('express')
const multer = require('multer');
const { createUSer, getAllUSerData, updateUserData, deletedUserData } = require('../controller/useController');
const { userAuthValidation } = require('../Middleware/AllAuthUser');

const upload = multer({ storage: multer.diskStorage({}) });

const router = express.Router();

// Router Provide CRUD Opration C- Create, R -Read, U -update, D - Delete
// Create - POST API, Read - GET API, UPdate - PUT API, Delete - DELETE API

router.post('/createUSer', upload.single('userImg'), userAuthValidation, createUSer);
router.get('/getAllUSerData/:cat', getAllUSerData);
router.put('/updateUserData/:id', updateUserData);
router.delete('/deletedUserData/:id', deletedUserData);

router.all('/*', (req, res) => {
    res.status(404).send({ status: false, msg: 'Invalid URL' });
});

module.exports = router 