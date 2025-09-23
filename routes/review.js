const express = require('express');
const router = express.Router({ mergeParams: true })
const wrapAsync = require('../utils/wrapAsync.js');
const Review = require('../models/reviews.js');
const Listing = require('../models/listing.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middileware.js');


//review-post
router.post('/', validateReview, isLoggedIn, wrapAsync(async (req, res) => {
  let id = req.params.id;
  let listing = await Listing.findById(id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "New riview created")
  res.redirect(`/listings/${id}`)
}))

//review-delete
router.delete('/:reviewId', isReviewAuthor, wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "New review deleted")
  res.redirect(`/listings/${id}`);
}))

module.exports = router
