'use strict'

const router = require('koa-router')()
const controller = require('./organization.controller')

router.get('/', controller.index) // 查询车辆组织机构及相应的路口和设备
router.get('/crosstree', controller.getCrossTree) // 获取路口树
// router.get('/one', controller.orgOne) // 查询车辆组织机构及相应的路口和设备(单层数据)
router.get('/crossing', controller.getCrossing) //  获取当前机构下的路口数据(单层)
// router.get('/resource', controller.getResource) //  获取当前机构下的资源数据(单层)

// router.post('/', controller.create) // 车辆组织机构添加路口或者设备
// router.delete('/', controller.destroy) // 车辆组织机构修改路口或者设备
// router.post('/resource', controller.addResource)
module.exports = router
