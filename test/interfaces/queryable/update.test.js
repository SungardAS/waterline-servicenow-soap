/* @annotation:tour unitTest */

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
        { description: 'lorem epson 1', short_description: uid },
        { description: 'lorem epson 2', short_description: uid },
        { description: 'lorem epson 3', short_description: uid  }  
      ];

      Queryable.Incident.createEach(incidentsArray, function(err, incidents) {
        if(err) return done(err);
        done();
      });
    });

    describe('.update()', function() {
      
      /**
       * 
       * find 
       * update 
       * assert true
       * 
       **/  
                
      it('should get a record and update it', function(done) {
        Queryable.Incident.findOne({ description: 'lorem epson 1', short_description: uid }, function(err, incident) {
          assert(incident.sys_id);
          assert(incident.description === 'lorem epson 1');
          assert(toString.call(incident.sys_updated_on) == '[object Date]');
          done();
        });
      });
        
    });      
  });
});
