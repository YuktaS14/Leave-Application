const express = require("express");
const { dbConnect } = require("../data/database");
const router = express.Router();


const nodemailer = require("nodemailer");
const { resolve } = require("path");
const { start } = require("repl");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASSWORD

    }
})


transporter.verify((error, success) => {
    if (error) {
        console.log(error)
    }
    else {
        console.log("Ready for message");
        console.log(success)
    }
})


router.use( async (req,res,next) => {
    if (req.isAuthenticated()) {


    var facultyemail = req.user.emails[0].value

    // console.log(facultyemail)
    
    try {
        const result = await new Promise((resolve, reject) => {
            dbConnect.query(
                `select * from faculty where email = '${facultyemail}';`,
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });

        // temp.studentInfo = result.rows;
        // data = result.rows
        if( !result.rows.length ) {
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
} )



router.get("/", async (req, res, next) => {
    // res.render("admin.ejs")

    // var facultyemail = 'johnson@smail.iitpkd.ac.in'

    var facultyemail = req.user.emails[0].value

    // console.log(req.user.emails)

    var data = null

    try {
        const result = await new Promise((resolve, reject) => {
            dbConnect.query(
                `select * from leaveapplications natural join studentfaculty where faculty_email = '${facultyemail}' and fa_approval = 'Pending';`,
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });

        // temp.studentInfo = result.rows;
        data = result.rows

        // res.render("studentHomePage.ejs", obj );
    } catch (err) {
        next(err);
    }

    // console.log(data)

    res.render('faculty.ejs', { title: 'Leave Applications', action: 'list', data })

    // var viewData = 'select * from leaveApplications'
    // dbConnect.query(viewData, (err, result) => {
    //     if (err) throw err;
    //     else {
    //     }
    // })
})


router.get("/:rollId(\\d{9})",async (req,res)=>{
    // res.render("../views/approveForm.ejs")

    const facultyemail = req.user.emails[0].value
    const id  = req.params.rollId;

    // check for student

    try {
        const result = await new Promise((resolve, reject) => {
            dbConnect.query(
                `select * from studentfaculty where rollno = ${id} and faculty_email = '${facultyemail}'  ;`,
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });

        // temp.studentInfo = result.rows;
        data = result.rows

        // res.render("studentHomePage.ejs", obj );
    } catch (err) {
        next(err);
    }

    if( data.length == 0 ) {
        console.log('student not valid')
        res.redirect('/faculty')
        return
    }

    // console.log(req.params)
    var getForm = `select * from leaveApplications where rollno = ${id} and fa_approval = 'Pending'`
    dbConnect.query(getForm,(err,result)=>{
    if(err) throw err;
    else{
        console.log(result.rows[0])
        res.render('../views/facultyapproval.ejs',{data : result.rows[0]})
    }
});
});


router.post("/:rollId(\\d{9})", async (req, res) => {

    console.log('----------------<<<<')

    console.log(req.body);

    const id = req.body.regno;
    const status = req.body.status;
    const applied = req.body.leaveDays;
    const leftleaves = req.body.noOfLeavesLeft;
    const nameOfScholar = req.body.name;
    const typeOfLeave = req.body.leaveType;
    const startDate = req.body.leavefromdate;
    const endDate = req.body.leaveToDate;
    const tillDate = req.body.leaveToDate;

    console.log(startDate)

    // const FA_approval = req.body.FA_approval;
    // const PM_approval = req.body.PM_approval;
    if (req.body.comment == '') {
        comment = "-";
    }
    else {
        comment = req.body.comment;
    }


    // if (status == 'Not Approved') {
    //     var updateStatus = `Update leaveApplications set fa_approval = '${status}' where rollno = ${id}`
    //     dbConnect.query(updateStatus, (err, result) => {
    //         if (err) throw err;
    //     });
    // }
    // else {
    //     comment = req.body.comment;
    // }

    
    if (status == 'Not Approved') {
        var updateStatus = `Update leaveApplications set fa_approval = '${status}' 
        where rollno = ${id} and fromdate='${startDate}' and todate='${endDate}'`
        dbConnect.query(updateStatus, (err, result) => {
            if (err) throw err;
            else{
                res.redirect('/faculty')
                return
            }
        });
    }
    else if (status == 'Approved') {
        const newLeft = leftleaves - applied;
        // console.log(newLeft)
        var updateStatus = `Update leaveApplications set fa_approval = 'Approved' where rollno = ${id} and fromdate='${startDate}' and todate='${endDate}'`
        // var updateStatus = `Update leaveApplications set fa_approval = 'Approved' where rollno = ${id} and leavesleft = ${leftleaves}`
        // var updateLeaves = `Update studentinfo set leavesleft = ${newLeft} where rollno = ${id} and fromdate='${startDate}' and todate='${endDate}'`
        dbConnect.query(updateStatus, (err, result) => {
            if (err) throw err;
            else {
                console.log(result)
            }
        });
    }

    if (status !== 'Pending') {
        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: 'dalvimangesh000@gmail.com',
            subject: 'Leave Application',
            text: `
            Kindly check the leave Application form of:

            Roll No: ${id}
            Name:  ${nameOfScholar}
            Type Of Leave: ${typeOfLeave}
            Leave From:  ${startDate}       TO: ${tillDate} 
            FA Approval Status: ${status}            
            Additional Comment: ${comment}   
        `
        }
        transporter
            .sendMail(mailOptions)
            .then(() => {
                res.redirect('/faculty')
            })
            .catch((error) => {
                console.log(error);
                res.json({ status: 'Failed', message: "An Error Occurred!! " })
            })
    }
    else {
        res.redirect('/faculty')
    }

    // console.log(data)
});




// router.get('*', (req, res) => {
//     res.render('../views/page_not_found.ejs')
// })


module.exports = router;
