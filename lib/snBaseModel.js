module.exports = {
  autoPk: false,
  autoUpdatedAt: false,
  autoCreatedAt: false,

  attributes: {
    toJSON: function() {
      var self = this;
      var obj = this.toObject();
      _.each(_.pairs(obj), function(keyVal) {
        if (_.isEmpty(keyVal[1]))
          obj[keyVal[0]] = null;
      });
      return obj;
    },
  }
};
