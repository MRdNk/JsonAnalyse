var _ = require('underscore');

var data = [{
    "Category": "Cat1",
    "Type": "Type1",
    "Data1": "Bob",
    "Data2": "House"
},{
    "Category": "Cat1",
    "Type": "Type1",
    "Data1": "Phil",
    "Data2": "Flat"
},{
    "Category": "Cat2",
    "Type": "Type2",
    "Data1": "Margaret",
    "Data2": "Pool"
},{
    "Category": "Cat2",
    "Type": "Type2",
    "Data1": "Jon",
    "Data2": "Bedroom"
}];

var catKeys = ['Category', 'Type'];

function Item (keys) {
  var that = this;
  // console.log('keys: ', keys);
  _.each(keys, function (key) {
    that[key] = null;
  });

  return that;
}

Item.prototype.addValue = function (keyValue) {
  this[keyValue.key] = keyValue.value;
};

var items = [];
var uniqueItems = [];

_.each (data, function (data_item) {
  
  var item = new Item(catKeys);
  _.each (catKeys, function (catKey) {
    item.addValue({key: catKey, value: data_item[catKey]});
  });

  if (!isObjectInArray(catKeys, items, item)) {
    items.push(item);
  }
});

function isObjectInArray (keys, items, item) {
  var count = 0;

  // Iterate through items array
  for(var i=0; i<items.length; i++) {

    // Iterate through keys
    for(var x=0; x<keys.length; x++) {
      if (item[keys[x]] === items[i][keys[x]]) {
        count ++;
      }
    }
  }
  if (count === keys.length)
    return true;
  return false;
}

console.log('items: ',items);