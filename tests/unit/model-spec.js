var expect      = require('chai').expect,
    leadlight   = require('./../../').scheme('test'),
    Model       = leadlight.Model;

var memoryDB    = {};
memoryDB.people = {
    1: { name: 'fred' }
}

leadlight.on('ll_find', function(args) {
    if (args.collection === 'people') {
        var person = memoryDB.people[args.id];
        leadlight.emit('ll_find_reply', person);
    }
});


describe('Model behaviours', function(){
    var Person;

    beforeEach(function() {
        Person = new Model('Person', 'people');
    });

    it('finds a person', function(done){
        var person;
        Person.find( { id: 1 }, function(err, person) {
            expect(person).to.be.ok;
            done();
        });
    });
});