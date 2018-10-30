'use strict';
let AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: process.env.ACCESS_ID, 
    secretAccessKey: process.env.ACCESS_SECRET,
    region:'us-west-2'
});

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

    location_notification: function (req, res) {
        console.log('req: ', req);
        let payload = req;
        // use great circle calculation
        // get the search parameters
        let distance = 25;
        let latitude = req.schedule.latitude;
        let longitude = req.schedule.longitude;
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

        // get all location notifications within that circle
        // build a query inside a promise, this will return the rows from the query
        function promisedQuery(sql) { 
            console.log('query: ', sql);
            return new Promise ((resolve, reject) => {
                connection.query(sql, function(err, rows) {
                    if ( err ) {
                    console.log('error: ', err);
                    return reject( err );
                    }
                    console.log('success');
                    resolve( rows );
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
                // if no scheds are found
                if (rows.length === 0) {
                    let zeroResults = {};
                    return res.status(200).send(zeroResults);
                } else {
                // do stuff with the returned rows
                locationNotificationsReceived = rows.map(function(row) {
                    return {
                        id: row.id,
                        userId: row.user_id
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
                userIds = userIdArray.filter (function (value, index, array) { 
                    return array.indexOf (value) == index;
                }); 
                console.log('filtered userids: ', userIds);
                // producerValues = producerIds.length();
                let usersValues = Object.keys(userIds).length;
                console.log('userIds lenght: ', usersValues);
                // call the query again to get producers
                getUserQueryOptions.sql = 'SELECT * FROM users WHERE id IN (' + new Array(producerValues + 1).join('?,').slice(0, -1) + ')';
                getUserQueryOptions.values = userIds.slice(0);
                // ************ USERS ***********
                return promisedQuery(getUserQueryOptions);
                }
            })
            .then((rows) => {
                // build the array of user info
                usersReceived = rows.maps(function(row) {
                    return {
                        userId: row.id,
                        firstName: row.first_name,
                        email: row.email
                    }
                });
                // incorporate into lambda function object
                payload.userList = usersReceived;
                console.log('loc notif payload: ', payload);
                // call lambda function
                var lambda = new AWS.Lambda();
                var params = {
                    FunctionName: 'locationNotificationEmail', /* required */
                    Payload: JSON.stringify(payload)
                };
                lambda.invoke(params, function(err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    else     console.log(data);           // successful response
                });
            })
            .catch(err => {
                return res.status(500).send(err);
            });
    }

};