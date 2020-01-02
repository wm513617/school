import {
  toSecond,
  toHour
} from '../allJs/alarmFun.js'

export default {
  data() {
    const alarmLevelRule = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请选择报警级别'))
      } else {
        callback()
      }
    }
    const timeTemplateRule = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请选择布撤防时间'))
      } else {
        callback()
      }
    }
    const timeRule = (rule, value, callback) => {
      let r = /^\+?[0-9][0-9]*$/
      if (value === '') {
        return callback(new Error('不能为空'))
      }
      if (r.test(value) || Number(value) === 0) {
        if (Number(value) > 7200) {
          return callback(new Error('最大延时范围0s-7200s'))
        } else if (Number(value) < 1) {
          return callback(new Error('最大延时范围0s-7200s'))
        } else {
          callback()
        }
      } else {
        return callback(new Error('请输入有效数字'))
      }
    }
    const nameRule = (rule, value, callback) => {
      if (value) {
        // Unicode编码
        let strlen = 0
        for (let i = 0; i < value.length; i++) {
          if (value.charCodeAt(i) > 255) { // 如果是汉字，则字符串长度加2
            strlen += 2
          } else {
            strlen++
          }
        }
        if (strlen > 16) {
          return callback(new Error('名称不能超过16位字符'))
        } else {
          return callback()
        }
      } else {
        return callback(new Error('名称不能为空'))
      }
    }
    return {
      // 验证规则
      ruleValidate: {
        name: [{
          required: true,
          validator: nameRule,
          trigger: 'blur'
        }],
        alarmLevel: [{
          required: true,
          validator: alarmLevelRule,
          trigger: 'change'
        }],
        timeTemplate: [{
          required: true,
          validator: timeTemplateRule,
          trigger: 'change'
        }],
        maxDelay: [{
          required: true,
          validator: timeRule,
          trigger: 'blur'
        }],
        minInterval: [{
          required: true,
          validator: timeRule,
          trigger: 'blur'
        }]
      },
      classData: {
        id: '',
        status: '',
        name: '',
        alarmLevel: '',
        timeTemplate: '',
        maxDelay: '',
        minInterval: '',
        alarmAffirm: {
          status: '',
          autoAffirm: {
            status: '',
            maxDelay: 0
          },
          manualAffirm: {
            status: ''
            // continueRecord: ''
          }
        },
        actionRule: [{
          status: false,
          beginTime: '',
          endTime: '',
          actionVideo: false,
          actionOutPut: false
        }, {
          status: false,
          beginTime: '',
          endTime: '',
          actionVideo: false,
          actionOutPut: false
        }, {
          status: false,
          beginTime: '',
          endTime: '',
          actionVideo: false,
          actionOutPut: false
        }, {
          status: false,
          beginTime: '',
          endTime: '',
          actionVideo: false,
          actionOutPut: false
        }]
      },
      copyActionRule: [{
        status: false,
        beginTime: '',
        endTime: '',
        actionVideo: false,
        actionOutPut: false
      }, {
        status: false,
        beginTime: '',
        endTime: '',
        actionVideo: false,
        actionOutPut: false
      }, {
        status: false,
        beginTime: '',
        endTime: '',
        actionVideo: false,
        actionOutPut: false
      }, {
        status: false,
        beginTime: '',
        endTime: '',
        actionVideo: false,
        actionOutPut: false
      }],
      tableTitle: [{
        type: 'index',
        title: '序号'
      }, {
        title: '启用',
        key: 'status',
        render: (h, params) => {
          let status = this.tableData[params.index].status === true ? '启用' : '禁用'
          return h('span', status)
        }
      }, {
        title: '名称',
        key: 'name',
        render: (h, params) => {
          let name = this.tableData[params.index].name
          return h('span', name)
        }
      }, {
        title: '操作',
        key: 'operate',
        width: 400,
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'ghost',
                disabled: !this.$BShasPower('BS-ALARM-SORT-ACTION')
              },
              on: {
                click: () => {
                  this.editModel(params.index)
                }
              }
            }, '修改')
          ])
        }
      }],
      tableData: [],
      editClassify: false,
      inputIsShow: false,
      okStatus: false,
      useStatus: '',
      DefaultHeight: 300,
      itemIndex: '0',
      wayGroup: '',
      levelID: ''
    }
  },
  computed: {},
  methods: {
    checkstr(value) {
      let nativecode = value.split('')
      let len = 0
      let space = 0
      for (let i = 0; i < nativecode.length; i++) {
        let code = Number(nativecode[i].charCodeAt(0))
        if (code > 127) {
          len += 2
        } else {
          len++
        }
        if (code === 32) {
          space++
        }
      }
      let result = {
        len: len,
        sp: space
      }
      return result
    },
    getData() {
      this.getSortData().then((suc) => {
        this.tableData = JSON.parse(JSON.stringify(this.sortData))
        if (this.tableData.length === 0) {
          this.DefaultHeight = 300
        } else {
          this.DefaultHeight = ''
        }
      }).catch((err) => {
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
    // 进行修改前数据处理
    editModel(index) {
      this.classData = JSON.parse(JSON.stringify(this.tableData[index]))
      if (this.tableData[index].actionRule.length === 0) {
        this.classData.actionRule = this.copyActionRule
      }
      this.useStatus = String(this.classData.status)
      if ((this.classData.alarmLevel === undefined || this.classData.alarmLevel === '') && this.levelData.length !== 0) {
        this.classData.alarmLevel = this.levelData[0].level
      }
      if (this.tempData.length !== 0 && this.tempData) {
        if (this.classData.timeTemplate === undefined || this.classData.timeTemplate === '') {
          this.classData.timeTemplate = this.tempData[0]._id
        }
      }
      // 报警确认-自动确认/手工确认-状态重构
      let alarm = true // this.classData.alarmAffirm.status
      let auto = this.classData.alarmAffirm.autoAffirm.status
      if (alarm) {
        if (auto === false) {
          this.wayGroup = '手工确认'
          this.inputIsShow = true
        } else {
          this.wayGroup = '自动确认'
          this.inputIsShow = false
        }
      } else {
        this.wayGroup = ''
        this.inputIsShow = true
      }
      // 默认时间转数组
      for (let i = 0; i < this.classData.actionRule.length; i++) {
        let beginTime = this.classData.actionRule[i].beginTime
        let endTime = this.classData.actionRule[i].endTime
        this.classData.actionRule[i].timeRange = toHour(beginTime, endTime)
      }
      this.itemIndex = '0'
      this.okStatus = false
      this.editClassify = true
    },
    // 手工确认\自动确认,复选框
    showChange(checkState) {
      if (checkState === false) {
        this.wayGroup = ''
        this.inputIsShow = true
        this.classData.alarmAffirm.autoAffirm.status = false
        this.classData.alarmAffirm.manualAffirm.status = false
      }
    },
    // 选择手工确认时禁用自动确认
    showRadio(select) {
      this.classData.alarmAffirm.status = true
      if (select === '手工确认') {
        this.inputIsShow = true
        this.classData.alarmAffirm.autoAffirm.status = false
        this.classData.alarmAffirm.manualAffirm.status = true
      } else {
        this.inputIsShow = false
        this.classData.alarmAffirm.autoAffirm.status = true
        this.classData.alarmAffirm.manualAffirm.status = false
      }
    },
    // 联动规则序号
    tabIndex(item) {
      this.itemIndex = item
    },
    // 联动时间启用
    statusChange(status) {
      if (status === true) {
        this.timeStatus()
      } else {
        this.okStatus = false
      }
    },
    // 时间改变时
    editTime(time) {
      let beginTime = time[0]
      let endTime = time[1]
      let timeSec = toSecond(beginTime, endTime)
      this.classData.actionRule[this.itemIndex - 1].beginTime = timeSec[0]
      this.classData.actionRule[this.itemIndex - 1].endTime = timeSec[1]
    },
    // 时间交叉验证规则
    crossTime() {
      let timeArr = this.classData.actionRule
      let timeTrue = []
      timeArr.map((v, z) => {
        if (v.status === true) {
          timeTrue.push(z)
        }
      })
      let crossTime = []
      for (let i = 0; i < timeTrue.length; i++) {
        for (let j = 0; j < timeTrue.length; j++) {
          if (i !== j) {
            let nowBegin = timeArr[timeTrue[i]].beginTime
            let nowEnd = timeArr[timeTrue[i]].endTime
            let restBegin = timeArr[timeTrue[j]].beginTime
            let restEnd = timeArr[timeTrue[j]].endTime
            if ((nowEnd > restBegin && nowBegin < restBegin) || (nowBegin > restBegin && nowBegin < restEnd) || (nowBegin === restBegin && nowEnd === restEnd)) {
              crossTime.push(timeTrue[j])
            }
          }
        }
      }
      if (crossTime.length !== 0) {
        if (this.tipWarningConfig.show) {
          this.$Notice.warning({
            title: '警告',
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
    // 修改确认
    classifyOk(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let crossStatus = this.crossTime()
          if (crossStatus === true) {
            this.classData.maxDelay = Number(this.classData.maxDelay)
            this.classData.minInterval = Number(this.classData.minInterval)
            this.classData.status = this.useStatus === 'true' ? Boolean(1) : Boolean(0)
            this.classData.actionRule.map((v) => {
              delete v.timeRange
            })
            this.updataSort(this.classData).then(() => {
              this.getData()
            }).catch((err) => {
              console.log('logout error:' + err)
              if (this.tipErrorConfig.show) {
                this.$Notice.error({
                  title: '警告',
                  desc: '保存失败请重试',
                  duration: this.tipErrorConfig.dur,
                  top: 200
                })
              }
            })
            this.editClassify = false
          }
        }
      })
    },
    // 修改取消
    classifyCancel(name) {
      this.$refs[name].resetFields()
      this.editClassify = false
    }
  }
}
