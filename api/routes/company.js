const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

// ประกาศตัวแปร แบบ Global
var mysql_connection = mysql.createConnection({
    // host:"localhost",
    // user:"root",
    // password:'',
    host: "ns123.hostinglotus.net",
    user: "deejung1_ketar",
    password: "123456@q!",
    database: "deejung1_pos",
    multipleStatements: true,
});
// mysql_connection.timeout=5000;

// C => Created
router.post('/', (req, res, next)=>{
    let model = req.body;

    var sql = "INSERT INTO company (name) VALUES (";
    sql += "'" + model.name + "')";
    //- Error listener
    mysql_connection.on('error', function(err) {
        //- The server close the connection.
        if(err.code === "PROTOCOL_CONNECTION_LOST"){    
            console.log("/!\\ 1Cannot establish a connection with the database. /!\\ ("+err.code+")");
            mysql_connection = reconnect(mysql_connection.connect());
        }

        //- Connection in closing
        else if(err.code === "PROTOCOL_ENQUEUE_AFTER_QUIT"){
            console.log("/!\\ 2Cannot establish a connection with the database. /!\\ ("+err.code+")");
            mysql_connection = reconnect(mysql_connection.connect());
        }

        //- Fatal error : connection variable must be recreated
        else if(err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR"){
            console.log("/!\\ 3Cannot establish a connection with the database. /!\\ ("+err.code+")");
            mysql_connection = reconnect(mysql_connection.connect());
        }

        //- Error because a connection is already being established
        else if(err.code === "PROTOCOL_ENQUEUE_HANDSHAKE_TWICE"){
            console.log("/!\\ 4Cannot establish a connection with the database. /!\\ ("+err.code+")");
        }

        //- Anything else
        else{
            console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
            mysql_connection = reconnect(mysql_connection.connect());
        }

    });

    mysql_connection.query({sql:sql, timeout: 3000}, (err, rows, fields)=>{
        if(!err){
            
            return res.status(200).json({
                item: rows.insertId,
                detail: model
            })
        }else{
            
            return res.status(500).json({
                code: 500,
                message: catchError(err.errno)
            })
        }
    })

    setTimeout(function(){
        mysql_connection.on('connect', function(){
            mysql_connection.destroy();
            console.log("Database is alreasy connect destroy");
        })
    },2000);

    return;
})

// R => Retrieve
router.get("/", (req, res, next) => {
    var sp, lp, skip;
    if (!req.query["sp"] || !req.query["lp"]) {
      sp = 0;
      lp = 5;
    } else {
      sp = Object.values(req.query["sp"]);
      lp = Object.values(req.query["lp"]);
    }
  
    skip = sp * lp;
  
    var sql = "SELECT * FROM company LIMIT " + sp + "," + lp;
    //- Error listener
    mysql_connection.on('error', function(err) {
        //- The server close the connection.
        if(err.code === "PROTOCOL_CONNECTION_LOST"){    
            console.log("/!\\ 1Cannot establish a connection with the database. /!\\ ("+err.code+")");
            mysql_connection = reconnect(mysql_connection.connect());
        }

        //- Connection in closing
        else if(err.code === "PROTOCOL_ENQUEUE_AFTER_QUIT"){
            console.log("/!\\ 2Cannot establish a connection with the database. /!\\ ("+err.code+")");
            mysql_connection = reconnect(mysql_connection.connect());
        }

        //- Fatal error : connection variable must be recreated
        else if(err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR"){
            console.log("/!\\ 3Cannot establish a connection with the database. /!\\ ("+err.code+")");
            mysql_connection = reconnect(mysql_connection.connect());
        }

        //- Error because a connection is already being established
        else if(err.code === "PROTOCOL_ENQUEUE_HANDSHAKE_TWICE"){
            console.log("/!\\ 4Cannot establish a connection with the database. /!\\ ("+err.code+")");
        }

        //- Anything else
        else{
            console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
            mysql_connection = reconnect(mysql_connection.connect());
        }

    });

    mysql_connection.query({sql:sql, timeout: 3000}, (err, rows, field) => {
      if(!err){
        
          return res.status(200).json({
              total_items: rows.length,
              items: rows,
            });
      }else{
        
          return res.status(500).json({
              code: 500,
              text: err.name
          })
      }
    });

    setTimeout(function(){
        mysql_connection.on('connect', function(){
            mysql_connection.destroy();
            console.log("Database is alreasy connect destroy");
        })
    },2000);

    return;
  });

