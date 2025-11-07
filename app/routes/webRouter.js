const express=require("express");
const web_router=express();

web_router.set('view engine', 'ejs');
web_router.set('views','./app/views');
web_router.set(express.static('public'));

const userController = require('../controller/userController');

web_router.get('/mail-verification',userController.mailVerification);

web_router.get('/reset-password',userController.resetPasswordLoad);

web_router.post('/reset-password',userController.reset_password);



module.exports = web_router;


