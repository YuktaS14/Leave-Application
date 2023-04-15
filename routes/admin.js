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

router.get("/deleteStudent",(req,res)=>{
    res.render("../views/DeleteStudent.ejs",{message: req.flash('studentDelete')});
});


router.post("/deleteStudent",(req,res)=>{
    var rollNo =  req.body.RollNo;
    var name = req.body.name;
    var deleteData = `
    DELETE FROM studentFaculty where rollNo = ${rollNo}
    `;
    var deleteData2 = `
    DELETE FROM studentInfo where rollNo = ${rollNo}
    `;
    dbConnect.query(deleteData,(err,result)=>{
    if(err) throw err;
    else{
    dbConnect.query(deleteData2,(err,result)=>{
    if(err) throw err;
    else{
          req.flash('studentDelete','Deleted from the database successfully!! ');
          res.redirect("/admin/deleteStudent")
    }
})}
});
    console.log(req.body);
});

router.get("/addTA",(req,res)=>{
    res.render("../views/AddTA.ejs",{message: req.flash('taInsert')});
});


router.post("/addTA",(req,res)=>{
    var rollNo =  req.body.RollNo;
    var name = req.body.name;
    var course = req.body.course;
    var insertTA = `
    INSERT INTO tainstructor values
    (${rollNo},'${name}', '${course}');
    `;

    dbConnect.query(insertTA,(err,result)=>{
    if(err) throw err;
    else{
    
        req.flash('taInsert','Inserted TA into database successfully!! ');
        res.redirect("/admin/addTA")
    }
});
    console.log(req.body);
});

router.get("/deleteTA",(req,res)=>{
    res.render("../views/DeleteTA.ejs",{message: req.flash('taDelete')});
});


router.post("/deleteTA",(req,res)=>{
    var rollNo =  req.body.RollNo;
    var deleteTA = `
    DELETE FROM tainstructor where rollNo = (${rollNo});
    `;

    dbConnect.query(deleteTA,(err,result)=>{
    if(err) throw err;
    else{
    
        req.flash('taDelete','Deleted TA from the database successfully!! ');
        res.redirect("/admin/deleteTA")
    }
    console.log(req.body);
});
});


router.get("/addFaculty",(req,res)=>{
    res.render("../views/AddFaculty.ejs",{message: req.flash('facultyInsert')});
});


router.post("/addFaculty",(req,res)=>{
    var name = req.body.name;
    var email = req.body.email;
    var insertFaculty = `
    INSERT INTO faculty values
    ('${name}', '${email}');
    `;

    dbConnect.query(insertFaculty,(err,result)=>{
    if(err) throw err;
    else{
    
        req.flash('facultyInsert','Inserted faculty into database successfully!! ');
        res.redirect("/admin/addFaculty")
    }
});
    console.log(req.body);
});




router.get("/deleteFaculty",(req,res)=>{
    res.render("../views/DeleteFaculty.ejs",{message: req.flash('deleteFaculty')});
    
});

router.post("/deleteFaculty",(req,res)=>{
    var email =  req.body.email;
    var deleteFaculty = `
    DELETE FROM faculty where email = '${email}'
    `;

    dbConnect.query(deleteFaculty,(err,result)=>{
    if(err) throw err;
    else{
    
        req.flash('deleteFaculty','Deleted faculty from the database successfully!! ');
        res.redirect("/admin/deleteFaculty")
    }
    console.log(req.body);
    })
});

router.get("/updateFaculty",(req,res)=>{
    res.render("../views/ChangeFA.ejs",{message: req.flash('updateFaculty')});
    
});

router.post("/deleteFaculty",(req,res)=>{
    var email =  req.body.email;
    var deleteFaculty = 
    `
    DELETE FROM faculty where email = '${email}'
    `;

    dbConnect.query(deleteFaculty,(err,result)=>{
    if(err) throw err;
    else{
    
        req.flash('updateFaculty','Deleted faculty from the database successfully!! ');
        res.redirect("/admin/deleteFaculty")
    }
    console.log(req.body);
    })
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