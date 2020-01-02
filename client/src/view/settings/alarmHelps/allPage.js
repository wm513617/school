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
        let r = /(^[1-9]([0-9]*)$|^[0-9]$)/
        if (r.test(value)) {
          if (Number(value) > 10000) {
            return callback(new Error('超过最大值10000'))
          } else {
            return callback()
          }
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
        talkId: [{
          required: true,
          validator: speakIdRule,
          trigger: 'blur'
        }]
      },
      configTopList: [{
        name: '接警中心',
        path: '/settings/alarmHelps/center',
        isActive: true,
        roleTabs: 'centerModel',
        vIf: 'BS-ALARMHELP-CENTER-PAGE',
        vIfC: 'BS-ALARMHELP-CENTER-CONF'
      }, {
        name: '报警终端',
        path: '/settings/alarmHelps/terminal',
        isActive: false,
        roleTabs: 'boxModel',
        vIf: 'BS-ALARMHELP-TERMINAL-PAGE',
        vIfC: 'BS-ALARMHELP-TERMINAL-CONF'
      }],
      configBottomList: [{
        name: '服务器配置',
        path: '/settings/alarmHelps/server',
        isActive: false,
        roleTabs: 'serverModel',
        vIf: 'BS-ALARMHELP-SERVER-PAGE',
        vIfC: 'BS-ALARMHELP-SERVER-CONF'
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
        this.$router.replace(config.path)
        this.centreOffring = true
        this.getAlarmCenterData()
      } else if (config.roleTabs === 'boxModel') {
        this.configTopList[0].isActive = false
        this.configTopList[1].isActive = true
        this.configBottomList[0].isActive = false
        this.$router.replace(config.path)
      }
    },
    // 服务器配置面板
    isNowPathActive() {
      this.configTopList[0].isActive = false
      this.configTopList[1].isActive = false
      this.configBottomList[0].isActive = true
      this.$router.replace(this.configBottomList[0].path)
    }
  }
}
