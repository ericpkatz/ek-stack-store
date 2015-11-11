'use strict';
var router = require('express').Router();
module.exports = router;
var mongoose = require('mongoose');
var Product = mongoose.model('Product');
var multiparty = require('connect-multiparty');
var path = require('path');
var mv = require('mv');
var _ = require('lodash');

var s3 = require('s3');
 
var client = s3.createClient({
  maxAsyncS3: 20,     // this is the default 
  s3RetryCount: 3,    // this is the default 
  s3RetryDelay: 1000, // this is the default 
  multipartUploadThreshold: 20971520, // this is the default (20 MB) 
  multipartUploadSize: 15728640, // this is the default (15 MB) 
  s3Options: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
    // any other options are passed to new AWS.S3() 
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property 
  },
});


router.use(multiparty());

router.get('/', function (req, res) {
  return Product.find()
    .sort('name')
    .then(function(products){
      res.send(products);
    });
});

router.get('/:id', function (req, res) {
  return Product.findById(req.params.id)
    .then(function(product){
      res.send(product);
    });
});

router.post('/', function (req, res, next) {
  var update = function(params){
    return Product.post(params)
      .then(function(product){
        res.send(product);
      });
  };
  if(req.files && req.files.imageURL){
    var source = req.files.imageURL.path;
    var fileName = path.basename(req.files.imageURL.path);
      var xparams = _.extend(req.body, { imageURL: fileName});
      var params = {
        localFile: source,
 
        s3Params: {
          Bucket: "ekstackstore",
          Key: 'images/' + fileName
        }
      };
      var uploader = client.uploadFile(params);
      uploader.on('error', function(err) {
        console.error("unable to upload:", err.stack);
      });
      uploader.on('progress', function() {
        console.log("progress", uploader.progressMd5Amount,
                  uploader.progressAmount, uploader.progressTotal);
      });
      uploader.on('end', function() {
            return update(xparams);
        //console.log("done uploading");
      });
    //});
  }
  else {
    return update(req.body);
  }
});

router.put('/:id', function (req, res, next) {
  var update = function(params){
    return Product.put(req.params.id, params)
      .then(function(product){
        res.send(product);
      });
  };
  if(req.files && req.files.imageURL){
    var source = req.files.imageURL.path;
    var fileName = path.basename(req.files.imageURL.path);
    var dest = path.join(__dirname, '../../../../', 'public/images', fileName);   
    mv(source, dest, {mkdirp: true}, function(err) {
      if(err)
        return next(err);
      var params = _.extend(req.body, { imageURL: fileName});
      return update(params);
    });
  }
  else {
    return update(req.body);
  }

});

router.delete('/:id', function (req, res) {
  return Product.findById(req.params.id)
    .then(function(product){
      return product.remove();
    })
    .then(function(){
      res.sendStatus(204);
    })
});
