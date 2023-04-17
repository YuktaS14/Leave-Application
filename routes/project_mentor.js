const express = require("express");
const { dbConnect } = require("../data/database");
const router = express.Router();


router.get("/", async (req, res, next) => {
    // res.render("admin.ejs")

    var projectMentorEmail = 'johnson@smail.iitpkd.ac.in'

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


module.exports = router;
