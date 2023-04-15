const express = require("express")
const router = express.Router();
const { dbConnect } = require("../data/database");


router.get("/",(req,res)=>{
    // res.render("admin.ejs")
    var viewData = 'select * from leaveApplications'
    dbConnect.query(viewData,(err,result)=>{
    if(err) throw err;
    else{
        res.render('admin.ejs',{title:'Leave Applications',action:'list',data:result.rows})
    }
});
});

router.get("/addStudent",(req,res)=>{
    res.render("../views/AddStudent.ejs");
});

router.post("/addStudent",(req,res)=>{
    console.log(req.body);
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