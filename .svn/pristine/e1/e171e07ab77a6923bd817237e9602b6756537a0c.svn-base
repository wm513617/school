<template>
<div v-if="num < 10" @click="$emit('setzIndex')">
    <div v-if="usageMode === 'map'" class="modal-box clearfix" :style="{zIndex: active === true?index + 1:(active === false?index-1:['getModalNumber' + this.modelType] + 1), border: modalBorder}">
      <video-hierarchy ref="hierarchy" hierachyWidth="600px" hierachyHeight="430px">
        <div class="modal-left">
          <div class="title clearfix" v-show="!min">
            <div class="box-name">{{title}}</div>
            <div v-if="showPanel" :class="['iconfont', !isExtend? 'icon-shrink' : 'icon-extend']" @click="isExtend = !isExtend"></div>
            <div v-if="canClose" class="close iconfont icon-close1" @click="close"></div>
            <div v-if="canScale" class="scale iconfont icon-reduce" @click.stop="changeContext"></div>
          </div>
          <div class="map-modal-content" :style="boxPosition" @click="$emit('setzIndex')">
            <slot></slot>
          </div>
        </div>
      </video-hierarchy>
      <div class="next-panel" v-show="showPanel&&!isExtend&&!min"><slot name="panel"></slot></div>
    </div>
    <div v-else class="modal-box clearfix" :style="{zIndex: active === true?index + 1:(active === false?index-1:['getModalNumber' + this.modelType] + 1), border: modalBorder}">
      <div class="modal-left">
        <div class="title clearfix" v-show="!min">
          <div class="box-name">{{title}}</div>
          <div v-if="showPanel" :class="['iconfont', !isExtend? 'icon-shrink' : 'icon-extend']" @click="isExtend = !isExtend"></div>
          <div v-if="canClose" class="close iconfont icon-close1" @click="close"></div>
          <div v-if="canScale" class="scale iconfont icon-reduce" @click.stop="changeContext"></div>
        </div>
        <div class="map-modal-content" :style="boxPosition" @click="$emit('setzIndex')">
          <slot></slot>
        </div>
      </div>
      <div class="next-panel" v-show="showPanel&&!isExtend&&!min"><slot name="panel"></slot></div>
    </div>
    <div class="map-image-box" v-show="min" @click.stop="scale" :style="{width:minClass !== 'images'?'50px':'93px',left: circleLeft}">
      <div v-if="minClass !== 'images'" :class="[minClass, 'iconfont']" :style="{backgroundImage: singBackground}">
        <span v-if="showTips" class="animation-opc"></span>
      </div>
      <div v-else class="clearfix">
        <div v-for="(item,i) in minImg" :key="i" class="images" :style="{marginLeft: i?'-30px':'0',backgroundImage: item?`url(${item})`:`url('/static/noSolider.jpg')`}"></div>
        <span v-if="showTips" class="animation-opc more"></span>
      </div>
    </div>
</div>
</template>

<script>
/**
 * title 标题
 * position 弹窗默认显示位置
 * showTips 是否收到新的消息
 * minImg 缩小的显示图标 传字符串为单聊，传数组为多聊
 * $emit('close') 关闭事件
 * $emit('scale') 点击放大事件
 * showPanel 是否添加同级面板
 * canClose 是否显示关闭按钮，默认显示
 * canScale 是否显示缩小按钮，默认显示
 * modalBorder 窗口边框颜色
 * modelType 当前是2D地图还是3D地图 可选值2D\3D 默认2D
 * eventType 用于区别缩略图
 *    video 视频播放缩略图
 *    alarm 报警处理缩略图
 *    handle 手工报警缩略图
 *    patrol 巡更异常上报缩略图
 *    single 单兵一键报警缩略图
 *    broast 广播对讲缩略图
 *    videospeek 视频对讲缩略图
 *    facealarm 人像报警处理缩略图
 *    track 接力追踪缩略图
 * slot 默认为内容
 *    name='panel' 分发同级面板
 */
