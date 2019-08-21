var aws = require('aws-sdk');
var ses = new aws.SES({
  region: 'us-west-2'
});

// need to remove the single quotes around dates I want to use - str.slice(1, -1);

exports.handler = function (event, context) {

  console.log('number of locations: ', event.length);
  
  let html,
      htmlStart,
      htmlMiddle,
      htmlMiddleTemp,
      htmlEnd,
      htmlSched,
      userListLength,
      numberOfEmailArrays,
      arrayOfEmailArrays,
      type,
      formattedStartDate,
      formattedOrderDeadlineDate,
      timeZoneOffset,
      primeLocation,
      location,
      producer,
      scheds,
      description,
      startMonth,
      orderDeadlineMonth,
      dateOfSchedule,
      dateOfDeadline,
      targetEmailArray;
      
  let formattedSched = {
    date: '',
    producerName: '',
    startTime: '',
    endTime: '',
    orderDeadline: '',
    description: '',
    location: '',
    type: ''
  };
  
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  function reset() {
    html = null;
    htmlStart = null;
    htmlMiddle = null;
    htmlMiddleTemp = null;
    htmlEnd = null;
    htmlSched = null;
    userListLength = null;
    numberOfEmailArrays = null;
    arrayOfEmailArrays = null;
    type = null;
    formattedStartDate = null;
    formattedOrderDeadlineDate = null;
    timeZoneOffset = null;
    primeLocation = null;
    location = null;
    producer = null;
    scheds = null;
    description = null;
    startMonth = null;
    orderDeadlineMonth = null;
    dateOfSchedule = null;
    dateOfDeadline = null;
    targetEmailArray = null;
    formattedSched = {
      date: '',
      producerName: '',
      startTime: '',
      endTime: '',
      orderDeadline: '',
      description: '',
      location: '',
      type: ''
    };
  }
  
  // loop over the locations
  event.forEach(function(location, index) {
    console.log('location index: ', index)
    // set location info
    primeLocation = location.location;
    // user info for this location
    userListLength = location.userList.length;
    console.log('number of users: ', userListLength);
    if (userListLength > 25) {
      numberOfEmailArrays = Math.ceil(event.userList.length/25);
      // in a loop, splice out the first 25 emails and place them in arrays
      let arrayOfEmailArrays = [];
      for (let i = 0; i < numberOfEmailArrays; i++) {
        arrayOfEmailArrays[i] = event.userList.splice(0, 25);
      };
    };
    
    htmlStart = `
      <!doctype html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width">
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <title>Local food near ${ primeLocation }</title>
          <style>
          /* -------------------------------------
              INLINED WITH htmlemail.io/inline
          ------------------------------------- */
          /* -------------------------------------
              RESPONSIVE AND MOBILE FRIENDLY STYLES
          ------------------------------------- */
          @media only screen and (max-width: 620px) {
            table[class=body] h1 {
              font-size: 28px !important;
              margin-bottom: 10px !important;
            }
            table[class=body] p,
                  table[class=body] ul,
                  table[class=body] ol,
                  table[class=body] td,
                  table[class=body] span,
                  table[class=body] a {
              font-size: 16px !important;
            }
            table[class=body] .wrapper,
                  table[class=body] .article {
              padding: 10px !important;
            }
            table[class=body] .content {
              padding: 0 !important;
            }
            table[class=body] .container {
              padding: 0 !important;
              width: 100% !important;
            }
            table[class=body] .main {
              border-left-width: 0 !important;
              border-radius: 0 !important;
              border-right-width: 0 !important;
            }
            table[class=body] .btn table {
              width: 100% !important;
            }
            table[class=body] .btn a {
              width: 100% !important;
            }
            table[class=body] .img-responsive {
              height: auto !important;
              max-width: 100% !important;
              width: auto !important;
            }
          }
          /* -------------------------------------
              PRESERVE THESE STYLES IN THE HEAD
          ------------------------------------- */
          @media all {
            .ExternalClass {
              width: 100%;
            }
            .ExternalClass,
                  .ExternalClass p,
                  .ExternalClass span,
                  .ExternalClass font,
                  .ExternalClass td,
                  .ExternalClass div {
              line-height: 100%;
            }
            .apple-link a {
              color: inherit !important;
              font-family: inherit !important;
              font-size: inherit !important;
              font-weight: inherit !important;
              line-height: inherit !important;
              text-decoration: none !important;
            }
            #MessageViewBody a {
              color: inherit;
              text-decoration: none;
              font-size: inherit;
              font-family: inherit;
              font-weight: inherit;
              line-height: inherit;
            }
            .btn-primary table td:hover {
              background-color: #34495e !important;
            }
            .btn-primary a:hover {
              background-color: #34495e !important;
              border-color: #34495e !important;
            }
          }
          </style>
        </head>
        <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
          <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
            <tr>
              <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
              <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
                <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">
      
                  <!-- START CENTERED WHITE CONTAINER -->
                  <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">This is preheader text. Some clients will show this text as a preview.</span>
                  <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">
      
                    <!-- START MAIN CONTENT AREA -->
                    <tr>
                      <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                        <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                          <tr>
                            <td style="padding: 20px 0; text-align: center">
                              <img src="https://s3-us-west-2.amazonaws.com/onlylocalfood-images/global/logo.png" width="50%" height="auto" alt="Onlylocalfood.com" border="0" style="height: auto; background: #ffffff; font-family: sans-serif; font-size: 15px; line-height: 15px; color: #555555;">
                            </td>
                          </tr>
      
                          <tr>
                            <td>
                              <h3>Here's what's happening in (or near) ${location.location}:</h3>
                            </td>
                          </tr>
                        </table>
                          
                        <!-- NOTIFICATIONS BELOW HERE -->
    `;
    
    htmlEnd = `
      <!-- NOTIFICATIONS ABOVE HERE -->
                  
                      </td>
                    </tr>
      
                  <!-- END MAIN CONTENT AREA -->
                  </table>
      
                  <!-- START FOOTER -->
                  <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
                    <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                      <tr>
                        <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
                          <span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">Onlylocalfood Inc., Moosomin SK</span>
                          <br>Don't like these emails? You can update your location notifications <a href="https://www.onlylocalfood.com/dashboard">here</a>.
                        </td>
                      </tr>
      
                    </table>
                  </div>
                  <!-- END FOOTER -->
      
                <!-- END CENTERED WHITE CONTAINER -->
                </div>
              </td>
              <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
            </tr>
          </table>
        </body>
      </html>`
    ;
    
    scheds = location.schedules;
    // loop through the scheds
    scheds.forEach(function(sched, index) {
      
      //   date: '',
      // producerName: '',
      // startTime: '',
      // endTime: '',
      // orderDeadline: '',
      // details: '',
      // location: '',
      // type:
      console.log('sched index: ', index);
      // console.log('sched: ', sched);
      
      // build the date - MMM DD, YYYY
      formattedStartDate = new Date(Date.parse(sched.startDateTime));
      startMonth = months[formattedStartDate.getMonth()];
      formattedSched.date = startMonth + ' ' + formattedStartDate.getDate() + ', ' + formattedStartDate.getFullYear();
      // build the start time - HH:MM AM/PM
      formattedSched.startTime = sched.startTime;
      formattedSched.endTime = sched.endTime;
      // build the order deadline - MMM DD - HH:MM AM/PM
      formattedOrderDeadlineDate = new Date(Date.parse(sched.orderDeadline));
      orderDeadlineMonth = months[formattedOrderDeadlineDate.getMonth()];
      formattedSched.orderDeadline = orderDeadlineMonth + ' ' + formattedOrderDeadlineDate.getDate() + ' - ' + sched.orderDeadlineTime;
      formattedSched.producerName = sched.producerName;
      formattedSched.location = sched.city + ', ' + sched.province;
      formattedSched.type = sched.type;
      formattedSched.description = sched.description;
      console.log('formattedSched ', formattedSched);
      
      // build the html and append to htmlMiddle
      htmlMiddleTemp = `
        <table style="width: 100%; background: lightgray; padding-top: 1rem; padding-bottom: 1rem; margin-bottom: 1rem;">
          <tr>
            <td>
              <table style="width: 100%">
                <tr>
                  <td style="width:30%"><p style="text-align:right"><strong>Date: &nbsp;&nbsp;</strong></p></td>
                  <td><p>${formattedSched.date}</p></td>
                </tr>
                <tr>
                  <td><p style="text-align:right"><strong>Producer: &nbsp;&nbsp;</strong></p></td>
                  <td><p>${formattedSched.producerName}</p></td>
                </tr>
                <tr>
                  <td><p style="text-align:right"><strong>Location: &nbsp;&nbsp;</strong></p></td>
                  <td><p>${formattedSched.location}</p></td>
                </tr>
                <tr>
                  <td><p style="text-align:right"><strong>Type: &nbsp;&nbsp;</strong></p></td>
                  <td><p>${formattedSched.type}</p></td>
                </tr>
                <tr>
                  <td><p style="text-align:right"><strong>Details: &nbsp;&nbsp;</strong></p></td>
                  <td><p>${formattedSched.description}</p></td>
                </tr>
              </table>
            </td>
          </tr>
          <br>
          <tr>
            <td>
              <table style="width: 100%" role="presentation" border="0" cellpadding="0" cellspacing="0"> 
                <tbody> 
                  <tr style="text-align:center"> 
                    <td style="width: 25%"></td>
                    <td style="width:50%; font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #741b47; border-radius: 5px; text-align: center;"> <a href="https://onlylocalfood.com/producer/${sched.id}/" target="_blank" style="display: inline-block; color: #ffffff; background-color: #741b47; border: solid 1px #741b47; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: .5rem 1rem; text-transform: capitalize; border-color: #741b47;">Go to this Producer's Store</a> </td>
                    <td style="width: 25%"></td>
                  </tr>
                </tbody>
              </table> 
            </td>
          </tr>
        </table>
      `;
      htmlMiddle += htmlMiddleTemp;
      
    });
    
    html = [htmlStart, htmlMiddle, htmlEnd].join('');
    console.log('html: ', htmlMiddle);
    
    // set the params and send the email
        var params = {
          Destination: {
            BccAddresses: ['devontaylor0891@gmail.com']
          },
          Message: {
            Body: {
              Html: {
                Charset: "UTF-8",
                Data: html

          // }, Text: {
          //   Data: 'Schedule info: ' + event.schedule
          }
        },
        Subject: {
          Data: "test"
        }
      },
      Source: "Devon from Onlylocalfood <info@onlylocalfood.com>"
    };
    // console.log('bcc: ', params.Destination.BccAddresses);
    console.log('===SENDING EMAIL===#');
    // Create the promise and SES service object
    var sendPromise = ses.sendEmail(params).promise();
  
    // Handle promise's fulfilled/rejected states
    sendPromise.then(
      function (data) {
        console.log("===EMAIL SENT===");
        console.log(data.MessageId);
          reset();
          console.log('resetting: ', index)
          console.log('resetting: ', primeLocation)
      }).catch(
      function (err) {
        console.error(err, err.stack);
      });
    
    
  });
  
};

