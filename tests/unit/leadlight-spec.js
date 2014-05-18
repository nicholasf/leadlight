var expect      = require('chai').expect,
    leadlight   = require('./../../');

describe('leadlight can scope to different databases', function() {

    it('returns an event emitter scoped to the scheme', function(){
        var db1Leadlight = leadlight.scheme('db1');
        expect(db1Leadlight).to.be.ok;        
    });
});
