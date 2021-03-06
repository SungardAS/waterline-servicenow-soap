var _ = require('lodash'),
  moment = require('moment'),
  async = require('async'),
  conditionMap = require('./sql/conditionMap');

var Query = module.exports = function(collection) {
  this.collectionName = collection.adapter.collection;
  this._schema = _.clone(collection.definition);
  this._collection = collection;
  return this;
};

Query.prototype.build = function(options,cb) {
  var self = this,
    encodedQuery = [],
    collection = this._collection,
    query = {};


  /* Set Limit */
  if (options.limit) {
    query.__limit = options.limit;
  }

  /*
   * If we need to skip records then use
   * __first_row and __last_row
   */
  if (options.skip) {
    query.__first_row = options.skip;
    query.__last_row = options.skip + options.limit;
  }

  /*
   * If sort then pass to __order_by and
   * __order_by_desc as approperiate
   */
  if (options.sort) {
    var orderBy = [];
    var orderByDesc = [];

    _.each(_.toPairs(options.sort), function(keyVal) {
      if (keyVal[1] == 1) {
        orderBy.push(keyVal[0]);
      }
      else if (keyVal[1] == -1) {
        orderByDesc.push(keyVal[0]);
      }
    });

    if (orderBy.length > 0)
      query.__order_by = orderBy.join(',');

    if (orderByDesc.length > 0)
      query.__order_by_desc = orderByDesc.join(',');
  }


  query.__encoded_query = this.encodeQuery(options.where);

  if (query.__encoded_query.length === 0)
    delete query.__encoded_query;

  /*
   * Exclude any columns not defined in the Model's attributes
   * Also ignore any dv_ columns
   */
  async.auto({
    describeCollection: function(autoCb) {
      collection.describe(autoCb);
    },
    excludeColumns: ['describeCollection', function(autoCb,results) {
      var exclude = _.difference(
        _.filter(
          _.keys(results.describeCollection),
          function(key) {
            return _.isNull(key.match(/^dv_/));
          }
        ),
        _.keys(self._schema)
      ).join(',');
      autoCb(null,exclude);
    }]
  }, function (err,results) {
    query.__exclude_columns = results.excludeColumns;
    cb(err,query);
  });
};

Query.prototype.encodeQuery = function(query,cb) {
  var self = this,
    encodedQuery = [];

  query = query || {};

  Object.keys(query).forEach(function(key) {
    if(!self._schema[key]) {
      encodedQuery.push(key+'='+query[key]);
      return;
    }

    // Lookup schema type
    var type = self._schema[key].type || 'string';

    if (_.isArray(query[key])) {
      encodedQuery.push(key+'IN'+query[key].join(','));
    }
    else if (_.isObject(query[key])) {
      // Conditions
      var conditionDef = query[key];
      _.each(_.toPairs(conditionDef), function(conditionKV) {
        var condition = conditionMap[conditionKV[0]];
        if (condition) {
          if (_.isArray(conditionKV[1])){
            var newQuery =[];
            conditionKV[1].forEach(function(filter) { newQuery.push(key+condition+filter)})
            var joinedQuery = newQuery.join('^');
            encodedQuery.push(self.encodeValue(joinedQuery,type));
          }
          else {
            encodedQuery.push(key+condition+self.encodeValue(conditionKV[1],type));
          }
        }
      });
    }
    else {
      encodedQuery.push(key+'='+query[key]);
    }

  });

  return encodedQuery.join('^');

};

Query.prototype.encodeValue = function(value,type) {
  var _value = value;

  switch(type) {
    case 'date':
      case 'time':
      case 'datetime':
      _value = moment.utc(value).format('YYYY-MM-DD HH:mm:ss');
    break;
  }

  return _value;
};


Query.prototype.inflate = function(values,cb) {
  var self = this,
    _values = _.clone(values);

  Object.keys(values).forEach(function(key) {

    if (_.isObject(_values[key]) && _.isEmpty(_values[key])) {
      _values[key] = null;
      return;
    }

    if(!self._schema[key]) return;

    // Lookup schema type
    var type = self._schema[key].type;
    if(!type) return;

    switch(type) {
      case 'date':
        case 'time':
        case 'datetime':
        mDate = moment.utc(values[key]);
      if (mDate.isValid())
        _values[key] = mDate.toDate();
      break;

      case 'boolean':
        var val = values[key];
      if(val === 0 || val === 'false') _values[key] = false;
      if(val === 1 || val === 'true') _values[key] = true;
      break;
    }

  });

  if (_.isFunction(cb)) {
    cb(null,_values);
  }
  else {
    return _values;
  }
};

