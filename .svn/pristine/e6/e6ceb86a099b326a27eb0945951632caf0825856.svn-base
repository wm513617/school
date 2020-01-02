<!--应用模式 进入楼层右边的楼层、楼宇简介  -->
<template>
  <div class="mapAppInfo">
    <div class="mapAppInfoTittle">
      <div class="mapAppVideoTittle">
        <div class="detail">楼层信息</div>
      </div>
    </div>
    <div class="mapAppInfoContent">
      <div class="infoTop">
        <div class="infoLeft">
          <div class="infoDetail">
            <div class="infoLabel">楼层</div>
            <div class="infoValue">{{floorInfo.name}}</div>
          </div>
          <div class="infoDetail">
            <div class="infoLabel">楼宇</div>
            <div class="infoValue">{{floorInfo.bid.name}}</div>
          </div>
          <div class="infoDetail">
            <div class="infoLabel">负责人</div>
            <div class="infoValue">{{floorInfo.pid.name}}</div>
          </div>
          <div class="infoDetail">
            <div class="infoLabel">电话</div>
            <div class="infoValue">{{floorInfo.pid.mobile}}</div>
          </div>
          <div class="infoDetail">
            <div class="infoLabel">简介</div>
            <div>{{floorInfo.desc}}</div>
          </div>
        </div>
        <div class="infoRight">统计信息
          <div class="statBody">
            <BSechart width="300px" height="220px" :options='statChartOptions'></BSechart>
          </div>
        </div>
      </div>
      <div v-if="levelList" class="infoBottom">
        <div class="">
          <div class="infoLabel">楼层索引</div>
          <div class="flootList" v-for="(item, index) in levelList" :key="index" @click="floorClick(item)">{{item.name}}</div>
        </div>
      </div>
    </div>
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
      floorInfo: {
        name: '',
        class: 16,
        bid: {
          name: ''
        },
        pid: {
          name: '',
          mobile: ''
        },
        desc: ''
      },
      statChartOptions: {}
    }
  },
  computed: {
    ...mapState({
      buildData: ({ mapGisData }) => mapGisData.buildData, // 单个楼宇信息
      levelList: ({ mapGisData }) => mapGisData.levelList, // 楼层列表
      appVedioIpcList: ({ mapVedioData }) => mapVedioData.appVedioIpcList,
      appVedioSectorList: ({ mapVedioData }) => mapVedioData.appVedioSectorList,
      levelData: ({ mapGisData }) => mapGisData.levelData, // 单个楼层信息
      mapFloorStic: ({ mapGisData }) => mapGisData.mapFloorStic // 楼层统计
    })
  },
  watch: {
    levelData(val) {
      if (val) {
        this.floorInfo.name = val.name
        this.floorInfo.desc = val.desc
        this.floorInfo.bid = val.bid
        this.floorInfo.pid.name = val.pid.name
        this.floorInfo.pid.mobile = val.pid.mobile
      }
    },
    mapFloorStic(val) {
      this.floorstic(val)
    }
  },
  methods: {
    ...mapActions(['getOneLevel']),
    ...mapMutations(['SET_APPDETAIL_STATE']),
    floorClick(val) {
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
    floorstic(val) {
      let floorStic = JSON.parse(JSON.stringify(val))
      let online = (floorStic.camera && floorStic.camera.online) ? floorStic.camera.online : 0
      let offline = (floorStic.camera && floorStic.camera.offline) ? floorStic.camera.offline : 0
      this.statChartOptions = appStatis.buildOrFlooorStaticPop(online, offline)
    },
    initData(data) {
      if (data.name) {
        this.floorInfo.name = data.name
        this.floorInfo.bid = data.bid
        this.floorInfo.pid = data.pid
        this.floorInfo.desc = data.desc
      }
    }
  },
  mounted() {
    this.floorstic(this.mapFloorStic)
    let data = JSON.parse(JSON.stringify(this.levelData))
    this.initData(data)
  }
}
</script>
<style scoped>
.mapAppInfo {
  color: #fff;
  font-size: 12px;
  width: 300px;
  background-color: #0f2343;
}
.mapAppInfo .mapAppInfoTittle {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background: #1b3153;
}
.mapAppInfoContent {
  width: 100%;
  clear: both;
  padding: 10px 20px;
}
.mapAppInfoContent .infoDetail {
  height: 26px;
  line-height: 26px;
  clear: both;
}
.mapAppInfoContent .infoDetail .infoLabel {
  width: 80px;
}
.mapAppInfoContent .flootList {
  display: inline-block;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  padding: 0px 5px;
  border-radius: 10px;
  border: 1px solid #5676a9;
  cursor: pointer;
  margin: 5px 3px;
}
.mapAppInfoContent .flootList:cover {
  color: #20adff;
}
.mapAppInfoContent .infoDetail > div {
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
}
</style>
