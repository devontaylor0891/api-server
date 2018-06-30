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

  // post_users: function(req, res) {
  //   let user = req.body;
  //   connection.query(
  //     `INSERT INTO users (
  //       first_name,
  //       email,
  //       role,
  //       registration_date,
  //       user_id
  //     )
  //     SET (
  //       ${user.firstName},
  //       ${user.email},
  //       ${user.role},
  //       ${user.registrationDate},
  //       ${user.id}
  //     )`, function (error, userResult) {
  //       if (error) {
  //         console.log('error: ', error);
  //       };
  //       return res.status(200).send(userResult);
  //     }
  //   );
  //   // return res.status(200).send(req.body);
  // },

  post_users: function (req, res) {
    let sql = `INSERT INTO users (
      first_name,
      email,
      role,
      registration_date,
      user_id
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id`;
    let data = [
      req.body.firstName,
      req.body.email,
      req.body.role,
      req.body.registrationDate,
      req.body.id
    ];
    connection.query(sql, data, function (err, result) {
      if (err) {
        console.error(err);
        res.status = 500;
        return res.json({
          errors: ['Did not create a new user']
        });
      }
      let newUserId = result.rows[0].id;
      let sql = `SELECT * FROM users WHERE id = $1`;
      connection.query(sql, [ newUserId ], function(err, result) {
        if (err) {
          console.error(err);
          res.status = 500;
          return res.json({
            errors: ['Did not return a new user']
          });
        };
        // The request created a new resource object
        res.statusCode = 201;
        console.log('user was created');
        // The result of CREATE should be the same as GET
        res.json(result.rows[0]);
      })
    })
  },

  // post_users: function (req, res) {
  //   let first_name = req.body.firstName;
  //   let email = req.body.email;
  //   let role = req.body.role;
  //   let registrationDate = req.body.registrationDate;
  //   let userId = req.body.id;
  //   var data = {
  //       "Data":""
  //   };
  //   connection.query("SELECT * from users WHERE user_id=?", userId, function(err, rows, fields){
  //     if (rows.length != 0) {
  //       console.log('rows: ', res.json(rows));
  //         data["Data"] = "Successfully logged in..";
  //         res.json(data);
  //         return res.status(200).send(rows);
  //     } else {
  //       console.log('failed: ', res.json(rows));
  //         data["Data"] = "incorrectomundo";
  //         res.json(data);
  //         return res.status(200).send('failed: ', rows);
  //     }
  //   });
  // },

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
