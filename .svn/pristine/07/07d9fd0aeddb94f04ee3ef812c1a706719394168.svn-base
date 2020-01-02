/** 坐席选择 */
<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapState({
      isCall: ({ phone }) => phone.isCall,
      selectedMobile: ({ phone }) => phone.selectedMobile,
      currentSeat: ({ phone }) => phone.currentSeat,
      freeSeatList: ({ phone }) => phone.freeSeatList,
      prefix: ({ phone }) => phone.prefix
    })
  },
  methods: {
    ...mapActions('phone', ['setPhoneCall', 'setFreeSeatList', 'setSeatList', 'setSeatListShow', 'setPhoneNum', 'getSeatList', 'postDial', 'setCurrentSeat', 'postHangup', 'setSeatPrefix', 'setUpdateMill']),
    showWarning(msg) {
      this.$Notice.warning({
        title: '提示',
        desc: msg,
        duration: 3
      })
    },
    querySeatList(event) {
      if (this.isCall && this.selectedMobile !== event.currentTarget.id) {
        return
      }
      this.eventOperation(event)
    },
    eventOperation(event) {
      console.log('event.currentTarget.id' + event.currentTarget.id)
      this.setPhoneNum(event.currentTarget.id || '')
      let prefixValue = '1' // 提供给后台判断当前电话类型     手机/座机（后天加两位前缀）  1     分机（后台加一位前缀）  2    自定义电话（后台不用加前缀） 3
      if (event.currentTarget.seatPrefix && event.currentTarget.seatPrefix === 'extension') { prefixValue = '2' }
      this.setSeatPrefix(prefixValue)
      if (this.isCall) {
        this.postHangup({ extension: this.currentSeat }).then(result => {
          if (result.data.status === 'true') {
            this.setPhoneCall(false)
          } else {
            this.errorMsg(result.data.resultText)
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.getSeatLists()
      }
    },
    getSeatLists(flag) {
      const self = this
      this.getSeatList().then(result => {
        console.log('坐席列表获取成功')
        self.setSeatList(result.data || [])
        self.setFreeSeatList(result.data || [])
        if (!flag) {
          if (self.freeSeatList && self.freeSeatList.length > 1) {
            self.setSeatListShow(true)
          } else if (self.freeSeatList && self.freeSeatList.length === 1) {
            const param = {
              extension: self.freeSeatList[0].extension,
              phone: self.selectedMobile,
              prefix: self.prefix
            }
            if (!self.selectedMobile || !self.freeSeatList[0].extension || !self.prefix) {
              return self.showWarning('请重新选择电话号码或分机进行拨号')
            }
            self.postDial(param).then(result => {
              if (result.data.status === 'true') {
                self.setUpdateMill()
                self.setPhoneCall(true)
                self.setCurrentSeat(self.freeSeatList[0].extension)
              } else {
                self.errorMsg(result.data.resultText)
              }
            }).catch(err => {
              console.log(err)
            })
          } else {
            self.showWarning('当前无空闲坐席')
          }
        }
      }).catch(err => {
        console.log(err.response.data.message)
        self.errorMsg('获取坐席列表失败')
      })
    }
  }
}
</script>
