/*
 * 线路相关接口(测试使用)
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:20:48
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2019-01-04 10:57:55
 */

const router = require('koa-router')()

const LinesModel = require('mongoose').model('Line')

router.prefix('/line')

router.get('/', async (ctx, next) => {
  ctx.params.id = '59229422b016c62dc45684a5'
  const obj = ctx.params.id ? { _id: ctx.params.id } : {}
  try {
    ctx.body = await LinesModel.find(obj).exec()
  } catch (error) {
    ctx.throw(error)
  }
})

/**
 * 新增线路
 */
router.post('/', async (ctx, next) => {
  ctx.set('loginfo', encodeURI('地图管理-添加线路'))
  ctx.request.body = JSON.stringify({
    name: '测试线路',
    equiptment: ['111', '2222']
  })
  const newLines = new LinesModel(JSON.parse(ctx.request.body))
  try {
    ctx.body = await newLines.save()
    ctx.status = 201
  } catch (error) {
    console.log(error)
    ctx.body = {
      message: '参数错误'
    }
    ctx.status = 400
  }
})
/**
 * 更新路线
 */
router.put('/', async (ctx, next) => {
  ctx.set('loginfo', encodeURI('地图管理-更新线路'))
  ctx.request.body = JSON.stringify({
    _id: '592293d916abe40afc53f835',
    name: '线路二',
    equiptment: ['2222', '5555']
  })
  try {
    ctx.body = await LinesModel.updateMany(JSON.parse(ctx.request.body))
    ctx.status = 200
  } catch (error) {
    console.log(error)
    ctx.body = {
      message: '参数错误'
    }
    ctx.status = 400
  }
})

/**
 * 删除路线
 */
router.delete('/', async (ctx, next) => {
  ctx.set('loginfo', encodeURI('地图管理-删除路线'))
  ctx.params.id = '59229422b016c62dc45684a5'
  try {
    ctx.body = await LinesModel.findByIdAndRemove(ctx.params.id)
    ctx.status = 204
  } catch (error) {
    console.log(error)
    ctx.body = {
      message: '参数错误'
    }
    ctx.status = 400
  }
})

module.exports = router
