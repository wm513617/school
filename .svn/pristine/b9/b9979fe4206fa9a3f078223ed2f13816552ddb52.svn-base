/*
 * @Author: hansen.liuhao
 * @Date: 2019-08-15 17:05:47
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-11-13 15:37:42
 * @description: socket推送权限工具
 */

const mongoose = require('mongoose')
const User = mongoose.model('User')
const Security = mongoose.model('Security')
const PropertyModel = mongoose.model('ResProperty')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const config = require('../../config').backend

const group = {}
/**
 * 获取token用户信息
 * @param {*} token
 */
const getUserByToken = async token => {
  try {
    if (!token) {
      return ''
    }
    let user
    const decoded = jwt.verify(token, config.secrets.session)
    if (decoded.role) {
      user = await User.findById(decoded._id).lean()
    } else {
      user = await Security.findById(decoded._id).lean()
    }
    return user
  } catch (error) {
    return ''
  }
}
/**
 * 缓存所有socket链接端的所属角色业务类型下的特定资源权限属性
 * @param {*} socketId 服务端socket链接实例的id
 * @param {*} roleId 用户角色id
 */
const maintainResourceByRole = async (socketId, roleId, query = { type: 0, properties: { $exists: true } }) => {
  if (_.isEmpty(group[roleId])) {
    group[roleId] = {}
    group[roleId].socketIds = [socketId]
    // 超级管理员
    if (roleId === '5be27279e74ee9376c681111') {
      group[roleId].administor = true
    } else {
      group[roleId].administor = false
    }
  }
  if (_.isEmpty(group[roleId][query.type])) {
    _.assign(query, { role: roleId })
    const resource = await PropertyModel.find(query, 'resource').lean()
    const resouceHash = new Map()
    resource.forEach(item => resouceHash.set(item.resource.toString(), true))
    _.set(group[roleId], `${query.type}.resouceHashTable`, resouceHash)
  }
  if (!group[roleId].socketIds.includes(socketId)) {
    group[roleId].socketIds.push(socketId)
  }
}

/**
 * 获取具有资源权限的socket客户端连接端
 * @param {*} res 资源id
 */
const getSocketIdsByResource = (set, res) => {
  let sender = []
  for (let role of Object.keys(group)) {
    if (group[role].administor || group[role][set].resouceHashTable.has(res)) {
      sender = sender.concat(group[role].socketIds)
    }
  }
  return sender
}
/**
 * 推送信息到资源权限合法的socket客户端
 * @param {*} io sockt服务实例
 * @param {*} event socket客户端监听事件
 * @param {*} res 资源id
 * @param {*} data 推送数据
 */
const emitByResPermisson = async (io, set, event, res, data) => {
  res = res.toString()
  const clients = getSocketIdsByResource(set, res)
  if (clients.length) {
    for (const id of clients) {
      try {
        io.sockets.sockets[id].emit(event, data)
      } catch (error) {}
    }
  }
}
/**
 * socket客户端端口链接时移除
 * @param {*} socketId
 */
const removeSocketId = socketId => {
  for (let role of Object.keys(group)) {
    const index = group[role].socketIds.indexOf(socketId)
    if (index >= 0) {
      group[role].socketIds.splice(index, 1)
      if (group[role].socketIds.length === 0) {
        delete group[role]
      }
      return
    }
  }
}

module.exports = {
  getUserByToken,
  maintainResourceByRole,
  emitByResPermisson,
  getSocketIdsByResource,
  removeSocketId
}
