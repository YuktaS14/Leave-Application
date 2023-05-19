const express = require("express");
const { dbConnect } = require("../data/database");
const router = express.Router();

router.use(async (req, res, next) => {
    if (req.isAuthenticated()) {
        var pmEmail = req.user.emails[0].value
        
        try{
            const result = await new Promise((resolve,reject)=>{
                dbConnect.query(
                    `select * from faculty where email = '${pmEmail}';`,
                    (err,result) => {
                        if (err){
                            reject(err);
                        }else{
                            resolve(result)
                        }
                    }
                );
            });
            // console.log(result)
            if(result.rows.length == 0){
                res.redirect("/failed")
                return}
        }catch(err) {next(err)};
        next();
    }
    else {
        res.render("login.ejs");
    }
})

router.get("/", async (req, res, next) => {
    // res.render("admin.ejs")

    // var projectMentorEmail = 'johnson@smail.iitpkd.ac.in'
    // var projectMentorEmail = req.params.EMAIL_ID
    const projectMentorEmail = req.user.emails[0].value
    var data = null

    try {
        const result = await new Promise((resolve, reject) => {
            dbConnect.query(
                `select * from leaveapplications natural join studentfaculty where projectmentor_email = '${projectMentorEmail}' and mentor_approval = 'Pending' and fa_approval <> 'Pending';`,
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });

        // console.log(results)
        // temp.studentInfo = result.rows;
        data = result.rows

        // res.render("studentHomePage.ejs", obj );
    } catch (err) {
        next(err);
    }

    // console.log(data)

    res.render('project_mentor.ejs', { title: 'Leave Applications', action: 'list', data })

})


router.get("/:rollId(\\d{9})", async (req, res) => {
    // res.render("../views/approveForm.ejs")
    // var data = null

    const id = req.params.rollId;

    const pmEmail = req.user.emails[0].value
    // console.log(req.params)

    //check if valid pm is viewing the student details
    try{
        const results = await new Promise((resolve,reject)=>{
            dbConnect.query(
                `select * from studentfaculty where rollno = ${id} and projectmentor_email = '${pmEmail}'  ;`,
                (err,result) =>{
                    if(err)
                        reject(err)
                    else
                        resolve(result);
                }
            );
        });
        // console.log(results)
        data = results.rows
    } 
    catch(err){
        next(err);
    }

    if(data.length ==0)
    {
        console.log("Student not enrolled under current user")
        res.redirect("/project_mentor")
        return
    }

    var getForm = `select * from leaveApplications where rollno = ${id} and mentor_approval = 'Pending' and fa_approval <> 'Pending'`
    dbConnect.query(getForm, (err, result) => {
        if (err) throw err;
        else {
            console.log(result.rows[0])
            res.render('../views/pmapproval.ejs', { data: result.rows[0] })
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
    const tillDate = req.body.leaveToDate;
    const endDate = req.body.leaveToDate;
    // const FA_approval = req.body.FA_approval;
    // const PM_approval = req.body.PM_approval;
    if (req.body.comment == '') {
        comment = "-";
    }
    else {
        comment = req.body.comment;
    }


    if (status == 'Not Approved') {
        var updateStatus = `Update leaveApplications set mentor_approval = '${status}' 
        where rollno = ${id} and fromdate='${startDate}' and todate='${endDate}'`
        dbConnect.query(updateStatus, (err, result) => {
            if (err) throw err;
            else{
                res.redirect('/pm')
            }
        });
    }
    else if (status == 'Approved') {
        const newLeft = leftleaves - applied;
        // console.log(newLeft)
        var updateStatus = `Update leaveApplications set mentor_approval = '${status}' where rollno = ${id} and fromdate='${startDate}' and todate='${endDate}'`
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
                res.redirect('/pm')
            })
            .catch((error) => {
                console.log(error);
                res.json({ status: 'Failed', message: "An Error Occurred!! " })
            })
    }
    else {
        res.redirect('/pm')
    }
    // console.log(data)
});




router.get('*', (req, res) => {
    res.render('../views/page_not_found.ejs')
})

module.exports = router;