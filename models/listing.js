const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title :{
        type : String,
        required : true
    },
    description : String,
    image: {
        type: {
          filename: {
            type: String,
            default: "listingimage"
          },
          url: {
            type: String,
            default:
              "https://unsplash.com/photos/white-bed-linen-with-throw-pillows-Yrxr3bsPdS0"
          }
        },
        default: undefined,
        set: function (v) {
          return {
            filename: v?.filename || "listingimage",
            url:
              v?.url && v.url !== ""
                ? v.url
                : "https://unsplash.com/photos/white-bed-linen-with-throw-pillows-Yrxr3bsPdS0"
          };
        }
    },
    price : {
        type : Number,
        required : true
    },
    location : {
        type : String,
        required : true
    },
    country :{
        type : String,
        required : true
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;
