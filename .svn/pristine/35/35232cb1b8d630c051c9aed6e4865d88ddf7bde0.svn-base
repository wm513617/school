<template>
  <div v-show="filterIsShow" class="panel-search">
    <div class="tab">
      <section class="content">
        <ul class="point-control">
          <li class="line">
           <div class="item">
              <Checkbox :value="filterState.normal.flag" @on-change="changeFilters(['normal'])">普通报警</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :disabled="disabledCom" :value="filterState.normal.alarmInput.flag" @on-change="changeFilters(['normal', 'alarmInput'])">报警输入</Checkbox>
            </div>
            <div class="item">
              报警级别&nbsp;<InputNumber class="numberInput" size="small" :disabled="disabledCom" :max="9" :min="1" :value="filterState.normal.alarmInput.level" v-model="filterState.normal.alarmInput.level" @on-change="changeFilters(['normal', 'alarmInput', filterState.normal.alarmInput.level])"></InputNumber>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :disabled="disabledCom" :value="filterState.normal.alarmZone.flag" @on-change="changeFilters(['normal', 'alarmZone'])">报警防区</Checkbox>
            </div>
            <div class="item">
              报警级别&nbsp;<InputNumber class="numberInput" size="small" :disabled="disabledCom" :max="9" :min="1" :value="filterState.normal.alarmZone.level" v-model="filterState.normal.alarmZone.level" @on-change="changeFilters(['normal', 'alarmZone', filterState.normal.alarmZone.level])"></InputNumber>
            </div>
          </li>
          <li class="line">
           <div class="item">
              <Checkbox :value="filterState.video.flag" @on-change="changeFilters(['video'])">视频报警</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :disabled="disabledVid" :value="filterState.video.monitor.flag" @on-change="changeFilters(['video', 'monitor'])">监控点报警</Checkbox>
            </div>
            <div class="item">
              报警级别&nbsp;<InputNumber :disabled="disabledVid"  class="numberInput" size="small" :max="9" :min="1" :value="filterState.video.monitor.level" v-model="filterState.video.monitor.level" @on-change="changeFilters(['video', 'monitor', filterState.video.monitor.level])"></InputNumber>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :disabled="disabledVid" :value="filterState.video.focus.flag" @on-change="changeFilters(['video', 'focus'])">重点关注</Checkbox>
            </div>
            <div class="item">
              报警级别&nbsp;<InputNumber :disabled="disabledVid"  class="numberInput" size="small" :max="9" :min="1" :value="filterState.video.focus.level" v-model="filterState.video.focus.level" @on-change="changeFilters(['video', 'focus', filterState.video.focus.level])"></InputNumber>
            </div>
          </li>
          <li class="line">
           <div class="item">
              <Checkbox :value="filterState.intelligent.flag" @on-change="changeFilters(['intelligent'])">智能报警</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :disabled="disabledInt" :value="filterState.intelligent.intelligent.flag" @on-change="changeFilters(['intelligent', 'intelligent'])">智能报警</Checkbox>
            </div>
            <div class="item">
              报警级别&nbsp;<InputNumber :disabled="disabledInt" class="numberInput" size="small" :max="9" :min="1" :value="filterState.intelligent.intelligent.level" v-model="filterState.intelligent.intelligent.level" @on-change="changeFilters(['intelligent', 'intelligent', filterState.intelligent.intelligent.level])"></InputNumber>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :disabled="disabledInt" :value="filterState.intelligent.violation.flag" @on-change="changeFilters(['intelligent', 'violation'])">违章报警</Checkbox>
            </div>
            <div class="item">
              报警级别&nbsp;<InputNumber :disabled="disabledInt" class="numberInput" size="small" :max="9" :min="1" :value="filterState.intelligent.violation.level" v-model="filterState.intelligent.violation.level" @on-change="changeFilters(['intelligent', 'violation', filterState.intelligent.violation.level])"></InputNumber>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :disabled="disabledInt" :value="filterState.intelligent.face.flag" @on-change="changeFilters(['intelligent', 'face'])">人像布控</Checkbox>
            </div>
            <div class="item">
              报警级别&nbsp;<InputNumber :disabled="disabledInt" class="numberInput" size="small" :max="9" :min="1" :value="filterState.intelligent.face.level" v-model="filterState.intelligent.face.level" @on-change="changeFilters(['intelligent', 'face', filterState.intelligent.face.level])"></InputNumber>
            </div>
          </li>
          <li class="line">
            <div class="item">
              <Checkbox :value="filterState.alarmHelp.flag" @on-change="changeFilters(['alarmHelp'])">报警求助</Checkbox>
            </div>
            <div class="item title-icon">
            </div>
            <div class="item">
              报警级别&nbsp;<InputNumber :disabled="disabledHelp" class="numberInput" size="small" :max="9" :min="1" :value="filterState.alarmHelp.level" v-model="filterState.alarmHelp.level" @on-change="changeFilters(['alarmHelp', filterState.alarmHelp.level])"></InputNumber>
            </div>
          </li>
          <li class="line">
            <div class="item">
              <Checkbox :value="filterState.fireAlarm.flag" @on-change="changeFilters(['fireAlarm'])">消防报警</Checkbox>
            </div>
            <div class="item title-icon">
            </div>
            <div class="item">
              报警级别&nbsp;<InputNumber :disabled="disabledFir" class="numberInput" size="small" :max="9" :min="1" :value="filterState.fireAlarm.level" v-model="filterState.fireAlarm.level" @on-change="changeFilters(['fireAlarm', filterState.fireAlarm.level])"></InputNumber>
            </div>
          </li>
          <li class="line">
            <div class="item">
              <Checkbox :value="filterState.single.flag" @on-change="changeFilters(['single'])">单兵报警</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :disabled="disabledSing" :value="filterState.single.single" @on-change="changeFilters(['single', 'single'])">单兵一键报警</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item title-icon">
            </div>
            <div class="item">
              <Checkbox :disabled="disabledSing" :value="filterState.single.patrol" @on-change="changeFilters(['single', 'patrol'])">巡更异常报警</Checkbox>
            </div>
          </li>
          <li class="line" v-if="false">
            <div class="item">
              <Checkbox :value="filterState.manualAlarm.checked" @on-change="changeFilters(['manualAlarm'])">手工报警</Checkbox>
            </div>
            <div class="item title-icon">
            </div>
            <div class="item">
              报警级别&nbsp;<InputNumber :disabled="disabledFir" class="numberInput" size="small" :max="9" :min="1" :value="filterLevel.manualAlarmLevel" v-model="filterLevel.manualAlarmLevel" @on-change="changeFilters(['fireControlLevel', filterLevel.manualAlarmLevel])"></InputNumber>
            </div>
          </li>
          <li class="line">
            <div class="item">
              <Checkbox :value="filterState.exception.flag" @on-change="changeFilters(['exception'])">系统异常</Checkbox>
            </div>
            <div class="item title-icon">
            </div>
          </li>
          <li class="line">
            <div class="item">
              <Checkbox :value="confirmedAlarm.checked" @on-change="changeFilters(['dealState'])">显示已确认报警</Checkbox>
            </div>
          </li>
          <li class="line">
            <div class="item">
              <Button type="primary" style="margin-right:20px" @click="confirm">确认</Button>
              <Button type="primary" @click="cancel">取消</Button>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex'
