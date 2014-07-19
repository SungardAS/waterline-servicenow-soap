var TypeCast = require('waterline/lib/waterline/core/typecast'),
    _ = require('lodash'),
    util = require('util');


var Deflate = function() {
  return TypeCast.call(this);
};

util.inherits(Deflate, TypeCast);

Deflate.prototype.date = function date(value) {
  var _value;
  var mDate = moment.utc(value);

  if (mDate.isValid()) {
    _value = mDate.format('YYYY-MM-DD HH:mm:ss');
  }
  else {
    _value = value;
  }

  return _value;
};


module.exports = Deflate;

