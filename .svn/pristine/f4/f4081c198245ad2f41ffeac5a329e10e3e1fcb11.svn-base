/**
 * 获取节点图标
 */
const iconList = {
  organise: { class: 'icon-organise', title: '机构' },
  alarmEid: { class: 'icon-qiangji1', title: '报警通道' },
  laneNumber: { class: 'icon-intersection', title: '路口' },
  direction: { class: 'icon-roadway', title: '车道' },
  equip: { class: 'icon-equipment', title: '设备' },
  powerType: { class: 'icon-jurisdiction', title: '权限' },
  nvr: { class: 'icon-Tree-DVR-CH', title: 'NVR' },
  0: { class: 'icon-qiangji1', title: '枪机' },
  1: { class: 'icon-video-gun1', title: '红外枪机' },
  2: { class: 'icon-video-ball-half', title: '半球' },
  3: { class: 'icon-video-ball', title: '快球' },
  4: { class: 'icon-video-pan', title: '全景' },
  defaultDev: { class: 'icon-video-gun', title: '枪机' }
}
export const getNodeIcon = (item) => {
  if ('eid' in item) {
    if (item.eid && item.eid.type === 'nvr') {
      return iconList.nvr
    } else {
      return iconList[item.monitortype] || iconList.defaultDev
    }
  } else {
    const specialIcon = ['alarmEid', 'laneNumber', 'direction', 'equip', 'powerType']
    for (let index = 0; index < specialIcon.length; index++) {
      if (item[specialIcon[index]]) { return iconList[specialIcon[index]] }
    }
    return iconList.organise
  }
}
