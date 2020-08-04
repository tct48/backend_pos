const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

// ประกาศตัวแปร แบบ Global
var mysql_connection = mysql.createConnection({
  host: "ns117.hostinglotus.net",
  user: "dntcom_dao",
  password: "123456@q!",
  database: "dntcom_deejung",
  multipleStatements: true,
});
mysql_connection.timeout=0;

// C => Created
router.post('/', (req, res, next)=>{
    let model = req.body;

    var sql = "INSERT INTO company (name) VALUES (";
    sql += "'" + model.name + "')";

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
  
    mysql_connection.query(sql, (err, rows, field) => {
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
  });

// U = Update
router.put('/', (req, res)=>{
    let model = req.body;

    let sql = "UPDATE company SET name='" + model.name + "'";
    sql+= " WHERE _id = " + model._id;

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

    var sql = "DELETE FROM company WHERE _id = " + _id
    mysql_connection.query(sql,(err,rows,fields)=>{
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

module.exports = router;
