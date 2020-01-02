export default [
  {
    path: '/home',
    component: resolve => {
      require(['../view/homePage/Dashboard.vue'], resolve)
    }
  },
  {
    path: '/maintenance',
    component: resolve => {
      require(['../view/maintenance/maintenance.vue'], resolve)
    }
  },
  {
    path: '/fire/control',
    component: resolve => {
      require(['../view/fire/control.vue'], resolve)
    }
  },
  {
    path: '/fire/fireAlarmRecord',
    component: resolve => {
      require(['../view/fire/fireAlarmRecord.vue'], resolve)
    }
  },
  {
    path: '/door/list',
    component: resolve => {
      require(['../view/door/list.vue'], resolve)
    }
  },
  {
    path: '/door/useList',
    component: resolve => {
      require(['../view/door/useList.vue'], resolve)
    }
  },
  {
    path: '/door/alarmRecord',
    component: resolve => {
      require(['../view/door/alarmRecord.vue'], resolve)
    }
  },
  {
    path: '/keepwatch/patrol',
    component: resolve => {
      require(['../view/keepwatch/keepwatch.vue'], resolve)
    }
  },
  {
    path: '/keepwatch/tasklist',
    component: resolve => {
      require(['../view/keepwatch/taskList.vue'], resolve)
    }
  },
  {
    path: '/keepwatch/record',
    component: resolve => {
      require(['../view/keepwatch/record.vue'], resolve)
    }
  },
  {
    path: '/keepwatch/message',
    component: resolve => {
      require(['../view/keepwatch/message.vue'], resolve)
    }
  },
  {
    path: '/keepwatch/single',
    component: (resolve) => {
      require(['../view/keepwatch/single.vue'], resolve)
    }
  },
  {
    path: '/keepwatch/singleRecord',
    component: (resolve) => {
      require(['../view/keepwatch/singleRecord.vue'], resolve)
    }
  },
  {
    path: '/keepwatch/radioIntercom',
    component: (resolve) => {
      require(['../view/keepwatch/radioIntercom.vue'], resolve)
    }
  },
  {
    path: '/soldier/manage',
    component: resolve => {
      require(['../view/soldier/manage.vue'], resolve)
    },
    children: [
      {
        path: '/soldier/manage/alarmPoint',
        component: resolve => {
          require(['../view/soldier/alarmSetting.vue'], resolve)
        }
      }
    ]
  },
  {
    path: '/soldier/point',
    component: resolve => {
      require(['../view/soldier/point.vue'], resolve)
    }
  },
  {
    path: '/tsmanagement/roll',
    component: resolve => {
      require(['../view/tsmanagement/roll.vue'], resolve)
    }
  },
  {
    path: '/tsmanagement/staff',
    component: resolve => {
      require(['../view/tsmanagement/staff.vue'], resolve)
    }
  },
  {
    path: '/tsmanagement/omecard',
    component: resolve => {
      require(['../view/tsmanagement/omeCard.vue'], resolve)
    }
  },
  {
    path: '/dict',
    component: resolve => {
      require(['../view/settings/sys/dict.vue'], resolve)
    }
  },
  {
    // 视频监控路由
    path: '/play_video',
    redirect: '/play_video/playback'
  },
  {
    path: '/play_video/realtime',
    component: resolve => {
      require(['../view/video/realtime.vue'], resolve)
    }
  },
  {
    path: '/play_video/playback',
    component: resolve => {
      require(['../view/video/playback/playrecord/playRecord.vue'], resolve)
    }
  },
  {
    path: '/play_video/picture',
    component: resolve => {
      require(['../view/video/playback/playpicture/pictureRecord.vue'], resolve)
    }
  },
  {
    path: '/play_video/download',
    component: resolve => {
      require(['../view/video/playback/downloadrecord/playDownload.vue'], resolve)
    }
  },
  {
    path: '/play_video/tvwall',
    component: resolve => {
      require(['../view/video/TVwall.vue'], resolve)
    }
  },
  {
    // 警情处理路由
    path: '/warning',
    component: resolve => {
      require(['../view/warning/warningManage.vue'], resolve)
    },
    redirect: '/warning/receive',
    children: [
      {
        path: '/warning/receive',
        component: resolve => {
          require(['../view/warning/receiveWarning.vue'], resolve)
        }
      },
      {
        path: '/warning/alarmMainframe',
        component: resolve => {
          require(['../view/warning/alarmMainframe.vue'], resolve)
        }
      },
      {
        path: '/warning/count',
        component: resolve => {
          require(['../view/warning/warningCount.vue'], resolve)
        }
      },
      {
        path: '/warning/equipmentAlarm',
        component: resolve => {
          require(['../view/warning/equipmentAlarm.vue'], resolve)
        }
      }
    ]
  },
  {
    path: '/map/2D',
    name: '/map/2D',
    component: resolve => {
      require(['../view/map2D/map2D.vue'], resolve)
    }
  },
  {
    // 3D电子地图
    path: '/map/3D',
    component: resolve => {
      require(['../view/map3D/map3D.vue'], resolve)
    }
  },
  {
    path: '/map/fengmap',
    component: resolve => {
      require(['../view/fengmap/fengmap.vue'], resolve)
    }
  },
  {
    path: '/mapEdit/fengmap',
    component: resolve => {
      require(['../view/fengmapEdit/fengmapEdit.vue'], resolve)
    }
  },
  {
    path: '/mapEdit/2D',
    component: resolve => {
      require(['../view/map2DEdit/map2DEdit.vue'], resolve)
    }
  },
  {
    // 3D电子地图 mapHomeEdit
    path: '/mapEdit/3D',
    component: resolve => {
      require(['../view/map3DEdit/map3DEdit.vue'], resolve)
    }
  },
  {
    // 地图配置页面
    path: '/mapEdit/param',
    component: resolve => {
      require(['../view/mapEditParam/mapEditParam.vue'], resolve)
    },
    redirect: '/mapEdit/param/TwoImensional',
    children: [
      {
        path: '/mapEdit/param/TwoImensional',
        component: resolve => {
          require(['../view/settings/sys/TwoImensional.vue'], resolve)
        }
      },
      {
        path: '/mapEdit/param/threeMapMode',
        component: resolve => {
          require(['../view/settings/sys/threeMapMode.vue'], resolve)
        }
      },
      {
        path: '/mapEdit/param/TwoMapIcon',
        component: resolve => {
          require(['../view/settings/sys/TwoMapIcon.vue'], resolve)
        }
      },
      {
        path: '/mapEdit/param/callCenterConfig',
        component: resolve => {
          require(['../view/settings/sys/callCenterConfig.vue'], resolve)
        }
      }
    ]
  },
  {
    // 应急指挥
    path: '/emergency/main',
    component: resolve => {
      require(['../view/map/mapHome.vue'], resolve)
    }
  },
  {
    // 应急预案
    path: '/emergency/plan',
    component: resolve => {
      require(['../view/emergency/emergencyPlan.vue'], resolve)
    }
  },
  {
    path: '/face',
    redirect: '/face/capture'
  },
  {
    path: '/face/capture',
    component: resolve => {
      require(['../view/face/Capture.vue'], resolve)
      // require(['../view/passageModule/adhibition/personnelTaffic.vue'], resolve) // 测试人员通行页面
    }
  },
  {
    path: '/pass/koala',
    component: resolve => {
      require(['../view/face/koala.vue'], resolve)
    }
  },
  {
    path: '/face/manage',
    component: resolve => {
      require(['../view/face/Manage.vue'], resolve)
    },
    redirect: '/face/manage/list',
    children: [
      {
        path: '/face/manage/list',
        component: resolve => {
          require(['../view/face/manage/List.vue'], resolve)
        }
      }
    ]
  },
  {
    path: '/face/dispatch',
    component: resolve => {
      require(['../view/face/Dispatch.vue'], resolve)
    },
    redirect: '/face/dispatch/task',
    children: [
      {
        path: '/face/dispatch/task',
        component: resolve => {
          require(['../view/face/dispatch/Task.vue'], resolve)
        }
      }
    ]
  },
  {
    path: '/face/search',
    component: resolve => {
      require(['../view/face/Search.vue'], resolve)
    },
    redirect: '/face/search/compare',
    children: [
      {
        path: '/face/search/compare',
        component: resolve => {
          require(['../view/face/search/Compare.vue'], resolve)
        }
      },
      {
        path: '/face/search/stranger',
        component: resolve => {
          require(['../view/face/search/Stranger.vue'], resolve)
        }
      }
    ]
  },
  {
    path: '/face/statistics',
    component: resolve => {
      require(['../view/face/Statistics.vue'], resolve)
    },
    redirect: '/face/statistics/today',
    children: [
      {
        path: '/face/statistics/today',
        component: resolve => {
          require(['../view/face/statistics/Today.vue'], resolve)
        }
      },
      {
        path: '/face/statistics/analyze',
        component: resolve => {
          require(['../view/face/statistics/Analyze.vue'], resolve)
        }
      },
      {
        path: '/face/statistics/compare',
        component: resolve => {
          require(['../view/face/search/Compare.vue'], resolve)
        }
      },
      {
        path: '/face/statistics/stranger',
        component: resolve => {
          require(['../view/face/search/Stranger.vue'], resolve)
        }
      }
    ]
  },
  {
    // 人员通行
    path: '/pass',
    redirect: '/pass/search'
  },

  {
    path: '/pass/search',
    component: resolve => {
      require(['../view/pass/Search.vue'], resolve)
    },
    redirect: '/pass/search/compare',
    children: [
      {
        path: '/pass/search/compare',
        component: resolve => {
          require(['../view/pass/search/Compare.vue'], resolve)
        }
      },
      {
        path: '/pass/search/stranger',
        component: resolve => {
          require(['../view/pass/search/Stranger.vue'], resolve)
        }
      }
    ]
  },
  {
    path: '/pass/statistics',
    component: resolve => {
      require(['../view/pass/Statistics.vue'], resolve)
    },
    redirect: '/pass/statistics/today',
    children: [
      {
        path: '/pass/statistics/today',
        component: resolve => {
          require(['../view/pass/statistics/Today.vue'], resolve)
        }
      },
      {
        path: '/pass/statistics/analyze',
        component: resolve => {
          require(['../view/pass/statistics/Analyze.vue'], resolve)
        }
      }
    ]
  },
  // 对讲管理
  {
    path: '/intercom',
    redirect: '/intercom/intercomManage'
  },
  // 对讲管理
  {
    path: '/intercom/intercomManage',
    component: resolve => {
      require(['../view/intercom/intercomManage.vue'], resolve)
    }
  },
  // 历史对讲
  {
    path: '/intercom/historyIntercom',
    component: resolve => {
      require(['../view/intercom/historyIntercom.vue'], resolve)
    }
  },
  // 人像识别
  {
    path: '/veriface',
    redirect: '/veriface/capture'
  }, {
    path: '/veriface/capture',
    component: (resolve) => {
      require(['../view/veriface/capture.vue'], resolve)
    }
  }, {
    path: '/veriface/manage',
    component: (resolve) => {
      require(['../view/veriface/manage.vue'], resolve)
    }
  }, {
    path: '/veriface/dispatch',
    component: (resolve) => {
      require(['../view/veriface/Dispatch.vue'], resolve)
    }
  }, {
    path: '/veriface/alarmSearch',
    component: (resolve) => {
      require(['../view/veriface/AlarmSearch.vue'], resolve)
    },
    meta: {
      keepAlive: true
    }
  }, {
    path: '/veriface/passerSearch',
    component: resolve => {
      require(['../view/veriface/PasserSearch.vue'], resolve)
    },
    meta: {
      keepAlive: true
    },
    redirect: '/veriface/PasserSearch/condition',
    children: [
      {
        path: '/veriface/PasserSearch/condition',
        component: resolve => {
          require(['../view/veriface/search/Condition.vue'], resolve)
        }
      },
      {
        path: '/veriface/PasserSearch/searchpic',
        component: resolve => {
          require(['../view/veriface/search/SearchPic.vue'], resolve)
        }
      }
    ]
  }, {
    path: '/veriface/track',
    component: (resolve) => {
      require(['../view/veriface/Track.vue'], resolve)
    }
  }, {
    path: '/veriface/statistics',
    component: (resolve) => {
      require(['../view/veriface/Statistics.vue'], resolve)
    },
    redirect: '/veriface/Statistics/today',
    children: [{
      path: '/veriface/Statistics/today',
      component: (resolve) => {
        require(['../view/veriface/statistics/Today.vue'], resolve)
      }
    }, {
      path: '/veriface/Statistics/analyze',
      component: (resolve) => {
        require(['../view/veriface/statistics/Analyze.vue'], resolve)
      }
    }]
  }, {
    path: '/setting/veriface',
    component: resolve => {
      require(['../view/veriface/setting/setting.vue'], resolve)
    },
    redirect: '/setting/veriface/org',
    children: [
      {
        path: '/setting/veriface/org',
        component: resolve => {
          require(['../view/veriface/setting/org.vue'], resolve)
        }
      },
      {
        path: '/setting/veriface/argumentSet',
        component: resolve => {
          require(['../view/veriface/setting/argumentSet.vue'], resolve)
        }
      },
      {
        path: '/setting/veriface/server',
        component: resolve => {
          require(['../view/veriface/setting/server.vue'], resolve)
        }
      }
    ]
  },
  // 视频结构化
  {
    path: '/structure',
    redirect: '/structure/captureRealtime'
  },
  // 实时结构化
  {
    path: '/structure/captureRealtime',
    component: (resolve) => {
      require(['../view/videoStructured/CaptureRealtime.vue'], resolve)
    }
  },
  // 综合查询
  {
    path: '/structure/integratedQuery',
    component: (resolve) => {
      require(['../view/videoStructured/IntegratedQuery.vue'], resolve)
    }
  },
  // 报警检索
  {
    path: '/structure/alarmSearch',
    component: (resolve) => {
      require(['../view/videoStructured/AlarmSearch.vue'], resolve)
    }
  },
  // 以图搜图
  {
    path: '/structure/imageSearch',
    component: (resolve) => {
      require(['../view/videoStructured/ImageSearch.vue'], resolve)
    }
  },
  // 结构化追踪
  {
    path: '/structure/structuredTrack',
    component: (resolve) => {
      require(['../view/videoStructured/StructuredTrack.vue'], resolve)
    }
  },
  // 布控管理
  {
    path: '/structure/controlManage',
    component: (resolve) => {
      require(['../view/videoStructured/ControlManage.vue'], resolve)
    }
  },
  // 数据统计
  {
    path: '/structure/statistics',
    component: (resolve) => {
      require(['../view/videoStructured/Statistics.vue'], resolve)
    },
    redirect: '/structure/statistics/todayData',
    children: [
      {
        path: 'todayData',
        component: resolve => { require(['../view/videoStructured/dataRecord/todayData.vue'], resolve) }
      },
      {
        path: 'recordAnalysis',
        component: resolve => { require(['../view/videoStructured/dataRecord/recordAnalysis.vue'], resolve) }
      }
    ]
  },
  // 结构化配置
  {
    path: '/setting/structure',
    component: resolve => {
      require(['../view/videoStructured/setting/StructureSetting.vue'], resolve)
    },
    redirect: '/setting/structure/org',
    children: [
      // 机构资源
      {
        path: 'org',
        component: resolve => { require(['../view/videoStructured/setting/children/org.vue'], resolve) }
      },
      // 服务器配置
      {
        path: 'service',
        component: resolve => { require(['../view/videoStructured/setting/children/service.vue'], resolve) }
      },
      // 高级参数配置
      {
        path: 'arguments',
        component: resolve => { require(['../view/videoStructured/setting/children/arguments.vue'], resolve) }
      }
    ]
  },
  {
    // 车辆分析
    path: '/vehicle',
    redirect: '/vehicle/carDetection'
  },
  {
    path: '/vehicle/analyze',
    component: resolve => {
      require(['../view/vehicle/analyze.vue'], resolve)
    }
  },
  {
    path: '/vehicle/outpark',
    component: resolve => {
      require(['../view/vehicle/outpark.vue'], resolve)
    }
  },
  {
    path: '/vehicle/stat',
    component: resolve => {
      require(['../view/vehicle/stat.vue'], resolve)
    },
    redirect: '/vehicle/stat/day',
    children: [
      {
        path: '/vehicle/stat/day',
        component: resolve => {
          require(['../view/vehicle/stat/day.vue'], resolve)
        }
      },
      {
        path: '/vehicle/stat/cross',
        component: resolve => {
          require(['../view/vehicle/stat/cross.vue'], resolve)
        }
      },
      {
        path: '/vehicle/stat/warning',
        component: resolve => {
          require(['../view/vehicle/stat/warning.vue'], resolve)
        }
      },
      {
        path: '/vehicle/stat/flow',
        component: resolve => {
          require(['../view/vehicle/stat/flow.vue'], resolve)
        }
      },
      {
        path: '/vehicle/stat/pass',
        component: resolve => {
          require(['../view/vehicle/query/pass.vue'], resolve)
        }
      }
    ]
  },
  {
    path: '/vehicle/deploy',
    component: resolve => {
      require(['../view/vehicle/deploy.vue'], resolve)
    },
    redirect: '/vehicle/deploy/exact',
    children: [
      {
        path: '/vehicle/deploy/exact',
        component: resolve => {
          require(['../view/vehicle/deploy/exact.vue'], resolve)
        }
      },
      {
        path: '/vehicle/deploy/black',
        component: resolve => {
          require(['../view/vehicle/deploy/black.vue'], resolve)
        }
      },
      {
        path: '/vehicle/deploy/other',
        component: resolve => {
          require(['../view/vehicle/other.vue'], resolve)
        }
      }
    ]
  },
  {
    path: '/vehicle/detection',
    component: resolve => {
      require(['../view/vehicle/detection.vue'], resolve)
    }
  },
  {
    path: '/vehicle/manage',
    component: resolve => {
      require(['../view/vehicle/manage.vue'], resolve)
    }
  },
  {
    path: '/structuring',
    redirect: '/structuring/humanContrast'
  },
  {
    path: '/structuring/humanContrast',
    component: resolve => {
      require(['../view/structuring/HumanContrast.vue'], resolve)
    }
  },
  {
    path: '/structuring/vehicleSearch',
    component: resolve => {
      require(['../view/structuring/VehicleSearch.vue'], resolve)
    }
  },
  {
    // 交通管理应用
    path: '/traffic',
    component: resolve => {
      require(['../view/settings/trafficManage/serverLink.vue'], resolve)
    }
  },
  {
    // 非机动车管理
    path: '/traffic/nonVehicleManage',
    component: resolve => {
      require(['../view/settings/trafficManage/nonVehicle/NonVehicleManage.vue'], resolve)
    }
  },
  {
    // 机动车管理
    path: '/traffic/vehicleManage',
    component: resolve => {
      require(['../view/settings/trafficManage/vehicle/vehicleManage.vue'], resolve)
    }
  },
  {
    // 非机动车管理统计分析
    path: '/traffic/nonVehicleStatistics',
    component: resolve => {
      require(['../view/settings/trafficManage/nonVehicle/Statistics.vue'], resolve)
    }
  },
  {
    // 智能交通人车同检
    path: '/traffic/peopleVehicles',
    component: resolve => {
      require(['../view/settings/trafficManage/personVehicle/personDerection.vue'], resolve)
    }
  },
  {
    // 智能交通记录查询
    path: '/traffic/recordQuery',
    component: resolve => {
      require(['../view/settings/trafficManage/recordQuery/Statistics.vue'], resolve)
    }
  },
  {
    // 运维管理
    path: '/ops'
    // redirect: '/ops/deviceMonitor'
  },
  {
    path: '/ops/deviceMonitor',
    component: resolve => {
      // require(['../view/ops/deviceMonitor.vue'], resolve)
      require(['../view/ops/ops.vue'], resolve)
    }
  },
  {
    path: '/ops/videoMonitor',
    component: resolve => {
      // require(['../view/ops/videoMonitor.vue'], resolve)
      require(['../view/ops/ops.vue'], resolve)
    }
  },
  {
    path: '/ops/assetManage',
    component: resolve => {
      require(['../view/ops/ops.vue'], resolve)
      // require(['../view/ops/assetManage.vue'], resolve)
    }
  },
  {
    path: '/ops/VideoDiagnostic',
    component: resolve => {
      require(['../view/ops/ops.vue'], resolve)
      // require(['../view/ops/VideoDiagnostic.vue'], resolve)
    }
  },
  {
    path: '/ops/workOrder',
    component: resolve => { // 工单管理
      require(['../view/ops/ops.vue'], resolve)
      // require(['../view/ops/workOrder/WorkOrder.vue'], resolve)
    }
  },
  {
    path: '/ops/log',
    component: resolve => {
      require(['../view/ops/ops.vue'], resolve)
      // require(['../view/ops/log.vue'], resolve)
    }
  },
  {
    // 值班管理
    path: '/business/dutyManage',
    redirect: '/business/dutyManage/list',
    component: resolve => {
      require(['../view/business/dutyManage.vue'], resolve)
    },
    children: [
      {
        path: 'list',
        name: 'DutyList',
        component: resolve => {
          require(['src/view/business/duty/DutyList.vue'], resolve)
        }
      },
      {
        path: 'log',
        name: 'DutyLog',
        component: resolve => {
          require(['src/view/business/duty/DutyLog.vue'], resolve)
        }
      },
      // {
      //   path: 'shift_log',
      //   name: 'ShiftLog',
      //   component: resolve => {
      //     require(['src/view/shift/DutyShift.vue'], resolve)
      //   }
      // },
      {
        path: 'plan',
        name: 'DutyPlan',
        component: resolve => {
          require(['src/view/business/duty/DutyPlan.vue'], resolve)
        }
      },
      {
        path: 'template',
        name: 'DutyTemplate',
        component: resolve => {
          require(['src/view/business/duty/DutyTemplate.vue'], resolve)
        }
      },
      {
        path: 'personnel',
        name: 'DutyPersonnel',
        component: resolve => {
          require(['src/view/business/duty/DutyPersonnel.vue'], resolve)
        }
      },
      {
        path: 'time',
        name: 'DutyTime',
        component: resolve => {
          require(['src/view/business/duty/DutyTime.vue'], resolve)
        }
      },
      {
        path: 'notice',
        name: 'DutyNotice',
        component: resolve => {
          require(['src/view/business/duty/DutyNotice.vue'], resolve)
        }
      }
    ]
  },
  // 接警管理
  {
    path: '/business/receiveAlarm',
    component: resolve => {
      require(['../view/business/receiveAlarm.vue'], resolve)
    }
  },
  // 案件管理
  {
    path: '/business/caseManagement',
    component: resolve => {
      require(['../view/business/caseManagement.vue'], resolve)
    }
  },
  // 案件处理
  {
    path: '/business/caseProcessing',
    name: 'businessCaseProcessing',
    component: resolve => {
      require(['../view/business/playrecord/playRecord.vue'], resolve)
    }
  },
  // 接力追踪
  {
    path: '/business/relayTracking',
    component: resolve => {
      require(['../view/business/relayTracking/relayTracking.vue'], resolve)
    }
  },
  // 值班管理
  {
    path: '/business/logManage',
    redirect: '/business/logManage/shifting',
    component: resolve => {
      require(['../view/business/logManage.vue'], resolve)
    },
    children: [
      // {
      //   path: 'shifting',
      //   name: 'shiftingDuty',
      //   component: resolve => {
      //     require(['src/view/business/log/shiftingDuty.vue'], resolve)
      //   }
      // },
      {
        path: 'shifting',
        name: 'shiftingDuty',
        component: resolve => {
          require(['src/view/shift/DutyShift.vue'], resolve)
        }
      },
      {
        path: 'videoCopy',
        name: 'videoCopy',
        component: resolve => {
          require(['src/view/business/log/videoCopy.vue'], resolve)
        }
      },
      {
        path: 'equipment',
        name: 'equipmentPatrol',
        component: resolve => {
          require(['src/view/business/log/equipmentPatrol.vue'], resolve)
        }
      }
    ]
  },
  {
    // 系统配置
    path: '/settings',
    redirect: '/settings/equipment'
  },
  {
    // 校内交通
    path: '/settings/vehicle',
    component: resolve => {
      require(['../view/settings/carManage.vue'], resolve)
    },
    redirect: '/settings/vehicle/org',
    children: [
      {
        path: '/settings/vehicle/org',
        component: resolve => {
          require(['../view/settings/carPage/org.vue'], resolve)
        }
      },
      {
        path: '/settings/vehicle/server',
        component: resolve => {
          require(['../view/settings/carPage/server.vue'], resolve)
        }
      }
    ]
  },
  {
    // 交通管理配置
    path: '/settings/traffic',
    component: resolve => {
      require(['../view/settings/trafficManage/traffic.vue'], resolve)
    },
    redirect: '/settings/traffic/trafficDevice',
    children: [
      {
        path: '/settings/traffic/trafficDevice',
        component: resolve => {
          require(['../view/settings/trafficManage/trafficDevice.vue'], resolve)
        }
      },
      {
        path: '/settings/traffic/trafficServer',
        component: resolve => {
          require(['../view/settings/trafficManage/trafficServer.vue'], resolve)
        }
      },
      {
        path: '/settings/traffic/trafficHighSet',
        component: resolve => {
          require(['../view/settings/trafficManage/trafficHighSet.vue'], resolve)
        }
      }
    ]
  },
  {
    // 设备管理
    path: '/settings/equipment',
    component: resolve => {
      require(['../view/settings/equipment/equipmentManage.vue'], resolve)
    }
  },
  {
    // rtsp流配置
    path: '/settings/rtsp',
    component: resolve => {
      require(['../view/settings/equipment/rtspStreamConfig.vue'], resolve)
    }
  },
  {
    path: '/settings/door',
    component: resolve => {
      require(['../view/door/manage.vue'], resolve)
    }
  },
  {
    path: '/settings/door/manage/serverConfig',
    component: resolve => {
      require(['../view/door/serverConfig.vue'], resolve)
    }
  },
  {
    path: '/settings/door/manage/orgConfig',
    component: resolve => {
      require(['../view/door/orgConfig.vue'], resolve)
    }
  },
  {
    // 访客管理
    path: '/settings/face',
    component: resolve => {
      require(['../view/settings/faceManage.vue'], resolve)
    },
    redirect: '/settings/face/faceChannel',
    children: [
      {
        path: '/settings/face/faceChannel',
        component: resolve => {
          require(['../view/settings/facePage/faceChannel.vue'], resolve)
        }
      },
      {
        path: '/settings/face/faceServer',
        component: resolve => {
          require(['../view/settings/facePage/faceServer.vue'], resolve)
        }
      }
    ]
  },

  {
    // 通行管理
    path: '/settings/configuration',
    component: resolve => {
      require(['../view/passageModule/configuration/configuration.vue'], resolve)
    },
    redirect: '/settings/deviceManagement',
    children: [
      {
        path: '/settings/deviceManagement', // 设备管理
        component: resolve => {
          require(['../view/passageModule/configuration/deviceManagement.vue'], resolve)
        }
      }
      // {
      //   path: '/settings/personnelManagement', // 人员管理
      //   component: resolve => {
      //     require(['../view/passageModule/configuration/personnelManagement.vue'], resolve)
      //   }
      // }
    ]
  },
  {
    // 报警管理
    path: '/settings/alarm',
    redirect: '/settings/alarm/org',
    component: resolve => {
      require(['../view/settings/alarmManage/orgConfig.vue'], resolve)
    },
    children: [
      {
        path: '/settings/alarm/time',
        component: resolve => {
          require(['../view/settings/alarmManage/timeTemplate.vue'], resolve)
        }
      },
      {
        path: '/settings/alarm/params',
        component: resolve => {
          require(['../view/settings/alarmManage/paramsSetting.vue'], resolve)
        }
      },
      {
        path: '/settings/alarm/org',
        component: resolve => {
          require(['../view/settings/alarmManage/orgConfig.vue'], resolve)
        }
      },
      {
        path: '/settings/alarm/sort',
        component: resolve => {
          require(['../view/settings/alarmManage/sortShow.vue'], resolve)
        }
      }
    ]
  },
  // 人员通行
  {
    path: '/personnelTaffic',
    component: resolve => {
      require(['../view/passageModule/adhibition/adhibition.vue'], resolve)
    },
    redirect: '/personnelTaffic/monitoring', // 这个重定向第一个子页面
    children: [
      {
        path: '/personnelTaffic/monitoring', // 实时监控
        component: resolve => {
          require(['../view/passageModule/adhibition/monitoring.vue'], resolve)
        }
      },
      {
        path: '/personnelTaffic/records', // 通行记录
        component: resolve => {
          require(['../view/passageModule/adhibition/personnelTaffic.vue'], resolve)
        }
      },
      {
        path: '/personnelTaffic/witnessRecords', // 人证记录
        component: resolve => {
          require(['../view/passageModule/adhibition/witnessRecords.vue'], resolve)
        }
      },
      {
        path: '/personnelTaffic/personnelManagement', // 人员管理
        component: resolve => {
          require(['../view/passageModule/configuration/personnelManagement.vue'], resolve)
        }
      },
      {
        path: '/personnelTaffic/accessControlAuthority', // 门禁权限
        component: resolve => {
          require(['../view/passageModule/adhibition/accessControlAuthority.vue'], resolve)
        }
      },
      {
        path: '/personnelTaffic/facePermission', // 人脸权限
        component: resolve => {
          require(['../view/passageModule/adhibition/facePermission.vue'], resolve)
        }
      },
      {
        path: '/personnelTaffic/dataStatistics', // 数据统计
        component: resolve => {
          require(['../view/passageModule/adhibition/dataStatistics.vue'], resolve)
        }
      }
    ]

  },

  // {
  //   path: '/personnelTaffic/records', // 通行记录
  //   component: resolve => {
  //     require(['../view/passageModule/adhibition/personnelTaffic.vue'], resolve)
  //   }
  // },
  // {
  //   path: '/personnelTaffic/personnelManagement', // 人员管理
  //   component: resolve => {
  //     require(['../view/passageModule/adhibition/personnelManagement.vue'], resolve)
  //   }
  // },
  // {
  //   path: '/personnelTaffic/dataStatistics', // 数据统计
  //   component: resolve => {
  //     require(['../view/passageModule/adhibition/dataStatistics.vue'], resolve)
  //   }
  // },
  {
    // 报警求助
    path: '/settings/alarmHelps',
    redirect: '/settings/alarmHelps/center',
    component: resolve => {
      require(['../view/settings/alarmHelps/alarmCenter.vue'], resolve)
    },
    children: [
      {
        path: '/settings/alarmHelps/server',
        component: resolve => {
          require(['../view/settings/alarmHelps/alarmServer.vue'], resolve)
        }
      },
      {
        path: '/settings/alarmHelps/terminal',
        component: resolve => {
          require(['../view/settings/alarmHelps/alarmTerminal.vue'], resolve)
        }
      },
      {
        path: '/settings/alarmHelps/center',
        component: resolve => {
          require(['../view/settings/alarmHelps/alarmCenter.vue'], resolve)
        }
      }
    ]
  },
  {
    path: '/settings/inspectServer',
    component: resolve => {
      require(['../view/settings/sys/inspectServer.vue'], resolve)
    }
  },
  {
    // 资源管理
    path: '/settings/resource',
    component: resolve => {
      require(['../view/settings/resource/resourceManage.vue'], resolve)
    }
  },
  {
    path: '/settings/broadcast',
    component: resolve => {
      require(['../view/settings/inspectPage/inspectManage.vue'], resolve)
    }
  },
  {
    path: '/system/log',
    component: resolve => {
      require(['src/view/settings/sys/SysLog.vue'], resolve)
    }
  },
  {
    path: '/settings/system',
    component: resolve => {
      require(['../view/settings/sys/sysManage.vue'], resolve)
    },
    redirect: '/settings/system/platform',
    children: [
      {
        path: '/settings/system/platform',
        component: resolve => {
          require(['../view/settings/sys/platformInfor.vue'], resolve)
        }
      },
      {
        path: '/settings/system/params',
        component: resolve => {
          require(['../view/settings/sys/sysParameter.vue'], resolve)
        }
      },
      {
        path: '/settings/system/timeconfig',
        component: resolve => {
          require(['../view/settings/sys/timeConfig.vue'], resolve)
        }
      },
      {
        path: '/settings/system/TwoImensional',
        component: resolve => {
          require(['../view/settings/sys/TwoImensional.vue'], resolve)
        }
      },
      {
        path: '/settings/system/threeMapMode',
        component: resolve => {
          require(['../view/settings/sys/threeMapMode.vue'], resolve)
        }
      },
      {
        path: '/settings/system/TwoMapIcon',
        component: resolve => {
          require(['../view/settings/sys/TwoMapIcon.vue'], resolve)
        }
      },
      {
        path: '/settings/system/inspectServer',
        component: resolve => {
          require(['../view/settings/sys/inspectServer.vue'], resolve)
        }
      }
    ]
  },
  {
    path: '/settings/user',
    component: resolve => {
      require(['../view/settings/user/userManage.vue'], resolve)
    },
    redirect: '/settings/user/custom',
    children: [
      {
        path: '/settings/user/custom',
        component: resolve => {
          require(['../view/settings/user/user/user.vue'], resolve)
        }
      },
      {
        path: '/settings/user/powerdist',
        component: resolve => {
          require(['../view/settings/user/power/powerdist.vue'], resolve)
        }
      },
      {
        path: '/settings/user/role',
        component: resolve => {
          require(['../view/settings/user/role/role.vue'], resolve)
        }
      },
      {
        path: '/settings/user/safe',
        component: resolve => {
          require(['../view/settings/user/safe/safePolicy.vue'], resolve)
        }
      }
    ]
  },
  {
    // 录像管理
    path: '/settings/video',
    component: resolve => {
      require(['../view/settings/videoManage.vue'], resolve)
    },
    redirect: '/settings/video/homepage',
    children: [
      {
        path: '/settings/video/homepage',
        component: resolve => {
          require(['../view/settings/videoPage/videoShow.vue'], resolve)
        }
      },
      {
        path: '/settings/video/plan',
        component: resolve => {
          require(['../view/settings/videoPage/videoPane/plan.vue'], resolve)
        }
      },
      {
        path: '/settings/video/holiday',
        component: resolve => {
          require(['../view/settings/videoPage/videoPane/holiday.vue'], resolve)
        }
      }
    ]
  },
  {
    // 运维配置
    path: '/settings/ops',
    redirect: '/ops/repairUnit'
  },
  {
    path: '/ops/repairUnit',
    component: resolve => {
      require(['../view/ops/ops.vue'], resolve)
      // require(['../view/settings/ops/repairUnit.vue'], resolve)
    }
  },
  {
    path: '/ops/parameter',
    component: resolve => {
      require(['../view/ops/ops.vue'], resolve)
      // require(['../view/settings/ops/parameter.vue'], resolve)
    }
  },
  {
    path: '/ops/diagnoseServer',
    component: resolve => {
      require(['../view/ops/ops.vue'], resolve)
      // require(['../view/settings/ops/diagnoseServer.vue'], resolve)
    }
  },
  {
    path: '/ops/plans',
    component: resolve => {
      require(['../view/ops/ops.vue'], resolve)
    }
  },
  {
    path: '/ops/global',
    component: resolve => {
      require(['../view/ops/ops.vue'], resolve)
    }
  },
  {
    path: '/ops/individuation',
    component: resolve => {
      require(['../view/ops/ops.vue'], resolve)
    }
  },
  {
    path: '/ops/white_list',
    component: resolve => {
      require(['../view/ops/ops.vue'], resolve)
    }
  },
  {
    path: '/apitest',
    component: resolve => {
      require(['../view/apitest.vue'], resolve)
    }
  },
  {
    path: '/log',
    component: resolve => {
      require(['../view/log/query.vue'], resolve)
    }
  },
  {
    path: '/journal',
    component: resolve => {
      require(['../view/log/journal.vue'], resolve)
    }
  },
  {
    path: '/interconnect/local',
    component: resolve => {
      require(['../view/interconnect/Interconnect.vue'], resolve)
    }
  },
  { // 本地配置
    path: '/localConf',
    component: resolve => {
      require(['../view/localConf/localConf.vue'], resolve)
    }
  },
  { // 电视墙配置
    path: '/settings/tvwall',
    component: resolve => {
      require(['../view/video/TVwallEdit.vue'], resolve)
    }
  },
  { // 对讲配置
    path: '/talk/talkConfig',
    component: resolve => {
      require(['../view/settings/talkConfig/talkCenter.vue'], resolve)
    }
  }
]
