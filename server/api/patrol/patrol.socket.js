/**
 * 巡更socket推送接口
 * @time:2018-3-21
 * @author: hansen
 */
const _ = require('lodash')
const controller = require('./patrol.controller')
// const SentryService = require('../sys/sentry/sentry.service.js')
const Security = mongoose.model('Security')
const User = mongoose.model('User')
// const sentryService = new SentryService()
let socketIo = null
const appUserSet = []
const pcUserSet = []

// 保存io对象
const init = (socket, io, user) => {
  if (socketIo === null) {
    socketIo = io
  }
  // 巡更APP用户socket注册
  if (user.sn) {
    const usrid = user._id.toString()
    console.log('jd-user._id', usrid, 'jd-socket.id', socket.id)
    console.log('jd-appUserSet', JSON.stringify(appUserSet))
    const usr = _.find(appUserSet, item => item.usrid === usrid)
    console.log('jd-usr', JSON.stringify(usr))
    if (!usr) {
      appUserSet.push({ usrid, sid: socket.id })
    } else {
      _.remove(appUserSet, item => item.usrid === usrid)
      appUserSet.push({ usrid, sid: socket.id })
    }
    console.log('jd-appUserSet', 'userid: mongoId, sid: socketId')
    console.log('jd-appUserSet', JSON.stringify(appUserSet))
    controller.updDevStatus({ usrid }, 'online')
    console.log('jd-手机单兵注册')
    io.sockets.emit('patrol:sentry.status', { usrid, status: 'online' })
  }
  // socket.on('client:sentry', function (data) {
  //   const user = _.find(appUserSet, item => item.usrid === data.usrid)
  //   if (!user) {
  //     appUserSet.push(_.assign(data, { sid: socket.id }))
  //   } else {
  //     _.remove(appUserSet, item => item.usrid === data.usrid)
  //     appUserSet.push(_.assign(data, { sid: socket.id }))
  //   }
  //   controller.updDevStatus(data, 'online')
  //   console.log('jd-手机单兵注册')
  //   io.sockets.emit('patrol:sentry.status', { userid: data.usrid, status: 'online' })
  // })
  // PC电子地图即时通讯socket人员注册
  socket.on('patrol:instant.message', function (data) {
    console.log('jd-pcUserSet', JSON.stringify(pcUserSet))
    console.log('jd-当前socket.id', socket.id)
    console.log('jd-当前用户id', JSON.stringify(data))
    if (!_.find(pcUserSet, item => item.usrid === data.usrid)) {
      pcUserSet.push(_.assign(data, { sid: socket.id }))
    }
    console.log('jd-PC注册')
    console.log('jd-pcUserSet', 'userid: mongoId, sid: socketId')
    console.log('jd-pcUserSet', JSON.stringify(pcUserSet))
    io.sockets.emit('instant.status', { userid: data.usrid, status: 'online' })
  })
  // 监听断开链接
  socket.on('disconnect', async function () {
    console.log('jd-disconnect')
    const app = _.find(appUserSet, item => item.sid === socket.id)
    console.log('jd-socket.id', socket.id)
    console.log('jd-appUserSet', JSON.stringify(appUserSet))
    console.log('jd-pcUserSet', JSON.stringify(pcUserSet))
    console.log('jd-app', JSON.stringify(app))
    if (!app) {
      // 会话中断，无法以mongo的id作为判断，只能以socket.id判断
      /**
       * 判断，是保存socket.id
       * 判断，此时断开是全部断开
       * sockets[src.sid]
       */
      const src = _.find(pcUserSet, item => item.sid === socket.id) // 只关掉当前PC的会话
      console.log('jd-src', JSON.stringify(src))
      if (src) {
        console.log('jd-PC离线')
        /**
         * 确定'server:pc.disconnect'，app端是什么操作
         * 来判断是发送给指定人员还是app端改代码
         */
        // io.sockets.emit('server:pc.disconnect', { userid: src.usrid, status: 'offline' })
        if (src.speech) {
          await io.sockets.sockets[src.speech].emit('server:pc.disconnect', { userid: src.usrid, status: 'offline' })
        }
        console.log('jd-src.radio', src.radio)
        if (src.radio) {
          io.to(src.radio.srcId).emit('server:broadcast.disconnect', src.radio)
          await Promise.all(
            src.radio.appUser.map(item => {
              console.log('jd-退出id', src.radio.srcId)
              socketIo.sockets.sockets[item.sid].leave(`${src.radio.srcId}`)
            })
          )
        }
      }
      _.remove(pcUserSet, item => item.sid === socket.id)
      return
    }
    console.log('jd-单兵离线')
    controller.updDevStatus(app, 'offline')
    io.sockets.emit('patrol:sentry.status', { userid: app.usrid, status: 'offline' })
    _.remove(appUserSet, item => item.sid === socket.id)
  })

  // 回复双向对讲消息
  socket.on('server:intercom.connect', async function (data, fn) {
    try {
      // let src
      // let des
      // console.log('jd-确认收到对讲')
      // if (data.src === 'PC') {
      //   src = pcUserSet.find(item => item.usrid === data.srcId)
      //   des = appUserSet.find(item => item.usrid === data.destId)
      // } else {
      //   src = pcUserSet.find(item => item.usrid === data.destId)
      //   des = appUserSet.find(item => item.usrid === data.srcId)
      // }
      // if (!src && !des) {
      //   data.status = 'error'
      // }
      // if (src && des) {
      //   const userInfo = await User.findById(src.usrid, 'name').exec()
      //   const secInfo = await Security.findById(des.usrid, 'sn username').exec()
      //   Object.assign(data, {
      //     pcName: userInfo.name,
      //     appName: secInfo.username,
      //     sn: secInfo.sn
      //   })
      //   socketIo.sockets.sockets[src.sid].emit('server:intercom.complete', data)
      //   console.log('jd-通知拉流 发送完成')
      //   fn({ error: 0 })
      // } else {
      //   console.log('jd-server:intercom.connect:', `${src ? '' : 'PC用户断线'}${des ? '' : 'APP用户断线'}`)
      //   fn({ error: 1, info: `${src ? '' : 'PC用户断线'}${des ? '' : 'APP用户断线'}` })
      // }
      let src
      let des
      console.log('jd-确认收到对讲', JSON.stringify(data))
      if (data.src === 'PC') {
        src = pcUserSet.findIndex(item => item.usrid === data.srcId) // userId session 中的userId 登陆时的userId
        des = appUserSet.findIndex(item => item.usrid === data.destId) // soldierId 巡更单兵的id
      } else {
        src = pcUserSet.findIndex(item => item.usrid === data.destId) // userId session 中的userId 登陆时的userId
        des = appUserSet.findIndex(item => item.usrid === data.srcId) // soldierId 巡更单兵的id
      }
      if (!pcUserSet[src] && !appUserSet[des]) {
        data.status = 'error'
      }
      if (pcUserSet[src] && appUserSet[des]) {
        if (data.src === 'PC') {
          pcUserSet[src].speech = appUserSet[des].sid
          appUserSet[des].speech = pcUserSet[src].sid
        } else {
          pcUserSet[src].speech = appUserSet[des].sid
          appUserSet[des].speech = pcUserSet[src].sid
        }
        const userInfo = await User.findById(pcUserSet[src].usrid, 'name').exec()
        const secInfo = await Security.findById(appUserSet[des].usrid, 'sn username').exec()
        Object.assign(data, {
          pcName: userInfo.name,
          appName: secInfo.username,
          sn: secInfo.sn
        })
        socketIo.sockets.sockets[pcUserSet[src].sid].emit('server:intercom.complete', data)
        console.log('jd-通知拉流 发送完成', 'data', JSON.stringify(data))
        fn({ error: 0 })
      } else {
        console.log('jd-server:intercom.connect:', `${pcUserSet[src] ? '' : 'PC用户断线'}${appUserSet[des] ? '' : 'APP用户断线'}`)
        fn({ error: 1, info: `${pcUserSet[src] ? '' : 'PC用户断线'}${appUserSet[des] ? '' : 'APP用户断线'}` })
      }
    } catch (error) {
      console.error(error)
      console.log('jd-通知开流 报错', error)
      fn({ error: 1, info: `发送失败` })
    }
  })
}

