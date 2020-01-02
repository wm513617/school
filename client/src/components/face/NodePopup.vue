<!-- 人像识别模块轨迹追踪节点气泡框组件 -->
<template>
    <div class="popup" :style="{ borderColor:  borderColor}" @click="openFaceCarModel('currentPopupTop')">
        <div class="contentContainer">
            <div class="contentTop">
              <div class="img-box" @click.stop="openFaceCarModel('changeShowModel')">
                <img :src="node.passImage">
              </div>
              <div class="similarity" v-if="node.hasOwnProperty('similar')">
                <span>{{ node.similar + '%' }}</span>
              </div>
            </div>
            <div class="contentBottom">
              <div class="time">{{ $moment.unix(node.time).format('YYYY-MM-DD HH:mm:ss') }}</div>
              <div class="des">{{ node.deviceName }}</div>
              <span>{{ node.passCount + '次' }}</span>
            </div>
        </div>
        <div class="triangle_bottom">
          <i class="colors" :style="{borderTopColor: borderColor}"></i>
          <i class="trans"></i>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Popup',
  data() {
    return {
      popuper: null
    }
  },
  computed: {
    borderColor() { // 气泡动态样式
      return this.node.borderColor
    }
  },
  props: { // 父组件传入的数据
    node: { // 节点数据{pointId:设备标识, passImage:最新经过抓拍图片地址, similar:相似度, deviceName:设备名称, passCount:经过次数, timestamp:最新经过时间, coordinates:坐标}
      type: Object
    },
    olLib: { // 地图类库
      type: Object
    },
    map: { // 地图对象
      type: Object
    }
  },
  mounted() { // 组件挂载完成处理函数
    let offsetX = -(this.$el.clientWidth / 2.0) - 2 // x方向偏移量
    let offsetY = -(this.$el.clientHeight + 23) // y方向偏移量
    this.popuper = new this.olLib.Overlay(({
      element: this.$el,
      positioning: 'center-center',
      offset: [offsetX, offsetY]
    }))
    this.map.addOverlay(this.popuper)
    let coord = this.node.coordinates
    if (coord && coord.length > 0) {
      this.popuper.setPosition(coord)
    }
  },
  methods: {
    openFaceCarModel(type) {
      console.log('人像触发事件：' + type)
      this.$emit(type, this.node)
    }
  },
  beforeDestroy() {
    this.map.removeOverlay(this.popuper) // 移除弹出框
  }
}
</script>

<style scoped>
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
/* 气泡容器渲染前后的公用样式 */
/* .popup:after, .popup:before {
  top: 100%;
  left: 50%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
} */
/* 气泡容器渲染后的样式 */
/* .popup:after {
  border-color: rgba(255, 255, 255, 0);
  border-top-color: #FFFFFF;
  border-width: 11px;
  margin-left: -11px;
} */
/* 气泡容器渲染前的样式 */
/* .popup:before {
  border-color: rgba(255, 255, 255, 0);
  border-top-color: #D0021B;
  border-width: 12px;
  margin-left: -12px;
} */
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
.contentTop  .img-box {
  height: 90px;
  width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.img-box img{
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
</style>
