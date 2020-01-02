'use strict'
const router = require('koa-router')()

const MotorVehicleController = require('./controller/motorVehicle.controller')
const ExcelController = require('./controller/excel.controller')
const PeopleVehicleStatisticsController = require('./controller/peopleVehicleStatistics.controller')
const PassVehicleStatisticsController = require('./controller/passVehicleStatistics.controller')

router.post('/new', MotorVehicleController.create)
router.put('/edit/:id', MotorVehicleController.update)
router.delete('/destroy/:ids', MotorVehicleController.destroy)
router.get('/show/:id', MotorVehicleController.show)
router.get('/list', MotorVehicleController.list)
router.delete('/org/:id', MotorVehicleController.renmoveOrgVehichles)

router.get('/download', ExcelController.download)
router.get('/import/:orgId/:name', ExcelController.transform)
router.get('/template/file', ExcelController.template)

router.get('/peopleVehicle/download', PeopleVehicleStatisticsController.download)
router.get('/passVehicle/download', PassVehicleStatisticsController.download)

router.get('/peopleVehicle/analysis', PeopleVehicleStatisticsController.analysis)
router.get('/peopleVehicle/analysisTop', PeopleVehicleStatisticsController.analysisTop)

router.get('/passVehicle/analysis', PassVehicleStatisticsController.analysis)
router.get('/passVehicle/total', PassVehicleStatisticsController.total)

module.exports = router
