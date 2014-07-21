var assert = require('assert'),
    uuid = require('uuid'),
    _ = require('lodash');

describe('Queryable Interface', function() {

  describe('case insensitive', function() {
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

    describe('.findOne()', function() {

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should work in a case insensitve fashion by default', function(done) {
        Queryable.Incident.findOne({ description: 'theothertest', short_description: uid }, function(err, incident) {
          assert(incident.sys_id);
          assert(incident.description === 'tHeOtherTest');
          assert(toString.call(incident.sys_updated_on) == '[object Date]');
          done();
        });
      });

      it('should work with findOneBy*()', function(done) {
        Queryable.Incident.findOneByDescription('theothertest', function(err, incident) {
          assert(incident.sys_id);
          assert(incident.description === 'tHeOtherTest');
          assert(toString.call(incident.sys_updated_on) == '[object Date]');
          done();
        });
      });

    });

    describe('.find()', function() {

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

      it('should work with findBy*()', function(done) {
        Queryable.Incident.findByShort_description(uid)
        .sort('number')
        .exec(function(err, incidents) {
          console.log(incidents);
          assert(incidents.length === 4);
          assert(incidents[0].sys_id);
          assert(incidents[0].description === 'tHeTest');
          done();
        });
      });

    });

    describe('special classified queries', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      before(function(done) {

        var incidentsArray = [
          { description: 'OTHER THINGS 0', short_description: uid },
          { description: 'OTHER THINGS 1', short_description: uid },
          { description: 'AR)H$daxx', short_description: uid },
          { description: 'AR)H$daxxy', short_description: uid },
          { description: '0n3 m0r3 est', short_description: uid }
        ];

        Queryable.Incident.createEach(incidentsArray, function(err, incidents) {
          if(err) return done(err);
          done();
        });
      });

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('contains should work in a case insensitive fashion by default', function(done) {
        Queryable.Incident.find({ description: { contains: 'hete'}, short_description: uid })
        .sort('number')
        .exec(function(err, incidents) {
          assert(incidents.length === 3);
          assert(incidents[0].sys_id);
          assert(incidents[0].description === 'tHeTest');
          done();
        });
      });

      it('startsWith should work in a case insensitive fashion by default', function(done) {
        Queryable.Incident.find({ description: { startsWith: 'the'}, short_description: uid })
        .sort('number')
        .exec(function(err, incidents) {
          assert(incidents.length === 4);
          assert(incidents[0].sys_id);
          assert(incidents[0].description === 'tHeTest');
          done();
        });
      });

      it('endsWith should work in a case insensitive fashion by default', function(done) {
        Queryable.Incident.find({ description: { endsWith: 'est'}, short_description: uid })
        .sort('number')
        .exec(function(err, incidents) {
          assert(incidents.length === 5);
          assert(incidents[0].sys_id);
          assert(incidents[0].description === 'tHeTest');
          done();
        });
      });

      // TODO is there a 'like' query for ServiceNow?
      //it('like should work in a case insensitive fashion by default', function(done) {
        //Queryable.Incident.find({ description: { like: '%hete%'}, short_description: uid }, function(err, incidents) {
          //assert(incidents.length === 3);
          //assert(incidents[0].sys_id);
          //assert(incidents[0].description === 'tHeTest');
          //done();
        //});
      //});

      it('endsWith should actually enforce endswith', function(done) {
        Queryable.Incident.find({ description: { endsWith: 'AR)H$daxx'}, short_description: uid })
        .sort('number')
        .exec(function(err, incidents) {
          assert(incidents.length === 1);
          assert(incidents[0].sys_id);
          assert(incidents[0].description === 'AR)H$daxx');
          done();
        });
      });

    });

    describe('special characters', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      before(function(done) {

        var incidentsArray = [
          { description: '****Awesome****', short_description: uid }
        ];

        Queryable.Incident.createEach(incidentsArray, function(err, incidents) {
          if(err) return done(err);
          done();
        });
      });

      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should escape stars', function(done) {
        Queryable.Incident.find({ description: '****Awesome****', short_description: uid })
        .sort('number')
        .exec(function(err, incidents) {
          assert(incidents.length === 1);
          assert(incidents[0].sys_id);
          assert(incidents[0].description === '****Awesome****');
          done();
        });
      });

      it('contains should work with stars in the name', function(done) {
        Queryable.Incident.find({ description: { contains: '**Awesome**'}, short_description: uid })
        .sort('number')
        .exec(function(err, incidents) {
          assert(incidents.length === 1);
          assert(incidents[0].sys_id);
          assert(incidents[0].description === '****Awesome****');
          done();
        });
      });
    });

  });
});
