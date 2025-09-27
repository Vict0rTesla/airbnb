const express = require('express');
const router = express.Router({ mergeParams: true })
const wrapAsync = require('../utils/wrapAsync.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middileware.js');
const reviewConstroller = require("../controller/reviews.js")


//review-post
router.post('/', validateReview, isLoggedIn, wrapAsync(reviewConstroller.post))

//review-delete
router.delete('/:reviewId', isReviewAuthor, wrapAsync(reviewConstroller.delete))

module.exports = router
