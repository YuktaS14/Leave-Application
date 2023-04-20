const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const ejs = require("ejs");
const path = require("path");
require("dotenv").config();
const { dbConnect } = require("./data/database");
const adminrouter = require("./routes/admin");
const bodyParser = require("body-parser");
const flash = require("connect-flash");

const app = express();

app.set("view engine", "ejs");

app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "key", // can be anything
    resave: false,
    saveUninitialized: false,
    // local server has http, if we have https we can set it to true
    cookie: { secure: false },
}));

app.use("/admin", adminrouter);


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


app.get('/temp', (req, res) => {
    console.log(req)
});


app.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        // console.log(req.user)
        // res.render("dashbord.ejs", {
        //     user: req.user
        // });

        // console.log(req)

        if (req.user.emails[0].value == process.env.ADMIN_EMAIL) {
            res.redirect("/admin")
            // res.redirect("/temp")
        } else {
            res.redirect("/failed");
        }

    } else {
        res.render("login.ejs");
    }
})


app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account"
}
));


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

// verifying again
app.get("/auth/google/callback", passport.authenticate("google", {
    failureRedirect: "/login"
}), async (req, res) => {
    res.redirect("/login")
}
);

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



app.get('/failed', (req, res) => {
    res.send('Hello')
})

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