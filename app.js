const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');

const listings = require('./routes/listing.js');
const reviews = require('./routes/review.js');

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



app.use("/listings", listings)
app.use("/listings/:id/reviews", reviews)

//root
app.get('/', (req, res) => {
  res.redirect('/listings')
})

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
