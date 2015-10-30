var assert = require('assert');

var start;

function runningTime(label){
  var diff = new Date() - start;
  console.log("LABEL: ", label, diff);
}

xdescribe('BeforeAfter', function(){
  beforeEach(function(done){
    start = new Date();
    setTimeout(function(){
      runningTime('1950')
      done();
    }, 1950);
  });

  beforeEach(function(done){
    setTimeout(function(){
      runningTime('1000')
      done();
    }, 1000);
  });

  beforeEach(function(done){
    setTimeout(function(){
      runningTime('1500')
      done();
    }, 1500);
  });

  beforeEach(function(done){
    setTimeout(function(){
      runningTime('10')
      done();
    }, 10);
  });

  it('works', function(){
    assert(1 == 1);
  });

  it('works', function(){
    assert(1 == 1);
  });
});
