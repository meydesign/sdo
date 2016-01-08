var express = require('express');
var router = new express.Router();
var passport = require('passport');

/* GET users listing. */
router.route('/login').post(passport.authenticate('local', {
  failureRedirect: '/login',
}), function passportCallback(req, res) {
  console.log('works');
  res.redirect('/sdo/search');
});

router.route('/logout').all(function routeCallback(req, res) {
  req.logout();

  res.redirect('/login');
});

module.exports = router;
