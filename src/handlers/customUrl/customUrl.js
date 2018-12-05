'use strict';
var connection = require('../../../db');

module.exports = {

  resolve_custom_url: function (req, res) {
    var customString = req.params.urlString.toLowerCase();
    connection.query(
      `SELECT * FROM custom_urls
      WHERE custom_url = '${customString}'`, function (error, results) {
        if (error) {
          res.send('error:', error);
        } else {
          console.log('req.params.id: ', customString);
          console.log('results: ', results);
          let id = results.map(function(row) {
            return row.user_id_fk
          })
          return res.status(200).send(id);
        }
      }
    )
  },

  post_custom_url: function (req, res) {
    let postQuery = {
      user_id_fk: `${req.body.userId}`,
      custom_url: `${req.body.customUrl}`
    };
    connection.query(
      'INSERT INTO custom_urls SET ?',
      postQuery,
      function(err, result) {
        if (err) {
          res.send('error:', err);
        } else {
          return res.status(200).send(result);
        }
      }
    )
  },

  get_custom_url: function (req, res) {
    let id = req.params.id;
    connection.query(
      `SELECT * FROM custom_urls
      WHERE user_id_fk = '${id}'`, function (error, results) {
        if (error) {
          return res.status(500).send(error);
        } else {
          console.log('req.params.id: ', id);
          console.log('results: ', results);
          let customUrl = results.map(function(row) {
            return {
              id: row.custom_url_id,
              userId: row.user_id_fk,
              customUrl: row.custom_url
            }
          })
          return res.status(200).send(customUrl);
        }
      }
    )
  },

  put_custom_url: function (req, res) {
    
  }

}