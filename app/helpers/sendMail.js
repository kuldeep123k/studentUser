const nodemailer = require('nodemailer');
const {SMTP_MAIL, SMTP_PASSWORD}= process.env;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


function createDelay(ms) {
  let timer;
  let done = false;
  let resolveFn;

  const promise = new Promise((resolve) => {
    resolveFn = resolve;
    timer = setTimeout(() => {
      done = true;
      resolve();
    }, ms);
  });

  return {
    promise,
    cancel: () => {
      if (!done) {
        clearTimeout(timer);
        resolveFn(); // resolve immediately so code continues
      }
    },
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

  console.log('Start delay...');
  const delay = createDelay(180000);
    

    try{
       await transporter.sendMail(mailOptions,(err,info)=>{

             if(err){
                console.error('Error sending email ',err);
                 results=false;
                    console.log('Cancel delay now!');
    delay.cancel(); // continues immediately
                
             }else{
                 console.log('Email sent');
                 results= true;
                     console.log('Cancel delay now!');
    delay.cancel(); // continues immediately
             }
        });
    }catch(err){
        console.error('Error sending email page',err);
       
    }

      console.log("Starting sequential task...");
  
  await delay.promise; // waits until resolved or cancelled
  console.log('Continue with other code...');
  console.log("180 seconds have passed. Continuing sequential task.");
  // More code that should run after the delay

    return results;

}


module.exports=sendMail;










