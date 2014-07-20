/**
 * Dependencies
 */

var Waterline = require('waterline'),
    _ = require('lodash'),
    snBaseModel = require('../../../../../lib/model/snBaseModel');

var base = _.merge({},snBaseModel);

var collection = _.merge(base, {

  identity: 'incident',
  connection: 'queryable',

  attributes: {
    active: 'boolean',
    sys_id: {
      primaryKey: true,
      type: 'string'
    },
    number: {
      type: 'string'
    },
    sys_created_on: {
      type: 'date'
    },
    sys_updated_on: {
      type: 'date'
    },
    description: {
      type: 'string'
    },
    short_description: {
      type: 'string'
    },
    severity: {
      type: 'integer'
    }
  }
});

module.exports = Waterline.Collection.extend(collection);
