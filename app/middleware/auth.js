const isAuth=(req,res,next)=>{

const auth = req.headers.authorization;

try {
    if(!auth || auth.split(' ').length<1) {
    return res.status(422).json({msg:'Token missing'}) ;
    }
     next();
   
} catch (error) {
    console.log("Error: " + error);
}

};

module.exports={
    isAuth,
}