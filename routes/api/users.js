var express = require('express');
var router = new express.Router();
var sql = require('../../controllers/mssql');

/* GET users listing. */
router.get('/', function usersGet(req, res, next) {
  sql('SELECT * from Sales WHERE fkUserID=1106', function sqlCallback(err, result) {
    console.log(res.locals);
  });
});

module.exports = router;
