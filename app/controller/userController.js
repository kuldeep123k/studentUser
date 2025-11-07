
const {validationResult}= require('express-validator');
const db=require('../config/connection');
const bcrypt=require('bcryptjs');

const randomString=require('randomstring');
const sendMail=require('../helpers/sendMail');
const jwt=require('jsonwebtoken');
//const { query } = require('express');
//const {jwtSecret}= process.env??"my-super-secret-key";
const jwtSecret = "my-super-secret-key";

const register = (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() });
    }
    const {name, email, password}=req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.query('SELECT * FROM users WHERE email=?', [email], async (err, result) => {

        if (err) return res.status(400).json({errors: [{msg: 'Try again'}] });
        if (result.length > 0) {
            return res.status(409).json({errors: [{msg: 'User already exists'}] });
        } else {
            const newData = [name, email, hashedPassword];
            let body= req.body;
            let imgName='null';

            if(req.file!=undefined){
                imgName=req.file.filename;
            }else{
                imgName='null';
            }
           

            // generate unique verification token
            const verificationToken = randomString.generate({length: 20 });
            let subject = 'mail verification';
            let content = '<p>Hello, '+name+'\
            Please <a href="https://studentuser-lt71.onrender.com/mail-verification?token='+verificationToken+'"> verify </a> your mail.</p>';
            
            let data1=[body.name,body.email,hashedPassword,imgName,verificationToken];

        const mailResult=  await sendMail(email, subject, content).then(function(response) {
            
            console.log("resssss "+response);
            if(response){
                console.log('response is empty');
                return res.status(500).json({errors: [{msg: 'Failed to send verification emails'}] });

            }else{
                console.log('response is not empty');
                
                // insert user data into database with verification token
                db.query('INSERT INTO users(name,email,password,image,token) VALUES(?)', [data1], (err, result) => {
                    if (err){
                        console.error(err);
                            return res.status(400).json({msg: 'User registered failed'});
                    }
                   return res.status(201).json({msg: 'User registered successfully'});
                });
            }
            
            }).catch(function(error) {
            console.error("errorreceivedS", error);
            return res.status(500).json({errors: [{msg: 'Failed to send verification email res'}] });
            });
            
           // return res.status(500).json({errors: [{msg: 'Failed to send verification email'}] });

        }
    });
   
};

const login = (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty){
        return res.status(400).json({errors: errors.array()});
    }
    const {email, password}=req.body;

    db.query('SELECT * FROM users WHERE email=?', [email], async (err, result) => {
        if(err) return res.status(401).json({errors: [{msg: 'error credentialss'}]});

        if(result.length === 0){
            return res.status(400).json({errors: [{msg: 'Invalid email and password'}]});
        }

        else if(result[0].is_verified==1){

       console.log(result[0].password);
        // compare password with hashed password from database
        const isMatch = await bcrypt.compare(password, result[0].password);

        if(isMatch){
            const token = jwt.sign({id: result[0].id}, jwtSecret,{expiresIn:'1h'});
            const user={msg:"Login Successfully!",id: result[0].id, name: result[0].name, email: result[0].email,is_admin: result[0].is_admin};
          
       db.query('update users set token=? , last_login=now() where id= '+result[0].id,[token],(err, rows)=>{
            console.log(err );
            if(err) return res.status(400).json({errors: [{msg: 'Failed to update users'}]});

            if(rows.affectedRows>0){
                return res.status(200).json({token, user: user});
            }else{
                return res.status(400).json({msg: 'Failed to update user'});
            }

       });
          
        }else{
            return res.status(401).json({errors: [{msg: 'Invalid credentials'}]});
        }

    }else{
        return res.status(401).json({errors: [{msg: 'User not verified'}]});
    }

    });

};

const getUser = (req, res) => {
    const tt = req.headers.authorization;
    const split=tt.split(' ');
    const authToken=split[split.length-1];

    if(authToken.length<10) return res.status(401).json({errors: [{msg: 'Invalid token'}]});
 

    console.log(authToken);

    jwt.verify(authToken,jwtSecret ,function (err,result){
        if(err){
            console.error(err.message);
            if(err.message=='jwt expired') return res.status(401).json({errors: [{msg: 'Token expired'}]});
            return res.status(401).json({errors: [{msg: 'Token is not valid'}]});
        }
        console.log(result.id);

        db.query('select * from users where id= ?',[result.id],(err, rows) => {

           if(err) return res.status(400).json({errors:err.errors});

           console.log(rows[0].id);

           if(authToken==rows[0].token){

            if(rows.length==0){

                res.status(400).json({errors: [{msg: 'User not found'}]});
           }else{
               res.status(200).send({msg:"User successfully",data:rows[0]});
           }

           }else{
            return res.status(401).json({errors: [{msg: 'Token is not valid'}]});
           }

         });

        
    });

    

};


