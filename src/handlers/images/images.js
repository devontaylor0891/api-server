'use strict';
let AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: process.env.IMAGES_ACCESS_ID, 
  secretAccessKey: process.env.IMAGES_ACCESS_SECRET,
  region:'us-west-2'
});

module.exports = {

  // ***************** get presigned url for image uploads ***************
  get_presigned_url: function(req, res) {

    console.log('image url req: ', req);

    const s3 = new AWS.S3();
    let params = {
      Bucket: 'onlylocalfood-images',
      // Key: req.body.imageName,
      Key: 'example',
      Expires: 1000000,
      ContentType: 'image/jpeg'
      // ACL: 'public-read'
    };
    let url = s3.getSignedUrl('putObject', params);
    console.log('params: ', params);
    console.log('url: ', url);
    return res.status(200).send(url);

  }

};
