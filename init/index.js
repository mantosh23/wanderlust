const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initdata = require("./data.js")

main().then((res)=>{console.log("Connected to Database")})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const intiDB = async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
}

intiDB();