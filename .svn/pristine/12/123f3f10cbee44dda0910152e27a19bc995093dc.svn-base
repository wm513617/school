// 巡更、单兵图层
import { mapGetters, mapActions, mapState } from 'vuex'
import _ from 'lodash'
import layerConfig from 'assets/2DMap/meta/layer'
import featureBase from 'assets/2DMap/feature/base'
import transPatrol from 'assets/2DMap/feature/apply/patrol'
import { RESICONOID } from 'assets/2DMap/meta/common'
export default {
  data() {
    return {
      patrolLayer: layerConfig.patrol,
      patrolLabelLayer: layerConfig.patrolLabel,
      singleLayer: layerConfig.single
    }
  },
  computed: {
    ...mapState({
      singleTimeoutList: ({ mapAlarm }) => mapAlarm.singleTimeoutList
    }),
    ...mapGetters({
      patrolResources: 'patrolResourceArr', // 巡更资源数据
      patrols: 'patrolFeatures', // 巡更要素
      patrolLabels: 'patrolLabelFeatures', // 巡更名称要素
      realSingles: 'realSingles2D', // 实时单兵缓存
      singles: 'singleFeatures', // 移动单兵要素
      selelctedSingle2D: 'selelctedSingle2D', // 选中的单兵数据
      singleRealTrackCoords2D: 'singleRealTrackCoords2D', // 单兵实时轨迹坐标
      realSingleMap2D: 'realSingleMap2D', // 实时单兵数据map
      attrInfo: 'mapResourceAttributes' // 地图选中资源数据
    }),
    ...mapGetters('patrol2DAlarm', ['singleAllList']),
    queryPatrolsFun() { // 查询巡更数据函数
      return this.isMapOuter ? this.loadPatrolsByMapId : this.loadPatrolByFloorId
    }
  },
  watch: {
    patrolResources: {
      handler(arr) {
        this.controlPatrolShow() // 控制巡更要素显示
        this.controlPatrolLabelShow() // 控制巡更名称要素显示
      },
      deep: true
    },
    isPoint(flag) { // 巡更点位显隐
      this.controlPatrolShow() // 控制巡更要素显示
      this.controlPatrolLabelShow() // 控制巡更要素名称显示
    },
    realSingles: {
      handler(arr) {
        console.log('实时单兵数据变化：', arr)
        this.controlSingleShow() // 控制移动单兵要素显示
      },
      deep: true
    },
    removeSingle(flag) { // 移动单兵显隐
      this.controlSingleShow() // 控制移动单兵要素显示
    },
    singlePic(flag) { // 单兵头像
      this.controlSingleShow() // 控制移动单兵要素显示
    },
    selelctedSingle2D: {
      handler(newData, oldData) {
        if (oldData && oldData.isOpenTrack && newData.id !== oldData.id && newData.isOpenTrack) {
          this.changePreSelectedState2D(oldData.id)
        }
        this.controlSingleRealTrackState(newData.isOpenTrack)
      },
      deep: true
    },
    singleRealTrackCoords2D: {
      handler(arr) {
        this.singleRealTrack.clearTrack()
        this.controlSingleRealTrackShow() // 控制单兵实时轨迹显示
      },
      deep: true
    },
    singleIdList: { // 显示分组单兵标识列表
      handler(arr) {
        this.refreashSingleRelatedShow2D() // 根据分组刷新单兵相关显示
      },
      deep: true
    },
    singleAllList() {
      if (this.isPoint) {
        this.loadPatrolFeatures()
      }
      this.controlSingleShow() // 控制单兵显示
    },
    singleTimeoutList() {
      this.controlSingleShow() // 控制单兵显示
    }
  },
  methods: {
    ...mapActions([
      'loadPatrolsByMapId',
      'loadPatrolByFloorId',
      'setPatrolResources',
      'setPatrolFeatures',
      'setPatrolLabelFeatures',
      'getRealSingleList2D',
      'setSingleFeatures',
      'setShowSingleHeads2D',
      'setSingleRealTrackCoords2D',
      'changePreSelectedState2D',
      'queryDefaultIconByOid',
      'refreashSingleRelatedShow2D' // 根据分组刷新单兵相关显示
    ]),
    loadQueryPatrols() { // 加载查询的巡更数据
      let query = {}
      if (this.isMapOuter) { // 楼外地图，根据地图标识查询
        query = this.activeMapConfig.mapId
      } else { // 楼层地图，根据楼层标识加载
        query = this.currentFloor._id
      }
      this.queryPatrolsFun(query)
    },
    controlPatrolShow() { // 控制巡更要素显示
      if (this.isPoint) {
        this.loadPatrolFeatures() // 转换巡更要素数据
      } else {
        this.setPatrolFeatures([])
      }
    },
    loadPatrolFeatures() { // 转换巡更要素数据
      const arr = this.showFeaturesList(this.patrolResources, this.singleAllList, 'patrolAlarm') // 报警闪烁时不显示普通点位
      let patrolFeatures = transPatrol.transFeatures(arr, this.patrolLayer)
      this.setPatrolFeatures(patrolFeatures)
    },
    controlPatrolLabelShow() { // 控制巡更名称要素显示
      if (this.isPoint && this.isNameTitle) {
        this.loadPatrolLabelFeatures() // 转换巡更名称要素数据
      } else {
        this.setPatrolLabelFeatures([])
      }
    },
    loadPatrolLabelFeatures() {
      let labelFeatures = featureBase.transLabelFeatures(this.patrolResources, this.patrolLabelLayer)
      this.setPatrolLabelFeatures(labelFeatures)
    },
    handleHoverPatrolFeature(attr) { // 处理鼠标悬浮巡更图标要素
      // console.log('处理鼠标悬浮巡更图标要素，要素信息：', attr)
      if (attr.type === this.patrolLayer.name && !this.isNameTitle) { // 名称标签隐藏时，悬浮显示名称要素
        let labelFeature = featureBase.getHoverLabelFeature(attr, this.patrolLabelLayer)
        labelFeature && this.setPatrolLabelFeatures([labelFeature])
      }
    },
    loadQueryRealSingles() { // 加载查询的实时单兵列表
      this.getRealSingleList2D({ devStaus: 'online' }).then(res => {
        // console.log('查询到所有在线单兵数据：', res)
      })
    },
    controlSingleShow() { // 控制移动单兵的显示
      if (this.realSingles && this.realSingles.length > 0) {
        if (this.removeSingle && this.singlePic) { // 单兵和单兵头像同时显示时
          this.setSingleFeatures([]) // 清空单兵要素
          let singlesWithPic = _.cloneDeep(this.realSingles)
          singlesWithPic = singlesWithPic.filter(item => item.hasOwnProperty('photo') && item.photo)
          console.log('单兵头像数据：', singlesWithPic)
          this.loadSingleHeadIcons(singlesWithPic)
        } else { // 单兵和单兵头像不同时显示时
          this.setShowSingleHeads2D([])
          if (this.removeSingle) { // 显示单兵时
            this.loadSingleFeatures()
          } else {
            this.setSingleFeatures([]) // 清空单兵要素
          }
        }
      } else {
        this.setSingleFeatures([]) // 清空单兵要素
        this.setShowSingleHeads2D([]) // 清空单兵头像
      }
    },
    loadSingleFeatures(singles) { // 转换单兵要素
      this.queryDefaultIconByOid(RESICONOID.single).then(res => {
        let iconData = JSON.parse(JSON.stringify(res))
        // console.log('查询到的单兵图标数据：', iconData)
        let iconUrl = null
        if (iconData && iconData.files && iconData.files.length > 0) {
          for (const file of iconData.files) {
            if (file.status === 'online') {
              iconUrl = file.path
              break
            }
          }
        }
        console.log('查询到的在线单兵图片地址：', iconUrl)
        let singleArr = singles || this.realSingles
        const allSingArr = this.singleAllList.concat(this.singleTimeoutList)
        const arr = this.showFeaturesList(singleArr, allSingArr, 'singleAlarm') // 报警闪烁时不显示普通点位
        let singleFeatures = transPatrol.transSingleFeatures(arr, this.singleLayer, iconUrl)
        this.setSingleFeatures(singleFeatures)
      })
    },
    loadSingleHeadIcons(singles) { // 加载单兵头像数据
      let icons = []
      let singleArr = singles || this.realSingles
      for (const item of singleArr) {
        let { id, geo, photo } = item
        let loc = [Number(geo.lon), Number(geo.lat)]
        let icon = { id: id + '_' + new Date().getTime(), userId: id, loc, photo }
        icons.push(icon)
      }
      this.setShowSingleHeads2D(icons) // 设置显示的单兵头像
    },
    handleHoverSingleFeature(attr) { // 处理鼠标悬浮单兵图标要素
      // console.log('处理鼠标悬浮单兵图标要素，要素信息：', attr)
      if (attr.type === this.singleLayer.name && !this.singlePic) { // 单兵头像隐藏时，悬浮显示单兵头像
        let { id, loc, photo } = attr
        // console.log('icon： ', { id, loc, photo })
        if (photo) {
          let flag = true // 是否更新单兵头像
          if (this.showSingleHeads2D && this.showSingleHeads2D.length === 1) {
            let singleHead = this.showSingleHeads2D[0] // 获取之前显示的单兵悬浮头像
            let uid1 = singleHead.userId + '_' + singleHead.loc.toString() + '_' + photo // 之前显示的单兵信息
            let uid2 = id + '_' + loc.toString() + '_' + photo // 现在悬浮的单兵信息
            if (uid1 === uid2) { // 信息没有变化时
              flag = false
            }
          }
          if (flag) {
            this.setShowSingleHeads2D([{ id: id + '_' + new Date().getTime(), userId: id, loc, photo }]) // 设置显示的单兵头像
          }
        }
      }
    },
    clearPatrolFeatures() { // 清空巡更要素
      this.setPatrolResources([])
      this.setPatrolFeatures([])
      this.setPatrolLabelFeatures([])
    },
    clearPatrolHoverFeatures() { // 清空巡更悬浮要素显示
      if (!this.isNameTitle) {
        this.setPatrolLabelFeatures([])
      }
    },
    clearSingleFeatures() { // 清空单兵要素
      this.setSingleFeatures([])
      this.setShowSingleHeads2D([])
    },
    clearSingleHoverFeatures() { // 清空单兵悬浮要素的显示
      if (!this.singlePic) {
        this.setShowSingleHeads2D([])
      }
    },
    controlSingleRealTrackState(flag) {
      if (flag) {
        // let realSingle = this.realSingleMap2D.get(this.attrInfo._id)
        let {...realSingle} = this.selelctedSingle2D
        if (realSingle) {
          let coords = [realSingle.geo.lon, realSingle.geo.lat]
          this.setSingleRealTrackCoords2D([coords])
        }
        // this.controlSingleRealTrackShow() // 控制单兵实时轨迹显示
      } else { // 清除轨迹
        this.singleRealTrack.clearTrack()
        this.setSingleRealTrackCoords2D([]) // 清空实时单兵轨迹坐标
      }
    },
    controlSingleRealTrackShow() { // 控制单兵实时轨迹显示
      if (this.selelctedSingle2D && this.singleRealTrackCoords2D && this.singleRealTrackCoords2D.length > 0) {
        console.log('选中显示实时轨迹的单兵数据：', this.selelctedSingle2D.selectedColor)
        this.singleRealTrack.drawTrackLine(this.singleRealTrackCoords2D, this.selelctedSingle2D.selectedColor) // 绘制轨迹
        this.singleRealTrack.addTrackNodes() // 添加轨迹节点
      }
    }
  }
}
