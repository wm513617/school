export default {
  data() {
    return {
      canUse: true,
      boxTableTitle: [{
        type: 'selection',
        width: 60
      }, {
        title: '设备名称',
        key: 'name',
        align: 'center',
        minWidth: 200,
        render: (h, params) => {
          return h('span', {
            style: {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            },
            domProps: {
              title: params.row.name
            }
          }, params.row.name)
        }
      }, {
        title: '镜头IP地址',
        key: 'ip',
        minWidth: 200,
        align: 'center',
        render: (h, params) => {
          let text = ''
          if (params.row.camerDevId.ip === '') {
            text = '...'
          } else {
            text = params.row.camerDevId.ip
          }
          return h('span', text)
        }
      }, {
        title: '对讲ID号',
        key: 'talkId',
        minWidth: 200,
        align: 'center'
      }, {
        title: '设备类型',
        key: 'deviceType',
        minWidth: 200,
        align: 'center',
        render: (h, params) => {
          let text = ''
          if (params.row.deviceType === '') {
            text = '...'
          } else if (params.row.deviceType === 'alarmPillar') {
            text = '报警柱'
          } else if (params.row.deviceType === 'alarmBox') {
            text = '报警箱'
          }
          return h('span', text)
        }
      }, {
        title: '联动配置',
        key: 'action',
        minWidth: 300,
        render: (h, params) => {
          return h('div', [
            h(
              'Button', {
                props: {
                  type: 'ghost',
                  disabled: !this.$BShasPower('BS-ALARMHELP-TERMINAL-CONF'),
                  loading: this.confloading
                },
                on: {
                  click: () => {
                    this.alarmBoxConfig(params.index, params.row)
                  }
                }
              },
              '配置'
            )
          ])
        }
      }],
      boxTableData: [],
      boxModelShow: false,
      centerTitle: '',
      configModelShow: false,
      confloading: false,
      boxData: {
        name: '',
        ip: '',
        cport: '',
        dport: '',
        username: '',
        password: '',
        talkId: '',
        talkIp: '',
        deviceType: 'alarmBox'
      },
      Inselect: [],
      offLoading: false,
      tableModelLoad: false,
      linkLoading: false,
      inSearchName: '',
      // 分页
      inPageNum: 0,
      imPageCur: 1,
      pageLimit: 15,
      linkVideoTree: [],
      configBoxData: {
        name: '',
        configType: '0',
        actionOutCtl: [{
          name: '警铃',
          beginTime: 0,
          endTime: 86399,
          status: false
        }, {
          name: '警灯',
          beginTime: 0,
          endTime: 86399,
          status: false
        }],
        actionVideo: [],
        actionloc: {
          client: false, // 联动本机镜头
          record: false // 是否录像
        }
      },
      /* primaryLinkTitle: [{
        type: 'index',
        title: '联动序号',
        width: 100
      }, {
        title: '联动设备',
        key: 'name',
        align: 'center',
        minWidth: 120,
        render: (h, params) => {
          const indexParams = params.index
          let _this = this
          return h(
            'Select', {
              props: {
                value: _this.configBoxData.actionOutCtl[indexParams].name
              },
              on: {
                'on-change'(v) {
                  if (v !== '') {
                    _this.configBoxData.actionOutCtl[indexParams].name = v
                  }
                }
              }
            },
            this.wayOptions.map(v => {
              return h('Option', {
                props: {
                  value: v.label,
                  key: v.value
                }
              })
            })
          )
        }
      }, {
        title: '布防时间',
        align: 'center',
        width: 200,
        key: 'time',
        render: (h, params) => {
          let begin = this.configBoxData.actionOutCtl[params.index].beginTime
          let end = this.configBoxData.actionOutCtl[params.index].endTime
          let _this = this
          return h('div', [
            h('TimePicker', {
              props: {
                type: 'timerange',
                placement: 'bottom-end',
                value: this.toHour(begin, end)
              },
              on: {
                'on-change'(time) {
                  if (time.length !== 0) {
                    let timeSec = _this.toSecond(time[0], time[1])
                    _this.configBoxData.actionOutCtl[params.index].beginTime = timeSec[0]
                    _this.configBoxData.actionOutCtl[params.index].endTime = timeSec[1]
                  }
                }
              }
            })
          ])
        }
      }, {
        title: '启用',
        align: 'center',
        width: 100,
        key: 'status',
        render: (h, params) => {
          const indexParams = params.index
          let _this = this
          return h('div', [
            h('Checkbox', {
              props: {
                value: _this.configBoxData.actionOutCtl[indexParams].status
              },
              on: {
                'on-change'(v) {
                  if (v !== '') {
                    _this.configBoxData.actionOutCtl[indexParams].status = v
                  }
                }
              }
            })
          ])
        }
      }], */
      wayOptions: [{
        value: '警铃',
        label: '警铃'
      }, {
        value: '警灯',
        label: '警灯'
      }],
      options: {
        showCheckbox: true,
        showInput: true
      },
      offring: true,
      pageObj: {
        cur: 1,
        count: 0,
        limit: this.$PageInfo.limit
      },
      // serverStoreList: [],
      // pathStroeList: [],
      typeList: [{
        label: '报警箱',
        value: 'alarmBox'
      }, {
        label: '报警柱',
        value: 'alarmPillar'
      }],
      serverip: '',
      serverport: '',
      showLinkConfig: false,
      dataActionVideo: [],
      inselectId: '',
      timeIndex: 0
    }
  },
  created() {
    this.canUse = true
    this.getTermData()
    this.Inselect = []
    this.getAlarmHelpServer()
      .then(res => {
        if (res) {
          this.serverip = res.data.device.ip
          this.serverport = res.data.device.cport
        }
      })
      .catch(err => {
        console.log(err, 'getAlarmHelpServer')
      })
  },
  watch: {},
  methods: {
    getTermData() {
      this.getAlarmTermData({
        page: this.pageObj.cur,
        limit: this.pageObj.limit,
        name: this.inSearchName
      }).then(res => {
        this.alarmTermData && (this.boxTableData = this.alarmTermData)
        this.pageObj.count = Number(res.headers['x-bsc-count'])
      }).catch(() => {
        this.errorMsg('获取报警终端数据失败')
      })
    },
    videoTreeExpand() {
      this.$refs.videoScroll.update()
    },
    // 列表复选
    alarmInSel(selection) {
      this.Inselect = selection
      if (selection.length !== 0) {
        this.offring = false
        this.canUse = false
      } else {
        this.offring = true
        this.canUse = true
      }
    },
    // 报警终端 添加、修改、删除
    openAddMod(value) {
      this.centerTitle = value
      this.boxModelShow = true
      if (this.$refs['boxData']) {
        this.$refs['boxData'].resetFields()
      }
      this.boxData = {
        name: '',
        ip: '0.0.0.0',
        cport: 3721,
        dport: 3720,
        username: 'admin',
        password: '123456',
        talkId: '0',
        talkIp: '0.0.0.0',
        deviceType: 'alarmBox'
      }
    },
    openEditMod(value) {
      if (this.Inselect.length === 1) {
        this.inselectId = this.Inselect[0]._id
        this.centerTitle = value
        this.boxModelShow = true
        this.boxData = {
          name: this.Inselect[0].name,
          ip: this.Inselect[0].camerDevId.ip,
          cport: this.Inselect[0].camerDevId.cport,
          dport: this.Inselect[0].camerDevId.dport,
          username: this.Inselect[0].camerDevId.username,
          password: this.Inselect[0].camerDevId.password,
          talkId: this.Inselect[0].talkId,
          talkIp: this.Inselect[0].talkIp,
          deviceType: this.Inselect[0].deviceType
        }
      } else {
        this.warningMsg('请选择一项')
      }
    },
    cportRule(rule, value, callback) {
      let data = this.boxData.cport
      this.portrule(data, callback)
    },
    dportRule(rule, value, callback) {
      let data = this.boxData.dport
      this.portrule(data, callback)
    },
    portrule(data, callback) {
      if (data === '' || data === undefined) {
        return callback(new Error('端口不能为空'))
      } else {
        if (!Number.isInteger(data)) {
          return callback(new Error('请输入数字'))
        } else {
          if (data > 65535) {
            return callback(new Error('超出范围0-65535'))
          } else {
            return callback()
          }
        }
      }
    },
    // 确认 修改，添加
    editOk(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (!this.alarmHelpServer) {
            this.warningMsg('请配置服务器配置')
            return
          }
          this.tableModelLoad = true
          if (this.centerTitle === '添加报警终端') {
            this.addAlarmTermianl(this.boxData)
              .then(() => {
                this.getTermData()
                this.tableModelLoad = false
                this.boxModelShow = false
              })
              .catch(err => {
                this.modelLoad = false
                this.tableModelLoad = false
                const msg = {
                  ipCport: '警笛ip或端口已添加过',
                  talkId: '对讲台麦id号已添加过',
                  talkIp: '对讲台麦ip号已添加过'
                }
                if (err.response.data) {
                  Object.keys(err.response.data).forEach(n => {
                    msg[n] && this.errorMsg(msg[n])
                  })
                }
              })
          } else if (this.centerTitle === '修改报警终端') {
            this.boxData._id = this.inselectId
            this.editAlarmTermianl(this.boxData)
              .then(() => {
                this.getTermData()
                this.tableModelLoad = false
                this.boxModelShow = false
              })
              .catch(err => {
                this.modelLoad = false
                this.tableModelLoad = false
                const msg = {
                  ipCport: '警笛ip或端口已添加过',
                  talkId: '对讲台麦id号已添加过',
                  talkIp: '对讲台麦ip号已添加过'
                }
                if (err.response.data) {
                  Object.keys(err.response.data).forEach(n => {
                    msg[n] && this.errorMsg(msg[n])
                  })
                }
              })
          }
        }
      })
    },
    // 取消 添加、修改
    editCancel(name) {
      this.$refs[name].resetFields()
      this.boxModelShow = false
      this.configModelShow = false
    },
    delAlarm() {
      if (this.Inselect.length !== 0) {
        this.$Modal.confirm({
          title: '警告',
          content: '<p>确认删除吗?</p>',
          loading: true,
          onOk: () => {
            this.sureDel()
            setTimeout(() => {
              this.$Modal.remove()
            }, 0)
          }
        })
      }
    },
    sureDel() {
      let allId = []
      this.Inselect.map(v => {
        allId.push(v._id)
      })
      allId = allId.join(',')
      this.delAlarmTerminal(allId)
        .then(() => {
          this.getTermData()
        })
        .catch(() => {
          this.errorMsg('删除报警终端数据失败')
        })
    },
    alarmBoxConfig(index, data) {
      this.confloading = true
      let contrl = [{
        name: '警铃',
        beginTime: 0,
        endTime: 86399,
        status: false
      }, {
        name: '警灯',
        beginTime: 0,
        endTime: 86399,
        status: false
      }]
      // 显示当前报警终端数配置值
      this.configBoxData._id = data._id
      this.configBoxData.name = data.name
      this.configBoxData.configType = '0'
      this.showLinkConfig = false
      this.configBoxData.actionOutCtl = data.actionOutCtl && data.actionOutCtl.length === 0 ? contrl : data.actionOutCtl
      // this.configBoxData.actionloc = data.actionloc ? JSON.parse(JSON.stringify(data.actionloc)) : ''
      // this.dataActionVideo = data.actionVideo ? data.actionVideo : ''
      // let treeList = []
      // if (data.actionVideo) {
      //   data.actionVideo.map(item => {
      //     treeList.push(item.resource)
      //   })
      // }
      // 获取联动配置树
      this.getResourceTree()
        .then(resdata => {
          // this.linkVideoTree = this.addActionToTree([resdata], treeList)
        })
        .catch(() => {
          this.errorMsg('获取联动配置树失败')
        })
      this.confloading = false
      this.configModelShow = true
    },
    configTypeSel(data) {
      if (data === '0') {
        this.showLinkConfig = false
      } else {
        this.showLinkConfig = true
      }
      this.configBoxData.configType = data
    },
    sureLink() {
      this.linkLoading = true
      if (this.$refs.videoTree) {
        if (this.$refs.videoTree.getSelectedNodes().length !== 0) {
          // 将联动树，以勾选的id等做处理
          let selectTree = this.$refs.videoTree.getSelectedNodes()
          let selectVideo = []
          let addList = []
          selectVideo = selectTree.filter(node => !node.isOrg).filter(node => !node.equip)
          if (selectVideo.length !== 0) {
            selectVideo.map(v => {
              addList.push({
                resource: v._id,
                client: true,
                record: this.configBoxData.actionloc.record
              })
            })
          } else {
            this.configModelShow = true
            this.linkLoading = false
            this.errorMsg('请勾选视频资源')
            return
          }
          this.configBoxData.actionVideo = addList
        } else {
          this.configBoxData.actionVideo = []
        }
      } else {
        this.configBoxData.actionVideo = this.dataActionVideo
      }
      // 保存联动配置
      this.editAlarmTermianl(this.configBoxData)
        .then(() => {
          this.getTermData()
          this.linkLoading = false
        })
        .catch(() => {
          this.linkLoading = false
          this.errorMsg('联动配置保存失败')
        })
      this.configModelShow = false
      this.linkLoading = false
    },
    // 关闭响铃
    offTerRing() {
      if (this.Inselect.length !== 0) {
        this.offLoading = true
        let terminals = []
        this.Inselect.map((item, index) => {
          terminals.push({
            talkId: item.talkId,
            outPut: [{
              outputNo: 1,
              status: 'off'
            }, {
              outputNo: 2,
              status: 'off'
            }]
          })
        })
        let data = {
          devInfo: {
            devIp: this.serverip,
            devPort: this.serverport
          },
          terminalList: terminals
        }
        this.offTerminalRingAudio(data)
          .then(() => {
            this.offLoading = false
            this.successMsg('关闭成功')
          })
          .catch(() => {
            this.offLoading = false
            this.errorMsg('关闭失败')
          })
      } else {
        this.errorMsg('请勾选至少一个报警终端')
      }
    },
    search() {
      this.getTermData()
    },
    pageChange(n) {
      this.pageObj.cur = n
      this.getTermData()
    },
    pageSizeChange(n) {
      this.pageObj.limit = n
      this.getTermData()
    },
    // 时间转换
    toHour(beginTime, endTime) {
      function time(sec) {
        let h = parseInt(sec / 3600)
        if (h < 10) {
          h = '0' + h
        }
        let m = parseInt((sec % 3600) / 60)
        if (m < 10) {
          m = '0' + m
        }
        let s = parseInt((sec % 3600) % 60)
        if (s < 10) {
          s = '0' + s
        }
        return h + ':' + m + ':' + s
      }
      let beginHour = time(beginTime)
      let endHour = time(endTime)
      return [beginHour, endHour]
    },
    toSecond(beginTime, endTime) {
      let beginSec = beginTime.split(':')[0] * 3600 + beginTime.split(':')[1] * 60 + beginTime.split(':')[2] * 1
      let endSec = endTime.split(':')[0] * 3600 + endTime.split(':')[1] * 60 + endTime.split(':')[2] * 1
      let timeSec = [beginSec, endSec]
      return timeSec
    },
    // 回显树勾选状态
    addActionToTree(tree, actions) {
      tree.forEach(item => {
        if (actions.includes(item._id)) {
          item.checked = true
        }
        if (item.children && item.children.length) {
          this.addActionToTree(item.children, actions)
        }
      })
      return tree
    },
    changeTimerange(time) {
      console.log('报警时间11', this.configBoxData)
      if (time.length !== 0) {
        let timeSec = this.toSecond(time[0], time[1])
        this.configBoxData.actionOutCtl[this.timeIndex].beginTime = timeSec[0]
        this.configBoxData.actionOutCtl[this.timeIndex].endTime = timeSec[1]
      }
      console.log('报警时间22', this.configBoxData)
    }
  }
}
