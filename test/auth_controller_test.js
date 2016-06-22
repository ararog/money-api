var restify = require('restify')
var md5 = require('md5')
var User = require('../models/user')

// init the test client
var client = restify.createJsonClient({
  version: '*',
  url: 'http://127.0.0.1:8080'
});

describe('auth', function() {
  describe('perform authentication', function() {
    it('should get a 200 response', function(done) {
      new User({email: 'rogerio.araujo@gmail.com', password: md5('123456')}})
          .save()
          .then(function(model) {
            client.post('/api/auth', { email: 'rogerio.araujo@gmail.com', password: md5('123456') }, function(err, req, res, data) {
                if (err) {
                    throw new Error(err);
                }
                else {
                    if (res.statusCode != 200) {
                        throw new Error('invalid response from /api/auth');
                    }
                    done();
                }
            });
          })
          .catch(function(err) {
              res.send(500, { error: 'Could not insert data' })
          });
    });
  });
});
