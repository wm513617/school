<!--应用模式 点击网格的气泡弹框页面  -->
<template>
  <div class="mapAppInfo">
    <div class="mapAppInfoTittle">
      <div class="mapAppVideoTittle">
        <div class="detail">网格信息</div>
        <div class="close iconfont icon-error" @click.prevent="close" title="关闭"></div>
      </div>
    </div>
    <div class="mapAppInfoContent">
      <Tabs size="small">
        <TabPane label="详细信息">
          <div class="infoDetail">
            <div class="infoLabel">网格名称</div>
            <div class="infoValue">{{gridData.name}}</div>
          </div>
          <div class="infoDetail">
            <div class="infoLabel">网格编号</div>
            <div class="infoValue">{{gridData.code}}</div>
          </div>
          <div class="infoDetail">
            <div class="infoLabel">负责单位</div>
            <div class="infoValue">{{gridData.charge}}</div>
          </div>
          <div v-for="(item, index) in gridData.pids" :key="index">
            <div class="infoDetail">
              <div class="infoLabel">负责人</div>
              <div class="infoValue">{{item.name}}</div>
            </div>
            <div class="infoDetail">
              <div class="infoLabel">电话</div>
              <div class="infoValue">{{item.mobile}}</div>
            </div>
          </div>
          <div class="infoDetail">
            <div class="infoLabel">简介</div>
            <div class="word-wrap">{{gridData.desc}}</div>
          </div>
        </TabPane>
        <TabPane label="统计信息">
          <div class="infoRight">
            <div class="statBody">
              <BSechart height="220px" :options='statChartOptions'></BSechart>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </div>

  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import BSechart from '../../../../components/BSechart'
import appStatis from '../../../../assets/map/app/appStatis.js'
export default {
  components: {
    BSechart
  },
  data() {
    return {
      statChartOptions: {}
    }
  },
  watch: {
    mapGridStic(val) {
      this.gridStatic(val)
    }
  },
  created() {},
  computed: {
    ...mapState({
      gridData: ({ mapGisData }) => mapGisData.gridData, // 单个网格信息
      mapGridStic: ({ mapGisData }) => mapGisData.mapGridStic
    })
  },
  methods: {
    ...mapMutations(['SET_APPDETAIL_STATE']),
    close() {
      this.$store.commit('SET_APPDETAIL_STATE', '')
    },
    gridStatic(val) {
      let stic = JSON.parse(JSON.stringify(val))
      let online = stic.camera.online
      let offline = stic.camera.offline
      let building = stic.building
      this.statChartOptions = appStatis.grigStaticPop({ online, offline, building })
    }
  },
  mounted() {
    this.gridStatic(this.mapGridStic)
  }
}
</script>
<style scoped>
.mapAppInfo {
  color: #fff;
  font-size: 12px;
  background-color: #0f2343;
  width: 300px;
  border-radius: 5px;
}
.mapAppInfo .mapAppInfoTittle {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 5px;
  background-color: #1c3053;
}
.mapAppInfoContent {
  width: 100%;
  clear: both;
  padding: 10px;
}
.mapAppInfoContent .infoDetail {
  height: 26px;
  line-height: 26px;
  clear: both;
  padding: 0 10px;
}
.mapAppInfoContent .infoDetail .infoLabel {
  width: 80px;
}
.mapAppInfoContent .infoDetail > div {
  float: left;
}
.statBody {
  height: 220px;
  width: 280px;
}
.mapAppVideoTittle {
  height: 38px;
  line-height: 38px;
  width: 100%;
  text-align: center;
  cursor: default;
  clear: both;
  border-radius: 5px;
}
.mapAppVideoTittle .reback {
  float: left;
  margin: 0 10px;
}
.mapAppVideoTittle .detail {
  float: left;
  margin: 0 24px;
}
.mapAppVideoTittle .close {
  float: right;
  margin: 0 10px;
}
.word-wrap {
  width: 262px;
  word-wrap: break-word;
}
</style>
