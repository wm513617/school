/*
 * @Author: hansen.liuhao
 * @Date: 2019-07-26 11:26:47
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-07-26 11:27:08
 * @description: 对讲服务配置路由
 */

const router = require('koa-router')()
const controller = require('./server.controller')

router.get('/server', controller.getServerConf)
router.put('/server', controller.upsertServerConf)
router.get('/terminal', controller.getTerminalList)
router.post('/terminal', controller.createTerminal)
router.put('/terminal/:id', controller.updateTerminal)
router.delete('/terminal', controller.removeTerminal)
router.get('/microphone', controller.getMicrophoneList)
router.post('/microphone', controller.createMicrophone)
router.put('/microphone/:id', controller.updateMicrophone)
router.delete('/microphone', controller.removeMicrophone)

module.exports = router
