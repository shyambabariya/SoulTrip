// Requring the things here
// ******************************************************************************************
if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
// console.log(process.env);
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError =require("./utils/ExpressError");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
// Routes require
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userRouter = require("./routes/user.js");
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
// DB URL
const dbUrl = process.env.ATLASDB_URL;
// const MONGO_URL = mongodb://127.0.0.1:27017/soultrip_prac

// Database connection
main().then(()=>{
    console.log("Connect with DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
};
// ******************************************************************************************

// ******************************************************************************************
// session,connect flash, mongodb session things

// mongodb session
const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
}); 

//if error comes in store
store.on("error", ()=>{
    console.log("ERROR IN MONGO SESSION STORE", err);
});

// Session option
const sessionOptions = {
    store,//mongo store related store 
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, 
    },
};
app.use(session(sessionOptions));
app.use(flash());
// ******************************************************************************************
// passport implement
app.use(passport.initialize());
// for every request the passport get initialize
app.use(passport.session());
// By deafult passport use the session
passport.use(new LocalStrategy(User.authenticate()));
// here we use LocalStrategy of the passport so using this strategy we authenticate the user
passport.serializeUser(User.serializeUser());
// not to login when chnage the website page by default logged in basically logged in every pages
passport.deserializeUser(User.deserializeUser());
// after logout if we access the another page so not to login there basically logout from every pages

// ******************************************************************************************
// Routes set up;

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// user Routes
app.use("/", userRouter);

// listing Routes
app.use("/listings",listings);

// reiview Routes
app.use("/listings/:id/reviews", reviews);
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