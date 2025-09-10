// Requring the things here
// ******************************************************************************************
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
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
// Routes set up
app.get("/", (req,res)=>{
    res.send("this is the working site");
});

// Index Route
app.get("/listings", async (req,res)=>{
    let listings = await Listing.find({});
    res.render("listings/index.ejs", {listings});
});

// Create Route
app.get("/listings/new", (req,res)=>{
    res.send("this is full show page");
})

// ******************************************************************************************