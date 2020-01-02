<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import utils from 'assets/3DMap/utils/index.js'
import mapUtils from 'assets/3DMap/mapUtil.js'
import appPatrol from 'assets/3DMap/appPatrolIpc.js'
import appResource from 'assets/3DMap/appResource.js'
export default {
  data() {
    return {
      alarmObj: {},
      singleAOnlineModeUrl: '',
      singleAlarmModeUrl: ''
    }
  },
  computed: {
    ...mapState({
      buildIngAlarmObj: ({ tdPoint }) => tdPoint.buildIngAlarmObj, // 楼宇汇聚闪烁对象
      allAlarmEntities: ({ tdPoint }) => tdPoint.allAlarmEntities, // 所有报警实体
      is3DMapOuter: ({ tdIndex }) => tdIndex.is3DMapOuter,
      floorAlarmPoints: ({ tdPoint }) => tdPoint.floorAlarmPoints,
      alarmingFeatureList: ({ tdPoint }) => tdPoint.alarmingFeatureList,
      floorData: ({ tdFloor }) => tdFloor.floorData, // 获取地图通道资源
      mapMode: ({ tdIndex }) => tdIndex.mapMode // 地图模式----
    }),
    ...mapGetters('map3DApplyIX', [
      'isAlarm', // 点位-普通报警
      'isFire', // 点位-消防报警
      'isAlarmBox', // 点位-报警箱
      'isAlarmPillar', // 点位-报警柱
      'isKeepWatch', // 点位-巡更
      'isSinglePawn' // 点位-单兵
    ])
  },
  methods: {
    ...mapActions([
      'setBuildingAlarmObj',
      'setAlarmingList',
      'setAllAlarmEntities',
      'getSinglePatrolPoint',
      'getResourceById',
      'getPointModelList',
      'setIsOuter',
      'getOneFloor',
      'setBuildingArr',
      'setFloorAlarmPoints',
      'setAlarmList',
      'setFirAlarmList',
      'setPatrolList',
      'setAlarmBoxList',
      'setAlarmColumnList',
      'getOneFloorPatrols',
      'getResourcePointsByChannelType'
    ]),
    /**
     * @msg:确认报警方法
     * @param obj： {pointIsouter, id, bcode, type}
     * pointIsouter：点位信息中的isouter
     * id：点位id  资源类的取channelId
     * bcode：楼层内的点位、所携带的楼宇id
     * type：报警类型 'commonAlarm','fireAlarm','singleAlarm','patrolAlarm','askHelpAlarm'
     */
    confirmAlarmData(obj) {
      console.log(obj)
      let { pointIsouter, id, bcode, type } = obj
      if (pointIsouter) {
        let [...alarmingEntities] = this.allAlarmEntities
        for (let index = 0; index < alarmingEntities.length; index++) {
          let alarmingEntity = alarmingEntities[index]
          if (alarmingEntity.id === id) {
            alarmingEntities.splice(index, 1)
            break
          }
        }
        this.setAllAlarmEntities(alarmingEntities)
        if (this.is3DMapOuter) {
          this.refreshEntitiesIn3DMap(id, type)
        }
      } else {
        if (!this.is3DMapOuter) {
          this.refreashFeaturesInFloorMap(type) // 刷新楼层内的点位要素
          let alarmList = JSON.parse(JSON.stringify(this.alarmingFeatureList))
          alarmList.forEach((item, index) => {
            if (item.attributes.id === id) {
              alarmList.splice(index, 1)
              this.setAlarmingList(alarmList)
            }
          })
        }
        this.alarmObj = JSON.parse(JSON.stringify(this.buildIngAlarmObj))
        let arr = this.alarmObj[bcode][type].children
        arr.forEach((item, index) => {
          if (item.id === id) {
            console.log(this.alarmObj[bcode][type].children, 'this.alarmObj[bcode][type].children')
            this.alarmObj[bcode][type].children.splice(index, 1)
            console.log(this.alarmObj[bcode][type].children, 'this.alarmObj[bcode][type].children')
            this.setBuildingAlarmObj(this.alarmObj)
            this.creatBuildingArr(this.alarmObj)
          }
        })
        let floorAlarm = JSON.parse(JSON.stringify(this.floorAlarmPoints))
        for (const key in floorAlarm) {
          if (floorAlarm.hasOwnProperty(key)) {
            const element = floorAlarm[key]
            for (const j in element) {
              if (element.hasOwnProperty(j)) {
                if (id === j) {
                  delete element[j]
                }
              }
            }
          }
        }
        this.setFloorAlarmPoints(floorAlarm)
      }
    },
    refreshEntitiesIn3DMap(id, type) { // 刷新3D地图上的实体
      this.shouldClearEntity(id, type).then(isClear => {
        if (isClear) {
          this.$context.viewer.entities.removeById(id)
        } else {
          let entity = this.$context.viewer.entities.getById(id)
          if (entity) {
            this.getPointModelParam(id, type).then(res => {
              entity.model.uri = res.url
              entity.model.color = res.color
              entity.model.colorBlendMode = res.mode
              entity.model.colorBlendAmount = res.amount
            })
          }
        }
      })
    },
    async shouldClearEntity(id, type) { // 根据类型判断是否清楚实体
      let isClear = true
      switch (type) {
        case 'commonAlarm': // 普通报警
          isClear = !this.isAlarm
          break
        case 'fireAlarm': // 消防报警
          isClear = !this.isFire
          break
        case 'patrolAlarm': // 巡更报警
          isClear = !this.isKeepWatch
          break
        case 'askHelpAlarm':
          let res = await this.getResourceById(id)
          if (res.eid && res.eid.type) {
            if (res.eid.type === mapUtils.CHANNELTYPE.alarmBoxResource) {
              isClear = !this.isAlarmBox
            } else if (res.eid.type === mapUtils.CHANNELTYPE.alarmColumnResource) {
              isClear = !this.isAlarmPillar
            }
          }
          break
        case 'singleAlarm':
          isClear = !this.isSinglePawn
          break
        default:
          break
      }
      return isClear
    },
    getSingleModelParam() { // 获取单兵模型参数
      let modelParam = { url: this.singleAOnlineModeUrl }
      let extraColor = utils.getModelExtraColorParam(this.$context.Cesium, this.singleModelParam.brightness)
      modelParam.color = extraColor.color || this.$context.Cesium.Color.WHITE
      modelParam.mode = extraColor.mode || this.$context.Cesium.ColorBlendMode.MIX
      modelParam.amount = extraColor.amount || 0
      return modelParam
    },
    getResourceModelParam(res) { // 获取资源的模型参数
      let modelParam = { url: '/static/model/default.gltf' }
      let status = mapUtils.RESOURCESTATUS.offline
      if (status) {
        status = mapUtils.RESOURCESTATUS.online
      }
      let model = (res.point3D && res.point3D.hasOwnProperty('mid')) ? res.point3D.mid : null // 资源模型
      if (model) {
        let files = model.files // 资源模型文件
        if (files && files.length > 0) {
          let onlineModel = null // 在线模型地址
          let existModel = false // 记录是否存在模型
          let extraColor = utils.getModelExtraColorParam(this.$context.Cesium, model.brightness) // 获取模型附加颜色参数
          for (const file of files) {
            if (file.status === mapUtils.RESOURCESTATUS.online) { // 在线，记录在线模型的地址
              onlineModel = file.path
            }
            if (file.status === status) { // 找到报警状态或找到给定状态的模型
              modelParam.url = file.path
              existModel = true
              break
            }
          }
          if (!existModel && onlineModel) { // 未找到对应状态模型且有在线模型时
            modelParam.url = onlineModel
            extraColor = utils.getModelExtraColorParamByStatus(this.$context.Cesium, mapUtils.RESOURCESTATUS.alarm) // 根据状态获取模型附加颜色参数
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
    async getPointModelParam(id, type) {
      let modelParam = {}
      if (type === 'singleAlarm' || type === 'single') { // 单兵
        modelParam = this.getSingleModelParam()
      } else {
        let getResourcePointFun = (type === 'patrolAlarm') ? this.getSinglePatrolPoint : this.getResourceById
        let res = await getResourcePointFun(id)
        modelParam = this.getResourceModelParam(res)
      }
      return modelParam
    },
    refreashFeaturesInFloorMap(type) { // 刷新楼层地图上的报警点位
      if (type === 'commonAlarm') { // 处理的是普通报警，刷新普通报警图层数据源
        let param = { sid: this.floorData._id, channelTypes: mapUtils.CHANNELTYPE.commonAlarmResource + ',' + mapUtils.CHANNELTYPE.alarmHostResource }
        this.refreashResourcePointInFloorMap(this.isAlarm, param, this.setAlarmList)
      } else if (type === 'fireAlarm') { // 处理的是消防报警，刷新消防图层数据源
        let param = { sid: this.floorData._id, channelTypes: mapUtils.CHANNELTYPE.fireAlarmResource }
        this.refreashResourcePointInFloorMap(this.isFire, param, this.setFirAlarmList)
      } else if (type === 'patrolAlarm') { // 处理的是巡更报警，刷新巡更图层数据源
        this.refreashPatrolPointInFloorMap()
      } else if (type === 'askHelpAlarm') { // 处理的是报警求助，刷新报警求助图层数据源
        let param = { tab: mapUtils.TABTYPE.alarmHelp, sid: this.floorData._id, channelTypes: mapUtils.CHANNELTYPE.vedioResource }
        this.refreashResourcePointInFloorMap(this.isAlarmBox, param, this.setAlarmBoxList, mapUtils.CHANNELTYPE.alarmBoxResource)
        this.refreashResourcePointInFloorMap(this.isAlarmPillar, param, this.setAlarmColumnList, mapUtils.CHANNELTYPE.alarmColumnResource)
      }
    },
    refreashResourcePointInFloorMap(showFlag, param, setPointFun, type) { // 刷新楼层内地图的资源点位
      if (this.showFlag) { // 报警箱
        this.getResourcePointsByChannelType(param).then(res => {
          let pointArr = [...res] // 深拷贝数组
          for (const alarmingFeature of this.alarmingFeatureList) { // 遍历报警要素数组
            for (let index = 0; index < pointArr.length; index++) {
              const point = pointArr[index]
              if (alarmingFeature.attributes.id === point._id) {
                pointArr.splice(index, 1) // 移除巡更点位数据
              }
            }
          }
          if (type === mapUtils.CHANNELTYPE.alarmBoxResource) { // 过滤报警箱设备
            pointArr = mapUtils.getAlarmBoxOrColumnByType(pointArr, mapUtils.CHANNELTYPE.alarmBoxResource)
          } else if (type === mapUtils.CHANNELTYPE.alarmColumnResource) { // 过滤报警柱设备
            pointArr = mapUtils.getAlarmBoxOrColumnByType(pointArr, mapUtils.CHANNELTYPE.alarmColumnResource)
          }
          let features = appResource.convertPointDataToFeatures(pointArr, this.mapMode)
          this.setPointFun(features)
        })
      } else {
        this.setPointFun([])
      }
    },
    refreashPatrolPointInFloorMap() { // 刷新楼层内地图的巡更点要素
      if (this.isKeepWatch) {
        this.getOneFloorPatrols(this.floorData._id).then(res => {
          let patrolArr = [...res] // 深拷贝数组
          for (const alarmingFeature of this.alarmingFeatureList) { // 遍历报警要素数组
            for (let index = 0; index < patrolArr.length; index++) {
              const patrol = patrolArr[index]
              if (alarmingFeature.attributes.id === patrol._id) {
                patrolArr.splice(index, 1) // 移除巡更点位数据
              }
            }
          }
          let patrols = appPatrol.convertPatrolPointToFeature(patrolArr, this.mapMode)
          this.setPatrolList(patrols)
        })
      } else {
        this.setPatrolList([])
      }
    },
    creatBuildingArr(val) {
      let buildArr = []
      if (val) {
        for (const key in val) {
          console.log(key)
          if (val.hasOwnProperty(key)) {
            for (const item in val[key]) {
              if (val[key][item].children && val[key][item].children.length) {
                buildArr.push(key)
              }
            }
          }
        }
        console.log(buildArr, 'this.buildingArr1111111')
      }
      this.setBuildingArr(buildArr)
    },
    /**
     * @msg: 获取全部报警模型URL方法
     * @param id 点位id 资源类的取channelId
     * @param type 报警类型
     */
    async getPointModUrl(id, type, isAlarm) {
      console.log(id, 'channelId')
      let url
      if (type === 'singleAlarm' || type === 'singlePos') {
        if (isAlarm) {
          url = this.singleAlarmModeUrl
        } else {
          url = this.singleAOnlineModeUrl
        }
      } else if (type === 'patrolAlarm') {
        let res = await this.getSinglePatrolPoint(id)
        console.log('patrolRes', res)
        res.point3D.mid.files.forEach(item => {
          if (item.status === 'alarm' && isAlarm) {
            url = item.path
          } else if (item.status === 'online' && !isAlarm) {
            url = item.path
          }
        })
      } else {
        let res = await this.getResourceById(id)
        console.log(res, 'res')
        res.point3D.mid.files.forEach(item => {
          if (item.status === 'alarm' && isAlarm) {
            url = item.path
          } else if (item.status === 'online' && !isAlarm) {
            url = item.path
          }
        })
      }
      return url
      // console.log('s3murl', url)
      // return url
    },
    focusOnFloorAlarm(sid) {
      this.getOneFloor(sid).then(res => {
        if (res) {
          // 根据楼层id切换资源树
          this.setIsOuter(false)
        }
      })
    }
  },
  mounted() {
    this.getPointModelList({ oid: 15, status: 'online' }).then(res => {
      if (res && res.length > 0) {
        res[0].files.forEach(item => {
          if (item.status === 'online') {
            this.singleAOnlineModeUrl = item.path
          } else if (item.status === 'alarm') {
            this.singleAlarmModeUrl = item.path
          }
        })
      }
    })
  }
}
</script>

<style>
</style>
