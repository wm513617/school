/*
 * @Author: linhang
 * @Date: 2018-09-10 09:22:30
 * @Last Modified by: wenhaoFu
 * @Last Modified time: 2019-08-13 16:05:17
 */
'use strict'
const router = require('koa-router')()
const OrgController = require('../../sys/org/org.controller')
const controller = require('./duty.controller')

// 班组
router.get('/group', OrgController.getTree) // 获取班组列表
router.post('/group', OrgController.create) // 创建班组
router.put('/group/:id', OrgController.updateOne) // 修改班组
router.delete('/group/:id', controller.deleteGroup) // 删除班组

// 人员
router.get('/staff', controller.getStaff) // 获取人员列表 x
router.post('/staff', controller.createStaff) // 创建人员 x
router.put('/staff/:id', controller.updateStaff) // 修改人员信息
router.put('/staffgroup', controller.updateStaffGroup) // 修改人员所属班组
router.delete('/staff', controller.deleteStaff) // 删除人员
router.get('/org', controller.getStaffByOrgId) // 根据班组id查询人员

router.post('/addstaff/', controller.addStaff) // 向指定组添加人员
router.get('/securityListAll/:orgId', controller.securityListAll) // 根据单兵机构id获取所有人员列表

// 排班模板
router.get('/template', controller.getTemplate) // 获取排班模板列表
router.post('/template', controller.createTemplate) // 添加排班模板
router.put('/template/:id', controller.updateTemplate) // 修改模板
router.delete('/template', controller.deleteTemplate) // 删除模板

// 排班计划
router.get('/plan', controller.getPlan) // 获取排班计划列表
router.post('/plan', controller.createPlan) // 增加计划
router.get('/planstaff', controller.getGroupTree) // 修改排班计划时查询班组带人员
router.put('/plan/:id', controller.updatePlan) // 修改计划
router.put('/planname/:id', controller.updatePlanName) // 修改排班计划名称
router.delete('/plan', controller.deletePlan) // 删除计划

// 值班日志
router.get('/log', controller.getLog) // 获取日志列表
router.post('/log', controller.createLog) // 增加日志列表
router.put('/log/:id', controller.updateLog) // 修改日志
router.delete('/log', controller.deleteLog) // 删除日志
router.get('/today', controller.getTodayDuty) // 获取当天值班的人

// 值班列表
router.get('/dutylist', controller.getDutyList) // 获取值班列表
router.get('/byname', controller.getDutyListByName) // 根据name获取值班列表

// 公告
router.get('/notice', controller.getNotice) // 获取公告内容
router.post('/notice', controller.postNotice) // 更新或添加公告内容   {"notice":String}
router.delete('/notice', controller.deleteNotice) // 清除公告内容

// 值班时长
router.get('/history/:id', controller.getHistory) // 获取值班时长列表

// 添加测试加班时长
router.get('/historyt/:time',async (ctx) => {
  console.log(moment(ctx.params.time))
  ctx.body = await controller.addHistory({logTime: moment(ctx.params.time)})
})

module.exports = router
