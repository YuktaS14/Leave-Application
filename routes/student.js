const express = require("express");
const { dbConnect } = require("../data/database");
const router = express.Router();


router.get("/", async (req, res, next) => {
    const rollno = 112001010;
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

        temp.studentInfo = result.rows[0];

        // res.render("studentHomePage.ejs", obj );
    } catch (err) {
        next(err);
    }

    console.log(temp.studentInfo.rollno);

    

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
