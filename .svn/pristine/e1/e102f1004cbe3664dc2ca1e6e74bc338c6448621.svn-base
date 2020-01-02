<!-- 人脸头像 -->
<template>
  <div class="face-head" @mouseenter.stop="showClose = true" @mouseleave.stop="showClose = false"><!-- isTrack控制头像是否是轨迹头像 -->
    <div :style="{ color:  fontColor }"><div class="face-label" :title="data.userName">{{data.userName}}</div> <i v-if="data.isTrack && showClose" class="iconfont icon-fail" title="关闭轨迹" style="cursor: pointer;" @click="closeFaceAlarmTrack"></i></div>
    <div class="headCon" :style="{ borderColor:  borderColor}"><img :src="iconUrl"></div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'faceHead',
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      headIcon: null, // 头像Overlay组件
      showClose: false // 是否显示轨迹关闭图标
    }
  },
  computed: {
    iconUrl() { // 头像地址
      return this.data.userImage
    },
    location() {
      return this.data.coordinates
    },
    deltaX() {
      let deltaX = 0
      if (this.data.hasOwnProperty('deltaX')) {
        deltaX = this.data.deltaX
      }
      return deltaX
    },
    fontColor() {
      return this.data.borderColor.slice(0, -7) + ', 1)'
    },
    borderColor() { // 气泡动态样式
      return this.data.borderColor
    }
  },
  watch: {
    location: {
      handler(val) { // 处理方法
        if (val) {
          this.updateHeadLoc(val) // 更新头像的位置
        }
      },
      deep: true // 深度监听
    },
    deltaX(val) {
      this.updateHeadLoc(this.location) // 更新头像的位置
    }
  },
  mounted() { // 组件挂载完成处理函数
    if (this.location) { // 有位置数据时
      this.updateHeadLoc(this.location) // 更新头像的位置
    }
  },
  methods: {
    ...mapMutations('mapAlarm', ['REMOVE_USER_FACEALARM_TRAIL']),
    updateHeadLoc(location) { // 更新头像的位置
      let offsetX = -32 + this.deltaX // x方向偏移量
      let offsetY = -100 // y方向偏移量
      // console.log('设备：', this.data.pointName, ', 设备标识：', this.data.pointId, '，人员：', this.data.userName, '偏移位置：', offsetX, offsetY, 'location: ', location)
      this.headIcon = new this.$context2D.ol.Overlay(({
        element: this.$el,
        positioning: 'center-center',
        offset: [offsetX, offsetY]
      }))
      this.$context2D.map.addOverlay(this.headIcon)
      if (location && location.length > 0) {
        this.headIcon.setPosition(location)
      }
    },
    closeFaceAlarmTrack() { // 关闭人像布控轨迹追踪
      this.REMOVE_USER_FACEALARM_TRAIL(this.data.userId)
    }
  },
  beforeDestroy() {
    this.$context2D.map.removeOverlay(this.headIcon) // 移除头像Overlay
  }
}
</script>

<style scoped>
.face-head {
  width: 64px;
  text-align:center;
  position: absolute;
  /* z-index: 9998; */
}
.face-head > div{
  display: flex;
  justify-content: center;
  align-items: center;
}
.face-head .face-label{
  display: initial;
  font-weight: 900;
  font-size: 14px;
  max-width: 56px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  height: 20px;
  line-height: 20px;
}
.face-head > div i{
  height: 20px;
  line-height: 20px;
}
.headCon {
  width: 64px;
  height: 64px;
  background: rgba(153, 153, 153, 0.3);
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border: 4px solid #D0021B;
  border-radius: 50%;
  /* position: absolute; */
  overflow: hidden;
  /* display: flex;
  justify-content: center;
  align-items: center; */
  /* z-index: 9999; */
}
.headCon img{
  height: 64px;
  border-radius: 50%;
}
</style>
