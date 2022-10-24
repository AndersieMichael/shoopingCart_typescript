var DataTypes = require("sequelize").DataTypes;
var _cart_detail = require("./cart_detail");
var _customer = require("./customer");
var _dummy = require("./dummy");
var _item = require("./item");
var _item_catalogue = require("./item_catalogue");
var _order_detail = require("./order_detail");
var _order_header = require("./order_header");
var _shooping_cart = require("./shooping_cart");

function initModels(sequelize) {
  var cart_detail = _cart_detail(sequelize, DataTypes);
  var customer = _customer(sequelize, DataTypes);
  var dummy = _dummy(sequelize, DataTypes);
  var item = _item(sequelize, DataTypes);
  var item_catalogue = _item_catalogue(sequelize, DataTypes);
  var order_detail = _order_detail(sequelize, DataTypes);
  var order_header = _order_header(sequelize, DataTypes);
  var shooping_cart = _shooping_cart(sequelize, DataTypes);

  order_header.belongsTo(customer, { as: "customer", foreignKey: "customer_id"});
  customer.hasMany(order_header, { as: "order_headers", foreignKey: "customer_id"});
  shooping_cart.belongsTo(customer, { as: "customer", foreignKey: "customer_id"});
  customer.hasMany(shooping_cart, { as: "shooping_carts", foreignKey: "customer_id"});
  cart_detail.belongsTo(item, { as: "item", foreignKey: "item_id"});
  item.hasMany(cart_detail, { as: "cart_details", foreignKey: "item_id"});
  dummy.belongsTo(item, { as: "item", foreignKey: "item_id"});
  item.hasMany(dummy, { as: "dummies", foreignKey: "item_id"});
  item_catalogue.belongsTo(item, { as: "item", foreignKey: "item_id"});
  item.hasMany(item_catalogue, { as: "myitem", foreignKey: "item_id"});
  order_detail.belongsTo(item, { as: "item", foreignKey: "item_id"});
  item.hasMany(order_detail, { as: "order_details", foreignKey: "item_id"});
  order_detail.belongsTo(order_header, { as: "order_header", foreignKey: "order_header_id"});
  order_header.hasMany(order_detail, { as: "order_details", foreignKey: "order_header_id"});
  cart_detail.belongsTo(shooping_cart, { as: "cart", foreignKey: "cart_id"});
  shooping_cart.hasMany(cart_detail, { as: "items", foreignKey: "cart_id"});

  return {
    cart_detail,
    customer,
    dummy,
    item,
    item_catalogue,
    order_detail,
    order_header,
    shooping_cart,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
