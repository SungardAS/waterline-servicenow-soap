var _ = require('lodash'),
_s = require('underscore.string'),
async = require('async'),
url = require('url'),
soap = require('soap'),
querystring = require('querystring'),
Query = require('./query'),
Deflate = require('./cast/deflate');


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
        _.toPairs(self.collections),
        function loadCollections(colDef,loadCb) {
          var collectionName = colDef[0];
          var collection = colDef[1];
          collection._cast = new Deflate();
          collection._cast.initialize(collection.definition);

          collection._query = new Query(collection);

          var requestUrl = _.extend({},self.baseUrl);
          requestUrl.pathname = '/' + collectionName + '.do';
          requestUrl.query = requestUrl.query || {};
          requestUrl.query.displayvalue = 'all';

          var wsdl_headers = {
            Authorization: 'Basic ' + new Buffer(self.config.username+':'+self.config.password).toString('base64')
          };

          var urlString = url.format(requestUrl);
          collection.urlString = urlString.replace('?','?WSDL&');

          soap.createClient(collection.urlString, {wsdl_headers: wsdl_headers}, function createSOAPClient(err, client) {
            if (err) {
              loadCb(collectionName + ': ' + err);
            }
            else {
              client.setSecurity(basicAuth);
              collection.client = client;
              loadCb(err);
            }
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

  collection._query.build(
    options,
    function (err,query) {
      // Do the request
      collection.client.getRecords(query,function processResponse(err,result) {
        if (err) {
          waterlineCb(err);
        }
        else {
          var r = result.getRecordsResult || [];
          async.map(
            r,
            function(item,cb) {
              collection._query.inflate(item,cb);
            },
            waterlineCb
          );
        }
      });
    }
  );
};

Resource.prototype.create = function(collectionName,values,waterlineCb) {
  var collection = this.collections[collectionName];

  collection.client.insert(values,function processResponse(err,result) {
    collection._query.inflate(result, waterlineCb);
  });
};

Resource.prototype.update = function(collectionName,options,values,waterlineCb) {
  var collection = this.collections[collectionName];
  var self = this;
  if (options.where && options.where.sys_id) {
    values.sys_id = values.sys_id || options.where.sys_id;
    collection.client.update(values,function processResponse(err,result) {
      if (err) {
        waterlineCb(err);
      }
      else {
        self.find(collectionName,{where: {sys_id:options.where.sys_id}},waterlineCb);
      }
    });
  } else {
    waterlineCb("updates must have sysid");
  }
};

Resource.prototype.count = function(collectionName,options,waterlineCb) {
  var collection = this.collections[collectionName];

  collection._query.build(options, function(err,query) {
    delete query.__limit;
    delete query.__first_row;
    delete query.__last_row;
    delete query.__exclude_columns;

    //query = options.where || {};
    query.COUNT = 'sys_id';

    if (!collection.client.aggregate) {
      waterlineCb("aggregate not enabled");
      return;
    }
    collection.client.aggregate(query,function processResponse(err,result) {
      var count = _.map(result.aggregateResult,'COUNT')[0][0];
      waterlineCb(err,count);
    });
  });
};

Resource.prototype._describe = function(collectionName) {
  var collection = this.collections[collectionName];
  var keys = _.extend({},_.values(_.values(collection.client.describe())[0])[0].getRecords.output['getRecordsResult[]']);
  return keys;
};
