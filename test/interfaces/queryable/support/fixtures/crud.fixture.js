/**
 * Dependencies
 */

var Waterline = require('waterline');
var snBaseModel = require('../../../../../lib/snBaseModel'),
    _ = require('lodash');

var base = _.merge({},snBaseModel);

var collection = _.merge(base, {

  identity: 'incident',
  connection: 'queryable',
  migrate: 'safe',

  attributes: {
    sys_id: {
      primaryKey: true,
      type: 'string'
    },
    number: {
      type: 'string'
    },
    sys_updated_on: {
      type: 'date'
    },
    description: {
      type: 'string'
    },
    short_description: {
      type: 'string'
    }
  }
});

module.exports = Waterline.Collection.extend(collection);
