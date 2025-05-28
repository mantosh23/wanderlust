const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const review = require("../models/review.js");
const flash = require("express-flash");

//Index Route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings =await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//CREATE NEW
router.get("/new",(req,res)=>{
    res.render("listings/new");
});
router.post("/new",
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
        req.flash("success","New Listing Created!");
        res.redirect("/listing");
    })
);

//EDIT
router.put("/edit/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let {title,url,description,price,location,country}=req.body;
    await Listing.findByIdAndUpdate(id,{title : title,description : description,image : { filename: 'listingimage',url:url},price : price,location : location,country:country}).
    then((res)=>{console.log(`${id} edited successfully`)})
    .catch((err)=>{console.log(err)});
     req.flash("success","Listing Updated!");
    res.redirect(`/listing/${id}`);
}));
//DELETE
router.delete("/:id",wrapAsync(async (req,res)=>{
    let id = req.params.id;
    await Listing.findByIdAndDelete(id);
     req.flash("success","Listing Deleted!");
    res.redirect("/listing");
}));

//Show Route
router.get("/:id",wrapAsync(async(req,res)=>{
    let id = req.params.id;
    const details = await Listing.findById(id).populate("reviews");
    if(!details){
        req.flash("error","Listing doesn't exists");
        res.redirect("/listing")
    }
    res.render("listings/show",{details});
}));


router.get("/edit/:id",wrapAsync(async(req,res)=>{
    let id = req.params.id;
    const details = await Listing.findById(id);
    res.render("listings/edit",{details});
}));

module.exports = router;