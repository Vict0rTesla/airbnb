const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

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

const sessionOption = {
  secret: "chinkipinkichonki",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
}

//root
app.get('/', (req, res) => {
  res.redirect('/listings')
})

app.use(session(sessionOption))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())


app.use((req, res, next) => {
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  res.locals.currUser = req.user
  next()
})


app.use("/listings", listingRouter)
app.use("/listings/:id/reviews", reviewRouter)
app.use("/", userRouter)

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
