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

// C => Created Receipt
router.post('/', (req, res, next) => {
    let model = req.body;
    model.created = new Date().getTime();
    model.updated = new Date().getTime();
    model.dor = new Date().getTime();
    // หาเลขที่ใบเสร็จที่มากที่สุด
    sql = "SELECT MAX(receipt_no) FROM receipt WHERE company=" + model.company;
    
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

    mysql_connection.query({sql:sql, timeout: 30000}, (err, rows, fields) => {
        model.receipt_no = 1;
        if (rows.receipt_no) {
            model.receipt_no = rows.receipt_no + 1;
            console.log(rows);
        }
        var sql = "INSERT INTO receipt (receipt_no, customer, title, address, type, total, company, member, created, updated, status, view) VALUES (";
        sql += "" + model.receipt_no + ", '" + model.customer + "', '" + model.title + "', '" + model.address + "', " + model.type + ", " + model.total + ", " + model.company + ", " + model.member + ", " + model.created + ", " + model.updated + ", 1,1)";
        console.log(sql)
        mysql_connection.query({sql:sql, timeout: 30000}, (err, rows, fields) => {
            if (!err) {
                
                return res.status(200).json({
                    item: rows.insertId,
                    detail: model
                })
            } else {
                console.log("BEC")
                console.log(catchError(err.errno))
                
                return res.status(500).json({
                    code: 500,
                    message: catchError(err.errno)
                })
            }
        })
    });

    setTimeout(function(){
        mysql_connection.on('connect', function(){
            mysql_connection.destroy();
            console.log("Database is alreasy connect destroy");
        })
    },2000)

    return;
})

