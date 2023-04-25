const express = require("express");
const { dbConnect } = require("../data/database");
const router = express.Router();

router.get('/',(req, res,next) => {
    if (req.isAuthenticated()) {
        
        // checking for admin
        if (req.user.emails[0].value == process.env.ADMIN_EMAIL) {
            res.redirect("/admin")
        } else {
            

            // checking for faculty

            res.redirect("/failed");

            // checking for student


            // failed to log in


        }

    } else {
        res.render("login.ejs");
    }
});

module.exports = router;
