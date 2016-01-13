var async = require('async');
var accounting = require('accounting');
var dateFormat = require('dateformat');
var sql = require('../controllers/mssql');
var express = require('express');
var router = new express.Router();


router.get('/search', function searchCallback(req, res) {
  res.render('search', { title: 'Search' });
});

router.get('/form/:sdoId', function formCallback(req, res) {
  var resObj = {};
  // need to make all the nessassary calls for data maybe use async if too many calls
  console.log(req.params.sdoId);
  async.parallel(
    [
      function step1Fn(callback) {
        sql('SELECT * FROM tbl_search_parcel WHERE fkSaleID = ' + req.params.sdoId, function sqlCallback(err, result) {
          var i;

          if (err) {
            return callback(err);
          }

          for (i = 0; i < result.length; i++) {
            result[i].DLGFAVLand = accounting.formatMoney(result[i].DLGFAVLand);
            result[i].DLGFAVImprovements = accounting.formatMoney(result[i].DLGFAVImprovements);
            result[i].DLGFAVPersonalProperty = accounting.formatMoney(result[i].DLGFAVPersonalProperty);
            result[i].DLGFAVTotal = accounting.formatMoney(result[i].DLGFAVTotal);
          }

          resObj.step1 = result;
          return callback(null);
        });
      },
      function step2Fn(callback) {
        sql('SELECT * FROM tbl_search_form WHERE fkSaleID = ' + req.params.sdoId, function sqlCallback(err, result) {
          var i;

          if (err) {
            return callback(err);
          }

          for (i = 0; i < result.length; i++) {
            result[i].AmountOfLoan = accounting.formatMoney(result[i].AmountOfLoan);
            result[i].SalePrice = accounting.formatMoney(result[i].SalePrice);
            result[i].BuyerSellerRelationshipDiscount = accounting.formatMoney(result[i].BuyerSellerRelationshipDiscount);
            result[i].ConveyanceDate = dateFormat(result[i].ConveyanceDate, 'MM-dd-yyyy');
            result[i].DLGFLandContractDate = dateFormat(result[i].DLGFLandContractDate, 'MM-dd-yyyy');
            result[i].SDFDate = dateFormat(result[i].SDFDate, 'MM-dd-yyyy');
          }
          console.log(result[0]);
          resObj.step2 = result[0];
          return callback(null);
        });
      },
      function step3Fn(callback) {
        sql('SELECT * FROM tbl_search_seller WHERE fkSaleID = ' + req.params.sdoId, function sqlCallback(err, result) {
          if (err) {
            return callback(err);
          }

          resObj.step3 = result;
          return callback(null);
        });
      },
      function step4Fn(callback) {
        sql('SELECT * FROM tbl_search_buyer WHERE fkSaleID = ' + req.params.sdoId, function sqlCallback(err, result) {
          if (err) {
            return callback(err);
          }

          resObj.step4 = result;
          return callback(null);
        });
      },
      function step5Fn(callback) {
        sql('SELECT * FROM vwDisplay_Buildings WHERE fkSaleID = ' + req.params.sdoId, function sqlCallback(err, result) {
          if (err) {
            return callback(err);
          }

          resObj.step5 = result;
          return callback(null);
        });
      },
    ],
    function finalCallback(err) {
      if (err) {
        console.log(err);
      }

      res.render('form2', {
        title: 'Form',
        dsSDO_Parcels_Array: resObj.step1,
        dsSDO_Form: resObj.step2,
        dsSDO_Sellers: resObj.step3,
        dsSDO_Buyers: resObj.step4,
        dsSDO_Buildings: resObj.step5,
      });
    }
  );
});

module.exports = router;
