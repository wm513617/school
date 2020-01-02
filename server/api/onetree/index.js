'use strict'

const router = require('koa-router')()
const controller = require('./onetree.controller')

router.get('/', controller.getOneTree) // 获取机构树
router.get('/seek', controller.getOneTreeSeek) // 机构树  或资源搜索
router.get('/getChildNode', controller.getOneChildNod) // 获取该机构下子机构和资源
module.exports = router
