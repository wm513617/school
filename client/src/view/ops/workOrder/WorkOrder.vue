<template>
  <div class="work-order" style="flex:1;display:flex;">
    <div class="bs-content">
      <div class="bs-left">
        <Menu default-active="AwaitingRepair" @select="handleSelect" width="100%" background-color="#1B3153" text-color="#fff" active-text-color="#4699F9">
          <MenuItem class="left-menu-item" index="AwaitingRepair">待维修工单</MenuItem>
          <MenuItem class="left-menu-item" index="FinishedRepair">已完成工单</MenuItem>
        </Menu>
      </div>
      <div class="bs-main">
        <component :is='activeComponents'></component>
      </div>
    </div>
  </div>
</template>
<script>
import { Menu, MenuItem } from 'element-ui'
import AwaitingRepair from './AwaitingRepair'
import FinishedRepair from './FinishedRepair'
export default {
  components: {
    AwaitingRepair,
    FinishedRepair,
    Menu,
    MenuItem
  },
  data() {
    return {
      activeComponents: 'AwaitingRepair'
    }
  },
  computed: {
  },
  methods: {
    handleSelect(key, keyPath) {
      this.activeComponents = key
    }
  }
}
</script>
<style lang="less">
  @import './Theme.less';
</style>
<style>
.el-select {
    margin-right: 24px;
    background-color: #1b3153;
}
.el-select .el-input__inner{
    color: #fff;
    border-radius: 4px;
    border: 1px solid #5676a9;
    background-color: #1b3153;
    height: 30px;
    line-height: 30px;
}
.el-select-dropdown {
    background-color: #1b3153;
    border: 1px solid #4699f9;
}
.el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
    background-color: rgba(70,153,249,.9);
}
.el-select-dropdown__item {
    color: #fff;
}
.el-scrollbar {
  background-color: #1b3153;
}
.el-date-editor .el-range-separator {
  color: #fff;
  width: 7%;
}
.el-date-editor .el-range-input {
  color: #fff;
  background-color: #1b3153;
}
.el-date-range-picker__content.is-left {
  background-color: #1b3153;
  color: #fff;
}
.el-date-range-picker .el-picker-panel__content {
  color: #fff;
  background-color: #1b3153;
  border: 1px solid #657CA8;
}
.el-date-table td.in-range div {
  background-color: #4699f9;
}
.el-range-editor--small.el-input__inner {
  border: 1px solid #657CA8;
  background-color: #1b3153;
}
.el-popper[x-placement^=bottom] {
  border: 1px solid #657CA8;
}
.el-picker-panel__footer, .el-date-range-picker__time-header, .el-input__inner {
  background-color: #1b3153;
  color: #fff;
}
.el-time-spinner__item.active:not(.disabled) {
  background-color: #4699f9;
}
.el-picker-panel {
  background-color: #1b3153;
  color: #fff;
}
.el-date-picker__header-label {
  color: #fff;
}
</style>
<style scoped>
.bs-left,.bs-main {
  min-height: 865px;
}
.left-menu-item {
  text-align: center;
  border-bottom: solid 1px #314C78;
}
</style>
