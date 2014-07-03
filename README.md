![image_squidhome@2x.png](http://i.imgur.com/RIvu9.png)

# waterline-servicenow-soap

Provides easy access to ServiceNow's SOAP resources from Sails.js & Waterline.

This module is a Waterline/Sails adapter, an early implementation of a rapidly-developing, tool-agnostic data standard.


### Installation

To install this adapter, run:

```sh
$ npm install waterline-servicenow-soap
```



### Usage


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
  + Partial


### Interfaces

>TODO:
>Specify the interfaces this adapter will support.
>e.g. `This adapter implements the [semantic]() and [queryable]() interfaces.`
> For more information, check out this repository's [FAQ](./FAQ.md) and the [adapter interface reference](https://github.com/balderdashy/sails-docs/blob/master/adapter-specification.md) in the Sails docs.


### Development

Check out **Connections** in the Sails docs, or see the `config/connections.js` file in a new Sails project for information on setting up adapters.

## Getting started
It's usually pretty easy to add your own adapters for integrating with proprietary systems or existing open APIs.  For most things, it's as easy as `require('some-module')` and mapping the appropriate methods to match waterline semantics.  To get started:

1. Fork this repository
2. Set up your `README.md` and `package.json` file.  Sails.js adapter module names are of the form sails-*, where * is the name of the datastore or service you're integrating with.
3. Build your adapter.




### Running the tests

```sh
$ npm test
```