// 巡更报警
const patrolAlarm = data => {
  if (socketIo) {
    socketIo.sockets.emit('server:patrol.alarm', data)
  }
}

// 巡更状态通知
const patrolStatus = data => {
  if (socketIo) {
    socketIo.sockets.emit('server:patrol.status', data)
  }
}

// 单兵消息采集
const sentryMessage = data => {
  if (socketIo) {
    socketIo.sockets.emit('server:sentry.message', data)
  }
}

// 中心消息推送单兵
const patrolMessage = data => {
  if (socketIo) {
    socketIo.sockets.emit('server:patrol.message', data)
  }
}

// 单兵消息推送中心
const instantMessage = data => {
  if (socketIo) {
    let receiver = ''
    if (data.source === 'app') {
      receiver = pcUserSet.find(item => item.usrid === data.receiver)
    } else {
      receiver = appUserSet.find(item => item.usrid === data.receiver)
    }
    if (receiver) {
      socketIo.sockets.sockets[receiver.sid].emit('server:instant.message', data)
    }
  }
}

// 单兵巡更确认
const patrolConfirm = data => {
  if (socketIo) {
    socketIo.sockets.emit('server:patrol.confirm', data)
  }
}

// 单兵在线用户
const patrolUser = data => {
  if (socketIo) {
    socketIo.sockets.emit('server:patrol.user', data)
  }
}
// 单兵报警
const sentryAlarm = data => {
  if (socketIo) {
    socketIo.sockets.emit('server:sentry.alarm', data)
  }
}
// 单兵超时
const sentryTimeOut = data => {
  if (socketIo) {
    socketIo.sockets.emit('server:sentry.timeOut', data)
  }
}
// 单兵实时位置
const sentryLocation = data => {
  if (socketIo) {
    socketIo.sockets.emit('server:sentry.location', data)
  }
}
// 发起双向对讲
const intercom = async data => {
  if (socketIo) {
    // 如为发送方为手机端则对全体Web发送回话请求.
    let usr
    console.log('jd-data.src', data.src)
    if (data.src === 'APP') {
      usr = pcUserSet.find(item => item.usrid === data.destId)
      const info = await Security.findById(data.srcId, 'username realname photo sn affiliation')
        .populate({
          path: 'affiliation',
          select: 'name'
        })
        .exec()
      Object.assign(data, {
        username: info.username,
        realname: info.realname,
        photo: info.photo,
        affiliation: info.affiliation,
        sn: info.sn
      })
    } else {
      // 如发送方为PC则指定手机端用户
      const userInfo = await User.findById(data.srcId, 'name').exec()
      Object.assign(data, {
        name: userInfo.name
      })
      usr = appUserSet.find(item => item.usrid === data.destId)
    }
    console.log('jd-server:intercom.request: 发送', 'usr', JSON.stringify(usr))
    if (usr) {
      socketIo.sockets.sockets[usr.sid].emit('server:intercom.request', data)
      console.log('jd-server:intercom.request: 发送完', 'data', JSON.stringify(data))
    } else {
      return { error: 2002, message: `${data.src === 'APP' ? 'PC用户' : 'APP用户'}不在线` }
    }
  }
}

