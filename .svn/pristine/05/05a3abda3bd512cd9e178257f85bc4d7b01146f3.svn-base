<!--应用模式 人脸轨迹逻辑-->
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import DrawTrack from './DrawTrack'
export default {
  data() {
    return {
      faceTrackNodes: [], // 人脸轨迹节点
      faceHeadIcons: [], // 人脸轨迹节点
      trackColorArr: ['rgba(208, 2, 27, 0.75)', 'rgba(255, 165, 0, 0.75)', 'rgba(0, 0, 255, 0.75)', 'rgba(238, 130, 238, 0.75)', 'rgba(255, 255, 255, 0.75)'],
      trackArrowImgArr: ['/static/image/map/arrow1.png', '/static/image/map/arrow2.png', '/static/image/map/arrow3.png', '/static/image/map/arrow4.png', '/static/image/map/arrow5.png']
    }
  },
  computed: {
    ...mapState({
      faceHeads: ({ mapAlarm }) => mapAlarm.faceHeads, // 人脸头像数组
      faceHeadMap: ({ mapAlarm }) => mapAlarm.faceHeadMap, // 人脸头像map
      pointFaceNodeMap: ({ mapAlarm }) => mapAlarm.pointFaceNodeMap, // 人脸点位节点map(key: 人脸设备点位标识， value：对应点位的人脸头像数组)
      faceTrackDrawMap: ({ mapAlarm }) => mapAlarm.faceTrackDrawMap, // 人脸轨迹绘制轨迹map（key：用户标识，value: 对应的绘制工具）
      selectedFaceAlarmArr: ({ mapAlarm }) => mapAlarm.selectedFaceAlarmArr // 选中的人脸报警数据数组
    })
  },
  watch: {
    selectedFaceAlarmArr: {
      handler(newArr, oldArr) {
        this.SET_FACE_HEAD_MAP(new Map())
        this.SET_POINT_FACE_NODE_MAP(new Map())
        this.refreshFaceDrawTrack(newArr) // 刷新人脸绘制工具
        this.drawSelectedFaceTrack(newArr) // 绘制选择的人脸报警轨迹
      },
      deep: true
    },
    faceHeads: {
      handler(newArr) {
        // console.log('人脸头像数据：', JSON.parse(JSON.stringify(newArr)))
        this.faceHeadIcons = JSON.parse(JSON.stringify(newArr))
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations('mapAlarm', ['SET_FACE_TRACK_DRAW_MAP', 'SET_SELECTED_FACE_ALARM_MAP', 'SET_FACE_HEAD_MAP', 'UPDATE_FACE_HEAD_MAP', 'SET_POINT_FACE_NODE_MAP', 'UPDATE_POINT_FACE_NODE_MAP', 'HANDLE_REPEAT_FACE_HEAD_NODES']),
    ...mapActions(['getUserTrackCondition']),
    refreshFaceDrawTrack(faceAlarmArr) { // 刷新人脸绘制工具
      for (let oldDrawTrack of this.faceTrackDrawMap.values()) { // 便利绘制工具，清空之前的绘制
        oldDrawTrack.clearTrack && oldDrawTrack.clearTrack()
      }
      // 设置轨迹绘制工具与人员绑定
      let drawTrackMap = new Map()
      for (let index = 0; index < faceAlarmArr.length; index++) {
        let faceAlarm = faceAlarmArr[index]
        let params = { ol: this.$context2D.ol, map: this.$context2D.map, id: faceAlarm.userId, trackColor: this.trackColorArr[index], arrowImg: this.trackArrowImgArr[index] }
        let drawTrack = new DrawTrack(params)
        drawTrackMap.set(faceAlarm.userId, drawTrack)
      }
      this.SET_FACE_TRACK_DRAW_MAP(drawTrackMap)
    },
    drawSelectedFaceTrack(faceAlarmArr) { // 绘制选择的人脸报警轨迹
      for (let index = 0; index < faceAlarmArr.length; index++) {
        let faceAlarm = faceAlarmArr[index]
        if (faceAlarm.isOpenTrail) {
          this.controlFaceRealTrackShow(faceAlarm) // 控制人脸实时轨迹显示
        }
      }
    },
    controlFaceRealTrackShow(selectedFaceAlarm) { // 控制人脸实时轨迹显示
      let { userId, time } = selectedFaceAlarm
      let query = {userId: userId, beginTime: time, isdefense: true}
      this.getUserTrackCondition(query).then(res => {
        console.log('检索到人脸报警实时轨迹数据：', res.data)
        let drawTrack = this.faceTrackDrawMap.get(userId)
        if (drawTrack) {
          this.getFaceRealTrackLineCoords(res.data, drawTrack) // 获取人脸实时轨迹坐标数据
          this.getFaceRealTrackNodes(res.data, drawTrack) // 获取人脸实时轨迹节点数据
        }
      }).catch(() => {
        console.log('search face trackList err')
      })
    },
    getFaceRealTrackLineCoords(records, drawTrack) { // 获取人脸实时轨迹坐标数据
      let lineCoords = []
      for (const item of records) {
        if (item.res && item.res.point) {
          let point = item.res.point
          let coord = this.getPointCoordinates(point)
          if (coord && coord.length > 0) {
            lineCoords.push(coord)
          }
        }
      }
      if (lineCoords && lineCoords.length > 0) {
        drawTrack.drawTrackLine(lineCoords)
      }
    },
    getFaceRealTrackNodes(records, drawTrack) { // 获取人脸实时轨迹节点数据
      if (records && records.length > 0) {
        let recordItem = records[records.length - 1]
        if (recordItem.res) {
          let pointId = recordItem.res._id
          let point = recordItem.res.point
          if (point) {
            let coord = this.getPointCoordinates(point) // 获取点位坐标
            let faceHead = { id: 'face_' + recordItem.time + '_' + recordItem.userId + '_' + new Date().getTime(), userId: recordItem.userId, borderColor: drawTrack.trackColor, userImage: recordItem.userImage, coordinates: coord, userName: recordItem.userName, pointId: pointId, pointName: recordItem.resName, isTrack: true }
            // 设置点位标识和人员头像数组的绑定关系
            let pointNodes = this.pointFaceNodeMap.has(pointId) ? this.pointFaceNodeMap.get(pointId) : []
            pointNodes = pointNodes.filter(item => item.userId !== faceHead.userId)
            // console.log('pointNodes: ', JSON.parse(JSON.stringify(pointNodes)))
            // console.log('pointNodes after filter: ', JSON.parse(JSON.stringify(pointNodes)))
            pointNodes.push(faceHead)
            // console.log('pointNodes after push: ', JSON.parse(JSON.stringify(pointNodes)))
            let pointNodesEntry = { pointId: pointId, pointNodes: JSON.parse(JSON.stringify(pointNodes)) }
            this.UPDATE_POINT_FACE_NODE_MAP(pointNodesEntry)
            let [...pointNodesArr] = this.pointFaceNodeMap.values()
            let nodesArr = [].concat.apply([], pointNodesArr) // 二维数组降为一维数组
            if (nodesArr && nodesArr.length === this.selectedFaceAlarmArr.length) { // 人脸节点数量等于选中报警人脸数据的数量时
              this.HANDLE_REPEAT_FACE_HEAD_NODES() // 处理重复的人脸头像
            }
          }
        }
      }
    },
    getPointCoordinates(point) { // 获取点位坐标
      let coord = [] // 点位坐标数组
      let loc = ''
      if (point.hasOwnProperty('isouter') && point.isouter) { // 楼外点位
        loc = point.loc
      } else if (point.hasOwnProperty('bid') && point.bid && point.bid.center) { // 楼内点位
        loc = point.bid.center
      }
      if (loc) {
        coord = loc.split(',').map(item => Number(item))
      }
      return coord
    }
  },
  beforeDestroy() {
    for (let faceTrackDraw of this.faceTrackDrawMap.values()) {
      faceTrackDraw.clearTrack() // 清空绘制内容
    }
    this.SET_FACE_TRACK_DRAW_MAP(new Map()) // 清空轨迹绘制工具
    this.SET_FACE_HEAD_MAP(new Map()) // 清空轨迹节点信息
    this.SET_SELECTED_FACE_ALARM_MAP(new Map()) // 清空选中的人脸报警数据
    this.SET_POINT_FACE_NODE_MAP(new Map()) // 清空人脸点位map
  }
}
</script>
