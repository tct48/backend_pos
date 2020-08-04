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
router.get("/", (req, res, next) => {
    var response=[];
    let sql="";
    // รายรับ 15 วันล่าสุด เดือนที่ 8 บริษัท ดีจัง
    

    for(let i=1;i<5;i++){
        sql = "SELECT dor, SUM(total) as total_price FROM receipt WHERE MONTH(dor)=8 AND company=" + i + " GROUP BY DAY(dor) ORDER BY DAY(dor) DESC LIMIT 15";
        mysql_connection.query(sql, (err, rows, field) => {
            if (!err) {
                response.push(rows[0])
                if(i==4){
                    return res.status(200).json({
                        items: response,
                    })
                }
            } else {
                return res.status(500).json({
                    code: 500,
                    message: catchError(err.errno)
                })
            }
        });
    }
});

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