<!--应用模式 点击巡更点位的气泡弹框页面中的查看所有按钮 弹出的右边的巡更列表页面 -->
<template>
  <div class="mapAppInfo">
    <div class="mapAppInfoTittle">
      <div class="mapAppVideoTittle">
        <div class="reback">点位列表</div>
        <div class="detail">机构
          <Select v-model="org" size="small" style="width:100px;text-align:left;" @on-change="getOneOrgSel">
            <Option v-for="item in patrolOrgList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
      </div>
    </div>
    <div class="infoTop">
      <bs-scroll>
        <div class="infoHome" v-for="(item, index) in oneMapPartrolList" :key="index">
          <div class="infoTopLeft">
            <div class="infoTopLeftMain">
              <div class="infoTopItemLeft">{{item.devName}}</div>
              <div class="infoTopItemRight">{{item.devId}}</div>
            </div>
            <div class="infoTopLeftMain">
              <div class="infoTopItemLeft" :title="item.charger">{{item.charger}}</div>
              <div class="infoTopItemRight">{{item.phone}}</div>
            </div>
            <div class="infoTopLeftMain iconfont">
              <div class="patrolIcon icon-dianzixungeng" title="巡更">
                <p class="patrolNum patrolNumChOne">{{item.finished}}</p>
              </div>
              <div class="patrolIcon icon-baoxiu" title="保修">
                <p class="patrolNum patrolNumChTwo">{{item.warranty}}</p>
              </div>
              <div class="patrolIcon icon-baojing1" title="报警">
                <p class="patrolNum patrolNumChThree">{{item.alarm}}</p>
              </div>
            </div>
          </div>
          <div class="infoTopRight" @click="openSingone(item)">查看</div>
        </div>
      </bs-scroll>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  components: {},
  data() {
    return {
      org: '',
      oneMapPartrolList: []
    }
  },
  watch: {
    partrolList(val) {
      this.oneMapPartrolList = JSON.parse(JSON.stringify(val))
    }
  },
  created() {},
  mounted() {
    this.oneMapPartrolList = JSON.parse(JSON.stringify(this.partrolList))
  },
  computed: {
    ...mapState({
      partrolList: ({ patrolData }) => patrolData.oneMapPartrolList, // 巡更点位列表
      patrolOrgList: ({ patrolData }) => patrolData.patrolOrgList, // 巡更组织列表
      activeMap: ({ mapGisData }) => mapGisData.activeMap
    })
  },
  methods: {
    ...mapActions(['getOneMapPatrolList', 'getOnePatrolstatistic', 'getOnePatrol']),
    ...mapMutations(['SET_MAPAPPRIGHT_PAGE']),
    watchAll() {
      this.$store.commit('SET_MAPAPPRIGHT_PAGE', 'patrolList')
    },
    openSingone(val) {
      // this.$store.commit('SET_MAPAPPRIGHT_PAGE', '')
      this.$store.commit('SET_PATROLLISTDETAIL_SCAN', true) // 查看按钮是否可点击
      let onePatrol = this.getOnePatrol(val._id)
      let onePatrolstatistic = this.getOnePatrolstatistic(val._id)
      Promise.all([onePatrol, onePatrolstatistic])
        .then(res => {
          this.$store.commit('SET_APPDETAIL_STATE', 'patrolApp')
          this.$store.commit('SET_MAPAPPRIGHT_PAGE', '')
        })
        .catch(err => {
          console.log(err)
          this.errorMsg('巡更点位信息获取失败')
        })
    },
    getOneOrgSel(val) {
      this.getOneMapPatrolList({ mapid: this.activeMap, orgid: val })
        .then(res => {})
        .catch(err => {
          console.log(err)
        })
    }
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
  display: flex;
  flex: 1;
  flex-direction: column;
}

.mapAppInfo .mapAppInfoTittle {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 5px;
  background-color: #1c3053;
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
  float: right;
  margin: 0 10px;
}

.infoTop {
  display: flex;
  flex: 1;
  flex-direction: column;
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
}

.infoTop .infoHome {
  clear: both;
  display: block;
  background-color: #5676a9;
  border-radius: 5px;
  height: 80px;
  width: 280px;
  margin: 5px 10px;
}

.infoTop .infoTopLeft {
  float: left;
  width: 230px;
}

.infoTop .infoTopLeft .infoTopLeftMain {
  clear: both;
  height: 26px;
  line-height: 26px;
  display: block;
  width: 230px;
  padding: 0 10px;
  text-overflow: ellipsis;
  overflow: hidden;
}

.infoTopLeftMain .patrolIcon {
  float: left;
  width: 70px;
  font-size: 12px;
}

.infoTopLeftMain .patrolNum {
  padding: 0px 3px;
  display: inline-block;
}

.infoTopLeftMain .patrolNumChOne {
  color: #33cc00;
}

.infoTopLeftMain .patrolNumChTwo {
  color: #ff9900;
}

.infoTopLeftMain .patrolNumChThree {
  color: #ff3300;
}

.infoTop .infoTopLeft .infoTopLeftMain .infoTopItemLeft {
  float: left;
}

.infoTop .infoTopLeft .infoTopLeftMain .infoTopItemRight {
  float: right;
}

.infoTop .infoTopRight {
  float: left;
  width: 40px;
  height: 80px;
  text-align: center;
  line-height: 80px;
  border-left: 1px solid #ccc;
  cursor: default;
}
</style>
