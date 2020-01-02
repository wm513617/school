<template>
  <div class="building-alarm-tree">
    <bsr-Tree :treeData="buildIngAlarm||{}" ref="bstree" @node-click='nodeClick'>
      <template slot-scope="{ node }">
        <span>{{node.name}}</span>
        <span class="times" v-show="node.times > 1">{{node.times}}</span>
      </template>
    </bsr-Tree>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  props: ['buildIngAlarm'],
  computed: {
    ...mapState({
      buildOneData: ({ tdBuild }) => tdBuild.buildOneData,
      alarmingFeatureList: ({tdPoint}) => tdPoint.alarmingFeatureList,
      buildIngAlarmObj: ({ tdPoint }) => tdPoint.buildIngAlarmObj // 楼宇汇聚闪烁对象
    })
  },
  data() {
    return {}
  },
  watch: {},
  methods: {
    ...mapActions(['getOneBuildById', 'setIsOuter', 'getOneFloor', 'setAlarmingList']),
    nodeClick(val) {
      console.log(val)
      this.getOneFloor(val.sid).then(res => {
        if (res) {
          // 根据楼层id切换资源树
          this.setIsOuter(false)
        }
      })
    }
  },
  mounted() {
    // this.getOneBuildById(this.buildIngAlarm.building)
  }
}
</script>

<style scoped>
.building-alarm-tree {
  position: absolute;
  left: 100px;
  top: 100px;
  z-index: 3;
  background: #1c3053;
}
.times {
  border-radius: 50%;
  background: red;
  color: #000;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  margin-left: 8px;
}
</style>
