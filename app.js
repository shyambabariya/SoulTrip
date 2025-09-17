// Requring the things here
// ******************************************************************************************
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError =require("./utils/ExpressError");
const {listingSchema, reviewSchema} = require("./schema");
const Review = require("./models/review");
// ******************************************************************************************

// ******************************************************************************************
// General things
const port = 8080;
app.listen(port, (req,res)=>{
    console.log(`Listening on port ${port}`);
});

// ******************************************************************************************

// ******************************************************************************************
// Setting up things
app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "/views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs",ejsMate);
// ******************************************************************************************

// ******************************************************************************************
// Database connection
main().then(()=>{
    console.log("Connect with DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/soultrip_prac");
};
// ******************************************************************************************

// ******************************************************************************************
// Validation Things 
// Listing 
const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}

// Review
const validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}
// ******************************************************************************************

// ******************************************************************************************
// Routes set up
app.get("/", (req,res)=>{
    res.send("this is the working site");
});

// Index Route
app.get("/listings", wrapAsync(async (req,res)=>{
    let listings = await Listing.find({});
    res.render("listings/index.ejs", {listings});
}));

// Create Route
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs");
});

app.post("/listings", validateListing, wrapAsync(async (req,res)=>{
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
    await newListing.save();
    res.redirect("/listings");
}));

// Read Route
app.get("/listings/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
}));

// Update Route
app.get("/listings/:id/edit",validateListing,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

app.put("/listings/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

// Delete Route
app.delete("/listings/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let delResult = await Listing.findByIdAndDelete(id);
    console.log(delResult);
    res.redirect("/listings");
}));

// Review Route
// Add review Route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req,res)=>{
   let listing = await Listing.findById(req.params.id);
   let review = new Review(req.body.review);
   listing.reviews.push(review);
   await review.save();
   await listing.save();
   res.redirect(`/listings/${listing._id}`);
}));

// Delete review Route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

// ******************************************************************************************

// ******************************************************************************************
// Error handling Middleware
app.all(/.*/, (req,res,next)=>{
    next(new ExpressError(404, "Page not found"));
});

app.use((err,req,res,next)=>{
    let {statusCode = 400, message = "Some Error Occured"} = err;
    // res.status(statusCode).send(message);
    // res.send("Something went Wrong!")
    res.status(statusCode).render("error.ejs", {message});
});
// ******************************************************************************************