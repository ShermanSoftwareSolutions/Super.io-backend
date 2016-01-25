var Sails = require('sails'),
  sails;

before(function(done) {
  // Increase the Mocha timeout so that Sails has enough time to lift.
  this.timeout(10000);

  var testConfig = {
    environment: 'test',
    port: 1337,
    log: {
      level: 'error'
    },
    models: {
      migrate: 'drop',
      connection: 'testDB'
    },
    connections: {
      testDB: {
        adapter: 'sails-disk'
      }
    }
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
