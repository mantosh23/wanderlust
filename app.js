const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js");
const { error } = require("console");

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

//Index Route
app.get("/listing",wrapAsync(async (req,res)=>{
    const allListings =await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//CREATE NEW
app.get("/listing/new",(req,res)=>{
    res.render("listings/new");
});
app.post("/listing/new",
    wrapAsync(async(req,res)=>{
        let {title,url,description,price,location,country}=req.body;
        let addNew = new Listing({
            title,
            description,
            image: { filename: 'listingimage', url },
            price,
            location,
            country
        });
        await addNew.save();
        res.redirect("/listing");
    })
);

//EDIT
app.put("/listing/edit/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let {title,url,description,price,location,country}=req.body;
    await Listing.findByIdAndUpdate(id,{title : title,description : description,image : { filename: 'listingimage',url:url},price : price,location : location,country:country}).
    then((res)=>{console.log(`${id} edited successfully`)})
    .catch((err)=>{console.log(err)});

    res.redirect(`/listing/${id}`);
}));
//DELETE
app.delete("/listing/:id",wrapAsync(async (req,res)=>{
    let id = req.params.id;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
}));

//Show Route
app.get("/listing/:id",wrapAsync(async(req,res)=>{
    let id = req.params.id;
    const details = await Listing.findById(id);
    res.render("listings/show",{details});
}));

app.get("/listing/edit/:id",wrapAsync(async(req,res)=>{
    let id = req.params.id;
    const details = await Listing.findById(id);
    res.render("listings/edit",{details});
}));

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