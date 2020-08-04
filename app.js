const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const Member = require('./api/routes/member');
const Company = require('./api/routes/company.js');
const Receipt = require('./api/routes/receipt');
const Category = require('./api/routes/category');
const Summary = require('./api/routes/summary.js');

// ประกาศตัวแปร แบบ Global
var mysql_connection = mysql.createConnection({
    host:'ns117.hostinglotus.net',
    user: 'dntcom_dao',
    password: '123456@q!',
    database: 'dntcom_deejung',
    multipleStatements:true   
})

mysql_connection.connect((err)=>{
    if(!err){
        console.log("Connect to Database")
    }else{
        console.log("Database connection failed\n Error: " + JSON.stringify(err,undefined,2));
    }
})

mysql_connection = global.Promise;

app.use(morgan('dev'));
app.unsubscribe(bodyParser.urlencoded({
    extended:true
}));
app.use(cors({origin:"*"}));
app.use(bodyParser.json());

app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})

app.use("/member", Member);
app.use("/company", Company);
app.use("/receipt", Receipt);
app.use("/summary", Summary);
app.use("/category", Category);

module.exports = app;