var database = require('../common/database')

module.exports = database.bookshelf.Model.extend({
    tableName: 'categories'
});
