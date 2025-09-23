const express = require("express")
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner, validateListing } = require("../middileware.js");

//index
router.get('/', wrapAsync(async (req, res) => {
  const allListing = await Listing.find({});
  res.render('listings/index.ejs', { allListing });
}))

//new
router.get('/new', isLoggedIn, (req, res) => {
  res.render('listings/new.ejs')
})

//create
router.post('/create', isLoggedIn, validateListing, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.Listing)
  newListing.owner = req.user._id
  await newListing.save()
  req.flash("success", "New listing created")
  res.redirect('/listings')
}));

//edit
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing doesnot exist")
    return res.redirect('/listings')
  }
  res.render('listings/edit.ejs', { listing })
}))

//update
router.put('/:id', isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;

  await Listing.findByIdAndUpdate(id, { ...req.body.Listing })
  req.flash("success", "Listing Updated")
  res.redirect(`/listings/${id}`)
}))

//delete
router.delete('/:id', isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id)
  req.flash("success", "Listing deleted")
  res.redirect('/listings')
}))

//show
router.get('/:id', wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
  if (!listing) {
    req.flash("error", "Listing doesnot exist")
    res.redirect('/listings')
  } else {
    res.render('listings/show.ejs', { listing });
  }
}))

module.exports = router
