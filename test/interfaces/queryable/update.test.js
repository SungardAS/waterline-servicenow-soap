/* @annotation:tour unitTest */

var assert = require('assert'),
    uuid = require('uuid'),
    _ = require('lodash');

describe('Update Interface', function() {

  describe('update', function() {
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
	   * http://wiki.servicenow.com/index.php?title=Getting_Started_with_REST#Update_the_Incident
	   *
	   * <xsd:element maxOccurs="1" minOccurs="1" name="short_description" type="xsd:string"/>
	   * <xsd:element maxOccurs="1" minOccurs="1" name="sys_id" type="xsd:string"/>
	   * <xsd:element maxOccurs="1" minOccurs="1" name="company" type="xsd:string"/>
	   * <xsd:element maxOccurs="1" minOccurs="1" name="caller_id" type="xsd:string"/>
	   * <xsd:element maxOccurs="1" minOccurs="1" name="u_task_for" type="xsd:string"/>
	   * <xsd:element maxOccurs="1" minOccurs="1" name="u_task_table" type="xsd:string"/>
       **/

      it('should get a record and update the description', function(done) {
        Queryable.Incident.findOne({ description: 'lorem epson 1', short_description: uid }, function(err, incident) {
          incident.description = "updated description 2";
            incident.save(function(err,inc){
          		assert(inc.sys_id);
          		assert(inc.description === 'updated description 2');
          		assert(toString.call(inc.sys_updated_on) == '[object Date]');
          		done();
            });
        });
      });
    });
  });
});
