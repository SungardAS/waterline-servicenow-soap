![image_squidhome@2x.png](http://i.imgur.com/RIvu9.png)

# waterline-servicenow-soap

Provides easy access to ServiceNow's SOAP resources from Sails.js & Waterline.

This module is a Waterline/Sails adapter, an early implementation of a rapidly-developing, tool-agnostic data standard.


### Installation

To install this adapter, run:

```sh
$ npm install waterline-servicenow-soap
```


### Configuration

The following config options are available along with their default values:

```javascript
config: {
  url: {
    host: 'demo002.service-now.com',
  },
  username: null,
  password: null
};
```


### Usage

```javascript
var Waterline = require('waterline'),
    _ = require('lodash'),
    snBaseModel = require('waterline-servicenow-soap/lib/model/snBaseModel');

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
    }
  }
});

module.exports = Waterline.Collection.extend(collection);
```


This adapter exposes the following methods:

###### `find()`

+ **Status**
  + Partial

###### `create()`

+ **Status**
  + Implemented

###### `update()`

+ **Status**
  + Planned

###### `destroy()`

+ **Status**
  + Planned


###### `count()`

+ **Status**
  + Partial - only works when aggregate plugin is enabled.


### Running the tests

```sh
$ npm test
```


