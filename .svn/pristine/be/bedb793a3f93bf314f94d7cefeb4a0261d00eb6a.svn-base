/**
 * 获取节点图标
 */
const iconList = {
  organise: {
    class: 'icon-organise',
    title: '机构'
  },
  equipment: {
    class: 'icon-equipment',
    title: '设备'
  },
  alarmMainframe: {
    class: 'icon-baojingzhuji',
    title: '报警主机报警'
  },
  fireAlarm: {
    class: 'icon-xiaofangcailiao',
    title: '消防报警'
  },
  alarmIn: {
    class: 'icon-alarm-input',
    title: '报警输入'
  },
  alarmEid: {
    class: 'icon-qiangji1',
    title: '报警通道'
  },
  laneNumber: {
    class: 'icon-intersection',
    title: '路口'
  },
  direction: {
    class: 'icon-roadway',
    title: '车道'
  },
  powerType: {
    class: 'icon-jurisdiction',
    title: '权限'
  },
  entranceGuard: {
    class: 'icon-menjin1',
    title: '门禁'
  },
  alarmBox: {
    class: 'icon-baojingxiang2',
    title: '报警箱'
  },
  alarmPillar: {
    class: 'icon-baojingzhu1',
    title: '报警柱'
  },
  nvr: {
    class: 'icon-Tree-DVR-CH',
    title: 'NVR'
  },
  grid: {
    class: 'icon-grid',
    title: '网格'
  },
  building: {
    class: 'icon-loufangdianwei',
    title: '楼宇'
  },
  storey: {
    class: 'icon-tuceng',
    title: '楼层'
  },
  patrol: {
    class: 'icon-dianzixungeng',
    title: '巡更点位'
  },
  0: {
    // class: 'icon-qiangji', // 2019-06-17，改为实心图标
    class: 'icon-video-gun',
    title: '枪机'
  },
  1: {
    // class: 'icon-hongwaiqiangji', // 2019-06-17，改为实心图标
    class: 'icon-video-gun1',
    title: '红外枪机'
  },
  2: {
    class: 'icon-banqiu',
    title: '半球'
  },
  3: {
    // class: 'icon-kuaiqiu', // 2019-06-17，改为实心图标
    class: 'icon-video-ball',
    title: '快球'
  },
  4: {
    class: 'icon-quanjing',
    title: '全景'
  },
  renxiangshibie: {
    class: 'icon-renxiangshibie',
    title: '人脸抓拍'
  },
  jiaotongshibie: {
    class: 'icon-jiaotongshibie',
    title: '交通抓拍'
  },
  defaultDev: {
    class: 'icon-video-gun',
    title: '枪机'
  }
}
// 懒加载树的图标
export const getNodeIcon = (item) => {
  if (item.tierType === 'org' || item.isOrg) {
    return iconList.organise
  } else if (item.tierType === 'res' || item.eid !== undefined) {
    if (item.eid === undefined) {
      return
    }
    if (item.type === 0) { // 视频资源 ipc
      if (item.monitoryPointGenera === 0 || item.monitoryPointGenera === undefined) { // 是，0普通摄像机 || 无该字段
        return iconList[item.monitortype] || iconList.defaultDev
      } else if (item.monitoryPointGenera === 1) { // 人脸识别
        return iconList.renxiangshibie
      } else if (item.monitoryPointGenera === 2) { // 车辆识别
        return iconList.jiaotongshibie
      }
    } else if (item.type === 1) { // 视频报警输入
      return iconList.alarmIn
    } else if (item.type === 4) { // 门禁通道
      return iconList.entranceGuard
    } else if (item.type === 9) { // 报警主机报警输入
      return iconList.alarmMainframe
    } else if (item.type === 11) { // 消防输入防区
      return iconList.fireAlarm
    } else if (item.eid.type === 'alarmPillar') { // 报警柱
      return iconList.alarmPillar
    } else if (item.eid.type === 'alarmBox') { // 报警主机
      return iconList.alarmBox
    } else if (item.eid.type === 1) { // 视频报警输入
      return iconList.alarmIn
    } else if (item.alarmEid) { // 报警通道
      return iconList.alarmEid
    } else if (item.laneNumber) { // 路口
      return iconList.laneNumber
    } else if (item.direction) { // 车道
      return iconList.direction
    } else if (item.powerType) { // 权限
      return iconList.powerType
    } else {
      return iconList.defaultDev
    }
    // } else if (item.tierType === 'equ') {
  } else {
    if (item.type === 'grid') {
      return iconList.grid
    } else if (item.type === 'building') {
      return iconList.building
    } else if (item.type === 'storey') {
      return iconList.storey
    } else if (item.type === 'patrol') {
      return iconList.patrol
    }
    return iconList.equipment
  }
  // if ('eid' in item) {
  //   if (item.eid && item.eid.type === 'nvr') {
  //     return iconList.nvr
  //   } else {
  //     return iconList[item.monitortype] || iconList.defaultDev
  //   }
  // } else {
  //   const specialIcon = ['alarmEid', 'laneNumber', 'direction', 'equip', 'powerType']
  //   for (let index = 0; index < specialIcon.length; index++) {
  //     if (item[specialIcon[index]]) { return iconList[specialIcon[index]] }
  //   }
  //   return iconList.organise
  // }
}
// 事件处理的树的图标
export const getCaseNodeIcon = (item) => {
  if (item.root || Array.isArray(item.eid)) { // 如果是根 || 事件
    return iconList.organise
  } else { // 资源
    if (item.eid === undefined) {
      return iconList.defaultDev
    }
    if (item.type === 0) { // 视频资源 ipc
      if (item.monitoryPointGenera === 0 || item.monitoryPointGenera === undefined) { // 是，0普通摄像机 || 无该字段
        return iconList[item.monitortype] || iconList.defaultDev
      } else if (item.monitoryPointGenera === 1) { // 人脸识别
        return iconList.renxiangshibie
      } else if (item.monitoryPointGenera === 2) { // 车辆识别
        return iconList.jiaotongshibie
      }
    } else if (item.type === 1) { // 视频报警输入
      return iconList.alarmIn
    } else if (item.type === 4) { // 门禁通道
      return iconList.entranceGuard
    } else if (item.type === 9) { // 报警主机报警输入
      return iconList.alarmMainframe
    } else if (item.type === 11) { // 消防输入防区
      return iconList.fireAlarm
    } else if (item.eid.type === 'alarmPillar') { // 报警柱
      return iconList.alarmPillar
    } else if (item.eid.type === 'alarmBox') { // 报警主机
      return iconList.alarmBox
    } else if (item.eid.type === 1) { // 视频报警输入
      return iconList.alarmIn
    } else if (item.alarmEid) { // 报警通道
      return iconList.alarmEid
    } else if (item.laneNumber) { // 路口
      return iconList.laneNumber
    } else if (item.direction) { // 车道
      return iconList.direction
    } else if (item.powerType) { // 权限
      return iconList.powerType
    } else {
      return iconList.defaultDev
    }
  }
}
// 接力追踪的树的图标
export const getTrackNodeIcon = (item) => {
  if (item.root || Array.isArray(item.resource)) { // 根 || 事件
    return iconList.organise
  } else { // 资源
    let e = item.resource
    if (e.eid === undefined || JSON.stringify(e.eid) === '{}') {
      return iconList.defaultDev
    }
    return iconList[e.monitortype] || iconList.defaultDev
  }
}
