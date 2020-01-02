<template>
  <div class="attr-video attr-panel">
    <header>
      <span class="title">网格信息</span>
      <i v-if="!isInfoPanelFixed" class="btn icon iconfont icon-close1" :style="{'font-size': '14px', 'margin-left': '8px'}" title="关闭" @click="hidePanel"></i>
      <span
        :class="['iconfont', 'icon-hidemenu-copy-copy', isGridStatistic ? '' : 'trans-roate']"
        @click="openResourcePanel" :title="isGridStatistic ? '关闭统计面板' : '打开统计面板'"
      ></span>
    </header>
    <section class="main">
      <ul class="info-list">
        <li v-if="attrInfo.name">
          <span class="label">网格名称</span>
          <span class="value" :title="attrInfo.name">{{attrInfo.name}}</span>
        </li>
        <li v-if="attrInfo.number">
          <span class="label">网格编号</span>
          <span class="value" :title="attrInfo.number">{{attrInfo.number}}</span>
        </li>
        <div v-for="(val, i) in attrInfo.contactsInfo" :key="i">
          <li v-if="val.contacts">
            <span class="label">联系人</span>
            <span class="value" :title="val.contacts">{{val.contacts}}</span>
          </li>
          <li v-if="val.telContacts">
            <span class="label">电话</span>
            <span class="value" style="width: 60%" :title="val.telContacts">{{val.telContacts}}</span>
            <Icon class="icon iconfont icon-phone" v-if="val.telContacts" :title="isCall && selectedMobile === val.telContacts ? '挂断电话' : '拨打电话'" @click="querySeatList" :style="{cursor: isCall && selectedMobile !== val.telContacts ? 'not-allowed' : 'pointer'}" :id="val.telContacts" :class="isCall && selectedMobile === val.telContacts ? 'icon-guaduan phone-down':'icon-dianhua'"/>
          </li>
        </div>
        <li v-if="attrInfo.synopsis">
          <span class="label">简介</span>
          <span class="value" :title="attrInfo.synopsis">{{attrInfo.synopsis}}</span>
        </li>
      </ul>
    </section>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import AttrInfo from './AttrInfo'
import seatListFun from '../../../panelTools/seatModel/seatListFun'
export default {
  mixins: [AttrInfo, seatListFun],
  data() {
    return {
    }
  },
  computed: {
    ...mapState({
      attrInfo: ({ mapPoint }) => mapPoint.mapResourceAttributes,
      isGridStatistic: ({ map2DApplyIX }) => map2DApplyIX.isGridStatistic
    })
  },
  watch: {
    attrInfo: {
      handler(val) {
        if (val.type === 'AttrGrid') {
          this.getGridstatisCount()
        }
      },
      deep: true
    }
  },
  mounted() {
    this.getGridstatisCount()
  },
  methods: {
    ...mapMutations('map2DApplyIX', ['CHANGE_IS_SHOW_TOOLS_PANEL', 'CHANGE_TOOLS_PANEL_ACTIVE', 'CHANGE_IS_GRID_STATISTIC']),
    ...mapActions('map2DApplyIX', ['openToolsPanel', 'getGridStatisticsCount', 'getGridAlarmStatisticsCount']),
    openResourcePanel() {
      this.CHANGE_IS_GRID_STATISTIC(!this.isGridStatistic)
      this.CHANGE_TOOLS_PANEL_ACTIVE('')
      this.openToolsPanel('')
      this.CHANGE_IS_SHOW_TOOLS_PANEL(false)
    },
    getGridstatisCount() {
      this.getGridStatisticsCount(this.attrInfo.gid)
      this.getGridAlarmStatisticsCount(this.attrInfo.gid)
    }
  }
}
</script>
<style lang="less" scoped>
@import url(./style.less);
.icon-hidemenu-copy-copy {
  float: right;
  cursor: pointer;
}
.icon-hidemenu-copy-copy.trans-roate {
  display: inline-block;
  transform: rotate(180deg);
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
