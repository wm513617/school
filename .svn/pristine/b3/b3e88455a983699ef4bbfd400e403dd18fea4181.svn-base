<template>
  <div class="bs-content manage">
    <div class="bs-left">
      <div class="sidebar">
        <ul class="config-list">
          <li v-for="(config,index) in sideBarList" :key="index" :class="{active: config.isActive}" @click="sideBarActive(config)">
            {{config.name}}
          </li>
        </ul>
      </div>
    </div>
    <div class="re-right">
      <!-- 事件追踪 -->
      <trackingChildren v-if="sideBarList[0].isActive"></trackingChildren>
      <!-- 历史追踪 -->
      <historyChildren v-if="sideBarList[1].isActive"></historyChildren>
    </div>
  </div>
</template>

<script>
import trackingChildren from './trackingChildren/trackingChildren'
import historyChildren from './historyChildren/historyChildren'
export default {
  data() {
    return {
      sideBarList: [{
        name: '事件追踪',
        isActive: true,
        roleTabs: 'receive'
      }, {
        name: '历史追踪',
        isActive: false,
        roleTabs: 'history'
      }]
    }
  },
  mounted() {},
  methods: {
    sideBarActive(config) { // 左侧'事件追踪'和'历史追踪'TAB切换
      if (config.roleTabs === 'receive') {
        this.sideBarList[0].isActive = true
        this.sideBarList[1].isActive = false
      } else if (config.roleTabs === 'history') {
        this.sideBarList[0].isActive = false
        this.sideBarList[1].isActive = true
      }
    }
  },
  components: {
    trackingChildren,
    historyChildren
  }
}
</script>

<style lang="less" scoped>
.re-right {
  flex-grow: 1;
  overflow: hidden;
  width: 100%;
  background: #1c3053;
  min-height: 670px;
  padding: 12px 0 0 0;
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
  padding: 0 0 0 40px;
  &:hover {
    background: #2b426b;
    color: #ffffff;
  }
}
.sidebar > .config-list > .active {
  color: #4699f9;
  border-right: 2px solid #4699f9;
  background-color: #2f497a;
  z-index: 2;
}
</style>
