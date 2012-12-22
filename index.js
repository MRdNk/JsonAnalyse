var fs = require('fs');
var util = require('util');
var events = require('events');
var _ = require('underscore');


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
      console.log(success);
      that.emit('fileloaded');
    }
  });

  return that;
}

util.inherits(JsonAnalyse, events.EventEmitter);

JsonAnalyse.prototype.evaluate = function (opts) {
  var that = this;
  that.opts = opts || {};

  that.categoryNames = [];
  that.categories = [];

  that.on('fileloaded', fileLoaded);
  that.on('fileloaded', createCategories);

  function fileLoaded () {
    // console.log('that.data: ', that.data);
    var Cat1s = _.filter(that.data, function (item) {
      return item.Category === 'Cat1' && item.Type === 'Type1';
    });
    console.log('Cat1-Type1s: ',Cat1s);
  }

  function createCategories () {
    _.each(that.data, function (item) {
      if (that.categoryNames.indexOf(item.Category) === -1) {
        that.categoryNames.push(item.Category);
      }
    });

    createCategoryItemsFromArray();
    _.each(that.categories, function (cat) {
      filterDataToCategories(cat);
    });

    // console.log('categoryNames: ', that.categoryNames);
    console.log('categories: ', JSON.stringify(that.categories,null,4));
  }

  function createCategoryItemsFromArray () {
    _.each(that.categoryNames, function (catName) {
      var cat = new Category(catName);
      that.categories.push(cat);
    });
  }

  function filterDataToCategories (category) {
    var items = _.filter(that.data, function (item) {
      return item.Category === category.catname;
    });
    category.addItems(items);
  }

};

function Category (catname, items) {
  this.catname = catname;
  this.items = items;
}

Category.prototype.addItem = function (item) {
  this.items.push(item);
};

Category.prototype.addItems = function (items) {
  this.items = items;
};

var analyse = new JsonAnalyse ('./data.json');
analyse.evaluate();