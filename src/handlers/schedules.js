// 'use strict';
// var _ = require('lodash');
// var connection = require('../../db');
// var ScheduleById = require('./schedules/{id}');
// let lambda = require('./lambda/functions');

// module.exports = {

//   get_schedules: function(req, res) {
//     connection.query(
//       `SELECT * FROM schedules`, function (error, schedulesResult) {
//         let schedules = schedulesResult.map(function(row) {
//           return {
//             id: row.schedule_id,
//             producerId: row.producer_id_fk_s,
//             type: row.schedule_type,
//             description: row.description,
//             startDateTime: row.start_date_time,
//             endDateTime: row.end_date_time,
//             hasFee: row.has_fee,
//             hasWiaver: row.has_waiver,
//             latitude: row.latitude,
//             longitude: row.longitude,
//             city: row.city,
//             province: row.province,
//             orderDeadline: row.order_deadline,
//             address: row.address,
//             fee: row.fee,
//             feeWaiver: row.fee_waiver
//           }
//         });
//         return res.status(200).send(schedules);
//       }
//     )
//   },

//   post_schedules: function (req, res) {
//     // return res.send(201);
//     console.log('new schedule body: ', req.body);
//     let lambdaScheduleInfo = {
//       schedule: {
//         producerId: req.body.producerId,
//         producerName: req.body.producerName,
//         scheduleId: null,
//         startDateTime: req.body.startDateTime,
//         endDateTime: req.body.endDateTime,
//         type: req.body.type,
//         description: req.body.description,
//         city: req.body.city,
//         province: req.body.province,
//         latitude: req.body.latitude,
//         longitude: req.body.longitude
//       },
//       userList: []
//     };
//     // return res.send(201);
//     let postQuery = {
//       producer_id_fk_s: `${req.body.producerId}`,
//       schedule_type: `${req.body.type}`,
//       description: `${req.body.description}`,
//       start_date_time: `${req.body.startDateTime}`,
//       end_date_time: `${req.body.endDateTime}`,
//       has_fee: `${req.body.hasFee}`,
//       has_waiver: `${req.body.hasWiaver}`,
//       latitude: `${req.body.latitude}`,
//       longitude: `${req.body.longitude}`,
//       city: `${req.body.city}`,
//       province: `${req.body.province}`,
//       order_deadline: `${req.body.orderDeadline}`,
//       address: `${req.body.address}`,
//       fee: `${req.body.fee}`,
//       fee_waiver: `${req.body.feeWaiver}`,
//       user_id_fk_schedules: `${req.body.userId}`
//     };
//     console.log('postQuery: ', postQuery);
//     connection.query(
//       `INSERT INTO schedules SET ?`,
//       postQuery,
//       function(err, result) {
//         if (err) {
//           console.log('error in create sched:', err);
//           res.send('error:', err);
//         } else {
//           console.log('sched created: ', result);
//           lambda.location_notification(lambdaScheduleInfo);
//           return res.status(200).send(result);
//         }
//       }
//     )
//   },

//   get_schedules_id: function(req, res) {
//     ScheduleById.get_schedules_id(req, res);
//   },

//   delete_schedules_id: function(req, res) {
//     ScheduleById.delete_schedules_id(req, res);
//   },

//   put_schedules_id: function(req, res) {
//     ScheduleById.put_schedules_id(req, res);
//   }

// };

'use strict';
var _ = require('lodash');
var connection = require('../../db');
var ScheduleById = require('./schedules/{id}');
let lambda = require('./lambda/functions');

