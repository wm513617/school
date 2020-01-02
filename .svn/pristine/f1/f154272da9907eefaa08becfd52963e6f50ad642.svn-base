/*
 * @Author: linhang
 * @Date: 2018-10-17 15:09:12
 * @Last Modified by: linhang
 * @Last Modified time: 2018-10-23 11:27:39
 */
const StrategyModel = require('mongoose').model('Strategy')
/**
 * 安全策略service
 */
class Strategy {
  /**
   * 查询安全策略数据
   */
  async find () {
    try {
      const results = await StrategyModel.findOne().exec()
      return results
    } catch (err) {
      throw err
    }
  }
  /**
   * 更新安全策略数据
   * @param {*} id
   * @param {*} obj
   */
  async update (obj) {
    try {
      await StrategyModel.updateOne({}, obj)
    } catch (err) {
      throw err
    }
  }
}
module.exports = Strategy
