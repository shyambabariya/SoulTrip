const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

router.get("/signup", (req, res) => {
  res.render("user/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try{
        let { username, email, password } = req.body;
        let newUser = new User({
          username,
          email,
        });
        const registerdUser = await User.register(newUser, password);
        req.login(registerdUser, (err)=>{
          if(err){
            next(err);
          }
          req.flash("success", "Welcome to SoulTrip!");
          res.redirect("/listings");
        })
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("user/login.ejs");
});

router.post("/login",saveRedirectUrl,passport.authenticate("local", { failureRedirect: '/login', failureFlash:true }),async (req, res)=>{
    req.flash("success", "Welcome Back to SoulTrip!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});

router.get("/logout", (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out Successfully");
        res.redirect("/listings");
    });
});

module.exports = router;
