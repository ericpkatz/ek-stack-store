app.factory('Order', function(){
  function Order(data){
    _.extend(this, data);
  
  }
  return Order;
});
