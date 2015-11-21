
exports.up = function(knex, Promise) {

    return knex.schema.createTable('expenses', function (table) {
        table.increments();
        table.string('description');
        table.decimal('amount');
        table.string('comment');
        table.integer('user_id').references('users.id')
        table.integer('category_id').references('categories.id')
        table.timestamps();
    })
};

exports.down = function(knex, Promise) {

    return knex.schema
    .dropTable('expenses')

};
