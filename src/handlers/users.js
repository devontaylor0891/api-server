'use strict';
var _ = require('lodash');
var connection = require('../../db');
var UserById = require('./users/{id}');
var UserByIdOrders = require('./users/{id}/orders');

module.exports = {
  get_users: function(req, res) {
    connection.query(
      `SELECT * FROM users`, function (error, usersResult) {
        return res.status(200).send(usersResult);
      }
    )
    // return res.send(201, logg())
    // function logg() {
    //   console.log('getusers called: ', req);
    // };
    // connection.query(`
    //   SELECT u.*, p.id AS producer_id
    //   FROM users AS u
    //   LEFT JOIN producers p
    //     on p.user_id = u.id`, function (error, usersResult) {
    //   if (usersResult.length === 0) {
    //     res.status(404).send({ message: "Users not found"});
    //     return;
    //   }
    //   console.log("usersResult 1:", usersResult);

    //   connection.query(`
    //     SELECT * FROM orders`, function (error, ordersResults) {
    //     const ordersGroupedBy = _(ordersResults)
    //       .groupBy('user_id')
    //       .value();

    //     var users = usersResult.map(function(row) {
    //       return {
    //         id: row.id,
    //         firstName: row.first_name,
    //         email: row.email,
    //         registrationDate: row.registration_date,
    //         role: row.producer_id ? 'producer' : 'consumer',
    //         orders: ordersGroupedBy[row.id] || [],
    //       }
    //     });
    //     res.status(200).send(users);
    //   });
    // });
  },

  post_users: function(req, res) {
    let user = req.body;
    connection.query(
      `INSERT INTO users (
        first_name,
        email,
        role,
        registration_date,
        user_id
      )
      SET (
        ${user.firstName},
        ${user.email},
        ${user.role},
        ${user.registrationDate},
        ${user.id}
      )`, function (error, userResult) {
        if (error) {
          console.log('error: ', error);
        };
        return res.status(200).send(userResult);
      }
    );
    // return res.status(200).send(req.body);
  },

  get_users_id: function(req, res) {
    UserById.get_users_id(req, res);

  },

  get_users_id_orders: function(req, res) {
    UserByIdOrders.get_users_id_orders(req, res);
  },

  post_users_id_orders: function(req, res) {
    console.log(req.params.id);
    var userId = req.params.id;
    return res.send(201);
  },
};
