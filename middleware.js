const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
module.exports.isLoggedIn = ((req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirect = req.originalUrl;
        req.flash("error","Please login first");
        return res.redirect("/login")
    }
    next();
});

module.exports.saveRedirectURL = ((req,res,next)=>{
    if(req.session.redirect){
        res.locals.redirectUrl = req.session.redirect;
    }
    next();
})


module.exports.isOwner = (async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission");
        return res.redirect(`/listing/${id}`);
    }
    next();
})



module.exports.isReviewAuthor = ( async(req,res,next)=>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission");
        return res.redirect(`/listing/${id}`);
    }
    next();
})
