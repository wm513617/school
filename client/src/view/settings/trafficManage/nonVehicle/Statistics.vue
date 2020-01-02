<template>
  <div class="orgConfig">
    <div class="bs-left">
      <div class="sidebar">
        <ul class="config-list">
          <li style="list-style:none;" v-for="(config,index) in sideBarList" :key="index" :class="{active: config.isActive}" @click="toggleTab(index)">
            {{config.name}}
          </li>
        </ul>
      </div>
    </div>
    <div class="bs-mains">
      <EleVehicleCount v-if="sideBarList[1].isActive"></EleVehicleCount>
      <VehicleFlow v-if="sideBarList[0].isActive"></VehicleFlow>
      <PeopleVehicles v-if="sideBarList[2].isActive"></PeopleVehicles>
    </div>
  </div>
</template>

<script>
import EleVehicleCount from './EleVehicleCount'
import VehicleFlow from './VehicleFlow'
import PeopleVehicles from './PeopleVehicles'
export default {
  components: {
    EleVehicleCount,
    VehicleFlow,
    PeopleVehicles
  },
  data() {
    return {
      sideBarList: [
        {name: '车流量统计', value: 1, isActive: true},
        {name: '电动车统计', value: 2, isActive: false},
        {name: '人车同检统计', value: 3, isActive: false}
      ]
    }
  },
  created() {
  },
  methods: {
    toggleTab(i) {
      this.sideBarList.forEach((item, index) => {
        if (index === i) {
          item.isActive = true
        } else {
          item.isActive = false
        }
      })
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
  width: calc(~'100% - 288px');
  height: calc(~'100% - 32px');
  left: 0;
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