// U = Update
router.put('/', (req, res)=>{
    let model = req.body;

    let sql = "UPDATE company SET name='" + model.name + "'";
    sql+= " WHERE _id = " + model._id;
    //- Error listener
    mysql_connection.on('error', function(err) {
        //- The server close the connection.
        if(err.code === "PROTOCOL_CONNECTION_LOST"){    
            console.log("/!\\ 1Cannot establish a connection with the database. /!\\ ("+err.code+")");
            mysql_connection = reconnect(mysql_connection.connect());
        }

        //- Connection in closing
        else if(err.code === "PROTOCOL_ENQUEUE_AFTER_QUIT"){
            console.log("/!\\ 2Cannot establish a connection with the database. /!\\ ("+err.code+")");
            mysql_connection = reconnect(mysql_connection.connect());
        }

        //- Fatal error : connection variable must be recreated
        else if(err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR"){
            console.log("/!\\ 3Cannot establish a connection with the database. /!\\ ("+err.code+")");
            mysql_connection = reconnect(mysql_connection.connect());
        }

        //- Error because a connection is already being established
        else if(err.code === "PROTOCOL_ENQUEUE_HANDSHAKE_TWICE"){
            console.log("/!\\ 4Cannot establish a connection with the database. /!\\ ("+err.code+")");
        }

        //- Anything else
        else{
            console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
            mysql_connection = reconnect(mysql_connection.connect());
        }

    });

    mysql_connection.query({sql:sql, timeout: 3000},(err,rows,fields)=>{
        if(!err){
            
            return res.status(200).json({
                item: model
            })
        }else{
            
            return res.status(500).json({
                code: 500,
                message: catchError(err.errno)
            })
        }
    })

    setTimeout(function(){
        mysql_connection.on('connect', function(){
            mysql_connection.destroy();
            console.log("Database is alreasy connect destroy");
        })
    },2000);

    return;
})

// D = Delete
router.delete('/:_id', (req, res)=>{
    let _id = req.params._id;

    var sql = "DELETE FROM company WHERE _id = " + _id

    mysql_connection.on('error', function(err) {
        //- The server close the connection.
        if(err.code === "PROTOCOL_CONNECTION_LOST"){    
            console.log("/!\\ 1Cannot establish a connection with the database. /!\\ ("+err.code+")");
            mysql_connection = reconnect(mysql_connection.connect());
        }

        //- Connection in closing
        else if(err.code === "PROTOCOL_ENQUEUE_AFTER_QUIT"){
            console.log("/!\\ 2Cannot establish a connection with the database. /!\\ ("+err.code+")");
            mysql_connection = reconnect(mysql_connection.connect());
        }

        //- Fatal error : connection variable must be recreated
        else if(err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR"){
            console.log("/!\\ 3Cannot establish a connection with the database. /!\\ ("+err.code+")");
            mysql_connection = reconnect(mysql_connection.connect());
        }

        //- Error because a connection is already being established
        else if(err.code === "PROTOCOL_ENQUEUE_HANDSHAKE_TWICE"){
            console.log("/!\\ 4Cannot establish a connection with the database. /!\\ ("+err.code+")");
        }

        //- Anything else
        else{
            console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
            mysql_connection = reconnect(mysql_connection.connect());
        }

    });

    mysql_connection.query({sql:sql, timeout: 3000},(err,rows,fields)=>{
        if(!err){
            
            return res.status(200).json({
                message: "ลบข้อมูลบริษัทสำเร็จ",
                affected: "ส่งผลกระทบกับ " + rows.affectedRows + " เรคคอร์ด"
            })
        }else{
            
            return res.status(500).json({
                message: "เกิดข้อผิดพลาด"
            })
        }
    })

    setTimeout(function(){
        mysql_connection.on('connect', function(){
            mysql_connection.destroy();
            console.log("Database is alreasy connect destroy");
        })
    },2000);

    return;
})

function catchError(code){
    if(code=="1062"){
        return "มีชื่อบริษัทนี้อยู่ในระบบแล้ว !";
    }else if(code == "1064"){
        return "SQL Syntax ผิดพลาด";
    }else if(code == "1054"){
        return "ชุดข้อมูลมีค่าว่าง";
    }
}

//- Reconnection function
function reconnect(connection){
    console.log("\n New connection tentative...");

    //- Destroy the current connection variable
    if(connection) connection.destroy();

    //- Create a new one
    var connection = mysql_npm.createConnection(db_config);

    //- Try to reconnect
    connection.connect(function(err){
        if(err) {
            //- Try to connect every 2 seconds.
            // setTimeout(reconnect, 2000);
        }else {
            console.log("\n\t *** New connection established with the database. ***")
            return connection;
        }
    });
}

module.exports = router;
