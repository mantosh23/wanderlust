const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const review = require("../models/review.js");
const flash = require("express-flash");
const path = require("path");
const user = require("../models/user.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken =
  "pk.eyJ1IjoibWFudG9zaDIzIiwiYSI6ImNtYmhwOTBhcDBja2oya3NnbHF1dW9rYnUifQ.6K5eHl7gdvfGFhv-S3d3hg";
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

//CREATE NEW
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new");
});
router.post(
  "/new",
  upload.single("image"),
  wrapAsync(async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let { title, description,category, price, location, country } = req.body;
    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.location,
        limit: 1,
      })
      .send();
    let addNew = new Listing({
      title,
      description,
      category,
      price,
      location,
      country,
    });
    addNew.image = { url, filename };
    addNew.owner = req.user._id;
    addNew.geometry = response.body.features[0].geometry;
    console.log(addNew);
    await addNew.save();
    
    req.flash("success", "New Listing Created!");
    res.redirect("/listing");
  })
);
// router.post("/new",upload.single("image"),(req,res)=>{
//     res.send(req.file);
//     console.log(req.file);
// })

//EDIT
router.put(
  "/edit/:id",
  isLoggedIn,
  isOwner,
  upload.single("image"),
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let { title, description, price, location, country } = req.body;
    let listing = await Listing.findByIdAndUpdate(id, {
      title: title,
      description: description,
      price: price,
      location: location,
      country: country,
    });

    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.location,
        limit: 1,
      })
      .send();
    listing.geometry = response.body.features[0].geometry;

    if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save();
    }
    await listing.save();

    req.flash("success", "Listing Updated!");
    res.redirect(`/listing/${id}`);
  })
);
//DELETE
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let id = req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listing");
  })
);

//Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let id = req.params.id;
    const details = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!details) {
      req.flash("error", "Listing doesn't exists");
      res.redirect("/listing");
    }
    res.render("listings/show", { details });
  })
);

router.get(
  "/edit/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let id = req.params.id;
    const details = await Listing.findById(id);
    res.render("listings/edit", { details });
  })
);

module.exports = router;
