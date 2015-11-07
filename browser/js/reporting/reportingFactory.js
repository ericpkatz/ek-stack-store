app.factory("ReportingFactory", function($window, Order){
  function reportTransaction(data){
    var order = new Order(data);
    $window.ga('require', 'ecommerce');
    $window.ga('ecommerce:addTransaction', {
      'id': order._id, 
      'revenue' : order.total().toFixed(2)
    });
    order.lineItems.forEach(function(lineItem){
      var transactionData = {
        'id': order._id,
        'revenue': lineItem.total().toFixed(2),
        'name' : lineItem.product.name,
        'sku' : lineItem.product.name,
        'quantity': lineItem.count
      };
      ga('ecommerce:addItem', transactionData);
    });
    ga('ecommerce:send');
  }

  return {
    reportTransaction: reportTransaction
  };

});
