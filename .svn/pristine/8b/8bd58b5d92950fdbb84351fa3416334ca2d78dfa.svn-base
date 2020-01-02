/*
 * 预案接口
 * @Author: chenkaibo
 * @Date: 2018-06-06 15:02:14
 * @Last Modified by: lushengying
 * @Last Modified time: 2019-08-22 15:49:16
 */

'use strict'
const mongoose = require('mongoose')
const Plan = mongoose.model('Plan')
const Wall = mongoose.model('Wall')
const PlatformServer = mongoose.model('PlatformServer')
const { switchPlan } = require('../../../bstar/tvwall.interface')
const { getNowScene, checkAddName, checkModifyName } = require('../tool')
const { handleSysException, transferPinyin } = require('../../../../common/tools')

exports.add = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电视墙-添加预案'))
    const res = await checkAddName(Plan, ctx.request.body.name, ctx.request.body.wall)
    if (res) {
      ctx.throw(500, { code: 5, message: '该名称已存在' })
    }
    ctx.request.body.pinyin = transferPinyin(ctx.request.body.name)
    const plan = new Plan(ctx.request.body)
    const doc = await plan.save()
    ctx.status = 201
    ctx.set('Location', `/plan/${doc._id}`)
    ctx.body = [doc._id]
  } catch (err) {
    console.log(err)
    ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1, message: '系统内部错误' })
  }
}

exports.modify = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电视墙-修改预案'))
    const res = await checkModifyName(Plan, ctx.params.id, ctx.request.body.name, ctx.request.body.wall)
    if (res) {
      ctx.throw(500, { code: 5, message: '该名称已存在' })
    }
    if (!ctx.request.body.wall) {
      ctx.throw(500, { code: 11, message: '参数不能为空' })
    }
    const wall = await Wall.findById(ctx.request.body.wall).exec()
    if (wall.selectedplan && wall.selectedplan + '' === ctx.params.id + '') {
      ctx.throw(500, { code: 7, message: '正在执行，不能修改' })
    }
    await Plan.findByIdAndUpdate(ctx.params.id, ctx.request.body).exec()
    ctx.status = 200
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1, message: '系统内部错误' })
  }
}

exports.delete = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电视墙-删除预案'))
    const wall = await Wall.findById(ctx.query.wall).exec()
    if (wall.selectedplan && wall.selectedplan + '' === ctx.params.id + '') {
      // const plan = await Plan.findById(ctx.params.id)
      // const now = Math.round((new Date().getTime()) / 1000)
      // if (now > plan.info[plan.info.length - 1].end) {
      ctx.throw(500, { code: 7, message: '正在执行，不能删除' })
      // }
    }
    await Plan.findByIdAndRemove(ctx.params.id).exec()
    ctx.status = 200
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1, message: '系统内部错误' })
  }
}

exports.use2 = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电视墙-执行预案'))
    const plan = await Plan.findById(ctx.params.id)
      .populate({
        path: 'info.scene',
        populate: [
          {
            path: 'polling',
            populate: {
              path: 'channels',
              populate: {
                path: 'eid'
              }
            }
          },
          {
            path: 'info.resources.resource',
            populate: {
              path: 'eid'
            }
          },
          // 'info.monitor'
          {
            path: 'info.monitor',
            populate: {
              path: 'equipment channel'
            }
          }
        ]
      })
      .exec()
    console.log('plan-----', JSON.stringify(plan))
    const body = {
      scenceList: plan.toObject().info.map(planinfo => {
        return {
          isSceneswitch: true,
          cameraGroup: {
            cameraList: !planinfo.scene.polling
              ? []
              : planinfo.scene.polling.channels.map(channel => {
                return {
                  devIp: channel.eid.ip,
                  devPort: channel.eid.cport,
                  channel: channel.chan,
                  stream: channel.stream,
                  streamConnPort: channel.eid.dport
                }
              }),
            interval: !planinfo.scene.polling ? 0 : planinfo.scene.polling.interval
          },
          monitorConf: planinfo.scene.info.map(item => {
            return {
              devIp: item.monitor.equipment.ip,
              devPort: item.monitor.equipment.cport,
              monitor: item.monitor.channel.chan,
              playType:
                item.type === 2
                  ? 2
                  : planinfo.scene.polling &&
                    planinfo.scene.polling.monitorsinfo.findIndex(monitor => monitor + '' === item.monitor._id + '') !==
                    -1
                    ? 1
                    : 0,
              paneCount: item.panecount,
              paneTag: item.monitor.startcode,
              panePlay: item.resources.map(item => {
                return {
                  pane: item.code,
                  devIp: item.resource.eid.ip,
                  devPort: item.resource.eid.cport,
                  channel: item.resource.chan,
                  stream: item.resource.stream,
                  streamConnPort: item.resource.eid.dport
                }
              })
            }
          }),
          begin: planinfo.start,
          end: planinfo.end
        }
      })
    }
    try {
      console.log('--------', JSON.stringify(body))
      await switchPlan(ctx, body)
    } catch (error) {
      return ctx.throw(500, {
        code: error.error,
        message: '操作未成功,请重试一下',
        type: 'sys',
        errInfo: '/api/wall/preplanexecute'
      })
    }
    const updateData = { selectedplan: ctx.params.id }
    const scene = getNowScene(plan)
    if (scene) {
      updateData.selectedscene = scene._id
    }
    await Wall.findByIdAndUpdate(plan.wall, updateData)
    ctx.status = 200
  } catch (err) {
    // return ctx.throw(500, err.code ? { code: err.code, message: err.message, type: err.type || '' } : { code: 1001, message: '系统内部错误' })
    handleSysException(err)
  }
}

