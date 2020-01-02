// 点位绘制处理逻辑
import { mapGetters } from 'vuex'
import drawConfig from 'assets/2DMap/meta/draw'
export default {
  data() {
    return {
      pointDraw: JSON.parse(JSON.stringify(drawConfig.boltipc)) // 点位绘制，默认是枪机
    }
  },
  computed: {
    ...mapGetters('fengMap', {
      pointFMDrawActive: 'pointFMDrawActive'
    })
  },
  watch: {
    pointFMDrawActive(flag) { // 点位绘制是否激活
      this.updatePointDrawer(flag) // 更新点位绘制工具
    }
  },
  methods: {
    updatePointDrawer(flag) { // 更新点位绘制工具
      if (flag) {
        this.regDrawPointMouseTip()
      } else {
        this.unRegDrawPointMouseTip() // 清空绘制点位要素
      }
    }
  }
}
