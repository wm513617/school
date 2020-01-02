'use strict'
const _ = require('lodash')
const threshold = 1000
const operationCache = {}
/**
 * page query func
 */
module.exports = {
  listQuery: async function (schema, search, selection, sort, pageObj = { limit: 10, page: 1 }, population, ctx) {
    for (var key in search) {
      if (search[key] === undefined || search[key] === '' || search[key] === null) {
        delete search[key]
      }
    }
    const [count, results] = await Promise.all([
      schema.countDocuments(search).exec(),
      schema
        .find(search, selection)
        .populate(population)
        .sort(sort)
        .skip((+pageObj.page - 1) * +pageObj.limit)
        .limit(+pageObj.limit)
        .exec()
    ])
    ctx.set({
      'X-BSC-COUNT': count,
      'X-BSC-PAGES': Math.ceil(count / pageObj.limit),
      'X-BSC-CUR': parseInt(pageObj.page),
      'X-BSC-LIMIT': parseInt(pageObj.limit)
    })
    return {
      results: _.isEmpty(results) ? [] : results
    }
  },
  largeListQuery: async function (schema, search, sort, next, operationId) {
    for (var key in search) {
      if (search[key] === undefined || search[key] === '' || search[key] === null) {
        delete search[key]
      }
    }
    const query = JSON.parse(JSON.stringify(search))
    if (operationCache[operationId]) {
      const cursor = operationCache[operationId]
      if (cursor.length > 0) {
        if (next > 0) {
          query.time.$lte = cursor[cursor.length - 1].end.time
        } else {
          cursor.pop()
          query.time.$lte = cursor.pop().begin.time
        }
      }
    }
    const results = await schema
      .find(query)
      .sort(sort || { time: -1 })
      .limit(threshold)
      .lean()
    // previouse用于翻页中的前一页第一条数据，end为本轮查询的最后一条数据
    if (operationCache[operationId]) {
      const cursor = operationCache[operationId]
      if (cursor.length > 0) {
        cursor.push({
          begin: cursor[cursor.length - 1].end,
          end: results[results.length - 1]
        })
      } else {
        cursor.push({
          begin: results[0],
          end: results[results.length - 1]
        })
      }
    } else {
      operationCache[operationId] = [
        {
          begin: results[0],
          end: results[results.length - 1]
        }
      ]
    }
    return {
      results: _.isEmpty(results) ? [] : results
    }
  }
}
