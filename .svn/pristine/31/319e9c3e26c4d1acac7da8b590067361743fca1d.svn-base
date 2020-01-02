/*
 * @Author: hansen.liuhao
 * @Date: 2019-07-26 11:27:36
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-07-31 11:11:29
 * @description: 对讲服务路由
 */

const router = require('koa-router')()

router.use('/conf', require('./server').routes(), require('./server').allowedMethods())
router.use('/scense', require('./scense').routes(), require('./scense').allowedMethods())

module.exports = router
