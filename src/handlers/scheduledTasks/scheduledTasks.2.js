'use strict';
var connection = require('../../../db');
var _ = require('lodash');
let lambda = require('../lambda/functions');
var async = require('async');
var moment = require('moment');

module.exports = {
  
  test_function: function(res) {

    console.log('initiating multi sched.');

    let uniqueLocationArray;
    let timeZoneOffset,
        startTime,
        endTime,
        orderDeadlineTime;

    // from https://medium.com/velotio-perspectives/understanding-node-js-async-flows-parallel-serial-waterfall-and-queues-6f9c4badbc17
    
    async.waterfall([
      getScheds,
      getLocationNotifications,
      getUsers,
    ], function(err, result) {
      lambda.multiple_location_notification(result);
      // console.log('results: ', result[0].id);
    });
    
    // function myFirstFunction(callback) {
    //   console.log('start');
    //   callback(null, 'Task 1', 'Task 2');
    // }
    // function mySecondFunction(arg1, arg2, callback) {
    //   // arg1 now equals 'Task 1' and arg2 now equals 'Task 2'
    //   console.log('args: ', arg1, arg2);
    //   let arg3 = arg1 + ' and ' + arg2;
    //   callback(null, arg3);
    // }
    // function myLastFunction(arg1, callback) {
    //   // arg1 now equals 'Task1 and Task2'
    //   console.log('last arg: ', arg1)
    //   arg1 += ' completed';
    //   callback(null, arg1);
    // }

    // function mySecondFunction(uniqueArray, callback) {
    //   // arg1 now equals 'Task 1' and arg2 now equals 'Task 2'
    //   console.log('args: ', uniqueArray);
    //   // let arg3 = arg1 + ' and ' + arg2;
    //   callback(null, uniqueArray);
    // }
    // function myLastFunction(arg1, callback) {
    //   // arg1 now equals 'Task1 and Task2'
    //   console.log('last arg: ', arg1)
    //   arg1 += ' completed';
    //   callback(null, arg1);
    // }

    // *************** 1 *****************
    // set up to get scheds

    function getScheds(callback) {
      connection.query(

        `SELECT schedules.*, producers.name FROM schedules JOIN producers ON schedules.producer_id_fk_s = producers.producer_id WHERE location_notif_sent = 0 AND order_deadline < (NOW() + INTERVAL 1 WEEK) AND order_deadline > NOW();`,
        function (error, results) {
          console.log('current time (plus 6 hrs): ', new Date().toISOString());

          console.log('here');
          // if (error) {
          //   res.status(500).send(error);
          // } else {
            let scheds = results.map(function(row) 
              {
                return {
                  id: row.schedule_id,
                  producerId: row.producer_id_fk_s,
                  producerName: row.name,
                  type: row.schedule_type,
                  description: row.description,
                  startDateTime: row.start_date_time,
                  endDateTime: row.end_date_time,
                  hasFee: row.has_fee,
                  hasWaiver: row.has_waiver,
                  latitude: row.latitude,
                  longitude: row.longitude,
                  city: row.city,
                  province: row.province,
                  orderDeadline: row.order_deadline,
                  address: row.address,
                  fee: row.fee,
                  feeWaiver: row.fee_waiver,
                  locationNotificationSent: row.location_notif_sent,
                  startTime: null,
                  endTime: null,
                  orderDeadlineTime: null
                }
              }
            );
            // loop over scheds and group by city
            // get count of array
            let schedsCount = scheds.length;
            console.log(' scheds count: ', schedsCount);
            // create an array of locations with their accompanying sched
            let locationArray = scheds.map(sched => (
              { 
                location: sched.city + ', ' + sched.province,
                latitude: sched.latitude,
                longitude: sched.longitude,
                minlat: null,
                maxlat: null,
                minlng: null,
                maxlng: null,
                schedules: [],
                userIds: [],
                userList: []
              }
            ));
            // remove duplicate locations
            uniqueLocationArray = _.uniqBy(locationArray, 'location');

            // here is where i should add the various scheds to the uniqueLocationsArray
            // loop over scheds, 
            scheds.forEach(sched => {
              // create local start, end, and order deadline times, push to sched
              sched.startTime = moment(sched.startDateTime).format("h:mmA");
              sched.endTime = moment(sched.endDateTime).format("h:mmA");
              sched.orderDeadlineTime = moment(sched.orderDeadline).format("h:mmA");
              console.log('sched: ', sched.id);
              // console.log('array lenght: ', uniqueLocationArray.length);
              for (let i = 0; i < uniqueLocationArray.length; i++) {
                if (sched.city == (uniqueLocationArray[i].location).split(',', 1)) {
                  uniqueLocationArray[i].schedules.push(sched);
                  break;
                }
              }
            });

            console.log('uniques: ', uniqueLocationArray);
            callback(null, uniqueLocationArray);
        },
        function(err, uniqueLocationArray){
          if(err){
              console.error(err);
          } else {
              console.log('all files are read.');
              callback(null, uniqueLocationArray);
          }
        }
        
      );
      
    };

    // *************** 2 *****************
    // set up to get location notifications

    function getLocationNotifications(uniqueLocationArray, callback) {

      console.log('get Location Notifs called');

      let distance = 25;
      let earthRadius = 6371;
      // Converts from degrees to radians.
      Math.radians = function (degrees) {
        return degrees * Math.PI / 180;
      };
      // Converts from radians to degrees.
      Math.degrees = function (radians) {
        return radians * 180 / Math.PI;
      };

      async.eachOfSeries(uniqueLocationArray, function(location, index, innerCallback) {
        // console.log('series index: ', index);
        console.log('location working: ', location.location);
        // calculate the min/max
        // latitude boundaries
        location.maxlat = location.latitude + Math.degrees(distance / earthRadius);
        location.minlat = location.latitude - Math.degrees(distance / earthRadius);
        // longitude boundaries (longitude gets smaller when latitude increases)
        location.maxlng = location.longitude + Math.degrees(distance / earthRadius / Math.cos(Math.radians(location.latitude)));
        location.minlng = location.longitude - Math.degrees(distance / earthRadius / Math.cos(Math.radians(location.latitude)));
        // console.log('location details: ', location);

        // get the locNotifs
        connection.query({
          sql: 'SELECT * FROM location_notifications WHERE latitude BETWEEN (?) AND (?) AND longitude BETWEEN (?) AND (?);',
          values: [location.minlat, location.maxlat, location.minlng, location.maxlng],
          nestTables: true
        }, function (err, rows) {
          if (err) {
            console.log('error: ', err);
            innerCallback(err, null);
          } else {
            // rows returned - do stuff
            // add to the array
            let locationNotificationsReceived = rows.map(function (row) {
              return {
                id: row.location_notifications.id,
                userId: row.location_notifications.user_id
              }
            });
            // console.log('notifs received: ', locationNotificationsReceived);
            let userIdArray = locationNotificationsReceived.map((notification) => {
              // console.log('notification: ', notification);
              // userIds.push(notification.userId);
              return notification.userId
            });
            // pull out duplicates
            let userIds = userIdArray.filter(function (value, index, array) {
              return array.indexOf(value) == index;
            });
            // console.log('userIds: ', userIds);
            uniqueLocationArray[index].userIds = userIds;
            // console.log('uniquesArray after location notifs and user ids: ', uniqueLocationArray);
            innerCallback(null, null);
          }
          
        })
        
      }, function(err, results){
        if(err){
            console.error(err);
        } else {
            console.log('all files are read.');
            callback(null, uniqueLocationArray);
        }
      });
      
    };

    // *************** 3 *****************
    // set up to get users
    function getUsers(uniqueLocationArray, callback) {

      // console.log('getusers called', uniqueLocationArray);

      async.eachOfSeries(uniqueLocationArray, function(location, index, innerCallback) {

        let usersValues = location.userIds.length;
        console.log('usersValues: ', location.userIds.slice(0));

        connection.query({
            sql: 'SELECT * FROM users WHERE id IN (' + new Array(usersValues + 1).join('?,').slice(0, -1) + ')',
            values: location.userIds.slice(0),
            nestedTables: true
          },
          function (error, rows) {
            if (error) {
              console.log('error: ', error);
            } else {
              let usersReceived = rows.map(function (row) {
                console.log('user recd: ', row.id);
                return {
                  userId: row.id,
                  firstName: row.first_name,
                  email: row.email
                }
              });
              uniqueLocationArray[index].userList = usersReceived;
              console.log('uniques after users received: ', uniqueLocationArray[index].schedules);
              // sort the scheds by start date
              uniqueLocationArray[index].schedules.sort(function(a,b){
                var c = new Date(a.startDateTime);
                var d = new Date(b.startDateTime);
                return c-d;
              });
              console.log('uniques after sort: ', uniqueLocationArray[index].schedules);
              innerCallback(null, null);
            }
          }
        )
      }, function(err, results){
        if(err){
          console.error(err);
        } else {
          // console.log('all files are read.');
          callback(null, uniqueLocationArray);
        }
      })
    }

  }

};
