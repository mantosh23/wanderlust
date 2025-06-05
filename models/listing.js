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
        url : String,
        filename : String
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
    },
    geometry : {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
  },
  category: {
  type: String,
  enum: [
    'budget',
    'standard',
    'deluxe',
    'luxury',
    'boutique',
    'resort',
    'business',
    'heritage',
    'homestay',
    'hostel',
    'eco-friendly',
    'airport hotel',
    'bed & breakfast',
    'serviced apartment',
    'capsule hotel',
    'treehouse',
    'villa',
    'motel',
    'palace hotel',
    'wellness retreat'
  ],
  required: true
}

});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await review.deleteMany({_id: {$in : listing.reviews}});
  }
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;
