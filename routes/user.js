const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectURL } = require("../middleware.js");

router.get("/signup", (req,res)=>{
    res.render("users/signup");
})

router.post("/signup", wrapAsync(async (req,res)=>{
    try {
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser =await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next (err);
            }
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listing");
        })
    } catch (error) {
        req.flash("error",error.message);
        res.redirect("/signup")
    }
    
}))

router.get("/login", (req,res)=>{
    res.render("users/login");
})

router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listing")
    })
})

router.post("/login", saveRedirectURL,passport.authenticate('local', { failureRedirect: '/login' ,failureFlash : true}),(req,res)=>{
    req.flash("success","Welcome to back WanderLust.!");
    let redirect = res.locals.redirectUrl || "/listing"
    res.redirect(redirect);
})

module.exports = router;