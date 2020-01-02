/*
 * @Author: linhang
 * @Date: 2018-08-20 16:52:16
 * @Last Modified by: mikey.zhaopengaopeng
 * @Last Modified time: 2019-09-12 16:51:41
 */
'use strict'
const mongoose = require('mongoose')
const Org = mongoose.model('Org')
const DutyStaff = mongoose.model('DutyStaff')
const DutyTemplate = mongoose.model('DutyTemplate')
const DutyPlan = mongoose.model('DutyPlan')
const DutyLog = mongoose.model('DutyLog')
const DutyNotice = mongoose.model('DutyNotice')
const Security = mongoose.model('Security')
const dutyhistorys = mongoose.model('dutyhistorys')
const User = mongoose.model('User')
const paging = require('../../paging')
const _ = require('lodash')
const { handleSysException } = require('../../../common/tools')
const moment = require('moment')
const tool = require('../../../common/tools')
const ORG_TYPE = 7
/**
 * 人员管理
 */
// 查询人员列表
exports.getStaff = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-查询人员列表'))
    const search = ctx.query.search
    search.$or = [
      { realname: { $regex: search.name || '' } },
      { code: { $regex: search.name || '' } }
    ]
    delete search.name
    const results = await paging.listQuery(
      DutyStaff,
      search,
      '',
      '',
      ctx.query.page,
      'group',
      ctx
    )

    // results.results = await Promise.all(results.results.map(async item => {
    //   if (item.staffType === 'security') {
    //     let sec = await Security.findById(item.staff)
    //     item.realname = sec.realname
    //   } else if (item.staffType === 'user') {
    //     let use = await User.findById(item.staff)
    //     item.realname = use.realName
    //   }
    //   return item
    // }))
    ctx.body = results.results
  } catch (err) {
    handleSysException(err)
  }
}
// 删除班组
exports.deleteGroup = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-删除班组'))
    const id = ctx.params.id
    if (_.isEmpty(id)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    let allChildrenIds = []
    const orgs = await Org.find(
      { type: ORG_TYPE },
      'name pid order isroot code pinyin'
    )
      .lean()
      .exec()
    allChildrenIds = tool.getChildren(allChildrenIds, orgs, id)
    allChildrenIds.push(id)
    // 查询班组下的人员是否已经列入排班计划，如果有不能删除
    const [staffsIds, plans] = await Promise.all([
      await DutyStaff.find({ group: { $in: allChildrenIds } }, '_id')
        .lean()
        .exec(),
      await DutyPlan.find({}).exec()
    ])
    if (!_.isEmpty(staffsIds)) {
      const staffsIdArr = staffsIds.map(o => {
        return o._id.toString()
      })
      // 查询排班计划列表
      if (!_.isEmpty(plans)) {
        let staffsArr = []
        for (let item of plans) {
          const detail = item.detail
          for (let item1 of detail) {
            const staffs = item1.staffs
            staffsArr = staffsArr.concat(staffs)
          }
        }
        for (let item of staffsArr) {
          for (let item1 of item) {
            if (staffsIdArr.includes(item1._id.toString())) {
              return ctx.throw(500, {
                code: 2001,
                message: '此班组已列入排班计划，无法删除'
              })
            }
          }
        }
      }
    }
    await Promise.all([
      Org.remove({ _id: { $in: allChildrenIds } }).exec(),
      DutyStaff.remove({ group: { $in: allChildrenIds } }).exec()
    ])
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
// 根据班组id查询人员
exports.getStaffByOrgId = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-根据班组查询人员'))
    const id = ctx.query.id
    if (_.isEmpty(id)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    const org = await Org.findById(id)
    if (org.isroot === true) {
      const results = await paging.listQuery(
        DutyStaff,
        {},
        '',
        '',
        ctx.query.page,
        'group',
        ctx
      )
      // results.results = await Promise.all(results.results.map(async item => {
      //   if (item.staffType === 'security') {
      //     let sec = await Security.findById(item.staff)
      //     item.realname = sec.realname
      //   } else if (item.staffType === 'user') {
      //     let use = await User.findById(item.staff)
      //     item.realname = use.realName
      //   }
      //   return item
      // }))
      ctx.body = results.results
    } else {
      let allChildrenIds = []
      const orgs = await Org.find(
        { type: ORG_TYPE },
        'name pid order isroot code pinyin'
      )
        .lean()
        .exec()
      allChildrenIds = tool.getChildren(allChildrenIds, orgs, org._id)
      allChildrenIds.push(org._id)
      const search = {
        group: { $in: allChildrenIds },
        $or: [
          { name: { $regex: ctx.query.search.name || '' } },
          { code: { $regex: ctx.query.search.name || '' } }
        ]
      }
      const results = await paging.listQuery(
        DutyStaff,
        search,
        '',
        '',
        ctx.query.page,
        'group',
        ctx
      )
      // results.results = await Promise.all(results.results.map(async item => {
      //   if (item.staffType === 'security') {
      //     let sec = await Security.findById(item.staff)
      //     item.realname = sec.realname
      //   } else if (item.staffType === 'user') {
      //     let use = await User.findById(item.staff)
      //     item.realname = use.realName
      //   }
      //   return item
      // }))

      let staffs = results.results
      ctx.body = staffs
    }
  } catch (err) {
    handleSysException(err)
  }
}
// 创建人员
exports.createStaff = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-创建人员'))
    const staff = ctx.request.body
    // 查询编号是否重复
    const staffModel = await DutyStaff.findOne({ code: staff.code })
    if (staffModel) {
      ctx.throw(500, { code: 2001, message: '人员编号重复' })
    }
    await DutyStaff.create(staff)
    ctx.status = 201
  } catch (err) {
    handleSysException(err)
  }
}

