export default {
  methods: {
    commonAPIHandle(pro, msg, name = '') {
      return pro
        .then(suc => {
          if (msg) {
            this.$Notice.success({
              title: '提示',
              desc: msg + '成功',
              duration: 2
            })
          }
          return Promise.resolve(suc)
        })
        .catch(error => {
          console.log(name + ' error:', error)
          this.$Notice.error({
            title: '错误',
            desc: `${error.response.data.message}`
          })
          return Promise.reject(error)
        })
    },
    confirmModal(msg) {
      return new Promise(resolve => {
        this.$Modal.confirm({
          title: '提示',
          content: msg,
          onOk: () => resolve(true),
          onCancel: () => resolve(false)
        })
      })
    }
  }
}
