'use strict';
var _ = require('lodash');
var connection = require('../../db');
var Market = require('./markets/{id}');
let lambda = require('./lambda/functions');

module.exports = {

  post_market: function (req, res) {
    console.log('new market req: ', req.body);
    let postQuery = {
      user_id_fk: `${req.body.id}`,
      name: `${req.body.name}`,
      description: `${req.body.description}`,
      logoUrl: `${req.body.logoUrl}`
    };
    connection.query(
      'INSERT INTO markets SET ?',
      postQuery,
      function(err, result) {
        if (err) {
          res.send('error:', err);
        } else {
          // send me an email
          lambda.new_market_notification(req, res);
          return res.status(200).send(result);
        }
      }
    )
  },

  get_markets_id: function(req, res) {
		Market.get_markets_id(req, res);
  },

  // put_market_id: function(req, res) {
  //   market.put_markets_id(req, res);
  // },

  // get_market_id_products: function (req, res) {
  //   market.get_market_id_products(req, res);
  // },

  get_market_id_schedules: function(req, res) {
    Market.get_market_id_schedules(req, res);
  }

  // get_market_id_future_schedules: function(req, res) {
  //   market.get_market_id_future_schedules(req, res);
  // },

  // post_markets_id_schedules: function(req, res) {
  //   return res.send(201);
  // },

  // get_market_id_orders: function (req, res) {
  //   market.get_market_id_orders(req, res);
  // },

  // delete_markets_id: function (req, res) {
  //   market.delete_markets_id(req, res);
  // }

};
