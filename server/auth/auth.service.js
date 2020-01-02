'use strict'

const config = require('../../config').backend
const jwt = require('jsonwebtoken')
const User = require('mongoose').model('User')
const _ = require('lodash')

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 401
 */
async function isAuthenticated (ctx, next) {
  try {
    if (ctx.headers.authorization) {
      ctx.headers.authorization = ctx.headers.authorization.replace(/Bearer /g, '')
    }
    const decoded = jwt.verify(ctx.headers.authorization || ctx.query.access_token || '', config.secrets.session)
    const user = await User.findById(decoded._id).exec()
    if (_.isEmpty(user)) {
      ctx.status = 401
      return
    }
    ctx.state.user = decoded
    return next()
  } catch (err) {
    ctx.status = 401
    ctx.body = {
      error: err.message || 'JsonWebTokenError'
    }
  }
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
async function hasRole (ctx, next, roleRequired) {
  if (!roleRequired) {
    return ctx.throw('Required role needs to be set')
  }
  if (config.userRoles.indexOf(ctx.state.user.role) <= config.userRoles.indexOf(roleRequired)) {
    return next()
  } else {
    ctx.status = 403
  }
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken (user) {
  return jwt.sign({ _id: user._id, name: user.name, role: user.role }, config.secrets.session, { expiresIn: '7d' })
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie (ctx) {
  if (!ctx.state.user) {
    ctx.status = 404
    ctx.body({ message: 'Something went wrong, please try again.' })
    return
  }
  const token = signToken(ctx.state.user)
  ctx.cookies.set('token', JSON.stringify(token))
  ctx.redirect('/')
}

exports.isAuthenticated = isAuthenticated
exports.hasRole = hasRole
exports.signToken = signToken
exports.setTokenCookie = setTokenCookie