// 修改人员
exports.updateStaff = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-修改人员'))
    const id = ctx.params.id
    if (_.isEmpty(id)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    const staff = ctx.request.body
    // 查询编号是否重复
    const staffModel = await DutyStaff.findOne({
      code: staff.code,
      _id: { $ne: id }
    })
    if (staffModel) {
      ctx.throw(500, { code: 2001, message: '人员编号重复' })
    }
    await DutyStaff.findByIdAndUpdate(id, staff)

    // 同步修改单兵人员信息
    if (staff.staffType === 'security') {
      // let newDate = {
      //   id: staff.code,
      //   username: staff.name,
      //   realname: staff.realname,
      //   phone: staff.phone,
      //   position: staff.title,
      //   photo: staff.photo
      // }
      // await Security.findByIdAndUpdate(staff.staff, newDate)
    } else if (staff.staffType === 'user') {
      // 同步修改用户人员信息
      await User.findByIdAndUpdate(staff.staff, { realName: staff.realname })
    }

    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}

// 删除人员
exports.deleteStaff = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-删除人员'))
    const ids = ctx.request.header['x-bsc-ids'].split(',')
    if (_.isEmpty(ids)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    await DutyStaff.remove({ _id: { $in: ids } })
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}

// 修改人员所属班组
exports.updateStaffGroup = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-修改人员所属班组'))
    const staffs = ctx.request.body
    const ids = staffs.map(o => {
      return o._id
    })
    const groupId = staffs[0].group
    await DutyStaff.updateMany({ _id: { $in: ids } }, { group: groupId })
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
// 查询班组机构树，并且联合查询班组下边的人
exports.getGroupTree = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-查询班组机构树'))
    const [object, staffs] = await Promise.all([
      await getTree(),
      await DutyStaff.find({}, 'name group').exec()
    ])
    const obj = getStaffsByOrgId(object, staffs)
    ctx.body = obj
  } catch (err) {
    handleSysException(err)
  }
}

// 获取原始机构树
const getTree = async () => {
  const orgs = await Org.find(
    { type: ORG_TYPE },
    'name pid order isroot code pinyin'
  )
    .lean()
    .exec()
  for (const item of orgs) {
    const pid = item.pid
    if (item.pid) {
      for (const item1 of orgs) {
        const childrenArr = item1.children || []
        if (item1._id.toString() === pid.toString()) {
          childrenArr.push(item)
          item1.children = childrenArr
        }
      }
    }
  }
  const orgsArr = orgs.filter(obj => {
    return obj.isroot === true
  })
  return orgsArr
}
// 根据班组id获取人员
const getStaffsByOrgId = (object, staffs) => {
  if (!_.isEmpty(object.children)) {
    for (const item of object.children) {
      const arr = staffs.filter(obj => {
        return obj.group.toString() === item._id.toString()
      })
      item.staffs = arr
      getStaffsByOrgId(item, staffs)
    }
  }
  return object
}
/**
 * 排班模板
 */
