<template>
  <div class="attr-video attr-panel">
    <header>
      <span class="title">巡更点位</span>
      <span class="status">
        <Icon type="information-circled" style="color: red;"></Icon>
        <span style="color: orange;">{{patrolData.repairNum || 0}}</span>
      </span>
      <span class="status">
        <Icon type="ios-bell" style="color: orange;"></Icon>
        <span style="color: orange;">{{patrolData.alarmNum || 0}}</span>
      </span>
      <span class="status">
        <Icon type="arrow-graph-down-right"></Icon>
        <span style="color: green;">{{patrolData.patrolNum || 0}}</span>
      </span>
    </header>
    <section class="main">
      <ul class="info-list">
        <li v-if="attrInfo.name">
          <span class="label">点位名称</span>
          <span class="value" :title="patrolData.name">{{attrInfo.name}}</span>
        </li>
        <li v-if="attrInfo.contacts">
          <span class="label">负责人</span>
          <span class="value" :title="patrolData.contacts">{{attrInfo.contacts}}</span>
        </li>
        <li v-if="attrInfo.telContacts">
          <span class="label">电话</span>
          <span class="value" :title="patrolData.telContacts">{{attrInfo.telContacts}}</span>
        </li>
        <li class="cut-off-line"></li>
        <li v-if="attrInfo.patrolMan">
          <span class="label">巡更人</span>
          <span class="value" :title="patrolData.patrolMan">{{attrInfo.patrolMan}}</span>
        </li>
        <li v-if="attrInfo.telPatrolMan">
          <span class="label">电话</span>
          <span class="value" :title="patrolData.telPatrolMan">{{attrInfo.telPatrolMan}}</span>
        </li>
      </ul>
    </section>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {
      patrolData: {
        repairNum: 0,
        alarmNum: 0,
        patrolNum: 0,
        name: '',
        contacts: '',
        telContacts: '',
        patrolMan: '',
        telPatrolMan: ''
      }
    }
  },
  computed: {
    ...mapGetters('map3DApplyIX', ['attrInfo'])
  },
  watch: {
    attrInfo(val) {
      if (val) {
        this.patrolDeal(val)
      }
    }
  },
  methods: {
    ...mapActions('map3DApplyIX', ['getPatrolInfo']),
    patrolDeal(data) {
      this.patrolData = JSON.parse(JSON.stringify(this.attrInfo))
      this.getPatrolInfo(data.id).then(suc => {
        this.patrolData.repairNum = suc.data.warranty || 0
        this.patrolData.alarmNum = suc.data.alarm || 0
        this.patrolData.patrolNum = suc.data.timeout || 0
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import url(./style.less);
</style>
