const express=require('express');
const bodyParser=require('body-parser');
const connection = require('./app/config/connection');
const app=express();
const cors=require('cors');
const router=require('./app/routes/userRouter');
const web_router=require('./app/routes/webRouter');

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

app.use('/api',router);
app.use('/',web_router);

app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).json("error", err.stack);
});

app.get("/",(req ,res)=>{
    res.status(200).send("loading page");
})


// var port=process.env.DB_PORT || 8080;

// app.listen(port,()=>{
//     console.log(`Server running on port ${port}`);

// });

