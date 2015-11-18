var express = require('express');
var router = new express.Router();

/* GET home page. */
router.get('/', function indexCallback(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/about', function aboutCallback(req, res, next) {
  res.render('about', { title: 'About' });
});

router.get('/contact', function contactCallback(req, res, next) {
  res.render('contact', { title: 'Contact' });
});

router.get('/help', function helpCallback(req, res, next) {
  res.render('help', { title: 'Help' });
});

router.get('/login', function loginCallback(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.get('/register', function registerCallback(req, res, next) {
  res.render('register', { title: 'Registration' });
});

router.get('/search', function searchCallback(req, res, next) {
  res.render('search', { title: 'Search' });
});
module.exports = router;
