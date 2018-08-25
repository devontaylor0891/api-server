'use strict';
var connection = require('../../../db');

module.exports = {
  get_users_id: function(req, res) {
    var id = req.params.id;

    connection.query(
      `SELECT * FROM users
      WHERE id = ${id}`, function (error, results) {
        let newUser = results.map(function(row) {
          return {
            id: row.id,
            firstName: row.first_name,
            email: row.email,
            registrationDate: row.registration_date,
            role: row.role
          }
        })
        return res.status(200).send(newUser);
      }
    )
  },

  get_users_id_orders: function (req, res) {
    return res.status(200).send('ok');
  }
};
  