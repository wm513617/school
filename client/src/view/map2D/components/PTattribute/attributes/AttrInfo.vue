<!-- 点位信息面板-通用逻辑控制脚本文件 -->
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { RESOURCETYPE } from 'src/assets/2DMap/meta/common'

export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapState({
      isGridStatistic: ({ map2DApplyIX }) => map2DApplyIX.isGridStatistic
    }),
    ...mapGetters(['mapResourceAttributes']),
    ...mapGetters('map2DApplyIX', [
      'isInfoPanelFixed' // 信息标签面板是否固定
    ])
  },
  methods: {
    ...mapMutations('map2DApplyIX', ['CHANGE_IS_GRID_STATISTIC']),
    ...mapMutations(['SET_SHOW_MAP_RESOURCE_ATTRIBUTES']),
    ...mapActions(['setSelectedMapPointRes', 'setCurrentGrid', 'setCurrentBuilding']),
    hidePanel() { // 隐藏面板
      let rType = this.mapResourceAttributes.rType
      switch (rType) {
        case RESOURCETYPE.grid:
          this.setCurrentGrid(null)
          break
        case RESOURCETYPE.building:
          this.setCurrentBuilding(null)
          break
        default:
          this.setSelectedMapPointRes(null)
          break
      }
      this.SET_SHOW_MAP_RESOURCE_ATTRIBUTES(false) // 关闭资源属性面板
      this.isGridStatistic && this.CHANGE_IS_GRID_STATISTIC(!this.isGridStatistic) // 关闭网格统计面板
    }
  }
}
</script>
