const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync");

const reviewController = require("../controllers/review");

const{validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");


//******************************************************************************************
// Routes 

// Add review Route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete review Route
router.delete("/:reviewId", isReviewAuthor,isLoggedIn,wrapAsync(reviewController.destroyReview));
//******************************************************************************************

module.exports = router;