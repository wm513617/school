import { mapActions } from 'vuex'
export default {
  computed: {
  },
  methods: {
    ...mapActions(['gbQueryRecordList', 'getPlatformID', 'setResource', 'concatResource', 'gbRecordOpen']),
    /**
     * 国标设备异步查询
     */
    async gbRecordQuery(param) {
      try {
        const preRes = await this.gbQuerySingle({...param, startTime: param.startTime, endTime: param.time})
        const nestRes = await this.gbQuerySingle({...param, startTime: param.time, endTime: param.endTime})
        if (!nestRes.data && !preRes.data) { return '' }
        if (preRes.data.result !== 'error' && nestRes.data.result !== 'error') {
          preRes.data.recordList = [...preRes.data.recordList, ...nestRes.data.recordList]
          preRes.data.total += nestRes.data.total
          return preRes.data
        } else if (preRes.data.result !== 'error') {
          return preRes.data
        } else if (nestRes.data.result !== 'error') {
          return nestRes.data
        }
        return ''
      } catch (error) {
        console.log(error)
        return ''
      }
    },
    /**
    * 单个录像查询
    */
    async gbQuerySingle(param) {
      const serverId = await this.getPlatformID(param.shareServer)
      let queryParam = {
        recordType: param.eventType.length > 1 ? 'event' : param.eventType[0],
        gbPlaDevIp: serverId.ip, // 设备ip,
        gbPlaDevPort: serverId.port, // 设备端口,
        parentId: serverId.serverId, // 国标平台id,
        childId: param.childId, // 国标设备id,
        streamType: 'main',
        channel: param.channel,
        startTime: param.startTime,
        endTime: param.endTime
      }
      return this.gbQueryRecordList(queryParam)
    },
    /**
     * 下联设备播放
     */
    async gbOpen(param, { startTime, endTime }, index) {
      param = param.queryParam
      const serverId = await this.getPlatformID(param.shareServer)
      const openParam = {
        gbPlaDevIp: serverId.ip,
        gbPlaDevPort: serverId.port,
        parentId: serverId.serverId,
        childId: param.childId,
        channel: param.channel,
        startTime,
        endTime,
        streamType: 'main'
      }
      try {
        const state = await this.plugins[index].gbOpen(openParam)
        let wallData = this.$refs.playbackVideo.wallData[this.plugin.activedIndex]
        if (wallData) { // 上墙开流
          this.gbVodOpen({ param: openParam, time: startTime }, wallData)
        }
        if (state === 0) {
          if (!this.isSync) {
            this.avtiveChange(index)
            this.changeTimeline()
          }
          return true
        } else {
          this.errorMsg('播放失败, 错误码' + state)
          return false
        }
      } catch (e) {
        this.errorMsg(e)
        return false
      }
    },
    // 国标快速回放上墙
    async gbVodOpen({ time, param }, wallData) {
      // 根据当前镜头设置国标回放上墙和平台ID所需的参数
      if (!param) {
        const info = this.resourceList[this.activedIndex]
        param = JSON.parse(JSON.stringify(info))
      }
      if (!param) { return false }
      // 获取平台ID
      const serverId = await this.getPlatformID(param.queryParam.shareServer)
      const openParam = {
        gbPlaDevIp: serverId.ip,
        gbPlaDevPort: serverId.port,
        parentId: serverId.serverId,
        childId: param.queryParam.childId,
        channel: param.queryParam.channel,
        startTime: time,
        endTime: parseInt(new Date().getTime() / 1000),
        streamType: 'main'
      }
      // 国标回放开流
      let res = await this.gbRecordOpen(openParam)
      if (!res || !res.data) { return }
      res = res.data
      if (wallData) {
        wallData.devCtl.tsIp = res.TsIp
        wallData.devCtl.tsPort = res.TsPort
        wallData.devCtl.streamIdLong = +res.streamId
        // 上墙
        this.frontVod(wallData)
      } else {
        return res
      }
    }
  },
  beforeDestroy() { }
}
