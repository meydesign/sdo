var express = require('express');
var router = new express.Router();
var sql = require('../../controllers/mssql');

router.post('/table', function tableGet(req, res, next) {
  var sqlQuery = 'SELECT DISTINCT TOP 1000 pkSaleID, DLGFPin, convert(varchar, ConveyanceDate, 101) AS ConveyanceDate, SalePrice, DLGFBuyerFullName, DLGFSellerFullName, CountyName, GISAddress, PinGIS, DLGFPropertyAddress, LegalDescription, occupancyDescription, gradesGrade, StoryHeightShort, Area, ConditionCode, YearBuilt, FinishedArea FROM searchForm_v3_advanced WHERE 1 = 1';

  console.log(req.body);
  // PRIORITY 1 - SDO/SDF ID
  if ((req.body.sdoId) || (req.body.sdfId)) {
    if (req.body.sdoId !== '') {
      sqlQuery += ' AND pkSalesDisclosureFormID = ' + req.body.sdoId;
    } else if (req.body.sdfId !== '') {
      sqlQuery += ' AND SDFID = ' + req.body.sdfId;
    }
  } else if ((req.body.parcel) || (req.body.legacy_parcel)) {
    if (req.body.parcel !== '') {
      sqlQuery += ' AND DLGFPin = ' + req.body.parcel;
    } else if (req.body.legacy_parcel !== '') {
      sqlQuery += ' AND DLGFPin2 = ' + req.body.legacy_parcel;
    }
  } else {
    // sale price and dates streetPart
    // sale price and dates end

    if (req.body.county && req.body.county !== '00') {
      sqlQuery += ' AND fkCountyID = ' + req.body.county;
    }

    if (req.body.tax_district && req.body.tax_district !== '00') {
      sqlQuery += ' AND fkTaxingDistrictID = ' + req.body.tax_district;
    }

    if (req.body.street && req.body.street.trim() !== '') {
      sqlQuery += ' AND DLGFPropertyStreet LIKE "%' + req.body.street.trim() + '%"';
    }

    if (req.body.city && req.body.city !== '') {
      sqlQuery += ' AND DLGFPropertyCity = ' + req.body.city;
    }

    if (req.body.search_prop_zip_1 && req.body.search_prop_zip_1 !== '') {
      sqlQuery += ' AND DLGFPropertyZipcode =' + req.body.search_prop_zip_1;
    }

    if (req.body.search_prop_zip_2 && req.body.search_prop_zip_2 !== '') {
      sqlQuery += ' AND DLGFPropertyZipcode4 =' + req.body.search_prop_zip_2;
    }

    sqlQuery += ' AND (DLGFParcelAcreage >= ' + req.body.search_prop_acreage_1 + ' AND DLGFParcelAcreage <= ' + req.body.search_prop_acreage_2 + ')';

    if (req.body.legal_description && req.body.legal_description.trim() !== '') {
      sqlQuery += ' AND LegalDescription LIKE "%' + req.body.legal_description.trim() + '%"';
    }

    if (req.body.homestead && req.body.homestead !== 'any') {
      sqlQuery += ' AND deductionHomestead = ';
      sqlQuery += (req.body.homestead === 'true') ? '1' : '0';
    }

    if (req.body.valid_trending && req.body.valid_trending !== 'any') {
      sqlQuery += ' AND ValidForTrending = ';
      sqlQuery += (req.body.valid_trending === 'true') ? '1' : '0';
    }

    // all the check boxes
    if (req.body.pcgroup_01 || req.body.pcgroup_02 || req.body.pcgroup_03 || req.body.pcgroup_04 || req.body.pcgroup_05 || req.body.pcgroup_06 || req.body.pcgroup_07 || req.body.pcgroup_08 || req.body.pcgroup_09 || req.body.pcgroup_10 || req.body.pcgroup_11 || req.body.pcgroup_12) {
      sqlQuery += ' AND (';

      if (req.body.pcgroup_01 && req.body.pcgroup_01 === '1') {
        sqlQuery += ' OR ClassGroup = "Ag Improved"';
      }

      if (req.body.pcgroup_02 && req.body.pcgroup_02 === '1') {
        sqlQuery += ' OR ClassGroup = "Ag Land"';
      }

      if (req.body.pcgroup_03 && req.body.pcgroup_03 === '1') {
        sqlQuery += ' OR ClassGroup = "Comm Improved"';
      }

      if (req.body.pcgroup_04 && req.body.pcgroup_04 === '1') {
        sqlQuery += ' OR ClassGroup = "Comm Unimprovedd"';
      }

      if (req.body.pcgroup_05 && req.body.pcgroup_05 === '1') {
        sqlQuery += ' OR ClassGroup = "Exempt"';
      }

      if (req.body.pcgroup_06 && req.body.pcgroup_06 === '1') {
        sqlQuery += ' OR ClassGroup = "Ind Improved"';
      }

      if (req.body.pcgroup_07 && req.body.pcgroup_07 === '1') {
        sqlQuery += ' OR ClassGroup = "Ind Unimproved"';
      }

      if (req.body.pcgroup_08 && req.body.pcgroup_08 === '1') {
        sqlQuery += ' OR ClassGroup = "Mineral Rights"';
      }

      if (req.body.pcgroup_09 && req.body.pcgroup_09 === '1') {
        sqlQuery += ' OR ClassGroup = "Res Improved"';
      }

      if (req.body.pcgroup_10 && req.body.pcgroup_10 === '1') {
        sqlQuery += ' OR ClassGroup = "Res Unimproved"';
      }

      if (req.body.pcgroup_11 && req.body.pcgroup_11 === '1') {
        sqlQuery += ' OR ClassGroup = "Unassigned"';
      }

      if (req.body.pcgroup_12 && req.body.pcgroup_12 === '1') {
        sqlQuery += ' OR ClassGroup = "Utility"';
      }

      sqlQuery += ')';
      sqlQuery += sqlQuery.replace(' AND ( OR', ' AND (');
    }

    // sqlQuery += ' AND (PropertyClassCode >= ' + req.body.search_prop_range_1 + ' AND PropertyClassCode <= ' + req.body.search_prop_range_2 + ')';

    if (req.body.buyer && req.body.buyer !== '') {
      sqlQuery += ' AND DLGFBuyerFullName LIKE "%' + req.body.buyer.trim() + '%"';
    }

    if (req.body.seller && req.body.seller !== '') {
      sqlQuery += ' AND DLGFSellerFullName LIKE "%' + req.body.seller.trim() + '%"';
    }

    if (req.body.preparer && req.body.preparer !== '') {
      sqlQuery += ' AND DLGFTitleCompanyFullName LIKE "%' + req.body.preparer.trim() + '%"';
    }
  }

  sqlQuery += ' ORDER BY ConveyanceDate DESC';

  console.log(sqlQuery);

  sql(sqlQuery, function sqlCallback(err, result) {
    var jsonResponse = {
      aaData: [],
    };

    if (err) {
      res.json(jsonResponse);
      return;
    }

    jsonResponse.aaData = result;
    res.json(jsonResponse);
    return;
  });
});

module.exports = router;
