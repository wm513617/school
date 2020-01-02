/*
 * @Author: wangwei
 * @Date: 2018-10-29 09:38:12
 * @LastEditTime: 2018-11-19 19:58:08
 * @LastEditors: Please set LastEditors
 */
<script>
import alarm from '../../../socket/alarm.js'
import mapUtils from 'assets/3DMap/mapUtil.js'
import utils from 'assets/3DMap/utils/index.js'
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
const icons = {}
const oids = { // key 对应 eventType; value 对应 MODELOID 中的属性
  alarmInput: 'commonAlarm',
  alarmZone: 'alarmHost',
  fireAlarm: 'fireAlarm',
  patrolAlarm: 'commonPatrol',
  singleAlarm: 'single',
  boltipc: 'boltipc',
  halfBallipc: 'halfBallipc',
  fastBallipc: 'fastBallipc',
  redBoltipc: 'redBoltipc',
  allViewipc: 'allViewipc',
  alarmBox: 'alarmBox',
  alarmPillar: 'alarmColumn'
}
export default {
  data() {
    return {
      alarmingList: [],
      count: 0,
      alarmObj: null,
      buildArr: [],
      treeData: {},
      alarmingPointsInfo: {},
      allFloorAlarmPoints: {},
      alarmType: {
        commonAlarm: 'commonAlarm',
        fireAlarm: 'fireAlarm',
        singleAlarm: 'singleAlarm',
        patrolAlarm: 'patrolAlarm',
        askHelpAlarm: 'askHelpAlarm',
        alarmZone: 'alarmZone',
        videoAlarm: 'videoAlarm',
        intelligent: 'intelligent',
        faceAlarm: 'faceAlarm'
      },
      alarmTypeCn: {
        commonAlarm: '普通报警',
        fireAlarm: '消防报警',
        singleAlarm: '单兵报警',
        patrolAlarm: '巡更报警',
        askHelpAlarm: '报警求助报警',
        alarmZone: '报警主机',
        videoAlarm: '视频报警',
        intelligent: '智能报警',
        faceAlarm: '人像布控'
      }
    }
  },
  computed: {
    ...mapState({
      alarmingFeatureList: ({ tdPoint }) => tdPoint.alarmingFeatureList, // 报警闪烁点位
      allAlarmEntities: ({ tdPoint }) => tdPoint.allAlarmEntities, // 所有报警实体
      is3DMapOuter: ({ tdIndex }) => tdIndex.is3DMapOuter, // 三维地图和楼层平面图切换的标识
      ready: ({ tdIndex }) => tdIndex.ready, // 三维地图是否加载完成的标识----
      showBuildingAlarm: ({ tdIndex }) => tdIndex.showBuildingAlarm, // 控制楼宇列表
      buildIngAlarmObj: ({ tdPoint }) => tdPoint.buildIngAlarmObj, // 楼宇汇聚闪烁对象
      alarmingPointIdAndType: ({ tdPoint }) => tdPoint.alarmingPointIdAndType,
      patrolFeatureList: ({ tdPoint }) => tdPoint.patrolFeatureList,
      map3DConfig: ({ tdIndex }) => tdIndex.map3DConfig,
      floorAlarmPoints: ({ tdPoint }) => tdPoint.floorAlarmPoints,
      buildingArr: ({ tdPoint }) => tdPoint.buildingArr,
      floorData: ({ tdFloor }) => tdFloor.floorData,
      singleModelParam: ({ tdPoint }) => tdPoint.singleModelParam,
      filterState: ({ map3DApplyIX }) => map3DApplyIX.filterState, // 报警过滤状态
      filterLevel: ({ map3DApplyIX }) => map3DApplyIX.filterLevel,
      activeAlarmInfo3D: ({ alarmThreeD }) => alarmThreeD.activeAlarmInfo3D,
      pointFaceNodeMap: ({ alarmThreeD }) => alarmThreeD.pointFaceNodeMap, // 人脸点位节点map(key: 人脸设备点位标识， value：对应点位的人脸头像数组)
      activeAlarmTag3D: ({ alarmThreeD }) => alarmThreeD.activeAlarmTag3D

    }),
    ...mapGetters(['alarmTypeData'])
  },
  watch: {
    activeAlarmTag3D() {
      this.locationFocus3D()
    },
    buildIngAlarmObj() { // 页面上同步store的更改
      this.alarmObj = JSON.parse(JSON.stringify(this.buildIngAlarmObj))
    }
  },
  methods: {
    ...mapActions([
      'setAlarmingList',
      'setBuildingAlarmObj',
      'setAlarmingPointIdAndType',
      'setPatrolList',
      'getResourceById',
      'getSinglePatrolPoint',
      'getSingleModelList',
      'setFloorAlarmPoints',
      'setBuildingArr',
      'setAllAlarmEntities',
      'updateRealSingle3D',
      'deleteRealSingle3D',
      'pushSingleRealTrackCoords3D',
      'getvideoResourceById',
      'queryDefaultIconByOid',
      'setIsOuter'
    ]),
    ...mapMutations([
      'SET_FLOOR_DATA',
      'SET_RECEIVE_CURRENT_ALARM_DATA'
    ]),
    // 接受全部报警回调
    receiveAllAlarm(data) {
      this.SET_RECEIVE_CURRENT_ALARM_DATA(data)
      this.filterAlarmShowAndLevel(data)
    },
    // 接受巡更报警回调
    receivePatrolAlarm(data) {
      data.type = 'patrol_alarm'
      // console.log('socket 巡更报警', data)
      this.filterAlarmShowAndLevel(data)
    },
    // 接受单兵报警回调
    receiveSingleAlarm(data) {
      data.type = 'sentry_alarm'
      // console.log('socket 单兵报警', data)
      this.filterAlarmShowAndLevel(data)
    },
    // 接受全部报警确认回调
    allAlarmConfirmFun(data) {
      // console.log(data)
    },
    getSingleModelParam(isAlarm) { // 获取单兵模型参数
      let modelParam = { url: this.singleModelParam.onlineModeUrl, existModel: true }
      let extraColor = utils.getModelExtraColorParam(this.$context.Cesium, this.singleModelParam.brightness)
      if (isAlarm) {
        if (this.singleModelParam.alarmModeUrl) { // 有报警模型
          modelParam.url = this.singleModelParam.alarmModeUrl
        } else { // 无报警模型，在线模型上自动附加报警色
          modelParam.existModel = false
          extraColor = utils.getModelExtraColorParamByStatus(this.$context.Cesium, mapUtils.RESOURCESTATUS.alarm)
        }
      }
      modelParam.scale = this.singleModelParam.scale || mapUtils.TDDEFAULTOPS.singleDefaultScale
      modelParam.height = this.singleModelParam.height ? Number(this.singleModelParam.height) : mapUtils.TDDEFAULTOPS.singleDefaultHeight
      modelParam.color = extraColor.color || this.$context.Cesium.Color.WHITE
      modelParam.mode = extraColor.mode || this.$context.Cesium.ColorBlendMode.MIX
      modelParam.amount = extraColor.amount || 0
      return modelParam
    },
    getResourceModelParam(res, isAlarm) { // 获取资源的模型参数
      let modelParam = { url: '/static/model/default.gltf', existModel: false }
      let status = mapUtils.RESOURCESTATUS.offline
      if (isAlarm) {
        status = mapUtils.RESOURCESTATUS.alarm
      } else if (res.status) {
        status = mapUtils.RESOURCESTATUS.online
      }
      let model = res.point3D && res.point3D.hasOwnProperty('mid') ? res.point3D.mid : null // 资源模型
      if (model) {
        let files = model.files // 资源模型文件
        if (files && files.length > 0) {
          let onlineModel = null // 在线模型地址
          modelParam.existModel = false // 记录是否存在模型
          let extraColor = utils.getModelExtraColorParam(this.$context.Cesium, model.brightness) // 获取模型附加颜色参数
          for (const file of files) {
            if (file.status === mapUtils.RESOURCESTATUS.online) { // 在线，记录在线模型的地址
              onlineModel = file.path
            }
            if (file.path && ((isAlarm && file.status === mapUtils.RESOURCESTATUS.alarm) || (file.status === status))) { // 找到报警状态或找到给定状态的模型
              modelParam.url = file.path
              modelParam.existModel = true
              break
            }
          }
          if (!modelParam.existModel && onlineModel) { // 未找到对应状态模型且有在线模型时
            modelParam.url = onlineModel
            extraColor = utils.getModelExtraColorParamByStatus(this.$context.Cesium, status) // 根据状态获取模型附加颜色参数
          }
          modelParam.scale = res.point3D.scale || 1
          modelParam.color = extraColor.color || this.$context.Cesium.Color.WHITE
          modelParam.mode = extraColor.mode || this.$context.Cesium.ColorBlendMode.MIX
          modelParam.amount = extraColor.amount || 0
        }
      }
      return modelParam
    },
    /**
     * @msg: 获取全部报警模型URL方法
     * @param id 点位id 资源类的取channelId
     * @param type 报警类型
     */
    async getPointModelParam(id, type, isAlarm) {
      let modelParam = {}
      if (type === 'singleAlarm' || type === 'single') { // 单兵
        modelParam = this.getSingleModelParam(isAlarm)
      } else {
        let getResourcePointFun = (type === 'patrolAlarm' ? this.getSinglePatrolPoint : this.getResourceById)
        let res = await getResourcePointFun(id)
        modelParam = this.getResourceModelParam(res, isAlarm)
      }
      return modelParam
    },
    /**
     * @msg: 3d报警点位添加
     * @param data socket data
     * @return:
     */
    addAlarmingPoint(data) {
      if (this.is3DMapOuter) {
        if (
          (data.alarmInfo && data.alarmInfo.point3D && data.alarmInfo.point3D.isouter) ||
          (data.alarmInfo &&
            data.alarmInfo.eventType === 'acceptHelp' &&
            data.alarmInfo.bondCarmerRes &&
            data.alarmInfo.bondCarmerRes.point3D &&
            data.alarmInfo.bondCarmerRes.point3D.isouter) ||
          (data.map3D && data.map3D.isouter) ||
          data.type === 'sentry_alarm' || data.type === 'patrol_alarm'
        ) {
          if (this.ready) {
            const context = this.$context
            let pointObj = this.getAlarmPointIdAndType(data)
            if (!pointObj) { return }
            let entity = utils.getEntity(pointObj.id, context)
            if (entity) {
              if (data.type === 'sentry_alarm') {
                let pos = context.Cesium.Cartesian3.fromDegrees(Number(pointObj.loc[0]), Number(pointObj.loc[1]), Number(pointObj.loc[2]) || 0)
                entity.position = pos
              } else {
                const keyType = mapUtils.getKeyType()
                utils.reomoveEntityById(pointObj.id, keyType[pointObj.modelType], context)
                this.updateAlarmingEntities({...pointObj, del: true})
                this.addEntity(pointObj.id, pointObj.type, pointObj.loc, context)
              }
            } else {
              this.addEntity(pointObj.id, pointObj.type, pointObj.loc, context)
            }
          }
        } else if (
          !(data.alarmInfo && data.alarmInfo.point3D && data.alarmInfo.point3D.isouter) ||
          !(data.point3D && data.point3D.isouter)
        ) {
          // 底图上接收到楼层内的报警
          this.getAlarmPointIdAndType(data)
        }
      } else {
        if (
          !(
            (data.alarmInfo && data.alarmInfo.point3D && data.alarmInfo.point3D.isouter) ||
            (data.point3D && data.point3D.isouter)
          )
        ) {
          let sid
          if (data.alarmInfo && data.alarmInfo.point3D) {
            sid = data.alarmInfo.point3D.sid
          } else if (data.alarmInfo && data.alarmInfo.bondCarmerRes) {
            sid = data.alarmInfo.bondCarmerRes.sid
          } else if (data.map3D) {
            sid = data.map3D.sid
          }
          if (this.floorData._id === sid) {
            this.getAlarmPointIdAndType(data)
            this.alarmingList = this.$lodash.cloneDeep(this.alarmingFeatureList)
            let alarmType // = data.alarmInfo.eventType || patrol
            if (data.alarmInfo) {
              if (data.alarmInfo.machineType) {
                alarmType = data.alarmInfo.machineType
              } else {
                alarmType = data.alarmInfo.eventType
              }
            } else {
              alarmType = 'patrol'
            }
            let fea = utils.addAlarmingFea(data, alarmType, icons[alarmType])
            this.alarmingList.push(fea)
            this.setAlarmingList(this.alarmingList)
            this.$refs.mapFloorContainer && this.$refs.mapFloorContainer.render()
          } else { // 楼层间跳转，添加点位
            this.getAlarmPointIdAndType(data)
          }
        }
      }
    },
    updateAlarmingEntities(param) { // 更新报警实体参数数组
      let canDel = false
      if (param.del) {
        canDel = true
      }
      let [...alarmingEntities] = this.allAlarmEntities // 深拷贝报警实体数组
      let isExist = alarmingEntities.some((item, index) => {
        if (canDel && item.id === param) {
          alarmingEntities.splice(index, 1)
        }
        return item.id === param.id
      })
      if (!isExist && !param.del) { // 判断实体不存在且不是删除实体时，再更新报警实体列表
        alarmingEntities.push(param)
      }
      this.setAllAlarmEntities(alarmingEntities)
    },
    /**
     * @msg: 添加3d实例模型
     * @param id：实例id
     * @param type：实例类型
     * @param loc：位置信息
     * @param context：3d底图全局对象
     * @return:
     */
    addEntity(id, type, loc, context, isAlarm = true) {
      if (this.ready) {
        let height = Number(loc[2]) || 0
        this.getPointModelParam(id, type, isAlarm).then(res => {
          if (type === 'singleAlarm' || type === 'single') {
            height = height > res.height ? height : res.height
          }
          let modelObj = {
            id: id,
            type: type,
            url: res.url,
            scale: res.scale,
            longitude: Number(loc[0]),
            latitude: Number(loc[1]),
            height: height,
            heading: 0,
            pitch: 0,
            roll: 0,
            color: res.hasOwnProperty('color') ? res.color : context.Cesium.Color.WHITE,
            colorAmount: res.hasOwnProperty('amount') ? res.amount : 0,
            colorMode: res.hasOwnProperty('mode') ? res.mode : context.Cesium.ColorBlendMode.MIX
          }
          let entity = utils.addSingleModel(context, modelObj)
          if (type === 'singleAlarm') {
            this.$context.viewer.zoomTo(entity)
          } else if (type !== 'single') {
            utils.locateEntityIn3DMap(this.$context, entity) // 3D地图中定位到实体的位置
          }
          if (isAlarm) {
            this.updateAlarmingEntities({ id, type, loc, existModel: res.existModel })
          }
        })
      }
    },
    /**
     * @msg: 报警消息分类、构建报警对象
     * @param data：报警消息数据
     * @return:
     */
    getAlarmPointIdAndType(data) {
      let obj
      if (data.alarmInfo && data.alarmInfo.eventType && data.alarmInfo.eventType === 'alarmInput') {
        // 普通报警
        obj = this.returnAlarmingPointObj(data, this.alarmType.commonAlarm, this.alarmTypeCn.commonAlarm, 'commonAlarm')
      } else if (data.alarmInfo && data.alarmInfo.eventType && data.alarmInfo.eventType === 'alarmZone') {
        // 报警防区(即报警主机)
        obj = this.returnAlarmingPointObj(data, this.alarmType.alarmZone, this.alarmTypeCn.alarmZone, 'commonAlarm')
      } else if (data.alarmInfo && data.alarmInfo.eventType && data.alarmInfo.eventType === 'faceControl') {
        // 人脸报警
        obj = this.returnAlarmingPointObj(data, this.alarmType.faceAlarm, this.alarmTypeCn.faceAlarm, 'vedio')
      } else if (
        data.alarmInfo &&
        data.alarmInfo.eventType &&
        (data.alarmInfo.eventType === 'fireAlarm' || data.alarmInfo.eventType === 'fireFailure')
      ) {
        // 消防报警
        obj = this.returnAlarmingPointObj(data, this.alarmType.fireAlarm, this.alarmTypeCn.fireAlarm, 'fireAlarm')
      } else if (data.alarmInfo && data.alarmInfo.eventType && (data.alarmInfo.eventType === 'acceptHelp' || data.alarmInfo.eventType === 'askHelp')) {
        let bondCarmerRes
        if (data.alarmInfo && data.alarmInfo.bondCarmerRes) {
          bondCarmerRes = data.alarmInfo.bondCarmerRes
        }
        // 报警求助报警
        if (this.is3DMapOuter && bondCarmerRes.point3D.isouter) {
          this.checkAlarming(bondCarmerRes.point3D._id, this.alarmType.askHelpAlarm)
          obj = {
            id: data.alarmInfo.chanId || data.alarmInfo.channelId || bondCarmerRes._id,
            type: data.alarmInfo.eventType,
            modelType: 'alarmBox',
            loc: bondCarmerRes.point3D.loc.split(',').map(item => Number(item))
          }
        } else if (bondCarmerRes.point3D && !bondCarmerRes.point3D.isouter) {
          // 楼层内报警箱报警
          this.creatBuildingAlarmObj(data, this.alarmType.askHelpAlarm, '报警箱报警', 'alarmBox')
        }
      } else if (data.type === 'sentry_alarm') {
        const id = data.uniqueId
        this.checkAlarming(id, this.alarmType.singleAlarm)
        // 单兵报警
        if (data.point) {
          obj = {
            id: data.uniqueId,
            type: 'singleAlarm',
            modelType: 'singel',
            loc: [data.point.lon, data.point.lat, data.point.height]
          }
        }
      } else if (data.type === 'patrol_alarm') {
        // 巡更报警
        if (data.map3D.isouter) {
          this.checkAlarming(data._id, this.alarmType.patrolAlarm, data.uniqueId)
          obj = {
            id: data._id,
            type: 'patrolAlarm',
            modelType: 'patrol',
            loc: data.map3D.geo.split(',').map(item => Number(item))
          }
        } else {
          this.creatBuildingAlarmObj(data, this.alarmType.patrolAlarm, '巡更报警')
        }
      } else {
        // 视频报警 (监控点报警、重点关注)
        // 智能报警 (智能报警、违章报警、人脸报警)
        let intellAlarmArr = []
        for (const key in this.alarmTypeData) {
          if (key !== 'normalAlarm' && key !== 'video') {
            for (const md in this.alarmTypeData[key]) {
              intellAlarmArr.push(this.alarmTypeData[key][md])
            }
          }
        }
        let videoAlarmArr = []
        for (const key in this.alarmTypeData.video) {
          videoAlarmArr.push(this.alarmTypeData.video[key])
        }
        if (data.alarmInfo && data.alarmInfo.eventType) {
          if (videoAlarmArr.indexOf(data.alarmInfo.eventType) !== -1) {
            obj = this.returnAlarmingPointObj(data, this.alarmType.videoAlarm, this.alarmTypeCn.videoAlarm, 'vedio')
          }
          if (intellAlarmArr.indexOf(data.alarmInfo.eventType) !== -1) {
            obj = this.returnAlarmingPointObj(data, this.alarmType.intelligent, this.alarmTypeCn.intelligent, 'vedio')
          }
        }
      }
      return obj
    },
    /**
     * @msg: 返回报警对象
     * @param data：报警data
     * @param type：报警类型
     * @param typeCn：报警中文提示
     * @return:
     */
    returnAlarmingPointObj(data, type, typeCn, modelType) {
      if (this.is3DMapOuter && data.alarmInfo && data.alarmInfo.point3D && data.alarmInfo.point3D.isouter) {
        const id = data.alarmInfo.chanId || data.alarmInfo.channelId
        this.checkAlarming(id, type)
        return {
          id: id,
          type: data.alarmInfo.eventType,
          modelType: modelType,
          loc: data.alarmInfo.point3D.loc.split(',').map(item => Number(item))
        }
      } else {
        this.creatBuildingAlarmObj(data, type, typeCn)
      }
    },
    /**
     * @msg: 判断传入点位当前是否正在报警
     * @param id：报警id
     * @param type：报警类型
     * @param uniqueId：巡更报警确认id
     * @return:
     */
    checkAlarming(id, type, uniqueId) {
      if (!this.alarmingPointsInfo[id]) {
        if (uniqueId) {
          let types = {}
          types[uniqueId] = type
          this.alarmingPointsInfo[id] = types
        } else {
          this.alarmingPointsInfo[id] = type
        }
        this.setAlarmingPointIdAndType(this.alarmingPointsInfo)
      }
    },
    // buildingAlarmObj
    /**
     * @msg: 构建楼宇聚合闪烁对象
     * @param data：报警消息
     * @param type：报警类型
     * @param alarmType：中文提示
     * @return:
     */
    creatBuildingAlarmObj(data, type, alarmType) {
      let point
      if (data.alarmInfo && data.alarmInfo.point3D) {
        point = data.alarmInfo.point3D
      } else if (data.alarmInfo && data.alarmInfo.bondCarmerRes) {
        point = data.alarmInfo.bondCarmerRes
      } else if (data.map3D) {
        point = data.map3D
      }
      let code
      let bname
      let sname
      let pointName
      let id
      if (!point) { return }
      if (point.building3ds) {
        code = point.building3ds.code
        bname = point.building3ds.name
        sname = point.storey3ds.name
        pointName = data.alarmInfo.name
        id = data.alarmInfo.chanId || data.alarmInfo.channelId
      } else {
        code = point.bcode
        bname = point.bid.name
        sname = point.storeyName
        pointName = data.message && data.message.position
        id = data._id
      }

      let repeat = false
      let repeatIndex = 0
      this.saveAllAlarmingInFloor(data, id, point.sid)
      if (this.alarmObj[code] && this.alarmObj[code][type] && this.alarmObj[code][type].children.length) {
        this.alarmObj[code][type].children.forEach((item, index) => {
          if (item.id === id) {
            repeat = true
            repeatIndex = index
          }
        })
      }
      if (!this.alarmObj[code]) {
        this.alarmObj[code] = {}
        this.alarmObj[code]['building'] = bname
      }
      if (!this.alarmObj[code][type]) {
        this.alarmObj[code][type] = {
          name: alarmType,
          children: [
            {
              name: sname + pointName,
              sid: point.sid,
              id: id,
              data: data,
              times: 1,
              type: type
            }
          ]
        }
      } else {
        if (!repeat) {
          let alarm = {
            name: sname + pointName,
            sid: point.sid,
            id: id,
            data: data,
            times: 1,
            type: type
          }
          this.alarmObj[code][type].children.push(alarm)
        } else if (repeat) {
          this.alarmObj[code][type].children[repeatIndex].times++
          if (this.showBuildingAlarm) {
            this.buildIngAlarm = JSON.parse(JSON.stringify(this.alarmObj[this.currentSMID]))
            this.changeTreeData(this.buildIngAlarm)
          }
        }
      }
      this.setBuildingAlarmObj(this.alarmObj)
      this.creatBuildingArr(this.alarmObj)
    },
    /**
     * @msg: 构造树结构所需数据类型
     * @param data：楼宇聚合闪烁对象
     * @return:
     */
    changeTreeData(data) {
      this.treeData = {
        name: data.building || '楼宇',
        expand: true,
        children: [
          {
            name: data.commonAlarm ? data.commonAlarm.name : '普通报警',
            children: data.commonAlarm ? data.commonAlarm.children : []
          },
          {
            name: data.fireAlarm ? data.fireAlarm.name : '消防报警',
            children: data.fireAlarm ? data.fireAlarm.children : []
          },
          {
            name: data.singleAlarm ? data.singleAlarm.name : '单兵报警',
            children: data.singleAlarm ? data.singleAlarm.children : []
          },
          {
            name: data.patrolAlarm ? data.patrolAlarm.name : '巡更报警',
            children: data.patrolAlarm ? data.patrolAlarm.children : []
          },
          {
            name: data.askHelpAlarm ? data.askHelpAlarm.name : '报警求助报警',
            children: data.askHelpAlarm ? data.askHelpAlarm.children : []
          }
        ]
      }
    },
    /**
     * @msg: 楼层内点位闪烁方法
     * @param feature：闪烁点位元素
     * @return:
     */
    alarmTwink2d(features) {
      this.count++
      if (this.count % 30 < 6) {
        this.setAlarmingList(features)
      } else {
        this.setAlarmingList([])
      }
      this.$refs.mapFloorContainer.render()
    },
    /**
     * @msg: 楼宇聚合闪烁定时器方法
     * @param  arr：闪烁楼宇列表
     * @return:
     */
    /**
     * @msg: 楼宇聚合闪烁方法
     * @param buildingArr：闪烁楼宇列表
     * @return:
     */
    alarmTwink3D(buildingArr) {
      if (this.ready) {
        let { dataSet, dataSource, layer } = this.map3DConfig
        let layerName
        if (layer) {
          layerName = layer
        } else {
          layerName = dataSet + '@' + dataSource
        }
        const context = this.$context
        const viewer = context.viewer
        const Cesium = context.Cesium
        let targetLayer = viewer.scene.layers.find(layerName)
        if (targetLayer) {
          if (buildingArr.length) {
            targetLayer.setObjsColor(this.buildingArr, Cesium.Color.RED)
          } else {
            targetLayer.setObjsColor(this.buildingArr, Cesium.Color.WHITE)
          }
        }
      }
    },
    creatBuildingArr(val) {
      this.buildArr = []
      if (val) {
        for (const key in val) {
          if (val.hasOwnProperty(key)) {
            for (const item in val[key]) {
              if (val[key][item].children && val[key][item].children.length) {
                this.buildArr.push(key)
              }
            }
          }
        }
      }
      this.setBuildingArr(this.buildArr)
    },
    /**
     * @msg: 返回底图重载全部报警点位
     * @param {type}
     * @return:
     */
    reloadAlarmingEntities() {
      for (const item of this.allAlarmEntities) {
        this.addEntity(item.id, item.type, item.loc, this.$context)
      }
    },
    saveAllAlarmingInFloor(data, pointId, floorId) {
      if (!this.allFloorAlarmPoints[floorId]) {
        this.allFloorAlarmPoints[floorId] = {}
        this.allFloorAlarmPoints[floorId][pointId] = data
      } else if (!this.allFloorAlarmPoints[floorId][pointId]) {
        this.allFloorAlarmPoints[floorId][pointId] = data
      }
      this.setFloorAlarmPoints(this.allFloorAlarmPoints)
    },
    receiveSinglePos(data) { // 接收到单兵发送的实时位置
      console.log('接收到单兵发送的实时位置信息:', data)
      if (this.is3DMapOuter) {
        if (this.is3DMapOuter && this.ready && data.point.lon && data.point.lat) {
          data.point.lon = Number(data.point.lon)
          data.point.lat = Number(data.point.lat)
          data.point.height = data.point.height ? data.point.height : this.singleModelParam.height ? this.singleModelParam.height : mapUtils.TDDEFAULTOPS.singleDefaultHeight
          this.updateRealSingle3D(data) // 更新实时单兵缓存
          let realSingle = this.realSingleMap3D.get(data._id)
          if (realSingle && realSingle.isOpenTrack) {
            let coords = [Number(realSingle.geo.lon), Number(realSingle.geo.lat), mapUtils.TDDEFAULTOPS.trackPointHeight]
            this.pushSingleRealTrackCoords3D(coords) // 更新实时单兵轨迹坐标
          }
          if (this.isSinglePawn) {
            let height = data.point.height ? data.point.height : this.singleModelParam.height ? this.singleModelParam.height : mapUtils.TDDEFAULTOPS.singleDefaultHeight
            let entity = utils.getEntity(data._id, this.$context)
            let context = this.$context
            if (entity) {
              let altitude = Number(height) > 13 ? Number(height) : 13
              let pos = context.Cesium.Cartesian3.fromDegrees(Number(data.point.lon), Number(data.point.lat), altitude)
              entity.position = pos
            } else {
              let loc = [Number(data.point.lon), Number(data.point.lat), Number(height)]
              entity = this.addEntity(data._id, mapUtils.CHANNELTYPE.single, loc, this.$context, false)
            }
          }
          this.showRealSingleHeads(data) // 显示实时单兵头像
        }
      }
    },
    singleStatusChange(data) { // 接收到单兵设备状态变化
      console.log('接收到单兵设备状态变化信息：', data)
      if (data.status === 'offline') {
        let entity = utils.getEntity(data.userid, this.$context)
        this.deleteRealSingle3D(data.userid) // 删除实时单兵缓存
        entity && this.$context.viewer.entities.remove(entity)
        const headEntity = utils.getEntity('head' + data.userid, this.$context)
        headEntity && this.$context.viewer.entities.remove(headEntity)
      }
    },
    showRealSingleHeads(data) { // 显示实时单兵头像
      let entity = utils.getEntity('head' + data._id, this.$context)
      if (entity) {
        let height = data.point.hasOwnProperty('height') ? data.point.height : 0
        let pos = this.$context.Cesium.Cartesian3.fromDegrees(Number(data.point.lon), Number(data.point.lat), Number(height) + 13)
        entity.position = pos
      } else if (this.isSingleHead) {
        utils.addSingleHead(data, this.$context)
      }
    },
    getDefalutSingleModelInfo() { // 获取默认的单兵信息
      this.getSingleModelList()
    },
    filterAlarmShowAndLevel(data, loction) {
      // 报警过滤
      const alarmData = data.alarmInfo
      let type
      let level
      if (alarmData) {
        type = alarmData.eventType
        level = alarmData.level
        // 普通报警
        // this.filterState.isCommonAlarm.alarmInput // 报警输入 this.filterLevel.alarmInputLevel
        // this.filterState.isCommonAlarm.alarmSector // 报警防区 this.filterLevel.alarmSectorLevel
        if ((
          this.filterState.isCommonAlarm.checked &&
          ((type === 'alarmInput' &&
            this.filterState.isCommonAlarm.alarmInput &&
            level >= this.filterLevel.alarmInputLevel) ||
            (type === 'alarmZone' &&
              this.filterState.isCommonAlarm.alarmSector &&
              level >= this.filterLevel.alarmSectorLevel))
        ) || (loction && (type === 'alarmInput' || type === 'alarmZone'))) {
          this.addAlarmingPoint(data)
          return
        }
        // this.filterState.isAlarmHelp.checked // 报警求助
        if ((type === 'acceptHelp' || type === 'askHelp') && (this.filterState.isAlarmHelp.checked || loction)) {
          this.addAlarmingPoint(data)
          return
        }
        // this.filterState.isFireControl.checked // 消防报警 this.filterLevel.fireControlLevel
        if (
          (type === 'fireAlarm' || type === 'fireFailure') &&
          ((this.filterState.isFireControl.checked &&
          level >= this.filterLevel.fireControlLevel) || loction)
        ) {
          this.addAlarmingPoint(data)
          return
        }
        // 视频报警
        if (this.filterState.isAlarmVideo.checked || loction) {
          let tag = -1
          // this.filterState.isAlarmVideo.focusOn // 重点关注 this.filterLevel.focusOnLevel
          if (
            type === 'focusAttention' &&
            ((this.filterState.isAlarmVideo.focusOn &&
            level >= this.filterLevel.focusOnLevel) || loction)
          ) {
            tag++
            this.judgeVideoType(data).then((res) => {
              this.addAlarmingPoint(res)
            })
            return
          }
          // this.filterState.isAlarmVideo.alarmPoint // 监控点报警 this.filterLevel.cameraSpearLevel
          for (const key in this.alarmTypeData.video) {
            if (type === key && type !== 'focusAttention' && ((this.filterState.isAlarmVideo.alarmPoint && level >= this.filterLevel.cameraSpearLevel) || loction)) {
              tag++
              this.judgeVideoType(data).then((res) => {
                this.addAlarmingPoint(res)
              })
              break
            }
          }
          if (tag !== -1) { return }
        }
        // 智能报警
        if (this.filterState.isIntelligence.checked || loction) {
          let tagIn = -1
          // this.filterState.isIntelligence.alarmIntelligence // 智能报警 this.filterLevel.intelligenceLevel
          for (const key in this.alarmTypeData.intelligent) {
            if (
              type === key &&
              ((this.filterState.isIntelligence.alarmIntelligence &&
              level >= this.filterLevel.intelligenceLevel) || loction)
            ) {
              tagIn++
              this.judgeVideoType(data).then((res) => {
                this.addAlarmingPoint(res)
              })
              break
            }
          }
          // this.filterState.isIntelligence.alarmPeccancy // 违章报警 this.filterLevel.peccancyLevel
          for (const key in this.alarmTypeData.violation) {
            if (
              type === key &&
              ((this.filterState.isIntelligence.alarmPeccancy &&
              level >= this.filterLevel.peccancyLevel) || loction)
            ) {
              tagIn++
              this.judgeVideoType(data).then((res) => {
                this.addAlarmingPoint(res)
              })
              break
            }
          }
          // this.filterState.isIntelligence.faceOn // 人像布控 this.filterLevel.faceOnLevel
          if (type === 'faceControl' && ((this.filterState.isIntelligence.faceOn && level >= this.filterLevel.faceOnLevel) || loction)) {
            tagIn++
            this.judgeVideoType(data).then((res) => {
              this.addAlarmingPoint(res)
            })
          }
          if (tagIn !== -1) { return }
        }
      }
      // 单兵报警
      if (this.filterState.isAlarmSingle.checked || loction) {
        // this.filterState.isAlarmSingle.singleOneKey // 一键单兵报警
        // this.filterState.isAlarmSingle.alarmPatrol // 巡更异常报警
        if (
          (data.type === 'patrol_alarm' && (this.filterState.isAlarmSingle.alarmPatrol || loction)) ||
          (data.type === 'sentry_alarm' && (this.filterState.isAlarmSingle.singleOneKey || loction))
        ) {
          this.addAlarmingPoint(data)
        }
      }
    },
    judgeVideoType(data) {
      return new Promise((resolve) => {
        const id = data.alarmInfo.chanId || data.alarmInfo.channelId || data.alarmInfo.res
        this.getvideoResourceById(id).then((res) => {
          data.alarmInfo.machineType = mapUtils.getVedioTypeByIpcKey(res.monitortype)
          resolve(data)
        }).catch((err) => {
          console.log('获取设备类型', err, data)
        })
      })
    },
    // 获取报警图标
    getAlarmPointIcon() {
      const pros = []
      for (const item in oids) {
        const oid = mapUtils.MODELOID[oids[item]]
        pros.push(this.queryDefaultIconByOid(oid))
      }
      Promise.all(pros).then((res) => {
        let tag = 0
        for (let k in oids) {
          if (res && res[tag].default) {
            res[tag].files.filter(data => {
              if (data.status === 'alarm') {
                icons[k] = data.path
              }
            })
          } else {
            icons[k] = ''
          }
          tag++
        }
      }).catch(err => {
        console.log('获取默认图标失败', err)
      })
    },
    // 点击报警消息 定位报警点位位置
    locationFocus3D() {
      if (!this.activeAlarmInfo3D) { return }
      let obj = JSON.parse(JSON.stringify(this.activeAlarmInfo3D))
      const isouter = (obj.map3D && obj.map3D.isouter) || (obj.point3D && obj.point3D.isouter) || (obj.bondCarmerRes && obj.bondCarmerRes.isouter)
      if (isouter || obj.alarmTypeToMap === 'singleAlarm') {
        if (!this.is3DMapOuter) {
          this.setIsOuter(true)
          this.SET_FLOOR_DATA(null)
        }
      }
      if (obj.alarmTypeToMap === 'patrolAlarm') {
        obj.type = 'patrol_alarm'
      } else if (obj.alarmTypeToMap === 'singleAlarm') {
        obj.type = 'sentry_alarm'
      } else {
        if (!obj.alarmInfo) {
          obj = {
            alarmInfo: {
              ...obj
            }
          }
        }
        if (obj.alarmInfo.alarmTypeToMap === 'alarmHelp') {
          obj.alarmInfo.eventType = 'askHelp'
          obj.alarmInfo.bondCarmerRes = {
            point3D: { ...obj.alarmInfo.point3D },
            _id: obj.alarmInfo.chanId || obj.alarmInfo.channelId
          }
        }
      }
      console.log(obj, '点击的报警消息')
      this.filterAlarmShowAndLevel(obj, 'locToCenter')
      this.locationToCenter()
    },
    locationToCenter() {
      if (this.activeAlarmInfo3D) { // 点击报警消息定位
        if (this.activeAlarmInfo3D.alarmTypeToMap === 'singleAlarm') { return }
        let info = JSON.parse(JSON.stringify(this.activeAlarmInfo3D))
        const item = info.map3D || info.point3D || (info.bondCarmerRes && info.bondCarmerRes.point3D) || (info.message && info.message.point3D)
        if (!item) { return }
        if (item.isouter) {
          const id = info.chanId || info.channelId || (info.bondCarmerRes && info.bondCarmerRes._id) || info._id || (info.message && info.message._id) || (info.uniqueId || info._id || info.uid) || (info.point3D && info.point3D._id)
          utils.focueOnALarm(id, this.$context)
        } else {
          const loc = (item.geo || item.loc).split(',').map(item => Number(item))
          this.$context2D && this.$context2D.map.getView().setCenter(loc)
        }
      }
    },
    /**
     * @msg: 告警点位信息绘制
     * @param {type}
     * @return:
     */
    drawFaceAlarmTrackOnMap(tracks) {
      console.log(tracks)
      console.log(tracks.values())
      // for (let track of tracks.values()) {

      // }
    }
  },
  mounted() {
    this.getAlarmPointIcon()
    this.getDefalutSingleModelInfo() // 获取默认单兵模型信息
    this.alarmObj = JSON.parse(JSON.stringify(this.buildIngAlarmObj))
    this.alarmingPointsInfo = this.$lodash.cloneDeep(this.alarmingPointIdAndType)
    this.allFloorAlarmPoints = JSON.parse(JSON.stringify(this.floorAlarmPoints))
    alarm.on('all', this.receiveAllAlarm)
    alarm.on('patrol', this.receivePatrolAlarm)
    alarm.on('singlePawn', this.receiveSingleAlarm)
    alarm.on('singlePawnLoc', this.receiveSinglePos)
    alarm.on('singleStatus', this.singleStatusChange)
  },
  beforeDestroy() {
    this.setBuildingAlarmObj({})
    this.setBuildingArr([])
    this.setAllAlarmEntities([])
    this.setFloorAlarmPoints([])
    alarm.remove('all', this.receiveAllAlarm)
    alarm.remove('patrol', this.receivePatrolAlarm)
    alarm.remove('singlePawn', this.receiveSingleAlarm)
    alarm.remove('singlePawnLoc', this.receiveSinglePos)
    alarm.remove('singleStatus', this.singleStatusChange)
  }
}
</script>

<style>
</style>
