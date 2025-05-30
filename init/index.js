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
    initdata.data = initdata.data.map((obj)=>({...obj , owner : "68374ebe1509e17eade18f18"}))
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
}

intiDB();