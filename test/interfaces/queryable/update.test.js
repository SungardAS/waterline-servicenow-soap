var assert = require('assert'),
    uuid = require('uuid'),
    _ = require('lodash');

describe('Update Interface', function() {

  describe('lorem epson', function() {
    var uid = uuid();

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    before(function(done) {

      var incidentsArray = [
        { description: 'tHeTest', short_description: uid },
        { description: 'thetest', short_description: uid },
        { description: 'THETEST', short_description: uid  },
        { description: 'tHeOtherTest', short_description: uid  }
      ];

      Queryable.Incident.createEach(incidentsArray, function(err, incidents) {
        if(err) return done(err);
        done();
      });
    });

    describe('.update()', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should work in a case insensitve fashion by default', function(done) {
        Queryable.Incident.find({short_description: uid}, function(err, incidents) {
          assert(incidents.length === 4);
          assert(incidents[0].sys_id);
          done();
        });
      });
    });

    describe('.foo()', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should work in a case insensitve fashion by default', function(done) {
        Queryable.Incident.find({short_description: uid}, function(err, incidents) {
          assert(incidents.length === 4);
          assert(incidents[0].sys_id);
          done();
        });
      });
    });

      
  });
});
