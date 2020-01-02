// 区域绘制相关的逻辑
import { mapGetters, mapActions, mapState } from 'vuex'
import { GEOMETRYTYPE } from 'assets/2DMap/meta/common'
import drawConfig from 'assets/2DMap/meta/draw'
export default {
  data() {
    return {
      areaQuery: JSON.parse(JSON.stringify(drawConfig.areaQuery))
    }
  },
  computed: {
    ...mapState({
      currentFloor: ({ mapArea }) => mapArea.currentFloor,
      activeMapConfig: ({ mapIndex }) => mapIndex.activeMapConfig
    }),
    ...mapGetters(['isMapOuter', 'areaDrawActive']),
    ...mapGetters('map2DApplyIX', ['boxChooseType'])
  },
  watch: {
    areaDrawActive(flag) { // 区域绘制状态变化
      if (flag) {
        this.changeBoxChooseDrawTips(this.boxChooseType) // 改变框选绘制提示信息
      } else {
        this.clearDrawAreaFeatures() // 清空绘制区域
      }
    },
    boxChooseType(type) { // 框选类型变化
      if (type && [GEOMETRYTYPE.MULTIPOLYGON, GEOMETRYTYPE.CIRCLE].includes(type)) {
        this.changeBoxChooseDrawTips(type) // 改变框选绘制提示信息
      }
    }
  },
  methods: {
    ...mapActions('map2DApplyIX', ['changeToolsPanelToBoxChoose', 'getStatisticsCountByBox']),
    ...mapActions(['get2DSelectBoxData', 'setAreaDrawActive']),
    clearDrawAreaFeatures() { // 清空绘制区域
      this.clearFeaturesInLayer(this.areaQuery.id)
    },
    changeBoxChooseDrawTips(type) { // 改变框选绘制提示信息
      this.areaQuery.type = type
      if (type === GEOMETRYTYPE.MULTIPOLYGON) { // 多边形
        this.areaQuery.drawStyle.textStyle.label = '单击绘制区域节点，双击结束'
      } else if (GEOMETRYTYPE.CIRCLE) { // 圆
        this.areaQuery.drawStyle.textStyle.label = '单击开始绘制中心，再次单击结束'
      }
    },
    drawAreaFinish(res) { // 绘制区域完成
      // console.log('绘制区域完成，绘制参数：', res)
      this.setAreaDrawActive(false)
      if (res.wkt) {
        let sid = ''
        if (!this.isMapOuter) {
          sid = this.currentFloor._id
        }
        let param = {wkt: res.wkt, sid, mapProjection: this.mapProjection}
        this.get2DSelectBoxData(param).then(() => {
          this.changeToolsPanelToBoxChoose('boxChoose')
        }).catch(err => {
          console.log(err)
        })
        this.getStatisticsCountByBox({ mapId: this.activeMapConfig.mapId, param: param })
      }
    }
  }
}
