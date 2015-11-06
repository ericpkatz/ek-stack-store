var jsAssetGrabber = require('./js-asset-grabber');
var path = require('path');


module.exports = function(app){
  var _jsFiles = [];

  if(process.env.NODE_ENV == 'production')
    _jsFiles = ['/main.js']; 
  else {
    _jsFiles = jsAssetGrabber();
    var base = path.join(__dirname, '../../../browser');
    _jsFiles = _jsFiles.map(function(file){
      return file.slice(base.length);
    });
  }

  app.use(function(req, res, next){
    res.locals.scriptTags = _jsFiles;
    next();
  }); 
}
