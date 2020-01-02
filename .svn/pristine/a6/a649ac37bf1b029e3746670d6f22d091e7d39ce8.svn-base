export default {
  data() {
    return {
      isCapPause: false,
      capImg: ''
    }
  },
  methods: {
    async capPause() {
      const src = await this.getCap()
      this.pause()
      if (src) {
        this.capImg = src
        this.isCapPause = true
      }
    },
    getCap() {
      return new Promise(resolve => {
        let src = ''
        let i = 5
        while (i-- && !src) {
          src = this.getCapture()
        }
        resolve(src)
      })
    },
    capResume() {
      this.resume()
      this.isCapPause = false
      this.capImg = ''
    },
    // 【业务管理】-【案件处理】
    // 要求在时间标记内显示画面，非标记内显示截图（视频遮盖）
    // 只管禁音，不管开音
    // 遮盖 + 禁音
    async caseProcessCover() {
      // console.log('遮盖')
      const src = await this.getCap()
      if (src) {
        this.capImg = src
        this.isCapPause = true
        this.closeSound()
      }
    },
    // 恢复显示
    caseProcessShow() {
      // console.log('恢复显示')
      this.isCapPause = false
      this.isSyncPause = false
      this.capImg = ''
      // 回放的逻辑有问题
      /**
       * 回放的逻辑有问题
       * stop()后又调了syncPause()
       * 使isSyncPause = true
       * 打开视频遮盖
       * 强行解决
       */
      let _timer = setInterval(() => {
        if (this.isSyncPause) {
          this.isSyncPause = false
          clearInterval(_timer)
        }
      }, 50)
      setTimeout(() => {
        clearInterval(_timer)
      }, 500)
    }
  }
}
