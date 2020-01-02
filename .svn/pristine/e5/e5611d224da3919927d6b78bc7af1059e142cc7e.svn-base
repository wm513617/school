/*
 * @Author: lushengying
 * @Date: 2019-02-11 10:09:21
 * @Last Modified by: lushengying
 * @Last Modified time: 2019-04-08 20:15:46
 */
'use strict'
const mongoose = require('mongoose')
const Icon = mongoose.model('Icon')
const Resource = mongoose.model('Resource')
const PatrolPoint = mongoose.model('PatrolPoint')

class IconService {
  /**
   * 添加图标
   * @param {*} data 图标数据
   * @returns 图标id
   * @memberof IconService
   */
  async add (data) {
    try {
      const docs = await Icon.create(data)
      if (docs instanceof Array) {
        return docs.map(item => item._id)
      } else {
        return docs._id
      }
    } catch (error) {
      throw error
    }
  }
  /**
   * 根据id查询
   * @param {*} id
   * @memberof IconService
   */
  async findById (id) {
    try {
      return Icon.findById(id)
        .lean()
        .exec()
    } catch (error) {
      throw error
    }
  }
  /**
   * 根据条件查询单个
   * @param {*} query
   * @memberof IconService
   */
  async findOne (query) {
    try {
      return Icon.findOne(query)
        .lean()
        .exec()
    } catch (error) {
      throw error
    }
  }
  /**
   * 根据条件查询
   * @param {*} query
   * @memberof IconService
   */
  async findByQuery (query) {
    try {
      return Icon.find(query)
        .lean()
        .exec()
    } catch (error) {
      throw error
    }
  }
  /**
   * 获取列表
   * @param {*} query 查询条件
   * @param {*} page 分页信息
   * @returns
   * @memberof IconService
   */
  async getList (query, page = { page: 1, limit: 10 }) {
    try {
      const [count, result] = await Promise.all([
        Icon.countDocuments(query).exec(),
        Icon.find(query)
          .skip((+page.page - 1) * +page.limit)
          .limit(+page.limit)
          .exec()
      ])
      return { count, result }
    } catch (error) {
      throw error
    }
  }
  /**
   * 更新单个图标
   * @param {*} id 图标id
   * @param {*} data 更新数据
   * @memberof IconService
   */
  async updateById (id, data) {
    try {
      await Icon.findByIdAndUpdate(id, data).exec()
    } catch (error) {
      throw error
    }
  }

  /**
   * 更新多个图标
   * @param {*} query
   * @param {*} data
   * @memberof IconService
   */
  async updateMany (query, data) {
    try {
      await Icon.updateMany(query, data).exec()
    } catch (error) {
      throw error
    }
  }
  /**
   * 删除图标(支持批量)
   * @param {*} id
   * @memberof IconService
   */
  async delete (ids) {
    try {
      await Icon.deleteMany({ _id: { $in: ids }, isDelete: true, default: false }).exec()
    } catch (error) {
      throw error
    }
  }
  /**
   * 检查图标是否被使用
   * @param {*} ids
   * @memberof IconService
   */
  async checkIconkUsed (ids) {
    try {
      const [reses, patrols] = await Promise.all([
        Resource.find({ 'point.mid': { $in: ids } }).exec(),
        PatrolPoint.find({ 'point.mid': { $in: ids } }).exec()
      ])
      const length = [...reses, ...patrols].length
      return length
    } catch (error) {
      throw error
    }
  }
}
module.exports = IconService
