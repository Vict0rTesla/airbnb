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
  res.redirect('/')
}));

//edit
router.get('/:id/edit', wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/edit.ejs', { listing })
}))

//update
router.put('/:id', validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.Listing })
  res.redirect(`/listings/${id}`)
}))

//delete
router.delete('/:id', wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id)
  res.redirect('/listings')
}))

//show
router.get('/:id', wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render('listings/show.ejs', { listing });
}))

module.exports = router
