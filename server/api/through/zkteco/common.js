/**
 * 第三方相关设备通用方法
 * @time:2019-7-15
 * @author:MeiChen
 */
const Org = mongoose.model('Org')
const rp = require('request-promise')
const configModel = require('../serviceConfig/serviceConfig.model')
module.exports = {
  initOrg (ctx) { // 初始化机构
    return (async function () {
      try {
        let orgList = await Org.findOne({ isroot: true, type: 11 }) // 根机构信息
        if (orgList === null) { // 如果根机构机构不存在，则创建一个
          orgList = await Org.create({
            name: '默认设备根机构',
            type: 11,
            isroot: true
          })
        }
        return orgList
      } catch (err) {
        console.log('err======', err)
        ctx.throw(500, { code: 500, message: '读写根机构错误' })
      }
    })()
  },
  async getOrgList (ctx, orgId, orgIdArr) { // 递归获取所有机构的机构ID
    try {
      let getOrgData = await Org.aggregate([{ $match: { pid: mongoose.Types.ObjectId(orgId) } }])
      if (getOrgData.length) {
        for (let i = 0; i < getOrgData.length; i++) {
          orgIdArr.push(getOrgData[i]._id)
          await this.getOrgList(getOrgData[i]._id)
        }
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '递归格式化机构出错' })
    }
    return orgIdArr
  },
  async getServerConfig (type) { // 获取服务配置对应数据
    /*
     * 参数type number类型 1 对应门禁服务器 2 对应人脸服务器
     * */
    return configModel.findOne({type: type}).lean(true)
  },
  request (options) {
    return rp(options)
  }
}
