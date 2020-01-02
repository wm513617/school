export const generateMonitorValidator = (that, type) => {
  return {
    code: [
      { required: true, message: '监视器编号不能为空', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          const err = []
          if (isNaN(value)) {
            err.push('请输入正确的监视器编号')
          } else if (value.indexOf('.') !== -1) {
            err.push('监视器编号值区间为1~999')
          } else {
            value = Number(value)
            if (value === 0 || value > 999) {
              err.push('监视器编号值区间为1~999')
            }
          }
          callback(err)
        },
        trigger: 'blur'
      }/*,
      {
        validator: (rule, value, callback) => {
          const list = that.tvs.filter((item, index) => {
            console.log(index,that.aindex,item.settle)
            return (index !== that.aindex) && item.settle
          })
          const err = []
          list.forEach(item => {
            if (value === item.code) {
              err.push('监视器编号重复')
            }
          })
          callback(err)
        },
        trigger: 'blur'
      } */
    ],
    name: [
      { required: true, message: '监视器名称不能为空', trigger: 'blur' },
      { max: 256, message: '监视器名称不得大于256个字符', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          let list = ''
          if (that.modalTitle === '添加监视器') {
            list = that.tvs.filter((item, index) => index !== that.aindex && item.settle)
          } else {
            list = that.tvs.filter((item, index) => index !== that.aindex && item.settle && item._id !== that.selectedTv._id)
          }
          const err = []
          list.forEach(item => {
            if (value === item.name) {
              err.push('监视器名称重复')
            }
          })
          callback(err)
        },
        trigger: 'blur'
      }
    ],
    ip: [{ required: true, message: '监视器IP不能为空', trigger: 'change' }],
    equipment: [{ required: true, message: '解码器不能为空', trigger: 'change' }],
    channel: [
      /* { required: true, message: '解码通道不能为空', trigger: 'change' }, */
      {
        validator: (rule, value, callback) => {
          const err = []
          if (!that.monitors) {
            return
          }
          that.monitors.filter(item => item._id !== that.monitor._id).forEach(item => {
            if (item.channel._id === value || item.channel === value) {
              err.push('通道已被其他监视器占用')
            }
          })
          callback(err)
        },
        trigger: 'change'
      }
    ]
  }
}

export const layoutValidator = {
  column: [
    { type: 'integer', message: '请输入正确的整数', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value === 0) {
          callback(new Error(['请输入正确的整数']))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    },
    { type: 'integer', max: 8, message: '最多支持8个监视器', trigger: 'blur' }
  ],
  row: [
    { type: 'integer', message: '请输入正确的整数', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value === 0) {
          callback(new Error(['请输入正确的整数']))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    },
    { type: 'integer', max: 8, message: '最多支持8个监视器', trigger: 'blur' }
  ]
}
