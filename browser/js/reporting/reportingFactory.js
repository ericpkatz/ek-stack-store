app.factory("ReportingFactory", function(){
  function report(order){
    console.log('---- order id ----- ', order._id);
    console.log('---- items -----', order.lineItems);
    console.log(order);
    console.log(JSON.stringify(order));
  }

  return {
    report: report
  };

});
