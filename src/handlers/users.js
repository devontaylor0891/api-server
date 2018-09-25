'use strict';
var _ = require('lodash');
var connection = require('../../db');
var UserById = require('./users/{id}');
var UserByIdOrders = require('./users/{id}/orders');
let lambda = require('./lambda/functions');

module.exports = {
  get_users: function(req, res) {
    connection.query(
      `SELECT * FROM users`,
      function (error, usersResult) {
        let users = usersResult.map(function(row) 
          {
            return {
              id: row.id,
              firstName: row.first_name,
              email: row.email,
              registrationDate: row.registration_date,
              role: row.role
            }
          }
        );
        return res.status(200).send(users);
      }
    )
  },

  post_users: function (req, res) {
    let postQuery = {
      email: `${req.body.email}`,
      registration_date: `${req.body.registrationDate}`,
      auth0_id: `${req.body.auth0Id}`
    };
    connection.query(
      `INSERT INTO users SET ?`,
      postQuery,
      function(err, result) {
        if (err) {
          console.log('error in create user:', err);
          res.send('error:', err);
        } else {
          console.log('user created: ', result);
          // send me an email
          lambda.new_user_notification(req, res);
          return res.status(200).send(result);
        }
      }
    );
  },

  get_users_id: function(req, res) {
    UserById.get_users_id(req, res);
  },

  get_users_auth_id: function (req, res) {
    var id = req.params.id;
    connection.query(
      `SELECT * FROM users
      WHERE auth0_id = '${id}'`, function (error, results) {
        console.log('req.params.authid: ', req.params.id);
        console.log('results: ', results);
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

  put_users_id: function(req, res) {
    console.log('put called: ', req.body);
    let postQuery = {
      first_name: `${req.body.firstName}`,
      email: `${req.body.email}`,
      role: `${req.body.role}`
    };
    let userId = req.params.id;
    connection.query(
      `UPDATE users 
      SET ? 
      WHERE id = ?;`,
      [postQuery, userId],
      function (err, result) {
        if (err) {
          console.log('error in update user:', err);
          res.status(500).send('error:', err);
        } else {
          console.log('user updated: ', result);
          console.log('postQuery: ', postQuery);
          return res.status(200).send(result);
        }
      } 
    )
  },

  get_users_id_orders: function(req, res) {
    // UserByIdOrders.get_users_id_orders(req, res);
    UserById.get_users_id_orders(req, res);
  },

  post_users_id_orders: function(req, res) {
    console.log(req.params.id);
    var userId = req.params.id;
    return res.send(201);
  },

  delete_users_id: function (req, res) {
    UserById.delete_users_id(req, res);
  }
};