// 获取排班模板列表
exports.getTemplate = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-获取模板列表'))
    const search = {}
    search.name = { $regex: ctx.query.name || '' }
    const results = await paging.listQuery(
      DutyTemplate,
      search,
      '',
      '',
      ctx.query.page,
      '',
      ctx
    )
    ctx.body = results.results
  } catch (err) {
    handleSysException(err)
  }
}
// 增加排班模板
exports.createTemplate = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-增加模板'))
    const template = ctx.request.body
    // 判断编号重复
    const templateModel = await DutyTemplate.findOne({ code: template.code })
    if (templateModel) {
      ctx.throw(500, { code: 2001, message: '模板编号重复' })
    }
    const detail = template.detail
    // 验证班次名称长度
    if (!_.isEmpty(detail)) {
      for (let item of detail) {
        if (item.shiftName.length > 10) {
          ctx.throw(500, { code: 2001, message: '班次名称最大为10个字符' })
        }
      }
    }
    if (!_.isEmpty(detail)) {
      // 验证结束时间必须大于开始时间
      for (let i in detail) {
        const startTimeStr = detail[i].startTime
        const endTimeStr = detail[i].endTime
        if (endTimeStr <= startTimeStr) {
          ctx.throw(500, { code: 2001, message: '结束时间必须大于开始时间' })
        }
        // 比较的时候去掉自身
        const arr = detail.splice(i, 1)
        // 验证时间交叉
        for (let item of detail) {
          const startTimeStr1 = item.startTime
          const endTimeStr1 = item.endTime
          if (startTimeStr >= startTimeStr1 && startTimeStr < endTimeStr1) {
            ctx.throw(500, { code: 2001, message: '班次时间不能交叉' })
          } else if (endTimeStr > startTimeStr1 && endTimeStr <= endTimeStr1) {
            ctx.throw(500, { code: 2001, message: '班次时间不能交叉' })
          }
        }
        detail.splice(i, 0, arr[0])
      }
    }
    await DutyTemplate.create(template)
    ctx.status = 201
  } catch (err) {
    handleSysException(err)
  }
}
// 修改排班模板
exports.updateTemplate = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-修改模板'))
    const id = ctx.params.id
    if (_.isEmpty(id)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    const template = ctx.request.body
    // 判断编号重复
    const templateModel = await DutyTemplate.findOne({
      code: template.code,
      _id: { $ne: id }
    })
    if (templateModel) {
      ctx.throw(500, { code: 500, message: '模板编号重复' })
    }
    const detail = template.detail
    // 验证班次名称长度
    if (!_.isEmpty(detail)) {
      for (let item of detail) {
        if (item.shiftName.length > 10) {
          ctx.throw(500, { code: 2001, message: '班次名称最大为10个字符' })
        }
      }
    }
    if (!_.isEmpty(detail)) {
      // 验证结束时间必须大于开始时间
      for (let i in detail) {
        if (_.isEmpty(detail[i].shiftName)) {
          ctx.throw(500, { code: 2001, message: '班次名称必填' })
        }
        const startTimeStr = detail[i].startTime
        const endTimeStr = detail[i].endTime
        if (endTimeStr <= startTimeStr) {
          ctx.throw(500, { code: 2001, message: '结束时间必须大于开始时间' })
        }
        // 比较的时候去掉自身
        const arr = detail.splice(i, 1)
        // 验证时间交叉
        for (let item of detail) {
          const startTimeStr1 = item.startTime
          const endTimeStr1 = item.endTime
          if (startTimeStr >= startTimeStr1 && startTimeStr < endTimeStr1) {
            ctx.throw(500, { code: 2001, message: '班次时间不能交叉' })
          } else if (endTimeStr > startTimeStr1 && endTimeStr <= endTimeStr1) {
            ctx.throw(500, { code: 2001, message: '班次时间不能交叉' })
          }
        }
        detail.splice(i, 0, arr[0])
      }
    }
    await DutyTemplate.findByIdAndUpdate(id, template)
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
// 删除排班模板
exports.deleteTemplate = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-删除模板'))
    const ids = ctx.request.header['x-bsc-ids'].split(',')
    if (_.isEmpty(ids)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    // 判断模板是否可以删除，如果已经被排班计划使用，无法删除
    const plans = await DutyPlan.find({}, 'template')
      .lean()
      .exec()
    const templateIds = plans.map(o => {
      return o.template.toString()
    })
    for (let id of ids) {
      const boolean = templateIds.includes(id)
      if (boolean) {
        return ctx.throw(500, {
          code: 2001,
          message: '此模板已列入排班计划，无法删除'
        })
      }
    }
    await DutyTemplate.remove({ _id: { $in: ids } })
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 排班计划
 */
// 查询排班计划
exports.getPlan = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-查询排班计划'))
    const search = {}
    search.name = { $regex: ctx.query.name || '' }
    const results = await paging.listQuery(
      DutyPlan,
      search,
      '',
      '',
      ctx.query.page,
      ['template', 'group.org'],
      ctx
    )
    let plans = results.results
    plans = await constructPlansData(plans)
    ctx.body = plans
  } catch (err) {
    handleSysException(err)
  }
}
// 重构排班计划数据，getPlan调用
const constructPlansData = async Plans => {
  for (let j = 0; j < Plans.length; j++) {
    const Plan = Plans[j]
    let array = []
    for (const item of Plan.detail) {
      array = array.concat(item.staffs)
    }
    let ids = []
    for (let i = 0; i < array.length; i++) {
      ids = ids.concat(array[i])
    }
    ids = _.uniq(ids)
    // 根据id查询人员表
    const staffs = await DutyStaff.find({ _id: { $in: ids } }).exec()
    for (const item of Plan.detail) {
      const staffsArr = item.staffs
      for (let i = 0; i < staffsArr.length; i++) {
        for (let k = 0; k < staffsArr[i].length; k++) {
          const arr = staffs.filter(o => {
            return o.id === staffsArr[i][k].toString()
          })
          staffsArr[i][k] = arr[0]
        }
        staffsArr[i] = staffsArr[i].filter(obj => {
          return !_.isEmpty(obj)
        })
      }
    }
  }
  return Plans
}
// 查询排班列表,左侧菜单第一个
exports.getDutyList = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-查询排班列表'))
    const search = {}
    const results = await paging.listQuery(
      DutyPlan,
      search,
      '',
      '',
      '',
      ['template', 'group.org'],
      ctx
    )
    let Plans = results.results
    // 取消过滤已过期的排班计划
    // Plans = Plans.filter(obj => {
    //   if (_.isEmpty(obj.planTimeType) || obj.planTimeType === 'time') {
    //     return obj.endTime >= moment(moment().format('YYYYMMDD')).format('x')
    //   } else {
    //     return true
    //   }
    // })
    Plans = await constructPlansData(Plans)
    const names = []
    for (let item of Plans) {
      names.push(item.name)
    }
    let todayDuty
    if (_.isEmpty(Plans)) {
      todayDuty = []
    } else {
      todayDuty = getTodayPlan(Plans[0])
    }
    ctx.body = {
      plans: Plans,
      todayDuty: todayDuty,
      names: names
    }
  } catch (err) {
    handleSysException(err)
  }
}
// 根据name查询排班列表,左侧菜单第一个
exports.getDutyListByName = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-根据列表名称查询排班列表'))
    const name = decodeURIComponent(ctx.query.name)
    const results = await paging.listQuery(
      DutyPlan,
      {},
      '',
      '',
      100, // ctx.query.page
      ['template', 'group.org'],
      ctx
    )
    let Plans = results.results

    Plans = Plans.filter(obj => {
      if (_.isEmpty(obj.planTimeType) || obj.planTimeType === 'time') {
        return obj.endTime >= moment(moment().format('YYYYMMDD')).format('x')
      } else {
        return true
      }
    })

    Plans = await constructPlansData(Plans)

    // 根据name过滤数据
    const plans = Plans.filter(obj => {
      return obj.name === name
    })
    // 获取name列表
    const names = []
    for (let item of Plans) {
      names.push(item.name)
    }
    const todayDuty = getTodayPlan(plans[0])
    ctx.body = {
      plans: plans,
      todayDuty: todayDuty,
      names: names
    }
  } catch (err) {
    handleSysException(err)
  }
}
// 获取当前值班的人
const getTodayPlan = plan => {
  const detailArr = plan.detail
  let arr = ''
  if (plan.planTimeType === 'time') {
    const todayTime = moment(moment().format('YYYYMMDD')).format('x')
    arr = detailArr.filter(obj => {
      return obj.date === Number(todayTime)
    })
  } else if (plan.planTimeType === 'week') {
    arr = [detailArr[moment().day()]]
  } else if (plan.planTimeType === 'month') {
    arr = [detailArr[moment().date()]]
  }

  if (!_.isEmpty(arr)) {
    return {
      template: plan.template.detail,
      staffs: arr,
      time: Number(moment().format('x'))
    }
  } else {
    return {
      template: '',
      staffs: '',
      time: Number(moment().format('x'))
    }
  }
}
// 增加排班计划
/**
 * body 必须有的参数 planTimeType   planType
 */
