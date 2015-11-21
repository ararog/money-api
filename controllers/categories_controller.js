var Category = require('../models/category')

exports.categories = function (req, res, next) {

    console.log('Loading categories')

    Category.fetchAll().then(function(categories) {
        res.send(categories.toJSON())
    }).catch(function(err) {
        res.send(500, { error: 'Error while loading data' })
    });

    next();
}
