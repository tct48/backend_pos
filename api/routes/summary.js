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

// R => Retrieve All Receipt
router.get("/:company", (req, res, next) => {
    let sql="";
    // รายรับ 15 วันล่าสุด เดือนที่ 8 บริษัท ดีจัง
    // SELECT dor, SUM(total) as total_price FROM receipt WHERE company=1 GROUP BY MONTH(dor) ORDER BY MONTH(dor) DESC LIMIT 7
    let company = req.params.company;
    sql = "SELECT _id, dor, SUM(total) as total_price FROM receipt WHERE MONTH(dor)=8 AND company=" + company + " GROUP BY DAY(dor) ORDER BY DAY(dor) LIMIT 15";
    mysql_connection.query(sql, (err, rows, field) => {
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
});

router.get("/month/:company", (req, res, next)=> {
    let sql="";
    let company = req.params.company;

    sql="SELECT _id, dor, SUM(total) as total_price FROM `receipt` WHERE company=" + company + " GROUP BY MONTH(dor) ORDER BY MONTH(dor) LIMIT 7";
    mysql_connection.query(sql, (err, rows, field) => {
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