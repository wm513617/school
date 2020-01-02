'use strict'

const passport = require('koa-passport')
const auth = require('../auth.service')
const router = require('koa-router')()

router.post('/', async (ctx, next) => {
  return passport.authenticate('local', function (err, user, info) {
    if (err) {
      ctx.status = 401
      ctx.body = err
      return
    }
    if (user === false) {
      ctx.status = 404
      ctx.body = {
        message: 'name or password is wrong, please try again.'
      }
    } else {
      ctx.body = { tocken: auth.signToken(user), code: 200 }
    }
  })(ctx, next)
})

module.exports = router
