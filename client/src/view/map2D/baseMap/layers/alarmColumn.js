// 报警柱图层
import { mapGetters, mapActions } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import { RESOURCETYPE } from 'assets/2DMap/meta/common'
import featureBase from 'assets/2DMap/feature/base'
import transAlarmHelp from 'assets/2DMap/feature/apply/alarmHelp'
export default {
  data() {
    return {
      alarmColumnLayer: layerConfig.alarmColumn,
      alarmColumnLabelLayer: layerConfig.alarmColumnLabel
    }
  },
  computed: {
    ...mapGetters({
      alarmColumnResources: 'alarmColumnResourceArr', // 报警柱资源数据
      alarmColumns: 'alarmColumnFeatures', // 报警柱要素
      alarmColumnLabels: 'alarmColumnLabelFeatures' // 报警柱名称要素
    }),
    ...mapGetters('mapAlarm', ['sosAlarmPointList', 'sosAlarmBuildList'])
  },
  watch: {
    alarmColumnResources: {
      handler(arr) {
        this.controlAlarmColumnShow() // 控制报警柱显示
        this.controlAlarmColumnLabelShow() // 控制报警柱名称显示
      },
      deep: true
    },
    alarmColumn(flag) { // 报警柱点位显隐
      this.controlAlarmColumnShow() // 控制报警柱显示
      this.controlAlarmColumnLabelShow() // 控制报警柱名称显示
    },
    sosAlarmPointList() {
      if (this.alarmColumn) { this.loadAlarmColumnFeatures() }
    },
    sosAlarmBuildList() {
      if (this.alarmColumn) { this.loadAlarmColumnFeatures() }
    }
  },
  methods: {
    ...mapActions([
      'queryAlarmHelpRes',
      'setAlarmColumnFeatures',
      'setAlarmColumnLabelFeatures',
      'get2DAlarmHelpOrgTree'
    ]),
    loadAlarmColumnResources() { // 加载报警柱点位资源
      let query = {alarm: RESOURCETYPE.alarmColumn}
      if (this.isMapOuter) {
        query.mapId = this.activeMapConfig.mapId
      } else { // 楼层地图，根据楼层标识加载
        query.sId = this.currentFloor._id
      }
      this.queryAlarmHelpRes(query)
    },
    controlAlarmColumnShow() { // 控制报警柱显示
      if (this.alarmColumn) {
        this.loadAlarmColumnFeatures() // 加载报警柱点位要素
      } else {
        this.setAlarmColumnFeatures([])
      }
    },
    loadAlarmColumnFeatures() { // 加载报警柱点位要素
      const alarmList = JSON.parse(JSON.stringify(this.sosAlarmPointList)).concat(this.sosAlarmBuildList)
      const arr = this.showFeaturesList(this.alarmColumnResources, alarmList, 'alarmColumn') // 报警闪烁时不显示普通点位
      let features = transAlarmHelp.transFeatures(arr, this.alarmColumnLayer)
      this.setAlarmColumnFeatures(features)
    },
    controlAlarmColumnLabelShow() { // 控制报警柱名称显示
      if (this.alarmColumn && this.isNameTitle) {
        this.loadAlarmColumnLabelFeatures() // 加载报警柱名称要素
      } else {
        this.setAlarmColumnLabelFeatures([])
      }
    },
    loadAlarmColumnLabelFeatures() { // 加载报警柱名称要素
      let labelFeatures = featureBase.transLabelFeatures(this.alarmColumnResources, this.alarmColumnLabelLayer)
      this.setAlarmColumnLabelFeatures(labelFeatures)
    },
    handleHoverAlarmColumnFeature(attr) { // 处理鼠标悬浮报警柱图标要素
      // console.log('处理鼠标悬浮报警柱图标要素，要素信息：', attr)
      if (attr.type === this.alarmColumnLayer.name && !this.isNameTitle) { // 名称标签隐藏时，悬浮显示名称要素
        let labelFeature = featureBase.getHoverLabelFeature(attr, this.alarmColumnLabelLayer)
        labelFeature && this.setAlarmColumnLabelFeatures([labelFeature])
      }
    },
    clearAlarmColumnHoverFeatures() { // 清空报警柱悬浮要素显示
      if (!this.isNameTitle) {
        this.setAlarmColumnLabelFeatures([])
      }
    }
  }
}