import videoHierarchy from '../videoComponentsNew/videoHierarchy.vue'
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    videoHierarchy
  },
  name: 'dragx',
  data() {
    return {
      dragTitle: null,
      isTitleMove: false,
      titleData: {},
      dragCircle: null,
      isCircleMove: false,
      circleData: {},
      circleLeft: '',
      min: false,
      mincanshow: false,
      mouseState: '',
      isExtend: true,
      num: 0,
      downPosition: 0,
      upPosition: 0
    }
  },
  props: {
    title: {
      type: String,
      default: '标题'
    },
    showTips: {
      type: Boolean,
      default: false
    },
    minImg: {
      type: [Number, String]
    },
    showPanel: {
      type: Boolean,
      default: false
    },
    position: {
      type: Object
    },
    index: {
      type: [Number, String],
      default: 1
    },
    active: {
      type: Boolean
    },
    modalBorder: {
      type: String,
      default: ''
    },
    canScale: {
      type: Boolean,
      default: true
    },
    canClose: {
      type: Boolean,
      default: true
    },
    modelType: {
      type: String,
      default: '2D'
    },
    eventType: {
      type: String,
      default: 'video'
    },
    usageMode: {
      // 是什么地方使用
      type: String,
      default: ''
    }
  },
  created() {
    if (this.modelType === '2DEdit') {
      return
    }
    this.num = this['getModalNumber' + this.modelType]
    if (this['getModalNumber' + this.modelType] < 10) {
      this['CHANGE_MODAL_NUMBER' + '_' + this.modelType](this['getModalNumber' + this.modelType] + 1)
    } else {
      this.warningMsg('最多显示10个对话框！')
    }
  },
  computed: {
    ...mapState({
      mapEditRightPage: ({ mapIndex }) => mapIndex.mapEditRightPage.page
    }),
    ...mapGetters('map3DApplyIX', {
      isOpenLeftPanel3D: 'isOpenLeftPanel',
      isShowEmergencyPanel3D: 'isShowEmergencyPanel',
      isExpandTree3D: 'isExpandTree',
      isShowToolsPanel3D: 'isShowToolsPanel',
      isShowFirstToolPanel3D: 'isShowFirstToolPanel',
      getModalNumber3D: 'getModalNumber',
      isShowNav: 'isShowNav'
    }),
    ...mapGetters('map2DApplyIX', {
      isOpenLeftPanel2D: 'isOpenLeftPanel',
      isShowEmergencyPanel2D: 'isShowEmergencyPanel',
      isExpandTree2D: 'isExpandTree',
      isShowToolsPanel2D: 'isShowToolsPanel',
      isShowFirstToolPanel2D: 'isShowFirstToolPanel',
      getModalNumber2D: 'getModalNumber'
    }),
    minClass() {
      if (typeof (this.minImg) === 'string' || this.minImg === undefined) {
        return 'sing-pawn-img'
      } else {
        return 'images'
      }
    },
    singBackground() {
      if (this.eventType) {
        let img = 'icon-baojing'
        switch (this.eventType) { // UI 提供图片后替换图片
          case 'video':
            img = `url('/static/video_play.png')`
            break
          case 'alarm':
            img = `url('/static/alarming.png')`
            break
          case 'handle':
            img = `url('/static/handle_alarm.png')`
            break
          case 'patrol':
            img = `url('/static/patrol_alarming.png')`
            break
          case 'single':
            img = `url('/static/single_alarm.png')`
            break
          case 'broast':
            img = `url('/static/broast.png')`
            break
          case 'videospeek':
            img = `url('/static/video_speech.png')`
            break
          case 'facealarm':
            img = `url('/static/face_alarm.png')`
            break
          case 'track':
            img = `url('/static/track.png')`
            break
        }
        return img
      }
      if (this.minClass === 'sing-pawn-img' && this.minImg) {
        return `url(${this.minImg})`
      } else {
        return `url('/static/noSolider.jpg')`
      }
    },
    boxPosition() {
      if (!this.min) {
        return null
      } else {
        return {
          position: 'absolute',
          top: '-9999px',
          right: '-9999px',
          height: '0px'
        }
      }
    },
    modalArea() {
      const area = {}
      const ele = this.$el ? this.$el.querySelector('.modal-box') : {}
      if (this.modelType === '2DEdit') {
        area.minLeft = 330
        if (this.mapEditRightPage) {
          area.maxLeft = window.innerWidth - ele.clientWidth - 300
        } else {
          area.maxLeft = window.innerWidth - ele.clientWidth
        }
        area.minTop = 72
        area.maxTop = window.innerHeight - ele.clientHeight
        return area
      }
      if (this['isOpenLeftPanel' + this.modelType] && this['isShowEmergencyPanel' + this.modelType]) {
        area.minLeft = 655
      } else if (this['isExpandTree' + this.modelType]) {
        area.minLeft = 312
      } else {
        area.minLeft = 0
      }
      if (!this['isShowFirstToolPanel' + this.modelType]) {
        area.maxLeft = window.innerWidth - ele.clientWidth
      } else if (this['isShowToolsPanel' + this.modelType]) {
        area.maxLeft = window.innerWidth - ele.clientWidth - 336
      } else {
        area.maxLeft = window.innerWidth - ele.clientWidth - 64
      }
      if (this.isShowNav) {
        area.minTop = 72
      } else {
        area.minTop = 0
      }
      area.maxTop = window.innerHeight - ele.clientHeight
      return area
    },
    circleArea() {
      const area = {}
      if (this.modelType === '2DEdit') {
        area.minLeft = 330
        if (this.mapEditRightPage) {
          area.maxLeft = window.innerWidth - 350
        } else {
          area.maxLeft = window.innerWidth - 50
        }
        area.minTop = window.innerHeight - (window.innerHeight * 1) / 3 + 70
        area.maxTop = window.innerHeight - 50
        return area
      }
      if (this['isOpenLeftPanel' + this.modelType] && this['isShowEmergencyPanel' + this.modelType]) {
        area.minLeft = 655
      } else if (this['isExpandTree' + this.modelType]) {
        area.minLeft = 312
      } else {
        area.minLeft = 0
      }
      let width = 0
      if (this.minClass !== 'images') {
        width = 50
      } else {
        width = 93
      }
      if (!this['isShowFirstToolPanel' + this.modelType]) {
        area.maxLeft = window.innerWidth - width
      } else if (this['isShowToolsPanel' + this.modelType]) {
        area.maxLeft = window.innerWidth - width - 336
      } else {
        area.maxLeft = window.innerWidth - width - 64
      }
      if (this.isShowNav) {
        area.minTop = window.innerHeight - (window.innerHeight * 1 / 3) + 70
      } else {
        area.minTop = window.innerHeight - (window.innerHeight * 1 / 3)
      }
      area.maxTop = window.innerHeight - 50
      return area
    }
  },
  mounted() {
    this.$nextTick(() => { // 设置默认显示位置
      const ele = this.$el ? this.$el.querySelector('.modal-box') : {}
      if (this.position) {
        ele.style.left = this.position.left ? this.position.left + 'px' : (window.innerWidth / 2 - parseInt(ele.clientWidth) / 2 + 'px')
        ele.style.top = this.position.right ? this.position.right + 'px' : (window.innerHeight / 2 - parseInt(ele.clientHeight) / 2 + 'px')
      } else {
        if (ele) {
          const areaW = window.innerWidth
          ele.style.left = areaW / 2 - parseInt(ele.clientWidth) / 2 + 'px'
          ele.style.top = window.innerHeight / 2 - parseInt(ele.clientHeight) / 2 + 'px'
        }
      }
      const el = this.$el ? this.$el.querySelector('.map-image-box') : {}
      el.style.top = window.innerHeight - 70 + 'px'
      this.titleMove('.title')
    })
  },
  methods: {
    ...mapMutations('map3DApplyIX', {
      CHANGE_MODAL_NUMBER_3D: 'CHANGE_MODAL_NUMBER',
      CHANGE_MODAL_NUMBER_3DEdit: 'CHANGE_MODAL_NUMBER'
    }),
    ...mapMutations('map2DApplyIX', {
      CHANGE_MODAL_NUMBER_2D: 'CHANGE_MODAL_NUMBER',
      CHANGE_MODAL_NUMBER_2DEdit: 'CHANGE_MODAL_NUMBER'
    }),
    scale() {
      if (this.upPosition.left === this.downPosition.left && this.upPosition.top === this.downPosition.top) {
        this.min = !this.min
        this.$emit('scale')
      }
    },
    close() {
      if (this.modelType !== '2DEdit') {
        if (this['getModalNumber' + this.modelType] !== 0) {
          this['CHANGE_MODAL_NUMBER' + '_' + this.modelType](this['getModalNumber' + this.modelType] - 1)
        }
      }
      this.$emit('close')
    },
    changeContext() {
      this.$emit('changeContext')
      this.titleMove('.map-image-box')
      let width = 0
      if (this.minClass !== 'images') {
        width = 50
      } else {
        width = 93
      }
      this.circleLeft = this.circleArea.minLeft + (width + 10) * this.num + 'px'
      this.min = !this.min
    },
    titleMove(el) {
      if (el === '.title') {
        this.isTitleMove = false
        this.dragTitle = this.$el.querySelector(el)
        if (this.dragTitle) {
          this.dragTitle.addEventListener('mousedown', this.titleDown, true)
          document.addEventListener('mousemove', this.boxMove, true)
          document.addEventListener('mouseup', this.titleUp, true)
        }
      } else {
        this.isCircleMove = false
        this.dragCircle = this.$el.querySelector(el)
        if (this.dragCircle) {
          this.dragCircle.addEventListener('mousedown', this.circleDown, true)
          document.addEventListener('mousemove', this.cirMove, true)
          document.addEventListener('mouseup', this.circleUp, true)
        }
      }
    },
    titleDown(e) {
      this.isTitleMove = true
      this.$emit('setzIndex')
      if (e && e.target.classList.contains('title')) {
        this.$emit('titleMouseDown', e)
      }
      const el = this.$el.querySelector('.modal-box')
      let rect = el.getBoundingClientRect()
      const obj = this.getStyleNumValue('title')
      this.titleData = {
        ...obj,
        deltX: e.pageX - rect.left,
        deltY: e.pageY - rect.top,
        startX: rect.left,
        startY: rect.top
      }
      if (e.target.classList.contains('title')) {
        document.body.style.cursor = 'move'
      }
    },
    boxMove(e) {
      if (this.isTitleMove) {
        let targetPageX = e.pageX
        let targetPageY = e.pageY
        const ele = this.$el ? this.$el.querySelector('.modal-box') : ''
        const style = window.getComputedStyle(ele)
        let deltX = targetPageX - this.titleData.startX - this.titleData.deltX
        let deltY = targetPageY - this.titleData.startY - this.titleData.deltY
        let newLeft = parseInt(parseInt(style.getPropertyValue('left'), 10) || '0', 10) + deltX
        let newTop = parseInt(parseInt(style.getPropertyValue('top'), 10) || '0', 10) + deltY
        this.titleData.left = newLeft
        this.titleData.top = newTop
        this.titleData.startX = this.titleData.startX + deltX
        this.titleData.startY = this.titleData.startY + deltY
        if (ele) {
          if (parseInt(ele.style.left) < this.modalArea.minLeft) {
            this.titleData.left = this.modalArea.minLeft
          }
          if (this.modalArea.maxLeft < parseInt(ele.style.left)) {
            this.titleData.left = this.modalArea.maxLeft
          }
          if (parseInt(ele.style.top) < this.modalArea.minTop) {
            this.titleData.top = this.modalArea.minTop
          }
          if (this.modalArea.maxTop < parseInt(ele.style.top)) {
            this.titleData.top = this.modalArea.maxTop
          }
        }
        ele.style.left = this.titleData.left + 'px'
        ele.style.top = this.titleData.top + 'px'
      }
    },
    titleUp(e) {
      this.isTitleMove = false
      document.body.style.cursor = ''
      if (e && e.target.classList.contains('title')) {
        this.$emit('titleMouseUp')
      }
    },
    circleDown(e) {
      this.isCircleMove = true
      this.mouseState = 'down'
      this.$emit('setzIndex')
      if (e.target.classList.contains('map-image-box')) {
        document.body.style.cursor = 'move'
      }
      const el = this.$el.querySelector('.map-image-box')
      let rect = el.getBoundingClientRect()
      const obj = this.getStyleNumValue('circle')
      this.circleData = {
        ...obj,
        deltX: e.pageX - rect.left,
        deltY: e.pageY - rect.top,
        startX: rect.left,
        startY: rect.top
      }
    },
    cirMove(e) {
      if (this.mouseState) {
        this.mincanshow = true
      }
      if (this.isCircleMove) {
        let targetPageX = e.pageX
        let targetPageY = e.pageY
        const ele = this.$el ? this.$el.querySelector('.map-image-box') : ''
        const style = window.getComputedStyle(ele)
        let deltX = targetPageX - this.circleData.startX - this.circleData.deltX
        let deltY = targetPageY - this.circleData.startY - this.circleData.deltY

        let newLeft = parseInt(parseInt(style.getPropertyValue('left'), 10) || '0', 10) + deltX
        let newTop = parseInt(parseInt(style.getPropertyValue('top'), 10) || '0', 10) + deltY
        this.circleData.left = newLeft
        this.circleData.top = newTop
        this.circleData.startX = this.circleData.startX + deltX
        this.circleData.startY = this.circleData.startY + deltY
        if (ele) {
          if (parseInt(ele.style.left) < parseInt(this.circleArea.minLeft)) {
            this.circleData.left = parseInt(this.circleArea.minLeft)
          }
          if (parseInt(ele.style.left) > parseInt(this.circleArea.maxLeft)) {
            this.circleData.left = parseInt(this.circleArea.maxLeft)
          }
          if (parseInt(ele.style.top) < parseInt(this.circleArea.minTop)) {
            this.circleData.top = parseInt(this.circleArea.minTop)
          }
          if (parseInt(ele.style.top) > parseInt(this.circleArea.maxTop)) {
            this.circleData.top = parseInt(this.circleArea.maxTop)
          }
        }
        ele.style.left = this.circleData.left + 'px'
        ele.style.top = this.circleData.top + 'px'
        this.downPosition = {
          left: this.circleData.left,
          top: this.circleData.top
        }
      }
    },
    circleUp() {
      this.isCircleMove = false
      const timer = setTimeout(() => {
        this.mincanshow = false
        this.mouseState = ''
        this.upPosition = {
          left: this.circleData.left,
          top: this.circleData.top
        }
        clearInterval(timer)
      }, 0)
      document.body.style.cursor = ''
    },
    getStyleNumValue(type) {
      let el = null
      if (type === 'title') {
        el = this.$el.querySelector('.modal-box')
      } else {
        el = this.$el.querySelector('.map-image-box')
      }
      const style = window.getComputedStyle(el)
      return {
        width: parseInt(style.getPropertyValue('width'), 10),
        height: parseInt(style.getPropertyValue('height'), 10),
        left: parseInt(style.getPropertyValue('left'), 10),
        top: parseInt(style.getPropertyValue('top'), 10),
        borderLeft: parseInt(style.getPropertyValue('border-left-width'), 10),
        borderTop: parseInt(style.getPropertyValue('border-top-width'), 10),
        borderRight: parseInt(style.getPropertyValue('border-right-width'), 10),
        borderBottom: parseInt(style.getPropertyValue('border-bottom-width'), 10)
      }
    },
    removeListener() {
      if (this.dragTitle) {
        this.dragTitle.removeEventListener('mousedown', this.titleDown)
        document.removeEventListener('mousemove', this.boxMove)
        document.removeEventListener('mouseup', this.titleUp)
      }
      if (this.dragCircle) {
        this.dragCircle.removeEventListener('mousedown', this.circleDown)
        document.removeEventListener('mousemove', this.cirMove)
        document.removeEventListener('mouseup', this.circleUp)
      }
    }
  },
  beforeDestroy() {
    const n = this['getModalNumber' + this.modelType] - 1 > 0 ? this['getModalNumber' + this.modelType] - 1 : 0
    this['CHANGE_MODAL_NUMBER' + '_' + this.modelType](n)
    this.removeListener()
  }
}
</script>

