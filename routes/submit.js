const express = require("express");
const { dbConnect } = require("../data/database");
const router = express.Router();


router.get("/", async (req, res, next) => {
});

router.post("/", async (req, res,next) => {

    console.log(req.body);

    var rollno = Number(req.body.regno)
    // console.log(rollno)
    var nameofscholar = req.body.name
    var department = req.body.dept
    var program = req.body.program
    var leavesleft = Number(req.body.noOfLeavesLeft)
    var typeofleave = req.body['leave-type']
    var leavepurpose = req.body['leave-purpose']
    var daysapplied = Number(req.body['leave-days'])
    var fromdate = req.body['leave-from-date']
    var todate = req.body['leave-to-date']
    var natureofduty = req.body['duty-nature']
    var alternatestudrolno = Number(req.body['alternate-scholar-rollno'])
    var alternatestudname = req.body['alternate-scholar-name']

    try {
        const result = await new Promise((resolve, reject) => {
            dbConnect.query(
                `
                INSERT INTO leaveapplications
                VALUES 
                ( 
                    ${rollno},'${nameofscholar}','${department}','${program}',${leavesleft},'${leavepurpose}',${daysapplied},
                    '${fromdate}', '${todate}', '${natureofduty}',${alternatestudrolno},'${alternatestudname}','Pending','Pending','Pending','${typeofleave}'
                );
                `
                ,
                (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else{
                        resolve(result)
                    }
                }
            );
        });

        // res.render("studentHomePage.ejs", obj );
    } catch (err) {
        next(err);
    }

    res.redirect('/student')

})

router.get('*', (req, res) => {
    res.render('../views/page_not_found.ejs')
})


module.exports = router;

// '${req.body.dept}' , '${req.body.program}',
//                 ${Number(req.body.noOfLeavesLeft)}, ${req.body['leave-type']}  , ${req.body['leave-purpose']},
//                 ${req.body['leave-days']},'${req.body['leave-from-date']}', '${req.body['leave-to-date']}',
//                 '${req.body['duty-nature']}', ${req.body['alternate-scholar-rollno']}, '${req.body['alternate-scholar-name']}
