var _ = require('lodash'),
_s = require('underscore.string'),
async = require('async'),
url = require('url'),
soap = require('soap'),
querystring = require('querystring');


var Resource = module.exports = function(config, collections) {
  // Hold Config values for each collection, this allows each collection
  // to define which file the data is synced to
  this.config = config || {};

  // Hold Collections
  this.collections = collections || {};

  this.baseUrl = _.extend({}, config.url);

  this.clientDefaults = {
    url: url.format(this.baseUrl)
  };

  return this;
};

Resource.prototype.initialize = function(cb) {
  var self = this;
  var basicAuth = new soap.BasicAuthSecurity(this.config.username, this.config.password);

  async.auto({
    baseTables: function(baseTablesCb,results) {
      async.each(
        _.pairs(self.collections),
        function loadCollections(colDef,loadCb) {
          var collectionName = colDef[0];
          var collection = colDef[1];

          var requestUrl = _.extend({},self.baseUrl);
          requestUrl.pathname = '/' + collectionName + '.do';
          requestUrl.query = requestUrl.query || {};
          requestUrl.query.displayvalue = 'all';

          var urlString = url.format(requestUrl);
          collection.urlString = urlString + "&WSDL";

          soap.createClient(collection.urlString, function createSOAPClient(err, client) {
            if (err)
              loadCb(collectionName + ': ' + err);

            client.setSecurity(basicAuth);
            collection.client = client;
            loadCb(err);
          });
        },
        function baseCollectionsLoaded(err) {
          baseTablesCb(err);
        }
      );
    }
  },
  function(err,results) {
    cb(err);
  });

};

Resource.prototype.describe = function(collectionName,cb) {
  cb(null,this._describe(collectionName));
};

Resource.prototype.find = function(collectionName,options,waterlineCb) {
  var collection = this.collections[collectionName];

  var query = this._buildQuery(collectionName,options);

  // Do the request
  collection.client.getRecords(query,function processResponse(err,result) {
    waterlineCb(err,result.getRecordsResult || []);
  });
};

Resource.prototype.create = function(collectionName,values,waterlineCb) {
  var collection = this.collections[collectionName];

  collection.client.insert(values,function processResponse(err,result) {
    waterlineCb(err,result.getRecordsResult);
  });
};

Resource.prototype.count = function(collectionName,options,waterlineCb) {
  var collection = this.collections[collectionName];

  var query = this._buildQuery(collectionName,options);
  delete query.__limit;
  delete query.__first_row;
  delete query.__last_row;
  delete query.__exclude_columns;

  //query = options.where || {};
  query.COUNT = 'sys_id';

  collection.client.aggregate(query,function processResponse(err,result) {
    var count = _.pluck(result.aggregateResult,'count')[0];
    waterlineCb(err,count);
  });
};


Resource.prototype._describe = function(collectionName) {
  var collection = this.collections[collectionName];
  var keys = _.extend({},_.values(_.values(collection.client.describe())[0])[0].getRecords.output['getRecordsResult[]']);
  return keys;
};

Resource.prototype._buildQuery = function(collectionName,options) {
  var collection = this.collections[collectionName];
  var query = _.merge({},options.where);
  var encodedQuery = [];

  if (options.limit) {
    query.__limit = options.limit;
  }

  if (options.skip) {
    query.__first_row = options.skip;
    query.__last_row = options.skip + options.limit;
  }

  if (options.sort) {
    var orderBy = [];
    var orderByDesc = [];

    _.each(_.pairs(options.sort), function(keyVal) {
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

  _.each(_.pairs(query), function(keyValue) {
    if (_.isArray(keyValue[1])) {
      encodedQuery.push(keyValue[0]+'IN'+keyValue[1].join(','));
      delete query[keyValue[0]];
    }
  });

  // Build encoded query
  query.__encoded_query = encodedQuery.join('^');

  if (query.__encoded_query.length === 0)
    delete query.__encoded_query;

  // Exclude any columns not defined in the Model's attributes
  query.__exclude_columns = _.difference(
    _.filter(
      _.keys(this._describe(collectionName)),
      function(key) {
        return _.isNull(key.match(/^dv_/));
      }
    ),
    _.keys(collection.definition)
  ).join(',');


  return query;
};
