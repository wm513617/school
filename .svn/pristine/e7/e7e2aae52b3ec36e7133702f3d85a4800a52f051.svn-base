<template>
  <div v-show="isShowModel">
    <!-- 抓拍图片显示 -->
    <div class="face-head" v-if="node.faceType === 'faceSnap'">
      <div :style="{ color: fontColor }">
        <div class="face-label" :title="node.userName">{{ node.userName }}</div>
      </div>
      <div class="headCon" :style="{ borderColor:  borderColor}"><img :src="node.userImage"></div>
    </div>
    <!-- 单兵显示 -->
    <div v-if="node.faceType === 'single' || node.faceType === 'singleTrack'">
      <div class="singleHeadCon"><img :src="node.photo"></div>
    </div>
  </div>
</template>
<script>
/* eslint-disable no-undef */
/* eslint-disable-next-line no-unused-vars */
import { mapGetters, mapActions, mapState } from 'vuex'
import AddFaceHead from './AddFaceHead.js'
export default {
  name: 'face-head',
  render(createElement) { return {} },
  data() {
    return {
      isShowModel: false,
      popMarker: null
    }
  },
  props: {
    fengMap: { // 是否激活
      type: Object
    },
    node: { // 节点数据{pointId:设备标识, passImage:最新经过抓拍图片地址, similar:相似度, deviceName:设备名称, passCount:经过次数, timestamp:最新经过时间, coordinates:坐标}
      type: Object
    },
    fontColor: {
      type: String,
      default: '#D0021B'
    },
    borderColor: {
      type: String,
      default: '#D0021B'
    }
  },
  computed: {
    ...mapState({
      fmapMarkerHeight: ({ fengMap }) => fengMap.fmapMarkerHeight
    }),
    boxSize() {
      return (this.node.faceType === 'faceSnap' || this.node.faceType === 'alarmTrack' || this.node.faceType === 'single') ? [64, 94] : [130, 155]
    }
  },
  watch: {
    node: {
      handler: function(node) {
        this.popMarker && this.popMarker.close()
        this.$nextTick(() => {
          this.addPopInfoWindow(node)
        })
      },
      deep: true
    }
  },
  mounted() {
    if (this.node) {
      this.addPopInfoWindow(this.node)
    }
  },
  methods: {
    ...mapActions('fengMapFace', ['setPopInfoWindow']),
    // 添加头像弹框
    addPopInfoWindow(node) {
      const hasEvent = node.faceType === 'alarmTrack' || node.faceType === 'personTrack' || node.faceType === 'vehicleTrack'
      const key = node.faceType + node.pointId
      console.log('this.fmapMarkerHeight' + this.fmapMarkerHeight)
      // 添加独立信息窗
      let ctlOpt = {
        mapCoord: {
          // 设置弹框的x轴
          x: node.coordinates[0],
          // 设置弹框的y轴
          y: node.coordinates[1],
          // 控制信息框距离地图的高度
          height: this.fmapMarkerHeight,
          // 设置弹框位于的楼层,当前聚焦楼层
          groupID: this.fengMap.focusGroupID
        },
        // 设置弹框的宽度
        width: this.boxSize[0],
        // 设置弹框的高度px
        height: this.boxSize[1],
        // 设置弹框的内容
        content: hasEvent ? `<div id="${key}"></div>` : this.$el.innerHTML,
        closeCallBack: function() {
          // 信息窗点击关闭操作
        }
      }
      this.popMarker = new fengmap.FMPopInfoWindow(this.fengMap, ctlOpt)
      this.setPopInfoWindow({ key: key, popMarker: this.popMarker })
      this.$emit('drawend', node, this.popMarker) // 抛出绘制完成
      if (hasEvent) {
        const faceEvent = new AddFaceHead($)
        faceEvent.addComponent(node, this.fontColor, this.borderColor)
      }
    }
  },
  beforeDestroy() {
    this.popMarker && this.popMarker.close()
  }
}
</script>

<style>
  /* 报警 */
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
  /* 单兵 */
  .singleHeadCon {
    width: 100px;
    height: 100px;
    top: 50px;
    left: 50px;
    background: rgba(153, 153, 153, 0.6);
    -moz-border-radius: 50px;
    -webkit-border-radius: 50px;
    border-radius: 50px;
    position: absolute;
    z-index: 999;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .singleHeadCon img {
    height: 100px;
    border-radius:50px
  }
  /* 人像轨迹节点、车辆轨迹节点 */
  .triangle_bottom {
    width: 24px;
    height: 12px;
    position: absolute;
    left: 50px;
    /* z-index: 9996; */
  }
  .triangle_bottom i {
    width: 0px;
    height: 0px;
    border: 12px solid transparent;
    position: absolute;
  }
  .triangle_bottom .colors {
    border-top: 12px solid #D0021B;
    /* z-index: 9996; */
  }
  .triangle_bottom .trans {
    border-top: 12px solid white;
    /* z-index: 9996; */
    top: -3px;
  }
  /* 气泡容器样式 */
  .popup {
    position: absolute;
    background: #FFFFFF;
    border: 3px solid #D0021B;
    padding: 0;
    border-radius: 5px;
    width: auto;
    height: auto;
    cursor: pointer;
    /* z-index: 9996; */
  }
  .contentContainer {
    margin: 2px;
    font-family: PingFangSC-Medium;
    font-size: 12px;
  }
  .contentTop {
    width: 120px;
    height: 90px;
    background: rgba(153, 153, 153, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .contentTop .img-box {
    height: 90px;
    width: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .contentTop .img-box img{
    display: inline-block;
    cursor: pointer;
    width: auto;
    height: auto;
    max-width: 120px;
    max-height: 90px;
  }
  .contentTop .similarity{
    position: absolute;
    top: 0;
    right: 0;
    height: 20px;
    width: 30px;
    text-align: center;
    background: rgba(255,255,255,0.9);
    border-radius: 3px;
  }
  .contentTop .similarity span{
    line-height: 20px;
    color: #08BA53;
  }
  .contentBottom {
    position: relative;
    width: 120px;
    height: 52px;
  }
  .contentBottom .time {
    white-space: nowrap;
    margin: 3px 2px;
    text-align: left;
    color: rgba(70,49,49,0.80);
    overflow:hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    width: 100%;
    line-height: 15px;
  }
  .contentBottom .des {
    margin: 0px 4px;
    text-align: left;
    color: rgba(70,49,49,0.80);
    overflow:hidden;
    text-overflow:ellipsis;
    display:-webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-height: 15px;
  }
  .contentBottom span {
    position: absolute;
    bottom: 2px;
    right: 16px;
    color: rgba(8,186,83,0.80);
  }
  /* 蜂鸟弹框样式修改 */
  .fm-control-popmarker {
    background: none !important;
    border: none !important;
    padding: 0 !important;
  }
  .fm-control-popmarker > div {
    height: auto !important;
  }
  .fm-control-popmarker-closebtn, .fm-control-popmarker-bot, .fm-control-popmarker-top {
    display: none;
  }
</style>