module.exports = {

  get_schedules: function (req, res) {
    connection.query(
      `SELECT * FROM schedules`, function (error, schedulesResult) {
        let schedules = schedulesResult.map(function (row) {
          return {
            id: row.schedule_id,
            producerId: row.producer_id_fk_s,
            type: row.schedule_type,
            description: row.description,
            startDateTime: row.start_date_time,
            endDateTime: row.end_date_time,
            hasFee: row.has_fee,
            hasWiaver: row.has_waiver,
            latitude: row.latitude,
            longitude: row.longitude,
            city: row.city,
            province: row.province,
            orderDeadline: row.order_deadline,
            address: row.address,
            fee: row.fee,
            feeWaiver: row.fee_waiver
          }
        });
        return res.status(200).send(schedules);
      }
    )
  },

  post_schedules: function (req, res) {
    // return res.send(201);
    console.log('new schedule body: ', req.body);
    let lambdaScheduleInfo = {
      schedule: {
        producerId: req.body.producerId,
        producerName: req.body.producerName,
        scheduleId: null,
        startDateTime: req.body.startDateTime,
        endDateTime: req.body.endDateTime,
        type: req.body.type,
        description: req.body.description,
        city: req.body.city,
        province: req.body.province,
        latitude: req.body.latitude,
        longitude: req.body.longitude
      },
      userList: []
    };
    // return res.send(201);
    let postQuery = {
      producer_id_fk_s: `${req.body.producerId}`,
      schedule_type: `${req.body.type}`,
      description: `${req.body.description}`,
      start_date_time: `${req.body.startDateTime}`,
      end_date_time: `${req.body.endDateTime}`,
      has_fee: `${req.body.hasFee}`,
      has_waiver: `${req.body.hasWiaver}`,
      latitude: `${req.body.latitude}`,
      longitude: `${req.body.longitude}`,
      city: `${req.body.city}`,
      province: `${req.body.province}`,
      order_deadline: `${req.body.orderDeadline}`,
      address: `${req.body.address}`,
      fee: `${req.body.fee}`,
      fee_waiver: `${req.body.feeWaiver}`,
      user_id_fk_schedules: `${req.body.userId}`
    };
    console.log('postQuery: ', postQuery);
    connection.query(
      `INSERT INTO schedules SET ?`,
      postQuery,
      function (err, result) {
        if (err) {
          console.log('error in create sched:', err);
          res.send('error:', err);
        } else {
          console.log('sched created: ', result);

          // use great circle calculation
          // get the search parameters
          let distance = 25;
          let latitude = lambdaScheduleInfo.schedule.latitude;
          let longitude = lambdaScheduleInfo.schedule.longitude;
          let maxlat, maxlng, minlat, minlng;
          // Converts from degrees to radians.
          Math.radians = function (degrees) {
            return degrees * Math.PI / 180;
          };
          // Converts from radians to degrees.
          Math.degrees = function (radians) {
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

          // get all location notifications within that circle
          // build a query inside a promise, this will return the rows from the query
          function promisedQuery(sql) {
            console.log('query: ', sql);
            return new Promise((resolve, reject) => {
              connection.query(sql, function (err, rows) {
                if (err) {
                  console.log('error: ', err);
                  return reject(err);
                }
                console.log('success');
                resolve(rows);
              })
            });
          };

          // build the required queries
          let getLocationNotifsSql = 'SELECT * FROM location_notifications WHERE latitude BETWEEN (?) AND (?) AND longitude BETWEEN (?) AND (?);';
          let getLocationNotifsQueryOptions = {
            sql: getLocationNotifsSql,
            values: [minlat, maxlat, minlng, maxlng],
            nestTables: true
          };

          let getUsersSql;
          let getUsersQueryOptions = {
            sql: null,
            values: null,
            nestTables: true
          };

          // set up variables
          let locationNotificationsReceived, usersReceived;
          let userIds = [];

          promisedQuery(getLocationNotifsQueryOptions)
            .then(rows => {
              console.log('rows returned: ', rows);
              // if no scheds are found
              if (rows.length === 0) {
                let zeroResults = {};
                return res.status(200).send(zeroResults);
              } else {
                // do stuff with the returned rows
                locationNotificationsReceived = rows.map(function (row) {
                  return {
                    location_notifications.id: row.id,
                    location_notifications.userId: row.user_id
                  }
                });
                // assign to searchResults
                searchResultsObject.schedules = schedulesReceived;
                // create an array of producer Ids from the scheds;
                let userIdArray = locationNotificationsReceived.map((notification) => {
                  userIds.push(notification.userId);
                  return notification.userId
                });
                // pull out duplicates
                userIds = userIdArray.filter(function (value, index, array) {
                  return array.indexOf(value) == index;
                });
                console.log('filtered userids: ', userIds);
                let usersValues = Object.keys(userIds).length;
                console.log('userIds lenght: ', usersValues);
                // call the query again to get users info
                getUserQueryOptions.sql = 'SELECT * FROM users WHERE id IN (' + new Array(usersValues + 1).join('?,').slice(0, -1) + ')';
                getUserQueryOptions.values = userIds.slice(0);
                // ************ USERS ***********
                return promisedQuery(getUserQueryOptions);
              }
            })
            .then((rows) => {
              // build the array of user info
              usersReceived = rows.maps(function (row) {
                return {
                  userId: row.id,
                  firstName: row.first_name,
                  email: row.email
                }
              });
              // incorporate into lambda function object
              lambdaScheduleInfo.userList = usersReceived;
              console.log('loc notif payload: ', lambdaScheduleInfo);
              // call lambda function
              lambda.location_notification(lambdaScheduleInfo);
              return res.status(200).send(result);
            })
            .catch(err => {
              return res.status(500).send(err);
            });
        }
      }
    )
  },

  get_schedules_id: function (req, res) {
    ScheduleById.get_schedules_id(req, res);
  },

  delete_schedules_id: function (req, res) {
    ScheduleById.delete_schedules_id(req, res);
  },

  put_schedules_id: function (req, res) {
    ScheduleById.put_schedules_id(req, res);
  }

};