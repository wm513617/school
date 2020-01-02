/*
 * @Author: hansen.liuhao
 * @Date: 2018-10-25 14:09:03
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2018-11-09 17:55:42
 */

const mongoose = require('mongoose')
const Security = mongoose.model('Security')
const PatrolPoint = mongoose.model('PatrolPoint')

class SentryService {
  /**
   * 通过指定的id获取巡更单兵人员信息
   * @param {string} id
   * @return {object}
   */
  async securityFindById (id) {
    try {
      const result = await Security.findById(id).lean()
      return result
    } catch (error) {
      throw error
    }
  }
  /**
   * 根据查询条件查询满足条件的所有单兵人员
   * @param {object} 查询条件
   * @param {string} 返回字段
   * @return {array}
   */
  async securityFind (query, selection) {
    try {
      const result = await Security.find(query, selection).lean()
      return result
    } catch (error) {
      throw error
    }
  }
  /**
   * 通过指定的id获取巡点信息
   * @param {string} id
   * @return {object}
   */
  async pointFindById (id) {
    try {
      const result = await PatrolPoint.findById(id).lean()
      return result
    } catch (error) {
      throw error
    }
  }
}

module.exports = SentryService
