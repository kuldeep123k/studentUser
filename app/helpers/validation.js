const {check}= require('express-validator');

exports.signUpValidation=[
    check('name').not().isEmpty().withMessage('Name is required'),
    check('email').isEmail().normalizeEmail({gmail_remove_dots:true}).withMessage('Email is required'),
    check('password').isLength({min:4}).withMessage('Password must be at least 8 characters long'),
    check('image').custom((value,{req})=>{
        if (req.file!=undefined) {
           if(req.file.mimetype=='image/jpeg' || req.file.mimetype=='image/png'){
               return true;
               }
               else{
                   return false;
                   }
                } else {
                    return true;
                }

    }).withMessage('please upload jpeg , png images'),
]

exports.signInValidation=[
    check('email').isEmail().normalizeEmail({gmail_remove_dots:true}).withMessage('Email is required'),
    check('password').isLength({min:4}).withMessage('Password must be at least 8 characters long'),
  
]

exports.resetPaswordValidation=[
    check('email').isEmail().normalizeEmail({gmail_remove_dots:true}).withMessage('Email is required'),
  
]

exports.updateProfileValidation=[
    check('email').isEmail().normalizeEmail({gmail_remove_dots:true}).withMessage('Email is required'),
    check('password').isLength({min:4}).withMessage('Password must be at least 8 characters long'),
  
]