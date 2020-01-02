/*
 * 辅助杆
 * @Author: chenkaibo
 * @Date: 2018-11-03 13:35:06
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2018-11-06 16:33:36
 */
'use strict'
const mongoose = require('mongoose')
const Pole = mongoose.model('Pole')
class PoleService {
  /**
   * 添加杆
   * @param {*} data 杆数据
   * @returns id
   * @memberof PoleService
   */
  async add (data) {
    try {
      const docs = await Pole.create(data)
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
   * @memberof PoleService
   */
  findById (id, populate) {
    try {
      return Pole.findById(id).populate(populate).lean().exec()
    } catch (error) {
      throw error
    }
  }
  /**
   * 根据条件查询
   * @param {*} query
   * @memberof PoleService
   */
  findByQuery (query = {}, populate) {
    try {
      return populate ? Pole.find(query).populate(populate).lean().exec() : Pole.find(query).lean().exec()
    } catch (error) {
      throw error
    }
  }
  /**
   * 更新单个模型
   * @param {*} id 模型id
   * @param {*} data 更新数据
   * @memberof PoleService
   */
  async updateById (id, data) {
    try {
      await Pole.findByIdAndUpdate(id, data).exec()
    } catch (error) {
      throw (error)
    }
  }

  /**
   * 更新多个模型
   * @param {*} query
   * @param {*} data
   * @memberof PoleService
   */
  async updateMany (query, data) {
    try {
      await Pole.updateMany(query, data).exec()
    } catch (error) {
      throw (error)
    }
  }
  /**
   * 删除模型
   * @param {*} id
   * @memberof PoleService
   */
  async deleteOne (id) {
    try {
      await Pole.findByIdAndDelete(id).exec()
    } catch (error) {
      throw error
    }
  }
}
module.exports = PoleService
