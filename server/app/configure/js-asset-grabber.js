var fs = require('fs');
var path = require('path');

var _jsFiles = [];

module.exports = function(){
    var base = path.join(__dirname, '../../../browser');
    var startPath = path.join( base, "js");
    _jsFiles.push(path.join(base + '/js/app.js'));
    getFiles(startPath, _jsFiles);
    return _jsFiles;
}; 

function getFiles(dir, list){
  var files = fs.readdirSync(dir);
  files.forEach(function(file){
    var fullPath = path.join(dir, file);
    var stat = fs.lstatSync(fullPath);
    if(stat.isDirectory())
      getFiles(fullPath, list);
    else if(list.indexOf(fullPath) == -1 && path.extname(fullPath) == '.js'){
      list.push(fullPath);
    }
  });
}
