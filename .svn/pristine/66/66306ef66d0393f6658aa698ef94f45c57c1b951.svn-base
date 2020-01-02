export default {
  data() {
    return {
      canUse: true,
      boxTableTitle: [{
        type: 'selection',
        width: 60
      }, {
        title: '终端名称',
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
        title: '对讲IP地址',
        key: 'ip',
        minWidth: 200,
        align: 'center',
        render: (h, params) => {
          let text = ''
          if (params.row.ip === '') {
            text = '...'
          } else {
            text = params.row.ip
          }
          return h('span', text)
        }
      }, {
        title: '对讲ID号',
        key: 'serise',
        minWidth: 200,
        align: 'center'
      }, {
        title: '联动镜头',
        key: 'cameraDesciption',
        minWidth: 300,
        ellipsis: true,
        align: 'center',
        render: (h, params) => {
          return h(
            'span',
            {
              domProps: {
                title: params.row.cameraDesciption
              }
            },
            params.row.cameraDesciption
          )
        }
      }],
      boxTableData: [],
      boxModelShow: false,
      centerTitle: '',
      configModelShow: false,
      confloading: false,
      boxData: {
        name: '',
        serise: '',
        ip: '0.0.0.0',
        record: true
      },
      Inselect: [],
      offLoading: false,
      tableModelLoad: false,
      linkLoading: false,
      inSearchName: '',
      // 分页
      pageObj: {
        cur: 1,
        count: 0,
        limit: this.$PageInfo.limit
      },
      serverip: '',
      serverport: '',
      inselectId: ''
    }
  },
  created() {
    this.canUse = true
    this.getTermData()
    this.Inselect = []
    /* this.getAlarmHelpServer()
      .then(res => {
        if (res) {
          this.serverip = res.data.device.ip
          this.serverport = res.data.device.cport
        }
      })
      .catch(err => {
        console.log(err, 'getAlarmHelpServer')
      }) */
  },
  watch: {},
  methods: {
    getTermData() {
      this.getTalkTerminal({
        page: this.pageObj.cur,
        limit: this.pageObj.limit,
        name: this.inSearchName
      }).then(res => {
        this.boxTableData = res.data
        this.pageObj.count = Number(res.headers['x-bsc-count'])
      }).catch(() => {
        this.errorMsg('获取对讲终端数据失败')
      })
    },
    // 列表复选
    alarmInSel(selection) {
      this.Inselect = selection
      if (selection.length !== 0) {
        this.canUse = false
      } else {
        this.canUse = true
      }
    },
    // 联动主镜头 树点击事件
    handleLinkMain(node) {
      if (node.tierType === 'res') {
        this.linkMain.label = node.name
        this.linkMain.id = node._id
      }
    },
    handleLinkVice1(node) {
      if (node.tierType === 'res') {
        this.linkVice1.label = node.name
        this.linkVice1.id = node._id
      }
    },
    handleLinkVice2(node) {
      if (node.tierType === 'res') {
        this.linkVice2.label = node.name
        this.linkVice2.id = node._id
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
        serise: '0',
        record: true
      }
      this.linkMain = {label: '', id: ''}
      this.linkVice1 = {label: '', id: ''}
      this.linkVice2 = {label: '', id: ''}
    },
    openEditMod(value) {
      if (this.Inselect.length === 1) {
        this.inselectId = this.Inselect[0]._id
        this.centerTitle = value
        this.boxModelShow = true
        this.boxData = {
          name: this.Inselect[0].name,
          ip: this.Inselect[0].ip,
          serise: this.Inselect[0].serise,
          record: this.Inselect[0].record
        }
        const cameraId = this.Inselect[0].camera || []
        const cameraNames = this.Inselect[0].cameraDesciption ? this.Inselect[0].cameraDesciption.split(',') : []
        cameraId.forEach((item, index) => {
          if (!item) {
            cameraNames.splice(index, 0, '')
          }
        })
        this.linkMain = {label: cameraNames[0] || '', id: cameraId[0] || ''}
        this.linkVice1 = {label: cameraNames[1] || '', id: cameraId[1] || ''}
        this.linkVice2 = {label: cameraNames[2] || '', id: cameraId[2] || ''}
      } else {
        this.warningMsg('请选择一项')
      }
    },
    // 确认 修改，添加
    editOk(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          const isRepeat = this.judgeLink()
          if (isRepeat) {
            this.warningMsg('联动主副镜头不能重复')
            return
          }
          this.tableModelLoad = true
          const camera = [this.linkMain.id, this.linkVice1.id, this.linkVice2.id]
          if (this.centerTitle === '添加终端') {
            this.addTalkTerminal({...this.boxData, camera})
              .then(() => {
                this.getTermData()
                this.tableModelLoad = false
                this.boxModelShow = false
              })
              .catch(err => {
                this.tableModelLoad = false
                this.warningMsg(err.response.data.message)
              })
          } else if (this.centerTitle === '修改终端') {
            let param = {
              body: {...this.boxData, camera},
              id: this.inselectId
            }
            this.editTalkTerminal(param)
              .then(() => {
                this.getTermData()
                this.tableModelLoad = false
                this.boxModelShow = false
              })
              .catch(err => {
                this.tableModelLoad = false
                this.warningMsg(err.response.data.message)
              })
          }
        }
      })
    },
    // 判断主副镜头是否有相同
    judgeLink() {
      let idArr = []
      this.linkMain.label && idArr.push(this.linkMain.id)
      this.linkVice1.label && idArr.push(this.linkVice1.id)
      this.linkVice2.label && idArr.push(this.linkVice2.id)
      const noRepeatArr = [...new Set(idArr)]
      if (noRepeatArr.length === idArr.length) {
        return false
      } else {
        return true
      }
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
      this.deleteTalkTerminal({ids: allId})
        .then(() => {
          this.getTermData()
        })
        .catch(() => {
          this.errorMsg('删除报警终端数据失败')
        })
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
    }
  }
}
