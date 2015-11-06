var data = {  
   "orderDate":"2015-11-05T14:10:09.667Z",
   "_id":"563b6308ad429a4e49d68437",
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
         "count":1
      }
   ],
   "status":"processed"
};

describe('Order', function(){
  var order, Order;

  beforeEach(module('fsaPreBuilt'));

  beforeEach(module('FullstackGeneratedApp'));

  beforeEach(inject(function(_Order_){
    Order = _Order_;
    order = new Order(data);
  }));

  it('exists', function(){
    expect(Order).to.be.ok;
  });

  describe('an order', function(){

    it('has an id', function(){
      expect(order._id).to.be.ok;
    });

    it('has a collection of lineItems', function(){
      expect(order.lineItems.length).to.eq(2);
    });

    it('total - adds up line items', function(){
      expect(order.total()).to.eq(11.25);
    });
  });

});
