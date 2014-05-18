var events  = require('events'),
    schemes = {};

exports.scheme = function(scheme) {
    var leadlight       = new events.EventEmitter();
    leadlight.Model     = require('./lib/model')(leadlight);
    schemes[scheme]     = leadlight;
    return leadlight;
}