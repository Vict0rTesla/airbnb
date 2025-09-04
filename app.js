const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');


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

//root
app.get('/', (req, res) => {
  res.redirect('/listings')
})

//index
app.get('/listings', async (req, res) => {
  const allListing = await Listing.find({});
  res.render('listings/index.ejs', { allListing });
})

//new
app.get('/listings/new', (req, res) => {
  res.render('listings/new.ejs')
})

//create
app.post('/listings/create', (req, res) => {
  const newListing = new Listing(req.body.Listing)
  newListing.save()
  res.redirect('/listings')
})

//edit
app.get('/listings/:id/edit', async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/edit.ejs', { listing })
})

//update
app.put('/listings/:id', async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.Listing })

  res.redirect(`/listings/${id}`)
})

app.delete('/listings/:id', async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id)
  res.redirect('/listings')
})


//show
app.get('/listings/:id', async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/show.ejs', { listing });
})

const port = 8000;
app.listen(port, "0.0.0.0", () => {
  console.log("listening at port 8000");
})
