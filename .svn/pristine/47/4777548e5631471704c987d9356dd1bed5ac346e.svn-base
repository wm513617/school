<!--应用模式 点击巡更汇聚点位的气泡弹框页面 -->
<template>
  <div class="mapAppParInfo">
    <bs-scroll>
      <div v-for="(item, index) in oneFloorPartrolList.store" :key="index">
        <div class="">
          <div class="partrolItemP">
            <p class="iconfont icon-tuceng"></p>
            <p class="partrolText">{{item.name}}</p>
          </div>
          <div v-for="(itemPro, indexI) in item.point" :key="indexI" @click="partrolClick(item)">
            <div class="partrolItemP partrolItem">
              <p class="iconfont icon-dianzixungeng"></p>
              <p class="partrolText">{{itemPro.devName}}</p>
            </div>
          </div>
        </div>
      </div>
    </bs-scroll>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      oneFloorPartrolList: []
    }
  },
  computed: {
    ...mapState({
      patrolConverData: ({ patrolData }) => patrolData.patrolConverData // 单个巡更点位
    })
  },
  watch: {
    patrolConverData(val) {
      this.oneFloorPartrolList = JSON.parse(JSON.stringify(val))
    }
  },
  methods: {
    ...mapActions(['getOneLevel']),
    partrolClick(item) {
      this.$store.commit('SET_ISAPPOUTER_STATE', false)
      this.$store.commit('SET_FLOOR_ID', item.sid)
      this.getOneLevel(item.sid)
        .then(res => {})
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted() {
    this.oneFloorPartrolList = JSON.parse(JSON.stringify(this.patrolConverData))
  }
}
</script>
<style scoped>
.mapAppParInfo {
  color: #fff;
  font-size: 12px;
  background-color: #0f2343;
  border-radius: 5px;
  width: 200px;
  padding: 5px 10px;
  height: 200px;
}
.mapAppParInfo .partrolItem {
  height: 26px;
  width: 150px;
  line-height: 26px;
  text-indent: 15px;
  cursor: pointer;
}
.mapAppParInfo .partrolItem:hover {
  color: #20adff;
}
.mapAppParInfo .partrolItemP p {
  display: inline-block;
  text-indent: 10px;
}
.mapAppParInfo .partrolText {
  font-size: 12px;
}
</style>
