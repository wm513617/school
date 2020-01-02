/*
 * @Author: hansen.liuhao
 * @Date: 2019-07-26 11:27:54
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-08-07 11:57:00
 * @description: 对讲应用路由
 */

const router = require('koa-router')()
const controller = require('./app.controller')

router.post('/call', controller.callRequest)
router.post('/hangup', controller.hangUp)
router.post('/answer', controller.answer)
router.get('/history', controller.history)
router.delete('/history', controller.removeHistory)

module.exports = router
