// app.get('/employee', (req, res) => {
//     connection.query('select * from employee', (err, rows) => {
//         if(err) {
//             console.error(err);
//             return res.status(404).send('Error fetching data');
//         }
//         //res.send(rows);
//        return res.status(200).send(rows);
//     })
// });

// app.get('/employee/:id', (req, res) => {
//     connection.query('select * from employee WHERE id=?',[req.params.id] , (err, rows) => {
//         if(err) {
//             console.error(err);
//             return res.status(404).send('Error fetching data');
//         }
//         //res.send(rows);
//        return res.status(200).send(rows);
//     })
// });

// app.delete('/employee/:id', (req, res) => {
//     connection.query('DELETE FROM employee WHERE id=?',[req.params.id], (err, rows) => {
//         if(err) {
//             console.error(err);
//             return res.status(404).send('Error deleting data');
//         }
//         //res.send(rows);
//        return res.status(200).send("item deleted");
//     })
// });

// app.post('/employee',(req,res)=>{

//     let body= req.body;
//     let data=[body.name,body.salary];
//     console.log(data);
//     connection.query('INSERT INTO employee(name,salary) values (?)',[data],(err, rows) => {
//         if(err) {
//             console.error(err);
//             return res.status(404).send('Error inserting data');
//         }
//         //res.send(rows);
//        return res.status(200).send("item inserted");
//     });

// });


// app.put('/employee',(req,res)=>{
//     var emp=req.body;
//     connection.query('update employee set ? where id='+emp.id,[emp],(err,rows)=>{

//         if(err){
//             console.error(err);
//             res.send("Error updating employee");
//         }else{

//             if(rows.affectedRows==0){
//                 console.log("employee not found");
//                 var data1=[emp.id,emp.name,emp.salary];
//                 connection.query('INSERT INTO employee(id,name,salary) VALUES(?)',[data1],(err, result)=>{
//                     if (err) {
//                         console.error(err); 
//                         res.send("Error: " + err);
//                     }else{
//                         console.log(result);
//                         res.status(201).send("New employee created");
//                         }
//                 })
                
//             }else{
//                 console.log("employee updated");
//             res.status(200).send("Employee updated");

//             }
//         }

//     });
// });

// app.patch('/employee',(req,res) => {
//     var emp=req.body;
// connection.query('update employee set ? where id = '+emp.id,[emp],(err,rows) => {
//     if(err){
//         console.error(err);
//         res.send("Error updating employee");
//     }else{
//         console.log("employee updated");
//         res.status(200).send("Employee updated");
//     }
// });

// });