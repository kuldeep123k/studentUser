
const {DB_HOST, DB_NAME, DB_USER, DB_PASSWORD,port} = process.env;
const mysql = require('mysql2');
require('dotenv').config();
// Create a new MySQL connection

const connection = mysql.createConnection({
  host: "bogtpeaqgpzt9g8a2njk-mysql.services.clever-cloud.com",
  user: "uttbv9ordguv5chn",
  password: "BnM8c9ZTmytzKmyixVju",
  database: "bogtpeaqgpzt9g8a2njk",
  port: 3306
});

// const connection = new mysql.createConnection({
    
//     host:DB_HOST,
//     user:'root',
//     password:'12345678',
//     database:"userdb",
    
// });

 console.log('Connected to MySQL'+connection); 

console.log({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});


// Connect to the database
  connection.connect((err) => {
      
    if (err) {
        console.log("Error connecting to "+err.message);
         }else{
         console.log('Connected to MySQL'); 

  console.log('Connected to MySQL!');

  const sql = `INSERT INTO users (name, email, password) VALUES ?`;
  const values = [
    ['Alice', 'aman@gmail.com', 1234567],
    ['Bob', 'bob@example.com', 1234567],
  ];

  mysql.query(sql, [values], (err, result) => {
    if (err) throw err;
    console.log('Inserted rows:', result.affectedRows);
    mysql.end();
  });

        
         }
    });


    module.exports = connection;