exports.createPlan = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-新增排班计划'))
    const plan = ctx.request.body
    // 按时间来设置排班计划
    if (plan.planTimeType === 'time') {
      if (plan.startTime > plan.endTime) {
        return ctx.throw(500, {
          code: 2001,
          message: '结束时间不能小于开始时间'
        })
      }
    }
    // 自动创建
    if (plan.planType === 'auth') {
      // 排序，升序
      plan.group = plan.group.sort((obj1, obj2) => {
        return obj1.sort - obj2.sort
      })
      // 模板id
      const id = plan.template
      // 获取模板对象
      const template = await DutyTemplate.findById(id).exec()
      let staffArr = []
      for (let i = 0; i < plan.group.length; i++) {
        // 根据班组id查询底下所有人员
        const staffs = await getStaffArrByOrgId(plan.group[i].org)
        if (!_.isEmpty(staffs)) {
          staffArr.push(staffs)
        }
      }
      // 计算有几个轮班
      const shiftCount = template.detail.length
      let userList = []
      staffArr.forEach((item) => {
        userList = userList.concat(...item)
      })
      const peopleLength = userList.length
      userList.sort(() => { // 将查询到的人员乱序
        return Math.random() - 0.5
      })
      // 计算一共有多少天
      let count = 0
      if (plan.planTimeType === 'time') {
        count =
          (Number(plan.endTime) - Number(plan.startTime)) /
            (60 * 60 * 24 * 1000) +
          1
      } else if (plan.planTimeType === 'week') {
        count = 7
      } else if (plan.planTimeType === 'month') {
        count = 31
      }

      const number = count * shiftCount
      // 按照顺序增加数组长度
      const staffArrOriginal = staffArr
      for (let i = 0; i < number; i++) {
        staffArr = staffArr.concat(staffArrOriginal)
      }
      const detailArr = []
      let k = 0
      if (template.detail.length > peopleLength) {
        for (let i = 0; i < count; i++) {
          let obj = {}
          obj.staffs = []
          if (plan.planTimeType === 'time') {
            obj.date = plan.startTime + i * 3600000 * 24
          } else if (
            plan.planTimeType === 'week' ||
            plan.planTimeType === 'month'
          ) {
            obj.date = i
          }
          for (let j = 0; j < shiftCount; j++) {
            obj.staffs.push(staffArr[k])
            k++
          }
          detailArr.push(obj)
        }
      } else {
        let userGroup = []
        let result = []
        let userClone = userList.slice()
        let countClone =  userClone.length % 3
        if (countClone !== 0) { // 取出无法平均分配的用户，后面要随机分配班次
          result = userClone.splice(-countClone)
        }
        for (let i = 0; i < shiftCount; i++) {
          let arr = []
          userClone.forEach((item, index) => {
            if (index % shiftCount === i || index === i) {
              arr.push(item)
            }
          })
          userGroup.push(arr)
        }
        result.forEach((item) => { // 遍历无法平均分配的人，取随机数分配
          let randomIndex = parseInt(Math.random() * 10 ) % shiftCount
          userGroup[randomIndex].push(item)
        })
        for (let i = 0; i < count; i++) {
          let obj = {}
          obj.staffs = []
          if (plan.planTimeType === 'time') {
            obj.date = plan.startTime + i * 3600000 * 24
          } else if (
            plan.planTimeType === 'week' ||
            plan.planTimeType === 'month'
          ) {
            obj.date = i
          }
          for (let j = 0; j < shiftCount; j++) {
            obj.staffs.push(userGroup[j])
            k++
          }
          detailArr.push(obj)
        }
      }
      plan.detail = detailArr
      await DutyPlan.create(plan)
    } else if (plan.planType === 'manual') {
      if (_.isEmpty(plan.detail)) {
        return ctx.throw(500, {
          code: 2001,
          message: 'planType等于manual detail不能为空'
        })
      }
      // 手动创建计划表
      // plan.detail =[
      //   {
      //     staffs:[[值班人员id,值班人员id, 值班人员id],[值班人id]]
      //     data:'' //时间
      //   }
      // ]
      await DutyPlan.create(plan)
    }
    ctx.status = 201
  } catch (err) {
    handleSysException(err)
  }
}
// 根据机构id获取人员
const getStaffArrByOrgId = async id => {
  try {
    let allChildrenIds = []
    const orgs = await Org.find(
      { type: ORG_TYPE },
      'name pid order isroot code pinyin'
    )
      .lean()
      .exec()
    allChildrenIds = tool.getChildren(allChildrenIds, orgs, id)
    allChildrenIds.push(id)
    const staffs = await DutyStaff.find({
      group: { $in: allChildrenIds }
    }).exec()
    return staffs
  } catch (err) {
    handleSysException(err)
  }
}
// 修改排班计划,修改详情中的某个人
exports.updatePlan = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-修改排班计划'))
    let id = ctx.params.id
    if (_.isEmpty(id)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    const data = ctx.request.body
    await DutyPlan.findByIdAndUpdate(id, data)
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
// 修改排班计划名称
exports.updatePlanName = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-修改排班计划名称'))
    const id = ctx.params.id
    if (_.isEmpty(id)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    const name = ctx.request.body.name
    await DutyPlan.findByIdAndUpdate(id, { name: name })
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
// 排班计划删除
exports.deletePlan = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-删除排班计划'))
    const ids = ctx.request.header['x-bsc-ids'].split(',')
    if (_.isEmpty(ids)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    await DutyPlan.remove({ _id: { $in: ids } })
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 值班日志
 */
// 查询值班日志
exports.getLog = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-获取值班日志'))
    const search = ctx.query.search
    if (search.startTime && search.endTime) {
      search.time = {
        $gte: Number(search.startTime),
        $lte: Number(search.endTime)
      }
    }
    // 根据name查询人员表
    let objectIds = []
    if (search.name) {
      const Staffs = await DutyStaff.find({ name: { $regex: search.name } })
      if (!_.isEmpty(Staffs)) {
        objectIds = Staffs.map(obj => {
          return obj._id
        })
      }
    }
    search.$or = [
      { name: { $regex: search.name || '' } },
      { staff: { $in: objectIds } }
    ]
    delete search.startTime
    delete search.endTime
    delete search.name
    const results = await paging.listQuery(
      DutyLog,
      search,
      '',
      '',
      ctx.query.page,
      'staff',
      ctx
    )
    const LogList = results.results
    // 查询班组列表
    const groupIds = []
    for (const item of LogList) {
      if (item.staff) {
        groupIds.push(item.staff.group)
      }
    }
    const groupList = await Org.find({ _id: { $in: groupIds } }).exec()
    for (const item of LogList) {
      const arr = groupList.filter(obj => {
        if (item.staff) {
          return (
            mongoose.Types.ObjectId(obj._id).toString() ===
            mongoose.Types.ObjectId(item.staff.group).toString()
          )
        }
      })
      if (item.staff) {
        item.staff._doc.groupName = arr[0].name
      }
    }
    ctx.body = LogList
  } catch (err) {
    handleSysException(err)
  }
}
// 获取当天值班的人
exports.getTodayDuty = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-获取当天值班人员'))
    const staffs = await DutyStaff.find({})
      .lean()
      .exec()
    ctx.body = staffs
  } catch (err) {
    handleSysException(err)
  }
}
// 增加值班日志
exports.createLog = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-新增值班日志'))
    const Log = ctx.request.body
    await DutyLog.create(Log)
    ctx.status = 201
  } catch (err) {
    handleSysException(err)
  }
}
// 修改值班日志
exports.updateLog = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-修改值班日志'))
    const id = ctx.params.id
    if (_.isEmpty(id)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    const Log = ctx.request.body
    Log.staff = mongoose.Types.ObjectId(Log.staff)
    await DutyLog.findByIdAndUpdate(id, Log)
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
// 删除值班日志
exports.deleteLog = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-删除值班日志'))
    const ids = ctx.request.header['x-bsc-ids'].split(',')
    if (_.isEmpty(ids)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    await DutyLog.remove({ _id: { $in: ids } })
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}

// 获取公告内容
exports.getNotice = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-获取公告内容'))
    let noticeData = await DutyNotice.findOne({})
      .lean()
      .exec()
    if (noticeData === null) {
      noticeData = new DutyNotice({ notice: null })
    }
    ctx.body = noticeData
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}

