import {
  toHour
} from './alarmFun.js' // toSecond,
export default {
  components: {},
  data() {
    const maxDelayRule = (rule, value, callback) => {
      var r = /^\+?[0-9][0-9]*$/
      if (value === '') {
        return callback(new Error('最大延时不能为空'))
      }
      if (r.test(value) || Number(value) === 0) {
        if (Number(value) > 7200) {
          return callback(new Error('最大延时超过最大值'))
        } else if (Number(value) < 300) {
          return callback(new Error('最大延时不得低于300s'))
        } else {
          callback()
        }
      } else {
        return callback(new Error('请输入有效数字'))
      }
    }
    const minIntervalRule = (rule, value, callback) => {
      var r = /^\+?[0-9][0-9]*$/
      if (value === '') {
        return callback(new Error('最小间隔不能为空'))
      }
      if (r.test(value) || Number(value) === 0) {
        if (Number(value) > 7200) {
          return callback(new Error('最小间隔超过最大值'))
        } else if (Number(value) < 300) {
          return callback(new Error('最小间隔不得低于300s'))
        } else {
          callback()
        }
      } else {
        return callback(new Error('请输入有效数字'))
      }
    }
    const continueTimeRule = (rule, value, callback) => {
      var r = /^\+?[0-9][0-9]*$/
      if (value === '') {
        return callback(new Error('持续时间不能为空'))
      }
      if (r.test(value) || Number(value) === 0) {
        if (Number(value) > 7200) {
          return callback(new Error('持续时间超过最大值'))
        } else {
          callback()
        }
      } else {
        return callback(new Error('请输入有效数字'))
      }
    }
    const outputDelayRule = (rule, value, callback) => {
      var r = /^\+?[0-9][0-9]*$/
      if (value === '') {
        return callback(new Error('输出延时不能为空'))
      }
      if (r.test(value) || Number(value) === 0) {
        if (Number(value) > 7200) {
          return callback(new Error('输出延时超过最大值'))
        } else {
          callback()
        }
      } else {
        return callback(new Error('请输入有效数字'))
      }
    }
    return {
      // 验证规则
      formValidate: {
        alarmName: [{
          required: true,
          message: '报警名称必须填写',
          trigger: 'blur'
        }],
        alarmNum: [{
          required: true,
          message: '编号不能为空',
          trigger: 'blur'
        }],
        maxDelay: [{
          required: true,
          validator: maxDelayRule,
          trigger: 'blur'
        }],
        minInterval: [{
          required: true,
          validator: minIntervalRule,
          trigger: 'blur'
        }],
        alarmOutName: [{
          required: true,
          message: '报警输出名称必须填写',
          trigger: 'blur'
        }],
        alarmOutNum: [{
          required: true,
          message: '编号不能为空',
          trigger: 'blur'
        }],
        continueTime: [{
          required: true,
          validator: continueTimeRule,
          trigger: 'blur'
        }],
        outputDelay: [{
          required: true,
          validator: outputDelayRule,
          trigger: 'blur'
        }],
        alarmClassify: [{
          required: true,
          message: '请选择报警分类',
          trigger: 'change'
        }]
      },
      linkData: {
        id: '',
        actionVideo: [{
          channelName: '',
          mainCamera: '',
          client: '',
          videoWall: '',
          electronicMap: '',
          record: '',
          channelId: '',
          organization: ''
        }],
        actionOutCtl: [{
          outPutId: '',
          outPutName: '',
          runMode: '',
          runAction: '',
          overlayIcon: '',
          organization: ''
        }],
        actionRule: [{
          status: '',
          beginTime: '',
          endTime: '',
          actionVideo: '',
          actionOutPut: ''
        }, {
          status: '',
          beginTime: '',
          endTime: '',
          actionVideo: '',
          actionOutPut: ''
        }, {
          status: '',
          beginTime: '',
          endTime: '',
          actionVideo: '',
          actionOutPut: ''
        }, {
          status: '',
          beginTime: '',
          endTime: '',
          actionVideo: '',
          actionOutPut: ''
        }]
      },
      inforTitle: [{
        type: 'selection',
        width: 60,
        align: 'center'
      }, {
        title: '监控点名称',
        width: 150,
        key: 'channelName',
        align: 'center'
      }, {
        title: '机构',
        width: 120,
        key: 'orgName',
        align: 'center'
      }, {
        title: '主摄像机',
        key: 'Cameras',
        align: 'center',
        width: 90,
        render: (h, params) => {
          return h('div', [
            h('Radio', {
              props: {
                value: this.returnBlankIfNull(this.linkData.actionVideo[params.index], 'mainCamera')
              },
              nativeOn: {
                click: (v) => {
                  this.isCameras()
                  if (this.returnBlankIfNull(this.linkData.actionVideo[params.index], 'mainCamera') !== undefined) {
                    this.linkData.actionVideo[params.index].mainCamera = true
                  }
                }
              }
            })
          ])
        }
      }, {
        title: '客户端',
        align: 'center',
        width: 90,
        key: 'client',
        render: (h, params) => {
          const indexParams = params.index
          var _this = this
          return h('div', [
            h('Checkbox', {
              props: {
                value: this.returnBlankIfNull(this.linkData.actionVideo[indexParams], 'client')
              },
              on: {
                'on-change'(v, index = indexParams) {
                  if (_this.returnBlankIfNull(_this.linkData.actionVideo[indexParams], 'client') !== undefined) {
                    _this.linkData.actionVideo[indexParams].client = v
                  }
                }
              }
            })
          ])
        }
      }, {
        title: '电视墙',
        align: 'center',
        width: 90,
        key: 'tvWall',
        render: (h, params) => {
          const indexParams = params.index
          var _this = this
          return h('div', [
            h('Checkbox', {
              props: {
                value: this.returnBlankIfNull(this.linkData.actionVideo[indexParams], 'videoWall')
              },
              on: {
                'on-change'(v, index = indexParams) {
                  if (_this.returnBlankIfNull(_this.linkData.actionVideo[indexParams], 'videoWall') !== undefined) {
                    _this.linkData.actionVideo[indexParams].videoWall = v
                  }
                }
              }
            })
          ])
        }
      }, {
        title: '电子地图',
        align: 'center',
        width: 90,
        key: 'map',
        render: (h, params) => {
          const indexParams = params.index
          var _this = this
          return h('div', [
            h('Checkbox', {
              props: {
                value: this.returnBlankIfNull(this.linkData.actionVideo[indexParams], 'electronicMap')
              },
              on: {
                'on-change'(v, index = indexParams) {
                  if (_this.returnBlankIfNull(_this.linkData.actionVideo[indexParams], 'electronicMap') !== undefined) {
                    _this.linkData.actionVideo[indexParams].electronicMap = v
                  }
                }
              }
            })
          ])
        }
      }, {
        title: '录像',
        align: 'center',
        width: 90,
        key: 'video',
        render: (h, params) => {
          const indexParams = params.index
          var _this = this
          return h('div', [
            h('Checkbox', {
              props: {
                value: this.returnBlankIfNull(this.linkData.actionVideo[indexParams], 'record')
              },
              on: {
                'on-change'(v, index = indexParams) {
                  if (_this.returnBlankIfNull(_this.linkData.actionVideo[indexParams], 'record') !== undefined) {
                    _this.linkData.actionVideo[indexParams].record = v
                  }
                }
              }
            })
          ])
        }
      }],
      linkTitle: [{
        type: 'selection',
        width: 60,
        align: 'center'
      }, {
        title: '输出端子名称',
        key: 'outPutName',
        width: 139,
        align: 'center'
      }, {
        title: '执行方式',
        key: 'runMode',
        align: 'center',
        width: 139,
        render: (h, params) => {
          const indexParams = params.index
          var _this = this
          return h('Select', {
            props: {
              value: this.returnBlankIfNullCopy(this.linkData.actionOutCtl[indexParams], 'runMode')
              // value: this.linkData.actionOutCtl[indexParams].runMode === '0' ? '手动' : '自动'
            },
            on: {
              'on-change'(v, index = indexParams) {
                if (_this.returnBlankIfNull(_this.linkData.actionOutCtl[indexParams], 'runMode') !== undefined) {
                  if (v !== '') {
                    _this.linkData.actionOutCtl[index].runMode = (v === '手动' ? '0' : '1')
                  }
                }
              }
            }
          }, this.wayOptions.map(v => {
            return h('Option', {
              props: {
                value: v.label,
                key: v.value
              }
            })
          }))
        }
      }, {
        title: '执行动作',
        align: 'center',
        width: 139,
        key: 'runAction',
        render: (h, params) => {
          const indexParams = params.index
          var self = this
          return h('Select', {
            props: {
              value: this.returnBlankIfNullCopy(this.linkData.actionOutCtl[indexParams], 'runAction')
              // value: this.linkData.actionOutCtl[indexParams].runAction === '0' ? '打开' : '关闭'  // 读取数据中的值
            },
            on: {
              'on-change'(v, index = indexParams) {
                if (self.returnBlankIfNull(self.linkData.actionOutCtl[indexParams], 'runAction') !== undefined) {
                  if (v !== '') {
                    self.linkData.actionOutCtl[index].runAction = (v === '打开' ? '0' : '1')
                  }
                }
              }
            }
          }, this.actionOptions.map(v => {
            return h('Option', {
              props: {
                value: v.label,
                key: v
              }
            })
          }))
        }
      }, {
        title: '叠加图标',
        align: 'center',
        width: 90,
        key: 'tvWall',
        render: (h, params) => {
          const indexParams = params.index
          var _this = this
          return h('div', [
            h('Checkbox', {
              props: {
                value: this.returnBlankIfNull(this.linkData.actionOutCtl[indexParams], 'overlayIcon')
              },
              on: {
                'on-change'(v, index = indexParams) {
                  if (_this.returnBlankIfNull(_this.linkData.actionVideo[indexParams], 'overlayIcon') !== undefined) {
                    if (v !== '') {
                      _this.linkData.actionOutCtl[indexParams].overlayIcon = v
                    }
                  }
                }
              }
            })
          ])
        }
      }],
      actionOptions: [{
        value: '0',
        label: '打开'
      }, {
        value: '1',
        label: '关闭'
      }],
      wayOptions: [{
        value: '0',
        label: '手动'
      }, {
        value: '1',
        label: '自动'
      }]
    }
  },
  computed: {},
  methods: {
    // 1-1.报警输入\智能报警联动设置
    importSet(index) {
      if (this.nowTabIndex === '0') {
        if (this.importData[index]) {
          this.linkData = JSON.parse(JSON.stringify(this.importData[index]))
          this.alarmLinkName = this.linkData.alarmInName
          delete this.linkData.alarmInNum
          delete this.linkData.channelId
        }
      } else if (this.nowTabIndex === '2') {
        if (this.smartData[index]) {
          this.linkData = JSON.parse(JSON.stringify(this.smartData[index]))
          this.alarmLinkName = this.linkData.intelligenceAlarmName
          delete this.linkData.intelligenceAlarmId
          delete this.linkData.intelligenceAlarmNum
          delete this.linkData.channelId
        }
      }
      delete this.linkData.alarmAffirm
      delete this.linkData.alarmClassify
      delete this.linkData.alarmLevel
      delete this.linkData.alarmType
      delete this.linkData.maxDelay
      delete this.linkData.minInterval
      delete this.linkData.name
      delete this.linkData.orgId
      delete this.linkData.timeTemplate
      for (var i = 0; i < 4; i++) {
        var beginTime = this.linkData.actionRule[i].beginTime
        var endTime = this.linkData.actionRule[i].endTime
        this.linkData.actionRule[i].timeRange = toHour(beginTime, endTime)
      }
      this.itemIndex = '0'
      this.getVideoTree()
      setTimeout(() => {
        this.alarmLink = true
      }, 200)
    },
    // 1-1-1.联动视频树
    getVideoTree() {
      var videoTreeType = {
        orgtype: 0,
        type: 0
      }
      this.getDeviceTree(videoTreeType).then(() => {
        this.videoTree = JSON.parse(JSON.stringify(this.deviceTreeData))
        this.linkData.actionVideo.map((v) => {
          v.orgName = this.searchOrg(v.organization)
        })
      }).catch((err) => {
        console.log('logout error:' + err)
        if (this.tipErrorConfig.show) {
          this.$Notice.error({
            title: '警告',
            desc: '设备树数据获取失败',
            duration: this.tipErrorConfig.dur,
            top: 200
          })
        }
      })
    },
    // 1-1-2.报警输出树
    getExportTree() {
      this.getLinkOutTree().then(() => {
        var data = JSON.parse(JSON.stringify(this.linkOutTreeData))
        this.exportTree = this.treeAddAlarm(data)
      }).catch((err) => {
        console.log('logout error:' + err)
        if (this.tipErrorConfig.show) {
          this.$Notice.error({
            title: '警告',
            desc: '设备树数据获取失败',
            duration: this.tipErrorConfig.dur,
            top: 200
          })
        }
      })
    },
    // 1-2.联动规则序号
    tabIndex(item) {
      this.itemIndex = item
      this.nowModTabIndex = Number(item) - 1
    },
    // 1-4.主摄像机仅可选择一个
    isCameras() {
      var isCameras = this.linkData.actionVideo
      isCameras.map(v => {
        v.mainCamera = false
      })
    },
    // 1-5.联动控制选项
    linkShow(data) {
      if (data === '0') {
        this.getVideoTree()
        this.linkIsShow = true
      } else {
        this.getExportTree()
        this.linkIsShow = false
      }
    },
    // 1-6.联动——添加联动视频输出控制
    addVideoConfig() {
      if (this.linkOption === '0') {
        var treeData = this.$refs.videoTree.getSelectedNodes()
        if (treeData.length !== 0) {
          var InvalidLink = []
          treeData.map((v) => {
            // isOrg=false是设备，成功添加不做提示
            if (v.isOrg === false) {
              var orgName = this.searchOrg(v.pid)
              var Vid = v._id
              var videoSet = {
                channelName: v.name,
                mainCamera: false,
                client: false,
                videoWall: false,
                electronicMap: false,
                record: false,
                channelId: Vid,
                organization: v.pid,
                orgName: orgName
              }
              if (this.linkData.actionVideo.length === 0) {
                this.linkData.actionVideo.push(videoSet)
              } else {
                const result = this.linkData.actionVideo.some((item, index) => {
                  return Vid === item.channelId
                })
                if (!result) {
                  this.linkData.actionVideo.push(videoSet)
                } else {
                  if (this.tipWarningConfig.show) {
                    this.$Notice.warning({
                      title: '失败',
                      desc: '不能重复添加联动视频',
                      duration: this.tipWarningConfig.dur,
                      top: 200
                    })
                  }
                }
              }
            } else if (v.children === undefined) {
              // 不是设备，如是单独节点，则将name保存，提示机构不能添加
              InvalidLink.push(v.name)
            }
          })
          if (InvalidLink.length !== 0) {
            if (this.tipWarningConfig.show) {
              this.$Notice.warning({
                title: '失败',
                desc: InvalidLink.join(',') + '  为机构，不支持添加联动视频',
                duration: this.tipWarningConfig.dur,
                top: 200
              })
            }
          }
        } else {
          if (this.tipErrorConfig.show) {
            this.$Notice.error({
              title: '警告',
              desc: '请先选择设备',
              duration: this.tipErrorConfig.dur,
              top: 200
            })
          }
        }
      }
    },
    // 数据为undefined，则范围空字符串
    returnBlankIfNull(item, key) {
      return item === undefined ? '' : item[key]
    },
    // 1-7.联动——删除联动视频输出控制
    delVideoConfig() {
      this.Inselect.forEach((item, index, arr) => {
        const tempObj = {}
        for (var key in item) {
          tempObj[key] = item[key]
        }
        item = tempObj
      })
      this.Inselect.map(item => {
        const result = this.linkData.actionVideo.some((Item) => {
          return item.channelId === Item.channelId
        })
        if (result) {
          this.linkData.actionVideo.map((Item, index) => {
            if (Item.channelId === item.channelId) {
              this.linkData.actionVideo.splice(index, 1)
            }
          })
        }
      })
      this.Inselect = []
    },
    // 1-8.联动——添加报警输出控制
    addExportConfig() {
      if (this.linkOption === '1') {
        var treeData = this.$refs.exportTree.getSelectedNodes()
        if (treeData.length !== 0) {
          var InvalidExport = []
          treeData.map((v) => {
            // isOrg=false是设备，成功添加不做提示
            if (v.isOrg === false) {
              var videoSet = {
                outPutId: v._id,
                outPutName: v.name,
                runMode: 0,
                runAction: 0,
                overlayIcon: false,
                organization: v.pid
              }
              if (this.linkData.actionOutCtl.length === 0) {
                this.linkData.actionOutCtl.push(videoSet)
              } else {
                const result = this.linkData.actionOutCtl.some((item, index) => {
                  return v._id === item.outPutId
                })
                if (!result) {
                  this.linkData.actionOutCtl.push(videoSet)
                } else {
                  if (this.tipWarningConfig.show) {
                    this.$Notice.warning({
                      title: '失败',
                      desc: '不能重复添加联动视频',
                      duration: this.tipWarningConfig.dur,
                      top: 200
                    })
                  }
                }
              }
            } else if (v.children === undefined) {
              // 不是设备，如是单独节点，则则将name保存，提示机构不能添加
              InvalidExport.push(v.name)
            }
          })
          if (InvalidExport.length !== 0) {
            if (this.tipWarningConfig.show) {
              this.$Notice.warning({
                title: '失败',
                desc: InvalidExport.join(',') + '  为机构，不支持添加报警输出控制',
                duration: this.tipWarningConfig.dur,
                top: 200
              })
            }
          }
        } else {
          if (this.tipErrorConfig.show) {
            this.$Notice.error({
              title: '警告',
              desc: '请先选择设备',
              duration: this.tipErrorConfig.dur,
              top: 200
            })
          }
        }
      }
    },
    // 数据为undefined，则范围空字符串
    returnBlankIfNullCopy(item, key) {
      if (key === 'runMode') {
        return item === undefined ? '' : (item[key] === '0' ? '手动' : '自动')
      }
      if (key === 'runAction') {
        return item === undefined ? '' : (item[key] === '0' ? '打开' : '关闭')
      }
    },
    // 1-9.联动——删除报警输出控制
    delExportConfig() {
      this.Inselect.forEach((item, index, arr) => {
        const tempObj = {}
        for (var key in item) {
          tempObj[key] = item[key]
        }
        item = tempObj
      })
      this.Inselect.map(item => {
        const result = this.linkData.actionOutCtl.some((Item) => {
          return item.outPutId === Item.outPutId
        })
        if (result) {
          this.linkData.actionOutCtl.map((Item, index) => {
            if (Item.outPutId === item.outPutId) {
              this.linkData.actionOutCtl.splice(index, 1)
            }
          })
        }
      })
      this.Inselect = []
    },
    // 1-10.联动配置确认
    affirmLink() {
      var crossStatus = this.crossTime()
      if (crossStatus === true) {
        // 4个联动tabs中删除timeRange
        this.linkData.actionRule.map((v) => {
          delete v.timeRange
        })
        // 报警输入联动配置
        if (this.nowTabIndex === '0') {
          delete this.linkData.alarmInName
          this.linkData.actionVideo.map((v) => {
            delete v.orgName
          })
          this.setAlarmInLink(this.linkData).then((suc) => {
            this.returnData()
            this.alarmLink = false
          }).catch((err) => {
            console.log('logout error:' + err)
            if (this.tipErrorConfig.show) {
              this.$Notice.error({
                title: '警告',
                desc: '联动设置失败',
                duration: this.tipErrorConfig.dur,
                top: 200
              })
            }
          })
        }
        // 智能报警联动配置
        if (this.nowTabIndex === '2') {
          delete this.linkData.intelligenceAlarmName
          this.setSmartLink(this.linkData).then((suc) => {
            this.returnData()
            this.alarmLink = false
          }).catch((err) => {
            console.log('logout error:' + err)
            if (this.tipErrorConfig.show) {
              this.$Notice.error({
                title: '警告',
                desc: '联动设置失败',
                duration: this.tipErrorConfig.dur,
                top: 200
              })
            }
          })
        }
        // this.alarmLink = false
      }
    },
    // 1-11.联动配置取消
    cancelLink() {
      this.alarmLink = false
    },
    // 1-12.时间交叉验证规则
    crossTime() {
      var timeArr = this.linkData.actionRule
      var timeTrue = []
      timeArr.map((v, z) => {
        if (v.status === true) {
          timeTrue.push(z)
        }
      })
      var crossTime = []
      for (var i = 0; i < timeTrue.length; i++) {
        for (var j = 0; j < timeTrue.length; j++) {
          if (i !== j) {
            var nowBegin = timeArr[timeTrue[i]].beginTime
            var nowEnd = timeArr[timeTrue[i]].endTime
            var restBegin = timeArr[timeTrue[j]].beginTime
            var restEnd = timeArr[timeTrue[j]].endTime
            if ((nowEnd > restBegin && nowBegin < restBegin) || (nowBegin > restBegin && nowBegin < restEnd) || (nowBegin === restBegin && nowEnd === restEnd)) {
              crossTime.push(timeTrue[j])
            }
          }
        }
      }
      if (crossTime.length !== 0) {
        if (this.tipWarningConfig.show) {
          this.$Notice.warning({
            title: '失败',
            desc: '联动时间有交叉,请修改时间。',
            duration: this.tipWarningConfig.dur,
            top: 200
          })
        }
        return false
      } else {
        return true
      }
    },
    // 联动设置-报警输出控制/智能报警/报警输入/报警输出-树处理
    treeAddAlarm(data) {
      var arr = []

      function _toTree(oldTree, arr, id, type) {
        oldTree.forEach(item => {
          var obj = {}
          for (const i in item) {
            obj[i] = item[i]
          }
          obj.pid = id
          if (item.alarmOutName) {
            obj.name = item.alarmOutName
            obj.eid = id
            obj.isOrg = false
          }
          if (type) {
            obj.eid = id
            obj.form = 'smart'
          }
          arr.push(obj)
          if (item.children && item.children.length > 0) {
            obj.children = []
            _toTree(item.children, obj.children, item._id)
          }
          if (item.alarms && item.alarms.length > 0) {
            if (!obj.children) {
              obj.children = []
            }
            obj.alarms = []
            _toTree(item.alarms, obj.children, item._id)
          }
          if (item.alarm && item.alarm.intelligentAlarm && item.alarm.intelligentAlarm.length > 0) {
            if (!obj.children) {
              obj.children = []
            }
            _toTree(item.alarm.intelligentAlarm, obj.children, item._id, 'smart')
          }
        })
      }
      _toTree(data, arr, null)
      return arr
    },
    // 查找父机构名称
    searchOrg(data) {
      var orgName
      var searchChild = (child) => {
        child.map((v) => {
          if (data === v._id) {
            orgName = v.name
          } else {
            if (v.children) {
              searchChild(v.children)
            }
          }
        })
      }
      searchChild(this.videoTree)
      return orgName
    }
  }
}
