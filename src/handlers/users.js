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

  post_users: function (req, res) {
    connection.query(
      `INSERT INTO users (
        email, 
        registration_date, 
        user_id
      ) VALUES (
        '${req.body.email}', 
        '${req.body.registrationDate}', 
        '${req.body.id}'
      )`, function (err, result) {
        if (err) {
          console.log('error in create user:', err);
          res.send('error:', err);
        } else {
          console.log('user created: ', result);
          return res.status(200).send(result);
        }
      }
    )
  },

  get_users_id: function(req, res) {
    UserById.get_users_id(req, res);

  },

  put_users_id: function(req, res) {
    // get the primary key id
    let id = connection.query(
      `SELECT * FROM users WHERE user_id='${req.params.id}'`, function (err, res) {
        if (err) {
          console.log('error in fetching user:', err);
          res.send('error:', err);
        } else {
          console.log('user fetched: ', res);
          return res.send(res.id);
        }
      }
    )
    if (req.body.role === 'consumer') {// if consumer, patch firstName, role, email
      connection.query(
        `UPDATE users SET
        first_name='${req.body.firstName}',
        email='${req.body.email}',
        role='consumer'
        WHERE user_id='${id}'
        `
      ), function (err, result) {
        if (err) {
          console.log('error in update user:', err);
          res.send('error:', err);
        } else {
          console.log('user updated: ', result);
          return res.status(200).send(result);
        }
      }
    } else { // if producer, patch consumer values AND producer values

    }
    
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
