import {
  AV_RECORD_LIST
} from 'http/video.api'
const fakeParam = false
export default {
  props: {
    channels: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      videosCopy: [],
      videosTimeinfo: []
    }
  },
  methods: {
    dealWithList(list = [], time, endTime) {
      if (list.length) {
        const item = list[0]
        if (item.evtTblInfo.startTime <= time && time < item.evtTblInfo.endTime) {
          item.evtTblInfo.startTime = time
          if (endTime < item.evtTblInfo.endTime) {
            item.evtTblInfo.endTime = endTime
          }
        }
      }
      return list
    }
  },
  created() {
    let list = this.channels
    if (fakeParam) {
      list = [{}]
    }
    list.forEach(async(item, index) => {
      const param = {
        ...item,
        typeName: '',
        typeContent: '',
        rows: 50,
        page: 1
      }
      if (fakeParam) {
        param.startTime = 1527822581
        param.endTime = param.startTime + 40
        param.devIp = '192.168.7.152'
        param.devPort = 3721
        param.channel = 1
      }
      let result = await AV_RECORD_LIST(param).catch(e => {
        console.log('door query error', e)
      })
      if (!result) {
        return
      }
      result = result.data.result
      if (result && result.total) {
        result.eventList = this.dealWithList(result.eventList, param.startTime, param.endTime)
        const info = result.eventList[0]
        this.$set(this.videosCopy, index, {
          startTime: info.evtTblInfo.startTime,
          endTime: info.evtTblInfo.endTime,
          strmInfo: info.strmInfo,
          dsIp: result.dsIp,
          dsPort: result.dsPort
        })
        this.$set(this.videosTimeinfo, index, {
          startTime: info.evtTblInfo.startTime,
          endTime: info.evtTblInfo.endTime
        })
      }
    })
  }
}
