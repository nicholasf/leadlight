Leadlight - a lightweight data framework for Node.js.

![img](https://raw.github.com/nicholasf/leadlight/master/Karlstads_domkyrka_window_straight.JPG)

Wrap *any* persistence system with domain model functionality.

This means:

(1) a way of mapping data from the native format (e.g. relational data, json data) to the domain model (application level mapped objects) that can flexibly handle domain model relations (assembly of objects related by domain meaning without hitting the n+1 problem).

(2) a typical model/active record lifecycle that can include validation and spawn events


### Rationale 

Problem with existing solutions:
* ORMs have not been very successful in the Node space. 
* ORMs have trouble adjusting to different types of databases (nosql)

### Objective 

Create a 'light approach' to building abstractions above databases. Work on abstractions that can model data at an application level but push developer work toward the integration with the database. 

A developer should be able to meaningfully describe the domain level using familiar ORM like phrases - 'models', 'has many', 'validation', etc. - but the queries themselves will have to be configured or handwritten to suit the environment.


A README to build a description of the DSL and features is below.

## Models

```
//names are passed into the Model definition so these models can be rebuilt wherever
var Person  = new Model('Person', 'db_collection_mapping'); 
//in another file, etc.
var Person = require('LDF').models['Person'];
```
Fields on a model need to 

* have a name corresponding with a field in the db, to allow value mapping
* have ordered arrays of lifecycle functions 

For example:
```
Person.fields.push('email'); 

//this means that building the object will rely on correspondence between 'email' on the person 
// instance and 'email' in the data sent from the db.

Person.email.validations.push(
    'Email must be a valid email address!', 
    function(email){ ... //validates format of email }
);
```

This would play out as:

```
var person = new Person();
person.email = "nicholasf.gmail.com";
persona.save(function(err, person) {
    console.log(err);
});

> 'Email must be a valid email address!'

person.email = "nicholasf@gmail.com";
person.save(function(err, person) {
    console.log(result);
})

> Person[id: 1, email: 'nicholasf@gmail.com']; 

```

## General Behaviours and DB specific Handlers

The model defines a set of standard behaviours - find, create, save, destroy.
```
Person.find( { id: n })
Person.find( { ids: [n] } ) 
Person.find( { query: "..." } ) 
```

By themselves these, however, do nothing but call an underlying handler which can be crafted to fit application and database needs.

For example:

```
Person.behaviours = require('postgres-finders');
Person.behaviours = require('riak-finders');

function findHandler(args) {
    console.log(args);
    //SQL, Riak call, etc., made here
}
> { id: 1, with: [House] }

```
(I need to list the behaviours above.)


## Model Relationships, the n+1 problem

To avoid the n+1 problem, LDF will allow handcrafted queries in the handlers which can be overridden at a fine grained level.

In this example Person and House are models. A Person can have many Houses.

```
var Person  = new Model('Person', 'db_collection_mapping'); 
var House   = new Model('House', 'db_collection_mapping');

Person.has.push(House); //use arrays so multiple assignments can be made at once
House.belongsTo.push(Person);

Person.find( { id: n, with: ['House'] })

```

The underlying handler would decide how to return a person with a house. This would involve

* the query to the db
* the assembly of the object

The handler would then need to be able to insert data into the Person model and ensure that it's validations, etc. are meant. 


TODO:

* define Model lifecycles and events - validate, save, create, destroy
* define handlers - map out some basic ones
* think of a good name for the project, perhaps something to do with 'light'.
* represent Transactions at a Model level


