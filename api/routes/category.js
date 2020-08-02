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
router.post('/', (req, res, next)=>{
    let model = req.body;

    var sql = "INSERT INTO category (name) VALUES (";
    sql += "" + model.name + ")";

    mysql_connection.query(sql, (err, rows, fields)=>{
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
})

// R => Retrieve All Receipt
router.get("/", (req, res, next) => {
    let sql = "SELECT * FROM category";
  
    mysql_connection.query(sql, (err, rows, field) => {
      if(!err){
          return res.status(200).json({
              total_items: rows.length,
              items: rows,
            });
      }else{
          return res.status(500).json({
              code: 500,
              message: catchError(err.errno)
          })
      }
    });
});

// U = Update Receipt
router.put('/', (req, res)=>{
    let model = req.body;

    var sql = "UPDATE category SET name=" + model.name;
    sql += " WHERE _id=" + model._id

    mysql_connection.query(sql,(err,rows,fields)=>{
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
})

// D = Delete
router.delete('/:_id', (req, res)=>{
    let _id = req.params._id;

    let sql = "DELETE FROM category WHERE _id = " + _id
    mysql_connection.query(sql,(err,rows,fields)=>{
        if(!err){
            return res.status(200).json({
                message: "ลบข้อมูลประเภทรถสำเร็จ",
                affected: "ส่งผลกระทบกับ " + rows.affectedRows + " เรคคอร์ด"
            })
        }else{
            return res.status(500).json({
                code: 500,
                message: catchError(err.errno)
            })
        }
    })
})

function catchError(code){
    if(code=="1062"){
        return "มีใบเสร็จอยู่ในระบบแล้ว !";
    }else if(code == "1064"){
        return "SQL Syntax ผิดพลาด";
    }else if(code == "1054"){
        return "ชุดข้อมูลมีค่าว่าง";
    }else if(code == "1136"){
        return "ชุดข้อมูลมีประเภทข้อมูลไม่ตรงตามที่กำหนด"
    }else if(code == "1366"){
        return "please updated field to utf8"
    }
}

module.exports = router;
