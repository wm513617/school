'use strict'

const config = require('../../config').backend
const User = require('mongoose').model('User')

// Passport Configuration
require('./local/passport').setup(User, config)

const router = require('koa-router')()

router.use('/login', require('./local').routes(), require('./local').allowedMethods())

module.exports = router
