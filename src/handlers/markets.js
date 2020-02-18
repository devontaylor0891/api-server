'use strict';
var _ = require('lodash');
var connection = require('../../db');
var Producer = require('./producers/{id}');
let lambda = require('./lambda/functions');

module.exports = {
  // get_producers: function(req, res) {
  //   connection.query(
  //     `SELECT * FROM producers
  //     LEFT JOIN users ON producers.user_id = users.id`,
  //     function (error, producersResult) {
  //       let producers = producersResult.map(function(row) 
  //         {
  //           return {
  //             id: row.user_id,
  //             producerId: row.producer_id,
  //             name: row.name,
  //             location: row.location,
  //             province: row.province,
  //             longitude: row.longitude,
  //             latitude: row.latitude,
  //             status: row.status,
  //             address: row.address,
  //             description: row.description,
  //             logoUrl: row.logoUrl,
  //             firstName: row.first_name,
  //             email: row.email,
  //             registrationDate: row.registration_date
  //           }
  //         }
  //       );
  //       return res.status(200).send(producers);
  //     }
  //   )

  // },

  post_market: function (req, res) {
    console.log('new market req: ', req);
    let postQuery = {
      user_id: `${req.body.id}`,
      name: `${req.body.name}`,
      location: `${req.body.location}`,
      province: `${req.body.province}`,
      address: `${req.body.address}`,
      description: `${req.body.description}`,
      logoUrl: `${req.body.logoUrl}`,
      longitude: `${req.body.longitude}`,
      latitude: `${req.body.latitude}`,
      status: `${req.body.status}`
    };
    connection.query(
      'INSERT INTO markets SET ?',
      postQuery,
      function(err, result) {
        if (err) {
          res.send('error:', err);
        } else {
          // send me an email
          lambda.new_producer_notification(req, res);
          return res.status(200).send(result);
        }
      }
    )
  }

  // get_producers_id: function(req, res) {
	// 	Producer.get_producers_id(req, res);
  // },

  // put_producer_id: function(req, res) {
  //   Producer.put_producers_id(req, res);
  // },

  // get_producer_id_products: function (req, res) {
  //   Producer.get_producer_id_products(req, res);
  // },

  // get_producer_id_schedules: function(req, res) {
  //   Producer.get_producer_id_schedules(req, res);
  // },

  // get_producer_id_future_schedules: function(req, res) {
  //   Producer.get_producer_id_future_schedules(req, res);
  // },

  // post_producers_id_schedules: function(req, res) {
  //   return res.send(201);
  // },

  // get_producer_id_orders: function (req, res) {
  //   Producer.get_producer_id_orders(req, res);
  // },

  // delete_producers_id: function (req, res) {
  //   Producer.delete_producers_id(req, res);
  // }

};
