require("dotenv").config();
console.log("MONGO_URI =", process.env.MONGO_URI);
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initdata = require("./data.js");

main()
  .then((res) => {
    console.log("Connected to Database");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}
const initDB = async () => {
  await Listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "696488e795f93a82e26d2be6",
  }));
  await Listing.insertMany(initdata.data);
  console.log("data was initialized");
};

initDB();
