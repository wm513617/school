const iconStyleScale = 0.4
const iconStyleAnchor = [48, 48]
const StyleConfig = {
  defaultDrawStyle: {
    iconStyle: {
      url: '/static/mapimg/select.png',
      scale: 1,
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
  // 胡红勋 报警箱保存样式----2018-09-05
  alarmBoxSaveSymbol: {
    iconStyle: {
      url: '/static/mapimg/alarm/alarmBox/alarm_box_save.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  alarmBoxAlarmSymbol: {
    iconStyle: {
      url: '/static/mapimg/alarm/alarmBox/alarm_box_alarming.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  // 胡红勋 报警柱报警样式----2018-09-05
  alarmColumnSaveSymbol: {
    iconStyle: {
      url: '/static/mapimg/alarm/alarmColumn/alarm_column_save.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  alarmColumnAlarmSymbol: {
    iconStyle: {
      url: '/static/mapimg/alarm/alarmColumn/alarm_column_alarming.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  /**
   * 半球类型 点位未保存时的样式
   */
  halfBallUnSSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/halfballipc/video_halfball_unsave.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  /**
   * 半球类型 点位编辑时的样式
   */
  halfBallEditSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/halfballipc/video_halfball_edi.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 半球类型 点位保存后的样式
   */
  halfBallSaveSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/halfballipc/video_halfball_save.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 快球类型 点位未保存时的样式
   */
  fastBallUnSSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/fastballipc/video_ball_unsave.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 快球类型 点位编辑时的样式
   */
  fastBallEditSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/fastballipc/video_ball_edi.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 快球类型 点位保存后的样式
   */
  fastBallSaveSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/fastballipc/video_ball_save.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 枪机类型 点位未保存时的样式
   */
  boltUnSSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/boltipc/video_gun_unsave.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 枪机类型 点位编辑时的样式
   */
  boltEditSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/boltipc/video_gun_edi.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 枪机类型 点位保存后的样式
   */
  boltSaveSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/boltipc/video_gun_save.png',
      rotation: 0,
      opacity: 1,
      size: [30, 30],
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 红外枪机类型 点位未保存时的样式
   */
  redBoltUnSSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/redboltipc/video_gunred_unsave.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 红外枪机类型 点位编辑时的样式
   */
  redBoltEditSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/redboltipc/video_gunred_edi.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 红外枪机类型 点位保存后的样式
   */
  redBoltSaveSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/redboltipc/video_gunred_save.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 全景类型 点位未保存时的样式
   */
  allViewUnSSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/allviewipc/video_allview_unsave.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 全景类型 点位编辑时的样式
   */
  allViewEditSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/allviewipc/video_ball_edi.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 全景类型 点位保存后的样式
   */
  allViewSaveSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/allviewipc/video_allview_save.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 快球类型 点位在线状态
   */
  fastBallVedioOnlineSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/fastballipc/vedio_ball_online.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 快球类型 点位离线状态
   */
  fastBallVedioOfflineSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/fastballipc/vedio_ball_off.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  fastBallAlarmSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/fastballipc/vedio_ball_alarm.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 快球类型 点位禁用状态
   */
  fastBallVedioUnuseSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/fastballipc/video_ball_unuse.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 半球类型 点位在线状态
   */
  halfBallVedioOnlineSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/halfballipc/video_halfball_online.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 半球类型 点位离线状态
   */
  halfBallVedioOfflineSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/halfballipc/video_halfball_off.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 半球类型 点位报警状态
   */
  halfBallAlarmSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/halfballipc/video_halfball_alarm.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 半球类型 点位禁用状态
   */
  halfBallVedioUnuseSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/halfballipc/video_halfball_unuse.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 枪机类型 点位在线状态
   */
  boltVedioOnlineSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/boltipc/video_gun_online.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 枪机类型 点位离线状态
   */
  boltVedioOfflineSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/boltipc/video_gun_off.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 枪机类型 点位报警状态
   */
  boltAlarmSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/boltipc/video_gun_alarm.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 枪机类型 点位禁用状态
   */
  boltVedioUnuseSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/boltipc/video_gun_unuse.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 全景类型 点位在线状态
   */
  allViewVedioOnlineSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/allviewipc/video_allview_online.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 全景类型 点位离线状态
   */
  allViewVedioOfflineSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/allviewipc/video_allview_off.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 全景类型 点位报警状态
   */
  allViewAlarmSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/allviewipc/video_allview_alarm.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 全景类型 点位禁用状态
   */
  allViewVedioUnuseSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/allviewipc/video_allview_unuse.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 红外枪机类型 点位在线状态
   */
  redBoltVedioOnlineSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/redboltipc/video_gunred_online.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 红外枪机类型 点位离线状态
   */
  redBoltVedioOfflineSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/redboltipc/video_gunred_off.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 红外枪机类型 点位报警状态
   */
  redBoltAlarmSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/redboltipc/video_gunred_alarm.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 红外枪机类型 点位禁用状态
   */
  redBoltVedioUnuseSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/redboltipc/video_gunred_unuse.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 人脸抓拍 点位在线状态
   */
  verfaceipcOnlineSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/face_recognition/face_recognition_online.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 人脸抓拍 点位离线状态
   */
  verfaceipcOfflineSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/face_recognition/face_recognition_off.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 人脸抓拍 点位报警状态
   */
  verfaceipcAlarmSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/face_recognition/face_recognition_alarm.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 人脸抓拍 点位禁用状态
   */
  verfaceipcUnuseSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/face_recognition/face_recognition_unuse.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 交通抓拍 点位离线状态
   */
  trafficipcOnlineSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/vehicle_recognition/vehicle_recognition_online.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 交通抓拍 点位离线状态
   */
  trafficipcOfflineSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/vehicle_recognition/vehicle_recognition_off.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 交通抓拍 点位报警状态
   */
  trafficipcAlarmSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/vehicle_recognition/vehicle_recognition_alarm.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 交通抓拍 点位禁用状态
   */
  trafficipcUnuseSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/vehicle_recognition/vehicle_recognition_unuse.png',
      rotation: 0,
      opacity: 1,
      anchor: iconStyleAnchor,
      scale: iconStyleScale
    }
  },
  /**
   * 点位可视域图层样式
   */
  sectorLayerSymbol: {
    fillColor: 'rgba(242, 173, 81, 0.4)'
  },
  /**
   * 应用模式点位高亮样式
   */
  hightLightSymbol: {
    iconStyle: {
      url: '/static/mapimg/select.png',
      anchor: [25, 40],
      scale: 0.8
    }
  },
  /**
   * 报警 未保存时的样式
   */
  alarmPointUnSSymbol: {
    iconStyle: {
      url: '/static/mapimg/commonAlarm/alarm_unsave.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  /**
   * 报警 编辑时的样式
   */
  alarmPointEditSymbol: {
    iconStyle: {
      url: '/static/mapimg/commonAlarm/alarm_edit.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  /**
   * 报警 保存后的样式
   */
  alarmPointSaveSymbol: {
    iconStyle: {
      url: '/static/mapimg/commonAlarm/alarm_save.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  /**
   * 报警 布防样式
   */
  alarmPointArmSymbol: {
    iconStyle: {
      url: '/static/mapimg/commonAlarm/alarm_common_ing.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  /**
   * 报警 撤防样式
   */
  alarmPointUnarmSymbol: {
    iconStyle: {
      url: '/static/mapimg/commonAlarm/alarm_unarm.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  /**
   * 报警 在线样式
   */
  alarmPointOnlineSymbol: {
    iconStyle: {
      url: '/static/mapimg/commonAlarm/alarm_common_online.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  /**
   * 报警 离线样式
   */
  alarmPointOfflineSymbol: {
    iconStyle: {
      url: '/static/mapimg/commonAlarm/alarm_off.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  /**
   * 消防报警样式
   */
  fireAlarmPointSymbol: {
    iconStyle: {
      url: '/static/mapimg/fireAlarm/firealarm_online.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  /**
   * 消防报警样式
   */
  fireAlarmOfflineSymbol: {
    iconStyle: {
      url: '/static/mapimg/fireAlarm/fireAlarm_offline.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  /**
   * 消防报警样式
   */
  fireAlarmAlarmSymbol: {
    iconStyle: {
      url: '/static/mapimg/fireAlarm/firealarm_ing.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  /**
   * 消防报警 编辑的样式
   */
  fireAlarmPointEditSymbol: {
    iconStyle: {
      url: '/static/mapimg/fireAlarm/fireAlarm_edit.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  /**
   * 报警 报警样式
   */
  alarmPointAlarmSymbol: {
    iconStyle: {
      url: '/static/mapimg/commonAlarm/alarm_common_ing.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  alarmHostOnlineSymbol: {
    iconStyle: {
      url: '/static/mapimg/alarmHost/alarmhost_online.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  alarmHostOfflineSymbol: {
    iconStyle: {
      url: '/static/mapimg/alarmHost/alarmhost_unuse.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  alarmPointHostSymbol: {
    iconStyle: {
      url: '/static/mapimg/alarmHost/alarmhost_ing.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  fireAlarmPointAlarmSymbol: {
    iconStyle: {
      url: '/static/mapimg/fireAlarm/firealarm_ing.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  // 报警点位线类型的样式
  alarmLineEditSymbol: {
    strokeStyle: {
      outLineColor: 'rgba(0,153,68,0.4)',
      outLineWidth: 3,
      lineDash: [1]
    }
  },
  alarmLineSaveSymbol: {
    strokeStyle: {
      outLineColor: 'rgba(0,153,68,1)',
      outLineWidth: 3,
      lineDash: [1]
    }
  },
  alarmLineHLSymbol: {
    strokeStyle: {
      outLineColor: 'rgba(235,71,128,0.6)',
      outLineWidth: 3,
      lineDash: [1]
    }
  },
  // 线报警的样式
  alarmLineAlarmSymbol: {
    strokeStyle: {
      outLineColor: 'rgba(255,0,0,1)',
      outLineWidth: 3,
      lineDash: [1]
    }
  },
  // 面报警的样式
  alarmPolygonAlarmSymbol: {
    strokeStyle: {
      outLineColor: '#ff0000',
      // outLineColor: 'rgba(0,153,68,0)',
      outLineWidth: 2,
      lineDash: [1]
    },
    fillColor: 'rgba(255,0,0,1)'
  },
  // 报警点位线类型的样式
  alarmPolygonEditSymbol: {
    strokeStyle: {
      outLineColor: '#009944',
      outLineWidth: 2,
      lineDash: [1]
    },
    fillColor: 'rgba(67,204,190,0.4)'
  },
  alarmPolygonSaveSymbol: {
    strokeStyle: {
      outLineColor: '#009944',
      outLineWidth: 2,
      lineDash: [1]
    },
    fillColor: 'rgba(67,204,190,1)'
  },
  alarmPolygonHLSymbol: {
    strokeStyle: {
      outLineColor: '#009944',
      outLineWidth: 2,
      lineDash: [1]
    },
    fillColor: 'rgba(235,71,128,0.6)'
  },
  patrolUnSSymbol: {
    iconStyle: {
      url: '/static/mapimg/patrol/patrol_unsave.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  patrolEditSymbol: {
    iconStyle: {
      url: '/static/mapimg/patrol/patrol_edit.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  patrolSaveSymbol: {
    iconStyle: {
      url: '/static/mapimg/patrol/patrol_save.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  patrolFloorSymbol: {
    iconStyle: {
      url: '/static/mapimg/patrol/patrol_conver.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  // 巡更汇聚报警样式
  patrolConverAlarmSymbol: {
    iconStyle: {
      url: '/static/mapimg/patrol/patrol_conver_alarm.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  patrolAppSymbol: {
    iconStyle: {
      url: '/static/mapimg/patrol/patrol_online.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  // 报警
  patrolAlarmSymbol: {
    iconStyle: {
      url: '/static/mapimg/patrol/patrol_alarm.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  // 维修
  patrolRepairSymbol: {
    iconStyle: {
      url: '/static/mapimg/patrol/patrol_repair.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  // 已巡更
  patroledSymbol: {
    iconStyle: {
      url: '/static/mapimg/patrol/patrol_ed.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  // 超时
  patrolTimeoutSymbol: {
    iconStyle: {
      url: '/static/mapimg/patrol/patrol_timeout.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  // 待巡更
  patrolWaitSymbol: {
    iconStyle: {
      url: '/static/mapimg/patrol/patrol_wait.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  // 巡更点位连线时的箭头
  arrowSymbol: {
    iconStyle: {
      url: '/static/mapimg/arrow.png',
      anchor: [0, 10],
      scale: 1,
      rotation: 0,
      opacity: 1
    }
  },
  // 巡更连线样式
  patrolLineSymbol: {
    strokeStyle: {
      outLineColor: '#fe8134',
      outLineWidth: 2,
      lineDash: [1]
    }
  },
  // 单兵
  singleSymbol: {
    iconStyle: {
      url: '/static/mapimg/single/movesingle.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  // 单兵报警
  singleAlarmSymbol: {
    iconStyle: {
      url: '/static/mapimg/single/singlealarm.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  // 车辆轨迹线的样式
  carTrackSymbol: {
    strokeStyle: {
      outLineColor: 'rgba(221,112,48,1)',
      outLineWidth: 2,
      lineDash: [1]
    }
  },
  // 车辆轨迹点的样式
  carSymbol: {
    iconStyle: {
      url: '/static/mapimg/car.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    },
    textStyle: {
      label: '',
      labelXOffset: 30,
      labelYOffset: 30,
      fillColor: '#0000ff',
      outLineColor: '00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontSize: 1
    }
  },
  peopleTrackSymbol: {
    iconStyle: {
      url: '/static/mapimg/people.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    },
    textStyle: {
      label: '',
      labelXOffset: 30,
      labelYOffset: 30,
      fillColor: '#0000ff',
      outLineColor: '00ff00',
      outLineWidth: 5,
      lineDash: [1],
      fontSize: 1
    }
  },
  peopleLineSymbol: {
    strokeStyle: {
      outLineColor: 'rgba(221,112,48,1)',
      outLineWidth: 2,
      lineDash: [1]
    }
  },
  doorControlOpenSymbol: {
    iconStyle: {
      url: '/static/mapimg/doorcontrol/doorcontrol_open.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  doorControlCloseSymbol: {
    iconStyle: {
      url: '/static/mapimg/doorcontrol/doorcontrol_close.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  doorControlAbnormalSymbol: {
    iconStyle: {
      url: '/static/mapimg/doorcontrol/doorcontrol_abnormity.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  },
  faceAlarmSymbol: {
    iconStyle: {
      url: '/static/mapimg/video/face_recognition/face_recognition_alarm.png',
      anchor: iconStyleAnchor,
      scale: iconStyleScale,
      rotation: 0,
      opacity: 1
    }
  }
}
export default StyleConfig
