'use strict';
var _ = require('lodash');
var connection = require('../../db');
var Market = require('./markets/{id}');
let lambda = require('./lambda/functions');
var async = require('async');

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
      function(err, marketResult) {
        if (err) {
          res.send('error:', err);
        } else {
          // insertion successful, add locations as necessary
          const marketId = marketResult.insertId;
          let locations = req.body.locations;
          let postQuery;
          async.eachOfSeries(locations, function(location, index, innerCallback) {
            // build postQuery
            postQuery = {
              market_id_fk: `${marketId}`,
              latitude: `${location.latitude}`,
              longitude: `${location.longitude}`,
              address: `${location.address}`,
              city: `${location.city}`,
              province: `${location.province}`,
              description: `${location.description}`,
              timeframe: `${location.timeframe}`,
              location_name: `${location.locationName}`
            };
            // connect and insert
            connection.query(
              `INSERT INTO market_locations SET ?`,
              postQuery,
              function (err, result) {
                if (err) {
                  console.log('error: ', err);
                  innerCallback(err, null);
                } else {
                  console.log('market Loc created: ', result);
                  innerCallback(null, null);
                }
              }
            )
          }, function(err, results) { // final callback executed when each of series is completed
            if(err){
                console.error(err);
            } else {
              console.log('all market Locs added');
              // return res.send('all mark locs added');
              // callback(null, results);
              // send me an email
              // lambda.new_market_notification(req, res);
              return res.status(200).send(marketResult);
            }
          });
        }
      }
    )
  },

  get_markets_id: function(req, res) {
		Market.get_markets_id(req, res);
  },

  put_markets_id: function(req, res) {
    Market.put_markets_id(req, res);
  },

  // get_market_id_products: function (req, res) {
  //   market.get_market_id_products(req, res);
  // },

  get_market_id_locations: function(req, res) {
    Market.get_market_id_locations(req, res);
  },

  post_market_locations: function(req, res) {
    Market.post_market_locations(req, res);
  },

  get_locations_search: function(req, res) {
    console.log('search Results req: ', req.body);
    // get the search parameters
    // let distance = req.body.radius;
    let distance = 150;
    let latitude = req.body.lat;
    // let latitude = 50.1436;
    let longitude = req.body.lng;
    // let longitude = -101.6668;
    let maxlat, maxlng, minlat, minlng;

    // Converts from degrees to radians.
    Math.radians = function(degrees) {
      return degrees * Math.PI / 180;
    };
    
    // Converts from radians to degrees.
    Math.degrees = function(radians) {
      return radians * 180 / Math.PI;
    };

    // set other parameters (from https://coderwall.com/p/otkscg/geographic-searches-within-a-certain-distance)
    // earth's radius in km = ~6371
    let earthRadius = 6371;

    // latitude boundaries
    maxlat = latitude + Math.degrees(distance / earthRadius);
    minlat = latitude - Math.degrees(distance / earthRadius);

    // longitude boundaries (longitude gets smaller when latitude increases)
    maxlng = longitude + Math.degrees(distance / earthRadius / Math.cos(Math.radians(latitude)));
    minlng = longitude - Math.degrees(distance / earthRadius / Math.cos(Math.radians(latitude)));
    console.log('lat: ', latitude)
    console.log('lng: ', longitude);
    console.log('maxlat: ', maxlat);
    console.log('maxlng: ', maxlng);
    console.log('minlat: ', minlat);
    console.log('minlng: ', minlng);

    // build a query inside a promise, this will return the rows from the query
  
    res.send(200).status('OK');
  },

  put_market_id_locations: function(req, res) {
    Market.put_market_id_locations(req, res);
  },

  get_market_id_schedules: function(req, res) {
    Market.get_market_id_schedules(req, res);
  },

  put_market_id_schedules: function(req, res) {
    Market.put_market_id_schedules(req, res);
  },

  delete_market_id_locations: function(req, res) {
    Market.delete_market_id_locations(req, res);
  },

  delete_market_id_schedules: function(req, res) {
    Market.delete_market_id_schedules(req, res);
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
