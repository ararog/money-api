var restify = require('restify')
var jwt = require('jsonwebtoken')
var assert = require('assert')
var faker = require('faker');
var chai = require('chai')
  , expect = chai.expect
  , should = chai.should();

var Expense = require('../models/expense')

var client = restify.createJsonClient({
    version: '*',
    url: 'http://127.0.0.1:8080'
});

var token = jwt.sign({ id: 1 }, new Buffer('money4nothing2feed', 'base64'))

describe('expenses', function() {

    describe('paginate expenses', function() {
        it('should load 10 expenses', function(done) {
            options = {
                path: '/api/expenses?page=1',
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
                        throw new Error('invalid response from /api/expenses');
                    }
                    else {
                        data.items.should.have.length(10)
                    }
                    done();
                }
            });
        });
    });

    describe('manage expenses', function() {
        it('should load 1 expense', function(done) {
            data = { user_id: 1,
                category_id: 1,
                description: faker.lorem.sentence(),
                comment: faker.lorem.paragraph(),
                amount: faker.finance.amount() }

                new Expense(data).save().then(function(model) {

                    options = {
                        path: '/api/expenses/' + model.id,
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
                                throw new Error('invalid response from /api/expenses/1');
                            }
                            else {
                                data.id.should.equal(model.id)
                            }
                            done();
                        }
                    });
                });
            });
        });

    describe('expenses overview', function() {
        it('should have overview entries', function(done) {

            options = {
                path: '/api/expenses/overview',
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
                        throw new Error('invalid response from /api/expenses/overview');
                    }
                    else {
                        console.log(data)
                        should.exist(data)
                    }
                    done();
                }
            });
        });
    });
});
