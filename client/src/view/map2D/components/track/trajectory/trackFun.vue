<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      picInfo: {},
      showModel: '0'
    }
  },
  computed: {
    ...mapGetters('map2DApplyIX', [
      'faceHistoryTrackNodes' // 人像历史轨迹节点数组
    ])
  },
  methods: {
    ...mapActions('map2DApplyIX', [
      'setFaceHistoryTrackNodes' // 设置人像历史轨迹节点数据
    ]),
    changeShowModel(node) {
      const nodeInfo = {
        pointId: node.pointId, // 设备标识
        faceImage: node.info.faceImage, // 最新经过抓拍图片地址
        timestamp: node.info.timestamp, // 时间戳
        time: node.info.time, // 时间
        isTrackShow: true // 区分轨迹头像 为true时不显示以图搜图按钮
      }
      if (node.trackType === '2') {
        nodeInfo.resName = node.info.name // 设备名称 卡口
        nodeInfo.plateInfo = node.info.plateInfo // 车牌号码
        nodeInfo.vehicleSpeed = node.info.vehicleSpeed // 过车速度
        nodeInfo.vehicleType = node.info.vehicleType // 车型
        nodeInfo.plateType = node.info.plateType // 车辆品牌
        nodeInfo.vehicleColor = node.info.vehicleColor // 车辆颜色
        nodeInfo.limitSpeed = node.info.limitSpeed // 限制速度
        nodeInfo.faceImage = node.info.vehiclePic // 最新经过抓拍图片地址
      } else if (!node.trackType || node.trackType === '1') {
        nodeInfo.resName = node.info.resName // 设备名称 卡口
        nodeInfo.fullImage = node.info.fullImage // 全景图
        nodeInfo.similar = node.info.similar // 相似度
        nodeInfo.age = node.info.age // 年龄
        nodeInfo.gender = node.info.gender // 性别
        nodeInfo.resIp = node.info.resIp // 视频IP
        nodeInfo.resPort = node.info.resPort // 视频端口
        nodeInfo.resChannel = node.info.resChannel // 视频通道
        nodeInfo.faceImage = node.info.faceImage // 最新经过抓拍图片地址
      }
      this.picInfo = nodeInfo
      this.showModel = node.trackType || '1'
      setTimeout(() => {
        this.currentPopupTop(node)
      }, 500)
    },
    currentPopupTop(node) {
      const trackNodes = node.isFaceTrack ? this.drawTrack.lineNodes : this.faceHistoryTrackNodes
      const lineNodes = []
      trackNodes.forEach((item, index) => {
        if (item.pointId !== node.pointId) {
          lineNodes.push(item)
        } else {
          lineNodes.unshift(item)
        }
      })
      if (!lineNodes || !lineNodes.length) { return }
      if (node.isFaceTrack) {
        this.drawTrack.lineNodes = []
        this.$nextTick(() => {
          lineNodes && lineNodes.length && this.drawTrack.addTrackNodes(lineNodes)
        })
      } else {
        this.setFaceHistoryTrackNodes([])
        this.$nextTick(() => {
          this.setFaceHistoryTrackNodes(lineNodes)
        })
      }
    }
  }
}
</script>
