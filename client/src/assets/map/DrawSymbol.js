// 添加点位时draw控件文字的样式
const addIpcTextStyle = {
  label: '单击地图添加设备点',
  labelXOffset: 0,
  labelYOffset: -35,
  fillColor: '#ff0000',
  outLineWidth: 10
}
// 编辑点位时draw控件文字的样式
const editIpcTextStyle = {
  label: '单击地图改变位置',
  labelXOffset: 0,
  labelYOffset: -35,
  fillColor: '#ff0000',
  outLineWidth: 5
}
const iconStyleScale = 0.4
const iconStyleAnchor = [45, 40]
const DrawSymbol = {
  defaultDrawStyle: {
    iconStyle: {
      url: '/static/video_halfball_unsave.png',
      scale: iconStyleScale,
      size: [30, 30],
      anchor: [0, 2],
      rotation: 0,
      opacity: 1
    },
    textStyle: {
      label: '',
      labelXOffset: 35,
      labelYOffset: 35,
      fillColor: '#ff0000',
      outLineColor: '00ff00',
      outLineWidth: 5,
      lineDash: [1]
    },
    circleStyle: {
      fillColor: '#ffff00',
      strokeStyle: {
        outLineWidth: 2,
        outLineColor: '#6666aa'
      },
      radius: 3
    },
    strokeStyle: {
      outLineColor: '#000080',
      outLineWidth: 2,
      lineDash: [1]
    },
    fillColor: '#ffffff'
  },
  // 胡红勋添加 2018-09-05--开始
  alarmColumnDrawSymbol: {
    iconStyle: {
      url: '/static/alarm_column_draw.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    },
    textStyle: editIpcTextStyle
  },
  alarmBoxDrawSymbol: {
    iconStyle: {
      url: '/static/alarm_box_draw.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    },
    textStyle: editIpcTextStyle
  },
  // 胡红勋添加 2018-09-05--结束-------
  /**
   *  半球类型 添加时draw控件的样式
   */
  halfBallAddDrawSymbol: {
    iconStyle: {
      url: '/static/video_halfball_unsave.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    },
    textStyle: addIpcTextStyle
  },
  /**
   * 半球类型 调整位置时draw控件的样式（未入库）
   */
  halfBallEditUnSDrawSymbol: {
    iconStyle: {
      url: '/static/video_halfball_unsave.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    },
    textStyle: editIpcTextStyle
  },
  /**
   * 半球类型 调整位置时draw控件的样式（已入库）
   */
  halfBallEditDrawSymbol: {
    iconStyle: {
      url: '/static/video_halfball_edi.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    },
    textStyle: editIpcTextStyle
  },
  /**
   * 快球类型 添加时draw控件的样式
   */
  fastBallAddDrawSymbol: {
    iconStyle: {
      url: '/static/video_ball_unsave.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    },
    textStyle: addIpcTextStyle
  },
  /**
   * 快球类型 调整位置时draw控件的样式（未入库）
   */
  fastBallEditUnSDrawSymbol: {
    iconStyle: {
      url: '/static/video_ball_unsave.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    },
    textStyle: editIpcTextStyle
  },
  /**
   * 快球类型 调整位置时draw控件的样式（已入库）
   */
  fastBallEditDrawSymbol: {
    iconStyle: {
      url: '/static/video_ball_edi.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    },
    textStyle: editIpcTextStyle
  },
  /**
   * 枪机类型 添加时draw控件的样式
   */
  boltAddDrawSymbol: {
    iconStyle: {
      url: '/static/video_gun_unsave.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    },
    textStyle: addIpcTextStyle
  },
  /**
   * 枪机类型 调整位置时draw控件的样式（未入库）
   */
  boltEditUnSDrawSymbol: {
    iconStyle: {
      url: '/static/video_gun_unsave.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    },
    textStyle: editIpcTextStyle
  },
  /**
   * 枪机类型 调整位置时draw控件的样式（已入库）
   */
  boltEditDrawSymbol: {
    iconStyle: {
      url: '/static/video_gun_edi.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    },
    textStyle: editIpcTextStyle
  },
  /**
   * 红外枪机类型 添加时draw控件的样式
   */
  redBoltAddDrawSymbol: {
    iconStyle: {
      url: '/static/video_gunred_unsave.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    },
    textStyle: addIpcTextStyle
  },
  /**
   * 红外枪机类型 调整位置时draw控件的样式（未入库）
   */
  redBoltEditUnSDrawSymbol: {
    iconStyle: {
      url: '/static/video_gunred_unsave.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    },
    textStyle: editIpcTextStyle
  },
  /**
   * 红外枪机类型 调整位置时draw控件的样式（已入库）
   */
  redBoltEditDrawSymbol: {
    iconStyle: {
      url: '/static/video_gunred_edi.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    },
    textStyle: editIpcTextStyle
  },
  /**
   * 全景类型 添加时draw控件的样式
   */
  allViewAddDrawSymbol: {
    iconStyle: {
      url: '/static/video_allview_unsave.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    },
    textStyle: addIpcTextStyle
  },
  /**
   * 全景类型 调整位置时draw控件的样式（未入库）
   */
  allViewEditUnSDrawSymbol: {
    iconStyle: {
      url: '/static/video_allview_unsave.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    },
    textStyle: editIpcTextStyle
  },
  /**
   * 全景类型 调整位置时draw控件的样式（已入库）
   */
  allViewEditDrawSymbol: {
    iconStyle: {
      url: '/static/video_allview_edi.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    },
    textStyle: editIpcTextStyle
  },
  // 报警点位点类型的样式
  alarmPointDrawSymbol: {
    textStyle: {
      label: '单击确定报警点位',
      labelXOffset: 30,
      labelYOffset: -30,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1]
    },
    iconStyle: {
      url: '/static/alarm_unsave.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  // 消防报警点位点类型的样式
  fireAlarmPointDrawSymbol: {
    textStyle: {
      label: '单击地图绘制消防报警点位',
      labelXOffset: 30,
      labelYOffset: -30,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1]
    },
    iconStyle: {
      url: '/static/fireAlarm_warn.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  // 报警点位线类型的样式
  alarmLineDrawSymbol: {
    textStyle: {
      label: '单击开始绘制线',
      labelXOffset: 30,
      labelYOffset: -30,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1]
    },
    iconStyle: {
      url: '/static/alarm_unsave.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    },
    strokeStyle: {
      outLineColor: '#009944',
      outLineWidth: 3,
      lineDash: [1]
    }
  },
  // 报警点位线类型的样式
  alarmPolygonDrawSymbol: {
    textStyle: {
      label: '单击开始绘制面',
      labelXOffset: 30,
      labelYOffset: -30,
      fillColor: '#ff0000',
      outLineColor: '#00ff00',
      outLineWidth: 5,
      lineDash: [1]
    },
    iconStyle: {
      url: '/static/alarm_unsave.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    },
    strokeStyle: {
      outLineColor: '#009944',
      outLineWidth: 2,
      lineDash: [1]
    },
    fillColor: 'rgba(67,204,190,0.1)'
  }
}
export default DrawSymbol
