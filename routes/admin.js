const express = require("express")
const router = express.Router();
const { dbConnect } = require("../data/database");

const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const { Readable } = require('stream');

const upload = multer();

const nodemailer = require("nodemailer");
const { resolve } = require("path");
const { title } = require("process");

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

router.use(async (req, res, next) => {

    if (req.isAuthenticated()) {

        const email = req.user.emails[0].value

        if (email == process.env.ADMIN_EMAIL) {
            next()
        }
        else {
            res.redirect('/failed')
        }

    }
    else {
        res.render("login.ejs");
    }
})



router.get("/", (req, res) => {
    // res.render("admin.ejs")

    // console.log('Here')

    // console.log(req.admin)

    // console.log('Here')

    if (req.user == undefined) {
        res.redirect('/login')
        return
    }

    // console.log('Here')
    const pendingAppl = new Promise((resolve, reject) => {
        let viewData = `select * from leaveApplications where admin_approval = 'Pending' and fa_approval <> 'Pending' and mentor_approval <> 'Pending'`;
        dbConnect.query(viewData, (err, result) => {
            if (err) reject(err);
            else {
                resolve(result);
            }
        });

    });

    // const allAppl = new Promise((resolve,reject) =>{
    //     let allData = `select * from leaveApplications` ;
    //     dbConnect.query(allData, (err, result) => {
    //         if (err) reject(err);
    //         else {
    //             resolve(result);
    //         }
    //     }); 

    // });

    Promise.all([pendingAppl])
        .then((results) => {
            // console.log(results[0].rows);
            res.render("admin.ejs", { data: (results[0].rows) })
        })
        .catch(error => {
            console.error(error);
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

// incomplete
router.get("/viewstudentfaculty", (req, res) => {

    var q = `select * from studentfaculty`;

    dbConnect.query(q, async (err, result) => {
        if (err) throw err;
        else {
            res.render("../views/student_faculty.ejs", { title: 'Leave Applications', action: 'list', data: result.rows });
        }
    });
    // error
    return
});

router.get("/addStudent", (req, res) => {

    var q = `select * from faculty`;

    dbConnect.query(q, async (err, result) => {
        if (err) throw err;
        else {
            // res.render('admin.ejs', { title: 'Leave Applications', action: 'list', data: result.rows })
            result.rows.sort((a, b) => a.name.localeCompare(b.name))
            console.log(result.rows)
            res.render("../views/AddStudent.ejs", { message: req.flash('studentInsert'), faculty_list: result.rows });
        }
    });
    // error
    return
});


router.post("/addStudent", (req, res) => {
    var rollNo = req.body.RollNo;
    var name = req.body.name;
    var leaves = req.body.leavesAlloted;
    var FA = req.body.fa;
    var PM = req.body.pm;
    var insertData = `
    INSERT INTO studentfaculty (rollno,name,faculty_email,projectmentor_email)
    VALUES (${rollNo},'${name}','${FA}','${PM}')
    `;

    var insertData2 = `
    INSERT INTO studentinfo (rollno,name,leavesleft,overflow)
    VALUES (${rollNo},'${name}',${leaves},0)
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

    var q = `select * from studentInfo`;

    dbConnect.query(q, async (err, result) => {
        if (err) throw err;
        else {
            // res.render('admin.ejs', { title: 'Leave Applications', action: 'list', data: result.rows })
            result.rows.sort((a, b) => a.name.localeCompare(b.name))
            console.log(result.rows)
            // res.render("../views/AddStudent.ejs", { message: req.flash('studentInsert'), faculty_list: result.rows });
            res.render("../views/DeleteStudent.ejs", { message: req.flash('studentDelete'), student_list: result.rows });
        }
    });
    // error
    return
});


router.post("/deleteStudent", (req, res) => {
    var rollNo = req.body.RollNo;
    var name = req.body.name;
    var deleteData = `
    DELETE FROM studentFaculty where rollno = ${rollNo}
    `;
    var deleteData2 = `
    DELETE FROM studentInfo where rollno = ${rollNo}
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


    var q = ` select studentinfo.name as s_name,studentinfo.rollno as s_rollno from studentInfo`;

    dbConnect.query(q, async (err, result) => {
        if (err) throw err;
        else {
            // res.render('admin.ejs', { title: 'Leave Applications', action: 'list', data: result.rows })
            // res.render("../views/AddStudent.ejs", { message: req.flash('studentInsert'), faculty_list: result.rows });
            // res.render("../views/DeleteStudent.ejs", { message: req.flash('studentDelete') , student_list : result.rows});

            q = ` select faculty.name as f_name,faculty.email as f_email from faculty`;

            dbConnect.query(q, async (err, result1) => {
                if (err) throw err;
                else {
                    // res.render('admin.ejs', { title: 'Leave Applications', action: 'list', data: result.rows })
                    // res.render("../views/AddStudent.ejs", { message: req.flash('studentInsert'), faculty_list: result.rows });
                    // res.render("../views/DeleteStudent.ejs", { message: req.flash('studentDelete') , student_list : result.rows});
                    console.log(result1.rows)
                    res.render("../views/AddTA.ejs", { message: req.flash('taInsert'), data: result1.rows, data1: result.rows });
                    // res.render("../views/AddTA.ejs", { message: req.flash('taInsert') });
                }
            });

            // console.log(result.rows)
            // res.render("../views/ChangeFa.ejs", { message: req.flash('updateFA') , data : result.rows});
        }
    });
    // error
    return
});


router.post("/addTA", (req, res) => {
    var rollNo = req.body.RollNo;
    var name = req.body.name;
    var course = req.body.course;
    var insertTA = `
    INSERT INTO tainstructor values
    (${rollNo},'${course}','${name}');
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


    var q = ` select * from studentInfo `;

    dbConnect.query(q, async (err, result) => {
        if (err) throw err;
        else {
            // res.render('admin.ejs', { title: 'Leave Applications', action: 'list', data: result.rows })
            // res.render("../views/AddStudent.ejs", { message: req.flash('studentInsert'), faculty_list: result.rows });
            res.render("../views/DeleteTA.ejs", { message: req.flash('taDelete'), student_list: result.rows });
        }
    });
    // error
    return
    // res.render("../views/DeleteTA.ejs", { message: req.flash('taDelete') });
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
    console.log(req.body)
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

    var q = `select * from faculty`;

    dbConnect.query(q, async (err, result) => {
        if (err) throw err;
        else {
            // res.render('admin.ejs', { title: 'Leave Applications', action: 'list', data: result.rows })
            // res.render("../views/AddStudent.ejs", { message: req.flash('studentInsert'), faculty_list: result.rows });

            q = `select faculty_email as not_available from studentfaculty union select projectmentor_email as not_available from studentfaculty`;

            dbConnect.query(q, async (err, result1) => {
                if (err) throw err;
                else {
                    // res.render('admin.ejs', { title: 'Leave Applications', action: 'list', data: result.rows })
                    // res.render("../views/AddStudent.ejs", { message: req.flash('studentInsert'), faculty_list: result.rows });
                    console.log(result1.rows)
                    res.render("../views/DeleteFaculty.ejs", { message: req.flash('taDelete'), faculty_list: result.rows, not_available: result1.rows });
                }
            });

            // res.render("../views/DeleteFaculty.ejs", { message: req.flash('taDelete'), faculty_list: result.rows });
        }
    });
    // error
    return

    // res.render("../views/DeleteFaculty.ejs", { message: req.flash('deleteFaculty') });

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

    var q = `select studentinfo.name as s_name,studentinfo.rollno as s_rollno from studentInfo`;

    dbConnect.query(q, async (err, result) => {
        if (err) throw err;
        else {
            // res.render('admin.ejs', { title: 'Leave Applications', action: 'list', data: result.rows })
            // res.render("../views/AddStudent.ejs", { message: req.flash('studentInsert'), faculty_list: result.rows });
            // res.render("../views/DeleteStudent.ejs", { message: req.flash('studentDelete') , student_list : result.rows});

            q = `select faculty.name as f_name,faculty.email as f_email from faculty`;

            dbConnect.query(q, async (err, result1) => {
                if (err) throw err;
                else {
                    // res.render('admin.ejs', { title: 'Leave Applications', action: 'list', data: result.rows })
                    // res.render("../views/AddStudent.ejs", { message: req.flash('studentInsert'), faculty_list: result.rows });
                    // res.render("../views/DeleteStudent.ejs", { message: req.flash('studentDelete') , student_list : result.rows});
                    console.log(result1.rows)
                    res.render("../views/ChangeFa.ejs", { message: req.flash('updateFA'), data: result1.rows, data1: result.rows });
                }
            });

            // console.log(result.rows)
            // res.render("../views/ChangeFa.ejs", { message: req.flash('updateFA') , data : result.rows});
        }
    });
    // error
    return
});

router.post("/updateFA", (req, res) => {
    var rollNo = req.body.RollNo;
    var FAnew = req.body.FAnew
    var updateFA = `
    UPDATE studentFaculty SET faculty_email = '${FAnew}' where rollNo = ${rollNo} 
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
    // res.render("../views/ChangeProjectMentor.ejs", { message: req.flash('updatePM') });
    var q = ` select studentinfo.name as s_name,studentinfo.rollno as s_rollno from studentInfo`;

    dbConnect.query(q, async (err, result) => {
        if (err) throw err;
        else {
            // res.render('admin.ejs', { title: 'Leave Applications', action: 'list', data: result.rows })
            // res.render("../views/AddStudent.ejs", { message: req.flash('studentInsert'), faculty_list: result.rows });
            // res.render("../views/DeleteStudent.ejs", { message: req.flash('studentDelete') , student_list : result.rows});

            q = ` select faculty.name as f_name,faculty.email as f_email from faculty`;

            dbConnect.query(q, async (err, result1) => {
                if (err) throw err;
                else {
                    // res.render('admin.ejs', { title: 'Leave Applications', action: 'list', data: result.rows })
                    // res.render("../views/AddStudent.ejs", { message: req.flash('studentInsert'), faculty_list: result.rows });
                    // res.render("../views/DeleteStudent.ejs", { message: req.flash('studentDelete') , student_list : result.rows});
                    console.log(result1.rows)
                    res.render("../views/ChangeProjectMentor.ejs", { message: req.flash('updateFA'), data: result1.rows, data1: result.rows });
                }
            });
        }
    });
    // error
    return

});

router.post("/updatePM", (req, res) => {
    var rollNo = req.body.RollNo;
    var PMnew = req.body.PMnew;
    var updatePM = `
    UPDATE studentFaculty SET projectmentor_email = '${PMnew}' where rollNo = ${rollNo} 
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

router.get("/getAll", (req, res) => {

    let getAppl = `
        select * from leaveapplications`;

    dbConnect.query(getAppl, (err, result) => {
        if (err) throw err;
        else {
            console.log('-----------------------------------------------------')
            console.log(result.rows)
            console.log('-----------------------------------------------------')
            res.render("allAppl.ejs", { allAppl: result.rows })
        }
    })
})

router.get("/updateInstructor", (req, res) => {

    var q = `select studentinfo.name as s_name,studentinfo.rollno as s_rollno from studentInfo`;

    dbConnect.query(q, async (err, result) => {
        if (err) throw err;
        else {
            // res.render('admin.ejs', { title: 'Leave Applications', action: 'list', data: result.rows })
            // res.render("../views/AddStudent.ejs", { message: req.flash('studentInsert'), faculty_list: result.rows });
            // res.render("../views/DeleteStudent.ejs", { message: req.flash('studentDelete') , student_list : result.rows});

            q = ` select faculty.name as f_name,faculty.email as f_email from faculty`;

            dbConnect.query(q, async (err, result1) => {
                if (err) throw err;
                else {
                    // res.render('admin.ejs', { title: 'Leave Applications', action: 'list', data: result.rows })
                    // res.render("../views/AddStudent.ejs", { message: req.flash('studentInsert'), faculty_list: result.rows });
                    // res.render("../views/DeleteStudent.ejs", { message: req.flash('studentDelete') , student_list : result.rows});
                    console.log(result1.rows)
                    res.render("../views/ChangeInstructor.ejs", { message: req.flash('updateInstructor'), data: result1.rows, data1: result.rows });
                }
            });

            // console.log(result.rows)
            // res.render("../views/ChangeFa.ejs", { message: req.flash('updateFA') , data : result.rows});
        }
    });
    // error
    return
    // res.render("../views/ChangeInstructor.ejs", { message: req.flash('updateInstructor') });
});

router.post("/updateInstructor", (req, res) => {
    var rollNo = req.body.RollNo;
    var instructor = req.body.Instructor;
    var updateInstructor = `
    UPDATE tainstructor SET instructor_email = '${instructor}' where rollNo = ${rollNo} `;

    dbConnect.query(updateInstructor, (err, result) => {
        if (err) throw err;
        else {

            req.flash('updateInstructor', 'Updated Instructor successfully!!');
            res.redirect("/admin/updateInstructor")
        }
        console.log(req.body);
    })
});


router.get('/upload', (req, res) => {
    console.log('csv');
})

router.post('/upload', upload.single('fileToUpload'), (req, res) => {
    // Get the uploaded file buffer from req.file.buffer
    const fileBuffer = req.file.buffer;

    console.log('buffer')

    // Convert the file buffer to a readable stream
    const fileStream = new Readable();
    fileStream.push(fileBuffer.toString('utf16le'));
    fileStream.push(null);

    // Parse the CSV file using csv-parser
    const results = [];
    fileStream
        .pipe(csv({ encoding: 'utf16le' }))
        .on('data', (data) => results.push(data))
        .on('end', () => {
            // Do something with the CSV data
            console.log(results);
            res.redirect('/admin')
        });
});



router.get("/:rollId(\\d{9})", (req, res) => {
    // res.render("../views/approveForm.ejs")
    const id = req.params.rollId;
    console.log(id)
    var getForm = `select * from leaveApplications where rollno = ${id} and admin_approval = 'Pending' and fa_approval != 'Pending' and mentor_approval != 'Pending'`
    dbConnect.query(getForm, (err, result) => {
        if (err) throw err;
        else {
            // console.log(result.rows.length==0)
            if (result.rows.length == 0) {
                res.redirect('/failed')
                return
            }
            res.render('../views/approveForm.ejs', { data: result.rows[0] })
        }
    });
    return
});



router.post("/:rollId(\\d{9})", async (req, res) => {
    console.log(req.body);

    const id = req.body.regno;
    const status = req.body.status;
    const applied = req.body.leaveDays;
    const leftleaves = req.body.noOfLeavesLeft;
    const nameOfScholar = req.body.name;
    const typeOfLeave = req.body.leaveType;
    const startDate = req.body.leavefromdate;
    const endDate = req.body.leaveToDate;
    const FA_approval = req.body.FA_approval;
    const PM_approval = req.body.PM_approval;
    const total_overflow = req.body['Total-overflow-days']
    const current_overflow = req.body['current-overflow-days']

    console.log('*******************************')
    console.log(startDate)
    console.log(tillDate)
    console.log('*******************************')

    if (req.body.comment == '') {
        comment = "-";
    }
    else {
        comment = req.body.comment;
    }



    if (status == 'Not Approved') {
        var updateStatus = `Update leaveApplications set admin_approval = '${status}' where rollno = ${id} and  and fromdate='${startDate}' and todate='${endDate}'`
        dbConnect.query(updateStatus, (err, result) => {
            if (err) throw err;
            else {
                res.redirect('/admin')
                return
            }
        });
    }
    else if (status == 'Approved') {
        // console.log(newLeft)
        var updateStatus = `Update leaveApplications set admin_approval = '${status}' where rollno = ${id}
        and leavesleft = ${leftleaves} and fromdate='${startDate}' and todate='${endDate}''
        `

        if (typeOfLeave == 1 || typeOfLeave == 6 ) {

            const newLeft = leftleaves - applied;

            if (newLeft < 0) {
                newLeft = 0;
            }

            var updateLeaves = `Update studentinfo set leavesleft = ${newLeft} where rollno = ${id};
            Update studentinfo set overflow = overflow + ${current_overflow} where rollno = ${id}
            `
            dbConnect.query(updateStatus, (err, result) => {
                if (err) throw err;
                else {
                    dbConnect.query(updateLeaves, (err, result2) => {
                        if (err) throw err;
                        else {
                            console.log(result)

                        }
                    })
                }
            });
        }

        else if( typeOfLeave == '5' ) {

            let total = 0

            var updateStatus = `Update leaveApplications set admin_approval = '${status}' where rollno = ${id} and fromdate='${startDate}' and todate='${endDate}'`

            var q = `select sum(daysapplied) from leaveApplications where admin_approval = 'Approved' and rollno=${id}`
            dbConnect.query(q, (err, result) => {
                if (err) throw err;
                else {
                    console.log(result.rows[0].sum)
                    total = result.rows[0].sum
                }
            });

            const newLeft1 = (15-total-applied);
            var newLeft = leftleaves

            if( newLeft1 < 0 ) {
                let extra =  applied - (15-total)
                if( leftleaves - extra < 0 ) {
                    current_overflow = extra - leftleaves
                }
                else{
                    newLeft = leftleaves - extra
                    current_overflow = 0
                }
            }

            var updateLeaves = `Update studentinfo set leavesleft = ${newLeft} where rollno = ${id};
            Update studentinfo set overflow = overflow + ${current_overflow} where rollno = ${id}
            `
            dbConnect.query(updateStatus, (err, result) => {
                if (err) throw err;
                else {
                    dbConnect.query(updateLeaves, (err, result2) => {
                        if (err) throw err;
                        else {
                            console.log(result)

                        }
                    })
                }
            });
        }

        else{

            var updateStatus = `Update leaveApplications set admin_approval = '${status}' where rollno = ${id} and fromdate='${startDate}' and todate='${endDate}'`
            dbConnect.query(updateStatus, (err, result) => {
                if (err) throw err;
                else {
                    console.log(result)
                }
            });

        }
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
        transporter
            .sendMail(mailOptions)
            .then(() => {
                res.redirect('/admin')
            })
            .catch((error) => {
                console.log(error);
                res.json({ status: 'Failed', message: "An Error Occurred!! " })
            })
    }
    else {
        res.redirect('/admin')
    }

    // console.log(data)
    return
});

// router.get('*', (req, res) => {
//     res.render('../views/page_not_found.ejs')
// })

module.exports = router;
