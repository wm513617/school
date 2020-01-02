<template>
  <Modal v-model="modalShow" :title="'设备在线详情'" :width="ModalWidth" :mask-closable="false" :closable='false' @mousedown.stop @mouseup.stop class="Vmodel">
    <p slot="header" class="header">
      <span>{{modalName}}: - {{deviceName}}</span>
      <span class="full-style rt" @click="fullscreen" :title="!isFullscreen?'全屏':'退出全屏'">
        <span class="iconfont" :class="!isFullscreen? 'icon-quanpingfangda':'icon-exit-full-screen'"></span>
      </span>
    </p>
    <div class="modol-header">
      <div class='lf'>
        <Button type="primary" @click="amplification">放大</Button>
        <Button type="dashed" @click="shrink">缩小</Button>
      </div>
      <div class="rt">
        <Select v-model="dataType" style="width:200px">
          <Option v-for="item in dataTypesArray" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
    </div>
    <div class="modol-body" ref='modelBody'>
      <div class="modol-body-left lf" ref='modolBodyLeft'>
        <div class="modol-body-left-title">
          日期
        </div>
        <ul class="modol-body-left-details" ref='modolBodyLeftDetails'>
          <li v-for='(item, index) in timeDataVal' :key='index' class="modol-body-left-details-list">
            {{item.time}}
          </li>
        </ul>
      </div>
      <ul class="modol-body-left-details rt" style='width:75px;text-align: center' v-if='!isDevice'>
        <li class="list-title"></li>
        <li v-for='(item, index) in timeDataVal' :key='index' class="modol-body-left-details-list">
          {{index % 2 === 0 ? '录像详情' : '在线详情'}}
        </li>
      </ul>
      <div class="modol-body-right rt" ref="childBox" :style="{width: `calc(100% - ${isDevice ? '100px' : '175px'})`}">
        <OnlineTime v-if='modalShow' ref="child" :isFullScreen='isFullscreen' :timeAllHeight='timeAllHeight' :detailData='detailDataVal' :headerShow='true' :offlineColor='offlineColor' :basicColor='basicColor' :onlineColor='onlineColor'></OnlineTime>
      </div>
      <div v-if='timeDataVal.length === 0' class="no-data">暂无数据</div>
    </div>
    <div slot="footer" class="footer">
      <!-- <Select v-model="pageNum" style="width:125px" class="lf">
        <Option v-for="item in pageNumArray" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select> -->
      <div>
        <div class="lf garden-box">
          <span class="lf">{{onlineName}}：</span>
          <div class="lf garden" ref='online'></div>
        </div>
        <div class="lf garden-box">
          <span class="lf">{{offlineName}}：</span>
          <div class="lf garden" ref='offline'></div>
        </div>
        <div class="lf garden-box">
          <span class="lf">{{baseName}}：</span>
          <div class="lf garden" ref='baseColor'></div>
        </div>
      </div>
      <Button type="error" @click="cancel" class="cancel rt">关闭</Button>
      <Page class="rt" @on-change='changeCurrent' @on-page-size-change='changePageSize' :current='page' :total='countsVal' :show-sizer='showSizer' :page-size='pageNum' :page-size-opts='pageNumArray'></Page>
    </div>
  </Modal>
</template>

