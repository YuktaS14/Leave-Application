const express = require("express");
const { dbConnect } = require("../data/database");
const router = express.Router();


router.get("/", async (req, res, next) => {

    console.log(req.user.emails)

    const rollno = 112001001;
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

    // console.log(temp.studentInfo);

    // console.log(temp)

    res.render("studentHomePage.ejs", temp)
});

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
