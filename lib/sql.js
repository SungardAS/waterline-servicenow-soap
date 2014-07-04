var _ = require('lodash'),
    moment = require('moment'),
    async = require('async'),
    conditionMap = require('./sql/conditionMap');

var SQL = module.exports = function(collection) {
  this.collectionName = collection.adapter.collection;
  this._schema = _.clone(collection.definition);
  this._collection = collection;
  return this;
};
