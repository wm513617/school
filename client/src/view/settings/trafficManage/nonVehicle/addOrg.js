export default {
  data() {
    const verifyName = (rule, value, callback) => {
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
    const verifyNumber = (rule, value, callback) => {
      let r = /(^[1-9]([0-9]*)$|^[0-9]$)/
      if (value === '') {
        return callback(new Error('不可以为空'))
      }
      if (r.test(value)) {
        if (Number(value) > 65535) {
          return callback(new Error('超过最大值'))
        } else {
          callback()
        }
      } else {
        return callback(new Error('请输入有效数字'))
      }
    }
    const noSpace = (rule, value, callback) => {
      let r = /\s+/g
      if (r.test(value)) {
        return callback(new Error('不可以输入空格！'))
      } else {
        callback()
      }
    }
    return {
      formData: {
        code: '', // 机构编号
        name: '' // 机构名称
      },
      orgFormRole: { // 验证规则
        name: [
          { required: true, message: '不可以为空', trigger: 'change' },
          { validator: noSpace, trigger: 'change' },
          { validator: verifyName, trigger: 'change' }
        ],
        code: [{ required: true, validator: verifyNumber, trigger: 'change' }]
      }
    }
  },
  methods: {
    orgCancel() { // 取消
      this.$refs.treebox.orgCancel() // 关闭弹窗
      this.$refs.orgFormData.resetFields() // 清空form表单内容
    },
    orgSave() { // 确认
      this.$refs.orgFormData.validate(valid => { // form表单验证成功
        if (valid) {
          this.$refs.treebox.save(this.formData) // 调接口
        }
      })
    }
  }
}
