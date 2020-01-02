/*
 * 此文件用于存在预案的情况下  设定定时器去刷新场景
 */
export default {
  computed: {
    selectedPlan() {
      if (this.tvwall.selectedplan) {
        return this.$lodash.find(this.tvwall.plans, item => item._id === this.tvwall.selectedplan)
      }
      return null
    }
  },
  watch: {
    tvwall() {
      this.handle()
    }
  },
  methods: {
    getNowTime() {
      const today = new Date()
      const now = new Date()
      today.setHours(0)
      today.setMinutes(0)
      today.setSeconds(0)
      return Math.ceil((now.getTime() - today.getTime()) / 1000)
    },
    addTimers() {
      this.timerList = []
      const info = this.selectedPlan.info
      const time = this.getNowTime()
      if (info && info.length) {
        info.forEach(item => this.addTimer(item, time))
      }
    },
    addTimer(info, time) {
      const delay = info.start - time
      if (delay < 1) {
        return
      }
      this.timerList.push(setTimeout(() => {
        this.refresh()
      }, delay * 1000))
    },
    clearTimers() {
      if (this.timerList) {
        this.timerList.forEach(id => {
          clearTimeout(id)
        })
      }
    },
    refresh() {
      this.commonAPIHandle(this.getTVList(), '', 'getTVList')
    },
    handle() {
      if (this.selectedPlan) {
        this.addTimers()
      } else {
        this.clearTimers()
      }
    }
  },
  created() {
    this.handle()
  }
}
