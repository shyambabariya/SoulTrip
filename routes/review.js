const express = require("express");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");

const{validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");


//******************************************************************************************
// Routes 

// Add review Route
router.post("/",isLoggedIn, validateReview, wrapAsync(async (req,res)=>{
   let listing = await Listing.findById(req.params.id);
   let review = new Review(req.body.review);
   review.author = req.user._id,
   listing.reviews.push(review);
   await review.save();
   await listing.save();
   req.flash("success", "New Review Added Successfully!");
   res.redirect(`/listings/${listing._id}`);
}));

// Delete review Route
router.delete("/:reviewId", isReviewAuthor,isLoggedIn,wrapAsync(async(req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted Successfully!");
    res.redirect(`/listings/${id}`);
}));
//******************************************************************************************

module.exports = router;