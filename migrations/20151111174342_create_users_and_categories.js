
exports.up = function(knex, Promise) {

    return knex.schema.createTable('users', function (table) {
        table.increments();
        table.string('email');
        table.string('username');
        table.string('password');
        table.timestamps();
    })
    .createTable('categories', function (table) {
        table.increments();
        table.string('name');
        table.timestamps();
    })
};

exports.down = function(knex, Promise) {

    return knex.schema
    .dropTable('users')
    .dropTable('categories')
};
