/*
 * @Author: wangwei
 * @Date: 2018-10-29 09:38:12
 * @LastEditTime: 2018-11-19 19:58:08
 * @LastEditors: Please set LastEditors
 */
<script>
import alarm from 'socket/alarm.js'
import mapUtils from 'assets/3DMap/mapUtil.js'
import utils from 'assets/3DMap/utils/index.js'
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      alarmingList: [],
      count: 0,
      alarmObj: null,
      buildArr: [],
      treeData: {},
      alarmingPointsInfo: {},
      singleAlarmModeUrl: '',
      singleAOnlineModeUrl: '',
      singleModelParam: { height: 0, brightness: 0 }, // 单兵模型参数
      allFloorAlarmPoints: {},
      alarmType: {
        commonAlarm: 'commonAlarm',
        fireAlarm: 'fireAlarm',
        singleAlarm: 'singleAlarm',
        patrolAlarm: 'patrolAlarm',
        askHelpAlarm: 'askHelpAlarm'
      },
      alarmTypeCn: {
        commonAlarm: '普通报警',
        fireAlarm: '消防报警',
        singleAlarm: '单兵报警',
        patrolAlarm: '巡更报警',
        askHelpAlarm: '报警求助报警'
      },
      alarmSymbolType: {
        alarmInput: 'alarmPointAlarmSymbol',
        fireAlarm: 'fireAlarmPointAlarmSymbol',
        patrol: 'patrolAlarmSymbol'
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
      floorData: ({ tdFloor }) => tdFloor.floorData
    })
  },
  watch: {
    buildIngAlarmObj: {
      handler(val) {},
      deep: true
    },
    buildingArr(newVal, oldVal) {
      let deleteArr = []
      oldVal.forEach(item => {
        if (newVal.indexOf(item) < 0) {
          deleteArr.push(item)
        }
      })
      if (this.ready) {
        let { dataSet, dataSource, layer } = this.map3DConfig
        let layerName = layer || (dataSet + '@' + dataSource)
        const context = this.$context
        const viewer = context.viewer
        const Cesium = context.Cesium
        let targetLayer = viewer.scene.layers.find(layerName)
        if (targetLayer) {
          setTimeout(() => {
            targetLayer.setObjsColor(deleteArr, Cesium.Color.WHITE)
          }, 600)
        }
      }
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
      'getPointModelList',
      'setFloorAlarmPoints',
      'setBuildingArr',
      'setBuildingAlarmObj',
      'setBuildingArr',
      'setAllAlarmEntities',
      'setFloorAlarmPoints'
    ]),
    // 接受全部报警回调
    receiveAllAlarm(data) {
      // console.log('allAlarm', data)
      switch (this.modeType) {
        case 'alarmProcessing':
          if (data.alarmInfo && data.alarmInfo.eventType && ((data.alarmInfo.eventType === 'alarmInput') || (data.alarmInfo.eventType === 'acceptHelp'))) {
            this.addAlarmingPoint(data)
          }
          break
        case 'fireAlarm':
          if (data.alarmInfo && data.alarmInfo.eventType && data.alarmInfo.eventType === 'fireAlarm') {
            this.addAlarmingPoint(data)
          }
          break
        default:
          break
      }
    },
    // 接受巡更报警回调
    receivePatrolAlarm(data) {
      data.type = 'patrol_alarm'
      // console.log('patrolAlarm', data)
      this.addAlarmingPoint(data)
    },
    // 接受单兵报警回调
    receiveSingleAlarm(data) {
      data.type = 'sentry_alarm'
      // console.log('singleAlarm', data)
      this.addAlarmingPoint(data)
    },
    // 接受全部报警确认回调
    allAlarmConfirmFun(data) {
      // console.log(data)
    },
    confirmPatrolAlarm(data) { // 确认巡更报警
      this.$context.viewer.entities.removeById(data.pointId)
    },
    getSingleModelParam(isAlarm) { // 获取单兵模型参数
      let modelParam = { url: this.singleAOnlineModeUrl, existModel: true }
      let extraColor = utils.getModelExtraColorParam(this.$context.Cesium, this.singleModelParam.brightness)
      if (isAlarm) {
        if (this.singleAlarmModeUrl) { // 有报警模型
          modelParam.url = this.singleAlarmModeUrl
        } else { // 无报警模型，在线模型上自动附加报警色
          modelParam.existModel = false
          extraColor = utils.getModelExtraColorParamByStatus(this.$context.Cesium, mapUtils.RESOURCESTATUS.alarm)
        }
      }
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
      } else if (status) {
        status = mapUtils.RESOURCESTATUS.online
      }
      let model = (res.point3D && res.point3D.hasOwnProperty('mid')) ? res.point3D.mid : null // 资源模型
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
            if ((isAlarm && file.status === mapUtils.RESOURCESTATUS.alarm) || (file.status === status)) { // 找到报警状态或找到给定状态的模型
              modelParam.url = file.path
              modelParam.existModel = true
              break
            }
          }
          if (!modelParam.existModel && onlineModel) { // 未找到对应状态模型且有在线模型时
            modelParam.url = onlineModel
            extraColor = utils.getModelExtraColorParamByStatus(this.$context.Cesium, status) // 根据状态获取模型附加颜色参数
          }
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
      // console.log(id, 'channelId')
      let modelParam = {}
      if (type === 'singleAlarm' || type === 'single') { // 单兵
        modelParam = this.getSingleModelParam(isAlarm)
      } else {
        let getResourcePointFun = (type === 'patrolAlarm') ? this.getSinglePatrolPoint : this.getResourceById
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
          data.type === 'sentry_alarm'
        ) {
          if (this.ready) {
            const context = this.$context
            let pointObj = this.getAlarmPointIdAndType(data)
            // console.log(pointObj)
            let entity = this.getEntity(pointObj.id, context)
            if (entity) {
              // console.log(entity)
              if (data.type === 'sentry_alarm') {
                let pos = context.Cesium.Cartesian3.fromDegrees(pointObj.loc[0], pointObj.loc[1], pointObj.loc[2])
                entity.position = pos
              } else {
                this.getPointModelParam(pointObj.id, pointObj.type, true).then(res => {
                  entity.model.uri = res.url
                  entity.model.color = res.color
                  entity.model.colorBlendMode = res.mode
                  entity.model.colorBlendAmount = res.amount
                  utils.locateEntityIn3DMap(this.$context, entity) // 3D地图中定位到实体的位置
                  let param = {id: pointObj.id, type: pointObj.type, loc: pointObj.loc, existModel: res.existModel}
                  this.updateAlarmingEntities(param)
                })
              }
            } else {
              entity = this.addEntity(pointObj.id, pointObj.type, pointObj.loc, context)
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
              alarmType = data.alarmInfo.eventType
            } else {
              alarmType = 'patrol'
            }
            let fea = utils.addAlarmingFea(data, this.alarmSymbolType[alarmType])
            this.alarmingList.push(fea)
            this.setAlarmingList(this.alarmingList)
            this.$refs.mapFloorContainer && this.$refs.mapFloorContainer.render()
          }
        }
      }
    },
    /**
     * @msg: 获取3d模型实例
     * @param id：实例id
     * @param context：3d底图全局对象
     * @return:
     */
    getEntity(id, context) {
      if (this.ready) {
        let entities = context.viewer.entities
        let entity = entities.getById(id)
        if (entity) {
          return entity
        }
      }
    },
    updateAlarmingEntities(param) { // 更新报警实体参数数组
      let [...alarmingEntities] = this.allAlarmEntities // 深拷贝报警实体数组
      let isExist = alarmingEntities.some(item => { return item.id === param.id })
      if (!isExist) {
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
        this.getPointModelParam(id, type, isAlarm).then(res => {
          // console.log(res, 'res')
          let modelObj = {
            id: id,
            type: type,
            url: res.url,
            longitude: loc[0],
            latitude: loc[1],
            height: loc[2],
            heading: 0,
            pitch: 0,
            roll: 0,
            scale: 1.5,
            minimumPixelSize: 56,
            color: res.hasOwnProperty('color') ? res.color : context.Cesium.Color.WHITE,
            colorAmount: res.hasOwnProperty('amount') ? res.amount : 0,
            colorMode: res.hasOwnProperty('mode') ? res.mode : context.Cesium.ColorBlendMode.MIX
          }
          let entity = utils.addSingleModel(context, modelObj)
          utils.locateEntityIn3DMap(this.$context, entity) // 3D地图中定位到实体的位置
          if (isAlarm) {
            this.updateAlarmingEntities({id, type, loc, existModel: res.existModel})
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
      // console.log(data)
      let obj
      if (data.alarmInfo && data.alarmInfo.eventType && data.alarmInfo.eventType === 'alarmInput') {
        // 普通报警
        // console.log(data, 'data')
        obj = this.returnAlarmingPointObj(data, this.alarmType.commonAlarm, this.alarmTypeCn.commonAlarm)
      } else if (data.alarmInfo && data.alarmInfo.eventType && data.alarmInfo.eventType === 'fireAlarm') {
        // 消防报警
        obj = this.returnAlarmingPointObj(data, this.alarmType.fireAlarm, this.alarmTypeCn.fireAlarm)
      } else if (data.alarmInfo && data.alarmInfo.eventType && data.alarmInfo.eventType === 'acceptHelp') {
        // 报警求助报警
        if (this.is3DMapOuter && data.alarmInfo.bondCarmerRes.point3D.isouter) {
          this.checkAlarming(data.alarmInfo.bondCarmerRes.point3D._id, this.alarmType.askHelpAlarm)
          obj = {
            id: data.alarmInfo.bondCarmerRes._id,
            type: data.alarmInfo.eventType,
            modelType: '',
            loc: data.alarmInfo.bondCarmerRes.point3D.loc.split(',').map(item => Number(item))
          }
        } else if (!data.point3D.isouter) {
          // 楼层内报警箱报警
          this.creatBuildingAlarmObj(data, this.alarmType.askHelpAlarm, '报警箱报警')
        }
      } else if (data.type === 'sentry_alarm') {
        this.checkAlarming(data._id, this.alarmType.singleAlarm)
        // 单兵报警
        obj = {
          id: data._id,
          type: 'singleAlarm',
          modelType: '',
          loc: [data.point.lon, data.point.lat, data.point.height]
        }
      } else if (data.type === 'patrol_alarm') {
        // 巡更报警
        // data.type === 'patrol_alarm' &&
        if (data.map3D.isouter) {
          this.checkAlarming(data._id, this.alarmType.patrolAlarm, data.uniqueId)
          obj = {
            id: data._id,
            type: 'patrolAlarm',
            modelType: '',
            loc: data.map3D.geo.split(',').map(item => Number(item))
          }
        } else {
          this.creatBuildingAlarmObj(data, this.alarmType.patrolAlarm, '巡更报警')
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
    returnAlarmingPointObj(data, type, typeCn) {
      if (this.is3DMapOuter && data.alarmInfo && data.alarmInfo.point3D) {
        if (data.alarmInfo.point3D.isouter) {
          this.checkAlarming(data.alarmInfo.channelId, type)
          return {
            id: data.alarmInfo.channelId,
            type: data.alarmInfo.eventType,
            modelType: '',
            loc: data.alarmInfo.point3D.loc.split(',').map(item => Number(item))
          }
        } else {
          this.creatBuildingAlarmObj(data, type, typeCn)
        }
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
        // console.log(this.alarmingPointsInfo, 'this.alarmingPointsInfo')
        // console.log(this.alarmingPointIdAndType[id], 'this.alarmingPointIdAndType')
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
      if (point.building3ds) {
        code = point.building3ds.code
        bname = point.building3ds.name
        sname = point.storey3ds.name
        pointName = data.alarmInfo.name
        id = data.alarmInfo.channelId
      } else {
        code = point.bcode
        bname = point.bid.name
        sname = point.storeyName
        pointName = data.message.position
        id = data._id
      } /// = point.bcode || point.bid

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
      if (!this.alarmObj[code]) { //  || (this.alarmObj[code][type] && !this.alarmObj[code][type].children)
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
      // console.log(data, 'data')
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
        let layerName = layer || (dataSet + '@' + dataSource)
        const context = this.$context
        const viewer = context.viewer
        const Cesium = context.Cesium
        let targetLayer = viewer.scene.layers.find(layerName)
        if (targetLayer) {
          targetLayer.setObjsColor(buildingArr, Cesium.Color.WHITE)
        }
        setTimeout(() => {
          if (targetLayer) {
            targetLayer.setObjsColor(buildingArr, Cesium.Color.RED)
          }
        }, 500)
      }
    },
    creatBuildingArr(val) {
      this.buildArr = []
      if (val) {
        for (const key in val) {
          // console.log(key)
          if (val.hasOwnProperty(key)) {
            for (const item in val[key]) {
              if (val[key][item].children && val[key][item].children.length) {
                this.buildArr.push(key)
              }
            }
          }
        }
        // this.buildArr = Array.form(new Set(this.buildArr))
        // console.log(this.buildArr, 'this.buildingArr1111111')
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
        // && this.allFloorAlarmPoints[floorId][pointId])) {
        this.allFloorAlarmPoints[floorId] = {}
        this.allFloorAlarmPoints[floorId][pointId] = data
      } else if (!this.allFloorAlarmPoints[floorId][pointId]) {
        this.allFloorAlarmPoints[floorId][pointId] = data
      }
      this.setFloorAlarmPoints(this.allFloorAlarmPoints)
      // console.log(this.allFloorAlarmPoints, 'this.allFloorAlarmPoints')
    },
    receiveSinglePos(data) {
      // console.log(data)
      if (this.is3DMapOuter) {
        if (this.is3DMapOuter && this.ready && data.point.lon && data.point.lat) {
          let entity = this.getEntity(data._id, this.$context)
          let context = this.$context
          if (entity) {
            let pos = context.Cesium.Cartesian3.fromDegrees(Number(data.point.lon), Number(data.point.lat), Number(data.point.height))
            entity.position = pos
          } else {
            let loc = [Number(data.point.lon), Number(data.point.lat), Number(data.point.height)]
            entity = this.addEntity(data._id, mapUtils.CHANNELTYPE.single, loc, this.$context, false)
          }
        }
      }
    },
    singlePawnOffline(data) {
      // console.log(data, '单兵人员离线消息')
      if (data.status === 'offline') {
        let entity = this.getEntity(data.userid, this.$context)
        if (entity) {
          this.$context.viewer.entities.remove(entity)
        }
      }
    },
    getDefalutSingleModelInfo() { // 获取默认的单兵信息
      let param = { oid: Number(mapUtils.MODELOID.singlePid) }
      this.getPointModelList(param).then(res => {
        if (res && res.length > 0) {
          let model = res[0]
          for (const item of res) { // 编辑模型数组
            if (item.default) { // 默认模型
              model = item
              break
            }
          }
          this.singleModelParam.height = model.height || 0
          this.singleModelParam.brightness = model.brightness || 0
          model.files.forEach(item => {
            if (item.status === 'online') {
              this.singleAOnlineModeUrl = item.path
            } else if (item.status === 'alarm') {
              this.singleAlarmModeUrl = item.path
            }
          })
        }
      })
    }
  },
  mounted() {
    this.alarmObj = JSON.parse(JSON.stringify(this.buildIngAlarmObj))
    this.alarmingPointsInfo = this.$lodash.cloneDeep(this.alarmingPointIdAndType)
    this.allFloorAlarmPoints = JSON.parse(JSON.stringify(this.floorAlarmPoints))
    this.getDefalutSingleModelInfo() // 获取默认单兵模型信息
    console.log(this.modeType, 'this.modeType')
    switch (this.modeType) {
      case 'alarmProcessing':
      case 'fireAlarm':
        alarm.on('all', this.receiveAllAlarm)
        break
      case 'patrol':
        alarm.on('patrol', this.receivePatrolAlarm)
        alarm.on('patrolConfirm', this.confirmPatrolAlarm)
        alarm.on('singlePawnLoc', this.receiveSinglePos)
        alarm.on('sentryStatus', this.singlePawnOffline)
        break
      default:
        break
    }
  },
  beforeDestroy() {
    this.$context.viewer.destroy()
    this.setBuildingAlarmObj({})
    this.setBuildingArr([])
    this.setAllAlarmEntities([])
    this.setFloorAlarmPoints([])
    this.$context.viewer.destroy() // 销毁3D地图视图
    switch (this.modeType) {
      case 'alarmProcessing':
      case 'fireAlarm':
        this.changeShow({type: 'isAlarm', val: false})
        this.changeShow({type: 'isAlarmBox', val: false})
        this.changeShow({type: 'isAlarmPillar', val: false})
        this.changeShow({type: 'isFire', val: false})
        alarm.remove('all', this.receiveAllAlarm)
        break
      case 'patrol':
        this.changeShow({type: 'isSinglePawn', val: false})
        this.changeShow({type: 'isKeepWatch', val: false})
        alarm.remove('patrol', this.receivePatrolAlarm)
        alarm.remove('patrolConfirm', this.confirmPatrolAlarm)
        alarm.remove('singlePawnLoc', this.receiveSinglePos)
        alarm.remove('sentryStatus', this.singlePawnOffline)
        break
      default:
        break
    }
  }
}
</script>

<style>
</style>
