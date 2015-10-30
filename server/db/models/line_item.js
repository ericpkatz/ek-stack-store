var mongoose = require('mongoose');

var schema = mongoose.Schema({
  product: { required: true, ref: 'Product', type: mongoose.Schema.Types.ObjectId },
  order:   { required: true, ref: 'Order', type: mongoose.Schema.Types.ObjectId   },
  count:   { type: Number, default: 1 },
  price:   { type: Number }
});

schema.pre('save', function(next){
  var that = this;
  mongoose.model("Product")
    .findById(this.product)
      .then(function(product){
        that.price = product.price;
        next();
      });
});


var whiteListParams = ['product', 'order', 'count'];
var whiteListPatchParams = ['count'];

schema.statics.post = function(params){
  var safeParams = whiteListParams.reduce(function(curr, key){
    curr[key] = params[key];
    return curr;
  }, {});
  return this.create(safeParams);
};

schema.statics.patch = function(id, params){
  var safeParams = whiteListPatchParams.reduce(function(curr, key){
    curr[key] = params[key];
    return curr;
  }, {});
  return this.findById(id)
    .then(function(lineItem){
       Object.keys(safeParams).forEach(function(key){
         lineItem[key] = safeParams[key];
       });
       return lineItem.save();
    })
    .then(function(lineItem){
      return lineItem;
    });
};

mongoose.model('LineItem', schema);
