var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './dev.sqlite3'
    }
});

exports.bookshelf = require('bookshelf')(knex);
