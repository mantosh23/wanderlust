const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js");
const { error } = require("console");
const review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const listing = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js")

const sessionOption = {
    secret : "mysecretcode",
    resave : false,
    saveUninitialized : true,
    cookie :{
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
};

main().then((res)=>{console.log("Connected to Database")})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.engine('ejs',ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"/public")));


app.get("/",(req,res)=>{
    res.send("Hi,I am root");
})

app.use(session(sessionOption));
app.use(flash());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use("/listing",listing);
app.use("/listings/:id/reviews",reviews);

//Reviews
//Post



app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});
  

app.use((err,req,res,next)=>{
    let{statusCode = 400,message="Error Occured"} = err;
    res.status(statusCode).render("error.ejs",{message})
    // res.status(statusCode).send(message);
})

app.listen(8080,(req,res)=>{
    console.log("Listing at port 8080");
})