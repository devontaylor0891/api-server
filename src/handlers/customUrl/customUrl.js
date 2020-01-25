'use strict';
var connection = require('../../../db');

module.exports = {

  resolve_custom_url: function (req, res) {
    console.log('resolve customurl: ', req);
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
    console.log('post custom url postQuery: ', postQuery);
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
    console.log('custom url req: ', req);
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
    let postQuery = {
      user_id_fk: `${req.body.userId}`,
      custom_url: `${req.body.customUrl}`
    };
    console.log('put custom url postQuery: ', postQuery);
    let id = req.params.id;
    connection.query(
      `SET SQL_SAFE_UPDATES=0;
      UPDATE custom_urls 
      SET ? 
      WHERE custom_url_id = ?;
      SET SQL_SAFE_UPDATES=1;`,
      [postQuery, id],
      function (err, result) {
        if (err) {
          return res.status(500).send('error:', err);
        } else {
          return res.status(200).send(result);
        }
      } 
    )
  }

}