// 更新或添加公告内容
exports.postNotice = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-更新公告内容'))
    let NoticeData = await DutyNotice.findOne({})
      .lean()
      .exec()
    // 没有创建过 公告信息
    if (NoticeData === null) {
      let newNotice = new DutyNotice({ notice: ctx.request.body.notice })
      await newNotice.save()
    } else {
      await DutyNotice.updateOne({}, { notice: ctx.request.body.notice }).exec()
    }
    ctx.status = 201
  } catch (err) {
    handleSysException(err)
  }
}

// 清除公告内容
exports.deleteNotice = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-清空公告内容'))
    let NoticeData = await DutyNotice.findOne({})
      .lean()
      .exec()
    if (NoticeData) {
      await DutyNotice.findOneAndDelete({
        _id: NoticeData._id
      })
    }
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}

// 添加值班人员信息
exports.addStaff = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-创建人员'))
    const staff = ctx.request.body
    if (staff.length) {
      let staffIdArray = []
      staff.filter(item => {
        // staffIdArray.push(item.staff)
        staffIdArray.push({
          staff: item.staff,
          realname: item.name
        })
      })
      let staffData = await DutyStaff.find({
        // group: staff[0].group,  //取消根据班组限制改为全局，一个用户只能出现在一个班组中
        // staff: { $in: staffIdArray }
        $or: staffIdArray
      })
        .populate({ path: 'group staff' })
        .exec()
      if (staffData.length) {
        let message = ''
        staffData.map(item => {
          message += `${item.staff.username} `
        })
        message += '已存再其他组中'
        ctx.throw(500, {
          code: 2001,
          message: message
        })
      } else {
        for (let i = 0; i < staff.length; i++) {
          if (staff[i].staffType === 'user') {
            let user = await User.findById(staff[i].staff)
            staff[i].code = ''
            staff[i].realname = ctx.request.body[i].name
            staff[i].name = user.name
            staff[i].phone = ''
            staff[i].title = ''
            staff[i].exptime = user.exptime
            staff[i].photo = ''
          } else {
            // security
            let security = await Security.findById(staff[i].staff)
            staff[i].code = security.id
            staff[i].realname = ctx.request.body[i].name
            staff[i].name = security.username
            staff[i].phone = security.phone
            staff[i].title = security.position
            staff[i].exptime = security.period.unlimited
              ? -1
              : security.period.expried
            staff[i].photo = security.photo
          }
        }
        ctx.body = await DutyStaff.create(staff)
      }
    } else {
      ctx.throw(500, {
        code: 2001,
        message: '未选择人员信息'
      })
    }
    ctx.status = 201
  } catch (err) {
    handleSysException(err)
  }
}

