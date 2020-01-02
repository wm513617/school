/*
 * @Author: linhang
 * @Date: 2019-07-03 17:15:20
 * @Last Modified by: linhang
 * @Last Modified time: 2019-07-15 14:04:40
 */
const Redis = require('ioredis')

let redis = new Redis({
  host: process.env.redisUri,
  port: process.env.redisPort,
  db: 0,
  password: Buffer.from(process.env.redisPassword, 'base64').toString()
})
redis.on('connect', msg => {
  console.log('------redis连接成功------')
})
redis.on('error', err => {
  console.log('------redis连接失败:', err.message)
})

module.exports = redis
