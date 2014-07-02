/**
 * Dependencies
 */

var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({

  identity: 'incident',
  connection: 'queryable',
  migrate: 'safe',

  attributes: {
    sys_id: {
      primaryKey: true,
      type: 'string'
    }
  }

});
