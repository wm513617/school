<template>
  <!-- 追踪详情 -->
  <div v-if="openModal3">
    <Modal v-model="openModal3" title="追踪详情" width="600px" @on-cancel='cancel' :mask-closable="false" class="caseMangementModel">
      <div class="dlog-box">
        <!-- 接力追踪信息 -->
        <div class="message">
          <p class="label" style="padding: 0;" :title="detailList.name">追踪事件名称： {{ detailList.name }}</p>
          <p>追踪摄像头列表：</p>
            <ul>
              <li v-for="(item, index) of detailList.mapList" :key="index">
                <p>
                  <span class="label" :title="item.resource.name">{{ item.resource.name }}</span>
                  <span class="time" :title="setTimeFun(item)">{{ setTimeFun(item) }}</span>
                </p>
              </li>
            </ul>
          <p>追踪事件备注：</p>
          <p class="roll">{{ detailList.mark }}</p>
          <!-- 重新追踪 -->
          <i class="down-icon iconfont icon-refresh" @click="resesh()" title="重新追踪"></i>
        </div>
        <!-- 间隔线 -->
        <div class="divider" v-show="detailList.eventId"></div>
        <!-- 案件信息 -->
        <div class="message" v-if="detailList.eventId">
          <p :title="detailList.eventId.eventCode">关联事件：{{ detailList.eventId.eventCode }}</p>
          <p class="label" style="padding: 0;" :title="detailList.eventId.eventName">事件名称：{{ detailList.eventId.eventName }}</p>
          <p class="label" style="padding: 0;" :title="detailList.eventId.person">报警人：{{ detailList.eventId.person }}</p>
          <p :title="detailList.eventId.phone">联系电话：{{ detailList.eventId.phone }}</p>
          <p>事发地点：</p>
          <p class="roll">{{ detailList.eventId.incidentAddress }}</p>
          <p>事件特征：</p>
          <p class="roll">{{ detailList.eventId.description }}</p>
        </div>
      </div>
      <div slot="footer" style="text-align: center">
        <!-- <Button type="primary" @click="cancel">确定</Button> -->
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'trinkingDetail',
  props: {
    // 是否打开弹窗
    openModal3: {
      type: Boolean,
      default: false
    },
    // 追踪详情 data
    detailList: {
      type: Object,
      default: () => {
        return {
          name: '',
          mark: '',
          mapList: []
        }
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    cancel(row) {
      this.$emit('openmoda3', false)
    },
    // 重新追踪
    resesh() {
      this.$router.push({
        name: '/map/2D',
        params: {
          id: this.detailList._id,
          path: '/business/relayTracking'
        }
      })
    },
    // 时间样式设置
    setTimeFun(data) {
      let { startTime, endTime } = data
      let _text = ''
      if (startTime) {
        _text += this.$moment(startTime * 1000).format('YYYY-MM-DD HH:mm:ss')
      }
      if (endTime) {
        _text += ' — ' + this.$moment(endTime * 1000).format('YYYY-MM-DD HH:mm:ss')
      }
      return _text
    }
  }
}
</script>

<style scoped lang="less">
.dlog-box {
  width: 80%;
  margin: 0 auto;
  cursor: default;
  position: relative;
  .message {
    position: relative;
    p {
      margin-top: 5px;
    }
    ul {
      max-height: 85px;
      min-height: 56px;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 4px;
      }
      &::-webkit-scrollbar-track {
        border-radius: 5px;
      }
      &::-webkit-scrollbar-track-piece {
        background-color: #14284b;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #657ca8;
        border-radius: 5px;
      }
      li + li {
        margin-top: 5px;
      }
    }
    .label {
      padding-left: 15px;
      overflow-x: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .time {
      text-align: end;
      margin: 0 10px 0 0;
    }
    span.label {
      display: inline-block;
      width: 40%;
    }
    span.time {
      display: inline-block;
      margin: 0;
      width: 57%;
      text-align: left;
      overflow-x: hidden;
    }
    .roll {
      padding-left: 15px;
      max-height: 55px;
      min-height: 25px;
      overflow-x: hidden;
      overflow-y: auto;
      word-break: break-all;
      &::-webkit-scrollbar {
        width: 4px;
      }
      &::-webkit-scrollbar-track {
        border-radius: 5px;
      }
      &::-webkit-scrollbar-track-piece {
        background-color: #14284b;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #657ca8;
        border-radius: 5px;
      }
    }
  }
  .divider {
    margin-top: 10px;
    margin-bottom: 10px;
    height: 1px;
    width: 118%;
    margin-left: -9%;
    box-sizing: content-box;
    border-bottom: 1px solid;
  }
  .iconfont {
    cursor: pointer;
  }
  .down-icon {
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    right: -12%;
  }
}
</style>
