const express = require("express");
const router = express.Router();
const mysql = require("mysql");

// ประกาศตัวแปร แบบ Global
var mysql_connection = mysql.createConnection({
    host: "ns117.hostinglotus.net",
    user: "dntcom_dao",
    password: "123456@q!",
    database: "dntcom_deejung",
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
    mysql_connection.query(sql, (err, rows, fields) => {
        model.receipt_no = 1;
        if (rows.receipt_no) {
            model.receipt_no = rows.receipt_no;
        }
        var sql = "INSERT INTO receipt (receipt_no, dor, customer, title, type, total, company, member, created, updated) VALUES (";
        sql += "" + model.receipt_no + ", " + model.dor + ", '" + model.customer + "', "  + model.title + "', " + model.type + ", " + model.total + ", " + model.company + ", " + model.member + ", " + model.created + ", " + model.updated + ")";

        mysql_connection.query(sql, (err, rows, fields) => {
            if (!err) {
                return res.status(200).json({
                    item: rows.insertId,
                    detail: model
                })
            } else {
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
    let sp, lp, skip;
    if (!req.query["sp"] || !req.query["lp"]) {
        sp = 0;
        lp = 5;
    } else {
        sp = Object.values(req.query["sp"]);
        lp = Object.values(req.query["lp"]);
    }

    skip = sp * lp;

    let sql = "SELECT * FROM receipt LIMIT " + sp + "," + lp;

    mysql_connection.query(sql, (err, rows, field) => {
        if (!err) {
            return res.status(200).json({
                total_items: rows.length,
                items: rows,
            });
        } else {
            return res.status(500).json({
                code: 500,
                message: catchError(err.errno)
            })
        }
    });
});

// R=> Retrive Receipt by ID
router.get("/:_id", (req, res, next) => {
    let _id = req.params._id;
    let sql = "SELECT receipt_no, dor, title, type, total, company, member, created, updated FROM receipt WHERE _id = " + _id;
    console.log(sql)
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
router.delete('/:_id', (req, res) => {
    let _id = req.params._id;

    let sql = "DELETE FROM receipt WHERE _id = " + _id
    mysql_connection.query(sql, (err, rows, fields) => {
        if (!err) {
            sql = "DELETE FROM receipt_detail WHERE receipt = " + _id;
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