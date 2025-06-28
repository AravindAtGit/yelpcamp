const campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview=async (req,res)=>{
    const id=req.params.id;
    const cg=await campground.findById(id);
    const review=new Review(req.body.review);
    review.author=req.user._id;
    cg.reviews.push(review);
   await  review.save();
   await cg.save();
    // res.render('campgrounds/edit',{cg})
      req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${cg._id}`);
}
module.exports.deleteReview=async (req, res) => {
    const { id, reviewId } = req.params;
    await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
      req.flash('success', 'Successfully deleted a review!');
    res.redirect(`/campgrounds/${id}`);
}