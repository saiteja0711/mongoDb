const express = require('express')
const router = express.Router()
const forgotPasswordController = require('../controller/forgotPassword');

router.post('/forgotPassword',forgotPasswordController.forgotPassword );
router.get('/resetpassword/:id',forgotPasswordController.resetPassword);
router.post('/updatepassword/:id',forgotPasswordController.updatePassword);

module.exports=router