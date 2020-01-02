import {
  post, get
} from './base'
// import resource from '../store/modules/resource'

// const CHANEURL = key => {
//   return '/api/record/query?' + ((obj) => {
//     let str = ''
//     for (const i in obj) {
//       str += '&' + i + '=' + obj[i]
//     }
//     return str.slice(1)
//   })(key)
// }
export const rpcGet = (url, method, params, addTokenQuery = false) => {
  return url + '&call=' + method + ((obj) => {
    let str = ''
    for (const i in obj) {
      str += '&' + i + '=' + obj[i]
    }
    return str
  })(params)
}

// 录像查询
export const AV_RECORD_LIST = ({
  devIp,
  devPort,
  channel,
  eventType = ['all'],
  typeName = '',
  typeContent = '',
  startTime,
  endTime,
  streamType = 'all'
}) => {
  devIp = formatIP(devIp)
  return new Promise(async(resolve, reject) => {
    let result = await post({
      url: 'record/query',
      body: {
        devIp,
        devPort,
        channel,
        eventType,
        typeName,
        typeContent,
        startTime: parseInt(startTime),
        endTime: parseInt(endTime),
        streamType,
        page: 1,
        rows: 10000
      }
    })
    try {
      if (result.data.result.total > 10000) {
        // 如果录像段超过10000条就在发送一条请求全部查询过来
        result = await post({
          url: 'record/query',
          body: {
            devIp,
            devPort,
            channel,
            eventType,
            typeName,
            typeContent,
            startTime: parseInt(startTime),
            endTime: parseInt(endTime),
            streamType,
            page: 1,
            rows: result.data.result.total
          }
        })
      }
      resolve(result)
    } catch (err) {
      resolve(result)
    }
  })
}
// 前端国标录像查询
// “gbDevIp”: “ ” ,  //前端设备通道的ip
// “gbDevPort”: int,  //前端设备通道的端口port
// “channel”: int,  //设备通道
// “platformID”: “ ”,  //国标平台id
// “gbDevId”: “ ”,  //国标设备id
// “recordType”: “timeRecord”,  //请求查询录像类型，见文件头上录像查询类型
// “startTime”: int,  //录像开始时间
// “endTime”: int,  //录像结束时间
// “streamType”: “main”,  //码流类型
export const GB_AV_NVRRECORD_LIST = (data) => {
  return post({
    url: 'record/frontdevGbQuery',
    body: data
  })
}

//  前端录像查询
export const AV_NVRRECORD_LIST = ({
  devIp, // 设备ip,
  devPort, // 设备端口,
  channel, // 通道号,
  recordType, // 录像请求类型,
  diskNum, // 硬盘分区,
  sTime, // 开始时间,
  eTime, // 结束时间,
  streamType = 'mian', // 码流类型,
  rowId,
  rowCount
}) => {
  devIp = formatIP(devIp)
  return post({
    url: 'playback/query',
    body: {
      devIp, // 设备ip,
      devPort, // 设备端口,
      channel, // 通道号,
      recordType, // 录像请求类型,
      diskNum, // 硬盘分区,
      sTime: parseInt(sTime), // 开始时间,
      eTime: parseInt(eTime), // 结束时间,
      streamType, // 码流类型,
      rowId,
      rowCount
    }
  })
}
// 国标前端回放开流
export const GB_AV_NVRRECORD_OPEN = (data) => {
  return post({
    url: 'record/frontdevGbStreamOpen',
    body: data
  })
}
//  前端录像播放
export const AV_NVRRECORD_OPEN = ({
  devIp, // 设备ip,
  devPort, // 设备端口,
  channel, // 通道号,
  sTime, // 开始时间,
  eTime, // 结束时间,
  streamType = 'mian', // 码流类型,
  streamConnPort
}) => {
  devIp = formatIP(devIp)
  return post({
    url: 'playback/open',
    body: {
      devIp, // 设备ip,
      devPort, // 设备端口,
      channel, // 通道号,
      sTime: parseInt(sTime), // 开始时间,
      eTime: parseInt(eTime), // 结束时间,
      streamType, // 码流类型,
      streamConnPort
    }
  })
}

export const formatIP = ip => {
  if (typeof ip === 'string') {
    return ip
  } else {
    return int2iP(ip)
  }
}

export const _formatIP = ip => {
  if (typeof ip === 'number') {
    return ip
  } else {
    return ip2int(ip)
  }
}

// IP转成整型
const ip2int = ip => {
  var num = 0
  ip = ip.split('.')
  num = Number(ip[0]) * 256 * 256 * 256 + Number(ip[1]) * 256 * 256 + Number(ip[2]) * 256 + Number(ip[3])
  num = num >>> 0
  return num
}
// 整型解析为IP地址
const int2iP = num => {
  var str
  var tt = []
  tt[0] = (num >>> 24) >>> 0
  tt[1] = ((num << 8) >>> 24) >>> 0
  tt[2] = (num << 16) >>> 24
  tt[3] = (num << 24) >>> 24
  str = String(tt[0]) + '.' + String(tt[1]) + '.' + String(tt[2]) + '.' + String(tt[3])
  return str
}

// 录像标记
export const AV_RECORD_SIGN = params => post({
  url: 'record/flag',
  body: params
}, { timeout: 3000 })

