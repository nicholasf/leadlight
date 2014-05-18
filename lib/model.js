module.exports = function(leadlight){

    var Model = function(name, collection) {

        this.name        = name;
        this.collection  = collection;

        //behaviours - find, destroy, create, save, validate
        this.find        = find;
    }

    var find = function find(args, cb) {
        var eventName   = 'll_find'; 
        var eventReply  = 'll_find_reply'
        var eventError  = 'll_find_error'; 

        args.collection = this.collection; 

        var receiver = function(record) {
            leadlight.removeListener(eventError, errorHandler);
            cb(null, record);
        }

        var errorHandler = function(err) {
            leadlight.removeListener(eventName, receiver);
            cb(err);
        };

        leadlight.once(eventError, errorHandler);
        leadlight.once(eventName, receiver);

        leadlight.emit(eventName, args);
    };

    Model.create    = function create(args) {}; 
    Model.destroy   = function destroy(args) {}; 
    Model.save      = function save(args) {}; 
    Model.validate  = function validate(args) {}; 

    return Model;
};