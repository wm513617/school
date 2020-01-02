<template>
  <div class="attr-video attr-panel">
    <header>
      <span class="title">巡更点位</span>
      <span class="status" title="异常次数" style="margin-right: 27px">
        <span class="iconfont icon-xungengbaojing1" style="color:red"></span>
        <span style="color: orange;">{{patrolData.repairNum || 0}}</span>
      </span>
      <span class="status" title="巡更次数">
        <span class="iconfont icon-dianzixungeng" style="color:white"></span>
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
          <span class="value" style="width: 60%" :title="patrolData.telContacts">{{attrInfo.telContacts}}</span>
          <Icon class="icon iconfont icon-phone" v-if="attrInfo.telContacts" :title="isCall && selectedMobile === attrInfo.telContacts ? '挂断电话' : '拨打电话'" @click="querySeatList" :style="{cursor: isCall && selectedMobile !== attrInfo.telContacts ? 'not-allowed' : 'pointer'}" :id="attrInfo.telContacts" :class="isCall && selectedMobile === attrInfo.telContacts ? 'icon-guaduan phone-down':'icon-dianhua'"/>
        </li>
        <li class="cut-off-line"></li>
        <li v-if="attrInfo.patrolMan">
          <span class="label">巡更人</span>
          <span class="value" :title="patrolData.patrolMan">{{attrInfo.patrolMan}}</span>
        </li>
        <li v-if="attrInfo.telPatrolMan">
          <span class="label">电话</span>
          <span class="value" style="width: 60%" :title="patrolData.telPatrolMan">{{attrInfo.telPatrolMan}}</span>
          <Icon class="icon iconfont icon-phone" v-if="attrInfo.telPatrolMan" :title="isCall && selectedMobile === attrInfo.telPatrolMan ? '挂断电话' : '拨打电话'" @click="querySeatList" :style="{cursor: isCall && selectedMobile !== attrInfo.telPatrolMan ? 'not-allowed' : 'pointer'}" :id="attrInfo.telPatrolMan" :class="isCall && selectedMobile === attrInfo.telPatrolMan ? 'icon-guaduan phone-down':'icon-dianhua'"/>
        </li>
      </ul>
    </section>
  </div>
</template>
<script>
import { mapActions, mapState, mapGetters} from 'vuex'
import AttrInfo from './AttrInfo'
import seatListFun from '../../../panelTools/seatModel/seatListFun'
export default {
  mixins: [AttrInfo, seatListFun],
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
    ...mapState({
      activeMapId: ({ mapIndex }) => mapIndex.activeMapConfig.mapId
    }),
    ...mapGetters('fengMapPoint', {
      attrInfo: 'getFengMapResourceAttributes'
    })
  },
  watch: {
    attrInfo(val) {
      if (val) {
        this.patrolDeal(val)
      }
    }
  },
  methods: {
    ...mapActions('fengMapApplyInteractive', ['getPatrolInfo']),
    ...mapActions(['get2DPatrolCountInfo']),
    patrolDeal(data) {
      this.patrolData = JSON.parse(JSON.stringify(this.attrInfo))
      this.get2DPatrolCountInfo(
        this.attrInfo.id
      ).then(suc => {
        console.log(suc.data.patrolAbnormal)
        this.patrolData.repairNum = suc.data.patrolAbnormal
        this.patrolData.patrolNum = suc.data.patrolNormal
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted() {
    this.attrInfo && this.patrolDeal(this.attrInfo)
  }
}
</script>
<style lang="less" scoped>
  @import url(./style.less);
  header{
    .status{
      float: right;
    }
  }
  .icon-phone {
    width: 10%;
    font-size: 12px;
    cursor: pointer;
  }
  .phone-down {
    color: red;
  }
</style>
