import { mapState, mapActions } from 'vuex'
export default {
  data() {
    const verifyName = (rule, value, callback) => {
      const nativecode = value.split('')
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
    const userNameRule = (rule, value, callback) => {
      if (/\s+/g.test(value)) {
        callback(new Error('请勿输入空格'))
      } else {
        this.lenTest(value, callback, 64)
      }
    }
    const realNameRule = (rule, value, callback) => {
      if (/\s+/g.test(value)) {
        callback(new Error('请勿输入空格'))
      } else {
        this.lenTest(value, callback, 128)
      }
    }
    const riskPwd = (rule, value, callback) => {
      if (/\s+/g.test(value)) {
        callback(new Error('请勿输入空格'))
      } else {
        this.riskPwdTest(value, callback)
      }
    }
    const pwdTest = (rule, value, callback) => {
      if (/\s+/g.test(value)) {
        callback(new Error('请勿输入空格'))
      } else {
        this.pwdSameTest(value, this.addUserForm.password, callback)
      }
    }
    const repwdTest = (rule, value, callback) => {
      if (/\s+/g.test(value)) {
        callback(new Error('请勿输入空格'))
      } else {
        this.pwdSameTest(value, this.resetForm.password, callback)
      }
    }
    const rankTest = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请选择级别'))
      } else {
        callback()
      }
    }
    return {
      passwordType: '',
      passwordLength: 5,
      passwordWeight: {
        'low': 0,
        'weak': 2,
        'middle': 3,
        'strong': 5
      },
      userValidate: {
        role: [
          { type: 'string', required: true, message: '请输入角色名', trigger: 'blur' }
        ],
        name: [
          { type: 'string', required: true, message: '请输入用户名', trigger: 'blur' },
          { validator: userNameRule, trigger: 'blur' }
        ],
        password: [
          { type: 'string', required: true, message: '请输入密码', trigger: 'blur' },
          { validator: riskPwd, trigger: 'blur' }
        ],
        repeatPwd: [
          { type: 'string', required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: pwdTest, trigger: 'blur' }
        ],
        realName: [
          { type: 'string', validator: realNameRule, trigger: 'blur' }
        ],
        rank: [
          { required: true, validator: rankTest, trigger: 'change' }
        ],
        roleName: [
          { type: 'string', required: true, message: '请输入角色名', trigger: 'blur' },
          { validator: verifyName, trigger: 'blur' }
        ],
        beginPassword: [
          { type: 'string', required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      roleValidate: {
        name: [
          { type: 'string', required: true, message: '请输入角色名', trigger: 'blur' },
          { type: 'string', validator: userNameRule, trigger: 'blur' }
        ]
      },
      pwdValidate: {
        password: [
          { type: 'string', required: true, message: '请输入密码', trigger: 'blur' },
          { validator: riskPwd, trigger: 'blur' }
        ],
        repeatPwd: [
          { type: 'string', required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: repwdTest, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      policyData: ({securityPolicy}) => securityPolicy.policyData
    })
  },
  watch: {
    policyData(val) {
      this.passwordType = this.policyData.passwordType
      this.passwordLength = parseInt(this.policyData.length)
    }
  },
  created() {
    // this.getPolicy()
  },
  methods: {
    ...mapActions([
      'getSafePolicy'
    ]),
    /**
     * 字符长度检测
     * @method lenTest
     * @param {string} value 需要验证的字段
     */
    lenTest(value, callback, length) {
      const nativecode = value.split('')
      if (nativecode.length > length) {
        callback(new Error(`不能超过${length}个字符`))
      } else {
        callback()
      }
    },
    /**
     * 密码强度检测
     * @method riskPwdTest
     * @param {string} value 需要验证的字段
     * @desc 计算当前密码的权重和设置的标准权重做比较
     *       数字=>权重1 字母=>权重2 特殊字符=>权重3 无效字符=>权重-1
     *       各类型权重相加的总权重与设置的权重做比较
     */
    riskPwdTest(value, callback) {
      // 风险密码 /^[0-9]{6, 16}$|^[A-Za-z]{5,64}$/
      // 弱密码  /^[A-Za-z0-9]{5,64}&/
      // 中密码  /^[0-9~!,.?￥、/<>{}:;""“”‘’''()@#$%^&*+_=-]{5,64}$|^[A-Za-z~!,.?￥、/<>{}:;""“”‘’''()@#$%^&*+_=-]{5,64}$/
      // 强密码  /^[A-Za-z0-9~!,.?￥、/<>{}:;""“”‘’''()@#$%^&*+_=-]{5,64}$/
      const nativecode = value.split('')
      let len = nativecode.length
      let number = 0
      let letter = 0
      let special = 0
      let Invalid = 0
      for (let i = 0; i < nativecode.length; i++) {
        if (nativecode[i].match(/[0-9]/)) {
          number = number === 0 ? 1 : 1
        } else if (nativecode[i].match(/[A-Za-z]/)) {
          letter = letter === 0 ? 2 : 2
        } else if (nativecode[i].match(/[~!,.?￥、/<>{}:;""“”‘’''()@#$%^&*+_=-]/)) {
          special = special === 0 ? 3 : 3
        } else {
          Invalid = -1
        }
      }
      if (len < 3) {
        callback(new Error('密码长度过短'))
      }
      if (len > this.passwordLength) {
        callback(new Error(`密码最大长度${this.passwordLength}位字符`))
      }
      if (Invalid === -1) {
        callback(new Error('密码中包含无效字符'))
      }
      let rank = number + letter + special
      if (rank > this.passwordWeight[this.passwordType]) {
        callback()
      } else {
        callback(new Error('密码强度太低'))
      }
    },
    /**
     * 重复密码检测
     * @method pwdTest
     * @param {string} value 需要验证的字段
     * @param {string} firstPwd 首次输入的密码
     */
    pwdSameTest(value, firstPwd, callback) {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== firstPwd) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    },
    getPolicy() {
      this.getSafePolicy().then(suc => {
        this.passwordType = this.policyData.passwordType
        this.passwordLength = parseInt(this.policyData.length)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
