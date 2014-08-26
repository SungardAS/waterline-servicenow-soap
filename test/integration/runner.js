/* @annotation:tour runner */

/**
 * Run integration tests
 *
 * Uses the `waterline-adapter-tests` module to
 * run mocha tests against the appropriate version
 * of Waterline.  Only the interfaces explicitly
 * declared in this adapter's `package.json` file
 * are tested. (e.g. `queryable`, `semantic`, etc.)
 */

/**
 * Module dependencies
 */

var util = require('util');
var utils = require('waterline-adapter-tests/lib/utils');
var mocha = require('mocha');
var log = new (require('captains-log'))();
var TestRunner = require('waterline-adapter-tests');
var Adapter = require('../../waterline-servicenow-soapAdapter');
var Path = require('path');
var _ = require('lodash');

// Grab targeted interfaces from this adapter's `package.json` file:
var package = {};
var interfaces = ['queryable'];

log.info('Testing `' + package.name + '`, a Sails/Waterline adapter.');
log.info('Running `waterline-adapter-tests` against ' + interfaces.length + ' interfaces...');
log.info('( ' + interfaces.join(', ') + ' )');
console.log();
log('Latest draft of Waterline adapter interface spec:');
log('http://links.sailsjs.org/docs/plugins/adapters/interfaces');
console.log();

// Attach config to adapter
// this.adapter.config = this.config;
global.Connections = {
  'test': {
    url: {
      protocol: 'https',
      host: 'demo002.service-now.com',
    },
    username: 'admin',
    password: 'admin',
    schema: false
  }
};

global.Connections.test.adapter = 'wl_tests';

// Globalize Adapter
global.Adapter = Adapter;

// Build an array of files to test
var filter = '\\.(' + ['js'].join('|') + ')$';

var files = [];

interfaces.forEach(function(interface) {
  var interfacePath = Path.resolve(__dirname,'../interfaces/' + interface);
  files = files.concat(utils.fileLookup(interfacePath, filter, true));
});

// Build a Mocha Runner
// if you need to limit, add a grep with the test name
// grep: "update"  
var test = new mocha(_.merge({
  timeout: 20000  
}, {}));

// Set Global Placeholders for Ontologies
global.Associations = {};
global.Semantic = {};
global.Queryable = {};
global.Migratable = {};

// Allow Adapter to be a global without warning about a leak
test.globals([Adapter, Connections, Associations, Semantic, Queryable]);
test.files = files;

console.time('time elapsed');
test.run(function(err) {
  console.timeEnd('time elapsed');
  process.exit(err);
});
