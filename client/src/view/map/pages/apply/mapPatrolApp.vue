<!--应用模式 点击巡更点位的气泡弹框页面 -->
<template>
  <div class="mapAppInfo">
    <div class="mapAppInfoTittle">
      <div class="mapAppVideoTittle">
        <div class="detail">巡更点位</div>
        <div class="close iconfont icon-error" @click.prevent="close" title="关闭"></div>
      </div>
    </div>
    <div class="mapAppInfoContent">
      <div class="infoLeft">
        <div class="buildImg">
          <img v-if="onePartrol.photo" style="width:100%" :src="'/api/upload?id=' + onePartrol.photo">
        </div>
        <div class="infoDetail">
          <div class="infoLabel">点位名称</div>
          <div class="infoValue">{{onePartrol.devName}}</div>
        </div>
        <div class="infoDetail">
          <div class="infoLabel">设备ID</div>
          <div class="infoValue">{{onePartrol.devId}}</div>
        </div>
        <div class="infoDetail">
          <div class="infoLabel">设备编码</div>
          <div class="infoValue">{{onePartrol.devCode}}</div>
        </div>
        <div class="infoDetail">
          <div class="infoLabel">所属机构</div>
          <div class="infoValue">{{onePartrol.orgName}}</div>
        </div>
        <div class="infoDetail">
          <div class="infoLabel">负责人</div>
          <div class="infoValue">{{onePartrol.charger}}</div>
        </div>
        <div class="infoDetail">
          <div class="infoLabel">电话</div>
          <div class="infoValue">{{onePartrol.phone}}</div>
        </div>
        <div class="infoDetail">
          <div class="infoLabel">简介</div>
          <div>{{onePartrol.remark}}</div>
        </div>
      </div>
      <div class="infoButtom">
        <div class="infoButtomLeft">今日已被巡更{{onePatrolStic.pratrol}}次</div>
        <!-- <div class="infoButtomRight" @click="watchAll">查看所有</div> -->
        <Button class="infoButtomRight" @click="watchAll" v-if="isShowButton">查看所有</Button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  components: {},
  data() {
    return {
      onePartrol: {},
      isShowButton: true
    }
  },
  computed: {
    ...mapState({
      onePartrolData: ({ patrolData }) => patrolData.onePartrol, // 单个巡更点位
      onePatrolStic: ({ patrolData }) => patrolData.onePatrolStic, // 单个巡更点位巡更次数
      activeMap: ({ mapGisData }) => mapGisData.activeMap,
      isAppOuter: ({ mapAreaData }) => mapAreaData.isAppOuter // 楼层内外
    })
  },
  watch: {
    onePartrolData(val) {
      this.onePartrol = JSON.parse(JSON.stringify(val))
    }
  },
  methods: {
    ...mapActions(['getPatrolOrgList', 'getOneMapPatrolList']),
    ...mapMutations(['SET_APPDETAIL_STATE', 'GET_ONEPARTROL_DATA']),
    close() {
      this.$store.commit('SET_APPDETAIL_STATE', '')
    },
    watchAll() {
      this.$store.commit('SET_PATROLLISTDETAIL_SCAN', false) // 查看按钮是否点击
      this.getPatrolOrgList()
        .then(res => {
          console.log(res, 'res')
          this.getOneMapPatrolList({ mapid: this.activeMap, orgid: '' })
            .then(res => {
              this.$store.commit('SET_MAPAPPRIGHT_PAGE', 'patrolList')
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted() {
    this.onePartrol = JSON.parse(JSON.stringify(this.onePartrolData))
    this.isShowButton = JSON.parse(JSON.stringify(this.isAppOuter))
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
.mapAppInfoContent .infoDetail .infoValue {
  width: 180px;
  float: left;
  overflow: hidden;
}

.mapAppInfoContent .infoDetail > div {
  float: left;
  word-break: break-all;
  word-wrap: break-word;
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
  margin: 0 24px;
}

.mapAppVideoTittle .detail {
  float: left;
  margin: 0 24px;
}

.mapAppVideoTittle .close {
  float: right;
  margin: 0 10px;
}

.infoTop {
  width: 100%;
  height: 340px;
}

.infoButtom {
  width: 100%;
  height: 40px;
  line-height: 40px;
  background-color: #0f2343;
  clear: both;
  padding: 0px 10px;
}

.infoButtom .infoButtomLeft {
  float: left;
}

.infoButtom .infoButtomRight {
  float: right;
  background-color: #4699f9;
  margin-top: 10px;
}
</style>
