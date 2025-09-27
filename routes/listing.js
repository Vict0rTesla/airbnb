const express = require("express")
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner, validateListing } = require("../middileware.js");
const listingController = require("../controller/listings.js")

const multer = require("multer")
const { storage } = require("../couldConfig.js")
const upload = multer({ storage })

//index
router.get('/', wrapAsync(listingController.index))

//new
router.get('/new', isLoggedIn, listingController.newListingForm)

//create
router.post('/create', isLoggedIn, upload.single('Listing[image]'), validateListing, wrapAsync(listingController.createListing));

//edit
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.editForm))

//update
router.put('/:id', isLoggedIn, isOwner, upload.single('Listing[image]'), validateListing, wrapAsync(listingController.updateListing))

//delete
router.delete('/:id', isLoggedIn, isOwner, wrapAsync(listingController.deleteListing))

//show
router.get('/:id', wrapAsync(listingController.showListing))

module.exports = router
