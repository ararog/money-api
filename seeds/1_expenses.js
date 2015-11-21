var Category = require('../models/category')
var faker = require('faker');

require('useful-date');
require( 'useful-date/locale/en-US.js' );

exports.seed = function(knex, Promise) {

    Date.localize( 'en-US' );

    inserts = []

    selectForInsert = Category.query()
    .reduce(function(memo, row) {
        memo.ids.push(row.id);
        return memo;
    }, {ids: []})
    .then(function(data) {

        for(i = 1; i <= 50; i++) {

            index = Math.floor(Math.random() * (5 - 1)) + 1;

            month = Math.floor(Math.random() * (7 - 1)) + 1;

            var date = new Date;
            if(month > 1)
                date.adjust(Date.MONTH, (month - 1) * -1);

            done = date.diff(new Date).tense != 0

            expense = { user_id: 1,
                category_id: data.ids[index - 1],
                description: faker.lorem.sentence(),
                comment: faker.lorem.paragraph(),
                amount: faker.finance.amount(),
                done: done,
                created_at: date.format('Y-m-d H:i:s')}

            inserts.push(expense)
        }
    });

    return Promise.join(
        knex('expenses').del(),
        selectForInsert,
        knex('expenses').insert(inserts));
};
