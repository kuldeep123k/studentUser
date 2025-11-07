
const {DB_HOST, DB_NAME, DB_USER, DB_PASSWORD,port} = process.env;
const mysql = require('mysql2');
require('dotenv').config();
// Create a new MySQL connection

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//   ssl: {
//     rejectUnauthorized: true
//   }
// });

const connection = new mysql.createConnection({
    host:DB_HOST,
    user:'root',
    password:'12345678',
    database:"userdb",
});

// Connect to the database
  connection.connect((err) => {

   if (err) {
     throw  err;
   }
  console.log('Connected to MySQL!');

  const sql = `INSERT INTO users (name, email, password) VALUES ?`;
  const values = [
    ['Alice', 'aman@gmail.com', 1234567],
    ['Bob', 'bob@example.com', 1234567],
  ];

  db.query(sql, [values], (err, result) => {
    if (err) throw err;
    console.log('Inserted rows:', result.affectedRows);
    db.end();
  });

      
    if (err) {
        console.log("Error connecting to "+err.message);
         }else{
         console.log('Connected to MySQL'); 
         }
    });


    module.exports = connection;

