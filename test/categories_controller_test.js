var restify = require('restify')
var jwt = require('jsonwebtoken')
var assert = require('assert')

var client = restify.createJsonClient({
    version: '*',
    url: 'http://127.0.0.1:8080'
});

var token = jwt.sign({ id: 1 }, new Buffer('money4nothing2feed', 'base64'))

describe('categories', function() {

    describe('load categories', function() {
        it('should load 4 categories', function(done) {
            options = {
              path: '/api/categories',
              headers: {
                'Authorization': 'Bearer ' + token
              }
            }
            client.get(options, function(err, req, res, data) {
                if (err) {
                    throw new Error(err);
                }
                else {
                    if (res.statusCode != 200) {
                        throw new Error('invalid response from /api/categories');
                    }
                    else {
                      assert.equal(data.length, 4)
                    }
                    done();
                }
            });
        });
    });
});
