
describe('ReportingFactory', function(){
  var data = {  
     "orderDate":"2015-11-05T14:10:09.667Z",
     "_id":"1234",
     "user":"563097a5d8659aa2d2a989ee",
     "__v":1,
     "lineItems":[  
        {  
           "_id":"563b633ba5a6f55849368c4c",
           "price":8,
           "product":{  
              "_id":"563a6e1f20f2b7ff3fd9f8af",
              "name":"bizz-buzz",
              "__v":0,
              "price":8
           },
           "order":"563b6308ad429a4e49d68437",
           "__v":0,
           "count":1
        },
        {  
           "_id":"563b633fa5a6f55849368c4d",
           "price":3.25,
           "product":{  
              "_id":"56362e8319927e795d130ed6",
              "name":"Buzz",
              "price":3.25
           },
           "order":"563b6308ad429a4e49d68437",
           "__v":0,
           "count":3
        }
     ],
     "status":"processed"
  };
  var ReportingFactory, $window;

  beforeEach(module('FullstackGeneratedApp'));

  beforeEach(inject(function(_ReportingFactory_, _$window_, _Order_){
    ReportingFactory = _ReportingFactory_;
    Order = _Order_;
    $window = _$window_;
  }));

  it('exists', function(){
    expect(ReportingFactory).to.be.ok;
  });

  describe('reportTransaction', function(){
    it('ga requires ecommerce', function(){
      $window.ga = function(args){
      
      };
      var spy = sinon.spy($window, 'ga');
      ReportingFactory.reportTransaction(data);
      expect(spy.getCalls()[0].args).to.eql(['require', 'ecommerce']);
    });

    it('ga adds transaction', function(){
      $window.ga = function(args){
      
      };
      var order = new Order(data);
      var transactionData = {
        'id' : order._id,
        'revenue' : order.total().toFixed(2) 
      
      };
      var args = ['ecommerce:addTransaction', transactionData];
      var spy = sinon.spy($window, 'ga');
      ReportingFactory.reportTransaction(data);
      expect(spy.getCalls()[1].args).to.eql( args );
    });

    it('ga adds the first item', function(){
      $window.ga = function(args){
      
      };
      var order = new Order(data);
      var transactionData = {
        'id' : order._id,
        'revenue' : order.lineItems[0].total().toFixed(2),
        'name' : order.lineItems[0].product.name,
        'sku' : order.lineItems[0].product.name,
        'quantity' : order.lineItems[0].count
      };
      var args = ['ecommerce:addItem', transactionData];
      var spy = sinon.spy($window, 'ga');
      ReportingFactory.reportTransaction(data);
      expect(spy.getCalls()[2].args).to.eql( args );
    });

    it('ga adds the second item', function(){
      $window.ga = function(args){
      
      };
      var order = new Order(data);
      var transactionData = {
        'id' : order._id,
        'revenue' : order.lineItems[1].total().toFixed(2),
        'name' : order.lineItems[1].product.name,
        'sku' : order.lineItems[1].product.name,
        'quantity' : order.lineItems[1].count
      };
      var args = ['ecommerce:addItem', transactionData];
      var spy = sinon.spy($window, 'ga');
      ReportingFactory.reportTransaction(data);
      expect(spy.getCalls()[3].args).to.eql( args );
    });

    it('sends the transaction', function(){
      $window.ga = function(args){
      
      };
      var order = new Order(data);
      var args = ['ecommerce:send'];
      var spy = sinon.spy($window, 'ga');
      ReportingFactory.reportTransaction(data);
      expect(spy.getCalls()[4].args).to.eql( args );
    });
  });


});
