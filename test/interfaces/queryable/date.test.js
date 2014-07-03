var assert = require('assert'),
    uuid = require('uuid'),
    moment = require('moment'),
    _ = require('lodash');

describe('Queryable Interface', function() {

  describe('queryByDate', function() {

    var start = moment.utc();
    var uid = uuid();

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    // Start with an known database state to accurately test count
    before(function(done) {
      // Insert 10 Incidents
      var incidents = [];
      for(var i=0; i<10; i++) {
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

    it('should not find records before the time this test started', function(done) {
      Queryable.Incident.find({ short_description: uid, sys_created_on: {'<': start.toDate()} }, function(err, incidents) {
        assert(!err);
        assert(incidents.length === 0);
        done();
      });
    });

    it('should find 10 records created since this test started', function(done) {
      Queryable.Incident.find({ short_description: uid, sys_created_on: {'>': start.toDate()} }, function(err, incidents) {
        assert(!err);
        assert(incidents.length === 10);
        done();
      });
    });

  });
});
