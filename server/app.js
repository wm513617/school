require('./global')
require('dotenv').config()
/* eslint  camelcase: 0 */
const { NODE_ENV } = process.env
const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const onerror = require('koa-onerror')
const compress = require('koa-compress')
const passport = require('koa-passport')
const config = require('../config')
const filelog = require('./middlewares/response.log')
const cors = require('kcors')
const convert = require('koa-convert')

app.proxy = true
process.env.NODE_ENV = NODE_ENV || 'production'
mongoose.Promise = require('bluebird')
mongoose.connect(config.backend.mongo.uri, config.backend.mongo.authOptions)
mongoose.connection.on('connected', () => {
  console.log('------mongodb bs-security连接成功------')
})

mongoose.connection.on('error', function (err) {
  if (err) {
    console.log('------mongodb bs-security尝试无密码连接------')
    mongoose.connect(config.backend.mongo.uri, config.backend.mongo.options)
    mongoose.connection.on('error', err => {
      console.log('------mongodb bs-security连接失败------', err)
    })
  }
})
require('./common/load.model')
require('./config/seed')
require('./upgrade/index').databaseUpgrade()
app.use(require('./common/auth'))
app.use(require('./middlewares/noCache'))
app.use(require('./middlewares/args.merge'))
const { proxy } = require('./middlewares/proxyCache')
onerror(app)
app.use(compress())
app.use(filelog)
app.use(
  bodyParser({
    jsonLimit: '10mb',
    formLimit: '10mb',
    extendTypes: {
      json: ['application/x-www-form-urlencoded']
    }
  })
)
app.use(json())
app.use(logger())
app.use(passport.initialize())
app.use(convert(cors()))
// 代理人脸图片服务
app.use(async (ctx, next) => {
  if (/\.(gif|jpg|jpeg|png)$/.test(ctx.path)) {
    await proxy({ ctx })
  } else {
    await next()
  }
})
// auth middlewares
app.use(require('./middlewares/token.resolve'))
require('./routes')(app)
module.exports = app
