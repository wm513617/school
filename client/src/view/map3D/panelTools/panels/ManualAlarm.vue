<template>
  <div class="manualAlarmList">
    <div class="manual-header">
      <h3 class="header">手工报警</h3>
      <div class="alarm-select">
        <Select v-model="alarmSelect" size="small" style="">
          <Option v-for="item in alarmSelectList" :value="item.value" :key="item.value">{{item.label}}</Option>
        </Select>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      alarmSelectList: [{
        label: '全部',
        value: '全部'
      }],
      alarmSelect: '全部'
    }
  }
}
</script>
<style lang="less" scoped>
.manualAlarmList{
  width: 100%;
  height: 100%;
  color: #fff;
  font-size: 12px;
  background-color: rgb(44, 62, 92);
  border-radius: 5px;
  .manual-header {
    height: 38px;
    background-color: #0f2343;
    padding: 0 16px;
    .header {
      float: left;
      line-height: 38px;
      font-size: 14px;
    }
    .alarm-select {
      float: right;
      padding-top: 7px;
      width: 100px;
    }
  }
}
</style>
