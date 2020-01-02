/*
 * @Author: chenkaibo
 * @Date: 2018-10-29 17:03:18
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-04-23 14:04:37
 */
'use strict'
const mongoose = require('mongoose')
const Model = mongoose.model('Model')
const Resource = mongoose.model('Resource')
const Pole = mongoose.model('Pole')
const PatrolPoint = mongoose.model('PatrolPoint')

class ModelService {
  /**
   * 添加模型
   * @param {*} data 模型数据
   * @returns 模型id
   * @memberof ModelService
   */
  async add (data) {
    try {
      const docs = await Model.create(data)
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
   * @memberof ModelService
   */
  async findById (id) {
    try {
      return Model.findById(id).lean().exec()
    } catch (error) {
      throw error
    }
  }
  /**
   * 根据条件查询单个
   * @param {*} query
   * @memberof ModelService
   */
  async findOne (query) {
    try {
      return Model.findOne(query).lean().exec()
    } catch (error) {
      throw error
    }
  }
  /**
   * 根据条件查询
   * @param {*} query
   * @memberof ModelService
   */
  async findByQuery (query) {
    try {
      return Model.find(query).lean().exec()
    } catch (error) {
      throw error
    }
  }
  /**
   * 获取列表
   * @param {*} query 查询条件
   * @param {*} page 分页信息
   * @returns
   * @memberof ModelService
   */
  async getList (query, page = { page: 1, limit: 10 }) {
    try {
      const [count, result] = await Promise.all([
        Model.countDocuments(query).exec(), Model.find(query).skip((+page.page - 1) * (+page.limit))
          .limit(+page.limit).exec()
      ])
      return { count, result }
    } catch (error) {
      throw error
    }
  }
  /**
   * 更新单个模型
   * @param {*} id 模型id
   * @param {*} data 更新数据
   * @memberof ModelService
   */
  async updateById (id, data) {
    try {
      await Model.findByIdAndUpdate(id, data).exec()
    } catch (error) {
      throw (error)
    }
  }

  /**
   * 更新多个模型
   * @param {*} query
   * @param {*} data
   * @memberof ModelService
   */
  async updateMany (query, data) {
    try {
      await Model.updateMany(query, data).exec()
    } catch (error) {
      throw (error)
    }
  }
  /**
   * 删除模型(支持批量)
   * @param {*} id
   * @memberof ModelService
   */
  async delete (ids) {
    try {
      await Model.deleteMany({ _id: { $in: ids } }).exec()
    } catch (error) {
      throw error
    }
  }
  /**
   * 检查模型是否被使用
   * @param {*} ids
   * @memberof ModelService
   */
  async checkModelkUsed (ids) {
    try {
      const [reses, poles, patrols] = await Promise.all([
        Resource.find({ 'point3D.mid': { $in: ids } }).exec(),
        Pole.find({ mid: { $in: ids } }).exec(),
        PatrolPoint.find({ 'point3D.mid': { $in: ids } }).exec()
      ])
      const length = [...reses, ...poles, ...patrols].length
      return length
    } catch (error) {
      throw error
    }
  }
}
module.exports = ModelService