const updateProfile=function(req, res){

    const errors = validationResult(req);
    if(!errors.isEmpty){
        return res.status(400).json({errors:errors.array()});
    }else{
        const {name, email}=req.body;
        let token = req.headers.authorization;
        let split=token.split(' ');
        const newToken=split[split.length-1];

       let decodeToken= jwt.verify(newToken, jwtSecret,(err, result) => {
        if(err){
            console.log(err.message);
            return res.status(401).json({errors: [{msg: 'Token expired'}]});
        }

        console.log(result);
        return result;
        
    });

       sql='';
       data=[];

       // upload image and not image uploaded
       if(req.file==undefined){

         sql='UPDATE users SET name=?, email=? WHERE id=?';
         data=[name, email, decodeToken.id];

       }else{
            sql='UPDATE users SET name=?, email=?,image=? WHERE id=?';
            data=[name,email,req.file.filename ,decodeToken.id];
       }
       
       db.query(sql, data, function(err,rows,fields){
        if(err){
            console.log(err);
            return res.status(400).json({msg: "error"});
    }else{
        if(rows.affectedRows>0){
            return res.status(200).json({msg: "update prfile successfully"});
        }else{
            return res.status(400).json({msg: "prfile not update"});
        }
    }

    });
    }
}


const mailVerification= function(req,res){
const token =req.query.token;

console.log(token);
db.query('select * from users where token= ? ',token,(err,result,fields)=>{

    if(err) return res.render('404');

    if(result.length>0){
        db.query('UPDATE users SET is_verified=1, token="null" WHERE id=?',result[0].id,(err,rows,fields)=>{
            if(err) return res.render('404');
            if(rows.affectedRows>0){
                return res.render('mail-verification',{msg: "Account verified successfully"});
            }else{
                return res.render('mail-verification',{msg: "Account not verified"});
            }
            
            });
    }else{
        return res.render('404');
    }

});

};


const resetPasswordsTokenSend = (req, res) => {

    const error=validationResult(req);

    if(!error.isEmpty){
        return res.status(400).json({errors:error.array()});
    }
    const {email}=req.body;

    console.log(email);

    db.query('SELECT * FROM users WHERE email=?', [email], async (err, result,fields) => {
        if(err) return res.status(400).json({ msg: " could not find"});

        console.log(result);
        if(result.length > 0){
            // generate unique reset token
            const resetToken = randomString.generate({length: 20 });
            let subject = 'Reset Password';
            let content = '<p>Hello, '+result[0].name+'\
            Please <a href="http://localhost:8080/reset-password?token='+resetToken+'"> reset your password </a> here.</p>';

            // update user data with reset token
            sendMail(email,subject,content );

            db.query('UPDATE resetpassword SET email=?, reset_token=?, created_at=NOW() WHERE email=?', [email,resetToken,email], (err, rows) => {
              
              console.log(rows.affectedRows); 

                if(err) return res.status(400).json({ msg: "response error"});
                if(rows.affectedRows > 0 ){
                    console.log("Password reset token sentsd");
                        return res.status(200).json({ msg: "Password reset token sent successfully"});
                }else{
                    console.log("Password reset token sent");
                    db.query("INSERT INTO resetpassword VALUES(?, ?,NOW())",[email,resetToken],function(errs,rowq){
                        console.log(errs);

                        if(err){
                            return res.status(400).json({ msg: "errors"});
                            }
                            return res.status(200).json({ msg: "success send email"});
                    });
                }

                });

          //  return res.status(200).json({ msg: "Email sent successfully"});

        }else{
             return res.status(400).json({ msg: "email not found"});

        }


    });
};

const resetPasswordLoad=(req,res) => {
const token = req.query.token;

console.log(token);
if(token==undefined){
    return res.render('404');
}

db.query("SELECT * FROM resetpassword where reset_token=?",token,(err,result,fields) => {
    if(err){
        return res.render('404');
    }

    if(result.length>0){
        console.log(result[0].email);
        db.query('select *from users where email=?',result[0].email,(err,results,fields)=>{
            if(err){
                return res.render('404');
            }
            if(results.length>0){
                res.render('resetPasswords',{user:results[0]});

            }else{
                return res.render('message',{msg:"User not found",});
            }

        });

    }else{
        return res.render('message',{msg:"Token expired"});
    }

});


};

const reset_password=(req,res)=>{

console.log(req.body.confirm_password);
if(req.body.password == req.body.confirm_password){

    bcrypt.hash(req.body.password,10,(error,hash)=>{
            if(error){
                return res.render('resetPasswords',{error_message:"something went wrong,try again later",user:{id:req.body.id,email:req.body.email}}); 

            }else{

        db.query('DELETE from resetpassword where email=?',[req.body.email],(err,rows)=>{

        if(err) {
            console.log(err);
            return res.render('resetPasswords',{error_message:"something went wrong,try again later",user:{id:req.body.id,email:req.body.email}}); 
        }else{

            db.query("UPDATE users set password=? where email =?",[hash,req.body.email],(err,result)=>{

        if(err){
            return res.render('resetPasswords',{error_message:"something went wrong,try agains",user:{id:req.body.id,email:req.body.email}}); 
        }

        if(result.affectedRows > 0){
            res.render('message',{msg:"Passwords updated successfully"});

        }else{
            return res.render('resetPasswords',{error_message:"failed to update password",user:{id:req.body.id,email:req.body.email}}); 

        }

    });
        }
    });


            }
    
    });

   

    

}else{
    return res.render('resetPasswords',{error_message:"Password not matched",user:{id:req.body.id,email:req.body.email}}); 
}
};

module.exports ={
    register,
    login,
    getUser,
    resetPasswordsTokenSend,
    updateProfile,
    mailVerification,
    resetPasswordLoad,
    reset_password

};
