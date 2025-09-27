const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js')
const passport = require('passport');
const { saveRedirectUrl } = require('../middileware.js');
const userController = require("../controller/users.js")

router.get('/signup', userController.renderSignUp)

router.post('/signup', wrapAsync(userController.signUp))

router.get('/login', userController.renderLogin)

router.post('/login', saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.login)

router.get('/logout', userController.logout)


module.exports = router;