// 进行对讲断开
const speechDisconnet = data => {
  if (socketIo) {
    let src, des, n, m
    if (data.src === 'PC') {
      n = pcUserSet.findIndex(item => item.usrid === data.srcId)
      m = appUserSet.findIndex(item => item.usrid === data.destId)
      src = pcUserSet[n]
      des = appUserSet[m]
      delete appUserSet[m].speech
      delete pcUserSet[n].speech
    } else {
      n = appUserSet.findIndex(item => item.usrid === data.srcId)
      m = pcUserSet.findIndex(item => item.usrid === data.destId)
      src = appUserSet[n]
      des = pcUserSet[m]
      delete appUserSet[n].speech
      delete pcUserSet[m].speech
    }
    console.log('jd-server:intercom.disconnect: 发送')
    if (src) {
      socketIo.sockets.sockets[src.sid].emit('server:intercom.disconnect', data)
    }
    if (des) {
      socketIo.sockets.sockets[des.sid].emit('server:intercom.disconnect', data)
    }
    console.log('jd-server:intercom.disconnect: 发送完')
  }
}
// 巡更app实时视频推流、关流
const patrolRtmp = data => {
  if (socketIo) {
    const usr = appUserSet.find(item => item.usrid === data.id)
    if (usr) {
      socketIo.sockets.sockets[usr.sid].emit('app:rtmp', data)
    }
  }
}

