const express = require("express")
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js');
const { listingSchema } = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing.js');

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error)
  } else {
    next();
  }
}

//index
router.get('/', wrapAsync(async (req, res) => {
  const allListing = await Listing.find({});
  res.render('listings/index.ejs', { allListing });
}))

//new
router.get('/new', (req, res) => {
  res.render('listings/new.ejs')
})

//create
router.post('/create', validateListing, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.Listing)
  await newListing.save()
  req.flash("success", "New listing created")
  res.redirect('/')
}));

//edit
router.get('/:id/edit', wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing doesnot exist")
    res.redirect('/listings')
  } else {
    res.render('listings/edit.ejs', { listing })
  }
}))

//update
router.put('/:id', validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.Listing })
  req.flash("success", "Listing Updated")
  res.redirect(`/listings/${id}`)
}))

//delete
router.delete('/:id', wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id)
  req.flash("success", "Listing deleted")
  res.redirect('/listings')
}))

//show
router.get('/:id', wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  if (!listing) {
    req.flash("error", "Listing doesnot exist")
    res.redirect('/listings')
  } else {
    res.render('listings/show.ejs', { listing });
  }
}))

module.exports = router
