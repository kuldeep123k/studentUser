const express = require('express');
const router = express.Router();
const { signUpValidation,signInValidation,resetPaswordValidation,updateProfileValidation } = require('../helpers/validation');
const userController = require('../controller/userController');
const isAuthenticated = require('../middleware/auth');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname,'../public/images'));
    },  
    filename: (req, file, cb) => {  
        const name=Date.now()+'_'+file.originalname;
        cb(null, name);
        }
        });

        const filefilter = (req, file, cb) => {
            if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png')
                cb(null, true);

            else
                cb(new Error('Only jgep , png images are allowed'), false);
        };

     const uploadImage =  multer({
            storage:storage,
            filefilter: filefilter,
        } );

// Require the employee controller
router.post('/register',uploadImage.single('image'),signUpValidation,userController.register);


router.post('/login',signInValidation,userController.login);

router.get('/getUser',isAuthenticated.isAuth ,userController.getUser);

router.put('/resetPassword',resetPaswordValidation, userController.resetPasswordsTokenSend);

router.post('/updateProfile',uploadImage.single('image'),updateProfileValidation,isAuthenticated.isAuth,userController.updateProfile);


module.exports = router;