// WEB对单兵进行广播
const broadcast = async data => {
  if (socketIo) {
    console.log('jd-WEB对单兵进行广播', JSON.stringify(data))
    const filUsers = appUserSet.filter(item => data.destId.includes(item.usrid)) // 所有注册中的选中项
    const offlineUsers = data.destId.filter(e => !appUserSet.find(f => f.usrid === e)) // 离线的
    console.log('jd-filUsers', JSON.stringify(filUsers))
    console.log('jd-offlineUsers', JSON.stringify(offlineUsers))
    // destId 单兵id array
    //   const body = {
    //     srcName: data.name, // pcname
    //     srcId: data.srcId, // pc id
    //     url: data.avInfo.url // url
    //   }
    //   console.log('jd-server:broadcast.request: 发送')
    //   await Promise.all(
    //     filUsers.map(async item => {
    //       console.log('jd-sid:', item.sid)
    //       await socketIo.sockets.sockets[item.sid].emit('server:broadcast.request', body)
    //     })
    //   )
    //   console.log('jd-server:broadcast.request: 发送完')
    // }
    const srcNum = pcUserSet.findIndex(item => data.srcId === item.usrid) // web用户
    const src = pcUserSet[srcNum]
    console.log('jd-src', JSON.stringify(src))
    const body = {
      srcName: data.name,
      srcId: data.srcId,
      url: data.avInfo.url
    }
    console.log('jd-body', JSON.stringify(body))
    socketIo.sockets.sockets[src.sid].join(`${body.srcId}`)
    console.log('jd-开始加入房间', 'web创建房间，房间名：' + body.srcId)
    await Promise.all(
      filUsers.map(item => {
        console.log('jd-加入id', item.sid)
        socketIo.sockets.sockets[item.sid].join(`${body.srcId}`)
      })
    )
    console.log('jd-socketIo', socketIo)
    console.log('jd-加入房间完成,开始广播', '房间名：' + body.srcId)
    await socketIo.to(body.srcId).emit('server:broadcast.request', body)
    pcUserSet[srcNum].radio = {
      srcId: body.srcId,
      url: body.url,
      appUser: filUsers
    }
    console.log('jd-发送广播完成')
    return offlineUsers
  }
}
// 广播断开
const broadcastDisconnet = async data => {
  if (socketIo) {
    console.log('jd-广播断开', JSON.stringify(data))
    const filUsers = appUserSet.filter(item => data.destId.includes(item.usrid)) // 所有注册中的选中项
    console.log('jd-filUsers', JSON.stringify(filUsers))
    const body = {
      srcName: data.name,
      srcId: data.srcId,
      url: data.avInfo.url
    }
    console.log('jd-body', JSON.stringify(body))
    console.log('jd-server:broadcast.disconnect: 发送', '房间名：' + body.srcId)
    await socketIo.to(body.srcId).emit('server:broadcast.disconnect', body) // 断开，url是必须的
    console.log('jd-server:broadcast.disconnect: 发送完')
    await Promise.all(
      filUsers.map(item => {
        console.log('jd-退出id', item.sid)
        socketIo.sockets.sockets[item.sid].leave(`${body.srcId}`)
      })
    )
    const srcNum = pcUserSet.findIndex(item => data.srcId === item.usrid)
    delete pcUserSet[srcNum].radio
    console.log('jd-server:broadcast.disconnect: 发送完')
  }
}

// 广播加入
const broadcastJoin = async data => {
  if (socketIo) {
    const filUsers = appUserSet.filter(item => data.destId.includes(item.usrid))
    const offlineUsers = data.destId.filter(e => !appUserSet.find(f => f.usrid === e))
    console.log(offlineUsers)
    const body = {
      srcName: data.name,
      srcId: data.srcId,
      url: data.avInfo.url
    }
    console.log('jd-server:broadcast.request Join: 发送>>>>>>')
    await Promise.all(
      filUsers.map(item => {
        console.log('jd-加入id', item.sid)
        socketIo.sockets.sockets[item.sid].join(`${body.srcId}`) // 加入房间
        socketIo.sockets.sockets[item.sid].emit('server:broadcast.request', body) // 单独发送请求
      })
    )
    console.log('<<<<<<jd-server:broadcast.request Join: 发送完')
    return offlineUsers
  }
}

// 通知app拉流
const sentryPullFlow = async data => {
  if (socketIo) {
    try {
      let src
      let des
      if (data.src === 'PC') {
        src = pcUserSet.find(item => item.usrid === data.srcId)
        des = appUserSet.find(item => item.usrid === data.destId)
      } else {
        src = pcUserSet.find(item => item.usrid === data.destId)
        des = appUserSet.find(item => item.usrid === data.srcId)
      }
      if (!src && !des) {
        data.status = 'error'
      }
      if (src && des) {
        const userInfo = await User.findById(src.usrid, 'name').exec()
        const secInfo = await Security.findById(des.usrid, 'sn username').exec()
        Object.assign(data, {
          pcName: userInfo.name,
          appName: secInfo.username,
          sn: secInfo.sn
        })
        await socketIo.sockets.sockets[des.sid].emit('server:intercom.complete', data)
        console.log('jd-通知拉流 发送完成')
      } else {
        console.log('jd-server:intercom.connect:', `${src ? '' : 'PC用户断线'}${des ? '' : 'APP用户断线'}`)
      }
    } catch (error) {
      console.error(error)
      console.log('jd-通知开流 报错', error)
    }
  }
}

module.exports = {
  init,
  patrolAlarm,
  sentryMessage,
  patrolMessage,
  patrolUser,
  sentryAlarm,
  patrolRtmp,
  sentryLocation,
  patrolConfirm,
  patrolStatus,
  instantMessage,
  sentryTimeOut,
  intercom,
  broadcast,
  speechDisconnet,
  broadcastDisconnet,
  broadcastJoin,
  sentryPullFlow
}