const localStorage = window.localStorage
export default {
  props: {
    filterIsShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      alarmInputLevel: 1,
      alarmSectorLevel: 1,
      cameraSpearLevel: 1,
      focusOnLevel: 1,
      intelligenceLevel: 1,
      peccancyLevel: 1,
      fireControlLevel: 1,
      alarmHelpLevel: 1,
      manualAlarmLevel: 1,
      systemExceptionLevel: 1,
      portraitControlLevel: 1
    }
  },
  computed: {
    ...mapState({
      filterState: ({warningDispose}) => warningDispose.filterState,
      confirmedAlarm: ({warningDispose}) => warningDispose.confirmedAlarm,
      filterLevel: ({warningDispose}) => warningDispose.filterLevel
    }),
    ...mapGetters('map2DApplyIX', [
      'isEmergency', // 是否开启应急预案开关
      'gun', // 摄像头
      'hemisphere',
      'fastBall',
      'panorama',
      'infraRed',
      'visualField',
      'alarm',
      'fireControl',
      'alarmColumn',
      'alarmBox',
      'isPoint',
      'removeSingle',
      'singlePic',
      'isNameTitle',
      'isBuilding',
      'isGrid'
    ]),
    ...mapGetters(['isMapOuter']),
    disabledCom() {
      return !this.filterState.normal.flag
    },
    disabledVid() {
      return !this.filterState.video.flag
    },
    disabledInt() {
      return !this.filterState.intelligent.flag
    },
    disabledFir() {
      return !this.filterState.fireAlarm.flag
    },
    disabledHelp() {
      return !this.filterState.alarmHelp.flag
    },
    disabledSing() {
      return !this.filterState.single.flag
    }
  },
  watch: {},
  methods: {
    ...mapActions('map2DApplyIX', ['switchToolsPanel', 'changePointChooseStatus', 'changeToolsPanelToBoxChoose', 'switchEmergency']),
    ...mapActions(['getMapOrg', 'setIsShowPatrolList', 'setIsMapOuter', 'getFoorById', 'setCurrentFloor', 'getGridDataById', 'getBuildingDataById', 'setSelectedTreeNode', 'setCurrentGrid',
      'setCurrentBuilding', 'setMapPreviewPointList', 'setAreaDrawActive',
      'clearPointFeatures', 'clearAreaFeatures', 'setShowSingleHeads2D', 'changeFilters', 'alarmCounts']),
    cancel() {
      this.$emit('getPoints')
    },
    confirm() {
      this.$emit('setalarmFilters')
      this.$emit('setCount')
      this.$emit('getPoints')
      localStorage.setItem('filterState', JSON.stringify(this.filterState))
      localStorage.setItem('confirmedAlarm', JSON.stringify(this.confirmedAlarm))
    }
  }
}
</script>
<style lang="less" scoped>
  .panel-search {
    width: 272px;
    position: absolute;
    top: 56px;
    right: 4px;
    z-index: 9;
    .search {
      width: 100%;
      height: 32px;
      line-height: 32px;
      display: flex;
      background: rgba(15, 35, 67, .8);
      .input {
        flex: 1;
      }
    }
    .tab {
      width: 100%;
      // transition: all .3s ease;
      display: flex;
      flex-direction: column;
      .tab-list {
        display: flex;
        height: 32px;
        line-height: 32px;
        margin: 8px 0;
        flex-direction: row;
        background: rgba(15, 35, 67, .8);
        align-items: center;
        li {
          flex: auto;
          height: 26px;
          line-height: 26px;
          text-align: center;
          color: rbga(200, 200, 200, .8);
          cursor: pointer;
          &.active {
            color: #4699f9;
          }
          &:first-child {
            border-right: 1px solid rgba(58, 90, 139, 0.4);
          }
        }
      }
      .content {
        width: 100%;
        height: 500px;
        padding: 0 0 0 14px;
        color: #fff;
        background: rgba(15, 35, 67, 1);
        & > * {
          height: 100%;
        }
        .point-control {
          height: 100%;
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
              .numberInput {
                width: 50px;
              }
            }
            .title-icon {
              flex: 0 0 32px;
              .iconfont {
                font-size: 24px;
              }
            }
          }
        }
      }
    }
  }
.iconIsOuter i {
  color: #25790f;
}
</style>
