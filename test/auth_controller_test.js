var restify = require('restify')
var md5 = require('md5')
// init the test client
var client = restify.createJsonClient({
    version: '*',
    url: 'http://127.0.0.1:8080'
});

describe('auth', function() {

    // Test #1
    describe('perform authentication', function() {
        it('should get a 200 response', function(done) {
            client.post('/api/auth', { email: 'rogerio.araujo@gmail.com', password: md5('') }, function(err, req, res, data) {
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
        });
    });
});
