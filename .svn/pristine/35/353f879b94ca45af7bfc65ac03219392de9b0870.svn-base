<!--应用模式 人脸轨迹逻辑-->
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  data() {
    return {
      trackColorArr: ['rgba(208, 2, 27, 0.75)', 'rgba(255, 165, 0, 0.75)', 'rgba(0, 0, 255, 0.75)', 'rgba(238, 130, 238, 0.75)', 'rgba(255, 255, 255, 0.75)'],
      defaultLoc: ['12946848.851590045,4861197.91792546', '12946868.851590045,4861197.91792546', '12946888.851590045,4861197.91792546', '12946908.851590045,4861197.91792546', '12946928.851590045,4861197.91792546'],
      defaultLoc1: ['12946923.2380944,4861575.916992225', '12947177.153954733,4861464.60282265', '12947355.002923237,4861352.791916832', '12947514.021397779,4861172.771312339', '12947838.527593676,4861510.7175879255']
    }
  },
  computed: {
    ...mapState({
      selectedFaceAlarmArr: ({ fengMapAlarm }) => fengMapAlarm.selectedFaceAlarmArr // 选中的人脸报警数据数组
    }),
    ...mapGetters('fengMap', ['fmapShowTrackModal', 'fmapShowDrawTrack'])
  },
  watch: {
    selectedFaceAlarmArr: {
      handler(newArr, oldArr) {
        this.deleteFaceHeadDatas('alarmTrack')
        this.deleteLineRealTrackLoc('alarmTrack')
        newArr && newArr.length && this.drawSelectedFaceTrack(newArr) // 绘制选择的人脸报警轨迹
      },
      deep: true
    },
    fmapShowTrackModal(flag) { // 是否显示轨迹查询弹框状态
      if (flag) { // 显示弹框时
        this.SET_SELECTED_FACE_ALARM_MAP(new Map())
      }
    },
    fmapShowDrawTrack(flag) {
      if (!flag) { // 不显示轨迹时
        this.SET_SELECTED_FACE_ALARM_MAP(new Map())
      }
    }
  },
  methods: {
    ...mapMutations('fengMapAlarm', ['HANDLE_REPEAT_FACE_HEAD_NODES', 'SET_SELECTED_FACE_ALARM_MAP']),
    ...mapActions(['getUserTrackCondition']),
    ...mapActions('fengMapLine', ['setLineRealTrackLoc', 'deleteLineRealTrackLoc']),
    ...mapActions('fengMapFace', ['setFaceHeadDatas', 'addFaceHeadDatas', 'deleteFaceHeadDatas']),
    drawSelectedFaceTrack(faceAlarmArr) { // 绘制选择的人脸报警轨迹
      for (let index = 0; index < faceAlarmArr.length; index++) {
        let faceAlarm = faceAlarmArr[index]
        if (faceAlarm.isOpenTrail) {
          this.controlFaceRealTrackShow(faceAlarm, index) // 控制人脸实时轨迹显示
        }
      }
    },
    controlFaceRealTrackShow(selectedFaceAlarm, index) { // 控制人脸实时轨迹显示
      let { userId, time } = selectedFaceAlarm
      let query = {userId: userId, beginTime: time, isdefense: true}
      this.getUserTrackCondition(query).then(res => {
        console.log('检索到人脸报警实时轨迹数据：', res.data)
        res.data[0].res.point.loc = this.defaultLoc[index]
        if (!res.data[1]) {
          res.data[1] = JSON.parse(JSON.stringify(res.data[0]))
        }
        res.data[1].res.point.loc = this.defaultLoc1[index]
        const time = new Date().getTime()
        this.getFaceRealTrackLineCoords(res.data, index, time) // 获取人脸实时轨迹坐标数据
        this.getFaceRealTrackNodes(res.data, index, time) // 获取人脸实时轨迹节点数据
      }).catch(() => {
        console.log('search face trackList err')
      })
    },
    getFaceRealTrackLineCoords(records, index, time) { // 获取人脸实时轨迹坐标数据
      let lineCoords = []
      for (const item of records) {
        if (item.res && item.res.point) {
          let point = item.res.point
          let coord = this.getPointCoordinates(point)
          if (coord && coord.length > 0) {
            lineCoords = lineCoords.concat(coord)
          }
        }
      }
      if (lineCoords && lineCoords.length > 0) {
        let recordItem = records[records.length - 1]
        this.setLineRealTrackLoc({ points: lineCoords.toString(), type: 'alarmTrack_' + recordItem.time + '_' + recordItem.userId + '_' + time, drawStyle: { color: this.trackColorArr[index] } }) // 设置轨迹坐标数组
      }
    },
    getFaceRealTrackNodes(records, index, time) { // 获取人脸实时轨迹节点数据
      if (records && records.length > 0) {
        let recordItem = records[records.length - 1]
        if (recordItem.res) {
          let pointId = recordItem.res._id
          let point = recordItem.res.point
          if (point) {
            let coord = this.getPointCoordinates(point) // 获取点位坐标
            let faceHead = {
              id: 'alarmTrack_' + recordItem.time + '_' + recordItem.userId + '_' + time,
              userId: recordItem.userId,
              borderColor: this.trackColorArr[index],
              fontColor: this.trackColorArr[index],
              userImage: recordItem.userImage,
              coordinates: coord,
              userName: recordItem.userName,
              pointId: pointId,
              pointName: recordItem.resName,
              faceType: 'alarmTrack'
            }
            this.addFaceHeadDatas(faceHead)
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
  }
}
</script>
