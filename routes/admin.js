const express = require("express")
const router = express.Router();
const { dbConnect } = require("../data/database");

const nodemailer = require("nodemailer")

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

router.get("/", (req, res) => {
    // res.render("admin.ejs")

    // console.log('Here')

    console.log(req)

    // console.log('Here')

    var viewData = `select * from leaveApplications where admin_approval = 'Pending' `
    dbConnect.query(viewData, (err, result) => {
        if (err) throw err;
        else {
            res.render('admin.ejs', { title: 'Leave Applications', action: 'list', data: result.rows })
        }
    });
});


router.post("/", async (req, res) => {
    var event = req.body.event;
    var date = req.body.date;
    var day = req.body.day;
    var type = req.body.type;
    var addHoliday = `
    INSERT INTO holidays (holiday,date,day,type)
    VALUES ('${event}','${date}','${day}','${type}')
    `;
    dbConnect.query(addHoliday, (err, result) => {
        if (err) throw err;
        else {
            console.log(req.body);

            res.status(200).send('Added Holiday');
            res.end();
            //   res.redirect("/admin")

        }
    })

});




router.get("/addStudent", (req, res) => {
    res.render("../views/AddStudent.ejs", { message: req.flash('studentInsert') });
});


router.post("/addStudent", (req, res) => {
    var rollNo = req.body.RollNo;
    var name = req.body.name;
    var leaves = req.body.leavesAlloted;
    var FA = req.body.FA;
    var PM = req.body.PM;
    var insertData = `
    INSERT INTO studentfaculty (rollno,name,facultyadvisor,projectmentor)
    VALUES (${rollNo},'${name}','${FA}','${PM}')
    `;

    var insertData2 = `
    INSERT INTO studentinfo (rollno,name,leavesleft)
    VALUES (${rollNo},'${name}',${leaves})
    `;
    dbConnect.query(insertData, (err, result) => {
        if (err) throw err;
        else {
            dbConnect.query(insertData2, (err, result) => {
                if (err) throw err;
                else {
                    req.flash('studentInsert', 'Added to database successfully!! ');
                    res.redirect("/admin/addStudent")
                }
            })
        }
    });
    console.log(req.body);
});

router.get("/deleteStudent", (req, res) => {
    res.render("../views/DeleteStudent.ejs", { message: req.flash('studentDelete') });
});


router.post("/deleteStudent", (req, res) => {
    var rollNo = req.body.RollNo;
    var name = req.body.name;
    var deleteData = `
    DELETE FROM studentFaculty where rollNo = ${rollNo}
    `;
    var deleteData2 = `
    DELETE FROM studentInfo where rollNo = ${rollNo}
    `;
    dbConnect.query(deleteData, (err, result) => {
        if (err) throw err;
        else {
            dbConnect.query(deleteData2, (err, result) => {
                if (err) throw err;
                else {
                    req.flash('studentDelete', 'Deleted from the database successfully!! ');
                    res.redirect("/admin/deleteStudent")
                }
            })
        }
    });
    console.log(req.body);
});

router.get("/addTA", (req, res) => {
    res.render("../views/AddTA.ejs", { message: req.flash('taInsert') });
});


router.post("/addTA", (req, res) => {
    var rollNo = req.body.RollNo;
    var name = req.body.name;
    var course = req.body.course;
    var insertTA = `
    INSERT INTO tainstructor values
    (${rollNo},'${name}', '${course}');
    `;

    dbConnect.query(insertTA, (err, result) => {
        if (err) throw err;
        else {

            req.flash('taInsert', 'Inserted TA into database successfully!! ');
            res.redirect("/admin/addTA")
        }
    });
    console.log(req.body);
});

router.get("/deleteTA", (req, res) => {
    res.render("../views/DeleteTA.ejs", { message: req.flash('taDelete') });
});


router.post("/deleteTA", (req, res) => {
    var rollNo = req.body.RollNo;
    var deleteTA = `
    DELETE FROM tainstructor where rollNo = (${rollNo});
    `;

    dbConnect.query(deleteTA, (err, result) => {
        if (err) throw err;
        else {

            req.flash('taDelete', 'Deleted TA from the database successfully!! ');
            res.redirect("/admin/deleteTA")
        }
        console.log(req.body);
    });
});


router.get("/addFaculty", (req, res) => {
    res.render("../views/AddFaculty.ejs", { message: req.flash('facultyInsert') });
});


router.post("/addFaculty", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var insertFaculty = `
    INSERT INTO faculty values
    ('${name}', '${email}');
    `;

    dbConnect.query(insertFaculty, (err, result) => {
        if (err) throw err;
        else {

            req.flash('facultyInsert', 'Inserted faculty into database successfully!! ');
            res.redirect("/admin/addFaculty")
        }
    });
    console.log(req.body);
});




router.get("/deleteFaculty", (req, res) => {
    res.render("../views/DeleteFaculty.ejs", { message: req.flash('deleteFaculty') });

});

router.post("/deleteFaculty", (req, res) => {
    var email = req.body.email;
    var deleteFaculty = `
    DELETE FROM faculty where email = '${email}'
    `;

    dbConnect.query(deleteFaculty, (err, result) => {
        if (err) throw err;
        else {

            req.flash('deleteFaculty', 'Deleted faculty from the database successfully!! ');
            res.redirect("/admin/deleteFaculty")
        }
        console.log(req.body);
    })
});

router.get("/updateFA", (req, res) => {
    res.render("../views/ChangeFa.ejs", { message: req.flash('updateFA') });

});

