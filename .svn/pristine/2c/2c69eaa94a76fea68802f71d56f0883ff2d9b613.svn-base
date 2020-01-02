// 报警箱图层
import { mapGetters, mapActions } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import { RESOURCETYPE } from 'assets/2DMap/meta/common'
import featureBase from 'assets/2DMap/feature/base'
import transAlarmHelp from 'assets/2DMap/feature/apply/alarmHelp'
export default {
  data() {
    return {
      alarmBoxLayer: layerConfig.alarmBox,
      alarmBoxLabelLayer: layerConfig.alarmBoxLabel
    }
  },
  computed: {
    ...mapGetters({
      alarmBoxResources: 'alarmBoxResourceArr', // 报警箱资源数据
      alarmBoxs: 'alarmBoxFeatures', // 报警箱要素
      alarmBoxLabels: 'alarmBoxLabelFeatures' // 报警箱名称要素
    }),
    ...mapGetters('mapAlarm', ['sosAlarmPointList', 'sosAlarmBuildList'])
  },
  watch: {
    alarmBoxResources: {
      handler(arr) {
        this.controlAlarmBoxShow() // 控制报警箱显示
        this.controlAlarmBoxLabelShow() // 控制报警箱名称显示
      },
      deep: true
    },
    alarmBox(flag) { // 报警箱点位显隐
      this.controlAlarmBoxShow() // 控制报警箱显示
      this.controlAlarmBoxLabelShow() // 控制报警箱名称显示
    },
    sosAlarmPointList() {
      if (this.alarmBox) { this.loadAlarmBoxFeatures() }
    },
    sosAlarmBuildList() {
      if (this.alarmBox) { this.loadAlarmBoxFeatures() }
    }
  },
  methods: {
    ...mapActions([
      'queryAlarmHelpRes',
      'setAlarmBoxFeatures',
      'setAlarmBoxLabelFeatures',
      'get2DAlarmHelpOrgTree'
    ]),
    loadAlarmBoxResources() { // 加载报警箱点位资源
      let query = {alarm: RESOURCETYPE.alarmBox}
      if (this.isMapOuter && this.activeMapConfig.mapId) {
        query.mapId = this.activeMapConfig.mapId
      } else { // 楼层地图
        query.sId = this.currentFloor._id
      }
      this.queryAlarmHelpRes(query)
    },
    controlAlarmBoxShow() { // 控制报警箱显示
      if (this.alarmBox) {
        this.loadAlarmBoxFeatures() // 加载报警箱点位要素
      } else {
        this.setAlarmBoxFeatures([])
      }
    },
    loadAlarmBoxFeatures() { // 加载报警箱点位要素
      const alarmList = JSON.parse(JSON.stringify(this.sosAlarmPointList)).concat(this.sosAlarmBuildList)
      const arr = this.showFeaturesList(this.alarmBoxResources, alarmList, 'alarmBox') // 报警闪烁时不显示普通点位
      let features = transAlarmHelp.transFeatures(arr, this.alarmBoxLayer)
      this.setAlarmBoxFeatures(features)
    },
    controlAlarmBoxLabelShow() { // 控制报警箱名称显示
      if (this.alarmBox && this.isNameTitle) {
        this.loadAlarmBoxLabelFeatures() // 加载报警箱名称要素
      } else {
        this.setAlarmBoxLabelFeatures([])
      }
    },
    loadAlarmBoxLabelFeatures() { // 加载报警箱名称要素
      let labelFeatures = featureBase.transLabelFeatures(this.alarmBoxResources, this.alarmBoxLabelLayer)
      this.setAlarmBoxLabelFeatures(labelFeatures)
    },
    handleHoverAlarmBoxFeature(attr) { // 处理鼠标悬浮报警箱图标要素
      // console.log('处理鼠标悬浮报警箱图标要素，要素信息：', attr)
      if (attr.type === this.alarmBoxLayer.name && !this.isNameTitle) { // 名称标签隐藏时，悬浮显示名称要素
        let labelFeature = featureBase.getHoverLabelFeature(attr, this.alarmBoxLabelLayer)
        labelFeature && this.setAlarmBoxLabelFeatures([labelFeature])
      }
    },
    clearAlarmBoxHoverFeatures() { // 清空报警箱悬浮要素显示
      if (!this.isNameTitle) {
        this.setAlarmBoxLabelFeatures([])
      }
    }
  }
}
