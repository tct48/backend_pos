const express = require("express");
const router = express.Router();
const mysql = require("mysql");

// ประกาศตัวแปร แบบ Global
var mysql_connection = mysql.createConnection({
    host: "ns123.hostinglotus.net",
    user: "deejung1_ketar",
    password: "123456@q!",
    database: "deejung1_pos",
    multipleStatements: true,
});
mysql_connection.timeout=0;

// C => Created Receipt
router.post('/', (req, res, next) => {
    let model = req.body;
    model.created = new Date().getTime();
    model.updated = new Date().getTime();
    model.dor = new Date().getTime();
    // หาเลขที่ใบเสร็จที่มากที่สุด
    sql = "SELECT MAX(receipt_no) FROM receipt WHERE company=" + model.company;
    mysql_connection.query(sql, (err, rows, fields) => {
        model.receipt_no = 1;
        if (rows.receipt_no) {
            model.receipt_no = rows.receipt_no+1;
            console.log(rows);
        }
        var sql = "INSERT INTO receipt (receipt_no, customer, title, address, type, total, company, member, created, updated, status, view) VALUES (";
        sql += "" + model.receipt_no + ", '" + model.customer + "', '"  + model.title + "', '" + model.address + "', " + model.type + ", " + model.total + ", " + model.company + ", " + model.member + ", " + model.created + ", " + model.updated + ", 1,1)";
        console.log(sql)
        mysql_connection.query(sql, (err, rows, fields) => {
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
    })


})
// C=> Created Detail Receipt
router.post('/detail/:_id', (req, res, next) => {
    let model = req.body;
    let _id = req.params._id;
    let sql;

    let round = model.length;
    for (let i = 0; i < round; i++) {
        sql = "INSERT INTO receipt_detail (name, price, receipt) VALUES ('" + model[i].name + "', " + model[i].price + " , " + _id + ")";
        mysql_connection.query(sql, (err, rows, fields) => {
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

    if(req.query["company"]!="" && req.query["role"]!=""){
        company = Object.values(req.query["company"])[0];
        role = Object.values(req.query["role"])[0];
        console.log(company)
        console.log(role)
        // 5 == all
        sql += " WHERE company=" + company + " AND view=1";
    }
    
    skip = sp * lp;

    
    
    console.log(sql);

    mysql_connection.query(sql, (err, rows, field) => {
        if (!err) {
            sql+=" ORDER BY _id DESC";
            sql+=" LIMIT " + skip + ", " + lp;
            mysql_connection.query(sql, (err, sub_rows, field)=>{
                if(!err){
                    return res.status(200).json({
                        total_items: rows.length,
                        items: sub_rows,
                    });
                }else{

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
});

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

    if(req.query["company"]!="" && req.query["role"]!=""){
        company = Object.values(req.query["company"])[0];
        role = Object.values(req.query["role"])[0];

        if(Object.values(req.query["textSearch"])[0]!="undefined"){
            filter = req.query["textSearch"]
        }else
            filter="";
        
        console.log(req.query["textSearch"]);
        // 5 == all
        if(company==5 && role==1){
            sql += " WHERE customer LIKE '%" + filter + "%' OR title LIKE '%" + filter + "%'";
        }else{
            sql += " WHERE company=" + company + " AND (customer LIKE '%" + filter + "%' OR title LIKE '%" + filter + "%' OR _id LIKE '%" + filter + "%')";
        }
    }
    
    skip = sp * lp;
    console.log(sql)

    mysql_connection.query(sql, (err, rows, field) => {
        if (!err) {
            sql+=" ORDER BY _id DESC";
            sql+=" LIMIT " + skip + ", " + lp;
            mysql_connection.query(sql, (err,sub_rows, field)=> {
                if(!err){
                    return res.status(200).json({
                        total_items: rows.length,
                        items: sub_rows,
                    });
                }else{
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
});

router.get("/trash", (req, res, next)=>{
    let sql="SELECT receipt._id,title, receipt_no,dor, customer,category.name AS type, company.name AS company,member, receipt.status, receipt.updated , member.name, total FROM receipt, member, company, category WHERE view=0 AND member._id = receipt.deleted_by AND company._id = receipt.company AND category._id = receipt.type"
    mysql_connection.query(sql, (err, rows, field)=>{
        if(!err){
            return res.status(200).json({
                total_items:rows.length,
                items: rows
            })
        }else{
            return res.status(500).json({
                code: 500,
                message: catchError(err.errno)
            })
        }
    })
})

// R=> Retrive Receipt by ID
router.get("/:_id", (req, res, next) => {
    let _id = req.params._id;
    let sql = "SELECT receipt._id,receipt.address, receipt.status,receipt.receipt_no,receipt. dor,receipt.customer,receipt.title,receipt.type,receipt.total,receipt.company,member.name as member,receipt.created,receipt.updated FROM receipt , member WHERE receipt.member=member._id AND receipt._id = " + _id;

    mysql_connection.query(sql, (err, rows, field) => {
        if (!err) {
            sql = "SELECT * FROM receipt_detail WHERE receipt = " + _id;
            mysql_connection.query(sql, (err, sub_rows, field) => {
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
    })
})

// U = Update Receipt
router.put('/', (req, res) => {
    let model = req.body;
    model.updated = new Date().getTime();
    model.dor = new Date().getTime();

    var sql = "UPDATE receipt SET receipt_no=" + model.receipt_no + ", dor=" + model.dor + ", title='" + model.title + "', type=" + model.type + ", total=" + model.total + ",company=" + model.company + ",member=" + model.member + ",updated=" + model.updated;
    sql += " WHERE _id=" + model._id

    console.log(sql)
    mysql_connection.query(sql, (err, rows, fields) => {
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
    })
})

// U = Update Status Bill by ID
router.put('/status',(req, res)=>{
    let model = req.body;
    let sql = "UPDATE receipt SET status=" + model.status + " WHERE _id=" + model._id;
    mysql_connection.query(sql, (err, rows,field) => {
        if(!err){
            return res.status(200).json({
                receipt:rows
            })
        }else{
            return res.status(500).json({
                code: 500,
                message: catchError(err.err)
            })
        }
    })
})

// U = Update Receipt detail
router.put('/detail/:_id', (req, res) => {
    let model = req.body;
    let _id = req.params._id

    let round = model.length;
    let sql;

    for (let i = 0; i < round; i++) {
        sql = "UPDATE receipt_detail SET name='" + model[i].name + "', price=" + model[i].price + " WHERE _id=" + _id;
        mysql_connection.query(sql, (err, rows, fields) => {
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
})

// D = Delete
router.patch('/:_id', (req, res) => {
    let _id = req.params._id;
    let sql = "UPDATE receipt SET view=" + req.body.view + ", deleted_by=" + req.body.user + " WHERE _id = " + _id;
    mysql_connection.query(sql, (err, rows, fields) => {
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
})

router.delete('/:_id', (req, res)=>{
    let _id = req.params._id;
    let sql = "DELETE FROM receipt WHERE _id = " + _id;
    mysql_connection.query(sql, (err, rows, field)=>{
        if (!err) {
            sql = "DELETE FROM receipt_detail WHERE receipt = " + _id;
            mysql_connection.query(sql, (err, rows, field)=> {
                if(!err){
                    return res.status(200).json({
                        message: "ลบข้อมูลบริษัทสำเร็จ",
                        affected: "ส่งผลกระทบกับ " + rows.affectedRows + " เรคคอร์ด"
                    })
                }else{
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
    })
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