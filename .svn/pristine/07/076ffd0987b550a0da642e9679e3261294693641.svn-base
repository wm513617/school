<!--应用模式 勾选点位元素中的移动单兵点击气泡弹框点击查看列表 右边的弹出页面 -->
<template>
  <div class="mapAppInfo">
    <div class="mapAppInfoTittle">
      <div class="mapAppVideoTittle">
        <div class="reback">人员列表</div>
        <div class="detail">
          <Select v-model="org" size="small" style="width:100px" @on-change="getOneOrgSel">
            <Option v-for="item in patrolOrgList" :value="item._id" :key="item._id">{{ item.name }}</Option>
          </Select>
        </div>
        <div class="detail">
          <Input v-model="searchName" :maxlength="8" placeholder="输入关键字搜索" size="small" style="width: 100px" @on-enter="searchInput" />
        </div>
      </div>
    </div>
    <div class="infoTop">
      <bs-scroll>
        <div class="infoHome" v-for="(item, index) in mobileSingleList" :key="index">
          <div class="infoTopLeft">
            <!-- 实时位置信息 -->
            <div class="infoTopLeftPosi">
              <div class="iconfont icon-guijifenxi posiIcon" title="实时定位"></div>
            </div>
            <!-- 头像信息 -->
            <div class="infoTopLeftImg">
              <div class="imgInfo">
                <img :src="'/api/upload?id=' + item.photo" alt="">
              </div>
            </div>
            <!-- 职位等信息 -->
            <div class="infoTopLeftInfo">
              <div class="infoItem">
                <div class="infoItemLabel">姓名:</div>
                <div class="infoItemValue">{{item.realname}}</div>
              </div>
              <div class="infoItem">
                <div class="infoItemLabel">职位:</div>
                <div class="infoItemValue">{{item.position}}</div>
              </div>
              <div class="infoItem">
                <div class="infoItemLabel">工号:</div>
                <div class="infoItemValue">{{item.id}}</div>
              </div>
            </div>
          </div>
          <div class="infoTopRight">
            <!-- <div class="rightItem" @click="openSingone(item)" style="border-bottom: 1px solid #ccc;">视频</div> -->
            <div class="rightItem" @click="openSingone(item)">任务</div>
          </div>
        </div>
      </bs-scroll>
    </div>
    <div class="mapAppInfoTittle">
      <div class="mapAppVideoTittle">
        <div class="detail detailIcon">
          <div class="iconfont icon-xiaoxi" title="发送信息" @click="sendMsg"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import appPatrolIpc from '../../../../assets/map/app/appPatrolIpc'
export default {
  data() {
    return {
      org: '',
      mobileSingleList: [],
      patrolOrgList: [],
      searchName: ''
    }
  },
  computed: {
    ...mapState({
      activeMap: ({ mapGisData }) => mapGisData.activeMap,
      appPatrolLineList: ({ patrolData }) => patrolData.appPatrolLineList,
      mobilePatrolList: ({ mobilePatrol }) => mobilePatrol.mobilePatrolList, // 当前巡更人员
      mobilePatrolTask: ({ mobilePatrol }) => mobilePatrol.mobilePatrolTask, // 当前巡更任务
      mobilePatrolOrglist: ({ mobilePatrol }) => mobilePatrol.mobilePatrolOrglist // 巡更组织
    })
  },
  watch: {
    mobilePatrolList(val) {
      this.mobileSingleList = JSON.parse(JSON.stringify(val))
    },
    mobilePatrolOrglist(val) {
      this.patrolOrgList = JSON.parse(JSON.stringify(val))
    }
  },
  methods: {
    ...mapActions(['getMobilePatrol', 'getMobilePatrolTask', 'getMobilePatrolOrgList']),
    ...mapMutations(['SET_APPPATROLLINE_LIST']),
    // 获取巡更任务，注意单兵的任务是巡更点位连线
    openSingone(val) {
      this.getMobilePatrolTask(val.recordId)
        .then(res => {
          this.$store.commit('SET_MAPAPPRIGHT_PAGE', '')
          let patrollines = appPatrolIpc.connectPatrolIpc(this.appPatrolLineList, res)
          // let patrollines = appPatrolIpc.connectPatrolIpc(this.appPatrolLineList)
          this.$store.commit('SET_APPPATROLLINE_LIST', patrollines)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取移动单兵
    getMobileSingle(val) {
      this.getMobilePatrol(val)
        .then(res => {
          this.mobileSingleList = JSON.parse(JSON.stringify(res))
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 发送信息
    sendMsg() {
      this.$store.commit('SET_SENDMESSAGE_STATE', true)
    },
    getOneOrgSel(val) {
      this.getMobileSingle({ name: this.searchName, orgId: this.org })
    },
    // 根据姓名查找
    searchInput(val) {
      this.getMobileSingle({ name: this.searchName, orgId: this.org })
    }
  },
  created() {
    this.getMobileSingle({ name: '', orgId: '' })
    this.getMobilePatrolOrgList()
      .then(res => {
        this.patrolOrgList = JSON.parse(JSON.stringify(res))
      })
      .catch(err => {
        console.log(err)
      })
  },
  mounted() {
    this.patrolOrgList = JSON.parse(JSON.stringify(this.mobilePatrolOrglist))
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
  padding: 3px 10px;
}
.mapAppVideoTittle .reback {
  float: left;
  margin-right: 24px;
}
.mapAppVideoTittle .detail {
  float: right;
  margin-left: 10px;
}
.mapAppVideoTittle .detailIcon {
  cursor: pointer;
}
.mapAppVideoTittle .detailIcon:hover {
  color: #20adff;
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
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: row;
  cursor: default;
}
.infoTop .infoTopLeft .infoTopLeftPosi {
  width: 30px;
  height: 100%;
}
.infoTop .infoTopLeft .infoTopLeftPosi .posiIcon {
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 14px;
}
.infoTop .infoTopLeft .infoTopLeftImg {
  width: 80px;
  height: 100%;
  padding: 10px;
}
.infoTop .infoTopLeft .infoTopLeftImg .imgInfo {
  width: 100%;
  height: 100%;
}
.infoTop .infoTopLeft .infoTopLeftImg .imgInfo img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.infoTop .infoTopLeft .infoTopLeftInfo {
  display: flex;
  flex: 1;
  flex-direction: column;
}
.infoTop .infoTopLeft .infoTopLeftInfo .infoItem {
  width: 100%;
  height: 26px;
  line-height: 26px;
  display: flex;
  flex-direction: row;
}
.infoTop .infoTopLeft .infoTopLeftInfo .infoItem .infoItemLabel {
  width: 35px;
}
.infoTop .infoTopLeft .infoTopLeftInfo .infoItem .infoItemValue {
  display: flex;
  flex: 1;
}
.infoTop .infoTopRight {
  float: left;
  width: 40px;
  height: 80px;
  text-align: center;
  border-left: 1px solid #ccc;
  cursor: default;
}
.infoTop .infoTopRight .rightItem {
  width: 100%;
  height: 80px;
  line-height: 80px;
  cursor: pointer;
}
.infoTop .infoTopRight .rightItem:hover {
  color: #20adff;
}
</style>
