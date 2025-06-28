const express=require('express');
const router=express.Router({ mergeParams: true });
const reviews= require('../controllers/reviews');

const campground=require('../models/campground.js');
const catchAsync=require('../utils/catchAsync.js');
const ExpressError=require('../utils/ExpressError.js');
const { reviewSchema} = require('../schemas.js');
const Review=require('../models/review.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

router.post('/campgrounds/:id/reviews',isLoggedIn,validateReview,catchAsync(reviews.createReview))

router.delete('/campgrounds/:id/reviews/:reviewId', isReviewAuthor,catchAsync(reviews.deleteReview))

module.exports = router;