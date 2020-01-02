export default {
  name: 'paramsSetting',
  data() {
    const playTimeRule = (rule, value, callback) => {
      let r = /^\+?[0-9][0-9]*$/
      if (value === '') {
        return callback(new Error('播放次数不能为空'))
      }
      if (r.test(value) || Number(value) === 0) {
        if (Number(value) > 9) {
          return callback(new Error('播放次数不得超过最大值9'))
        } else {
          callback()
        }
      } else {
        return callback(new Error('请输入有效数字'))
      }
    }
    const glitterRule = (rule, value, callback) => {
      let r = /^\+?[0-9][0-9]*$/
      if (value === '') {
        return callback(new Error('时间不能为空'))
      }
      if (r.test(value) || Number(value) === 0) {
        if (Number(value) > 7200) {
          return callback(new Error('时间超过最大值7200s'))
        } else {
          callback()
        }
      } else {
        return callback(new Error('请输入有效数字'))
      }
    }
    const msgRule = (rule, value, callback) => {
      this.ruleValidate.policeWhistleNameID[0].required = false
      callback()
    }
    const policeRule = (rule, value, callback) => {
      if (this.rankEditForm.msgVoice === '0' || this.rankEditForm.msgVoice === '3') {
        this.ruleValidate.policeWhistleNameID[0].required = false
        callback()
      } else {
        if (value === '' || value === undefined) {
          this.ruleValidate.policeWhistleNameID[0].required = true
          return callback(new Error('请选择警笛文件'))
        } else {
          this.ruleValidate.policeWhistleNameID[0].required = false
          callback()
        }
      }
    }
    const lengthRule = (rule, value, callback) => {
      if (/\s+/g.test(value)) {
        return callback(new Error('请勿输入空格'))
      } else {
        let nativecode = value.split('')
        let len = 0
        for (let i = 0; i < nativecode.length; i++) {
          let code = Number(nativecode[i].charCodeAt(0))
          if (code > 127) {
            len += 2
          } else {
            len++
          }
        }
        if (len > 64) {
          return callback(new Error('不能超过64位字符'))
        } else {
          callback()
        }
      }
    }
    return {
      addFileData: {
        name: '',
        audioId: '',
        fileName: ''
      },
      audioInfo: {
        audioName: '',
        audioTime: ''
      },
      planForm: {
        name: '',
        content: ''
      },
      ruleValidates: {
        name: [{
          required: true,
          message: '名称不能为空',
          trigger: 'blur'
        }, {
          validator: lengthRule,
          trigger: 'change'
        }],
        content: [{
          required: true,
          message: '警情信息不能为空',
          trigger: 'blur'
        }]
      },
      ruleValidate: {
        name: [{
          required: true,
          message: '警笛名称不能为空',
          trigger: 'blur'
        }, {
          validator: lengthRule,
          trigger: 'change'
        }],
        audioId: [{
          required: true,
          message: '请选择铃声',
          trigger: 'change'
        }],
        msgColour: [{
          required: true,
          message: '请选择消息颜色',
          trigger: 'change'
        }],
        msgVoice: [{
          required: true,
          message: '请选择通知方式',
          trigger: 'change'
        }, {
          required: true,
          validator: msgRule,
          trigger: 'change'
        }],
        policeWhistleNameID: [{
          required: true,
          validator: policeRule,
          trigger: 'change'
        }],
        playTime: [{
          required: true,
          validator: playTimeRule,
          trigger: 'blur'
        }],
        mapIcoGlitterTime: [{
          required: true,
          validator: glitterRule,
          trigger: 'blur'
        }],
        intelligentMsgGlitterTime: [{
          required: true,
          validator: glitterRule,
          trigger: 'blur'
        }]
      },
      rankEditForm: {},
      colorList: [{
        value: '#FF3333',
        label: '红色'
      }, {
        value: '#FFFF00',
        label: '黄色'
      }, {
        value: '#00FF00',
        label: '绿色'
      }, {
        value: '#2196F3',
        label: '蓝色'
      }, {
        value: '#008B8B',
        label: '暗青色'
      }, {
        value: '#20B2AA',
        label: '亮海蓝色'
      }, {
        value: '#66CDAA',
        label: '间绿色'
      }, {
        value: '#F0E68C',
        label: '黄褐色'
      }],
      rankTitle: [{
        title: '报警级别',
        width: 100,
        // align: 'center',
        render: (h, params) => {
          let text = ''
          if (this.rankPageCur === 1) {
            text = params.index + 1 + '级'
          } else {
            text = (this.rankPageCur - 1) * this.pageLimitJB + 1 + params.index + '级'
          }
          return h('span', text)
        }
      }, {
        title: '消息颜色',
        key: 'msgColour',
        align: 'center',
        render: (h, params) => {
          if (this.levelDataList[params.index]) {
            let bgColor = this.levelDataList[params.index].msgColour
            return h('div', {
              style: {
                // width: '100%',
                height: '39.2px',
                background: bgColor
              }
            })
          }
        }
      }, {
        title: '语音播读/警笛',
        width: 120,
        align: 'center',
        render: (h, params) => {
          let text = ''
          switch (params.row.msgVoice) {
            case '0':
              text = '语音(TTS语音)'
              break
            case '1':
              text = '警笛'
              break
            case '2':
              text = '语音+警笛'
              break
            default:
              text = ''
              break
          }
          return h('span', text)
        }
      }, {
        title: '播放次数(次)',
        key: 'playTime',
        width: 150,
        align: 'center'
      }, {
        title: '操作',
        key: 'action',
        align: 'center',
        width: 130,
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'ghost',
                disabled: !this.$BShasPower('BS-ALARM-SETTING-ACTION')
              },
              on: {
                click: () => {
                  this.editRank(params.index)
                }
              }
            }, '修改')
          ])
        }
      }],
      policeTitle: [{
        type: 'index',
        title: '序号'
      }, {
        title: '名称',
        key: 'name',
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
        title: '文件名称',
        key: 'fileName',
        render: (h, params) => {
          return h('span', {
            style: {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            },
            domProps: {
              title: params.row.fileName
            }
          }, params.row.fileName)
        }
      }, {
        title: '操作',
        key: 'action',
        width: 180,
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'ghost',
                size: 'small',
                disabled: !this.$BShasPower('BS-ALARM-SETTING-ACTION')
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.show(params.index)
                }
              }
            }, '试听'),
            h('Button', {
              props: {
                type: 'ghost',
                size: 'small',
                disabled: !this.$BShasPower('BS-ALARM-SETTING-ACTION')
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.upload(params.index)
                }
              }
            }, '浏览'),
            h('Button', {
              props: {
                type: 'ghost',
                size: 'small',
                disabled: !this.$BShasPower('BS-ALARM-SETTING-ACTION')
              },
              on: {
                click: () => {
                  this.remove(params.index)
                }
              }
            }, '删除')
          ])
        }
      }],
      planTitle: [{
        type: 'index',
        title: '序号'
      }, {
        title: '名称',
        key: 'name',
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
        title: '警情信息',
        key: 'content',
        ellipsis: true,
        render: (h, params) => {
          return h('span', {
            style: {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            },
            domProps: {
              title: params.row.content
            }
          }, params.row.content)
        }
      }, {
        title: '操作',
        key: 'action',
        width: 180,
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'ghost',
                size: 'small',
                disabled: !this.$BShasPower('BS-ALARM-SETTING-ACTION')
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.editPlan(params.index)
                }
              }
            }, '修改'),
            h('Button', {
              props: {
                type: 'ghost',
                size: 'small',
                disabled: !this.$BShasPower('BS-ALARM-SETTING-ACTION')
              },
              on: {
                click: () => {
                  this.delPlan(params.index)
                }
              }
            }, '删除')
          ])
        }
      }],
      editRankMod: false,
      addFileMod: false,
      testMod: false,
      skimMod: false,
      addPlanMod: false,
      delPlanMod: false,
      buttonTimer: null,
      // 警笛
      policeData: [],
      audioTotal: 0,
      audiopageLimit: this.$PageInfo.limit,
      plicePageCur: 1,
      // 级别
      pageLimitJB: 9,
      rankPageTotal: 0,
      rankPageCur: 1,
      rankStartNum: 0,
      rankEndNum: 9,
      levelDataList: [],
      // 预案
      PlanData: [],
      planTotal: 0,
      planpageLimit: this.$PageInfo.limit,
      planPageCur: 1,
      // k
      levelIndex: '',
      changeVoice: '',
      voiceIndex: '',
      videoUrl: '',
      fileIndex: '',
      audioName: '',
      planModTitle: '',
      planIndex: '',
      editPlanIndex: '',
      addEdit: '', // 预案管理添加/修改确认识别码
      canSelect: false,
      playTimeStatus: false,
      headerObj: {
        Authorization: ''
      },
      loadMusic: '',
      // 警情处理
      alarmDealModForm: {
        name: '',
        id: ''
      },
      modName: '',
      alarmDealMod: false,
      alarmDealModTitle: '',
      alarmDealData: [],
      alarmDealTotal: 0,
      alarmDealLimit: this.$PageInfo.limit,
      alarmDealPageCur: 1,
      ruleName: {
        name: [{
          required: true,
          message: '名称不能为空',
          trigger: 'blur'
        }, {
          validator: lengthRule,
          trigger: 'change'
        }]
      },
      alarmDealTitle: [{
        type: 'index',
        title: '序号'
      }, {
        title: '名称',
        key: 'name',
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
        title: '操作',
        key: 'action',
        width: 180,
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'ghost',
                size: 'small',
                disabled: !this.$BShasPower('BS-ALARM-SETTING-ACTION')
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.editAlarmDeal(params.row)
                }
              }
            }, '修改'),
            h('Button', {
              props: {
                type: 'ghost',
                size: 'small',
                disabled: !this.$BShasPower('BS-ALARM-SETTING-ACTION')
              },
              on: {
                click: () => {
                  this.delAlarmDeal(params.row)
                }
              }
            }, '删除')
          ])
        }
      }],
      viewsValue: ''
    }
  },
  methods: {
    getLevelData(start, end) {
      this.getAlarmLevel().then(() => {
        this.levelDataList = JSON.parse(JSON.stringify(this.levelData.slice(start, end)))
        this.rankPageTotal = this.levelData.length
      }).catch((err) => {
        console.log('logout error:' + err)
        if (this.tipErrorConfig.show) {
          this.$Notice.error({
            title: '警告',
            desc: '级别数据获取失败',
            duration: this.tipErrorConfig.dur,
            top: 200
          })
        }
      })
    },
    getPoliceData() {
      this.getPoliceFile({
        page: this.plicePageCur,
        limit: this.audiopageLimit
      }).then(() => {
        this.policeData = JSON.parse(JSON.stringify(this.policeOrigData))
        this.audioTotal = this.policePageNum
      }).catch((err) => {
        console.log('logout error:' + err)
        if (this.tipErrorConfig.show) {
          this.$Notice.error({
            title: '警告',
            desc: '警笛数据获取失败',
            duration: this.tipErrorConfig.dur,
            top: 200
          })
        }
      })
    },
    getPlanData() {
      this.getPrearranged({
        page: this.planPageCur,
        limit: this.planpageLimit
      }).then(() => {
        this.PlanData = JSON.parse(JSON.stringify(this.PlanOrigData))
        this.planTotal = this.planPageNum
      }).catch((err) => {
        console.log('logout error:' + err)
        if (this.tipErrorConfig.show) {
          this.$Notice.error({
            title: '警告',
            desc: '警情类型数据获取失败',
            duration: this.tipErrorConfig.dur,
            top: 200
          })
        }
      })
    },
    getAllData() {
      this.getAlarmDelay()
      this.getLevelData(0, this.pageLimitJB)
      this.getPoliceData()
      this.getPlanData()
      this.getAlarmDeal()
    },
    // 获取报警延时
    getAlarmDelay() {
      this.getAlarmDelayData().then(res => {
        this.alarmDelay = res.data.delay
      })
    },
    // 1-1.级别配置数据处理
    dealRank(data) {
      data.map((v, i) => {
        if (v.msgVoice === '0') {
          v.voice = '语音(TTS语音)'
        } else if (v.msgVoice === '1') {
          v.voice = '警笛'
        } else if (v.msgVoice === '2') {
          v.voice = '语音+警笛'
        } else {
          v.voice = '无'
        }
      })
      return data
    },
    // 1-2.级别配置修改
    editRank(index) {
      this.editRankMod = true
      this.$refs['rankEditForm'].resetFields()
      this.levelIndex = (this.rankPageCur - 1) * this.pageLimitJB + index
      this.rankEditForm = JSON.parse(JSON.stringify(this.levelDataList[index]))
      this.viewsValue = this.rankEditForm.playTime
      this.msgVoiceChoose(this.rankEditForm.msgVoice)
    },
    // 级别配置——通知方式改变——警笛文件禁用设置
    msgVoiceChoose(value) {
      if (value === '1' || value === '2') {
        this.canSelect = false
        this.playTimeStatus = false
        this.rankEditForm.playTime = this.viewsValue
      } else if (value === '3') {
        this.canSelect = true
        this.playTimeStatus = true
        this.rankEditForm.policeWhistleNameID = ''
        this.rankEditForm.playTime = 0
      } else {
        this.canSelect = true
        this.rankEditForm.policeWhistleNameID = ''
        this.rankEditForm.playTime = this.viewsValue
        this.playTimeStatus = false
      }
    },
    // 添加警笛 下拉框change事件
    chooseFile(value) {
      this.voiceData.map((item) => {
        if (item._id === value) {
          this.rankEditForm.fileName = item.filename
          this.addFileData.fileName = item.filename
        }
      })
    },
    // 1-3.级别配置修改确认
    rankOk(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          delete this.rankEditForm.voice
          this.rankEditForm.intelligentMsgGlitterTime = Number(this.rankEditForm.intelligentMsgGlitterTime)
          this.rankEditForm.mapIcoGlitterTime = Number(this.rankEditForm.mapIcoGlitterTime)
          this.rankEditForm.playTime = Number(this.rankEditForm.playTime)
          this.editAlarmLevel(this.rankEditForm).then((suc) => {
            this.getLevelData(this.rankStartNum, this.rankEndNum)
          }).catch((err) => {
            console.log('logout error:' + err)
            if (this.tipErrorConfig.show) {
              this.$Notice.error({
                title: '警告',
                desc: '修改失败',
                duration: this.tipErrorConfig.dur,
                top: 200
              })
            }
          })
          this.editRankMod = false
        }
      })
    },
    // 2-1.警笛试听
    show(index) {
      this.testMod = true
      this.audioInfo.audioName = this.policeData[index].fileName
      let id = this.policeData[index].audioId
      this.videoUrl = '/api/upload?type=sys&id=' + id
      this.$nextTick(() => {
        let voiceInfo = this.$refs['sound']
        voiceInfo.load()
        this.loadMusic = () => {
          voiceInfo.play()
          setTimeout(() => {
            this.audioInfo.audioTime = parseInt(voiceInfo.duration)
          }, 0)
        }
      })
    },
    // 2-1-1.试听取消
    cancelTest() {
      let voiceInfo = this.$refs['sound']
      voiceInfo.pause()
      this.testMod = false
    },
    // 2-2.警笛浏览(修改)
    upload(index) {
      this.skimMod = true
      this.voiceIndex = index
      this.getVoiceData().then((suc) => {
        this.changeVoice = this.policeData[index].audioId
      }).catch(() => {
        this.errorMsg('获取已有警笛文件失败')
      })
    },
    // 2-2-1.警笛修改-确认
    changeOk() {
      this.policeData[this.voiceIndex].audioId = this.changeVoice
      this.voiceData.forEach((item) => {
        if (item._id === this.policeData[this.voiceIndex].audioId) {
          this.policeData[this.voiceIndex].fileName = item.filename
        }
      })
      this.editPoliceFile(this.policeData[this.voiceIndex]).then((suc) => {
        this.getPoliceData()
      }).catch(() => {
        this.errorMsg('修改警笛失败')
      })
      this.skimMod = false
    },
    // 2-3.警笛删除
    remove(index) {
      this.fileIndex = index
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除吗?</p>',
        onOk: () => {
          this.delOk('voice')
        }
      })
    },
    // 2-4.警笛添加
    addFile() {
      this.getVoiceList()
      this.$refs['addFileData'].resetFields()
      this.addFileMod = true
    },
    // 2-5.警笛添加-确认
    addFileOK(name) {
      if (this.buttonTimer) { return }
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.addFileData.audioId) {
            const result = this.policeData.some((item, index) => {
              return this.addFileData.name === item.name
            })
            if (result) {
              this.warningMsg('警笛名称已存在')
              this.addFileMod = true
            } else {
              this.addPoliceFile(this.addFileData).then((suc) => {
                this.getPoliceData()
                this.addFileMod = false
              }).catch(() => {
                this.errorMsg('添加失败')
                this.addFileMod = true
              })
            }
          } else {
            this.errorMsg('添加失败，未获取到音频数据')
            this.addFileMod = true
          }
          // this.addFileMod = false
        }
      })
      this.buttonTimer = setTimeout(() => {
        this.buttonTimer = null
      }, 300)
    },
    // 2-6.警笛文件上传成功
    upSuc() {
      this.$Notice.success({
        title: '上传成功',
        desc: '',
        duration: 2,
        top: 200
      })
      this.getVoiceList()
    },
    // 2-7.警笛文件上传失败
    upErr() {
      if (this.tipErrorConfig.show) {
        this.$Notice.error({
          title: '上传失败',
          desc: '上传失败请重试',
          duration: this.tipErrorConfig.dur,
          top: 200
        })
      }
    },
    // 2-8.获取已上传的警笛铃声
    getVoiceList() {
      this.getVoiceData().then().catch((err) => {
        console.log('logout error:' + err)
        if (this.tipErrorConfig.show) {
          this.$Notice.error({
            title: '警告',
            desc: '数据获取失败',
            duration: this.tipErrorConfig.dur,
            top: 200
          })
        }
      })
    },
    // 3-1.预案管理添加
    addPlan() {
      // 非点击-取消-关闭窗口 清除错误信息
      this.$refs['planForm'].resetFields()
      this.planModTitle = '添加警情类型'
      this.planForm = {
        name: '',
        content: ''
      }
      this.addPlanMod = true
      this.addEdit = 'add'
    },
    // 3-1-1.预案管理添加/修改确认
    addPlanOk(name) {
      if (this.buttonTimer) { return }
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.addEdit === 'add') {
            let addData = {
              name: this.planForm.name,
              content: this.planForm.content,
              type: '1'
            }
            this.addPrearranged(addData).then((suc) => {
              this.getPlanData()
              this.addPlanMod = false
              this.successMsg('警情类型添加成功')
            }).catch((err) => {
              const msg = {
                name: '警情类型名称已存在'
              }
              if (err.response.data) {
                Object.keys(err.response.data).forEach(n => {
                  msg[n] && this.errorMsg(msg[n])
                })
              }
            })
          } else {
            let planId = this.planForm._id
            delete this.planForm._id
            let data = {
              _id: planId,
              plan: this.planForm
            }
            this.editPrearranged(data).then((suc) => {
              this.getPlanData()
              this.addPlanMod = false
              this.successMsg('警情类型修改成功')
            }).catch((err) => {
              const msg = {
                name: '警情类型名称已存在'
              }
              if (err.response.data) {
                Object.keys(err.response.data).forEach(n => {
                  msg[n] && this.errorMsg(msg[n])
                })
              }
              console.log('logout error:' + err)
            })
          }
        }
      })
      this.buttonTimer = setTimeout(() => {
        this.buttonTimer = null
      }, 300)
    },
    // 3-1-1.预案管理添加/修改取消
    PlanCancel(name) {
      this.$refs[name].resetFields()
      this.planForm = {
        name: '',
        content: ''
      }
      this.addPlanMod = false
    },
    // 3-2.预案管理修改
    editPlan(index) {
      // 非点击-取消-关闭窗口 清除错误信息
      this.$refs['planForm'].resetFields()
      this.planModTitle = '修改警情类型'
      this.addPlanMod = true
      this.addEdit = 'edit'
      this.editPlanIndex = index
      this.planForm = JSON.parse(JSON.stringify(this.PlanData[index]))
    },
    // 3-3.预案管理删除
    delPlan(index) {
      this.planIndex = index
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除吗?</p>',
        onOk: () => {
          this.delOk('plane')
        }
      })
    },
    // 4.警笛/预案删除确认处理
    delOk(delType) {
      if (delType === 'voice') {
        let voiceId = this.policeData[this.fileIndex]._id
        this.delPoliceFile(voiceId).then((suc) => {
          this.getPoliceData()
          this.successMsg('删除成功')
        }).catch((err) => {
          console.log('logout error:' + err)
          if (this.tipErrorConfig.show) {
            this.$Notice.error({
              title: '警告',
              desc: '删除失败',
              duration: this.tipErrorConfig.dur,
              top: 200
            })
          }
        })
      } else {
        let planId = this.PlanData[this.planIndex]._id
        this.delPrearranged(planId).then((suc) => {
          this.getPlanData()
          this.successMsg('删除成功')
        }).catch((err) => {
          console.log('logout error:' + err)
          if (this.tipErrorConfig.show) {
            this.$Notice.error({
              title: '警告',
              desc: '删除失败',
              duration: this.tipErrorConfig.dur,
              top: 200
            })
          }
        })
      }
    },
    cancel() {
      this.$refs['addFileData'].resetFields()
      this.$refs['rankEditForm'].resetFields()
      this.skimMod = false
      this.editRankMod = false
      this.addFileMod = false
    },
    handleFormatError(file) {
      if (this.tipWarningConfig.show) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件 ' + file.name + ' 格式不正确，请上传 mp3 格式的音乐。',
          duration: this.tipWarningConfig.dur,
          top: 200
        })
      }
    },
    handleMaxSize(file) {
      if (this.tipWarningConfig.show) {
        this.$Notice.warning({
          title: '超出文件大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 4M。',
          duration: this.tipWarningConfig.dur,
          top: 200
        })
      }
    },
    // 级别分页
    rankPageChange(page) {
      this.rankPageCur = page
      this.rankStartNum = this.pageLimitJB * (page - 1)
      this.rankEndNum = this.rankStartNum + this.pageLimitJB
      this.getLevelData(this.rankStartNum, this.rankEndNum)
    },
    voicePageChange(page) {
      this.plicePageCur = page
      this.getPoliceData()
    },
    audioPageSizeChange(n) {
      this.audiopageLimit = n
      this.getPoliceData()
    },
    planPageChange(page) {
      this.planPageCur = page
      this.getPlanData()
    },
    planPageSizeChange(n) {
      this.planpageLimit = n
      this.getPlanData()
    },
    // 获取警情处理
    getAlarmDeal() {
      const payload = {
        type: 'alarm',
        page: this.alarmDealPageCur,
        limit: this.alarmDealLimit
      }
      this.getAlarmDealSetList(payload).then((res) => {
        this.alarmDealData = JSON.parse(JSON.stringify(this.alarmDealList))
        this.alarmDealTotal = Number(res.headers['x-bsc-count'])
      }).catch(err => {
        console.log('this.getUseType :' + err)
        this.errorMsg('获取警情处理失败')
      })
    },
    addAlarmDeal() {
      this.$refs['alarmDealModForm'].resetFields()
      this.alarmDealMod = true
      this.alarmDealModTitle = '添加警情处理'
      this.modName = 'add'
    },
    alarmDealCancel() {
      this.alarmDealMod = false
    },
    alarmDealOk(name) {
      if (this.buttonTimer) { return }
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.modName === 'add') {
            const payload = {
              page: 'alarm',
              name: this.alarmDealModForm.name
            }
            this.addAlarmDealSet(payload).then(() => {
              this.alarmDealMod = false
              this.getAlarmDeal()
              this.successMsg('添加警情处理成功')
            }).catch(err => {
              if (err.response.data.message) {
                this.errorMsg('警情处理名称已存在')
              }
            })
          } else {
            const payload = {
              page: 'alarm',
              name: this.alarmDealModForm.name,
              id: this.alarmDealModForm.id
            }
            this.reviseAlarmDealSet(payload).then(() => {
              this.alarmDealMod = false
              this.getAlarmDeal()
              this.successMsg('修改警情处理成功')
            }).catch(err => {
              if (err.response.data.message) {
                this.errorMsg('警情处理名称已存在')
              }
            })
          }
        }
      })
      this.buttonTimer = setTimeout(() => {
        this.buttonTimer = null
      }, 300)
    },
    // 切换页码
    alarmDealPageChange(page) {
      this.alarmDealPageCur = page
      this.getAlarmDeal()
    },
    // 分页
    alarmDealPageSizeChange(n) {
      this.alarmDealLimit = n
      this.getAlarmDeal()
    },
    // 修改警情处理
    editAlarmDeal(params) {
      this.alarmDealMod = true
      this.alarmDealModTitle = '修改警情处理'
      this.$refs['alarmDealModForm'].resetFields()
      this.modName = 'revise'
      this.alarmDealModForm.name = params.name
      this.alarmDealModForm.id = params.id
    },
    // 删除
    delAlarmDeal(params) {
      this.alarmDealModForm.id = params.id
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除吗?</p>',
        onOk: () => {
          this.deleteOk()
        }
      })
    },
    // 删除 确认
    deleteOk() {
      this.deleteAlarmDealSet(this.alarmDealModForm.id).then(suc => {
        this.successMsg('删除成功')
        this.getAlarmDeal()
      }).catch(err => {
        console.log('this.deleteFireAlarmDeal :' + err)
        this.errorMsg('删除失败')
      })
    },
    backgroundCheck(value) {
      this.colors = value
      this.rankEditForm.msgColour = this.colors.hex
      this.msgColor = value.hex
    },
    editAlarmDelay() {
      let delayDate = Number(this.alarmDelay)
      if (isNaN(delayDate) || delayDate < 0 || delayDate > 3600) {
        this.warningMsg('请输入0~3600之间的有效数字')
        return
      }
      this.setAlarmDelayData({delay: delayDate}).then(res => {
        this.successMsg('保存成功')
      }).catch(() => {
        this.warningMsg('保存失败')
      })
    }
  }
}
