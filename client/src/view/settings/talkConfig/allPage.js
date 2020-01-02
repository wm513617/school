export default {
  data() {
    const nameRule = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        return callback(new Error('不能为空'))
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
    const speakIdRule = (rule, value, callback) => {
      if (value) {
        let r = /^[0-9]+$/
        if (r.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入有效数字'))
        }
      } else {
        return callback(new Error('不能为空'))
      }
    }
    const talkIpRule = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('不能为空'))
      } else {
        return callback()
      }
    }
    return {
      data: '',
      alarmRule: {
        name: [{
          required: true,
          validator: nameRule,
          trigger: 'blur'
        }],
        username: [{
          required: true,
          validator: nameRule,
          trigger: 'blur'
        }],
        ip: [{
          required: true,
          message: 'ip地址不能为空',
          trigger: 'blur'
        }],
        talkIp: [{
          required: true,
          validator: talkIpRule,
          trigger: 'blur'
        }],
        password: [{
          required: true,
          validator: nameRule,
          trigger: 'blur'
        }],
        serise: [{
          required: true,
          validator: speakIdRule,
          trigger: 'blur'
        }],
        dsServer: [{
          required: true,
          message: '存储服务器不能为空',
          trigger: 'blur'
        }],
        dsPath: [{
          required: true,
          message: '存储路径不能为空',
          trigger: 'blur'
        }]
      },
      configTopList: [{
        name: '对讲台麦',
        isActive: true,
        roleTabs: 'centerModel'
      }, {
        name: '对讲终端',
        isActive: false,
        roleTabs: 'boxModel'
      }],
      configBottomList: [{
        name: '对讲服务器配置',
        isActive: false,
        roleTabs: 'serverModel'
      }],
      centreOffring: true
    }
  },
  methods: {
    leftTopBoxActive(config) {
      if (config.roleTabs === 'centerModel') {
        this.configTopList[0].isActive = true
        this.configTopList[1].isActive = false
        this.configBottomList[0].isActive = false
        this.centreOffring = true
      } else if (config.roleTabs === 'boxModel') {
        this.configTopList[0].isActive = false
        this.configTopList[1].isActive = true
        this.configBottomList[0].isActive = false
      }
    },
    // 服务器配置面板
    isNowPathActive() {
      this.configTopList[0].isActive = false
      this.configTopList[1].isActive = false
      this.configBottomList[0].isActive = true
    }
  }
}
