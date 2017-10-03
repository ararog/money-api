var jwt = require('jsonwebtoken');
var User = require('../models/user')

exports.authenticate = function (req, res, next) {

    console.log('Authenticating user...')

    User.where({ email: req.params.email, password: req.params.password }).fetch().then(function(user) {
        var token = jwt.sign({ id: user.get('id') }, new Buffer('money4nothing2feed', 'base64'))
        res.send({ auth_token: token})
    }).catch(function(err) {
      console.log(err)
        res.send(403, { error: 'Invalid username or password' })
    });

    next();
}
