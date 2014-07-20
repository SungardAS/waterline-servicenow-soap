var assert = require('assert'),
    uuid = require('uuid'),
    moment = require('moment'),
    _ = require('lodash');

describe('Queryable Interface', function() {

  describe('Modifiers', function() {
    describe('greaterThan (>)', function() {
      describe('integers', function() {

        var uid = uuid();

        /////////////////////////////////////////////////////
        // TEST SETUP
        ////////////////////////////////////////////////////

        var testName = 'greaterThan test';

        before(function(done) {
          var incidents = [];

          for(var i=1; i<5; i++) {
            incidents.push({ description: testName, short_description: uid, severity: i });
          }

          Queryable.Incident.createEach(incidents, function(err) {
            if(err) return done(err);
            done();
          });
        });

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should return records with greaterThan key', function(done) {
          Queryable.Incident
          .find({ description: testName, short_description: uid, severity: { greaterThan: 1 }})
          .sort('severity')
          .exec(function(err, incidents) {
            assert(!err);
            assert(Array.isArray(incidents));
            assert(incidents.length === 3);
            assert(incidents[0].severity === 2);
            done();
          });
        });

        it('should return records with symbolic usseverity > usseverity', function(done) {
          Queryable.Incident.find({ description: testName, short_description: uid, severity: { '>': 1 }})
          .sort('severity')
          .exec(function(err, incidents) {
            assert(!err);
            assert(Array.isArray(incidents));
            assert(incidents.length === 3);
            assert(incidents[0].severity === 2);
            done();
          });
        });
      });

      describe('dates', function() {

        /////////////////////////////////////////////////////
        // TEST SETUP
        ////////////////////////////////////////////////////

        var testName = 'greaterThan dates test';

        var uid = uuid();
        var start = new Date(Date.now());

        before(function(done) {
          var incidents = [];
          for(var i=0; i<3; i++) {
            incidents.push({description: testName + i, short_description: uid});
          }

          Queryable.Incident.createEach(incidents, function(err, incidents) {
            if(err) return done(err);
            done();
          });

        });

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////
        it('should find 3 records created since this test started with symbolic >', function(done) {
          Queryable.Incident.find({ short_description: uid, sys_created_on: {'>': start} }, function(err, incidents) {
            assert(!err);
            assert(Array.isArray(incidents));
            assert(incidents.length === 3);
            done();
          });
        });

        it('should find 3 records created since this test started with greaterThan key', function(done) {
          Queryable.Incident.find({ short_description: uid, sys_created_on: {greaterThan: start} }, function(err, incidents) {
            assert(!err);
            assert(Array.isArray(incidents));
            assert(incidents.length === 3);
            done();
          });
        });

      });
    });

    describe('greaterThanOrEqual (>=)', function() {

      describe('integers', function() {

        /////////////////////////////////////////////////////
        // TEST SETUP
        ////////////////////////////////////////////////////

        var testName = 'greaterThanOrEqual test';
        var uid = uuid();

        before(function(done) {
          var incidents = [];

          for(var i=1; i<5; i++) {
            incidents.push({ description: testName, short_description: uid, severity: i });
          }

          Queryable.Incident.createEach(incidents, function(err) {
            if(err) return done(err);
            done();
          });
        });

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should return records with greaterThanOrEqual key', function(done) {
          Queryable.Incident.find({ description: testName, short_description: uid, severity: { greaterThanOrEqual: 1 }})
          .sort('severity')
          .exec(function(err, incidents) {
            assert(!err);
            assert(Array.isArray(incidents));
            assert(incidents.length === 4);
            assert(incidents[0].severity === 1);
            done();
          });
        });

        it('should return records with symbolic >=', function(done) {
          Queryable.Incident.find({ description: testName, short_description: uid, severity: { '>=': 1 }})
          .sort('severity')
          .exec(function(err, incidents) {
            assert(!err);
            assert(Array.isArray(incidents));
            assert(incidents.length === 4);
            assert(incidents[0].severity === 1);
            done();
          });
        });
      });

      describe('dates', function() {

        /////////////////////////////////////////////////////
        // TEST SETUP
        ////////////////////////////////////////////////////

        var testName = 'greaterThanOrEqual dates test';
        var uid = uuid();
        var start = new Date();
        var first;

        before(function(done) {
          var incidents = [];
          for(var i=0; i<3; i++) {
            incidents.push({description: testName + i, short_description: uid});
          }

          Queryable.Incident.createEach(incidents, function(err, incidents) {
            if(err) return done(err);
            first = incidents[0];
            done();
          });

        });

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should find 3 records created since this test started with symbolic >', function(done) {
          Queryable.Incident.find({ short_description: uid, sys_created_on: {'>=': start} }, function(err, incidents) {
            assert(!err);
            assert(Array.isArray(incidents));
            assert(incidents.length === 3);
            done();
          });
        });

        it('should find 3 records created since this test started with greaterThan key', function(done) {
          Queryable.Incident.find({ short_description: uid, sys_created_on: {greaterThanOrEqual: start} }, function(err, incidents) {
            assert(!err);
            assert(Array.isArray(incidents));
            assert(incidents.length === 3);
            done();
          });
        });

      });
    });

  });
});
