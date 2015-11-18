var express = require('express');
var router = new express.Router();

/* GET users listing. */
router.get('/', function usersGet(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
