import { getType } from 'assets/2DMap/utils/common.js'
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState({
      faceTrackDrawMap: ({ mapAlarm }) => mapAlarm.faceTrackDrawMap,
      pointFaceNodeMap: ({ mapAlarm }) => mapAlarm.pointFaceNodeMap,
      alarmChangeInfo: ({ mapAlarm }) => mapAlarm.alarmChangeInfo
    }),
    ...mapGetters('map2DApplyIX', ['toolsPanelActive'])
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
    handlerAlarmInfo(data) {
      let dataParam = JSON.parse(JSON.stringify(data))
      if (dataParam.isdefense && dataParam.faceImage) {
        let instanceType = getType(this.faceTrackDrawMap) // 获取Map的类型
        if (!this.faceTrackDrawMap || instanceType !== 'Map') {
          this.SET_FACE_TRACK_DRAW_MAP(new Map())
        }
        if (this.faceTrackDrawMap.has(dataParam.userId)) {
          let currentDrawTrack = this.faceTrackDrawMap.get(dataParam.userId)
          if (currentDrawTrack) {
            let pointId = dataParam.res
            this.getMachinaResource(pointId).then(res => {
              if (res.data.point) {
                let pointCoords = res.data.point.loc.split(',').map(item => Number(item))
                console.log('设备：', res.data.point.name, 'pointCoords：', res.data.point.loc)
                let isRepeat = false // 点是否与轨迹最后一个点重复
                let trackPointNum = currentDrawTrack.lineCoords.length
                if (trackPointNum > 0) {
                  let prePointCoords = currentDrawTrack.lineCoords[trackPointNum - 1]
                  if (pointCoords[0] === prePointCoords[0] && pointCoords[1] === prePointCoords[1]) {
                    isRepeat = true
                    console.log('人脸报警点位与轨迹最后一个点重复！！！')
                  }
                }
                if (!isRepeat) {
                  currentDrawTrack.addPointToTrack(pointCoords)
                  let faceHead = { id: 'face_' + dataParam.time + '_' + dataParam.userId + '_' + new Date().getTime(), userId: dataParam.userId, borderColor: currentDrawTrack.trackColor, userImage: dataParam.userImage, coordinates: pointCoords, userName: dataParam.userName, pointId: pointId, pointName: dataParam.resName, isTrack: true }
                  // 先清除原来的点位标识和人员头像数组的绑定关系
                  for (const pointId of this.pointFaceNodeMap.keys()) {
                    let pointFaceNodes = JSON.parse(JSON.stringify(this.pointFaceNodeMap.get(pointId)))
                    pointFaceNodes = pointFaceNodes.filter(item => item.userId !== faceHead.userId)
                    if (pointFaceNodes && pointFaceNodes.length > 0) {
                      let pointFaceNodesEntry = { pointId: pointId, pointNodes: JSON.parse(JSON.stringify(pointFaceNodes)) }
                      this.UPDATE_POINT_FACE_NODE_MAP(pointFaceNodesEntry)
                    } else {
                      this.DELETE_POINT_FACE_NODE_MAP(pointId)
                    }
                  }
                  // 更新最新的点位标识和人员头像数组的绑定关系
                  let pointNodes = this.pointFaceNodeMap.has(pointId) ? this.pointFaceNodeMap.get(pointId) : []
                  // console.log('pointNodes: ', JSON.parse(JSON.stringify(pointNodes)))
                  pointNodes = pointNodes.filter(item => item.userId !== faceHead.userId)
                  // console.log('pointNodes after filter: ', JSON.parse(JSON.stringify(pointNodes)))
                  pointNodes.push(faceHead)
                  // console.log('pointNodes after push: ', JSON.parse(JSON.stringify(pointNodes)))
                  let pointNodesEntry = { pointId: pointId, pointNodes: JSON.parse(JSON.stringify(pointNodes)) }
                  this.UPDATE_POINT_FACE_NODE_MAP(pointNodesEntry)
                  // console.log('state.pointFaceNodeMap: ', state.pointFaceNodeMap)
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
