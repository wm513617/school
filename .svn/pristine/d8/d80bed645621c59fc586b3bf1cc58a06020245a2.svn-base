/**
 * 人员通行底库
 * @time:2019-7-25
 * @author:MeiChen
 */
const portraitGroup = require('./group.model')
module.exports = {
  async createdGroup (ctx, next) {  // 创建底库
    try {
      console.log(ctx.request.body)
      let data = await portraitGroup.findOne({name: ctx.request.body.name})
      if (data === null) { // 如果底库名称不存在则写入数据库
        let appendData = new portraitGroup(ctx.request.body)
        let status = await appendData.save()
        ctx.body = {
          code: 200,
          data: status,
          message: 'success'
        }
      } else {
        ctx.body = {
          code: 500,
          data: [],
          message: '该底库已经存在'
        }
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '底库数据读写出错' })
    }
  },
  async getList (ctx, next) { // 底库列表获取
    try {
      let list = await portraitGroup.find({})
      ctx.body = {
        code: 200,
        data: list,
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '底库数据读取出错' })
    }
  },
  async deleteGroup (ctx, next) { // 删除底库
    try {
      let status = await portraitGroup.remove({'_id': ctx.request.body._id})
      ctx.body = {
        code: 200,
        data: status,
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '底库数据删除出错' })
    }
  },
  async editGroup (ctx, next) { // 编辑底库
    try {
      let result = await portraitGroup.findOne({'_id': ctx.request.body._id})
      if (ctx.request.body.data.name !== result.name) {
        let data = await portraitGroup.findByIdAndUpdate({'_id': ctx.request.body._id},ctx.request.body.data, {new: true, runValidators: true})
        ctx.body = {
          code: 200,
          data: data,
          message: 'success'
        }
      } else {
        ctx.body = {
          code: 500,
          data: [],
          message: '底库名重复'
        }
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '更新底库数据删除出错' })
    }
  }
}
