var mongoose = require('mongoose');
var schema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  status: { type: String, default: 'cart' },
  lineItems: [],
  orderDate: { type: Date }
});

mongoose.model('Order', schema);
