const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

// C => Created || SIGNUP
router.post('/', (req, res, next) => {
    let model = req.body;
    model.created = new Date().getTime();
    model.updated = new Date().getTime();

    bcrypt.hash(model.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        var sql = "INSERT INTO member (name, username, password, role, status, company, created, updated) VALUES (";
        sql += "'" + model.name + "', '" + model.username + "', '" + hash + "', " + model.role + ", " + 1 + ", " + model.company
        sql += ", " + model.created + ", " + model.updated + ")";
        model.password = hash;
        mysql_connection.query(sql, (err, rows, fields) => {
            model.created = new Date(model.created);
            model.updated = new Date(model.updated);
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

// R => Retrieve
router.get("/", (req, res, next) => {
    var sp, lp, skip, role, company, sql;
    if (!req.query["sp"] || !req.query["lp"]) {
        sp = 0;
        lp = 5;
    } else {
        sp = Object.values(req.query["sp"]);
        lp = Object.values(req.query["lp"]);
    }

    role=Object.values(req.query["role"])[0];
    company=Object.values(req.query["company"])[0];

    skip = sp * lp;
    if(role==1)
        sql = "SELECT * FROM member WHERE member.status!=0";
    else
        sql = "SELECT * FROM member WHERE member.status!=0 AND company=" + company;
    console.log(sql)
    mysql_connection.query(sql, (err, rows, field) => {
        if (!err) {
            var total_items = rows.length;
            if(role==1)
                sql = "SELECT member._id,member.name,member.username,member.password,member.role,member.status,company.name as company,member.created,member.updated \
                FROM member, company WHERE member.status!=0 AND member.company=company._id LIMIT " + skip + "," + lp;
            else
                sql = "SELECT member._id,member.name,member.username,member.password,member.role,member.status,company.name as company,member.created,member.updated \
                FROM member, company WHERE member.status!=0 AND company="+ company + " AND member.company=company._id LIMIT " + skip + "," + lp;
            console.log(sql)
            mysql_connection.query(sql, (err, rows, field) => {
                return res.status(200).json({
                    total_items: total_items,
                    items: rows,
                });
            })
        } else {
            console.log(err)
            return res.status(500).json({
                code: 500,
                text: err.name
            })
        }
    });
});

// R => Retrieve by ID
router.get("/:_id", (req, res, next) => {
    let _id = req.params._id;

    var sql = "SELECT * FROM member WHERE _id = " + _id;

    mysql_connection.query(sql, (err, rows, field) => {
        if (!err) {
            return res.status(200).json({
                total_items: rows.length,
                items: rows,
            });
        } else {
            return res.status(500).json({
                code: 500,
                text: err.name
            })
        }
    });
});

// U = Update
router.put('/', (req, res) => {
    let model = req.body;
    // var sql = "SET @EmpId = ?;SET @Name = ?; SET @EmpCode = ?; SET @Salary = ?; \
    // CALL EmployeeAddOrEdit(@EmpId,@Name,@EmpCode,@Salary)";
    model.updated = new Date().getTime();

    bcrypt.hash(model.password, 10, (err, hash) => {
        let sql = "UPDATE member SET name='" + model.name + "', username='" + model.username + "', password='" + hash + "', role=" + model.role + ", status=" + model.status + ",company=" + model.company + ", updated=" + model.updated + "";
        sql += " WHERE _id = " + model._id;

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
    });
})

// D = Delete
router.delete('/:_id', (req, res) => {
    let _id = req.params._id;

    var sql = "UPDATE member SET status=0 WHERE _id = " + _id
    mysql_connection.query(sql, (err, rows, fields) => {
        if (!err) {
            return res.status(200).json({
                message: "ลบข้อมูลพนักงานสำเร็จ",
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

// Login
router.post("/login", (req, res, next) => {
    let model = req.body;
    sql = "SELECT _id, username, password, name, role, company FROM member WHERE username ='" + model.username + "'";
    mysql_connection.query(sql, (err, rows, field) => {
        if (err) {
            return res.status(500).json({
                code: 500,
                message: catchError(err.errno)
            })
        }

        if (!rows[0]) {
            return res.status(500).json({
                code: 500,
                message: "model is " + err
            })
        }

        if (!rows[0].password) {
            return res.status(500).json({
                code: 500,
                message: "model is " + err
            })
        }

        bcrypt.compare(model.password, rows[0].password, (err, result) => {
            if (err) {
                return res.status(500).json({
                    code: 500,
                    message: catchError(err.errno)
                })
            }

            if (result == false) {
                return res.status(500).json({
                    code: 500,
                    message: "Username หรือ Password ไม่ถูกต้อง !"
                })
            }

            if (result == true) {
                sql = "UPDATE member SET updated = " + new Date().getTime();
                mysql_connection.query(sql, (err, sub_rows, field) => {
                    if (!err) {
                        const token = jwt.sign({
                                username: rows[0].username,
                                userId: rows[0]._id,
                            },
                            "secret", {
                                expiresIn: "24h",
                            }
                        );
                        accessToken = token;

                        return res.status(200).json({
                            code: 200,
                            message: "Auth Successful",
                            user: rows[0],
                            accessToken: token
                        })
                    }
                    return res.status(500).json({
                        code: 500,
                        message: catchError(err.errno)
                    })
                })
            }
        })

    });
})

function catchError(code) {
    if (code == "1062") {
        return "กรุณาเปลี่ยน Username ใหม่ !"
    }
}

module.exports = router;