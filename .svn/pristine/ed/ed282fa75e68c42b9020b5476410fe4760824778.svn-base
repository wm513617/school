<!--编辑模式 点位元素功能页面-->
<template>
  <div class="mapPointHome">
    <ul class="point-control">
      <li class="line">
        <div class="item title-icon">
          <i class="iconfont icon-video-gun1"></i>
        </div>
        <div class="item">
          <Checkbox :value="boltipc" @on-change="changePointState(['video', 'boltipc'])">枪机</Checkbox>
        </div>
        <div class="item">
          <Checkbox :value="halfBallipc" @on-change="changePointState(['video', 'halfBallipc'])">半球</Checkbox>
        </div>
        <div class="item">
          <Checkbox :value="fastBallipc" @on-change="changePointState(['video', 'fastBallipc'])">快球</Checkbox>
        </div>
      </li>
      <li class="line">
        <div class="item title-icon">
        </div>
        <div class="item">
          <Checkbox :value="allViewipc" @on-change="changePointState(['video', 'allViewipc'])">全景</Checkbox>
        </div>
        <div class="item">
          <Checkbox :value="redBoltipc" @on-change="changePointState(['video', 'redBoltipc'])">红外枪机</Checkbox>
        </div>
        <div class="item">
        </div>
      </li>
      <li class="line">
        <div class="item title-icon">
        </div>
        <div class="item">
          <Checkbox :value="verface" @on-change="changePointState(['video', 'verface'])">人脸抓拍</Checkbox>
        </div>
        <div class="item">
          <Checkbox :value="traffic" @on-change="changePointState(['video', 'traffic'])">交通抓拍</Checkbox>
        </div>
        <div class="item">
        </div>
      </li>
      <li class="line">
        <div class="item title-icon">
        </div>
        <div class="item">
          <Checkbox :value="sector" @on-change="changePointState(['video', 'sector'])">可视域</Checkbox>
        </div>
        <div class="item">
        </div>
        <div class="item">
        </div>
      </li>
      <li class="line">
        <div class="item title-icon">
          <i class="iconfont icon-putongbaojing1"></i>
        </div>
        <div class="item">
          <Checkbox :value="commonAlarm" @on-change="changePointState(['alarm', 'commonAlarm'])">普通报警</Checkbox>
        </div>
      </li>
      <li class="line">
        <div class="item title-icon">
          <i class="iconfont icon-xiaofangbaojing11"></i>
        </div>
        <div class="item">
          <Checkbox :value="fireAlarm" @on-change="changePointState(['alarm', 'fireAlarm'])">消防报警</Checkbox>
        </div>
      </li>
      <li class="line">
        <div class="item title-icon">
          <i class="iconfont icon-baojingzhu1"></i>
        </div>
        <div class="item">
          <Checkbox :value="alarmColumn" @on-change="changePointState(['alarm', 'alarmColumn'])">报警柱</Checkbox>
        </div>
      </li>
      <li class="line">
        <div class="item title-icon">
          <i class="iconfont icon-baojingxiang2"></i>
        </div>
        <div class="item">
          <Checkbox :value="alarmBox" @on-change="changePointState(['alarm', 'alarmBox'])">报警箱</Checkbox>
        </div>
      </li>
      <li class="line">
        <div class="item title-icon">
          <i class="iconfont icon-xungengbaojing1"></i>
        </div>
        <div class="item">
          <Checkbox :value="isPatrol" @on-change="changePointState(['isPatrol'])">巡更点位</Checkbox>
        </div>
      </li>
      <li class="line">
        <div class="item title-icon">
          <i class="iconfont icon-menjin1"></i>
        </div>
        <div class="item">
          <Checkbox :value="isDoorControl" @on-change="changePointState(['isDoorControl'])">门禁点位</Checkbox>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {},
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters('fengMap', [
      'boltipc', // 枪机
      'redBoltipc', // 红外枪机
      'halfBallipc', // 半球
      'fastBallipc', // 快球
      'allViewipc', // 全景
      'verface', // 人脸抓拍
      'traffic', // 交通抓拍
      'sector', // 可视域
      'commonAlarm', // 普通报警
      'fireAlarm', // 消防报警
      'alarmBox', // 报警箱
      'alarmColumn', // 报警柱
      'isPatrol', // 巡更
      'isDoorControl' // 门禁
    ])
  },
  watch: {
  },
  methods: {
    ...mapActions('fengMap', ['changePointState'])
  }
}
</script>
<style lang="less" scoped>
.mapPointHome {
  width: 100%;
  height: 100%;
  padding: 0 12px;
  .point-control {
    display: flex;
    flex-direction: column;
    .line {
      flex: 1 0 auto;
      display: flex;
      flex-direction: row;
      justify-content: center;
      .item {
        flex: 1;
        display: flex;
        align-items: center;
        line-height: 48px;
        .numberInput {
          width: 50px;
        }
      }
      .title-icon {
        flex: 0 0 40px;
        .iconfont {
          font-size: 24px;
        }
      }
    }
  }
}
</style>
