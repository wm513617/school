import {
  mapMutations,
  mapActions
} from 'vuex'
let TTStimer
let plugin = null
export default {
  components: {},
  data() {
    return {
      wallChannelIdList: [],
      channelId: '',
      alarmTitleClick: null,
      isHasConfirm: false,
      isAlarmDeal: 'alarmDealFlag',
      alarmActiveType: '0',
      debug: false,
      alarmAppFeatures: [], // 报警区域列表
      warnModal: false,
      warnInfoTabs: [{
        title: '报警源信息',
        value: 'orign',
        disabled: false,
        active: true
      }, {
        title: '智能信息',
        value: 'inteligent',
        disabled: false,
        active: false
      }],
      // 报警类型Tabs
      // warningTabs: [
      //   {
      //     title: '普通报警',
      //     value: '0',
      //     number: 0,
      //     disabled: false,
      //     active: false
      //   },
      //   {
      //     title: '视频报警',
      //     value: '1',
      //     number: 0,
      //     disabled: false,
      //     active: false
      //   },
      //   {
      //     title: '智能报警',
      //     value: '2',
      //     number: 0,
      //     disabled: false,
      //     active: false
      //   },
      //   {
      //     title: '报警求助',
      //     value: '3',
      //     number: 0,
      //     disabled: false,
      //     active: false
      //   },
      //   {
      //     title: '消防报警',
      //     value: '4',
      //     number: 0,
      //     disabled: false,
      //     active: false
      //   },
      //   {
      //     title: '单兵报警',
      //     value: '5',
      //     number: 0,
      //     disabled: false,
      //     active: false
      //   },
      //   {
      //     title: '系统异常',
      //     value: '6',
      //     number: 0,
      //     disabled: false,
      //     active: false
      //   }
      // ],
      warnListColumns: [],
      ordinaryAlarmColumns: [ // 普通报警、消防报警列表项
        {
          type: 'selection',
          width: 50,
          align: 'center'
        },
        {
          // type: 'index',
          title: '操作',
          minWidth: 70,
          align: 'center',
          render: (h, params) => {
            let icon = true
            return h('div', [
              h('span', {
                class: {
                  iconfont: true,
                  'icon-details': icon
                },
                style: {
                  cursor: 'pointer'
                },
                domProps: {
                  title: '预案'
                },
                on: {
                  click: (e) => {
                    e.stopPropagation()
                    this.details(params.row)
                  }
                }
              }),
              h('span', {
                class: {
                  iconfont: true,
                  'icon-deal-alarm': icon
                },
                domProps: {
                  title: '处警'
                },
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: (e) => {
                    e.stopPropagation()
                    this.emergencyPlan(params.row)
                  }
                }
              })
            ])
          }
        },
        {
          title: '报警时间',
          key: 'time',
          minWidth: 100,
          // ellipsis: true,
          render: (h, params) => {
            let text = params.row.time ? this.$moment(parseInt(params.row.time) * 1000).format('YYYY-MM-DD HH:mm:ss') : ''
            return h('span', {
              domProps: {
                title: params.row.time ? this.$moment(parseInt(params.row.time) * 1000).format('YYYY-MM-DD HH:mm:ss') : ''
              },
              style: {
                color: params.row.level ? this.warnParametersList[params.row.level - 1].msgColour : ''
              }
            }, text)
          }
        },
        {
          title: '报警名称',
          key: 'name',
          width: 130,
          // ellipsis: true,
          render: (h, params) => {
            let text = params.row.name
            return h('span', {
              domProps: {
                title: params.row.name
              },
              style: {
                color: params.row.level ? this.warnParametersList[params.row.level - 1].msgColour : ''
              }
            }, text)
          }
        },
        {
          title: '报警子类型',
          key: 'subtype',
          minWidth: 96,
          render: (h, params) => {
            let text = this.alarmZoneType[params.row.subtype]
            return h('span', {
              domProps: {
                title: this.alarmZoneType[params.row.subtype]
              },
              style: {
                color: params.row.level ? this.warnParametersList[params.row.level - 1].msgColour : ''
              }
            }, text)
          }
        },
        {
          title: '报警源',
          key: 'srcName',
          minWidth: 100,
          ellipsis: true,
          render: (h, params) => {
            let text = params.row.srcName
            return h('span', {
              domProps: {
                title: params.row.srcName
              },
              style: {
                color: params.row.level ? this.warnParametersList[params.row.level - 1].msgColour : ''
              }
            }, text)
          }
        },
        {
          title: '机构',
          key: 'organization',
          minWidth: 80,
          ellipsis: true,
          render: (h, params) => {
            let text = params.row.organization ? params.row.organization : params.row.orgName
            return h('span', {
              domProps: {
                title: params.row.organization ? params.row.organization : params.row.orgName
              },
              style: {
                color: params.row.level ? this.warnParametersList[params.row.level - 1].msgColour : ''
              }
            }, text)
          }
        },
        {
          title: '级别',
          key: 'level',
          width: 60,
          render: (h, params) => {
            let text = params.row.level
            return h('span', {
              domProps: {
                title: params.row.level
              },
              style: {
                color: params.row.level ? this.warnParametersList[params.row.level - 1].msgColour : ''
              }
            }, text)
          }
        },
        {
          title: '报警状态',
          key: 'status',
          minWidth: 84,
          render: (h, params) => {
            let text = params.row.status
            return h('span', {
              domProps: {
                title: params.row.status
              },
              style: {
                color: params.row.level ? this.warnParametersList[params.row.level - 1].msgColour : ''
              }
            }, text)
          }
        }
      ],
      videoAlarmColumns: [ // 视频报警、智能报警列表项
        {
          type: 'selection',
          width: 50,
          align: 'center'
        },
        {
          // type: 'index',
          title: '操作',
          minWidth: 60,
          align: 'center',
          render: (h, params) => {
            let icon = true
            return h('div', [
              h('span', {
                class: {
                  iconfont: true,
                  'icon-details': icon
                },
                domProps: {
                  title: '预案'
                },
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: (e) => {
                    e.stopPropagation()
                    this.details(params.row)
                  }
                }
              }),
              h('span', {
                class: {
                  iconfont: true,
                  'icon-deal-alarm': icon
                },
                domProps: {
                  title: '处警'
                },
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: (e) => {
                    e.stopPropagation()
                    this.emergencyPlan(params.row)
                  }
                }
              })
            ])
          }
        },
        {
          title: '报警时间',
          key: 'time',
          width: 100,
          // ellipsis: true,
          render: (h, params) => {
            let text = params.row.time ? this.$moment(parseInt(params.row.time) * 1000).format('YYYY-MM-DD HH:mm:ss') : ''
            return h('span', {
              style: {
                color: params.row.level ? this.warnParametersList[params.row.level - 1].msgColour : ''
              }
            }, text)
          }
        },
        {
          title: '通道名称',
          key: 'name',
          width: 130,
          render: (h, params) => {
            let text = params.row.name
            return h('span', {
              domProps: {
                title: params.row.name
              },
              style: {
                color: params.row.level ? this.warnParametersList[params.row.level - 1].msgColour : ''
              }
            }, text)
          }
          // width: 120,
          // ellipsis: true
        },
        {
          title: '报警类型',
          key: 'eventType',
          render: (h, params) => {
            let text = params.row.eventType === 'focusAttention' ? params.row.attentionType : this.alarmTypeList[params.row.eventType]
            return h('span', {
              style: {
                color: params.row.level ? this.warnParametersList[params.row.level - 1].msgColour : ''
              }
            }, text)
          }
          // width: 100
        },
        {
          title: '机构',
          key: 'organization',
          // width: 100
          render: (h, params) => {
            let text = params.row.organization ? params.row.organization : params.row.orgName
            return h('span', {
              domProps: {
                title: params.row.organization ? params.row.organization : params.row.orgName
              },
              style: {
                color: params.row.level ? this.warnParametersList[params.row.level - 1].msgColour : ''
              }
            }, text)
          }
        },
        {
          title: '级别',
          key: 'level',
          // width: 100
          render: (h, params) => {
            let text = params.row.level
            return h('span', {
              domProps: {
                title: params.row.level
              },
              style: {
                color: params.row.level ? this.warnParametersList[params.row.level - 1].msgColour : ''
              }
            }, text)
          }
        },
        {
          title: '报警状态',
          key: 'status',
          render: (h, params) => {
            let text = params.row.name === undefined ? '' : ''
            return h('span', {
              style: {
                color: params.row.level ? this.warnParametersList[params.row.level - 1].msgColour : ''
              }
            }, text)
          }
          // width: 100
        }
      ],
      alarmForHelpColumns: [ // 报警求助列表项
        {
          type: 'selection',
          width: 50,
          align: 'center'
        },
        {
          // type: 'index',
          title: '操作',
          minWidth: 60,
          align: 'center',
          render: (h, params) => {
            let icon = true
            return h('div', [
              h('span', {
                class: {
                  iconfont: true,
                  'icon-details': icon
                },
                domProps: {
                  title: '预案'
                },
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: (e) => {
                    e.stopPropagation()
                    this.details(params.row)
                  }
                }
              }),
              h('span', {
                class: {
                  iconfont: true,
                  'icon-deal-alarm': icon
                },
                domProps: {
                  title: '处警'
                },
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: (e) => {
                    e.stopPropagation()
                    this.emergencyPlan(params.row)
                  }
                }
              })
            ])
          }
        },
        {
          title: '报警时间',
          key: 'time',
          width: 100,
          // ellipsis: true,
          render: (h, params) => {
            let text = params.row.time ? this.$moment(parseInt(params.row.time) * 1000).format('YYYY-MM-DD HH:mm:ss') : ''
            return h('span', {
              style: {
                color: params.row.level ? this.warnParametersList[params.row.level - 1].msgColour : ''
              }
            }, text)
          }
        },
        {
          title: '设备名称',
          key: 'srcName',
          render: (h, params) => {
            let text = params.row.srcName
            return h('span', {
              domProps: {
                title: text
              },
              style: {
                color: params.row.level ? this.warnParametersList[params.row.level - 1].msgColour : ''
              }
            }, text)
          }
          // width: 120,
          // ellipsis: true
        },
        {
          title: '对讲ID',
          key: 'askId',
          render: (h, params) => {
            let text = params.row.askId
            return h('span', {
              style: {
                color: params.row.level ? this.warnParametersList[params.row.level - 1].msgColour : ''
              }
            }, text)
          }
          // width: 100
        },
        {
          title: '级别',
          key: 'level',
          render: (h, params) => {
            let text = params.row.level
            return h('span', {
              style: {
                color: params.row.level ? this.warnParametersList[params.row.level - 1].msgColour : ''
              }
            }, text)
          }
          // width: 100
        },
        {
          title: '对讲状态',
          key: 'eventType',
          render: (h, params) => {
            let text = params.row.status ? params.row.status : this.alarmTypeList[params.row.eventType]
            return h('span', {
              style: {
                color: params.row.level ? this.warnParametersList[params.row.level - 1].msgColour : ''
              }
            }, text)
          }
          // width: 100
        }
      ],
      soldierAlarmColumns: [ // 单兵报警列表项
        {
          type: 'selection',
          width: 50,
          align: 'center'
        },
        {
          // type: 'index',
          title: '操作',
          width: 100,
          align: 'center',
          render: (h, params) => {
            let icon = true
            return h('div', [
              h('span', {
                class: {
                  iconfont: true,
                  'icon-details': icon
                },
                domProps: {
                  title: '预案'
                },
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: (e) => {
                    e.stopPropagation()
                    this.details(params.row)
                  }
                }
              }),
              h('span', {
                class: {
                  iconfont: true,
                  'icon-deal-alarm': icon
                },
                domProps: {
                  title: '处警'
                },
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: (e) => {
                    e.stopPropagation()
                    this.emergencyPlan(params.row)
                  }
                }
              })
            ])
          }
        },
        {
          title: '报警时间',
          key: 'date',
          minWidth: 65,
          ellipsis: true,
          render: (h, params) => {
            let text = params.row.time ? this.$moment(parseInt(params.row.time) * 1000).format('YYYY-MM-DD HH:mm:ss') : ''
            return h('span', {
              style: {
                color: params.row.level ? this.warnParametersList[params.row.level - 1].msgColour : ''
              }
            }, text)
          }
        },
        {
          title: '报警人',
          key: 'contact',
          render: (h, params) => {
            let text = params.row.sender ? params.row.sender : (params.row.message.sender ? params.row.message.sender : params.row.message.realname)
            return h('span', {
              style: {
                color: params.row.level ? this.warnParametersList[params.row.level - 1].msgColour : ''
              }
            }, text)
          }
          // width: 120,
          // ellipsis: true
        },
        {
          title: '报警类型',
          key: 'phone',
          render: (h, params) => {
            let text = this.alarmTypeList[params.row.eventType]
            return h('span', {
              style: {
                color: params.row.level ? this.warnParametersList[params.row.level - 1].msgColour : ''
              }
            }, text)
          }
          // width: 100
        },
        {
          title: '位置',
          key: 'leval',
          render: (h, params) => {
            let text = params.row.message ? params.row.message.position : ''
            return h('span', {
              style: {
                color: params.row.level ? this.warnParametersList[params.row.level - 1].msgColour : ''
              }
            }, text)
          }
          // width: 100
        }
      ],
      systemException: [ // 系统异常
        {
          type: 'selection',
          width: 50,
          align: 'center'
        },
        {
          title: '报警时间',
          key: 'date',
          minWidth: 65,
          ellipsis: true,
          render: (h, params) => {
            let text = params.row.message ? this.$moment(parseInt(params.row.message.date) * 1000).format('YYYY-MM-DD HH:mm:ss') : params.row.time
            return h('span', {}, text)
          }
        },
        {
          title: '报警设备',
          key: 'phone',
          render: (h, params) => {
            let text = this.alarmTypeList[params.row.eventType]
            return h('span', {}, text)
          }
          // width: 100
        },
        {
          title: '报警类型',
          key: 'phone',
          render: (h, params) => {
            let text = this.alarmTypeList[params.row.eventType]
            return h('span', {}, text)
          }
          // width: 100
        },
        {
          title: '机构',
          key: 'organization'
          // width: 100
        }
      ],
      warnColumns: [{
        title: '计数',
        key: 'count',
        align: 'center',
        width: 80,
        render: (h, params) => {
          let text = params.row.count
          return h('span', {
            style: {
              color: params.row.level ? this.warnParametersList[params.row.level - 1].msgColour : ''
            }
          }, text)
        }
      }, {
        title: '时间',
        key: 'time',
        width: 100,
        align: 'center',
        render: (h, params) => {
          let text = params.row.time ? this.$moment(parseInt(params.row.time) * 1000).format('YYYY-MM-DD HH:mm:ss') : ''
          return h('span', {
            style: {
              color: params.row.level ? this.warnParametersList[params.row.level - 1].msgColour : ''
            }
          }, text)
        }
      }, {
        title: '机构',
        key: 'organization',
        align: 'center',
        width: 150,
        render: (h, params) => {
          let text = params.row.organization
          return h('span', {
            style: {
              color: params.row.level ? this.warnParametersList[params.row.level - 1].msgColour : '',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            },
            domProps: {
              title: text
            }
          }, text)
        }
      }, {
        title: '名称',
        key: 'name',
        align: 'center',
        render: (h, params) => {
          let text = params.row.name
          return h('span', {
            style: {
              color: params.row.level ? this.warnParametersList[params.row.level - 1].msgColour : '',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            },
            domProps: {
              title: text
            }
          }, text)
        }
      }, {
        title: '类型',
        key: 'eventType',
        align: 'center',
        width: 100,
        render: (h, params) => {
          let text = this.alarmTypeList[params.row.eventType]
          return h('span', {
            style: {
              color: params.row.level ? this.warnParametersList[params.row.level - 1].msgColour : ''
            }
          }, text)
        }
      }],
      warnPlanList: [{
        value: '误报',
        label: '误报'
      }, {
        value: '演练',
        label: '演练'
      }, {
        value: '测试',
        label: '测试'
      }, {
        value: '编译预案',
        label: '编译预案'
      }],
      warnPlanListOpt: [{
        value: 100,
        label: '预案加载中',
        content: ''
      }],
      confirmWarnList: [],
      warnPlanSelect: '',
      warnAffirmInfo: '',
      isWarnAccept: true,
      isWarnBatch: false,
      receiveWarnListView: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
      warnParametersList: [],
      warnMusicList: [],
      alarmZoneType: { // 报警防区子类型
        perimeterAlarm: '周界报警',
        intrusionAlarm: '入侵报警',
        electricFence: '电子围栏',
        helpSeek: '报警求助',
        smoke: '感烟',
        temperature: '感温',
        hydrant: '消火栓',
        handNewspaper: '手报'
      },
      alarmTypeList: {
        soldier: '单兵一键报警',
        individualAlarm: '单兵一键报警',
        patrol: '巡更异常报警',
        patrolAlarm: '巡更异常报警',
        alarmInput: '报警输入',
        alarmOut: '报警输出',
        focusAttention: '重点关注',
        // 智能类
        perimeter: '周界保护',
        tripwire: '绊线',
        leftObject: '物品遗留',
        missingObject: '物品丢失',
        loitering: '非法停留',
        retrogradeDetection: '逆行检测',
        lingerDetection: '徘徊检测',
        doubleCordon: '双警戒线',
        blackList: '黑名单',
        whiteList: '白名单',
        dispatch: '布控',
        areaInvade: '区域入侵',
        fastMove: '快速移动',
        parkDetect: '停车检测',
        humanAssemble: '人员聚集',
        objectMove: '物品搬移',
        // 监控点类
        alarmMoveSense: '移动侦测',
        videoMask: '视频遮挡',
        sceneSwitch: '镜头移位',
        definitionAbnormal: '清晰度异常',
        brightnessAbnormal: '亮度异常',
        screenFreeze: '画面冻结',
        noise: '噪声检测',
        signalLoss: '信号缺失',
        colorCast: '偏色检测',
        // 消防类
        fireAlarm: '消防报警',
        fireFailure: '消防故障',
        // 违章报警
        vioRetrograde: '违章逆行',
        vioPark: '违章停车',
        vioTurnLeft: '违章左转',
        vioTurnRight: '违章右转',
        // 报警求助
        askHelp: '请求对讲',
        acceptHelp: '接受对讲',
        endHelp: '结束对讲',
        // 设备报警
        hardDiskFailure: 'sd卡故障',
        hardDiskFull: 'sd卡满',
        networkDown: '网络断开',
        ipConflict: 'IP冲突',
        timeAbnormal: '时间异常',
        illegalNetworkAccess: '非法网络访问',
        // 其他
        alarmVideoLost: '视频丢失',
        vehicleBlack: '车辆识别黑名单',
        vehicleWhite: '车辆白名单',
        vehicleDispatch: '车辆布控',
        faceBlack: '人脸识别',
        faceWhite: '人脸白名单',
        faceDispatch: '人脸布控',
        faceControl: '人像布控',
        peopleCount: '人数统计',
        fight: '斗殴',
        approach: '人员贴近',
        armyGuard: '哨兵管控',
        atmCare: 'ATM看护',
        fanAbnormal: '风扇异常',
        mainBoardAbnormal: '主板异常',
        channelAbnormal: '通道异常',
        temperatureAbnormal: '温度异常',
        damagedDiskSectors: '硬盘坏道',
        ipcMacCheckException: 'MAC校验异常',
        alarmZone: '报警防区',
        alarmGT: '报警防区'
      },
      carTypeList: {
        '0': '未识别',
        '15': '轻便摩托车',
        '1': '小型汽车',
        '16': '机动车',
        '2': '大型汽车',
        '17': '公交车',
        '3': '使馆汽车',
        '18': '摩托车',
        '4': '领馆汽车',
        '19': '客车',
        '5': '境外汽车',
        '20': '大货车',
        '6': '外籍汽车',
        '21': '中货车',
        '7': '低速汽车',
        '22': '轿车',
        '8': '拖拉机',
        '23': '面包车',
        '9': '挂车',
        '24': '小货车',
        '10': '教练车',
        '256': '非机动车',
        '11': '临时行驶车',
        '257': '自行车',
        '12': '警用汽车',
        '258': '三轮车',
        '13': '警用摩托车',
        '512': '行人',
        '14': '普通摩托车',
        '513': '军用汽车'
      },
      carDirect: {
        '0': '东->西',
        '1': '西->东',
        '2': '南->北',
        '3': '北->南',
        '4': '东南->西北',
        '5': '西北->东南',
        '6': '东北->西南',
        '7': '西南->东北'
      },
      modalloading: false,
      ttsModal: false,
      true: true,
      playerList: [],
      tabsValue: '0',
      alarmlabel: (h) => {
        return h('div', [
          h('span', '报警求助信息'),
          h('Badge', {
            props: {
              count: this.alarmhelpAllData.length
            }
          })
        ])
      },
      alarmhelpAllData: [],
      alarmhelpData: {},
      alarmhelpcurrent: 1,
      old: {
        time: 0,
        name: '',
        askId: '',
        status: ''
      },
      alarmHost: true,
      // 警情误报
      warnDealSelect: '',
      warnDealListOpt: []
    }
  },
  created() {
    this.alarmTitleClick = this.$lodash.debounce(() => {
      this.alarmFilters().then(suc => {
        this.receiveWarnListView = this.$lodash.cloneDeep(this.receiveWarnList)
      })
      this.alarmCounts()
    }, 1000)
    // 获取警情处理启用状态
    this.getAlarmDealStatusSet().then((res) => {
      this.isAlarmEnable = res.data.alarmOpen
    }).catch(err => {
      console.log('getFireDealStatus error: ', err)
      this.errorMsg('警情处理启用状态获取失败')
    })
    this.getAlarmLevel().then(res => {
      this.warnParametersList = JSON.parse(JSON.stringify(res.data))
    })
    this.alarmhelpAllData = JSON.parse(JSON.stringify(this.alarmHelpsSocketValue))
    this.alarmhelpData = (this.alarmhelpAllData.length === 0 ? this.old : this.alarmhelpAllData[0])
  },
  methods: {
    ...mapMutations(['deleteAlarm']),
    ...mapActions(['recordLog', 'spliceAlarmHelpData', 'setIsAcceptWarn', 'getAlarmDealStatusSet', 'getAlarmDealSetList', 'getAlarmLevel']),
    details(raws) {
      let status = this.alarmVSPlanInfoList[raws.eventType].typeValue
      this.emergencyBtn(status)
    },
    emergencyPlan(args) {
      if (args.carImg1Base64 || args.carImg2Base64 || args.carImgBase64 || args.carNumPicBase64 || args.combinedPicBase64 || args.carImgUrl) {
        args.groupId = `   ${args.devIp}|${args.devPort}|${args.channel}|${args.eventType}|${args.alarmId}`
      }
      if ((args.actionList && args.actionList.length !== 0) || (args.action && args.action.length !== 0)) {
        this.setActiveWarnInfo(args)
      } else {
        this.setActiveWarnInfo(args)
        if (args.eventType !== 'individualAlarm' && args.eventType !== 'soldier' && args.eventType !== 'patrol' && args.eventType !== 'patrolAlarm') {
          this.warningMsg('此报警无联动视频，或违章图片')
        }
      }
      // if (args.carImg1Base64 || args.carImg2Base64 || args.carImgBase64 || args.carNumPicBase64 || args.combinedPicBase64) {
      //   args.groupId = `${args.devIp}|${args.devPort}|${args.channel}|${args.eventType}|${args.alarmId}`
      //   this.setActiveWarnInfo(args)
      // } else if ((args.actionList && args.actionList.length !== 0) || (args.action && args.action.length !== 0)) {
      //   this.setActiveWarnInfo(args)
      // } else {
      //   this.setActiveWarnInfo(args)
      //   this.warningMsg('此报警无联动视频，或违章图片')
      // }
      // this.setActiveWarnInfo(args)
      this.$refs.alarmvideopreview.isPlayback = true
    },
    changeTab(obj) {
      this.SET_DETAIL_NULL()
      this.wallChannelIdList = []
      this.isHasConfirm = false
      this.setActiveWarnTab(obj.obj.value)
      this.alarmFilters().then(suc => {
        this.receiveWarnListView = this.$lodash.cloneDeep(this.receiveWarnList)
      })
      this.alarmCounts()
      // this.getTabCounts()
      this.alarmActiveType = obj.obj.value
      if (obj.index === 0 || obj.index === 4) {
        this.warnListColumns = this.ordinaryAlarmColumns
      }
      if (obj.index === 1 || obj.index === 2) {
        this.warnListColumns = this.videoAlarmColumns
      }
      if (obj.index === 3) {
        this.warnListColumns = this.alarmForHelpColumns
      }
      if (obj.index === 5) {
        this.warnListColumns = this.soldierAlarmColumns
      }
      if (obj.index === 6) {
        this.warnListColumns = this.systemException
      }
      // this.activeTab = JSON.parse(JSON.stringify(obj.index))
    },
    changeAlarmhelpPage(n) {
      this.alarmhelpcurrent = n
      this.alarmhelpData = this.alarmhelpAllData[n - 1]
    },
    // 1 设置接收报警列表的标签
    // setWarningTabs(arr) {
    //   this.warningTabs = []
    //   for (let i = 0; i < arr.length; i++) {
    //     this.warningTabs.push({
    //       title: arr[i].label,
    //       value: arr[i].value,
    //       number: 0,
    //       disabled: false,
    //       active: false
    //     })
    //   }
    //   arr.length > 0 ? this.warningTabs[0].active = true : this.warningTabs = []
    //   this.setActiveWarnTab(this.warningTabs[0].value)
    // },
    getReceiveWarnData() {
      if (this.isWarnAccept) {
        // this.openSetReceiveWarnList()
        this.receiveWarnListView = this.receiveWarnList
      }
    },
    // 播放器
    warnPlayerOpen(level) {
      this.playMusic(level)
      this.playTTS(level)
    },
    // 播放音乐
    playMusic(data) {
      let level = data.level
      if (level === undefined) { return } // 巡更单兵报警暂无次字段
      this.playerList = this.$refs['audio']
      if (!this.playerList) { return }
      for (let i = 0; i < this.playerList.length; i++) {
        this.playerList[i].load()
        this.playerList[i].pause()
      }
      if (this.warnMusicList[level - 1].status === '1' || this.warnMusicList[level - 1].status === '2') {
        this.playerList[level - 1].play()
        let index = 1
        this.ttsEnvent = () => {
          setTimeout(() => {
            if (index < this.warnMusicList[level - 1].time) {
              this.playerList[level - 1].play()
              index++
            }
          }, 500)
        }
        this.playerList[level - 1].addEventListener('ended', this.ttsEnvent)
      }
    },
    // 播放TTS
    playTTS(data) {
      if (TTStimer) {
        clearInterval(TTStimer)
      }
      let level = data.level
      if (level === undefined) { return } // 巡更单兵报警暂无次字段
      let ttscontent = data.organization + data.name + this.alarmTypeList[data.eventType]
      if (this.warnMusicList[level - 1].status === '0' || this.warnMusicList[level - 1].status === '2') {
        plugin = this.$refs['pluginTTS']
        if (plugin && plugin.TextToSpeech) {
          plugin.TextToSpeech(100, 0, 0, ttscontent)
          let repeat = this.warnMusicList[level - 1].time - 1
          TTStimer = setInterval(() => {
            if (repeat === 0) {
              clearInterval(TTStimer)
            } else {
              plugin.TextToSpeech(100, 0, 0, ttscontent)
              repeat--
            }
          }, 8000)
        }
      }
    },
    warnTabClick(data) {
      this.setActiveWarnTab(data.obj.value)
    },
    // 切换报警接收复选框
    acceptProcess() {},
    // 切换批量处理
    batchProcess() {
      const batchCheck = {
        type: 'selection',
        align: 'center',
        width: 60
      }
      if (this.isWarnBatch === true) {
        this.warnColumns.splice(0, 0, batchCheck)
      } else {
        this.warnColumns.splice(0, 1)
      }
    },
    clickWarnListRow(data) {
      console.log(data, '点击行信息')
      this.channelId = data.chanId
      this.wallChannelIdList.push(data)
      if (data.dealState === 'process' || data.dealState === 'ignore') {
        this.isHasConfirm = true
      } else {
        this.isHasConfirm = false
      }
      if (data.alarmaffirm === undefined || (data.alarmaffirm && data.alarmaffirm.handaffirm.status)) {
        data.ackContentItem = {
          situationType: this.warnPlanSelect,
          alarmContent: this.warnAffirmInfo
        }
        this.isDisableDeal = true
        if (data.eventType === 'soldier' || data.eventType === 'individualAlarm' || data.eventType === 'patrol' || data.eventType === 'patrolAlarm') {
          this.singleDisDeal = false
        } else {
          this.singleDisDeal = true
        }
      } else if (data.alarmaffirm && data.alarmaffirm.handaffirm2.status) {
        data.ackContentItem = {
          alarmDeal: this.alarmDealName,
          situationType: this.warnPlanSelect,
          alarmContent: this.warnAffirmInfo
        }
        this.isDisableDeal = false
        this.singleDisDeal = false
      }
      if (!this.isWarnBatch) {
        this.confirmWarnList = [data]
      }
      if (data.type === 'alarmHost') {
        this.alarmHost = false
      } else {
        this.alarmHost = true
      }
      if (data.carImg1Base64 || data.carImg2Base64 || data.carImgBase64 || data.carNumPicBase64 || data.combinedPicBase64 || data.carImgUrl) {
        data.groupId = `${data.devIp}|${data.devPort}|${data.channel}|${data.eventType}|${data.alarmId}`
      }
      if ((data.actionList && data.actionList.length !== 0) || (data.action && data.action.length !== 0)) {
        this.setActiveWarnInfo(data)
      } else {
        this.setActiveWarnInfo(data)
        // this.warningMsg('此报警无联动视频，或违章图片')
      }
      // if (data.carImg1Base64 || data.carImg2Base64 || data.carImgBase64 || data.carNumPicBase64 || data.combinedPicBase64) {
      //   data.groupId = `${data.devIp}|${data.devPort}|${data.channel}|${data.eventType}|${data.alarmId}`
      //   this.setActiveWarnInfo(data)
      // } else if ((data.actionList && data.actionList.length !== 0) || (data.action && data.action.length !== 0)) {
      //   this.setActiveWarnInfo(data)
      // } else {
      //   this.setActiveWarnInfo(data)
      //   this.warningMsg('此报警无联动视频，或违章图片')
      // }
    },
    // 表格复选框发生改变
    selectWarnListRow(sels) {
      console.log(sels, 'sels====')
      for (let i = 0; i < sels.length; i++) {
        if (sels[i].alarmaffirm === undefined || (sels[i].alarmaffirm && sels[i].alarmaffirm.handaffirm.status)) {
          sels[i].ackContentItem = {
            situationType: this.warnPlanSelect,
            alarmContent: this.warnAffirmInfo
          }
        } else if (sels[i].alarmaffirm && sels[i].alarmaffirm.handaffirm2.status) {
          sels[i].ackContentItem = {
            alarmDeal: this.alarmDealName,
            situationType: this.warnPlanSelect,
            alarmContent: this.warnAffirmInfo
          }
        }
      }
      let result = sels.some(item => {
        if (item.dealState === 'unProcess' || !item.dealState) {
          return true
        }
      })
      if (result || sels.length === 0) {
        this.isHasConfirm = false
      } else {
        this.isHasConfirm = true
      }
      let isNotAlarmHost = false
      this.confirmWarnList = sels
      for (let i = 0; i < this.confirmWarnList.length; i++) {
        if (this.confirmWarnList[i].type !== 'alarmHost') {
          isNotAlarmHost = true
          break
        }
      }
      if (!sels.length) {
        isNotAlarmHost = true
      }
      if (isNotAlarmHost) {
        this.alarmHost = true
      } else {
        this.alarmHost = false
      }
    },
    changeTabs(name) {
      this.confirmWarnList.length = 0
      this.tabsValue = name
      // 切换tabs若是报警求助，将求助信息值给confirmWarnList以便于确认
      // 一次仅可清除、确认一页（一个）的求助报警
      if (name === '2') {
        this.tableId = 3
        this.confirmWarnList = []
        this.confirmWarnList.push(this.alarmhelpAllData[this.alarmhelpcurrent - 1])
      } else {
        this.tableId = 1
      }
    },
    /**
     * 确认报警
     */
    clickConfirmWarnMessages() {
      if (this.confirmWarnList.length === 0) {
        this.warningMsg('请先选择报警信息')
        return
      }
      const power = this.alarmPowerJudge(this.confirmWarnList, 'alarmConfirm')
      if (!power) { return }
      if (this.warnAffirmInfo === '') {
        this.warningMsg('警情信息不能为空')
        return
      }
      this.modalloading = true
      this.confAlarm('process')
      this.modalloading = false
    },
    async confAlarm(type) {
      let alarmSureInfo = {}
      if (this.singleDisDeal) {
        alarmSureInfo = {
          situationType: this.warnPlanSelect,
          alarmContent: this.warnAffirmInfo
        }
      } else {
        alarmSureInfo = {
          alarmDeal: this.alarmDealName,
          situationType: this.warnPlanSelect,
          alarmContent: this.warnAffirmInfo
        }
      }
      // 单兵、巡更单独确认接口
      let patrolIds = []
      let soldierIds = []
      if (this.confirmWarnList[0].eventType === 'patrol' || this.confirmWarnList[0].eventType === 'patrolAlarm' || this.confirmWarnList[0].eventType === 'soldier' || this.confirmWarnList[0].eventType === 'individualAlarm') {
        this.confirmWarnList.forEach(item => {
          if (item.eventType === 'patrol' || item.eventType === 'patrolAlarm') {
            patrolIds.push(item.uniqueId)
          }
          if (item.eventType === 'soldier' || item.eventType === 'individualAlarm') {
            soldierIds.push(item.uniqueId)
          }
        })
        let patrolParam = {}
        let soldierParam = {}
        if (type === 'ignore') {
          patrolParam = {
            id: patrolIds.join(','),
            dealState: type
          }
          soldierParam = {
            id: soldierIds.join(','),
            dealState: type
          }
        } else {
          patrolParam = {
            id: patrolIds.join(','),
            dealState: type,
            ackContent: JSON.stringify(alarmSureInfo)
          }
          soldierParam = {
            id: soldierIds.join(','),
            dealState: type,
            ackContent: JSON.stringify(alarmSureInfo)
          }
        }
        let patrolFlag = false
        let soldierFlag = false
        if (patrolIds.length) {
          await this.confirmAlarmPatrol(patrolParam).then(resp => {
            patrolFlag = true
          }).catch(err => {
            this.errorMsg(err.response.data.message)
            console.log('confirmAlarms error: ' + err)
          })
        } else {
          patrolFlag = true
        }
        if (soldierIds.length) {
          await this.updatePatrolAlarm(soldierParam).then(resp => {
            soldierFlag = true
          }).catch(err => {
            this.errorMsg(err.response.data.message)
            console.log('confirmAlarms error: ' + err)
          })
        } else {
          soldierFlag = true
        }
        setTimeout(() => {
          if (patrolFlag && soldierFlag) {
            this.dealAlarmMethods(type)
          }
        }, 0)
        return
      }
      let payload = {}
      if (type === 'ignore') {
        payload = {
          ackType: type,
          list: this.confirmWarnList
        }
      } else {
        payload = {
          ackType: type,
          list: this.confirmWarnList,
          ackContent: JSON.stringify(alarmSureInfo)
        }
      }
      this.confirmWarnMessages(payload).then(() => {
        this.dealAlarmMethods(type)
      }).catch((err) => {
        this.modalloading = false
        console.log('confirmWarnMessages error: ' + err)
      })
    },
    dealAlarmMethods(type) {
      let targets = []
      let deviceIps = []
      this.confirmWarnList.map(item => {
        targets.push(item.name)
        deviceIps.push(item.devIp)
      })
      const param = {
        logType: '操作日志',
        module: '报警处理',
        operateName: '报警确认',
        operateContent: '报警确认',
        target: targets.join(','),
        deviceIp: deviceIps.join(',')
      }
      this.modalloading = false
      if (type === 'process') {
        this.successMsg('确认报警信息成功')
        this.SET_DETAIL_NULL()
      } else {
        this.successMsg('清除报警信息成功')
        this.SET_DETAIL_NULL()
      }
      this.recordLog(param)
      setTimeout(() => {
        this.confirmWarnList.map((item, ind) => {
          // const result = this.receiveWarnListView[this.activeWarnTab].some((Item) => {
          //   return item.alarmId === Item.alarmId
          // })
          // if (result) {
          // this.receiveWarnListView[this.activeWarnTab].map((Item, index) => {
          // if (item.alarmId === Item.alarmId) {
          if (item.eventType === 'vioRetrograde' || item.eventType === 'vioPark' || item.eventType === 'vioTurnLeft' || item.eventType === 'vioTurnRight') {
            item['uid'] = `${item.devIp}|${item.devPort}|${item.channel}|${item.eventType}|${item.alarmId || item._id}`
            // item['uid'] = item.devIp + '|' + item.devPort + '|' + item.channel + '|' + item.eventType + '|' + item.alarmId
            this.SPLICE_VIDEO_LIST(item['uid'])
          } else if (item.eventType === 'patrol' || item.eventType === 'individualAlarm' || item.eventType === 'soldier' || item.eventType === 'patrolAlarm') {
            if (item.eventType === 'patrol' || item.eventType === 'patrolAlarm') {
              item['uid'] = item.uniqueId
            } else if ((item.eventType === 'individualAlarm' || item.eventType === 'soldier') && !item.uid) {
              item['uid'] = item.uniqueId
            }
          } else {
            item['uid'] = item.devIp + '|' + item.devPort + '|' + item.channel + '|' + item.eventType
          }
          this.$refs.alarmvideopreview.closeVideo(this.confirmWarnList[ind])
          // this.receiveWarnListView[this.activeWarnTab].splice(index, 1)
          // this.spliceReceiveWarnList({
          //   activeWarnTab: this.activeWarnTab,
          //   index: index
          // })
          // }
          // })
          // }
        })
        this.setActiveWarnInfo({})
        // this.processFireAlarmingInfo(this.confirmWarnList)
        // this.confirmWarnList.forEach(item => {
        //   if (item.point3D && item.point3D) {
        //     let obj = {
        //       pointIsouter: item.point3D.isouter,
        //       id: item.channelId,
        //       bcode: item.point3D.building3ds ? item.point3D.building3ds.code : '',
        //       type: 'commonAlarm'
        //     }
        //     try {
        //       this.confirmAlarmData(obj)
        //     } catch (err) {
        //       console.log('地图清楚点位方法错误')
        //     }
        //   }
        // })
        this.confirmWarnList = []
        this.warnPlayerStop()
      }, 10)
      setTimeout(() => {
        this.alarmFilters().then(suc => {
          this.receiveWarnListView = this.$lodash.cloneDeep(this.receiveWarnList)
        })
        this.alarmCounts()
      }, 600)
    },
    /**
     * 清除报警
     */
    clearWarnOpen() {
      if (this.confirmWarnList.length !== 0) {
        this.warnModal = true
      } else {
        this.warningMsg('请先选择需清除的报警信息')
      }
    },
    /**
     * 确认清除报警
     */
    clearWarnOk() {
      const isPower = this.alarmPowerJudge(this.confirmWarnList, 'alarmClean')
      if (!isPower) { return }
      let targets = []
      let deviceIps = []
      this.confirmWarnList.map(item => {
        targets.push(item.name)
        deviceIps.push(item.devIp)
      })
      const param = {
        logType: '操作日志',
        module: '报警处理',
        operateName: '报警清除',
        operateContent: '报警清除',
        target: targets.join(','),
        deviceIp: deviceIps.join(',')
      }
      this.recordLog(param)
      this.setActiveWarnInfo({})
      this.confAlarm('ignore')
      this.warnModal = false
      this.warnPlayerStop()
    },
    /* 权限判断 */
    alarmPowerJudge(data, prop) {
      for (let k = 0; k < data.length; k++) {
        if (data[k].eventType === 'patrol' || data[k].eventType === 'soldier' || data[k].eventType === 'patrolAlarm' || data[k].eventType === 'individualAlarm') {
          return true
        }
      }
      let hasPower = true
      if (data.length === 1 && !data[0].alarmPermission[prop]) {
        hasPower = false
      } else if (data.length > 1) {
        for (let i = 0; i < data.length; i++) {
          if (!data[i].alarmPermission[prop]) {
            hasPower = false
            break
          }
        }
      }
      if (!hasPower) {
        this.warningMsg('存在报警资源无相应权限')
      }
      return hasPower
    },
    warnPlayerStop() {
      let playerList = this.$refs['audio']
      if (playerList && playerList.length !== 0) {
        for (let i = 0; i < playerList.length; i++) {
          playerList[i].pause()
          playerList[i].removeEventListener('ended', this.ttsEnvent)
          this.ttsEnvent = null
        }
      }
      clearInterval(TTStimer)
      plugin = null
      plugin = this.$refs['pluginTTS']
    },
    selectWarnPlan() {
      let selectIndex
      this.$nextTick(() => {
        this.warnPlanList.forEach((item, index) => {
          if (item.name === this.warnPlanSelect) {
            selectIndex = index
          }
        })
        this.warnAffirmInfo = this.warnPlanList[selectIndex].content
      })
    },
    allMeth(methType) {
      if (this.confirmWarnList.length === 0) {
        this.warningMsg('请先选择报警信息')
        return
      }
      let power = true
      let shikeIds = []
      let guangtuoIds = []
      let methods = []
      this.confirmWarnList.forEach(item => {
        if (item.manufacturer === 'guangtuo') {
          guangtuoIds.push(item.devId)
        } else {
          shikeIds.push(item.devId)
        }
      })
      switch (methType) {
        case 'protection':
          power = this.alarmPowerJudge(this.confirmWarnList, 'deployment')
          if (!power) { return }
          if (shikeIds.length && guangtuoIds.length) {
            methods = [this.protectionAction({ ids: shikeIds, type: 'dev', deviceType: 'shike' }), this.protectionAction({ ids: guangtuoIds, type: 'dev', deviceType: 'guangtuo' })]
          } else if (shikeIds.length && !guangtuoIds.length) {
            methods = [this.protectionAction({ ids: shikeIds, type: 'dev', deviceType: 'shike' })]
          } else if (!shikeIds.length && guangtuoIds.length) {
            methods = [this.protectionAction({ ids: guangtuoIds, type: 'dev', deviceType: 'guangtuo' })]
          }
          Promise.all(methods).then(() => {
            const param = {
              logType: '操作日志',
              module: '报警处理',
              operateName: '报警主机布防',
              operateContent: '报警主机布防',
              target: this.confirmWarnList.map(item => {
                return item.name
              }).join(','),
              deviceIp: this.confirmWarnList.map(item => {
                return item.devIp
              }).join(',')
            }
            this.recordLog(param)
            this.successMsg('布防成功！')
          }).catch(() => {
            this.errorMsg('布防失败！')
          })
          break
        case 'removal':
          power = this.alarmPowerJudge(this.confirmWarnList, 'disarming')
          if (!power) { return }
          if (shikeIds.length && guangtuoIds.length) {
            methods = [this.removalAction({ ids: shikeIds, type: 'dev', deviceType: 'shike' }), this.removalAction({ ids: guangtuoIds, type: 'dev', deviceType: 'guangtuo' })]
          } else if (shikeIds.length && !guangtuoIds.length) {
            methods = [this.removalAction({ ids: shikeIds, type: 'dev', deviceType: 'shike' })]
          } else if (!shikeIds.length && guangtuoIds.length) {
            methods = [this.removalAction({ ids: guangtuoIds, type: 'dev', deviceType: 'guangtuo' })]
          }
          Promise.all(methods).then(() => {
            const param = {
              logType: '操作日志',
              module: '报警处理',
              operateName: '报警主机撤防',
              operateContent: '报警主机撤防',
              target: this.confirmWarnList.map(item => {
                return item.name
              }).join(','),
              deviceIp: this.confirmWarnList.map(item => {
                return item.devIp
              }).join(',')
            }
            this.recordLog(param)
            this.successMsg('撤防成功！')
          }).catch(() => {
            this.errorMsg('撤防失败！')
          })
          break
        case 'remove':
          power = this.alarmPowerJudge(this.confirmWarnList, 'clean')
          if (!power) { return }
          if (shikeIds.length && guangtuoIds.length) {
            methods = [this.removeAction({ ids: shikeIds, type: 'dev', deviceType: 'shike' }), this.removeAction({ ids: guangtuoIds, type: 'dev', deviceType: 'guangtuo' })]
          } else if (shikeIds.length && !guangtuoIds.length) {
            methods = [this.removeAction({ ids: shikeIds, type: 'dev', deviceType: 'shike' })]
          } else if (!shikeIds.length && guangtuoIds.length) {
            methods = [this.removeAction({ ids: guangtuoIds, type: 'dev', deviceType: 'guangtuo' })]
          }
          Promise.all(methods).then(() => {
            const param = {
              logType: '操作日志',
              module: '报警处理',
              operateName: '报警主机清除',
              operateContent: '报警主机清除',
              target: this.confirmWarnList.map(item => {
                return item.name
              }).join(','),
              deviceIp: this.confirmWarnList.map(item => {
                return item.devIp
              }).join(',')
            }
            this.recordLog(param)
            this.successMsg('清除成功！')
          }).catch(() => {
            this.errorMsg('清除失败！')
          })
          break
      }
    }
  },
  mounted() {
    this.$refs['warningTab'].$on('on-tab-click', this.warnTabClick)
    plugin = this.$refs['pluginTTS']
    if (plugin.valid) {
      this.ttsModal = false
    } else {
      this.ttsModal = true
    }
    // 获取警情处理列表
    this.getAlarmDealSetList({ page: 1, limit: 100 }).then((res) => {
      res.data.forEach(item => {
        this.alarmDealSetList.push({ label: item.name, value: item.name })
        this.alarmDealName = this.alarmDealSetList[0].value
      })
    }).catch(err => {
      console.log('getFireAlarmDealList error: ', err)
      this.errorMsg('警情处理列表获取失败')
    })
  },
  watch: {
    isWarnAccept(newval, oldval) {
      if (newval) {
        this.setIsAcceptWarn(true)
        this.getReceiveWarnData()
      } else {
        this.setIsAcceptWarn(false)
      }
    },
    warnCounts(newval) {
      this.ttsModal = false
      this.receiveWarnListView = this.$lodash.cloneDeep(this.receiveWarnList)
      // console.log(this.receiveWarnListView, '位置2 warnCounts watch')
      // console.log(this.warnNewData, 'this.warnNewData')
      this.warnPlayerOpen(this.warnNewData) // 播放最新一条报警信息的 警笛 tts语音
    },
    alarmHelpsSocketValue: {
      deep: true,
      handler(newval, oldval) {
        this.alarmhelpAllData = JSON.parse(JSON.stringify(newval))
        this.alarmhelpData = (this.alarmhelpAllData.length === 0 ? this.old : this.alarmhelpAllData[0])
        if (this.tabsValue === '2' && this.alarmhelpAllData.length !== 0) {
          this.confirmWarnList = []
          this.confirmWarnList.push(this.alarmhelpData)
        }
      }
    },
    confirmedData(newval) {
      console.log(newval, '将要被确认的报警')
      if (newval && newval.length === 0) {
        return
      }
      newval.map((item, ind) => {
        if (this.receiveWarnListView[item.tabIndex] && this.receiveWarnListView[item.tabIndex].length !== 0) {
          console.log('列表中是否还存在此条报警')
          if (item.eventType === 'endHelp') {
            this.receiveWarnListView[item.tabIndex].map((alarmItem, index) => {
              if (item.ackId === alarmItem.ackId && item.askId === alarmItem.askId) {
                item['uid'] = `${item.devIp}|${item.devPort}|${item.channel}|askHelp`
                this.$refs.alarmvideopreview.closeVideo(newval[ind])
                this.receiveWarnListView[item.tabIndex].splice(index, 1)
                this.spliceReceiveWarnList({
                  activeWarnTab: item.tabIndex,
                  index: index
                })
                this.SET_WARNING_NUM(item.tabIndex)
              }
            })
            this.warnPlayerStop()
            return
          }
          // const result = this.receiveWarnListView[item.tabIndex].some((Item) => {
          //   if (Item.groupId === undefined) {
          //     Item.groupId = `${Item.devIp}|${Item.devPort}|${Item.channel}|${Item.eventType}`
          //   }
          //   return item.groupId === Item.groupId
          // })
          // if (result) {
          // this.receiveWarnListView[item.tabIndex].map((Item, index) => {
          // if (item.groupId === Item.groupId) {
          if (item.eventType === 'vioRetrograde' || item.eventType === 'vioPark' || item.eventType === 'vioTurnLeft' || item.eventType === 'vioTurnRight') {
            item['uid'] = `${item.devIp}|${item.devPort}|${item.channel}|${item.eventType}|${item.alarmId}`
            this.SPLICE_VIDEO_LIST(item['uid'])
          } else if (item.eventType === 'patrol' || item.eventType === 'individualAlarm' || item.eventType === 'soldier' || item.eventType === 'patrolAlarm') {
            if (item.eventType === 'patrol' || item.eventType === 'patrolAlarm') {
              item['uid'] = item.uniqueId
            } else if ((item.eventType === 'individualAlarm' || item.eventType === 'soldier') && !item.uid) {
              item['uid'] = item.uniqueId
            }
          } else {
            item['uid'] = `${item.devIp}|${item.devPort}|${item.channel}|${item.eventType}`
          }
          this.$refs.alarmvideopreview.closeVideo(newval[ind])
          // this.receiveWarnListView[item.tabIndex].splice(index, 1)
          // this.spliceReceiveWarnList({
          //   activeWarnTab: item.tabIndex,
          //   index: index
          // })
          this.SET_WARNING_NUM(item.tabIndex)
          // }
          // })
          // }
          // this.processFireAlarmingInfo(newval)
          // if (item.point3D && item.point3D.building3ds) {
          //   let obj = {
          //     pointIsouter: item.point3D.isouter,
          //     id: item.channelId,
          //     bcode: item.point3D.building3ds.code,
          //     type: 'commonAlarm'
          //   }
          //   try {
          //     this.confirmAlarmData(obj)
          //   } catch (err) {
          //     console.log('地图清楚点位方法错误')
          //   }
          // }
        }
        this.warnPlayerStop()
      })
      this.alarmTitleClick()
    }
  }
}
