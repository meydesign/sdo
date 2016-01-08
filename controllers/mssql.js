var sql = require('mssql');

var config = {
  user: 'meydesign',
  password: 'z@chary07',
  server: 'www.salesdisclosuresonline.com',
  database: 'salesdisclosuresonline',
  options: {},
};

var connection = function connectionFn(query, callback) {
  var request;
  var conn = new sql.Connection(config, function connCallback(err1) {
    if (err1) {
      return err1;
    }

    request = new sql.Request(conn);
    request.query(query, function queryCallback(err2, recordset) {
      return callback(err2, recordset);
    });
  });
};

module.exports = connection;
