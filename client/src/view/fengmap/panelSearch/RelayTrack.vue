<!--接力追踪信息-->
<template>
  <div class="relay-track-tab-info" :class="{'show': isShow && isPlatformTrack}">
    <div class='title'>追踪信息</div>
    <div class="track-case">
      <div class="case-item">
        <span class="label">追踪事件名称：</span>
        <span class="case-value">{{showTrackInfoTabData.name}}</span>
      </div>
      <div class="case-item">
        <span class="label">追踪镜头列表</span>
        <ul class="table" v-if="showTrackInfoTabData && showTrackInfoTabData.mapList && showTrackInfoTabData.mapList.length">
          <li class="table-li clearfix th-header">
            <span class="th">镜头名称</span>
            <span class="th">开始时间</span>
            <span class="th">结束时间</span>
          </li>
          <li class="table-li clearfix" v-for="(item, index) in showTrackInfoTabData.mapList" :key="index">
            <span class="th" :title="item.resource && item.resource.name">{{item.resource && item.resource.name}}</span>
            <span v-if="item.startTime" :title="$moment.unix(item.startTime).format('YYYY-MM-DD HH:mm:ss')" class="th">{{$moment.unix(item.startTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
            <span v-if="item.endTime" :title="$moment.unix(item.endTime).format('YYYY-MM-DD HH:mm:ss')" class="th">{{$moment.unix(item.endTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
          </li>
        </ul>
      </div>
      <div class="case-item">
        <span class="label">追踪事件备注：</span>
        <span class="case-value">{{showTrackInfoTabData.mark}}</span>
      </div>
    </div>
    <div class="case-info" v-if="showTrackInfoTabData.eventId">
      <div class="case-item">
        <span class="label">关联案件：</span>
        <span class="case-value">{{showTrackInfoTabData.eventId.eventCode}}</span>
      </div>
      <div class="case-item">
        <span class="label">事件名称：</span>
        <span class="case-value">{{showTrackInfoTabData.eventId.eventName}}</span>
      </div>
      <div class="case-item">
        <span class="label">报警人：</span>
        <span class="case-value">{{showTrackInfoTabData.eventId.person}}</span>
      </div>
      <div class="case-item">
        <span class="label">学号：</span>
        <span class="case-value">{{showTrackInfoTabData.eventId.studentNum}}</span>
      </div>
      <div class="case-item">
        <span class="label">联系电话：</span>
        <span class="case-value">{{showTrackInfoTabData.eventId.phone}}</span>
      </div>
      <div class="case-item">
        <span class="label">院系/单位：</span>
        <span class="case-value">{{showTrackInfoTabData.eventId.department}}</span>
      </div>
      <div class="case-item">
        <span class="label">事发地点：</span>
        <span class="case-value">{{showTrackInfoTabData.eventId.incidentAddress}}</span>
      </div>
      <div class="case-item">
        <span class="label">案件开始时间：</span>
        <span class="case-value" v-if="showTrackInfoTabData.eventId.startTime">{{$moment.unix(showTrackInfoTabData.eventId.startTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
      </div>
      <div class="case-item">
        <span class="label">案件结束时间：</span>
        <span class="case-value" v-if="showTrackInfoTabData.eventId.endTime">{{$moment.unix(showTrackInfoTabData.eventId.endTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
      </div>
      <div class="case-item">
        <span class="label">事件特征：</span>
        <span class="case-value">{{showTrackInfoTabData.eventId.description}}</span>
      </div>
    </div>
    <div v-show="isPlatformTrack" class="btn-panel-shrink" @click="isShow = !isShow">
      <div class="shape">
        <Icon class="icon" :type="isShow ? 'chevron-left' : 'chevron-right'" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
export default {
  components: {},
  data() {
    return {
      isShow: true
    }
  },
  watch: {
    isPlatformTrack() {
      this.isShow = true
    }
  },
  computed: {
    ...mapGetters('fengMapApplyInteractive', ['isPlatformTrack']),
    ...mapState({
      showTrackInfoTabData: ({ fengMapApplyInteractive }) => fengMapApplyInteractive.showTrackInfoTabData
    })
  },
  methods: {},
  mounted() {}
}
</script>
<style lang="less" scoped>
.relay-track-tab-info {
  width: 400px;
  height: 100%;
  position: absolute;
  top: 0;
  left: -400px;
  background: rgba(15, 35, 67, 0.8);
  z-index: 9999;
  &.show {
    left: 0;
  }
  .title {
    font-size: 14px;
    width: 100%;
    height: 38px;
    line-height: 38px;
    padding: 0 24px;
    background: #0f2343;
  }
  .btn-panel-shrink {
    width: 16px;
    height: 86px;
    position: absolute;
    top: 50%;
    right: -16px;
    margin-top: -43px;
    cursor: pointer;
    overflow: hidden;
    .shape {
      position: absolute;
      right: -16px;
      height: 86px;
      border: 16px solid transparent;
      border-left: 16px solid rgba(15, 35, 67, 0.8);
    }
    .icon {
      position: absolute;
      right: 5px;
      top: 50%;
      margin-top: -6px;
    }
  }
  .track-case {
    padding: 5px 20px;
    .case-item {
      margin: 12px 0;
      .table {
        max-height: 400px;
        overflow-y: auto;
        padding-left: 10px;
        .table-li {
          height: 32px;
          .th {
            width: 26%;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin: 0 10px;
            line-height: 32px;
          }
          &.th-header {
            background-color: #244575;
          }
        }
      }
    }
  }
  .case-info {
    padding: 5px 20px;
    border-top: 1px solid #75757587;
    .case-item {
      margin: 12px 0;
    }
  }
}
</style>
