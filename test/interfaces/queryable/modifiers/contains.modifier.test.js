var assert = require('assert'),
    uuid = require('uuid'),
    _ = require('lodash');

describe('Queryable Interface', function() {

  describe('Modifiers', function() {
    describe('contains', function() {
      describe('shorthand', function() {

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////
        var uid = uuid();

/* TODO
 *        it('should return the user with the correct name', function(done) {
 *          var part = 'short_'+uid,
 *              testName = 'short_'+uid+' contains query test';
 *
 *          Queryable.Incident.create({ short_description: testName }, function(err) {
 *            if(err) return done(err);
 *
 *            Queryable.Incident.contains({ short_description: part }, function(err, incidents) {
 *              console.log(incidents);
 *              assert(!err);
 *              assert(Array.isArray(incidents));
 *              assert(incidents.length === 1);
 *              assert(incidents[0].short_description === testName);
 *              done();
 *            });
 *          });
 *        });
 */
      });

      describe('full where criteria', function() {

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////
        //
        var uid = uuid();

        it('should return the user with the correct name', function(done) {
          var part = 'long_'+uid,
              testName = 'long_'+uid+' contains query test';

          Queryable.Incident.create({ short_description: testName }, function(err) {
            if(err) return done(err);

            Queryable.Incident.where({ short_description: { contains: part }}, function(err, incidents) {
              assert(!err);
              assert(Array.isArray(incidents));
              assert(incidents.length === 1);
              assert(incidents[0].short_description === testName);
              done();
            });
          });
        });
      });

      describe('dynamic attribute', function() {

        /////////////////////////////////////////////////////
        // TEST METHODS
        ////////////////////////////////////////////////////

        var uid = uuid();
/* TODO
 *        it('should have [attribute]contains() method', function(done) {
 *          var part = uid,
 *              testType = 'Dynamic Contains test' + part + 'test';
 *
 *          Queryable.Incident.create({ short_description: testType }, function(err) {
 *            if(err) return done(err);
 *
 *            Queryable.Incident.short_descriptionContains(part, function(err, incidents) {
 *              assert(!err);
 *              assert(Array.isArray(incidents));
 *              assert(incidents.length === 1);
 *              assert(incidents[0].type === testType);
 *              done();
 *            });
 *          });
 *        });
 */
      });

    });
  });
});
