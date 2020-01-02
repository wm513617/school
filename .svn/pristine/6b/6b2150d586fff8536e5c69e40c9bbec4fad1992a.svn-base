<!--应用模式 人脸轨迹逻辑-->
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import DrawTrack from '../components/track/DrawTrack'
import mapUtil from 'assets/3DMap/mapUtil.js'
import utils from 'assets/3DMap/utils/index.js'
import _ from 'lodash'
export default {
  data() {
    return {
      faceTrackNodes: [], // 人脸轨迹节点
      facePointNodes: [], // 已添加的头像实体userId
      facePointDraw: false, // 实体是否添加flag
      isDrawPoint: false, // 是否已经已经绘制头像实体  -- 第一次进入页面需要从智能报警列表更新抓拍数据（接口返回数据可能存在延迟）
      facePointTime: new Date(), // 添加当前实体的开始时间
      drawTrackMap: new Map(), // 轨迹坐标
      trackColorArr: ['rgba(208, 2, 27, 0.75)', 'rgba(255, 165, 0, 0.75)', 'rgba(0, 0, 255, 0.75)', 'rgba(238, 130, 238, 0.75)', 'rgba(255, 255, 255, 0.75)'],
      trackArrowImgArr: ['/static/image/map/arrow1.png', '/static/image/map/arrow2.png', '/static/image/map/arrow3.png', '/static/image/map/arrow4.png', '/static/image/map/arrow5.png']
    }
  },
  computed: {
    ...mapState({
      faceHeads: ({ mapAlarm }) => mapAlarm.faceHeads, // 人脸头像数组
      trackAlarmCoMap: ({ alarmThreeD }) => alarmThreeD.trackAlarmCoMap,
      pointFaceNodeMap: ({ alarmThreeD }) => alarmThreeD.pointFaceNodeMap, // 人脸点位节点
      faceTrackDrawMap: ({ alarmThreeD }) => alarmThreeD.faceTrackDrawMap, // 人脸轨迹绘制轨迹map（key：用户标识，value: 对应的绘制工具）
      selectedFaceAlarmArr: ({ alarmThreeD }) => alarmThreeD.selectedFaceAlarmArr, // 选中的人脸报警数据数组
      receiveCurrentAlarmData: ({ alarmThreeD }) => alarmThreeD.receiveCurrentAlarmData, // 推送的报警数据
      filterState: ({map3DApplyIX}) => map3DApplyIX.filterState, // 左侧报警过滤数据
      showDrawTrack: ({ tdIndex }) => tdIndex.showDrawTrack, // 是否显示轨迹
      intelligentAlarmList: ({ alarmThreeD }) => alarmThreeD.intelligentAlarmList // 智能报警列表
    }),
    ...mapGetters('map3DApplyIX', ['toolsPanelActive'])
  },
  watch: {
    selectedFaceAlarmArr: { // 智能报警人脸轨迹选中项
      handler(newArr, oldArr) {
        if (newArr) {
          if (newArr.length === 0) {
            this.SET_POINT_FACE_NODE_3D_MAP([])
            this.initFaceRender()
          } else {
            this.removeEntity()
          }
          this.refreshFaceDrawTrack(newArr) // 刷新人脸绘制工具
          this.drawSelectedFaceTrack(newArr) // 绘制选择的人脸报警轨迹
        }
      },
      deep: true
    },
    pointFaceNodeMap: { // 人像数组
      handler(newVal, oldVal) {
        if (newVal && newVal.length > 0) {
          console.log('监听到人像map变化：', newVal)
          this.drawFaceAlarmTrackOnMap(newVal)
        }
      },
      deep: true
    },
    receiveCurrentAlarmData: { // socket接收到的数据
      handler(newVal, oldVal) {
        if (newVal) {
          this.receiveCurrentAlarm(newVal)
        }
      },
      deep: true
    },
    faceTrackDrawMap: { // 人脸轨迹数据
      handler(newVal, oldVal) {
        if (newVal) {
          for (let oldDrawTrack of this.faceTrackDrawMap.values()) { // 便利绘制工具
            oldDrawTrack.drawTrack && oldDrawTrack.drawTrack()
          }
        }
      },
      deep: true
    },
    toolsPanelActive(newVal) { // 右侧面板
      if (newVal !== 'intelligentAlarmList' && this.pointFaceNodeMap.length) {
        this.pointFaceNodeMap.forEach(item => {
          this.DELETE_CURRENT_FACE_TRACK(item.id)
        })
      }
    },
    filterState: { // 抓拍图片按钮切换 判断是否显示抓拍图片
      handler(newVal, oldVal) {
        if (newVal) {
          if (!newVal.isIntelligence.snapPictures) {
            return this.removeEntity()
          }
          this.initFaceRender()
        }
      },
      deep: true
    },
    intelligentAlarmList: { // 监听智能报警列表  第一次更新页面抓拍图片
      handler(newVal, oldVal) {
        if (newVal && !this.isDrawPoint && this.$context && this.$context.viewer) {
          this.initFaceRender()
          this.isDrawPoint = true
        }
      },
      deep: true
    },
    showDrawTrack(flag) { // 轨迹显示  判断是否显示抓拍图片
      if (flag) {
        this.SET_POINT_FACE_NODE_3D_MAP(new Map())
        this.removeEntity()
      } else {
        this.initFaceRender()
      }
    }
  },
  methods: {
    // ...mapMutations('mapAlarm', ['SET_FACE_HEAD_MAP', 'HANDLE_REPEAT_FACE_HEAD_NODES']),
    ...mapMutations(['SET_FACE_TRACK_3D_DRAW_MAP', 'SET_POINT_FACE_NODE_3D_MAP', 'SET_SELECTED_FACE_ALARM_3D_MAP', 'UPDATE_POINT_FACE_NODE_3D_MAP', 'CHANGE_FACEALARM_3D_TRAIL', 'DELETE_CURRENT_FACE_TRACK']),
    ...mapActions(['getUserTrackCondition']),
    refreshFaceDrawTrack(faceAlarmArr) { // 刷新人脸绘制工具
      for (let oldDrawTrack of this.faceTrackDrawMap.values()) { // 便利绘制工具，清空之前的绘制
        oldDrawTrack.clearTrack && oldDrawTrack.clearTrack()
      }
      this.SET_FACE_TRACK_3D_DRAW_MAP(new Map())
    },
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
        this.getFaceRealTrackNodes(res.data, index, true) // 获取人脸实时轨迹节点数据
        this.getFaceRealTrackLineCoords(res.data, userId, index) // 获取人脸实时轨迹坐标数据
      }).catch(() => {
        console.log('search face trackList err')
      })
    },
    getFaceRealTrackLineCoords(trackList, userId, index) { // 获取人脸实时轨迹坐标数据
      let trackNodeMap = new Map()
      for (let index = trackList.length - 1; index >= 0; index--) {
        const item = trackList[index]
        let attrObj = {index: index + 1, label: ''} // 构造点位数据
        if (item.res && item.res.point) {
          let point = item.res.point
          let coord = this.getPointCoordinates(point)
          if (coord && coord.length > 0) {
            let cartesian3 = null
            cartesian3 = this.$context.Cesium.Cartesian3.fromDegrees(coord[0], coord[1], mapUtil.TDDEFAULTOPS.trackPointHeight)
            trackNodeMap.set(attrObj, cartesian3)
          }
        }
      }
      let drawTrack = new DrawTrack(this.$context, trackNodeMap, {color: this.trackColorArr[index]})
      this.drawTrackMap.set(userId, drawTrack)
      if ([...this.drawTrackMap.values()].length >= this.selectedFaceAlarmArr.length) {
        this.SET_FACE_TRACK_3D_DRAW_MAP(this.drawTrackMap)
        this.drawTrackMap = new Map()
      }
    },
    getFaceRealTrackNodes(records, index, type) { // 获取人脸实时轨迹节点数据
      if (records && records.length > 0) {
        let recordItem = records[records.length - 1]
        if (recordItem && recordItem.res) {
          let pointId = recordItem.res._id
          let point = recordItem.res.point
          if (point) {
            let coord = this.getPointCoordinates(point) // 获取点位坐标
            let faceHead = {
              id: recordItem.userId,
              userId: recordItem.userId,
              color: this.trackColorArr[index],
              photo: recordItem.userImage,
              point: {
                lon: coord[0],
                lat: coord[1],
                height: coord[2]
              },
              pointId: pointId,
              name: recordItem.userName
            }
            this.faceTrackNodes.push(faceHead)
            if (type && this.faceTrackNodes.length >= this.selectedFaceAlarmArr.length) {
              this.SET_POINT_FACE_NODE_3D_MAP(this.faceTrackNodes)
              this.faceTrackNodes = []
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
    },
    drawFaceAlarmTrackOnMap(tracks) { // 绘制头像实体
      for (let track of tracks) {
        // 区分轨迹头像和抓拍图片头像    faceAlarm 为轨迹头像
        if (this.selectedFaceAlarmArr.length > 0) { track._name = 'faceAlarm' }
        // add 头像实体
        this.$context && this.$context.viewer && utils.addSingleHead(track, this.$context)
        // 更新已保存的userId
        let index = _.findIndex(this.facePointNodes, function(node) { return node.id === track.id })
        index < 0 && this.facePointNodes.push({id: track.id})
      }
    },
    removeEntity(userId) { // 移除已存在的实体
      if (!userId) {
        // 移除缓存的userId数组中的所有实体
        for (let point of this.facePointNodes) {
          console.log('移除头像实体 --- id: ' + point.id)
          // 移除头像实体
          let entity = utils.getEntity('facealarm_' + point.id, this.$context)
          if (!entity) { console.log(entity) }
          entity && this.$context.viewer.entities.remove(entity)
          // 移除头像右上角删除按钮实体
          let deleteEntity = utils.getEntity('deleteface_' + point.id, this.$context)
          deleteEntity && this.$context.viewer.entities.remove(deleteEntity)
        }
        // 移除完之后清空存储的userId数组
        this.facePointNodes = []
        // 移除完之后清空存储的节点数据
        this.SET_POINT_FACE_NODE_3D_MAP([])
      } else {
        // 单个移除实体
        // 移除头像实体
        let entity = utils.getEntity('facealarm_' + userId, this.$context)
        entity && this.$context.viewer.entities.remove(entity)
        // 移除头像右上角删除按钮实体
        let deleteEntity = utils.getEntity('deleteface_' + userId, this.$context)
        deleteEntity && this.$context.viewer.entities.remove(deleteEntity)
      }
    },
    initFaceRender() { // 初始化抓拍图片显示（第一次进入页面、轨迹显隐、抓拍图片按钮切换）
      if (this.filterState && this.filterState.isIntelligence && this.filterState.isIntelligence.snapPictures && !this.showDrawTrack && !this.selectedFaceAlarmArr.length) {
        this.faceRendering()
      }
    },
    faceRendering() { // 初始化抓拍图片节点数据处理
      this.removeEntity()
      let filterList = this.intelligentAlarmList.filter(item => {
        return item.eventType === 'faceControl'
      }).slice(0, 21) // 页面显示前21条
      if (filterList && filterList.length === 0) { return }
      let trackNodeMap = new Map()
      filterList.forEach((filter, index) => {
        if (filter && filter.point3D) {
          let pointId = filter.point3D._id
          let point = filter.point3D
          if (point) {
            let node = null
            let coord = this.getPointCoordinates(point) // 获取点位坐标
            if (trackNodeMap.has(pointId)) { // 节点map中已有设备信息
              node = trackNodeMap.get(pointId)
              if (node.timestamp < filter.timestamp) {
                node.id = filter.res || node.id
                node.userId = filter.res || node.userId
                node.photo = filter.faceImage || node.photo
                node.name = filter.userName || node.name
                node.point = {
                  lon: coord[0],
                  lat: coord[1],
                  height: coord[2]
                }
              }
            } else { // 节点map中没有设备信息
              if (coord && coord.length > 0) {
                node = {
                  id: filter.res,
                  userId: filter.res,
                  color: this.trackColorArr[index],
                  photo: filter.faceImage,
                  point: {
                    lon: coord[0],
                    lat: coord[1],
                    height: coord[2]
                  },
                  pointId: pointId,
                  timestamp: filter.timestamp, // 最新经过时间
                  name: filter.userName
                }
              }
            }
            if (node) {
              trackNodeMap.set(pointId, node) // 将节点放入map中
            }
          }
        }
      })
      let trackNodes = [...trackNodeMap.values()]
      if (trackNodes && trackNodes.length > 0) {
        // 更新节点数据
        this.SET_POINT_FACE_NODE_3D_MAP(trackNodes)
      }
    },
    receiveCurrentAlarm(data) { // 抓拍图片接收socket数据处理
      // 抓拍图片按钮是否开启    是否有显示轨迹
      let isDraw = this.filterState && this.filterState.isIntelligence && this.filterState.isIntelligence.snapPictures && !this.showDrawTrack && !this.selectedFaceAlarmArr.length
      // 上条数据是否渲染 或者是否过了10s
      let isOvertime = (this.facePointDraw || (new Date() - 1) - this.facePointTime > 10000)
      if (isDraw && isOvertime && this.$context && this.$context.viewer) {
        let coord = this.getPointCoordinates(data.alarmInfo.point3D)
        let resourceId = data.alarmInfo.verifaceMsg.res
        let track = {
          id: resourceId,
          userId: resourceId,
          color: this.trackColorArr[0],
          photo: data.alarmInfo.verifaceMsg.faceImage,
          point: {
            lon: coord[0],
            lat: coord[1],
            height: coord[2]
          },
          pointId: data.alarmInfo.point3D._id,
          timestamp: data.alarmInfo.verifaceMsg.timestamp, // 最新经过时间
          name: data.alarmInfo.verifaceMsg.userName
        }
        // 移除已存在的实体
        let entity = utils.getEntity('facealarm_' + resourceId, this.$context)
        entity && this.$context.viewer.entities.remove(entity)
        // 设置flag  当实体add之后更新flag
        this.facePointDraw = false
        utils.addSingleHead(track, this.$context, (flag) => { this.facePointDraw = flag })
        // 更新已保存的userId
        let index = _.findIndex(this.facePointNodes, function(node) { return node.id === track.id })
        index < 0 && this.facePointNodes.push({id: track.id})
        // 设置节点开始执行时间
        this.facePointTime = new Date() - 1
      }
    }
  },
  mounted() {
    if (this.intelligentAlarmList && this.intelligentAlarmList.length > 0 && this.$context && this.$context.viewer) {
      this.initFaceRender()
      this.isDrawPoint = true
    }
  },
  beforeDestroy() {
    this.SET_SELECTED_FACE_ALARM_3D_MAP(new Map()) // 清空选中的人脸报警数据
    for (let faceTrackDraw of this.faceTrackDrawMap.values()) {
      faceTrackDraw.clearTrack() // 清空绘制内容
    }
    this.SET_FACE_TRACK_3D_DRAW_MAP(new Map()) // 清空轨迹绘制工具
    this.SET_POINT_FACE_NODE_3D_MAP([]) // 清空人脸点位map
  }
}
</script>