router.delete('/update/:_id', (req, res, next) => {
    let _id = req.params._id;
    let sql = "DELETE FROM receipt_detail WHERE receipt = " + _id;
    
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

    mysql_connection.query({sql:sql, timeout: 30000}, (err,rows,fields) => {
        if(!err){
            
            return res.status(200).json({
                message:"ลบข้อมูลสำเร็จ"
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

// C=> Created Detail Receipt
router.post('/detail/:_id', (req, res, next) => {
    let model = req.body;
    let _id = req.params._id;
    let sql;

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

    let round = model.length;
    for (let i = 0; i < round; i++) {
        sql = "INSERT INTO receipt_detail (name, price, receipt) VALUES ('" + model[i].name + "', " + model[i].price + " , " + _id + ")";    

        mysql_connection.query({sql:sql, timeout: 30000}, (err, rows, fields) => {
            if (!err) {
                if (i == round - 1) {
                    
                    return res.status(200).json({
                        item: rows.insertId,
                        detail: model
                    })
                }
            } else {
                console.log(sql);
                
                return res.status(500).json({
                    code: 500,
                    message: catchError(err.errno)
                })
            }
        })
    }

    setTimeout(function(){
        mysql_connection.on('connect', function(){
            mysql_connection.destroy();
            console.log("Database is alreasy connect destroy");
        })
    },2000)

    return;
})

// R => Retrieve All Receipt
router.get("/", (req, res, next) => {
    let sp, lp, skip, role, company;
    if (!req.query["sp"] || !req.query["lp"]) {
        sp = 0;
        lp = 5;
    } else {
        sp = req.query["sp"];
        lp = req.query["lp"];
    }

    let sql = "SELECT * FROM receipt";

    if (req.query["company"] != "" && req.query["role"] != "") {
        company = Object.values(req.query["company"])[0];
        role = Object.values(req.query["role"])[0];
        console.log(company)
        console.log(role)
        // 5 == all
        sql += " WHERE company=" + company + " AND view=1";
    }

    skip = sp * lp;



    console.log(sql);
    
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
    

    mysql_connection.query({sql:sql, timeout: 30000}, (err, rows, field) => {
        if (!err) {
            sql += " ORDER BY _id DESC";
            sql += " LIMIT " + skip + ", " + lp;
            mysql_connection.query({sql:sql, timeout: 30000}, (err, sub_rows, field) => {
                if (!err) {
                    
                    return res.status(200).json({
                        total_items: rows.length,
                        items: sub_rows,
                    });
                } else {
                    
                }
            })

        } else {
            
            console.log("********* ERROR ************");
            console.log(err)
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

router.get("/daily", (req, res, next) => {
    var current_date = new Date();
    var date = current_date.getDate();
    var month = current_date.getMonth() + 1;
    var year = current_date.getFullYear();
    var company=1;
    if(req.query["date"] && req.query["month"] && req.query["year"]){
        date = req.query["date"];
        month = req.query["month"];
        year = req.query["year"];
        company = req.query["company"]
    }

    var round;
    // 1095 1096
    var sql = "SELECT receipt AS receipt_id, receipt.dor, receipt.title, receipt.type,"
    sql += "category.name AS type,"
    sql += "SUM(CASE WHEN receipt_detail.name='ตรวจสภาพรถ' THEN price END) as inspection,"  
    sql += "SUM(CASE WHEN receipt_detail.name='พรบ' THEN price END) as act,"  
    sql += "SUM(CASE WHEN receipt_detail.name='ภาษี' THEN price END) as vat,"  
    sql += "SUM(CASE WHEN receipt_detail.name='ค่าบริการ' THEN price END) as fee,"
    sql += "SUM(CASE WHEN receipt_detail.name LIKE 'ประกันภัย%' THEN price END) as insurance,"
    sql += "SUM(CASE WHEN receipt_detail.name='แก๊ส' THEN price END) as gas,"
    sql += "SUM(CASE WHEN receipt_detail.name='CNG' THEN price END) as cng,"
    sql += "SUM(CASE WHEN receipt_detail.name='LPG' THEN price END) as lpg,"
    sql += "SUM(CASE WHEN receipt_detail.name='NGV' THEN price END) as ngv,"
    sql += "SUM(CASE WHEN receipt_detail.name='ฝากต่อ' THEN price END) as deposit,"
    sql += "IF(status=1,'เงินสด',IF(status=2,'โอนธนาคาร','เกิดข้อผิดพลาด')) as status,"
    sql += "receipt.total,"
    sql += "IF(SUM(CASE WHEN receipt_detail.name='ภาษี' THEN price END) IS NULL , 0, IF(receipt.type=3,10,20)) + SUM(CASE WHEN receipt_detail.name='ภาษี' THEN price END)  as detuct,"
    sql += "receipt.total - (IF(SUM(CASE WHEN receipt_detail.name='ภาษี' THEN price END) IS NULL , 0, IF(receipt.type=3,10,20)) + SUM(CASE WHEN receipt_detail.name='ภาษี' THEN price END)) as balance "
    sql += "FROM receipt_detail , receipt, category"
    sql += " WHERE receipt._id = receipt_detail.receipt"
    sql += " AND receipt.view = 1"
    sql += " AND receipt.company = " + company 
    sql += " AND receipt.type = category._id AND DAY(dor)=" + date + " AND MONTH(dor)=" + month + " AND YEAR(dor)=" + year
    sql += " GROUP BY receipt_detail.receipt"

    console.log(sql)
    
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

    mysql_connection.query({sql:sql, timeout: 30000}, (err, items, field) => {
        if (!err) {
            
            return res.status(200).json({
                total_items: items.length,
                items: items
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

router.get("/dailyDetail/:_id", (req, res, next) => {
    let _id = req.params._id; 
    var sql = "SELECT * FROM receipt_detail WHERE receipt=" + _id;
    
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

    mysql_connection.query({sql:sql, timeout: 30000}, (err, items, field) => {
        if (!err) {
            
            return res.status(200).json({
                items: items
            })
        }else{
            
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

// R => Retrieve All Receipt From Filter
router.get("/search", (req, res, next) => {
    let sp, lp, skip, role, company, filter;
    if (!req.query["sp"] || !req.query["lp"]) {
        sp = 0;
        lp = 5;
    } else {
        sp = req.query["sp"];
        lp = req.query["lp"];
    }

    let sql = "SELECT * FROM receipt";

    if (req.query["company"] != "" && req.query["role"] != "") {
        company = Object.values(req.query["company"])[0];
        role = Object.values(req.query["role"])[0];

        if (Object.values(req.query["textSearch"])[0] != "undefined") {
            filter = req.query["textSearch"]
        } else
            filter = "";

        console.log(req.query["textSearch"]);
        // 5 == all
        if (company == 5 && role == 1) {
            sql += " WHERE customer LIKE '%" + filter + "%' OR title LIKE '%" + filter + "%'";
        } else {
            sql += " WHERE company=" + company + " AND (customer LIKE '%" + filter + "%' OR title LIKE '%" + filter + "%' OR _id LIKE '%" + filter + "%')";
        }
    }

    skip = sp * lp;
    console.log(sql)
    
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

    mysql_connection.query({sql:sql, timeout: 30000}, (err, rows, field) => {
        if (!err) {
            sql += " ORDER BY _id DESC";
            sql += " LIMIT " + skip + ", " + lp;
            mysql_connection.query({sql:sql, timeout: 30000}, (err, sub_rows, field) => {
                if (!err) {
                    
                    return res.status(200).json({
                        total_items: rows.length,
                        items: sub_rows,
                    });
                } else {
                    
                    return res.status(500).json({
                        code: 500,
                        message: catchError(err.errno)
                    })
                }
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

router.get("/trash", (req, res, next) => {
    let sql = "SELECT receipt._id,title, receipt_no,dor, customer,category.name AS type, company.name AS company,member, receipt.status, receipt.updated , member.name, total FROM receipt, member, company, category WHERE view=0 AND member._id = receipt.deleted_by AND company._id = receipt.company AND category._id = receipt.type"
    
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

    mysql_connection.query({sql:sql, timeout: 30000}, (err, rows, field) => {
        if (!err) {
            
            return res.status(200).json({
                total_items: rows.length,
                items: rows
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
    },2000)

    return;
})

// R=> Retrive Receipt by ID
router.get("/:_id", (req, res, next) => {
    let _id = req.params._id;
    let sql = "SELECT receipt._id,receipt.address, receipt.status,receipt.receipt_no,receipt. dor,receipt.customer,receipt.title,receipt.type,receipt.total,receipt.company,member.name as member,receipt.created,receipt.updated FROM receipt , member WHERE receipt.member=member._id AND receipt._id = " + _id;
    
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

    mysql_connection.query({sql:sql, timeout: 30000}, (err, rows, field) => {
        if (!err) {
            sql = "SELECT * FROM receipt_detail WHERE receipt = " + _id;
            mysql_connection.query({sql:sql, timeout: 30000}, (err, sub_rows, field) => {
                if (!err) {
                    
                    return res.status(200).json({
                        total_items: sub_rows.length,
                        receipt: rows,
                        detail: sub_rows
                    })
                } else {
                    
                    return res.status(500).json({
                        code: 500,
                        message: catchError(err.errno)
                    })
                }
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

// U = Update Receipt
router.put('/', (req, res) => {
    let model = req.body;
    model.updated = new Date().getTime();
    model.dor = new Date().getTime();

    var sql = "UPDATE receipt SET receipt_no=" + model.receipt_no + ", dor=" + model.dor + ", title='" + model.title + "', type=" + model.type + ", total=" + model.total + ",company=" + model.company + ",member=" + model.member + ",updated=" + model.updated;
    sql += " WHERE _id=" + model._id

    console.log(sql)
    
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

    mysql_connection.query({sql:sql, timeout: 30000}, (err, rows, fields) => {
        if (!err) {
            
            return res.status(200).json({
                item: model
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

router.put('/total', (req, res) => {
    let model = req.body;
    let sql = "UPDATE receipt SET total=" + model.total + " WHERE _id=" + model._id;
    
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

    mysql_connection.query({sql:sql, timeout: 30000}, (err, rows, field) => {
        if (!err) {
            
            return res.status(200).json({
                receipt: rows
            })
        } else {
            
            return res.status(500).json({
                code: 500,
                message: catchError(err.err)
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

// U = Update Status Bill by ID
router.put('/status', (req, res) => {
    let model = req.body;
    let sql = "UPDATE receipt SET status=" + model.status + " WHERE _id=" + model._id;
    
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

    mysql_connection.query({sql:sql, timeout: 30000}, (err, rows, field) => {
        if (!err) {
            
            return res.status(200).json({
                receipt: rows
            })
        } else {
            
            return res.status(500).json({
                code: 500,
                message: catchError(err.err)
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

// U = Update Receipt detail
router.put('/detail/:_id', (req, res) => {
    let model = req.body;
    let _id = req.params._id

    let round = model.length;
    let sql;

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

    for (let i = 0; i < round; i++) {
        sql = "UPDATE receipt_detail SET name='" + model[i].name + "', price=" + model[i].price + " WHERE _id=" + _id;

        mysql_connection.query({sql:sql, timeout: 30000}, (err, rows, fields) => {
            if (!err) {
                
                if (i == round - 1) {
                    return res.status(200).json({
                        item: model
                    })
                }
            } else {
                
                return res.status(500).json({
                    code: 500,
                    message: catchError(err.errno)
                })
            }
        })
    }

    setTimeout(function(){
        mysql_connection.on('connect', function(){
            mysql_connection.destroy();
            console.log("Database is alreasy connect destroy");
        })
    },2000);

    return;
})

// D = Delete
router.patch('/:_id', (req, res) => {
    let _id = req.params._id;
    let sql = "UPDATE receipt SET view=" + req.body.view + ", deleted_by=" + req.body.user + " WHERE _id = " + _id;
    
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

    mysql_connection.query({sql:sql, timeout: 30000}, (err, rows, fields) => {
        if (!err) {
            
            return res.status(200).json({
                message: "ลบข้อมูลบริษัทสำเร็จ",
                affected: "ส่งผลกระทบกับ " + rows.affectedRows + " เรคคอร์ด"
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

router.delete('/:_id', (req, res) => {
    let _id = req.params._id;
    let sql = "DELETE FROM receipt WHERE _id = " + _id;
    
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

    mysql_connection.query({sql:sql, timeout: 30000}, (err, rows, field) => {
        if (!err) {
            sql = "DELETE FROM receipt_detail WHERE receipt = " + _id;
            mysql_connection.query({sql:sql, timeout: 30000}, (err, rows, field) => {
                if (!err) {
                    
                    return res.status(200).json({
                        message: "ลบข้อมูลบริษัทสำเร็จ",
                        affected: "ส่งผลกระทบกับ " + rows.affectedRows + " เรคคอร์ด"
                    })
                } else {
                    
                    return res.status(500).json({
                        code: 500,
                        message: catchError(err.errno)
                    })
                }
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