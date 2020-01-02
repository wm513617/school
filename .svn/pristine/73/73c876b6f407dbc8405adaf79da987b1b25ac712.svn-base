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
      warnModal: false,
      warnListColumns: [
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
      warnParametersList: [],
      warnMusicList: [],
      alarmZoneType: { // 报警防区子类型
        smoke: '烟感',
        temperature: '温感',
        hydrant: '消火栓',
        handNewspaper: '手报'
      },
      alarmTypeList: {
        // 消防类
        fireAlarm: '消防报警',
        fireFailure: '消防故障'
      },
      modalloading: false,
      ttsModal: false,
      true: true,
      playerList: [],
      // 警情误报
      warnDealSelect: '',
      warnDealListOpt: []
    }
  },
  methods: {
    ...mapMutations(['deleteAlarm']),
    ...mapActions(['recordLog', 'getAlarmDealSetList', 'getAlarmLevel']),
    details(raws) {
      this.emergencyBtn('13')
    },
    emergencyPlan(args) {
      if ((args.actionList && args.actionList.length !== 0) || (args.action && args.action.length !== 0)) {
        this.SET_ACTIVE_WARN_INFO(args)
      } else {
        this.SET_ACTIVE_WARN_INFO(args)
        this.warningMsg('此报警无联动视频，或违章图片')
      }
      this.$refs.alarmvideopreview.isPlayback = true
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
    clickWarnListRow(data) {
      this.channelId = data.chanId
      this.wallChannelIdList.push(data)
      if (data.dealState === 'process' || data.dealState === 'ignore') {
        this.isHasConfirm = true
      } else {
        this.isHasConfirm = false
      }
      if (data.alarmaffirm === undefined || (data.alarmaffirm && data.alarmaffirm.handaffirm.status)) {
        this.isDisableDeal = true
      } else if (data.alarmaffirm && data.alarmaffirm.handaffirm2.status) {
        this.isDisableDeal = false
      }
      this.SET_ACTIVE_WARN_INFO(data)
    },
    // 表格复选框发生改变
    selectWarnListRow(sels) {
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
      this.confirmWarnList = sels
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
      if (this.isDisableDeal) {
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
        operateName: type === 'process' ? '报警确认' : '报警清除',
        operateContent: type === 'process' ? '报警确认' : '报警清除',
        target: targets.join(','),
        deviceIp: deviceIps.join(',')
      }
      this.modalloading = false
      if (type === 'process') {
        this.successMsg('确认报警信息成功')
      } else {
        this.successMsg('清除报警信息成功')
      }
      this.recordLog(param)
      setTimeout(() => {
        this.confirmWarnList.map((item, ind) => {
          item['uid'] = item.devIp + '|' + item.devPort + '|' + item.channel + '|' + item.eventType
          this.$refs.alarmvideopreview.closeVideo(this.confirmWarnList[ind])
        })
        this.SET_ACTIVE_WARN_INFO({})
        this.confirmWarnList = []
        this.warnPlayerStop()
      }, 10)
      setTimeout(() => {
        this.getFireAlarmLists().then(suc => {
          this.receiveFireAlarmList = JSON.parse(JSON.stringify(this.fireAlarmData)).slice(0, 100)
        })
        this.setCount()
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
      this.confAlarm('ignore')
      this.warnModal = false
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
    }
  },
  created() {
    this.alarmTitleClick = this.$lodash.debounce(() => {
      this.getFireAlarmLists().then(suc => {
        this.receiveFireAlarmList = JSON.parse(JSON.stringify(this.fireAlarmData))
      })
      this.setCount()
    }, 1000)
  },
  mounted() {
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
    warnCounts(newval) {
      this.ttsModal = false
      if (this.warnNewData.eventType === 'fireAlarm' || this.warnNewData.eventType === 'fireFailure') {
        this.warnPlayerOpen(this.warnNewData) // 播放最新一条消防报警信息的 警笛 tts语音
      }
    },
    confirmFireAlarm(newval) {
      if (newval && newval.length === 0) {
        return
      }
      newval.map((item, ind) => {
        if (this.receiveFireAlarmList.length !== 0) {
          item['uid'] = `${item.devIp}|${item.devPort}|${item.channel}|${item.eventType}`
          this.$refs.alarmvideopreview.closeVideo(newval[ind])
        }
        this.warnPlayerStop()
        this.REDUCE_TAB_COUNTS()
      })
      this.alarmTitleClick()
    }
  }
}
