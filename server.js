var restify = require('restify');
var jwt = require('restify-jwt');
var bunyan = require('bunyan');
var auth_controller = require('./controllers/auth_controller.js')
var expenses_controller = require('./controllers/expenses_controller.js')
var categories_controller = require('./controllers/categories_controller.js')

var server = restify.createServer();

server.use(restify.bodyParser());
server.use(restify.queryParser());

server.use(jwt({ secret: new Buffer('money4nothing2feed', 'base64')}).unless({ path: [{ url: '/api/auth', methods: ['OPTIONS', 'POST'] }]}));

restify.CORS.ALLOW_HEADERS.push('authorization');

server.use(restify.CORS());

server.on('after', restify.auditLogger({
  log: bunyan.createLogger({
    name: 'audit',
    stream: process.stdout
  })
}));

server.on('UnauthorizedError', function (req, res, err, cb) {
  err.body = { error: 'Not Authorized' };
  return cb();
});

server.post({ path:'/api/auth', version: '1.0.0' }, auth_controller.authenticate);
server.get({ path:'/api/expenses/overview', version: '1.0.0' }, expenses_controller.overview);
server.get({ path:'/api/expenses', version: '1.0.0' }, expenses_controller.expenses);
server.get({ path:'/api/expenses/:id', version: '1.0.0' }, expenses_controller.load_expense);
server.del({ path:'/api/expenses/:id', version: '1.0.0' }, expenses_controller.delete_expense);
server.put({ path:'/api/expenses/:id', version: '1.0.0' }, expenses_controller.update_expense);
server.post({ path:'/api/expenses', version: '1.0.0' }, expenses_controller.insert_expense);
server.get({ path:'/api/categories', version: '1.0.0' }, categories_controller.categories);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
