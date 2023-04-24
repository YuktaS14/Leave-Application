const express = require("express");
const { dbConnect } = require("../data/database");
const router = express.Router();

// router.use((req, res, next) => {
//     if (req.isAuthenticated()) {
//         next();
//     }
//     else {
//         res.render("login.ejs");
//     }
// })

router.get("/", async (req, res, next) => {
    // res.render("admin.ejs")

    // var projectMentorEmail = 'johnson@smail.iitpkd.ac.in'
    // var projectMentorEmail = req.params.EMAIL_ID
    var facultyemail = req.user.emails[0]

    var data = null

    try {
        const result = await new Promise((resolve, reject) => {
            dbConnect.query(
                `select * from leaveapplications natural join studentfaculty where projectmentor_email = '${projectMentorEmail}';`,
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

    res.render('project_mentor.ejs', { title: 'Leave Applications', action: 'list', data })

})


router.get("/:rollId", (req, res) => {
    // res.render("../views/approveForm.ejs")
    const id = req.params.rollId;
    // console.log(req.params)
    var getForm = `select * from leaveApplications where rollno = ${id} and mentor_approval = 'Pending'`
    dbConnect.query(getForm, (err, result) => {
        if (err) throw err;
        else {
            console.log(result.rows[0])
            res.render('../views/facultyapproval.ejs', { data: result.rows[0] })
        }
    });
});



module.exports = router;
