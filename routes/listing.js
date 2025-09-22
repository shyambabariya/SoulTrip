// Router object has a get post delete put req in it
const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const {validateListing,isLoggedIn, isOwner} = require("../middleware.js");

//******************************************************************************************
// Routes

// Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let listings = await Listing.find({});
    res.render("listings/index.ejs", { listings });
  })
);

// Create Route
router.get("/new",isLoggedIn,(req, res) => {
  res.render("listings/new.ejs");
});

router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    // let {title, description, image,price,location,country} = req.body;
    // let newListing = new Listing({
    //     title:title,
    //     description:description,
    //     image:image,
    //     price:price,
    //     location:location,
    //     country:country,
    // });
    // console.log(newListing);
    //Above way is more longer so we use shorter way to do the same things

    // for it we use object's key:value pair
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Added Successfully!");
    res.redirect("/listings");
  })
);

// Read Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author",}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
       return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);

// Update Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
       return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

router.put(
  "/:id",
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
  })
);

// Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let delResult = await Listing.findByIdAndDelete(id);
    console.log(delResult);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
  })
);

//******************************************************************************************

module.exports = router;
