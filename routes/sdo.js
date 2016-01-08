var express = require('express');
var router = new express.Router();

router.get('/search', function searchCallback(req, res, next) {
  res.render('search', { title: 'Search' });
});

module.exports = router;
