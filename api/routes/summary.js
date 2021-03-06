const express = require("express");
const router = express.Router();
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


router.get("/vat", (req, res, next)=>{
    let sql = "";
    let company = req.query["company"];
    let date = req.query["date"];
    let month = req.query["month"];
    let year = req.query["year"]

    sql="SELECT receipt._id, receipt.dor, receipt.title, IF(receipt_detail.name='ค่าปรับ', receipt_detail.price,0) as fines,  receipt.type, receipt_detail.price FROM receipt, receipt_detail WHERE receipt._id = receipt_detail.receipt \
    AND (receipt_detail.name='ภาษี' OR receipt_detail.name='ค่าปรับ') AND receipt.company = " + company + " AND DAY(receipt.dor)=" + date + " AND MONTH(receipt.dor)=" + month + " AND YEAR(receipt.dor)=" + year + " AND view=1";
    
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
    
    mysql_connection.query({sql:sql, timeout: 3000}, (err, rows, field)=>{
        if(!err){
            
            return res.status(200).json({
                items: rows
            })
        }
        
        return res.status(500).json({
            code: 500,
            message: catchError(err.errno)
        })
    });

    setTimeout(function(){
        mysql_connection.on('connect', function(){
            mysql_connection.destroy();
            console.log("Database is alreasy connect destroy");
        })
    },2000);

    return;
});

router.get("/vat5days", (req, res, next)=> {
    let sql="";
    let company = req.query["company"]
    sql="SELECT receipt.dor, SUM(IF(receipt.type=3,receipt_detail.price+10,receipt_detail.price+20)) as total_price FROM receipt, receipt_detail \
    WHERE receipt._id = receipt_detail.receipt AND receipt_detail.name='ภาษี' AND receipt.company = " + company + " ORDER BY receipt.dor DESC LIMIT 5"
    
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

    mysql_connection.query({sql:sql, timeout: 3000}, (err, rows, field)=>{
        if(!err){
            return res.status(200).json({
                items: rows
            })
        }

        
        return res.status(500).json({
            code: 500,
            message: catchError(err.errno)
        })
    });

    setTimeout(function(){
        mysql_connection.on('connect', function(){
            mysql_connection.destroy();
            console.log("Database is alreasy connect destroy");
        })
    },2000);

    return;
})


// R => Retrieve All Receipt
router.get("/:company", (req, res, next) => {
    let sql="";
    // รายรับ 15 วันล่าสุด เดือนที่ 8 บริษัท ดีจัง
    // SELECT dor, SUM(total) as total_price FROM receipt WHERE company=1 GROUP BY MONTH(dor) ORDER BY MONTH(dor) DESC LIMIT 7
    let dumb = new Date();
    let company = req.params.company;
    sql = "SELECT dor, IF(status=1,total,0) as cash, IF(status=2,total,0) as bank FROM receipt WHERE company=" + company + " GROUP BY DATE(dor) ORDER BY _id DESC LIMIT 15"
    console.log(sql);
    
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
            if (!err) {
                
                return res.status(200).json({
                    items: rows,
                })
        } else {
            
            return res.status(500).json({
                code: 500,
                message: catchError(err.errno)
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

router.get("/month/:company", (req, res, next)=> {
    let sql="";
    let company = req.params.company;

    sql="SELECT _id, dor, SUM(CASE WHEN view=1 THEN total END) AS cash FROM receipt WHERE company=" + company + " AND view IN (0,1) GROUP BY MONTH(dor) ORDER BY MONTH(dor) LIMIT 7";
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
        if (!err) {
            
                return res.status(200).json({
                    items: rows,
                })
        } else {
            
            return res.status(500).json({
                code: 500,
                message: catchError(err.errno)
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
})


function catchError(code) {
    if (code == "1062") {
        return "มีใบเสร็จอยู่ในระบบแล้ว !";
    } else if (code == "1064") {
        return "SQL Syntax ผิดพลาด";
    } else if (code == "1054") {
        return "ชุดข้อมูลมีค่าว่าง";
    } else if (code == "1136") {
        return "ชุดข้อมูลมีประเภทข้อมูลไม่ตรงตามที่กำหนด"
    } else if (code == "1366") {
        return "please updated field to utf8"
    }
}

module.exports = router;