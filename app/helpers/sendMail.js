const nodemailer = require('nodemailer');
const {SMTP_MAIL, SMTP_PASSWORD}= process.env;

// create reusable transporter object using the default SMTP transport
let sendMail= async(email, semailSubject,content)=>{

    const mail='er.kuldeepkumar2018@gmail.com';
    const pas='oxmg khro kbqr dpty';

    let transporter =nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        requireTLS:true,
        auth:{
            user:mail,
            pass:pas
    }
    });
    
    // send mail with defined transport object
    let mailOptions = {
        from: SMTP_MAIL,
        to: email,
        subject: semailSubject,
        text: content
    };

    let results=false;

    try{
       await transporter.sendMail(mailOptions,(err,info)=>{

             if(err){
                console.error('Error sending emails ',err);
                return null;
                
             }else{
                 console.log('Email sent');
                 results= true;
             }
        });
    }catch(err){
        console.error('Error sending email page',err);
        return null;
    }

    return results;

}

module.exports=sendMail;