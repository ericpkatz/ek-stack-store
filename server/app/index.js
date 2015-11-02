'use strict';
var path = require('path');
var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
module.exports = app;

app.locals.pretty = true;

// Pass our express application pipeline into the configuration
// function located at server/app/configure/index.js
require('./configure')(app);

// Routes that will be accessed via AJAX should be prepended with
// /api so they are isolated from our GET /* wildcard.
app.use('/api', require('./routes'));


/*
 This middleware will catch any URLs resembling a file extension
 for example: .js, .html, .css
 This allows for proper 404s instead of the wildcard '/*' catching
 URLs that bypass express.static because the given file does not exist.
 */
app.use(function (req, res, next) {

    if (path.extname(req.path).length > 0) {
        res.status(404).end();
    } else {
        next(null);
    }

});

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

var _jsFiles;
function jsFiles(){
  if(_jsFiles)
    return _jsFiles;
  var base = path.join(__dirname, '../../browser');
  var startPath = path.join( base, "js");


  function getFiles(dir, list){
    var files = fs.readdirSync(dir);

    files.forEach(function(file){
      var fullPath = path.join(dir, file);
      var stat = fs.lstatSync(fullPath);
      if(stat.isDirectory())
        getFiles(fullPath, list);
      else if(list.indexOf(fullPath.slice(base.length)) == -1 && path.extname(fullPath) == '.js'){
        list.push(fullPath.slice(base.length));
      }
    });
  }

  var list = [ path.join('/js', 'app.js')];

  getFiles(startPath, list);

  _jsFiles = list;
  return _jsFiles;

}

app.get('/*', function (req, res) {
    res.render('index', { ENV: process.env.NODE_ENV || 'development', jsFiles: jsFiles });
});

// Error catching endware.
app.use(function (err, req, res, next) {
    console.error(err, typeof next);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
});