<style lang="less" scoped>
.modal-box {
  position: fixed;
  top: 50%;
  left: 50%;
  user-select: none;
  color: #fff;
  font-size: 12px;
  z-index: 2;
}
.modal-left, .next-panel {
  background-color: #1c3053;
  border-radius: 5px;
  float: left;
  // margin-left: 2px;
}
.modal-box .title {
  height: 40px;
  line-height: 40px;
  width: 100%;
  text-align: center;
  clear: both;
  border-radius: 5px 5px 0 0;
  background-color: #011532;
  cursor: move;
}
.modal-box .title .box-name {
  float: left;
  margin: 0 10px;
}
.modal-box .title .scale,
.modal-box .title .close,
.modal-box .title .icon-extend,
.modal-box .title .icon-shrink {
  float: right;
  margin: 0 10px;
  cursor: pointer;
}
.map-image-box {
  height: 50px;
  position: fixed;
  top: 0;
  z-index: 2;
  text-align: center;
  border-radius: 50%;
  cursor: move;
  user-select: none;
}
.map-image-box .iconfont {
  width: 50px;
  height: 50px;
  line-height: 50px;
  font-weight: 600;
  font-size: 32px;
  color: #ff3c00;
  border-radius: 50%;
}
.map-image-box span {
  background-color: red;
  width: 10px;
  height: 10px;
  float: right;
  border-radius: 50%;
}
.map-image-box span.more {
  position: absolute;
  right: 2px;
  top: 2px;
}
.sing-pawn-img {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: 50px 50px;
  border-radius: 50%;
}
.map-image-box .images {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  float: left;
  background-size: 50px;
  margin: 1px;
  border: 1px solid #fff;
}
// .modal-box .map-modal-content {
//   // overflow: auto;
// }
.clearfix:after {
  content: '.';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

@-moz-keyframes opc {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
 @-webkit-keyframes opc {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
 @-o-keyframes opc {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
 @keyframes opc {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.animation-opc {
  animation: opc 1.5s ease 0s infinite;
}
</style>
