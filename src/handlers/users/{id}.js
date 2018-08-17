'use strict';
var connection = require('../../../db');

module.exports = {
  get_users_id: function(req, res) {
    var id = req.params.id;

    connection.query(
      `SELECT * FROM users
      WHERE id = ${id}`, function (error, results) {
        // console.log('req.params.id: ', req.params.id);
        // console.log('results: ', results);
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
    // connection.query(`
    //   SELECT u.*, p.id AS producer_id
    //   FROM users AS u
    //   LEFT JOIN producers p
    //     on p.user_id = u.id
    //     WHERE u.id = ${userId}`,
    //   function (error, userResult) {
    //   if (userResult.length === 0) {
    //     res.status(404).send({ message: "User not found"});
    //     return;
    //   }
    //   console.log("userResult 1", userResult);

    //   connection.query(`SELECT * FROM orders WHERE user_id = ${userId}`, function (error, ordersResults) {
    //     var user = userResult.map(function(row) {
    //       return {
    //         id: row.id,
    //         firstName: row.first_name,
    //         email: row.email,
    //         registrationDate: row.registration_date,
    //         role: row.producer_id ? 'producer' : 'consumer',
    //         orders: ordersResults || [],
    //       }
    //     });
    //     res.status(200).send(user);
    //   });
    // });
  },
};
  