var passport = require('koa-passport')
var LocalStrategy = require('passport-local').Strategy

exports.setup = function (User, config) {
  passport.use(new LocalStrategy({
    usernameField: 'name',
    passwordField: 'pwd' // this is the virtual field on the model
  },
  async function (name, pwd, done) {
    try {
      const user = await User.findOne({ name: name.toLowerCase() }).exec()
      if (!user) {
        return done(null, false, { message: 'This username is not registered.' })
      }
      if (!user.authenticate(pwd)) {
        return done(null, false, { message: 'This password is not correct.' })
      }
      return done(null, user)
    } catch (err) {
      if (err) { return done(err) }
    }
  }))
}
