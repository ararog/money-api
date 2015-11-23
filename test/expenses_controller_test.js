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
            var insertData = { user_id: 1,
                category_id: 1,
                description: faker.lorem.sentence(),
                comment: faker.lorem.paragraph(),
                amount: faker.finance.amount() }

            new Expense(insertData).save().then(function(model) {

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
                            model.id.should.equal(data.id)
                        }
                        done();
                    }
                });
            });
        });

        it('should delete 1 expense', function(done) {
            var insertData = { user_id: 1,
                category_id: 1,
                description: faker.lorem.sentence(),
                comment: faker.lorem.paragraph(),
                amount: faker.finance.amount() }

            new Expense(insertData).save().then(function(model) {

                options = {
                    path: '/api/expenses/' + model.id,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }

                client.del(options, function(err, req, res, data) {
                    if (err) {
                        throw new Error(err);
                    }
                    else {
                        if (res.statusCode != 200) {
                            throw new Error('invalid response from /api/expenses/1');
                        }
                        done();
                    }
                });
            });
        });

        it('should update 1 expense', function(done) {
            var insertData = { user_id: 1,
                category_id: 1,
                description: faker.lorem.sentence(),
                comment: faker.lorem.paragraph(),
                amount: faker.finance.amount() }

            new Expense(insertData).save().then(function(model) {

                var updateData = {
                    user_id: 1,
                    category_id: 1,
                    description: faker.lorem.sentence(),
                    comment: faker.lorem.paragraph(),
                    amount: faker.finance.amount()
                },

                options = {
                    path: '/api/expenses/' + model.id,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }

                client.put(options, updateData, function(err, req, res, outData) {
                    if (err) {
                        throw new Error(err);
                    }
                    else {
                        if (res.statusCode != 200) {
                            throw new Error('invalid response from /api/expenses/1');
                        }
                        else {
                            updateData.user_id.should.equal(outData.user_id)
                            updateData.category_id.should.equal(outData.category_id)
                            updateData.description.should.equal(outData.description)
                            updateData.comment.should.equal(outData.comment)
                            updateData.amount.should.equal(outData.amount)
                        }
                        done();
                    }
                });
            });
        });

        it('should insert 1 expense', function(done) {
            var insertData = { user_id: 1,
                category_id: 1,
                description: faker.lorem.sentence(),
                comment: faker.lorem.paragraph(),
                amount: faker.finance.amount() }

            options = {
                path: '/api/expenses',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }

            client.post(options, insertData, function(err, req, res, outData) {
                if (err) {
                    throw new Error(err);
                }
                else {
                    if (res.statusCode != 200) {
                        throw new Error('invalid response from /api/expenses/1');
                    }
                    else {
                        insertData.user_id.should.equal(outData.user_id)
                        insertData.category_id.should.equal(outData.category_id)
                        insertData.description.should.equal(outData.description)
                        insertData.comment.should.equal(outData.comment)
                        insertData.amount.should.equal(outData.amount)
                    }
                    done();
                }
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
                        should.exist(data)
                    }
                    done();
                }
            });
        });
    });
});
