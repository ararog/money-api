
exports.up = function(knex, Promise) {

    return knex.schema.table('expenses', function (table) {
        table.boolean('done').defaultTo(false) ;
    })
};

exports.down = function(knex, Promise) {

    return knex.schema.table('expenses', function (table) {
        table.dropColumn('done');
    })
};
