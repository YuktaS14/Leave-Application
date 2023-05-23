const express = require("express");
const { dbConnect } = require("../data/database");
const router = express.Router();


router.use(async (req, res, next) => {
    if (req.isAuthenticated()) {


        var userEmail = req.user.emails[0].value

        // console.log(facultyemail)

        try {
            const result = await new Promise((resolve, reject) => {
                dbConnect.query(
                    `SELECT * FROM studentinfo WHERE rollno = '${userEmail.split('@')[0]}'`,
                    (err, result) => {
                        if (err) {
                            // reject(err);
                            res.redirect('/failed')
                            return
                        } else {
                            resolve(result);
                        }
                    }
                );
            });

            // temp.studentInfo = result.rows;
            // data = result.rows
            if (!result.rows.length) {
                res.redirect('/failed')
                return
            }

            // res.render("studentHomePage.ejs", obj );
        } catch (err) {
            next(err);
        }

        next();
    }
    else {
        res.render("login.ejs");
    }
})



router.get("/", async (req, res, next) => {

    console.log(req.user.emails)

    const rollno = req.user.emails[0].value.split('@')[0];


    let temp = {};

    try {
        const result = await new Promise((resolve, reject) => {
            dbConnect.query(
                `SELECT * FROM studentInfo WHERE rollno = ${rollno}`,
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });

        temp.studentInfo = result.rows;

        // res.render("studentHomePage.ejs", obj );
    } catch (err) {
        next(err);
    }

    try {
        const result = await new Promise((resolve, reject) => {
            dbConnect.query(
                `SELECT * FROM leaveapplications WHERE rollno = ${rollno}`,
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });

        temp.leaveapplications = result.rows;

        // res.render("studentHomePage.ejs", obj );
    } catch (err) {
        next(err);
    }

    try {
        const result = await new Promise((resolve, reject) => {
            dbConnect.query(
                `SELECT date FROM holidays`,
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });

        // console.table(result.rows)

        temp.holidays = result.rows;

        // res.render("studentHomePage.ejs", obj );
    } catch (err) {
        next(err);
    }

    function getDepartment(rollNumber) {

        rollNumber = String(rollNumber)

        var getDept = { '10': 'Civil', '11': 'Computer Science', '12': 'Electrical', '13': 'Mechanical' };

        var getBatch = { '01': 'BTech', '02': 'MTech', '03': 'MS' }

        var obj = {};

        obj.department = getDept[rollNumber.substring(0, 2)]
        obj.batch = getBatch[rollNumber.substring(4, 6)]

        return obj;
    }

    temp.parseInfo = getDepartment(temp.studentInfo[0].rollno)



    try {
        const result = await new Promise((resolve, reject) => {
            dbConnect.query(
                `select sum(daysapplied) from leaveApplications where admin_approval = 'Approved' and rollno=${rollno}`,
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });

        // console.table(result.rows)

        temp.total_type_5 = result.rows[0].sum;

        // res.render("studentHomePage.ejs", obj );
    } catch (err) {
        next(err);
    }

    res.render("studentHomePage.ejs", temp)
});

// router.get('*', (req, res) => {
//     res.render('../views/page_not_found.ejs')
// })

// router.get("/", async (req,res,next)=>{

//     rollno = 112001010

//     let temp = {}

//     dbConnect.query(`select * from studentInfo where rollno = ${rollno}`, (err,result)=>{
//         if(!err){
//             console.log(result.rows);
//             temp.name = result.rows;
//         }
//         else {
//             throw err
//         }
//     });


//     // dbConnect.query(`select * from leaveapplications where rollno = ${rollno}`,(err,result)=>{
//     //     if(!err){
//     //         // console.log(result.rows);
//     //         result.leaveapplication = result.rows;
//     //     }
//     // });
//     console.log('rishav')
//     console.log(temp)
//     console.log('rishav')

//     // res.render("studentHomePage.ejs", obj )
// });


module.exports = router;
