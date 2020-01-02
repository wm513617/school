import { getType } from 'assets/2DMap/utils/common.js'
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState({
      alarmChangeInfo: ({ mapAlarm }) => mapAlarm.alarmChangeInfo
    }),
    ...mapGetters('fengMapApplyInteractive', ['toolsPanelActive']),
    ...mapGetters('fengMapLine', ['lineRealTrackLocMap']),
    ...mapGetters('fengMapFace', ['faceHeadMap'])
  },
  watch: {
    // toolsPanelActive() { // ----收起智能报警面板时，人像布控不清空
    //   if (this.toolsPanelActive !== 'IntelligentAlarm') {
    //     this.SET_SELECTED_FACE_ALARM_MAP(new Map())
    //   }
    // },
    alarmChangeInfo() {
      if (this.alarmChangeInfo !== 'faceAlarm' && this.alarmChangeInfo !== 'all') {
        this.SET_SELECTED_FACE_ALARM_MAP(new Map())
      }
    }
  },
  methods: {
    ...mapMutations('mapAlarm', [ 'SET_FACE_TRACK_DRAW_MAP', 'UPDATE_POINT_FACE_NODE_MAP', 'DELETE_POINT_FACE_NODE_MAP', 'HANDLE_REPEAT_FACE_HEAD_NODES', 'SET_SELECTED_FACE_ALARM_MAP' ]),
    ...mapActions('mapAlarm', ['getMachinaResource']),
    ...mapActions('fengMapLine', ['updateLineTrackLoc']),
    ...mapActions('fengMapFace', ['addFaceHeadDatas', 'clearFaceHeadDatas']),
    handlerAlarmInfo(data) {
      let dataParam = JSON.parse(JSON.stringify(data))
      if (dataParam.isdefense && dataParam.faceImage) {
        let instanceType = getType(this.lineRealTrackLocMap) // 获取Map的类型
        if (!this.lineRealTrackLocMap || instanceType !== 'Map') {
          this.updateLineTrackLoc(new Map())
        }
        if (this.lineRealTrackLocMap.has(dataParam.userId)) {
          let currentDrawTrack = this.lineRealTrackLocMap.get('faceSnap_' + dataParam.userId)
          if (currentDrawTrack) {
            let pointId = dataParam.res
            this.getMachinaResource(pointId).then(res => {
              if (res.data.point) {
                let pointCoords = res.data.point.loc.split(',').map(item => Number(item))
                console.log('设备：', res.data.point.name, 'pointCoords：', res.data.point.loc)
                let isRepeat = false // 点是否与轨迹最后一个点重复
                let trackPointNum = currentDrawTrack.points.split(',')
                if (trackPointNum > 0) {
                  if (pointCoords[0] === trackPointNum[trackPointNum - 2] && pointCoords[1] === trackPointNum[trackPointNum - 1]) {
                    isRepeat = true
                    console.log('人脸报警点位与轨迹最后一个点重复！！！')
                  }
                }
                if (!isRepeat) {
                  let time = new Date().getTime()
                  this.setLineRealTrackLoc({ points: res.data.point.loc, type: 'faceSnap_' + dataParam.time + '_' + dataParam.userId + '_' + time }) // 设置轨迹坐标数组
                  let faceHead = {
                    id: 'faceSnap_' + dataParam.time + '_' + dataParam.userId + '_' + time,
                    type: 'faceSnap_' + dataParam.userId,
                    borderColor: currentDrawTrack.drawStyle.color,
                    userImage: dataParam.userImage,
                    coordinates: pointCoords,
                    userName: dataParam.userName,
                    pointId: pointId,
                    userId: dataParam.userId,
                    pointName: dataParam.resName
                  }
                  // 先清除原来的点位标识和人员头像数组的绑定关系
                  let faceHeadMap = JSON.parse(JSON.stringify(this.faceHeadMap))
                  for (const pointId of faceHeadMap.keys()) {
                    let faceNodes = JSON.parse(JSON.stringify(faceHeadMap.get(pointId)))
                    faceNodes = faceNodes.filter(item => item.userId !== faceHead.userId)
                    if (faceNodes && faceNodes.length > 0) {
                      this.addFaceHeadDatas(JSON.parse(JSON.stringify(faceNodes)))
                    } else {
                      faceHeadMap.delete(pointId)
                      this.clearFaceHeadDatas(faceHeadMap)
                    }
                  }
                  // 更新最新的点位标识和人员头像数组的绑定关系
                  let faceHeads = this.faceHeadMap.has(pointId) ? this.faceHeadMap.get(pointId) : []
                  faceHeads = faceHeads.filter(item => item.userId !== faceHead.userId)
                  faceHeads.push(faceHead)
                  this.addFaceHeadDatas(JSON.parse(JSON.stringify(faceHeads)))
                  this.HANDLE_REPEAT_FACE_HEAD_NODES()
                }
              }
            }).catch(() => {
              console.log('recourse err')
            })
          }
        }
      }
    }
  }
}
