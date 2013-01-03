var fs = require('fs');
var util = require('util');
var events = require('events');
var _ = require('underscore');

var Category = require('./lib/_category.js');

function JsonAnalyse (filename) {
  events.EventEmitter.call(this);

  var that = this;
  that.data = null;

  that.loadFile = function (filename, cb) {
    fs.readFile(filename, function (err, file) {
      if(err) {
        cb(err);
        process.exit(0);
      }

      that.data = JSON.parse(file.toString());
      cb(null, 'success');

    });
  };

  that.loadFile(filename, function (err, success) {
    if (err) {
      console.error(err);
    } else {
      // console.log(success);
      that.emit('fileloaded');
    }
  });

  return that;
}

util.inherits(JsonAnalyse, events.EventEmitter);

JsonAnalyse.prototype.evaluate = function (opts) {
  var that = this;
  that.opts = opts || {};

  if (that.opts.catKeys) {
    that.catKeys = that.opts.catKeys;
  }

  that.categoryNames = [];
  that.categories = [];

  that.on('fileloaded', createCategories);

  function createCategories () {

    _.each(that.data, function (item) {
      var cat = new Category(that.catKeys);

      _.each(that.catKeys, function (key) {
        cat.addValue({key: key, value: item[key]});
      });

      if (!isObjectInArray(that.catKeys, that.categories, cat)) {
        that.categories.push(cat);
      }

    });

    _.each(that.categories, function (cat) {
      filterDataToCategories(cat);
    });

    // console.log('categories: ', JSON.stringify(that.categories,null,4));
    that.emit('categories', that.categories);
  }

  function filterDataToCategories (category) {
    var items = _.filter(that.data, function (item) {
      return isObjectInArray (that.catKeys, [category], item);
    });
    category.addItems(items);
  }

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

};

JsonAnalyse.prototype.getCategories = function () {
  var that = this;
  that.on('categories', function (categories) {
    console.log('categories: got');
    return categories;
  });
};

var analyse = new JsonAnalyse ('./data/data.json');
analyse.evaluate({catKeys: ['Category', 'Type']});
analyse.on('categories', function (categories) {
  console.log(JSON.stringify(categories,null,4));
});