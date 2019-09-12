// 'use strict';
// let AWS = require('aws-sdk');
// AWS.config.update({
//     accessKeyId: process.env.ACCESS_ID, 
//     secretAccessKey: process.env.ACCESS_SECRET,
//     region:'us-west-2'
// });
// var connection = require('../../../db');
// var async = require('async');

// module.exports = {

//     // email from contact us form on landing page to info@olf.com
//     send_contact_form_email: function(req, res) {
//         let payload = req.body;
//         console.log('req.body: ', req.body);

//         var lambda = new AWS.Lambda();
//         var params = {
//             FunctionName: 'contactFormEmail', /* required */
//             Payload: JSON.stringify(payload)
//         };
//         lambda.invoke(params, function(err, data) {
//             if (err) console.log(err, err.stack); // an error occurred
//             else     console.log(data);           // successful response
//         });

//     },

//     // notify info@olf.com that a new user has signed up
//     new_user_notification: function (req, res) {
//         let payload = req.body;
//         var lambda = new AWS.Lambda();
//         var params = {
//             FunctionName: 'newUserNotificationEmail', /* required */
//             Payload: JSON.stringify(payload)
//         };
//         lambda.invoke(params, function(err, data) {
//             if (err) console.log(err, err.stack); // an error occurred
//             else     console.log(data);           // successful response
//         });
//     },

//     // notify info@olf.com that a new producer has signed up
//     new_producer_notification: function (req, res) {
//         let payload = req.body;
//         var lambda = new AWS.Lambda();
//         var params = {
//             FunctionName: 'newProducerNotificationEmail', /* required */
//             Payload: JSON.stringify(payload)
//         };
//         lambda.invoke(params, function(err, data) {
//             if (err) console.log(err, err.stack); // an error occurred
//             else     console.log(data);           // successful response
//         });
//     },

//     // notify producer that a new order has been created
//     new_order_notification: function (req, res) {
//         let payload = req.body;
//         var lambda = new AWS.Lambda();
//         var params = {
//             FunctionName: 'newOrderNotificationEmail', /* required */
//             Payload: JSON.stringify(payload)
//         };
//         lambda.invoke(params, function(err, data) {
//             if (err) console.log(err, err.stack); // an error occurred
//             else     console.log(data);           // successful response
//         });
//     },

//     // notify consumer that their order status has changed
//     order_accepted_notification: function (req, res) {
//         let payload = req.body;
//         var lambda = new AWS.Lambda();
//         var params = {
//             FunctionName: 'orderAcceptedNotificationEmail', /* required */
//             Payload: JSON.stringify(payload)
//         };
//         lambda.invoke(params, function(err, data) {
//             if (err) console.log(err, err.stack); // an error occurred
//             else     console.log(data);           // successful response
//         });
//     },

//     order_denied_notification: function (req, res) {
//       let payload = req.body;
//       var lambda = new AWS.Lambda();
//       var params = {
//           FunctionName: 'orderDeniedNotificationEmail', /* required */
//           Payload: JSON.stringify(payload)
//       };
//       lambda.invoke(params, function(err, data) {
//           if (err) console.log(err, err.stack); // an error occurred
//           else     console.log(data);           // successful response
//       });
//     },

//     location_notification: function (req, res) {
//         console.log('payload passed in: ', req);
//         // get the payload
//         let payload = req;
//         // call lambda function
//         var lambda = new AWS.Lambda();
//         var params = {
//             FunctionName: 'locationNotificationEmail', /* required */
//             Payload: JSON.stringify(payload)
//         };
//         lambda.invoke(params, function(err, data) {
//             if (err) console.log(err, err.stack); // an error occurred
//             else     console.log('payload: ', data);           // successful response
//         });
        
//     },

//     multiple_location_notification: function (req, res) {
//       console.log('payload received');
//         let payload,
//             schedIds;
//         // req is an array of locations and the accompanying sched and user info
//         // loop over each location and send separately to lambda
//         req.forEach(function(location, index) {
//             payload = location;
//             // console.log('location.schedules: ', location.schedules);
//             schedIds = location.schedules.map(sched => sched.id); // create an array of sched ids
//             // console.log('schedIds: ', schedIds);
//             // call lambda function
//             var lambda = new AWS.Lambda();
//             var params = {
//                 FunctionName: 'multipleLocationNotificationEmail', /* required */
//                 Payload: JSON.stringify(payload)
//             };
//             lambda.invoke(params, function(err, data) {
//                 if (err) { // an error occurred
//                     console.log(err, err.stack);
//                 } else {
//                     console.log('payload: ', data); // successful response
//                     // for each sched in the location
//                     async.forEach(
//                         schedIds, 
//                         function(schedId, callback) { //The second argument, `callback`, is the "task callback" for a specific `messageId`
//                             // When the db has updated the item it will call the "task callback"
//                             // This way async knows which items in the collection have finished
//                             // update the schedule.location_notif_sent to 1 (true)
//                             console.log('schedId: ', schedId);
//                             connection.query(
//                                 `SET SQL_SAFE_UPDATES=0;
//                                 UPDATE schedules 
//                                 SET location_notif_sent = 1 
//                                 WHERE schedule_id = ?;
//                                 SET SQL_SAFE_UPDATES=1;`,
//                                 schedId,
//                                 callback
//                             )
//                         },
//                         function(err) { // 'final' callback - either exits everything when an error occurs, or exits w/o erro after all tasks are complete
//                             if (err) return err;
//                             // Tell the user about the great success
//                             console.log('all scheds changed for location: ', location.location);
//                         }
//                     );
                    
