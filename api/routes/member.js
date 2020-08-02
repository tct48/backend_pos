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

// C => Created
router.post('/', (req, res, next)=>{
    let model = req.body;
    model.created = new Date().getTime();
    model.updated = new Date().getTime();
    var sql = "INSERT INTO member (name, username, password, role, status, company, created, updated) VALUES (";
    sql += "'" + model.name + "', '" + model.username + "', '" + model.password + "', " + model.role + ", " + model.status + ", " + model.company
    sql += ", " +  model.created  + ", " + model.updated +")";

    mysql_connection.query(sql, (err, rows, fields)=>{
        model.created = new Date(model.created);
        model.updated = new Date(model.updated);
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
  
    var sql = "SELECT * FROM member LIMIT " + sp + "," + lp;
  
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
    // var sql = "SET @EmpId = ?;SET @Name = ?; SET @EmpCode = ?; SET @Salary = ?; \
    // CALL EmployeeAddOrEdit(@EmpId,@Name,@EmpCode,@Salary)";
    model.updated = new Date().getTime();
    let sql = "UPDATE member SET name='" + model.name + "', username='" + model.username + "', password='" + model.password + "', role=" + model.role + ", status=" + model.status + ",company=" + model.company + ", updated=" + model.updated + "";
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

    var sql = "DELETE FROM member WHERE _id = " + _id
    mysql_connection.query(sql,(err,rows,fields)=>{
        if(!err){
            return res.status(200).json({
                message: "ลบข้อมูลพนักงานสำเร็จ",
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
        return "กรุณาเปลี่ยน Username ใหม่ !"
    }
}

module.exports = router;
