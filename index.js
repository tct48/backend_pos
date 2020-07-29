const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

var mysql_connection = mysql.createConnection({
    host:'ns117.hostinglotus.net',
    user: 'dntcom_dao',
    password: '123456@q!',
    database: 'dntcom_landtransport'    
})

mysql_connection.connect((err)=>{
    if(!err){
        console.log("Connect to Database")
    }else{
        console.log("Database connection failed\n Error: " + JSON.stringify(err,undefined,2));
    }
})

app.listen(3000,()=>{
    console.log('Express Server is running at port 3000');
})

app.get('/car',(req, res)=>{
    mysql_connection.query('SELECT * FROM member',(err, rows, field)=>{
        if(!err)
            res.send(rows)
            else
            console.log(err);
    })
})