const nodemailer = require('nodemailer');
const {SMTP_MAIL, SMTP_PASSWORD}= process.env;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


function createDelay(ms) {
  let timer;
  let rejectFn;

  const promise = new Promise((resolve, reject) => {
    rejectFn = reject;
    timer = setTimeout(resolve, ms);
  });

  return {
    promise,
    cancel: () => {
      clearTimeout(timer);
      rejectFn(new Error('Delay cancelled'));
    }
  };
}



// create reusable transporter object using the default SMTP transport
let sendMail= async(email, semailSubject,content)=>{

    const mail='er.kuldeepkumar2018@gmail.com';
    const pas='oxmg khro kbqr dpty';

    let transporter =nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:465,
        secure:true,
        requireTLS:true,
        auth:{
            user:mail,
            pass:pas
    }
    });
    
    // send mail with defined transport object
    let mailOptions = {
        from: "er.kuldeepkumar2018@gmail.com",
        to: email,
        subject: semailSubject,
        text: content
    };

    let results=false;

  console.log('Starting delay...');

  const delay = createDelay(300000);
    

    try{
       await transporter.sendMail(mailOptions,(err,info)=>{

             if(err){
                console.error('Error sending email ',err);
                 results=false;
                  delay.cancel();
                
             }else{
                 console.log('Email sent');
                 results= true;
                  delay.cancel();
             }
        });
    }catch(err){
        console.error('Error sending email page',err);
       
    }

      console.log("Starting sequential task...");
   await delay.promise;
  console.log("180 seconds have passed. Continuing sequential task.");
  // More code that should run after the delay

    return results;

}


module.exports=sendMail;








