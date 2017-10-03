var Expense = require('../models/expense')

exports.expenses = function (req, res, next) {

		console.log(req.params)
		console.log(req.query)
		page = req.params.page || 1

    console.log('Loading expenses from user ' + req.user.id + ' at page ' + page)

    Expense
    .query('where', 'user_id', '=', req.user.id)
    .count('id')
    .then(function(count) {
				if(count == 0) {
					results = {
							total: 0,
							items: []
					}
					res.send(results)
				}
				else {
	        Expense
	        .query(function (qb) {
	            qb.where('user_id', '=', req.user.id)
	            .limit(10)
	            .offset((page - 1) * 10)
	        })
	        .fetchAll()
	        .then(function(data) {
	            results = {
	                total: count,
	                items: data.toJSON()
	            }
	            res.send(results)
	        }).catch(function(err) {
	            res.send(500, { error: 'Error while loading data' })
	        });
				}
    });

		next();
}

exports.overview = function (req, res, next) {

    console.log('Loading expenses overview')

    Expense
    .query()
    .select('categories.name')
    .innerJoin('categories', 'expenses.category_id', 'categories.id')
    .where('expenses.done', '=', false)
    .sum('expenses.amount as total')
    .groupBy('categories.name')
    .then(function(pendingExpenses) {

        Expense
        .query()
        .select('categories.name')
        .innerJoin('categories', 'expenses.category_id', 'categories.id')
        .where(function() {
            this
            .where('expenses.created_at', '>=', 'date(\'now\', \'-6 month\')')
            .orWhere('expenses.created_at', '<=', 'date(\'now\')')
        })
        .andWhere('expenses.done', '=', true)
        .sum('expenses.amount as total')
        .groupBy('categories.name')
        .then(function(lastMonthsExpenses) {

            res.send({
                pending: pendingExpenses,
                lastMonths: lastMonthsExpenses
            })
        });

    }).catch(function(err) {
        res.send(404, { error: 'No overview data found' })
    });

    next();
}

exports.load_expense = function (req, res, next) {

    console.log('Loading expense with id ' + req.params.id)

    Expense.where('id', req.params.id)
    .fetch()
    .then(function(expenses) {
        res.send(expenses.toJSON())
    }).catch(function(err) {
        res.send(404, { error: 'Expense not found' })
    });

    next();
}

exports.delete_expense = function (req, res, next) {

    console.log('Deleting expense with id ' + req.params.id)

    new Expense({id: req.params.id})
        .destroy()
        .then(function(model) {
            res.send(200)
        })
        .catch(function(err) {
            res.send(500, { error: 'Could not delete data' })
        });

    next();
}

exports.update_expense = function (req, res, next) {

    console.log('Updating expense with id ' + req.params.id)

    var data = {
        id: req.params.id,
        user_id: req.user.id,
        category_id: req.params.category_id,
        description: req.params.description,
        amount: req.params.amount,
        comment: req.params.comment
    }

    new Expense(data)
        .save()
        .then(function(model) {
            res.send(model.toJSON())
        })
        .catch(function(err) {
            res.send(500, { error: 'Could not update data' })
        });

    next();
}

exports.insert_expense = function (req, res, next) {

    console.log('Adding new expense')

    var data = {
        user_id: req.user.id,
        category_id: req.params.category_id,
        description: req.params.description,
        amount: req.params.amount,
        comment: req.params.comment
    }

    new Expense(data)
        .save()
        .then(function(model) {
            res.send(model.toJSON())
        })
        .catch(function(err) {
            res.send(500, { error: 'Could not insert data' })
        });

    next();
}
