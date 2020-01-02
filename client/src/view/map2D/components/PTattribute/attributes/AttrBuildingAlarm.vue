<template>
  <div class="attr-video attr-panel">
    <header>
      <span class="title">楼宇报警列表</span>
      <i v-if="!isInfoPanelFixed" class="btn icon iconfont icon-close1" :style="{'font-size': '14px', 'margin-left': '8px'}" title="关闭" @click="hidePanel"></i>
    </header>
    <section class="main">
      <div class="build-name">{{buildName}}</div>
      <ul class="table">
        <li class="table-li clearfix">
          <span class="th" style="width: 50px;">楼层</span>
          <span class="th">报警类型</span>
          <span class="th" style="width: 90px;">点位名称</span>
        </li>
      </ul>
      <ul class="table container">
        <li v-for="(item, index) in buildingAlarm" :key="index" class="table-li clearfix" @click="changeToCenter(item)">
          <span class="th" style="width: 50px;" :title="item.sidName">{{item.sidName}}</span>
          <span class="th" :title="item.alarmType">{{item.alarmType}}</span>
          <span class="th" style="width: 90px;" :title="item.channelName">{{item.channelName}}</span>
        </li>
      </ul>
    </section>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import AttrInfo from './AttrInfo'
export default {
  data() {
    return {
      alarmType: {
        alarmHelp: '报警求助',
        alarmInput: '报警输入',
        alarmZone: '报警防区',
        fireAlarm: '消防报警',
        intelligent: '智能报警',
        violation: '违章报警',
        faceAlarm: '人像布控',
        monitorAlarm: '监控点报警',
        focusAttention: '重点关注',
        patrolAlarm: '巡更报警',
        singleAlarm: '单兵一键报警'
      },
      buildName: '',
      buildingAlarm: []
    }
  },
  mixins: [AttrInfo],
  created() {
  },
  computed: {
    ...mapState({
      curBuildData: ({ mapAlarm }) => mapAlarm.curBuildData,
      alarmTabData: ({ mapAlarm }) => mapAlarm.alarmTabData
    })
  },
  watch: {
    curBuildData() {
      this.setList()
    }
  },
  methods: {
    ...mapMutations('mapAlarm', ['SET_ACTIVE_ALARM_INFO']),
    changeToCenter(item) {
      for (let i = 0; i < this.alarmTabData.length; i++) {
        if (this.alarmTabData[i].alarmId === item.alarmId) {
          this.SET_ACTIVE_ALARM_INFO(this.alarmTabData[i])
          break
        }
      }
    },
    setList() {
      if (!this.curBuildData) {
        return
      }
      this.buildingAlarm = []
      for (let i = 0; i < this.curBuildData.children.length; i++) {
        const item = this.curBuildData.children[i]
        this.buildName = item.point.buildings ? item.point.buildings.name : this.curBuildData.name
        let sidName
        if (item.point.storeys) {
          sidName = item.point.storeys.name
        } else {
          const sid = this.curBuildData.sids.filter(v => { return v._id === item.point.sid })
          if (sid.length) { sidName = sid[0].name }
        }
        this.buildingAlarm.push({
          sidName: sidName,
          channelName: item.name,
          channelId: item.chanId || item.channelId || item.res || (item.bondCarmerRes && item.bondCarmerRes._id) || item._id,
          alarmId: item.alarmId,
          alarmType: this.alarmType[item.alarmTypeToMap]
        })
      }
      this.buildingAlarm = this.$lodash.uniqBy(this.buildingAlarm, 'channelId')
    }
  },
  mounted() {
    this.setList()
  }
}
</script>
<style lang="less" scoped>
@import url(./style.less);
.build-name {
  padding: 0 0 5px 5px;
}
.table .th {
  display: block;
  float: left;
  width: 70px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
}
.table-li {
  padding: 5px 0;
}
.clearfix:after {
  content: '.';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.table.container {
  max-height: 150px;
  overflow-y: auto;
  min-height: 75px;
}
.table.container .table-li {
  cursor: pointer;
}
</style>
