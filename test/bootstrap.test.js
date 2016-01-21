var Sails = require('sails'),
  sails;

before(function(done) {
  // Increase the Mocha timeout so that Sails has enough time to lift.
  this.timeout(5000);

  var testConfig = {
    environment: 'test',
    port: 1337,
    log: {
      level: 'error'
    },
    connections: {
      testDB: {
        adapter: 'sails-disk'
      }
    },
    connection: 'testDB',

    //wipe/drop ALL my data and rebuild models every time
    migrate: 'drop'
  };

  Sails.lift(testConfig, function(err, server) {
    sails = server;

    if (err) return done(err);
    // here you can load fixtures, etc.
    done(err, sails);
  });
});

after(function(done) {
  // here you can clear fixtures, etc.
  Sails.lower(done);
});
