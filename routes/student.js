const express = require("express");
const { dbConnect } = require("../data/database");
const router = express.Router();


router.get("/",(req,res,next)=>{

    rollno = 112001010

    let temp = {}

    async function fun() {

    await dbConnect.query(`select * from studentInfo where rollno = ${rollno}`, (err,result)=>{
        if(!err){
            console.log(result.rows);
            temp.name = result.rows;
        }
    });
    }

    fun()

    // dbConnect.query(`select * from leaveapplications where rollno = ${rollno}`,(err,result)=>{
    //     if(!err){
    //         // console.log(result.rows);
    //         result.leaveapplication = result.rows;
    //     }
    // });
    console.log('rishav')
    console.log(temp)
    console.log('rishav')

    // res.render("studentHomePage.ejs", obj )
});


module.exports = router;