// 根据orgid获取所有人员信息
exports.securityListAll = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-获取单兵人员信息'))

    const orgId = ctx.params.orgId
    if (_.isEmpty(orgId)) {
      ctx.throw(500, {
        code: 2004,
        message: '必须指定获取组织机构id'
      })
    }
    const orgs = await Org.find(
      {
        type: 3 // 巡更组织类型
      },
      'name pid isroot'
    )
      .sort('order')
      .lean()
    let refOrg = []
    if (_.isEmpty(orgId)) {
      const root = _.find(orgs, {
        isroot: true
      })
      refOrg = tool.getChildren(refOrg, orgs, root._id.toString())
      refOrg.push(root._id.toString())
    } else {
      refOrg = tool.getChildren(refOrg, orgs, orgId)
      refOrg.push(orgId)
    }
    const result = await Security.find({
      affiliation: {
        $in: refOrg
      }
    })
    // if (_.isEmpty(result)) {
    //   ctx.status = 200
    //   ctx.throw(500, {
    //     code: 2001,
    //     message: '找不到请求的服务资源'
    //   })
    // } else {
    //   ctx.status = 200
    // }
    ctx.status = 200
    ctx.body = result
  } catch (err) {
    handleSysException(err)
  }
}

/**
 * 获取值班时长
 */
