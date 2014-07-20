var assert = require('assert'),
    _ = require('lodash');

describe('Queryable Interface', function() {

  describe('count()', function() {

    /////////////////////////////////////////////////////
    // TEST SETUP
    ////////////////////////////////////////////////////

    // Start with an known database state to accurately test count
    before(function(done) {
      //Queryable.Incident.destroy(function(err) {
        //if(err) return done(err);

        //// Insert 10 Incidents
        //var users = [];
        //for(var i=0; i<10; i++) {
          //users.push({first_name: 'count_user' + i, type: 'count'});
        //}

        //Queryable.Incident.createEach(users, function(err, users) {
          //if(err) return done(err);
          //done();
        //});
      //});
    });

    /////////////////////////////////////////////////////
    // TEST METHODS
    ////////////////////////////////////////////////////

    it('should accurately count records', function(done) {
      Queryable.Incident.count({ type: 'count' }, function(err, count) {
        assert(!err);
        assert(count > 10);
        done();
      });
    });

    it('should work with dynamic finders', function(done) {
      Queryable.Incident.countByType('count', function(err, count) {
        assert(!err);
        assert(count > 10);
        done();
      });
    });

  });
});
