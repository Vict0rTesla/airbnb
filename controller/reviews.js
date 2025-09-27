const Review = require('../models/reviews.js');
const Listing = require('../models/listing.js');

module.exports.post = async (req, res) => {
  let id = req.params.id;
  let listing = await Listing.findById(id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "New riview created")
  res.redirect(`/listings/${id}`)
}

module.exports.delete = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "New review deleted")
  res.redirect(`/listings/${id}`);
}
