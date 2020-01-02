/*
 * @Author: litao
 * @Date: 2019-07-26 09:21:13
 * 该模块主要提供对人车同检的(核验分数)进行维护
 * -----------------------------README-----------------------------
 * show()   获取核验分数
 * create()  修改||初始化核验分数
 */
'use strict'

const VerificationScore = mongoose.model('verificationscore')

const { handleSysException } = require('../../../common/tools')
const Config = require('../../../../config')

const show = async ctx => {
  try {
    const result = await VerificationScore.findOne({}, '_id score days').lean()

    ctx.body = result
  } catch (error) {
    handleSysException(error)
  }
}

const update = async ctx => {
  try {
    const { id: _id } = ctx.params
    const score = ctx.request.body.score || Config.backend.intelligentTraffic.score
    const days = ctx.request.body.days || Config.backend.intelligentTraffic.days

    await VerificationScore.findOneAndUpdate({ _id }, { score, days })

    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }

}


module.exports = {
  show,
  update
}
