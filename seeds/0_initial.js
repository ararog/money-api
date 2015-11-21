var md5 = require('md5')

exports.seed = function(knex, Promise) {
    return Promise.join(
        knex('users').del(),
        knex('users').insert({id: 1, email: 'rogerio.araujo@gmail.com', password: md5('1978@rpa')}),

        knex('categories').del(),
        knex('categories').insert({name: 'Food'}),
        knex('categories').insert({name: 'Home'}),
        knex('categories').insert({name: 'Health'}),
        knex('categories').insert({name: 'Education'})
    );
};
