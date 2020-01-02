<template>
  <div class="orgConfig">
    <div class="bs-left">
      <div class="sidebar">
        <ul class="config-list">
          <li style="list-style:none;" v-for="(config,index) in sideBarList" :key="index" :class="{active: config.isActive}" @click="tabChange(index)">
            {{config.name}}
          </li>
        </ul>
      </div>
    </div>
    <div class="bs-mains">
      <PassingRecord v-if="sideBarList[0].isActive"></PassingRecord>
      <SpeedingRecord v-if="sideBarList[1].isActive"></SpeedingRecord>
      <ViolationRecord v-if="sideBarList[2].isActive"></ViolationRecord>
      <PersonVehicleRecord v-if="sideBarList[3].isActive"></PersonVehicleRecord>
    </div>
  </div>
</template>

<script>
import SpeedingRecord from './SpeedingRecord'
import PassingRecord from './PassingRecord'
import ViolationRecord from './ViolationRecord'
import PersonVehicleRecord from './PersonVehicleRecord'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  components: {
    SpeedingRecord,
    PassingRecord,
    ViolationRecord,
    PersonVehicleRecord
  },
  data() {
    return {
      sideBarList: [
        {name: '过车记录', value: 1, isActive: true},
        {name: '超速记录', value: 2, isActive: false},
        {name: '违停记录', value: 3, isActive: false},
        {name: '人车同检记录', value: 4, isActive: false}
      ]
    }
  },
  computed: {
    ...mapState({
      moreFlag: state => state.vehicle.moreFlag
    })
  },
  created() {
    if (this.moreFlag) {
      this.tabChange(3)
      this.SET_MOREFLAG(false)
    }
    this.getConstList()
  },
  methods: {
    ...mapActions(['getConstList']),
    ...mapMutations(['SET_MOREFLAG']),
    tabChange(index) {
      for (let i = 0; i < this.sideBarList.length; i++) {
        this.sideBarList[i].isActive = false
      }
      this.sideBarList[index].isActive = true
    }
  }
}
</script>

<style scoped lang='less'>
.orgConfig {
  width: 100%;
  position: relative;
  display: flex;
  padding: 16px 0;
}
.bs-mains {
  position: absolute;
  left: 0;
  width: calc(~'100% - 288px');
  height: calc(~'100% - 32px');
  margin-left: 288px;
  background: #1c3053;
  min-height: 670px;
  overflow-x: hidden;
  padding: 16px 0 0;
}
.sidebar {
  width: 100%;
  height: auto;
}
.config-list li {
  list-style: none;
  position: relative;
  cursor: pointer;
  height: 40px;
  line-height: 39px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  border-right: 2px solid transparent;
  background: #1c3053;
  border-top: 1px solid rgba(58, 90, 139, 0.4);
  /* border-bottom: 1px solid rgba(58, 90, 139, 0.4); */
  padding: 0 0 0 40px;
}
.config-list li:hover {
  background: #2b426b;
  color: #ffffff;
}
.sidebar > .config-list > .active {
  color: #4699f9;
  border-right: 2px solid #4699f9;
  background-color: #2f497a;
  z-index: 2;
}
</style>
