const router = require('koa-router')()
const controller = require('./group.controller')
router.post('/created', controller.createdGroup) // 创建底库
router.get('/getList', controller.getList) // 获取底库列表
router.post('/deleteGroup', controller.deleteGroup) // 删除底库
router.post('/editGroup', controller.editGroup) // 编辑底库
module.exports = router
