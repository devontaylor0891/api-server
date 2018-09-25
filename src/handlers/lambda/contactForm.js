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

    },

    // notify consumer that their order status has changed
    order_status_changer_notification: function (req, res) {

    }

};