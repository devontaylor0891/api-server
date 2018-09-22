'use strict';
let request = require('request');

module.exports = {

    post_captcha: function(req, res) {
        let response = req.body.response;
        if(response === undefined || response === '' || response === null) {
            return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
          }
          // Put your secret key here.
          var secretKey = process.env.CAPTCHA_KEY;
          // req.connection.remoteAddress will provide IP address of connected user.
          var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + response;
          // Hitting GET request to the URL, Google will respond with success or error scenario.
          request(verificationUrl,function(error,response,body) {
            body = JSON.parse(body);
            // Success will be true or false depending upon captcha validation.
            if(body.success !== undefined && !body.success) {
              return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
            }
            console.log('captcha response: ', response);
            res.json({"responseCode" : 0,"responseDesc" : "Success"});
          });
    }

};