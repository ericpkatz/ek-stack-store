var path = require('path');
var jsAssetGrabber = require('../../server/app/configure/js-asset-grabber');
 
var base = '/Users/erickatz/ek-stack-store/';
var appFiles = jsAssetGrabber().map(function(file){
  return file.slice(base.length);
});

module.exports = function (config) {

  var vendorFiles = [
        'node_modules/lodash/index.js',
        'node_modules/angular/angular.js',
        'node_modules/angular-ui-router/release/angular-ui-router.js',
        'node_modules/angular-bootstrap/dist/ui-bootstrap.js',
        'node_modules/angular-bootstrap/ui-bootstrap-tpls.js',
        'node_modules/socket.io-client/socket.io.js',

  ];
  var testFiles = [
        'node_modules/sinon/pkg/sinon.js',
        'node_modules/angular-mocks/angular-mocks.js',
        'tests/browser/**/*.js'
  ];

    var filesCollection = [].concat(vendorFiles).concat(appFiles).concat(testFiles); 
   
    console.log(filesCollection);

    var excludeFiles = [
        'tests/browser/karma.conf.js'
    ];

    var configObj = {
        browsers: ['PhantomJS'],
        frameworks: ['mocha', 'chai'],
        basePath: path.join(__dirname, '../../'),
        files: filesCollection,
        exclude: excludeFiles,
        reporters: ['mocha', 'coverage'],
        preprocessors: {
            'public/main.js': 'coverage'
        },
        coverageReporter: {
            dir: 'coverage/browser/',
            reporters: [{
                type: 'text',
                subdir: '.'
            }, {
                type: 'html',
                subdir: '.'
            }]
        }
    };

    config.set(configObj);

};