//                 }    
//             });
//         })
//     }

// };

'use strict';
let AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: process.env.ACCESS_ID, 
    secretAccessKey: process.env.ACCESS_SECRET,
    region:'us-west-2'
});
var connection = require('../../../db');
var async = require('async');

module.exports = {

    // email from contact us form on landing page to info@olf.com
    send_contact_form_email: function(req, res) {
        let payload = req.body;
        console.log('req.body: ', req.body);

        var lambda = new AWS.Lambda();
        var params = {
            FunctionName: 'contactFormEmail', /* required */
            Payload: JSON.stringify(payload)
        };
        lambda.invoke(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
        });

    },

    // notify info@olf.com that a new user has signed up
    new_user_notification: function (req, res) {
        let payload = req.body;
        var lambda = new AWS.Lambda();
        var params = {
            FunctionName: 'newUserNotificationEmail', /* required */
            Payload: JSON.stringify(payload)
        };
        lambda.invoke(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
        });
    },

    // notify info@olf.com that a new producer has signed up
    new_producer_notification: function (req, res) {
        let payload = req.body;
        var lambda = new AWS.Lambda();
        var params = {
            FunctionName: 'newProducerNotificationEmail', /* required */
            Payload: JSON.stringify(payload)
        };
        lambda.invoke(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
        });
    },

    // notify producer that a new order has been created
    new_order_notification: function (req, res) {
        let payload = req.body;
        var lambda = new AWS.Lambda();
        var params = {
            FunctionName: 'newOrderNotificationEmail', /* required */
            Payload: JSON.stringify(payload)
        };
        lambda.invoke(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
        });
    },

    // notify consumer that their order status has changed
    order_accepted_notification: function (req, res) {
        let payload = req.body;
        var lambda = new AWS.Lambda();
        var params = {
            FunctionName: 'orderAcceptedNotificationEmail', /* required */
            Payload: JSON.stringify(payload)
        };
        lambda.invoke(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
        });
    },

    order_denied_notification: function (req, res) {
      let payload = req.body;
      var lambda = new AWS.Lambda();
      var params = {
          FunctionName: 'orderDeniedNotificationEmail', /* required */
          Payload: JSON.stringify(payload)
      };
      lambda.invoke(params, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else     console.log(data);           // successful response
      });
    },

    location_notification: function (req, res) {
        console.log('payload passed in: ', req);
        // get the payload
        let payload = req;
        // call lambda function
        var lambda = new AWS.Lambda();
        var params = {
            FunctionName: 'locationNotificationEmail', /* required */
            Payload: JSON.stringify(payload)
        };
        lambda.invoke(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log('payload: ', data);           // successful response
        });
        
    },

    multiple_location_notification: function (req, res) {

      let locations = req;
      let schedIds = [];
      let tempSchedIds;

      async.waterfall([
        invokeLambda,
        setLocNotifSent,
      ], function(err, result) {
        console.log('sched Ids completed: ', result);
      });
      
      function invokeLambda(callback) {
        async.forEach(
          locations,
          function(location, callback) { //The second argument, `callback`, is the "task callback" for a specific `messageId`
              // When the lambda fn has returned the payload it will call the "task callback"
              // This way async knows which items in the collection have finished
              // first create an array of sched Ids
              console.log('location for first async: ', location.location);
              tempSchedIds = location.schedules.map(sched => sched.id);
              schedIds = schedIds.concat(tempSchedIds);
              console.log('tempscheds: ', tempSchedIds);
              console.log('concat schedIds: ', schedIds);
              // set lambda params
              var lambda = new AWS.Lambda();
              var params = {
                  FunctionName: 'multipleLocationNotificationEmail', /* required */
                  Payload: JSON.stringify(location)
              };
              // send to lambda
              lambda.invoke(params, function(err, data) {
                  if (err) { // an error occurred
                      console.log(err, err.stack);
                  } else {
                      console.log('payload: ', data); // successful response
                      callback;
                  }    
              });
          },
          function(err) { // 'final' callback - either exits everything when an error occurs, or exits w/o erro after all tasks are complete
            if (err) return err;
          }
      );
        // do stuff
        callback(null, schedIds);
      };

      function setLocNotifSent(schedIdList, callback) {
        async.forEach(
          schedIds, 
          function(schedId, callback) { //The second argument, `callback`, is the "task callback" for a specific `messageId`
              // When the db has updated the item it will call the "task callback"
              // This way async knows which items in the collection have finished
              // update the schedule.location_notif_sent to 1 (true)
              console.log('schedId: ', schedId);
              connection.query(
                  `SET SQL_SAFE_UPDATES=0;
                  UPDATE schedules 
                  SET location_notif_sent = 1 
                  WHERE schedule_id = ?;
                  SET SQL_SAFE_UPDATES=1;`,
                  schedId,
                  callback
              )
          },
          function(err) { // 'final' callback - either exits everything when an error occurs, or exits w/o erro after all tasks are complete
              if (err) return err;
              // Tell the user about the great success
              console.log('all scheds changed');
          }
        );
        // do stuff
        callback(null, schedIds);
      };

        // create the new array from the req
        // call async on each item in the array
        // let locations = req;
        // let schedIds = [];
        // let tempSchedIds;

        // async.forEach(
        //     locations,
        //     function(location, callback) { //The second argument, `callback`, is the "task callback" for a specific `messageId`
        //         // When the lambda fn has returned the payload it will call the "task callback"
        //         // This way async knows which items in the collection have finished
        //         // first create an array of sched Ids
        //         console.log('location for first async: ', location.location);
        //         tempSchedIds = location.schedules.map(sched => sched.id);
        //         schedIds = schedIds.concat(tempSchedIds);
        //         console.log('tempscheds: ', tempSchedIds);
        //         console.log('concat schedIds: ', schedIds);
        //         // set lambda params
        //         var lambda = new AWS.Lambda();
        //         var params = {
        //             FunctionName: 'multipleLocationNotificationEmail', /* required */
        //             Payload: JSON.stringify(location)
        //         };
        //         // send to lambda
        //         lambda.invoke(params, function(err, data) {
        //             if (err) { // an error occurred
        //                 console.log(err, err.stack);
        //             } else {
        //                 console.log('payload: ', data); // successful response
        //                 callback;
        //             }    
        //         });
        //     },
        //     function(err) { // 'final' callback - either exits everything when an error occurs, or exits w/o erro after all tasks are complete
        //       if (err) return err;
        //     }
        // );

        // async.forEach(
        //   schedIds, 
        //   function(schedId, callback) { //The second argument, `callback`, is the "task callback" for a specific `messageId`
        //       // When the db has updated the item it will call the "task callback"
        //       // This way async knows which items in the collection have finished
        //       // update the schedule.location_notif_sent to 1 (true)
        //       console.log('schedId: ', schedId);
        //       connection.query(
        //           `SET SQL_SAFE_UPDATES=0;
        //           UPDATE schedules 
        //           SET location_notif_sent = 1 
        //           WHERE schedule_id = ?;
        //           SET SQL_SAFE_UPDATES=1;`,
        //           schedId,
        //           callback
        //       )
        //   },
        //   function(err) { // 'final' callback - either exits everything when an error occurs, or exits w/o erro after all tasks are complete
        //       if (err) return err;
        //       // Tell the user about the great success
        //       console.log('all scheds changed');
        //   }
        // );


    //   console.log('payload received');
    //     let payload,
    //         schedIds;
    //     // req is an array of locations and the accompanying sched and user info
    //     // loop over each location and send separately to lambda
    //     req.forEach(function(location, index) {
    //         payload = location;
    //         // console.log('location.schedules: ', location.schedules);
    //         schedIds = location.schedules.map(sched => sched.id); // create an array of sched ids
    //         // console.log('schedIds: ', schedIds);
    //         // call lambda function
    //         var lambda = new AWS.Lambda();
    //         var params = {
    //             FunctionName: 'multipleLocationNotificationEmail', /* required */
    //             Payload: JSON.stringify(payload)
    //         };
    //         lambda.invoke(params, function(err, data) {
    //             if (err) { // an error occurred
    //                 console.log(err, err.stack);
    //             } else {
    //                 console.log('payload: ', data); // successful response
    //                 // for each sched in the location
    //                 async.forEach(
    //                     schedIds, 
    //                     function(schedId, callback) { //The second argument, `callback`, is the "task callback" for a specific `messageId`
    //                         // When the db has updated the item it will call the "task callback"
    //                         // This way async knows which items in the collection have finished
    //                         // update the schedule.location_notif_sent to 1 (true)
    //                         console.log('schedId: ', schedId);
    //                         connection.query(
    //                             `SET SQL_SAFE_UPDATES=0;
    //                             UPDATE schedules 
    //                             SET location_notif_sent = 1 
    //                             WHERE schedule_id = ?;
    //                             SET SQL_SAFE_UPDATES=1;`,
    //                             schedId,
    //                             callback
    //                         )
    //                     },
    //                     function(err) { // 'final' callback - either exits everything when an error occurs, or exits w/o erro after all tasks are complete
    //                         if (err) return err;
    //                         // Tell the user about the great success
    //                         console.log('all scheds changed for location: ', location.location);
    //                     }
    //                 );
                    
    //             }    
    //         });
    //     })
    }

};
