const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const ejs = require("ejs");
const path = require("path");
require("dotenv").config();
const { dbConnect } = require("./data/database");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const app = express();

app.set("view engine", "ejs");

// app.use(express.static(path.join(path.resolve(),"public")));

app.use(express.static(__dirname + "/public", {
    index: false,
    immutable: true,
    cacheControl: true,
    maxAge: "30d"
}));

app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRETE, // can be anything
    resave: false,
    saveUninitialized: true,
    // local server has http, if we have https we can set it to true
    cookie: { secure: false },
}));


app.use(passport.initialize())
// first we need to create express session then only we can use this session
app.use(passport.session())

// two input 1st options, 2nd one function
passport.use(new GoogleStrategy({

    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.REDIRECT_URL
    // where we want to go ?
    // can be any route
    // redirect and callback are same

}, function (accesstoken, refreshtoken, profile, cb) {
    // cb = callback function
    cb(null, profile);
}));

// to store user in session

passport.serializeUser(function (user, cb) {
    cb(null, user)
})

passport.deserializeUser(function (obj, cb) {
    cb(null, obj)
})

app.get('/', (req, res) => {
    res.redirect('/login')
})

app.get('/temp', (req, res) => {
    console.log(req.user.emails)
});



app.get('/login', async (req, res, next) => {

    if (req.user == undefined) {
        res.render("login.ejs");
        return
    }

    const userEmail = req.user.emails[0].value;

    console.log(userEmail)
    console.log('inside login-->', req.session.select_userrole)

    if (userEmail == process.env.ADMIN_EMAIL) {
        // req.admin = {"admin":"true"}
        res.redirect("/admin");
        return
    }

    // checking for faculty
    try {
        const result = await new Promise((resolve, reject) => {
            dbConnect.query(
                `SELECT * FROM studentfaculty WHERE faculty_email = '${userEmail}'`,
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });

        console.log('faculty checking')
        console.log(result.rows.length)

        if (result.rows.length > 0) {
            res.redirect('/faculty');
            return;
        }

    } catch (err) {
        next(err);
    }

    // checking for pm
    try {
        const result = await new Promise((resolve, reject) => {
            dbConnect.query(
                `SELECT * FROM studentfaculty WHERE projectmentor_email = '${userEmail}'`,
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });

        if (result.rows.length > 0) {
            // res.redirect(`/pm/${userEmail}`)
            // if (req.session.select_userrole == 'project_mentor') {
            res.redirect(`/pm`)
            return
            // }
        }

    } catch (err) {
        next(err);
    }


    // checking for students

    console.log(userEmail.split('@')[0])

    try {
        const result = await new Promise((resolve, reject) => {
            dbConnect.query(
                `SELECT * FROM studentinfo WHERE rollno = '${userEmail.split('@')[0]}'`,
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });

        if (result.rows.length > 0) {
            // res.redirect(`/pm/${userEmail}`)
            console.log('student checked --> ', req.session.select_userrole)
            // if (req.session.select_userrole == 'student') {
            res.redirect(`/student`)
            return
            // }
        }

    } catch (err) {
        next(err);
    }


    res.redirect("/failed")
})


// app.get("/auth/google", (req, res, next) => {

//     req.session.select_userrole = req.query.selectRole
//     console.log('req session role ---> ', req.session.select_userrole)
//     next()

// }, passport.authenticate("google", {
//     scope: ["profile", "email"],
//     prompt: "select_account"
// })
// );

// // verifying again
// app.get("/auth/google/callback", passport.authenticate("google", {
//     failureRedirect: "/login"
// }), async (req, res) => {
//     // console.log(req.session.select_userrole)
//     console.log('inside callback')
//     // console.log('req session role ---> ', req.cookies.select_userrole)
//     res.redirect("/login")
// }
// );




app.get("/auth/google", (req, res, next) => {
    req.session.select_userrole = req.query.selectRole;
    const state = JSON.stringify({
        select_userrole: req.session.select_userrole
    });
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=profile email&access_type=offline&include_granted_scopes=true&state=${state}&response_type=code&redirect_uri=${process.env.REDIRECT_URL}&client_id=${process.env.GOOGLE_CLIENT_ID}`;

    // const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=profile email&access_type=offline&include_granted_scopes=true&state=${state}&response_type=code&redirect_uri=${process.env.REDIRECT_URL}&client_id=${process.env.GOOGLE_CLIENT_ID}&prompt=consent`;


    res.redirect(googleAuthUrl);
});


app.get("/auth/google/callback", passport.authenticate("google", {
    failureRedirect: "/login"
}), async (req, res) => {
    const state = JSON.parse(req.query.state);
    req.session.select_userrole = state.select_userrole;
    console.log('----> Mangesh', req.session.select_userrole);
    res.redirect("/login");
});




app.use((req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.render("login.ejs");
    }
})


app.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            console.log(err);
        } else {
            req.session.destroy();
            res.redirect("/login");
        }
    });
});

const studentRoute = require('./routes/student');
app.use("/student", studentRoute);

const submittRoute = require('./routes/submit');
app.use("/submit", submittRoute);

const facultyRoute = require('./routes/faculty');
app.use("/faculty", facultyRoute);

const pmRoute = require('./routes/project_mentor');
app.use("/pm", pmRoute);

const adminrouter = require("./routes/admin");
app.use("/admin", adminrouter);

// app.get('*', (req, res) => {
//     res.render('page_not_found.ejs')
// })

app.listen(5000, () => {
    console.log("server working")
})

// console.log(2+3)

// dbConnect.query('select * from studentInfo',(err,result)=>{
//     if(!err){
//         console.log(result.rows);
//     }
//     dbConnect.end();
// });



// app.get("/dashboard", (req, res) => {
//     if (req.isAuthenticated()) {
//         // console.log(req.user.emails[0].value)

//         if (req.user.emails[0].value == process.env.ADMIN_EMAIL) {

//             res.redirect("/admin")

//         } else {
//             res.redirect("/failed");
//         }
//         // res.render("dashbord.ejs", {
//         //     user: req.user
//         // });
//     } else {
//         res.redirect("/");
//     }
// })