exports.use = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电视墙-执行预案'))
    const plan = await Plan.findById(ctx.params.id).populate({
      path: 'info.scene',
      populate: [
        {
          path: 'polling',
          populate: [
            {
              path: 'channels',
              populate: {
                path: 'eid',
                select: 'ip cport dport deviceStatus'
              }
            },
            {
              path: 'monitorsinfo',
              populate: {
                path: 'equipment'
              }
            }
          ]
        },
        {
          path: 'info.resources.resource',
          populate: {
            path: 'eid'
          }
        },
        {
          path: 'info.monitor',
          populate: {
            path: 'equipment channel'
          }
        },
        {
          path: 'layout'
        }
      ]
    })
      .lean()
      .exec()

    const { jointcontroller } = await Wall.findById(plan.wall, 'jointcontroller')
      .lean()
      .exec()
    plan.info.map(info => {
      // 轮询判断
      _.get(info.scene, 'polling', []).map(polling => {
        // 轮询使用的解码器
        let monitorsinfo = []
        let channels = []
        polling.monitorsinfo.map(monitior => monitior.equipment.deviceStatus === 1 && monitorsinfo.push(monitior._id))
        // 轮询使用的镜头(视频通道)
        if (!_.isEmpty(monitorsinfo)) {
          polling.channels.map(channel => channel.eid.deviceStatus === 1 && channels.push(channel))
        }
        polling.monitorsinfo = monitorsinfo
        polling.channels = channels
      })
      // 画面详情
      info.scene.info.map(info => {
        // 画面监视器
        let monitorsinfo = {}
        let resource = []
        if (info.monitor.equipment.deviceStatus === 1) {
          monitorsinfo = info.monitor
        }
        // 画面挂载的镜头
        if (!_.isEmpty(monitorsinfo)) {
          info.resources.map(res => {
            res.resource.eid.deviceStatus === 1 && resource.push(res)
          })
        }
        info.monitorsinfo = monitorsinfo
        info.resources = resource
      })
    })
    console.log('plan-----', JSON.stringify(plan))
    // 国标平台id和serverId的映射
    const gbServerMap = {}
    const gbSvrs = await PlatformServer.find({}).lean()
    gbSvrs.forEach(svr => {
      gbServerMap[svr._id + ''] = svr.serverId
    })
    const body = {
      scenceList: plan.info.map(planinfo => {
        let pollingMonitors = []
        planinfo.scene.polling.length &&
          planinfo.scene.polling.forEach(item => {
            pollingMonitors = [...pollingMonitors, ...item.monitorsinfo]
          })
        const monitorConfs = planinfo.scene.info.map(item => {
          return {
            devIp: item.monitor.equipment.ip,
            devPort: item.monitor.equipment.cport,
            monitor: item.monitor.channel.chan,
            monitorId: item.monitor._id.toString(),
            playType:
              item.type === 2
                ? 2
                : pollingMonitors.length &&
                  pollingMonitors.findIndex(monitor => monitor.toString() === item.monitor._id.toString()) !== -1
                  ? 1
                  : 0,
            paneCount: item.panecount,
            paneTag: item.monitor.startcode,
            panePlay: item.resources.map(item => {
              if (item.gbDevId && item.nodeId) {
                return {
                  pane: item.code,
                  channel: item.resource.chan,
                  stream: item.resource.stream,
                  streamConnPort: item.resource.eid.dport,
                  gbPlaDevIp: item.resource.gbPlaDevIp,
                  gbPlaDevPort: +item.resource.gbPlaDevPort,
                  gbDevId: item.resource.nodeId,
                  gbPlaNvrId: gbServerMap[item.resource.shareServer] || ''
                }
              } else {
                return {
                  pane: item.code,
                  devIp: item.resource.ip,
                  devPort: item.resource.eid.cport,
                  channel: item.resource.chan,
                  stream: item.resource.stream,
                  streamConnPort: item.resource.eid.dport
                }
              }
            })
          }
        })
        let pollingInfos = []
        if (planinfo.scene.polling.length) {
          pollingInfos = planinfo.scene.polling.map(item => {
            return {
              isSceneswitch: true,
              cameraGroup: {
                cameraList: !item
                  ? []
                  : item.channels.map(item => {
                    if (item.gbDevId && item.nodeId) {
                      return {
                        channel: item.chan,
                        stream: 'main', // item.stream 国标设备暂定 只为main
                        streamConnPort: item.eid.dport,
                        gbPlaDevIp: item.gbPlaDevIp,
                        gbPlaDevPort: +item.gbPlaDevPort,
                        gbDevId: item.nodeId,
                        gbPlaNvrId: gbServerMap[item.shareServer] || ''
                      }
                    } else {
                      return {
                        devIp: item.ip,
                        devPort: item.eid.cport,
                        channel: item.chan,
                        stream: item.stream,
                        streamConnPort: item.eid.dport
                      }
                    }
                  }),
                interval: !item ? 0 : item.interval
              },
              monitorConf: monitorConfs.filter(monitorConf => {
                if (item.monitorsinfo.findIndex(monitior => monitior + '' === monitorConf.monitorId) !== -1) {
                  delete monitorConf.monitorId
                  delete monitorConf.panePlay
                  return monitorConf
                }
              })
            }
          })
        }
        if (jointcontroller) {
          const stictchingScenesCall = {
            devInfo: {
              devIp: jointcontroller.info.ip,
              port: jointcontroller.info.port
            },
            scenesCall: { sScreenId: 0, scenesId: planinfo.scene.layout.sceneid }
          }
          return {
            stictchingScenesCall,
            sceneswitch: [
              ...pollingInfos,
              ...monitorConfs
                .filter(item => item.playType !== 1)
                .map(item => {
                  delete item.monitorId
                  return {
                    cameraGroup: {
                      cameraList: [],
                      interval: 0
                    },
                    monitorConf: [item]
                  }
                })
            ],
            begin: planinfo.start,
            end: planinfo.end
          }
        } else {
          return {
            sceneswitch: [
              ...pollingInfos,
              ...monitorConfs
                .filter(item => item.playType !== 1)
                .map(item => {
                  delete item.monitorId
                  return {
                    cameraGroup: {
                      cameraList: [],
                      interval: 0
                    },
                    monitorConf: [item]
                  }
                })
            ],
            begin: planinfo.start,
            end: planinfo.end
          }
        }
      })
    }
    try {
      console.log('--------', JSON.stringify(body))
      await switchPlan(ctx, body)
    } catch (error) {
      return ctx.throw(500, {
        code: error.error,
        message: '操作未成功,请重试一下',
        type: 'sys',
        errInfo: '/api/wall/preplanexecute'
      })
    }
    const updateData = { selectedplan: ctx.params.id }
    const scene = getNowScene(plan)
    if (scene) {
      updateData.selectedscene = scene._id
    }
    await Wall.findByIdAndUpdate(plan.wall, updateData)
    ctx.status = 200
  } catch (err) {
    // return ctx.throw(500, err.code ? { code: err.code, message: err.message, type: err.type || '' } : { code: 1001, message: '系统内部错误' })
    handleSysException(err)
  }
}
