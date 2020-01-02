'use strict'
const router = require('koa-router')()

const NonVehicleController = require('./controller/nonVehicle.controller.js')
const ExcelController = require('./controller/excel.controller')
const StatisticsController = require('./controller/statistics.controller')

router.post('/new', NonVehicleController.create)
router.put('/edit/:id', NonVehicleController.update)
router.delete('/destroy/:ids', NonVehicleController.destroy)
router.get('/show/:id', NonVehicleController.show)
router.get('/list', NonVehicleController.list)

router.delete('/org/:id', NonVehicleController.renmoveOrgVehichles)
router.get('/violation', NonVehicleController.getViolationRecord)
router.post('/violation', NonVehicleController.addViolationRecord)
router.get('/index/:deviceId/:numberPlate', NonVehicleController.index)

router.get('/download', ExcelController.download)
router.get('/download/template/file', ExcelController.template)
router.get('/import/:orgId/:name', ExcelController.transform)

router.get('/total', StatisticsController.total)
router.get('/analysis', StatisticsController.analysis)

module.exports = router
