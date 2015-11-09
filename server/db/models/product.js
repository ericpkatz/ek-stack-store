var mongoose = require('mongoose');

var schema = mongoose.Schema({
  name:  { type: String, required: true, unique: true },
  price: { type: Number, required: true, default: 0 },
  imageURL: { type: String }
});

schema.virtual('url_name').get(function(product){
  return this.name.replace(/\W/g, '_');
});

var whiteListParams = ['name', 'price', 'imageURL'];

schema.statics.post = function(params){
  var safeParams = whiteListParams.reduce(function(curr, key){
    if(params[key])
      curr[key] = params[key];
    return curr;
  }, {});
  return this.create(safeParams);
};

schema.statics.put = function(id, params){
  var safeParams = whiteListParams.reduce(function(curr, key){
    if(params[key])
      curr[key] = params[key];
    return curr;
  }, {});
  return this.findById(id)
    .then(function(product){
       Object.keys(safeParams).forEach(function(key){
         product[key] = safeParams[key];
       });
       return product.save();
    })
    .then(function(product){
      return product;
    });
};

mongoose.model('Product', schema);