<script>
import OnlineTime from './onlineTime.vue'
export default {
  name: 'OnlineDetails',
  components: {
    OnlineTime
  },
  props: {
    modalShow: {
      type: Boolean,
      default: false
    },
    onlineColor: {
      type: String,
      default: '#4699f9'
    },
    basicColor: {
      type: String,
      default: '#0f2343'
    },
    offlineColor: {
      type: String,
      default: '#ddd'
    },
    timeData: {
      type: Array,
      default: () => {
        return []
      }
    },
    detailData: {
      type: Array,
      default: () => {
        return []
      }
    },
    ModalWidth: {
      type: Number,
      default: 1200
    },
    deviceName: {
      type: String
    },
    ModalHeight: {
      type: Number,
      default: 800
    },
    counts: {
      type: Number,
      default: 0
    },
    modalName: {
      type: String,
      default: '设备在线详情'
    },
    onlineName: {
      type: String,
      default: '在线'
    },
    offlineName: {
      type: String,
      default: '离线'
    },
    baseName: {
      type: String,
      default: '未配置'
    },
    isDevice: {
      type: Boolean,
      default: true
    },
    pageNumArray: {
      type: Array,
      default: () => [7, 15]
    },
    pageNumProp: {
      type: Number,
      default: 7
    }
  },
  data() {
    return {
      dataType: 0,
      timeAllHeight: 445,
      afterFullscreen: 600,
      isFullscreen: false,
      page: 1,
      showSizer: true,
      pageNum: 7,
      // pages: 1,
      dataTypesArray: [
        {
          value: 0,
          label: '全部日期'
        },
        {
          value: 1,
          label: '正常日期'
        },
        {
          value: 2,
          label: '异常日期'
        }
      ],
      timeDataVal: [], // timeData
      detailDataVal: [], // detailData
      countsVal: 0 // counts
      // showTimeData: [],
      // showDetailData: []
    }
  },
  computed: {},
  watch: {
    modalShow(newVal, oldVal) {
      this.page = 1
      if (!newVal) { return }
      this.$refs.modelBody.style.height = '445px'
      setTimeout(() => {
        this.timeAllHeight = this.$refs.modolBodyLeftDetails.offsetHeight + 42
      }, 0)
    },
    pageNum(newVal, oldVal) {
      if (!newVal) { return }
      setTimeout(() => {
        this.timeAllHeight = this.$refs.modolBodyLeftDetails.offsetHeight + 42
      }, 0)
    },
    isFullscreen(newVal, oldVal) {
      if (newVal === oldVal) { return }
      this.$refs.child.fullscreen()
    },
    dataType() {
      this.sendData()
    },
    timeData: {
      handler(val, oldval) {
        setTimeout(() => {
          this.timeAllHeight = this.$refs.modolBodyLeftDetails.offsetHeight + 42
        }, 0)
        this.timeDataVal = JSON.parse(JSON.stringify(val))
      },
      deep: true
    },
    detailData: {
      deep: true,
      handler(val, oldval) {
        this.detailDataVal = JSON.parse(JSON.stringify(val))
      }
    },
    counts: {
      deep: true,
      handler(val, oldval) {
        this.countsVal = val
      }
    }
  },
  created() {
    this.pageNum = this.pageNumProp
  },
  mounted() {
    this.$refs.online.style.backgroundColor = this.onlineColor
    this.$refs.offline.style.backgroundColor = this.offlineColor
    this.$refs.baseColor.style.backgroundColor = this.basicColor
    document.onkeydown = event => { // 监听ESC键
      if (event.keyCode === 27 && this.isFullscreen) {
        this.fullscreen()
      }
    }
    this.sendData()
  },
  beforeDestroy() {
    window.onresize = null
    document.onkeydown = null
  },
  methods: {
    sendData() { // 向父组件发送配置信息
      const data = {}
      data.page = this.page
      data.limit = this.pageNum
      if (this.dataType === 0) {
        data.onlineRate = ''
      } else {
        data.onlineRate = this.dataType
      }
      this.$emit('sendData', data)
    },
    cancel() { // 关闭
      this.$emit('cancel', false)
      this.dataType = 0
      if (this.isFullscreen) {
        this.isFullscreen = !this.isFullscreen
        document.querySelector('.Vmodel .ivu-modal').style.width = '1200px'
        document.querySelector('.Vmodel .ivu-modal').style.top = '100px'
        document.querySelector('.Vmodel .ivu-modal-body').style.height = '100%'
      }
      this.timeDataVal = []
      this.detailDataVal = []
      this.countsVal = 0
    },
    fullscreen() { // 全屏
      this.isFullscreen = !this.isFullscreen
      if (this.isFullscreen) {
        this.afterFullscreen = this.$refs.modelBody.offsetHeight
        document.querySelector('.Vmodel .ivu-modal').style.width = '100%'
        document.querySelector('.Vmodel .ivu-modal').style.top = '0'
        document.querySelector('.Vmodel .ivu-modal-body').style.height = document.body.offsetHeight - 112 + 'px'
        this.$refs.modelBody.style.height = '98%'
      } else {
        this.$refs.modelBody.style.height = '445px'
        document.querySelector('.Vmodel .ivu-modal').style.width = '1200px'
        document.querySelector('.Vmodel .ivu-modal').style.top = '100px'
        document.querySelector('.Vmodel .ivu-modal-body').style.height = this.afterFullscreen + 122 + 'px'
      }
    },
    amplification() { // 调用子组件放大事件
      this.$refs.child.amplification()
    },
    shrink() { // 调用子组件缩小事件
      this.$refs.child.shrink()
    },
    changeCurrent(val) { // 页数变更响应
      this.page = val
      this.sendData()
      setTimeout(() => {
        this.timeAllHeight = this.$refs.modolBodyLeftDetails.offsetHeight + 42
      }, 0)
    },
    changePageSize(val) { // 最大条数响应
      this.pageNum = val
      this.sendData()
      setTimeout(() => {
        this.timeAllHeight = this.$refs.modolBodyLeftDetails.offsetHeight + 42
      }, 0)
    }
  }
}
</script>

<style scoped>
.Vmodel {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}
.lf {
  float: left;
}
.rt {
  float: right;
}
.header {
  color: #fff;
}
.modol-header {
  overflow: hidden;
  margin-bottom: 12px;
}
.modol-header >>> .ivu-btn {
  margin-right: 12px;
}
.modol-body {
  overflow-y: auto;
  overflow-x: hidden;
  height: 445px;
}
.modol-body-left {
  width: 100px;
  text-align: center;
}
.modol-body-left-title {
  background-color: #0f2343;
  height: 32px;
  line-height: 32px;
}
.list-title {
  height: 32px;
  line-height: 32px;
}
.modol-body-right {
  height: 100%;
}
.modol-body-left-details-list {
  height: 16px;
  margin-top: 10px;
  line-height: 17px;
}
.full-style {
  cursor: pointer;
  color: #8597ad;
  transition: all 0.25s linear;
}
.full-style:hover {
  color: #fff;
}
.footer {
  /* overflow: hidden; */
  height: 32px;
  clear: both;
}
.cancel {
  margin-left: 24px;
}
.garden {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #fff;
  margin: 8px;
}
.garden-box {
  line-height: 32px;
  margin-left: 12px;
}
.no-data {
  position: relative;
  top: 45%;
  left: 48%;
}
</style>
