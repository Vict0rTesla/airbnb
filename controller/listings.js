const Listing = require("../models/listing.js")
const getLocation = require("../utils/getLocation.js")

module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render('listings/index.ejs', { allListing });
}

module.exports.newListingForm = (req, res) => {
  res.render('listings/new.ejs')
}

module.exports.createListing = async (req, res) => {
  let url = req.file.path
  let filename = req.file.filename
  const newListing = new Listing(req.body.Listing)
  newListing.owner = req.user._id
  newListing.image = { url, filename }
  newListing.geomatry = await getLocation(newListing.location)
  let savedListing = await newListing.save()
  req.flash("success", "New listing created")
  res.redirect('/listings')
}

module.exports.editForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing doesnot exist")
    return res.redirect('/listings')
  }

  let image = listing.image.url
  image = image.replace("/upload", "/upload/w_250");

  res.render('listings/edit.ejs', { listing, image })
}

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.Listing })
  if (typeof req.file !== "undefined") {
    let url = req.file.path
    let filename = req.file.filename
    listing.image = { url, filename }
    await listing.save()
  }
  req.flash("success", "Listing Updated")
  res.redirect(`/listings/${id}`)
}

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id)
  req.flash("success", "Listing deleted")
  res.redirect('/listings')
}

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
  if (!listing) {
    req.flash("error", "Listing doesnot exist")
    res.redirect('/listings')
  } else {

    res.render('listings/show.ejs', { listing });
  }
}
