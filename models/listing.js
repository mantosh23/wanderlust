const mongoose = require("mongoose");
const review = require("./review");
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
    },
    reviews : [{
      type: Schema.Types.ObjectId,
      ref : "Review"
    }],
    owner : {
      type : Schema.Types.ObjectId,
      ref : "User"
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await review.deleteMany({_id: {$in : listing.reviews}});
  }
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;
