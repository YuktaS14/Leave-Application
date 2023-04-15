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
app.use(bodyParser.urlencoded({ extended: true}));
app.use(session({
    secret: "key", // can be anything
    resave: false,
    saveUninitialized: false,
    // local server has http, if we have https we can set it to true
    cookie: { secure: false, maxAge : 10000000 },
}));

app.use("/admin",adminrouter);


app.use(passport.initialize())
// first we need to create express session then only we can use this session
app.use(passport.session())

// two input 1st options, 2nd one function
passport.use(new GoogleStrategy({

    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
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


app.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        console.log(req.user)
        res.render("dashbord.ejs", {
            user: req.user
        });
    } else {
        res.render("login.ejs");
    }
    
})

app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account"
}
));


app.get("/dashboard", (req, res) => {
    if (req.isAuthenticated()) {
        console.log(req.user)
        res.render("dashbord.ejs", {
            user: req.user
        });
    } else {
        res.redirect("/login");
    }
})

// verifying again
app.get("/auth/google/callback", passport.authenticate("google", {
    failureRedirect: "/login"
}), async (req, res) => {
    res.redirect("/dashboard")
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


app.listen(5000, () => {
    console.log("server working")
})



// dbConnect.query('select * from studentInfo',(err,result)=>{
//     if(!err){
//         console.log(result.rows);
//     }
//     dbConnect.end();
// });