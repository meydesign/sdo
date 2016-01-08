var sql = require('mssql');
var Security;
var config = {
  user: 'meydesign',
  password: 'z@chary07',
  server: 'www.salesdisclosuresonline.com',
  database: 'sdo',
  options: {},
};

function findByEmailPassword(email, password, callback) {
  var conn;
  // var query = 'SELECT * FROM tbl_users WHERE email="' + email.toLowerCase().trim() + '"';
  // var query = 'SELECT * FROM tbl_users WHERE email="mhiatt@sri-taxsale.com"';
  // query += '" AND password="' + password + '"';

  conn = new sql.Connection(config, function connCallback(err1) {
    var request;
    if (err1) {
      return callback(err1);
    }

    request = new sql.Request(conn);

    request.input('email', email.toLowerCase().trim());
    request.input('password', password);

    request.query('SELECT * FROM tbl_users WHERE @email=email AND @password=password', function queryCallback(err2, recordset) {
      if (err2) {
        return callback(err2);
      }
      console.log(recordset);
      return callback(null, recordset);
    });
  });
}

// Declare Module Object
// ----------------------------------------------------------------------------
Security = {

  passportSerializeUser: function passportSerializeUserFn(data, callback) {
    console.log('serialize');
    console.log(data);
    callback(null, data.userData);
  },

  passportDeserializeUser: function passportDeserializeUserFn(data, callback) {
    console.log('deserialize');
    console.log(data);
    callback(null, { userData: data });
  },

  passportLocalStrategy: function passportLocalStrategyFn(email, password, callback) {
    findByEmailPassword(email.toLowerCase(), password,
      function callBackFn(err, jsonData) {
        if (err) {
          console.log(err);
          return callback(
            null, false, { message: err }
          );
        }

        if (!jsonData) {
          return callback(
            null, false, { message: 'Invalid Username or Password.' }
          );
        }

        return callback(null, { userData: jsonData[0] });
      }
    );
  },
};

// Export module
// ----------------------------------------------------------------------------
module.exports = Security;
