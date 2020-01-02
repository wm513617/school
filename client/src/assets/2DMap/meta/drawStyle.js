import defaultStyle from './style'
const iconStyleScale = 0.4
const iconStyleAnchor = [48, 48]

export default {
  areaDraw: {
    textStyle: {
      label: '单击绘制区域节点,双击结束',
      labelXOffset: 15,
      labelYOffset: -15,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/grid.png',
      anchor: [0, 15],
      scale: 0.1
    },
    strokeStyle: defaultStyle.draw.strokeStyle,
    fillColor: defaultStyle.draw.fillColor
  },
  areaDrawEnd: {
    strokeStyle: defaultStyle.drawEnd.strokeStyle,
    fillColor: defaultStyle.drawEnd.fillColor
  },
  gridDraw: { // 网格绘制
    textStyle: {
      label: '单击绘制网格',
      labelXOffset: 15,
      labelYOffset: -15,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/grid.png',
      anchor: [0, 15],
      scale: 0.1
    },
    strokeStyle: defaultStyle.draw.strokeStyle,
    fillColor: defaultStyle.draw.fillColor
  },
  gridDrawEnd: { // 网格绘制完成
    strokeStyle: defaultStyle.drawEnd.strokeStyle,
    fillColor: defaultStyle.drawEnd.fillColor
  },
  buildDraw: { // 楼宇绘制
    textStyle: {
      label: '单击绘制楼宇',
      labelXOffset: 15,
      labelYOffset: -15,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/building.png',
      anchor: [0, 15],
      scale: 0.1
    },
    strokeStyle: defaultStyle.draw.strokeStyle,
    fillColor: defaultStyle.draw.fillColor
  },
  buildDrawEnd: { // 楼宇绘制完成
    strokeStyle: defaultStyle.drawEnd.strokeStyle,
    fillColor: defaultStyle.drawEnd.fillColor
  },
  boltipc: { // 视频-枪机绘制
    textStyle: {
      label: '单击添加视频点位',
      labelXOffset: 0,
      labelYOffset: -25,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/video_gun_unsave.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  redBoltipc: { // 视频-红外枪机绘制
    textStyle: {
      label: '单击添加视频点位',
      labelXOffset: 0,
      labelYOffset: -25,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: 'video_gunred_unsave.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  halfBallipc: { // 视频-半球绘制
    textStyle: {
      label: '单击添加视频点位',
      labelXOffset: 0,
      labelYOffset: -25,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/video_halfball_unsave.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  fastBallipc: { // 视频-快球绘制
    textStyle: {
      label: '单击添加视频点位',
      labelXOffset: 0,
      labelYOffset: -25,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/video_ball_unsave.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  allViewipc: { // 视频-全景绘制
    textStyle: {
      label: '单击添加视频点位',
      labelXOffset: 0,
      labelYOffset: -25,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/video_allview_unsave.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  commonAlarm: { // 普通报警绘制
    textStyle: {
      label: '单击添加普通报警点位',
      labelXOffset: 0,
      labelYOffset: -25,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/alarm_unsave.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  commonAlarmAreaDraw: { // 普通报警区域绘制样式
    textStyle: {
      label: '单击添加普通报警区域',
      labelXOffset: 15,
      labelYOffset: -15,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/alarm_unsave.png',
      anchor: [0, 15],
      scale: 0.3
    },
    strokeStyle: defaultStyle.draw.strokeStyle,
    fillColor: defaultStyle.draw.fillColor
  },
  commonAlarmAreaDrawEnd: { // 普通报警区域绘制结束样式
    strokeStyle: defaultStyle.drawEnd.strokeStyle,
    fillColor: defaultStyle.drawEnd.fillColor
  },
  commonAlarmLineDraw: { // 普通报警线绘制样式
    textStyle: {
      label: '单击添加普通报警线',
      labelXOffset: 15,
      labelYOffset: -15,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/alarm_unsave.png',
      anchor: [0, 15],
      scale: 0.3
    },
    strokeStyle: defaultStyle.drawLine.strokeStyle,
    fillColor: defaultStyle.drawLine.fillColor
  },
  commonAlarmLineDrawEnd: { // 普通报警线绘制样式
    strokeStyle: defaultStyle.drawLineEnd.strokeStyle,
    fillColor: defaultStyle.drawLineEnd.fillColor
  },
  alarmHost: { // 报警主机绘制
    textStyle: {
      label: '单击添加报警主机点位',
      labelXOffset: 0,
      labelYOffset: -25,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/alarmHost_online.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  alarmHostAreaDraw: { // 报警主机区域绘制样式
    textStyle: {
      label: '单击添加报警主机区域',
      labelXOffset: 15,
      labelYOffset: -15,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/alarmHost_online.png',
      anchor: [0, 15],
      scale: 0.3
    },
    strokeStyle: defaultStyle.draw.strokeStyle,
    fillColor: defaultStyle.draw.fillColor
  },
  alarmHostAreaDrawEnd: { // 报警主机区域绘制结束样式
    strokeStyle: defaultStyle.drawEnd.strokeStyle,
    fillColor: defaultStyle.drawEnd.fillColor
  },
  alarmHostLineDraw: { // 报警主机线绘制样式
    textStyle: {
      label: '单击添加报警主机线',
      labelXOffset: 15,
      labelYOffset: -15,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/alarmHost_online.png',
      anchor: [0, 15],
      scale: 0.3
    },
    strokeStyle: defaultStyle.drawLine.strokeStyle,
    fillColor: defaultStyle.drawLine.fillColor
  },
  alarmHostLineDrawEnd: { // 报警主机线绘制样式
    strokeStyle: defaultStyle.drawLineEnd.strokeStyle,
    fillColor: defaultStyle.drawLineEnd.fillColor
  },
  fireAlarm: { // 消防报警绘制
    textStyle: {
      label: '单击添加消防报警点位',
      labelXOffset: 0,
      labelYOffset: -25,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/fireAlarm_warn.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  fireAlarmAreaDraw: { // 消防报警区域绘制样式
    textStyle: {
      label: '单击添加消防报警区域',
      labelXOffset: 15,
      labelYOffset: -15,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/fireAlarm_warn.png',
      anchor: [0, 15],
      scale: 0.3
    },
    strokeStyle: defaultStyle.draw.strokeStyle,
    fillColor: defaultStyle.draw.fillColor
  },
  fireAlarmAreaDrawEnd: { // 消防报警区域绘制结束样式
    strokeStyle: defaultStyle.drawEnd.strokeStyle,
    fillColor: defaultStyle.drawEnd.fillColor
  },
  fireAlarmLineDraw: { // 消防报警线绘制样式
    textStyle: {
      label: '单击添加消防报警线',
      labelXOffset: 15,
      labelYOffset: -15,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/fireAlarm_warn.png',
      anchor: [0, 15],
      scale: 0.3
    },
    strokeStyle: defaultStyle.drawLine.strokeStyle,
    fillColor: defaultStyle.drawLine.fillColor
  },
  fireAlarmLineDrawEnd: { // 消防报警线绘制样式
    strokeStyle: defaultStyle.drawLineEnd.strokeStyle,
    fillColor: defaultStyle.drawLineEnd.fillColor
  },
  alarmBoxDraw: { // 报警箱绘制
    textStyle: {
      label: '单击添加报警箱点位',
      labelXOffset: 0,
      labelYOffset: -25,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/alarm_box_draw.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  alarmColumnDraw: { // 报警柱绘制
    textStyle: {
      label: '单击添加报警柱点位',
      labelXOffset: 0,
      labelYOffset: -25,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/alarm_column_draw.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  patrolDraw: { // 巡更点绘制
    textStyle: {
      label: '单击添加巡更点位',
      labelXOffset: 0,
      labelYOffset: -25,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/patrol_unsave.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  doorControlDraw: { // 门禁点绘制
    textStyle: {
      label: '单击添加门禁点位',
      labelXOffset: 0,
      labelYOffset: -25,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontFamily: ''
    },
    iconStyle: {
      url: '/static/mapimg/doorcontrol/doorcontrol_open.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  }
}
