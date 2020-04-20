'use strict';
let request = require('request');
let contact = require('./lambda/functions');

module.exports = {

  post_captcha: function(req, res) {
    console.log('recaptcha responsee: ', req.body.captchaResponse);
    let response = req.body.captchaResponse;
    if(response === undefined || response === '' || response === null) {
        return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
      };
    // Put your secret key here.
    var secretKey = process.env.CAPTCHA_KEY;
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + response;
    // Hitting GET request to the URL, Google will respond with success or error scenario.
    request(verificationUrl,function(error,response,body) {
      body = JSON.parse(body);
      // Success will be true or false depending upon captcha validation.
      if(body.success !== undefined && !body.success) {
        return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
      }
      res.json({"responseCode" : 0,"responseDesc" : "Success"});
      // send the email
      contact.send_contact_form_email(req, res);
    });
  }

};