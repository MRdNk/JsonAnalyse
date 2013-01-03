var _ = require('underscore');

function Category (catkeys) {
  var that = this;
  _.each(catkeys, function (key) {
    that[key] = null;
  });

  that.items = null;
  return that;
}

Category.prototype.addItem = function (item) {
  this.items.push(item);
};

Category.prototype.addItems = function (items) {
  this.items = items;
};

Category.prototype.addValue = function (keyValue) {
  this[keyValue.key] = keyValue.value;
};

module.exports = Category;