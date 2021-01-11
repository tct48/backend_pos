const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

var mysql_connection = mysql.createConnection({
    host: "ns123.hostinglotus.net",
    user: "deejung1_ketar",
    password: "123456@q!",
    database: "deejung1_pos",
    multipleStatements: true,
})

// mysql_connection.connect((err)=>{
//     if(!err){
//         console.log("Connect to Database")
//     }else{
//         console.log("Database connection failed\n Error: " + JSON.stringify(err,undefined,2));
//     }
// }) 

app.listen(3000, () => {
    console.log('Express Server is running at port 3000');
})

// R = Retrieve
app.get('/car', (req, res) => {
    mysql_connection.connect();
    mysql_connection.query('SELECT * FROM member', (err, rows, field) => {
        if (!err) {
            mysql_connection.end();
            rows.forEach(element => {
                if (element.constructor == Array) {
                    res.send('Inserted employee id : ' + element[0].EmpID)
                }
            });
        } else
        mysql_connection.end();
            console.log(err);
    })
})

// C = Create
app.post('/car', (req, res) => {
    let emp = req.body;
    var sql = "SET @EmpId = ?;SET @Name = ?; SET @EmpCode = ?; SET @Salary = ?; \
    CALL EmployeeAddOrEdit(@EmpId,@Name,@EmpCode,@Salary)";
    mysql_connection.connect();
    mysql_connection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
        if (!err) {
            mysql_connection.end();
            res.send(rows);
        } else {
            mysql_connection.end();
            console.log(err)
        }
    })
})

// R = Retrieve
app.put('/car', (req, res) => {
    let emp = req.body;
    var sql = "SET @EmpId = ?;SET @Name = ?; SET @EmpCode = ?; SET @Salary = ?; \
    CALL EmployeeAddOrEdit(@EmpId,@Name,@EmpCode,@Salary)";
    mysql_connection.connect();
    mysql_connection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
        if (!err) {
            mysql_connection.end();
            res.send(rows);
        } else {
            mysql_connection.end();
            console.log(err)
        }
    })
})

// D = Delete
app.delete('/car/:id', (req, res) => {
    mysql_connection.connect();
    mysql_connection.query('DELETE FROM car WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            mysql_connection.end();
            res.send('Deleted successfully');
        } else {
            mysql_connection.end();
            console.log(err)
        }
    })
})