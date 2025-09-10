const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('./schema.js');
const Review = require('./models/reviews.js');


const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";
main()
  .then(() => {
    console.log('connected to DB');
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const path = require("path");
app.set("view engine", "ejs");
app.engine('ejs', ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error)
  } else {
    next();
  }

}

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error)
  } else {
    next();
  }

}

//root
app.get('/', (req, res) => {
  res.redirect('/listings')
})

//index
app.get('/listings', wrapAsync(async (req, res) => {
  const allListing = await Listing.find({});
  res.render('listings/index.ejs', { allListing });
}))

//new
app.get('/listings/new', (req, res) => {
  res.render('listings/new.ejs')
})

//create
app.post('/listings/create', validateListing, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.Listing)
  await newListing.save()
  res.redirect('/listings')
}));

//edit
app.get('/listings/:id/edit', wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/edit.ejs', { listing })
}))

//review-post
app.post('/listings/:id/reviews', validateReview, wrapAsync(async (req, res) => {
  let id = req.params.id;
  let listing = await Listing.findById(id);
  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${id}`)
}))

//review-delete
app.delete('/listings/:id/reviews/:reviewId', wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}))

//update
app.put('/listings/:id', validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.Listing })
  res.redirect(`/listings/${id}`)
}))

//delete
app.delete('/listings/:id', wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id)
  res.redirect('/listings')
}))

//show
app.get('/listings/:id', wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render('listings/show.ejs', { listing });
}))

//error
app.all('/{*err}', (req, res, next) => {
  next(new ExpressError(404, 'Page Not Found!'));
})

app.use((err, req, res, next) => {
  let { statusCode = 500, message = 'Something went wrong' } = err;
  res.status(statusCode).render('listings/error.ejs', { message })
})

const port = 8000;
app.listen(port, "0.0.0.0", () => {
  console.log("listening at port 8000");
})