router.post("/updateFA", (req, res) => {
    var rollNo = req.body.RollNo;
    var FAnew = req.body.FAnew
    var updateFA = `
    UPDATE studentFaculty SET facultyadvisor = '${FAnew}' where rollNo = ${rollNo} 
    `;

    dbConnect.query(updateFA, (err, result) => {
        if (err) throw err;
        else {

            req.flash('updateFA', 'Updated Faculty Advisor successfully!! ');
            res.redirect("/admin/updateFA")
        }
        console.log(req.body);
    })
});


router.get("/updatePM", (req, res) => {
    res.render("../views/ChangeProjectMentor.ejs", { message: req.flash('updatePM') });

});

router.post("/updatePM", (req, res) => {
    var rollNo = req.body.RollNo;
    var PMnew = req.body.PMnew;
    var updatePM = `
    UPDATE studentFaculty SET projectmentor = '${PMnew}' where rollNo = ${rollNo} 
    `;

    dbConnect.query(updatePM, (err, result) => {
        if (err) throw err;
        else {

            req.flash('updatePM', 'Updated Project Mentor successfully!! ');
            res.redirect("/admin/updatePM")
        }
        console.log(req.body);
    })
});



router.get("/updateInstructor", (req, res) => {
    res.render("../views/ChangeInstructor.ejs", { message: req.flash('updateInstructor') });

});

router.post("/updateInstructor", (req, res) => {
    var rollNo = req.body.RollNo;
    var instructor = req.body.Instructor;
    var updateInstructor = `
    UPDATE tainstructor SET instructorname = '${instructor}' where rollNo = ${rollNo} 
    `;

    dbConnect.query(updateInstructor, (err, result) => {
        if (err) throw err;
        else {

            req.flash('updateInstructor', 'Updated Instructor successfully!! ');
            res.redirect("/admin/updateInstructor")
        }
        console.log(req.body);
    })
});

router.get("/:rollId", (req, res) => {
    // res.render("../views/approveForm.ejs")
    const id = req.params.rollId;
    // console.log(req.params)
    var getForm = `select * from leaveApplications where rollno = ${id} and admin_approval = 'Pending'`
    dbConnect.query(getForm, (err, result) => {
        if (err) throw err;
        else {
            console.log(result.rows[0])
            res.render('../views/approveForm.ejs', { data: result.rows[0] })
        }
    });
});

router.post("/:rollId", async (req, res) => {
    console.log(req.body);

    const id = req.body.regno;
    const status = req.body.status;
    const applied = req.body.leaveDays;
    const leftleaves = req.body.noOfLeavesLeft;
    const nameOfScholar = req.body.name;
    const typeOfLeave = req.body.leaveType;
    const startDate = req.body.leavefromdate;
    const tillDate = req.body.leaveToDate;
    const FA_approval = req.body.FA_approval;
    const PM_approval = req.body.PM_approval;
    if (req.body.comment == '') {
        comment = "-";
    }
    else {
        comment = req.body.comment;
    }


    if (status == 'Not Approved') {
        var updateStatus = `Update leaveApplications set admin_approval = '${status}' where rollno = ${id}`
        dbConnect.query(updateStatus, (err, result) => {
            if (err) throw err;
        });
    }
    else if (status == 'Approved') {
        const newLeft = leftleaves - applied;
        // console.log(newLeft)
        var updateStatus = `Update leaveApplications set admin_approval = '${status}' where rollno = ${id}`
        var updateLeaves = `Update studentinfo set leavesleft = ${newLeft} where rollno = ${id}`
        dbConnect.query(updateStatus, (err, result) => {
            if (err) throw err;
            else {
                dbConnect.query(updateLeaves, (err, result2) => {
                    if (err) throw err;
                })
            }

        });

    }


    if (status !== 'Pending') {
        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: 'salunkheyukta14@gmail.com',
            subject: 'Leave Application',
            text: `Your Leave has been ${status}
            Details: 
            Roll No: ${id}
            Name:  ${nameOfScholar}
            Type Of Leave: ${typeOfLeave}
            Leave From:  ${startDate}       TO: ${tillDate} 
            FA Approval Status: ${FA_approval}
            Project Mentor Approval Status:  ${PM_approval}
            Admin Approval Status:  ${status}
            
            Additional Comment: ${comment}
            
        `
        }
        await transporter
            .sendMail(mailOptions)
            .then(() => {
                // res.json({
                // status:"Success",
                // message: "Message Sent Successfully!! "})
                res.redirect('/admin')
            })
            .catch((error) => {
                console.log(error);
                res.json({ status: 'Failed', message: "An Error Occurred!! " })
            })
    }


    // console.log(data)
});


// router.post("/",(req,res)=>{
//     consolr.log(req);
//     var viewData = 'select * from studentInfo'
//     dbConnect.query(viewData,(err,result)=>{
//         if(err) throw err;
//         else{
//             res.render('admin.ejs',{title:'Leave Applications',action:'list',sampleData:result})
//         }
//     });
// });

///4 buttons
///render in the same page

// router.get("/updateData",(req,res)=>{
//     res.render("admin.ejs")
// });

// router.get("/taFaculty",(req,res)=>{
//     res.render("admin.ejs")
// });

// router.get("/view",(req,res)=>{
//     res.render("admin.ejs")
// });

// router.get("/addHolidays",(req,res)=>{
//     res.render("admin.ejs")
// });


module.exports = router;