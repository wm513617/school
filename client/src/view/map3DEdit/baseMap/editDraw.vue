<script>
import { RESOURCETYPE, MAPMODE, DEFAULTOPS } from 'assets/2DMap/meta/common'
import { mapActions, mapState } from 'vuex'
import areaStyle from 'assets/2DMap/areaStyle'
import alarm from 'assets/3DMap/alarm'
import layerConfig from 'assets/2DMap/meta/layer'
import drawConfig from 'assets/2DMap/meta/draw'
import spaceUtil from 'assets/2DMap/spaceAnalysisUtil'
import highLight from 'assets/2DMap/feature/edit/highLight'

export default {
  data() {
    return {
      lineStyleWithLabel: areaStyle.gridStyleWithLabel,
      areaStyleWithLabel: areaStyle.gridStyleWithLabel,
      fireAlarm: layerConfig.fireAlarm, // 消防报警
      alarmHost: layerConfig.alarmHost, // 报警主机
      commonAlarmLayer: layerConfig.commonAlarm // 普通报警
    }
  },
  watch: {

  },
  computed: {
    ...mapState({
      alarmFeatureList: ({ tdPoint }) => tdPoint.alarmFeatureList, // 普通报警点位列表
      mapResource: ({ tdPoint }) => tdPoint.mapResource, // 地图资源，包括通道资源，巡更资源
      drawGridStyle: ({ tdFloor }) => tdFloor.drawGridStyle, // 绘制样式
      polygonLoc: ({ tdFloor }) => tdFloor.polygonLoc, // 设置楼宇中线/面的位置坐标
      rightPanelType: ({ tdIndex }) => tdIndex.rightPanelType, // 右侧面板类型
      pointIcon: ({ tdPoint }) => tdPoint.defaultPointIcon3D, // 默认点位图标
      active2DGridDraw: ({ tdIndex }) => tdIndex.active2DGridDraw,
      active2DStringDraw: ({ tdIndex }) => tdIndex.active2DStringDraw,
      selectedPointRes: ({ tdPoint }) => tdPoint.selectedPointRes, // 当前选中的资源
      mapsignType: ({ alarmThreeD }) => alarmThreeD.mapsignType
    })
  },
  methods: {
    ...mapActions([
      'setAlarmList', // 更新普通报警点位列表
      'setHighLightList' // 更新高亮显示列表
    ]),
    highLightSelectedAreaFeature(id, loc) { // 面绘制完后定位
      let centerCoordinates = spaceUtil.getMultiLineStringCenter(loc) // 通过绘制线/面的所有位置点位计算中心点
      if (centerCoordinates) {
        this.highLightLocateInMapCenter(id, centerCoordinates) // 高亮定位到地图中心
      }
    },
    highLightLocateInMapCenter(id, coods, isZone = false) { // 高亮定位到地图中心
      this.locateInMapCenter(coods) // 定位到地图中心
      let feature = highLight.getLocateFeature(DEFAULTOPS.locatePre + id, coods) // 生成高亮显示元素
      this.setHighLightList([feature]) // 更新高亮显示
    },
    locateInMapCenter(center) { // 定位到地图中心
      this.$context2D.map && this.$context2D.map.getView().setCenter(center)
    },
    getAreaDrawerByResource(flag) { // 根据资源获取区域绘制工具样式
      let areaDraw = null
      let rType = (this.mapResource && this.mapResource.hasOwnProperty('type') && this.mapResource.type) || (this.selectedPointRes && this.selectedPointRes.hasOwnProperty('rType') && this.selectedPointRes.rType)
      if (rType) {
        if (rType === RESOURCETYPE.commonAlarm) { // 普通报警
          areaDraw = JSON.parse(JSON.stringify(drawConfig.commonAlarmArea))
          areaDraw.actived = flag
        } else if (rType === RESOURCETYPE.fireAlarm) { // 消防报警
          areaDraw = JSON.parse(JSON.stringify(drawConfig.fireAlarmArea))
          areaDraw.actived = flag
        } else if (rType === RESOURCETYPE.alarmHost) { // 报警主机
          areaDraw = JSON.parse(JSON.stringify(drawConfig.alarmHostArea))
          areaDraw.actived = flag
        }
        if (areaDraw) {
          let iconUrl = this.getTargetPointIconUrl() // 获取指定图标地址
          if (iconUrl) {
            areaDraw.drawStyle.iconStyle.url = iconUrl
          }
        }
      }
      return areaDraw
    },
    getTargetPointIconUrl() { // 获取指定图标地址
      let iconUrl = null
      let {files} = this.pointIcon
      if (files && files instanceof Array) {
        for (const file of files) {
          if (file.status === 'online') {
            iconUrl = file.path
            break
          }
        }
      }
      return iconUrl
    },
    uploadEditEndDatas() { // 报警编辑时更新样式和位置
      if (this.rightPanelType !== 'alarmEditPanel') { return } // 非报警数据，不走该方法
      const { point3D, _id, type } = this.mapResource
      const commonAlarm = (type === RESOURCETYPE.commonAlarm && this.commonAlarmLayer) || (type === RESOURCETYPE.fireAlarm && this.fireAlarm) || (type === RESOURCETYPE.alarmHost && this.alarmHost)
      const isExitEditData = this.alarmFeatureList.filter(item => { return item.attributes.id === _id })
      if ((!isExitEditData || !isExitEditData.length) && (this.mapsignType === 1 || this.mapsignType === 2)) { return this.refreshCurrentGridFeature() } // 过滤编辑中的元素，若不存在该元素，则为绘制中的数据，不需要更新报警图层数据，只需要更新当前绘制中的数据
      const mapResourceObj = this.$lodash.cloneDeep(this.mapResource) // 深拷贝当前选择的资源
      mapResourceObj[MAPMODE.point3D].style = this.drawGridStyle // 增加样式
      mapResourceObj[MAPMODE.point3D].loc = this.polygonLoc || point3D.loc // 增加位置信息
      mapResourceObj.mapsign.signtype = this.mapsignType
      let feature = alarm.transOneFeature(mapResourceObj, commonAlarm, MAPMODE.point3D) // 转换为图层需要的数据格式
      feature.symbol.textStyle && (feature.symbol.textStyle.label = commonAlarm.label + '：' + mapResourceObj.name) // 增加字体显示
      let editAlarmDatas = this.alarmFeatureList.filter(item => { return item.attributes.id !== _id }) // 过滤出除编辑元素外的所有资源
      editAlarmDatas.push(feature) // 用新的数据替换编辑之前的数据
      this.setAlarmList(editAlarmDatas) // 存储报警图层数据
    }
  }
}
</script>
