const express = require('express');
const router = express.Router({ mergeParams: true })
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { reviewSchema } = require('../schema.js');
const Review = require('../models/reviews.js');
const Listing = require('../models/listing.js');

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error)
  } else {
    next();
  }
}

//review-post
router.post('/', validateReview, wrapAsync(async (req, res) => {
  let id = req.params.id;
  let listing = await Listing.findById(id);
  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "New riview created")
  res.redirect(`/listings/${id}`)
}))

//review-delete
router.delete('/:reviewId', wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "New review deleted")
  res.redirect(`/listings/${id}`);
}))

module.exports = router
