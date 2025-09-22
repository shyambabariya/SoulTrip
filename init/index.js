const express = require("express");
const app = express();
const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");

main().then(()=>{
    console.log("Connect with DB");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/soultrip_prac");
}

const initDB = async () =>{
    await Listing.deleteMany({});
    // initData.data = initData.data.map((obj)=> ({...obj, owner: "68d00856cb8778d5ea0092f0" }));
    await Listing.insertMany(initData.data);
    console.log("Data added successfull");
}

initDB();