// 打开视频请求
export const AV_STREAM_START = ({
  id,
  ip,
  port,
  channel,
  streamType,
  type,
  gbPlaDevIp,
  gbPlaDevPort,
  gbDevId,
  gbPlaNvrId
}) => {
  let param = {
    devIp: ip,
    devPort: port,
    channel,
    streamType: streamType || 'main'
  }
  if (gbPlaDevIp || gbPlaNvrId) {
    param = {
      gbPlaDevIp,
      gbPlaDevPort,
      gbDevId,
      gbPlaNvrId,
      streamType: streamType || 'main'
    }
    return post({
      url: `ctl/video?type=${type}`,
      body: param
    })
  }
  return post({
    url: `ctl/video?type=${type}&channelid=${id}`,
    body: param
  })
}

// 开启对讲或者广播
export const TALK_STREAM_START = params => post({
  url: 'ctl/talk',
  body: params
})

// 设置前端设备参数
export const DEVICE_CONFIG_SET = params => post({
  url: 'ctl',
  body: params
})

// 中心录像的开启
export const OPEN_CENTRERECORD = params => post({
  url: '/playback/start',
  body: params
})
// 中心录像的关闭
export const STOP_CENTRERECORD = params => post({
  url: '/playback/stop',
  body: params
})

// 云台控制
export const YUNNAN_CTRL_SET = (params, id, type) => post({
  url: `ctl/ptzctl?type=${type}&channelid=${id}`,
  body: params
})

// 云台获取
export const YUNNAN_CTRL_GET = {
  // 预置点
  getpreset: (params) => post({
    url: `ctl/getpreset`,
    body: params
  }),
  // 巡航路径
  getcruisepath: (params) => post({
    url: `ctl/getcruisepath`,
    body: params
  }),
  // 巡航轨迹
  getcruiselocus: (params) => post({
    url: `ctl/getcruiselocus`,
    body: params
  }),
  // 扫描
  getscan: (params) => post({
    url: `ctl/getscan`,
    body: params
  })
}

// 图像调节
export const GET_PICCFG = (params) => post({
  url: `ctl/getpiccfg`,
  body: params
})

export const SET_PICCFG = (params) => post({
  url: `ctl/setpiccfg?type=video&channelid=${params.id}`,
  body: params.param1
})

// 日历上有没有录像的查询
export const QUERY_RECORD_CALENDAR = (body, source) => post(
  {
    url: `record/calendar`,
    body
  },
  {
    cancelToken: source.token
  })

// 修改重点关注 focus
export const SET_FOCUS = (params) => post({
  url: `record/attention`,
  body: params
})

// 获取互联下级ID
export const getDownID = (id) => get({
  url: `/platform/server/${id}`,
  body: {}
})

/**
 * 国标设备录像查询
 */
export const gbQuery = ({
  gbPlaDevIp, // 设备ip,
  gbPlaDevPort, // 设备端口,
  channel, // 通道号,
  parentId, // 国标平台id,
  childId, // 国标设备id,
  startTime, // 开始时间,
  endTime, // 结束时间,
  streamType = 'mian', // 码流类型,
  recordType // 录像类型
}) => {
  return post({
    url: 'record/gbquery',
    body: {
      gbPlaDevIp, // 设备ip,
      gbPlaDevPort, // 设备端口,
      channel, // 通道号,
      parentId, // 国标平台id,
      childId, // 国标设备id,
      startTime: parseInt(startTime), // 开始时间,
      endTime: parseInt(endTime), // 结束时间,
      streamType, // 码流类型,
      recordType
    }
  })
}

/**
 * 国标设备回放开流
 */
export const gbReplay = ({
  gbPlaDevIp, // 设备ip,
  gbPlaDevPort, // 设备端口,
  channel, // 通道号,
  parentId, // 国标平台id
  childId, // 国标设备id,
  startTime, // 开始时间,
  endTime, // 结束时间,
  streamType = 'mian', // 码流类型,
  downLoad // 如果是下载才会有这个字段 后面的是固定的Download 这个名称
}) => {
  return post({
    url: 'record/gbreplay',
    body: {
      gbPlaDevIp,
      gbPlaDevPort,
      gbPlatformID: parentId,
      gbDeviceID: childId,
      startTime,
      endTime,
      streamType,
      downLoad
    }
  })
}

/**
 * 国标设备回放控制
 */
export const gbPlayBackCtrl = ({
  gbPlaDevIp, // 设备ip,
  gbPlaDevPort, // 设备端口,
  parentId, // 国标平台id
  childId, // 国标设备id,
  playHandle, // 国标回放的句柄,
  ctrlType, // 控制类型,
  speed, // 速度,
  seekTime // 相对开始的时间,
}) => {
  return post({
    url: 'record/playBackCtrl',
    body: {
      gbPlaDevIp,
      gbPlaDevPort,
      parentId,
      childId,
      playHandle: playHandle + '',
      ctrlType,
      speed
      // seekTime
    }
  })
}

export const recordUserLog = (obj) => {
  if (+obj.logType === 1) {
    obj.logType = '操作日志'
  } else if (+obj.logType === 2) {
    obj.logType = '管理日志'
  }
  return post({
    url: 'setting/user/log',
    body: obj
  })
}

// 中心回放上墙
export const vodOpen = (obj) => {
  return post({
    url: 'wall/openvod',
    body: obj
  })
}

// 前端回放上墙
export const frontVod = (obj) => {
  return post({
    url: 'wall/opendevvod',
    body: obj
  })
}

// 上墙控制
export const vodCtrl = (obj) => {
  return post({
    url: 'wall/vodcontrol',
    body: obj
  })
}
