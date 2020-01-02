<!--应用模式 点击地图上移动单兵的气泡弹框页面-->
<template>
  <div class="mapAppInfo">
    <div class="mapAppInfoTittle">
      <div class="mapAppVideoTittle">
        <div class="detail">单兵信息</div>
        <div class="close iconfont icon-error" @click.prevent="close" title="关闭"></div>
      </div>
    </div>
    <div class="mapAppInfoContent">
      <div class="infoTop">
        <div class="infoDetail">
          <div class="infoLabel">用户名</div>
          <div class="infoValue">{{oneSingleData.realname}}</div>
        </div>
        <div class="infoDetail">
          <div class="infoLabel">工号</div>
          <div class="infoValue">{{oneSingleData.id}}</div>
        </div>
        <!-- <div class="infoDetail">
          <div class="infoLabel">编号</div>
          <div class="infoValue">{{}}</div>
        </div> -->
        <!-- <div class="infoDetail">
          <div class="infoLabel">状态</div>
          <div class="infoValue"></div>
        </div>
        <div class="infoDetail">
          <div class="infoLabel">点位类型</div>
          <div class="infoValue"></div>
        </div>
        <div class="infoDetail">
          <div class="infoLabel">负责单位</div>
          <div class="infoValue"></div>
        </div> -->
        <!-- <div v-for="(item, index) in oneAlarmData.point.principal" :key="index">
          <div class="infoDetail">
            <div class="infoLabel">负责人</div>
            <div class="infoValue">{{item.name}}</div>
          </div>
          <div class="infoDetail">
            <div class="infoLabel">电话</div>
            <div class="infoValue">{{item.mobile}}</div>
          </div>
        </div> -->
        <!-- <div class="infoDetail">
          <div class="infoLabel">布防时间</div>
          <div class="infoValue"></div>
        </div>
        <div class="infoDetail">
          <div class="infoLabel">简介</div>
          <div class="infoValue"></div>
        </div> -->
        <!-- <Button type="primary" @click="setAlarmArm" :disabled="isOnline ? defensestatus : true">布防</Button>
        <Button type="primary" @click="setAlarmUnArm" :disabled="isOnline ? !defensestatus : true">撤防</Button> -->
        <Button type="primary" @click="openall">查看列表</Button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
// import appMoveSingle from '../../../../assets/map/app/appMoveSingle'
export default {
  data() {
    return {
      singleData: {
        realname: '',
        id: ''
      }
    }
  },
  computed: {
    ...mapState({
      oneSingleData: ({ mobilePatrol }) => mobilePatrol.oneSingleData
    })
  },
  watch: {
    oneSingleData(val) {
      this.singleData.realname = this.oneSingleData.realname
      this.singleData.id = this.oneSingleData.id
    }
  },
  methods: {
    ...mapActions([]),
    ...mapMutations(['SET_MAPAPPRIGHT_PAGE']),
    close() {
      this.$store.commit('SET_APPDETAIL_STATE', '')
    },
    openall() {
      this.$store.commit('SET_MAPAPPRIGHT_PAGE', 'mobileSingle')
    }
  },
  mounted() {}
}
</script>
<style scoped>
.mapAppInfo {
  color: #fff;
  font-size: 12px;
  background-color: #0f2343;
  border-radius: 5px;
  width: 300px;
}
.mapAppVideoTittle {
  height: 40px;
  line-height: 40px;
  width: 100%;
  text-align: center;
  cursor: default;
  clear: both;
  border-radius: 5px;
  background-color: rgb(1, 21, 50);
}
.mapAppVideoTittle .detail {
  float: left;
  margin: 0 24px;
}
.mapAppVideoTittle .close {
  float: right;
  margin: 0 10px;
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
  width: 100%;
  height: 26px;
  line-height: 26px;
  clear: both;
}
.mapAppInfoContent .infoDetail .infoLabel {
  width: 60px;
}
.mapAppInfoContent .infoDetail .infoValue {
  width: 140px;
}
.mapAppInfoContent .infoDetail > div {
  float: left;
}
</style>
