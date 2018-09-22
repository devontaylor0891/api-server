'use strict';
let AWS = require('aws-sdk');

module.exports = {

    send_email: function(req, res) {
        let payload = req.body;

        // you shouldn't hardcode your keys in production! See http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html
        AWS.config.update({
            accessKeyId: process.env.ACCESS_ID, 
            secretAccessKey: process.env.ACCESS_SECRET
        });

        var lambda = new AWS.Lambda();
        var params = {
            FunctionName: 'contactFormEmail', /* required */
            Payload: JSON.stringify(payload)
        };
        lambda.invoke(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
        });

    }

};