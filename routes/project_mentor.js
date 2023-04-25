const express = require("express");
const { dbConnect } = require("../data/database");
const router = express.Router();

router.use(async (req, res, next) => {
    if (req.isAuthenticated()) {
        var pmEmail = req.user.email[0].value
        
        try{
            const result = await new Promise((resolve,request)=>{
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
            if(result.rows.length<=0){
                res.redirect("/fialed")
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


router.get("/:rollId", async (req, res) => {
    // res.render("../views/approveForm.ejs")
    const id = req.params.rollId;

    const pmEmail = req.user.emails[0].value
    // console.log(req.params)

    //check if valid pm is viewing the student details
    try{
        const result = await new Promise((reject,resolve)=>{
            dbConnect.query(
                `select * from studentfaculty where rollno = ${id} and mentor_email = '${pmEmail}'  ;`,
                (err,result) =>{
                    if(err)
                        reject(err)
                    else
                        resolve(result);
                }
            );
        });
        data = result.rows
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
