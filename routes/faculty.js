const express = require("express");
const { dbConnect } = require("../data/database");
const router = express.Router();



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


router.get("/:rollId",async (req,res)=>{
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


module.exports = router;



// router.get("/", async (req, res, next) => {
//     // res.render("admin.ejs")

//     var facultyemail = 'archana@smail.iitpkd.ac.in'

//     var fname = null

//     try {
//         const result = await new Promise((resolve, reject) => {
//             dbConnect.query(
//                 `SELECT * FROM faculty WHERE email = '${facultyemail}'`,
//                 (err, result) => {
//                     if (err) {
//                         reject(err);
//                     } else {
//                         resolve(result);
//                     }
//                 }
//             );
//         });

//         // temp.studentInfo = result.rows;
//         fname = result.rows[0].name

//         // res.render("studentHomePage.ejs", obj );
//     } catch (err) {
//         next(err);
//     }

//     var rollnumbers = null

//     try {
//         const result = await new Promise((resolve, reject) => {
//             dbConnect.query(
//                 `SELECT rollno FROM studentfaculty WHERE  facultyadvisor like '%${fname}%' `,
//                 (err, result) => {
//                     if (err) {
//                         reject(err);
//                     } else {
//                         resolve(result);
//                     }
//                 }
//             );
//         });

//         // temp.studentInfo = result.rows;
//         // fname = result.rows[0].name
//         rollnumbers = result.rows

//         // res.render("studentHomePage.ejs", obj );
//     } catch (err) {
//         next(err);
//     }

//     console.log(rollnumbers)

//     var res = []

//     await rollnumbers.forEach( async element => {

//         try {
//             const result = await new Promise((resolve, reject) => {
//                 dbConnect.query(
//                     `SELECT * FROM leaveApplications WHERE rollno = ${element.rollno} `,
//                     (err, result) => {
//                         if (err) {
//                             reject(err);
//                         } else {
//                             resolve(result);
//                         }
//                     }
//                 );
//             });

//             // temp.studentInfo = result.rows;
//             // fname = result.rows[0].name
//             console.log(result.rows)
//             res.push(...result.rows)
//             // temp = result.rows


//             // res.render("studentHomePage.ejs", obj );
//         } catch (err) {
//             next(err);
//         }

//     });
    
//     // console.log('hello')
//     // console.log(res)
//     // console.log('hello')


//     // var viewData = 'select * from leaveApplications'
//     // dbConnect.query(viewData, (err, result) => {
//     //     if (err) throw err;
//     //     else {
//     //         res.render('faculty.ejs', { title: 'Leave Applications', action: 'list', data: result.rows })
//     //     }
//     // })
// })


// module.exports = router;
