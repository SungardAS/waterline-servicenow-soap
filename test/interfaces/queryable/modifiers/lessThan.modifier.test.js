var assert = require('assert'),
    uuid = require('uuid'),
    moment = require('moment'),
    _ = require('lodash');

describe('Queryable Interface', function() {

  describe('Modifiers', function() {
    describe('lessThan (<)', function() {
      describe('integers', function() {

        var uid = uuid();

        /////////////////////////////////////////////////////
        // TEST SETUP
        ////////////////////////////////////////////////////

        var testName = 'lessThan test';

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

        it('should return records with lessThan key', function(done) {
          Queryable.Incident.find({ description: testName, short_description: uid, severity: { lessThan: 4 }})
          .sort('severity')
          .exec(function(err, incidents) {
            assert(!err);
            assert(Array.isArray(incidents));
            assert(incidents.length === 3);
            assert(incidents[0].severity === 1);
            done();
          });
        });

        it('should return records with symbolic <', function(done) {
          Queryable.Incident.find({ description: testName, short_description: uid, severity: { '<': 4 }})
          .sort('severity')
          .exec(function(err, incidents) {
            assert(!err);
            assert(Array.isArray(incidents));
            assert(incidents.length === 3);
            assert(incidents[0].severity === 1);
            done();
          });
        });
      });

      describe('dates', function() {

        /////////////////////////////////////////////////////
        // TEST SETUP
        ////////////////////////////////////////////////////

        var testName = 'lessThan dates test';

        var uid = uuid();
        var end = new Date(Date.now()+100000);

        before(function(done) {
          var incidents = [];
          for(var i=0; i<3; i++) {
            incidents.push({description: 'count_user' + i, short_description: uid});
          }

          Queryable.Incident.createEach(incidents, function(err, incidents) {
            if(err) return done(err);
            done();
          });

        });

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////
        it('should find 3 records created with symbolic <', function(done) {
          Queryable.Incident.find({ short_description: uid, sys_created_on: {'<': end} }, function(err, incidents) {
            assert(!err);
            assert(Array.isArray(incidents));
            assert(incidents.length === 3);
            done();
          });
        });

        it('should find 3 records created with lessThan key', function(done) {
          Queryable.Incident.find({ short_description: uid, sys_created_on: {lessThan: end} }, function(err, incidents) {
            assert(!err);
            assert(Array.isArray(incidents));
            assert(incidents.length === 3);
            done();
          });
        });

      });
    });

    describe('lessThanOrEqual (<=)', function() {

      describe('integers', function() {

        /////////////////////////////////////////////////////
        // TEST SETUP
        ////////////////////////////////////////////////////

        var testName = 'lessThanOrEqual test';
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

        it('should return records with lessThanOrEqual key', function(done) {
          Queryable.Incident.find({ description: testName, short_description: uid, severity: { lessThanOrEqual: 4 }})
          .sort('severity')
          .exec(function(err, incidents) {
            assert(!err);
            assert(Array.isArray(incidents));
            assert(incidents.length === 4);
            assert(incidents[0].severity === 1);
            done();
          });
        });

        it('should return records with symbolic usseverity <= usseverity', function(done) {
          Queryable.Incident.find({ description: testName, short_description: uid, severity: { '<=': 4 }})
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

        var testName = 'lessThanOrEqual dates test';
        var uid = uuid();
        var end;

        before(function(done) {
          var incidents = [];
          for(var i=0; i<3; i++) {
            incidents.push({description: testName + i, short_description: uid});
          }

          Queryable.Incident.createEach(incidents, function(err, incidents) {
            if(err) return done(err);
            Queryable.Incident.findOne(incidents[2].sys_id).exec(function(err, incident) {
              end = incident.sys_created_on;
              console.log(end);
              done();
            });
          });

        });

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        it('should find 3 records with symbolic <', function(done) {
          console.log(end);
          Queryable.Incident.find({ short_description: uid, sys_created_on: {'<=': end} }, function(err, incidents) {
            assert(!err);
            assert(Array.isArray(incidents));
            assert(incidents.length === 3);
            done();
          });
        });

        it('should find 3 records with lessThan key', function(done) {
          Queryable.Incident.find({ short_description: uid, sys_created_on: {lessThanOrEqual: end} }, function(err, incidents) {
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