exports.getHistory = async ctx => {
  try {
    const id = ctx.params.id
    if (_.isEmpty(id)) {
      ctx.throw(500, {
        code: 2004,
        message: '必须指定单兵'
      })
    }
    const query = {
      staff: id
    }
    if (ctx.query.starttime && ctx.query.endtime) {
      query.date = {
        $gte: ctx.query.starttime * 1,
        $lte: ctx.query.endtime * 1
      }
    }

    let results = await dutyhistorys
      .find(query, 'timeSum staff template date')
      .sort({ data: 1 })
      .exec()

    // 如果最终查询的是今天  那就查询出今天此人已值班的时间作为显示
    if (
      ctx.query.endtime >=
      moment()
        .startOf('day')
        .utc()
        .format('x')
    ) {
      let one = await this.addHistory({
        logTime:
          moment()
            .startOf('day')
            .format('x') * 1,
        select: {
          'detail.staffs': { $elemMatch: { $elemMatch: { $in: [id] } } }
        },
        noCreate: false
      })

      let timeSum = 0
      for (let i = 0; i < one[0].template.length; i++) {
        let temp = one[0].template[i]
        let stime = moment(temp.startTime, 'HH:mm')
        let etime = moment(temp.endTime, 'HH:mm')
        if (etime.valueOf() < moment().valueOf()) {
          timeSum += etime.diff(stime)
        } else if (
          stime.valueOf() < moment().valueOf() &&
          etime.valueOf() > moment().valueOf
        ) {
          timeSum += moment().diff(stime)
        }
      }
      one[0].timeSum = timeSum
      results = results.concat(one)
    }

    ctx.body = results
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}

exports.addHistory = async ({
  logTime = moment(moment().startOf('day') - 1)
    .startOf('day')
    .format('x') * 1,
  noCreate = true,
  select = {}
}) => {
  try {
    const PLANTIMETYPE = ['time', 'week', 'month']
    const dayOfMonth = moment(logTime).date()
    const week =
      moment(logTime).weekday() === 0 ? 6 : moment(logTime).weekday() - 1
    const dutyplan = await DutyPlan.find(select)
      .populate({ path: 'template' })
      .lean()
      .exec()
    const history = {}
    dutyplan.map(plan => {
      if (plan.planTimeType === PLANTIMETYPE[2]) {
        addHistoryArr(plan, dayOfMonth, history)
      } else if (plan.planTimeType === PLANTIMETYPE[1]) {
        addHistoryArr(plan, week, history)
      } else {
        if (plan.startTime <= logTime && logTime <= plan.endTime) {
          const timeOrder = moment(logTime).diff(plan.startTime, 'days')
          addHistoryArr(plan, timeOrder, history)
        }
      }
    })
    const arr = []
    _.forOwn(history, (item, key) => {
      const obj = item
      obj.staff = key
      obj.date = logTime
      obj.timeSum = 0
      item.template.map(item => {
        obj.timeSum += item.timeSum
      })
      arr.push(obj)
    })
    if (!noCreate) {
      return arr.filter(
        item =>
          item.staff ===
          select['detail.staffs']['$elemMatch']['$elemMatch']['$in'][0]
      )
    } else {
      await dutyhistorys.create(arr)
    }
    return history
  } catch (error) {
    console.error('值班执行错误:', error)
    handleSysException(error)
  }
}

function addHistoryArr (plan, order, history) {
  plan.detail[order].staffs.map((staffsArr, index) => {
    staffsArr.map(staffs => {
      const id = staffs + ''
      if (!history[id]) {
        history[id] = {
          template: []
        }
      }
      const template = plan.template.detail[index]
      template.timeSum = moment(template.endTime, 'HH:mm').diff(
        moment(template.startTime, 'HH:mm')
      )
      history[staffs].template.push(template)
    })
  })
}
