// Router object has a get post delete put req in it
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { validateListing, isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listing.js");

//******************************************************************************************
// Routes

// Index Route
// router.get("/", wrapAsync(listingController.index));

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn,validateListing, wrapAsync(listingController.createListing));

// Create Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// router.post("/", validateListing, wrapAsync(listingController.createListing));

// Read Route
// router.get("/:id", wrapAsync(listingController.showListing));
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// Update Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.renderEditForm)
);

// router.put("/:id", isOwner, wrapAsync(listingController.updateListing));

// Delete Route
// router.delete(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.destroyListing)
// );

//******************************************************************************************

module.exports = router;
