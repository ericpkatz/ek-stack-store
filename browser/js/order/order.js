app.factory('Order', function(){
  function Order(data){
    _.extend(this, data);
    this.lineItems.forEach(function( lineItem ){
      lineItem.total = function(){
        return lineItem.price * lineItem.count;
      }
    });
  }

  Order.prototype.total = function(){
    return this.lineItems.reduce(function(sum, lineItem){
      sum += lineItem.total();
      return sum;
    }, 0);
  };
  return Order;
});
