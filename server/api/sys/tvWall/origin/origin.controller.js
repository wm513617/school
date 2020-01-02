/*
 * @Author: chenkaibo
 * @Date: 2018-08-14 14:24:30
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2018-12-20 15:53:30
 */
'use strict'
const mongoose = require('mongoose')
const Origin = mongoose.model('Origin')
const { handleSysException } = require('../../../../common/tools')

// 添加
exports.add = async ctx => {
  try {
    await Origin.create(ctx.request.body)
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}

// 获取解码器通道和源对应关系
exports.getAllByWall = async ctx => {
  try {
    const origins = await Origin.find({ wall: ctx.params.wall })
      .populate([
        {
          path: 'decodechan',
          select: 'name'
        },
        {
          path: 'jointorigin',
          select: 'name'
        }
      ])
      .exec()
    ctx.body = origins
  } catch (error) {
    handleSysException(error)
  }
}

// 修改解码器通道和源对应关系
// exports.update = async (ctx) => {
//   try {
//     if (!ctx.request.body.decodechan) {
//       const monitorObj = await Monitor.findOneAndRemove({ jointorigin: ctx.request.body.jointorigin }).lean().exec()
//       if (_.has(monitorObj, 'wall')) {
//         const { rtscene } = await Wall.findById(monitorObj.wall).populate('rtscene').lean().exec()
//         // 删除监视器的同时删除轮询和场景里的监视器配置
//         await Promise.all([
//           updateOnePollingMonitorPosition(monitorObj),
//           updateOneSenceMonitorPosition(monitorObj)
//         ])
//         await Scene.findByIdAndUpdate(rtscene._id, rtscene).exec()
//         // 更新电视墙所有布局中的monitor
//         const layouts = await Layout.find({ wall: monitorObj.wall }).lean().exec()
//         const promArr = []
//         layouts.forEach(layout => {
//           layout.wininfo.forEach(win => {
//             if (win.monitor + '' === monitorObj._id + '') delete win.monitor
//           })
//           promArr.push(Layout.findByIdAndUpdate(layout._id, layout))
//         })
//         await Promise.all(promArr)
//       }
//       await Origin.findByIdAndUpdate(ctx.params.id, { $unset: { decodechan: 1 } }).exec()
//     } else {
//       const { decodechan } = await Origin.findById(ctx.params.id, 'decodechan').lean().exec()
//       // 对源为空的数据设置解码器
//       if (!decodechan) {
//         const { chan } = await Resouece.findById(ctx.request.body.jointorigin, 'chan').lean().exec()
//         const { wall } = await Origin.findOne({ jointorigin: ctx.request.body.jointorigin }, 'wall layout').lean().exec()
//         const decode = await Resouece.findById(ctx.request.body.decodechan, 'eid chan').populate({ path: 'eid', select: 'ip cport username password' }).lean().exec()
//         const monitor = { name: `解码器${chan}`, code: `00${chan}`, position: chan, startcode: 1, wall, channel: ctx.request.body.decodechan, jointorigin: ctx.request.body.jointorigin, equipment: decode.eid._id }
//         const docs = await Monitor.create(monitor)
//         // 初始化窗格分割为1,
//         const body = {
//           devInfo: {
//             devIp: decode.eid.ip,
//             devPort: decode.eid.cport,
//             vendor: 1,
//             version: '',
//             username: decode.eid.username,
//             password: decode.eid.password,
//             flag: 1
//           },
//           devCtl: {
//             MonitorCfgPrmArr: [
//               {
//                 monitor: decode.chan,
//                 paneCnt: 4
//               }
//             ]
//           }
//         }
//         try {
//           await setMonitorCfg(ctx, body)
//         } catch (error) {
//           console.log('set---', error)
//           return ctx.throw(500, { code: error.error, message: '操作未成功,请重试一下', type: 'sys' })
//         }
//         // 更新实时场景
//         const { rtscene } = await Wall.findById(wall).populate('rtscene').lean().exec()
//         rtscene.info.push({ monitor: docs._id, type: 0, panecount: 4, resources: [] })
//         await Scene.findByIdAndUpdate(rtscene._id, rtscene).exec()
//         // 更新电视墙所有布局中的monitor
//         const layouts = await Layout.find({ wall }).lean().exec()
//         const promArr = []
//         layouts.forEach(layout => {
//           layout.wininfo.forEach(win => {
//             if (win.origin + '' === ctx.request.body.jointorigin + '') win.monitor = docs._id
//           })
//           promArr.push(Layout.findByIdAndUpdate(layout._id, layout))
//         })
//         await Promise.all(promArr)
//         await Origin.findByIdAndUpdate(ctx.params.id, ctx.request.body).exec()
//       } else {
//         await Promise.all([
//           Origin.findByIdAndUpdate(ctx.params.id, ctx.request.body).exec(),
//           Monitor.updateOne({ jointorigin: ctx.request.body.jointorigin }, { channel: ctx.request.body.decodechan })
//         ])
//       }
//     }
//     ctx.body = 200
//   } catch (error) {
//     handleSysException(error)
//   }
// }
exports.update = async ctx => {
  try {
    if (!ctx.request.body.decodechan) {
      await Origin.findByIdAndUpdate(ctx.params.id, { $unset: { decodechan: 1 } }).exec()
    } else {
      await Origin.findByIdAndUpdate(ctx.params.id, ctx.request.body).exec()
    }
    ctx.body = 200
  } catch (error) {
    handleSysException(error)
  }
}
// 根据解码通道获取对应的源
exports.getOriginByChan = async ctx => {
  try {
    const origin = await Origin.find({ jointorigin: ctx.params.chan })
      .populate([{ path: 'jointorigin', select: 'chan' }, { path: 'decodechan', select: 'name' }])
      .exec()
    ctx.status = 200
    ctx.body = origin.pop()
  } catch (error) {
    handleSysException(error)
  }
}
