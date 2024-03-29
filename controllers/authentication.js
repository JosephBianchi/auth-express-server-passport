const jwt = require('jwt-simple');
const config = require('../config');
const User = require('../models/user');

const tokenForUser = (user) => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}

exports.signin = function(req, res, next) {
  res.send({ token: tokenForUser(req.user) })
}

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({
      error: 'You must provide an email and password'
    })
  }

  // see if a user with a given email exists
  User.findOne({ email: email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }

    // if a user with email does exist, return an error
    if (existingUser) {
      return res.status(422).send({ error: 'email is in use' });
    }

    // if a user with email does not include exist, create and save user record
    const user = new User({
      email: email,
      password: password
    });

    // respond to request indicating the user was created
    user.save((err) => {
      if (err) {
        return next(err);
      }
      res.json({ token: tokenForUser(user) });
    });
  })
}
