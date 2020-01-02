<!--应用模式 点击楼宇的气泡弹框页面  -->
<template>
  <div class="mapAppInfo">
    <div class="mapAppInfoTittle">
      <div class="mapAppVideoTittle">
        <div class="detail">楼宇信息</div>
        <div class="close iconfont icon-error" @click.prevent="close" title="关闭"></div>
      </div>
    </div>
    <!-- <div class="mapAppInfoContent"> -->
    <Tabs value="detailInfo" size="small">
      <TabPane label="详细信息" name="detailInfo">
        <div class="infoTop">
          <div class="infoLeft">
            <div class="buildImg">
              <img v-if="buildData.picture" style="width:100%" :src="'/api/upload?id=' + buildData.picture">
            </div>
            <div class="infoDetail">
              <div class="infoLabel">楼宇信息</div>
              <div class="infoValue">{{buildData.name}}</div>
            </div>
            <div class="infoDetail">
              <div class="infoLabel">楼宇编号</div>
              <div class="infoValue">{{buildData.code}}</div>
            </div>
            <div class="infoDetail" v-if="buildData.gid">
              <div class="infoLabel">所属网格</div>
              <div class="infoValue">{{buildData.gid.name}}</div>
            </div>
            <div class="infoDetail">
              <div class="infoLabel">负责单位</div>
              <div class="infoValue">{{buildData.charge}}</div>
            </div>
            <div v-for="(item, index) in buildData.pid" :key="index">
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
              <div class="word-wrap">{{buildData.desc}}</div>
            </div>
            <div class="infoDetail">
              <div class="infoLabel">楼层索引</div>
            </div>
            <div class="infoDetail">
              <div class="flootList" v-for="(item, index) in levelList" :key="index" @click="floorClick(item)">{{item.name}}</div>
            </div>
          </div>
        </div>
      </TabPane>
      <TabPane label="统计信息" name="staticInfo">
        <div class="infoRight">
          <div class="statBody">
            <BSechart width="280px" height="220px" :options='statChartOptions'></BSechart>
          </div>
        </div>
      </TabPane>
      <!-- <TabPane v-if="levelList.length > 0" label="楼层索引" name="floorInfo">
          <div class="infoBottom">
            <div class="">
              <div class="flootList" v-for="(item, index) in levelList" :key="index" @click="floorClick(item)">{{item.name}}</div>
            </div>
          </div>
        </TabPane> -->
    </Tabs>
    <!-- </div> -->

  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
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
  computed: {
    ...mapState({
      buildData: ({ mapGisData }) => mapGisData.buildData, // 单个楼宇信息
      levelList: ({ mapGisData }) => mapGisData.levelList, // 楼层列表
      mapBuildStic: ({ mapGisData }) => mapGisData.mapBuildStic // 楼宇统计
    })
  },
  watch: {
    mapBuildStic(val) {
      this.buildStatic(val)
    }
  },
  methods: {
    ...mapActions(['getOneLevel']),
    ...mapMutations(['SET_APPDETAIL_STATE']),
    floorClick(val) {
      this.$store.commit('SET_ISAPPOUTER_STATE', false)
      this.$store.commit('SET_FLOOR_ID', val._id)
      this.getOneLevel(val._id)
        .then(res => {})
        .catch(err => {
          console.log(err)
        })
    },
    close() {
      this.$store.commit('SET_APPDETAIL_STATE', '')
    },
    buildStatic(val) {
      let stic = JSON.parse(JSON.stringify(val))
      let online = stic.camera.online
      let offline = stic.camera.offline
      this.statChartOptions = appStatis.buildOrFlooorStaticPop(online, offline)
    }
  },
  mounted() {
    this.buildStatic(this.mapBuildStic)
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
  /* width: 100%; */
  /* clear: both; */
  padding: 10px;
}
.mapAppInfoContent1 {
  /* width: 100%; */
  /* clear: both; */
  padding: 10px;
}
.mapAppInfoContent,
.infoDetail {
  height: 26px;
  line-height: 26px;
  clear: both;
  padding: 0 10px;
}
.mapAppInfoContent,
.infoDetail .infoLabel {
  width: 80px;
}
.mapAppInfoContent,
.flootList {
  display: inline-block;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  padding: 0px 5px;
  border-radius: 10px;
  border: 1px solid #5676a9;
  cursor: default;
  margin: 5px 3px;
}
.mapAppInfoContent,
.infoDetail > div {
  float: left;
}
.statBody {
  height: 220px;
  width: 280px;
}
.mapAppVideoTittle {
  height: 40px;
  line-height: 40px;
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
.ivu-tabs {
  margin: 10px 10px 0 10px;
  border-radius: 5px;
}
.word-wrap {
  width: 262px;
  word-wrap: break-word;
}
</style>
