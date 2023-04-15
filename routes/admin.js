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

//why is req empty here :.. 
router.post("/", async (req,res) =>{
    console.log(req.body)
});

router.get("/addStudent",(req,res)=>{
    res.render("../views/AddStudent.ejs",{message: req.flash('studentInsert')});
});


router.post("/addStudent",(req,res)=>{
    var rollNo =  req.body.RollNo;
    var name = req.body.name;
    var leaves =  req.body.leavesAlloted;
    var FA = req.body.FA;
    var PM =  req.body.PM;
    var insertData = `
    INSERT INTO studentfaculty (rollno,name,facultyadvisor,projectmentor)
    VALUES (${rollNo},'${name}','${FA}','${PM}')
    `;

    var insertData2 = `
    INSERT INTO studentinfo (rollno,name,leavesleft)
    VALUES (${rollNo},'${name}',${leaves})
    `;
    dbConnect.query(insertData,(err,result)=>{
    if(err) throw err;
    else{
    dbConnect.query(insertData2,(err,result)=>{
    if(err) throw err;
    else{
          req.flash('studentInsert','Added to database successfully!! ');
          res.redirect("/admin/addStudent")
    }
})}
});
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