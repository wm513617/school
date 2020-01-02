<template>
  <div>
    <div class="popup">
      <div class="popup_top">
        <span class="title"><slot name="title"></slot></span>
        <div title="关闭" @click="closePopup" class="close iconfont icon-error"></div>
      </div>
      <div class="popup-content"><slot></slot></div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'popup',
  data() {
    return {
      popuper: null // 气泡框的dom
    }
  },
  computed: {
    ...mapState({
      selectedEntityScreenCo: ({ tdIndex }) => tdIndex.selectedEntityScreenCo // 选择实体的Cartesian2屏幕坐标---韩杰---2018-10-26 09:25:13
    })
  },
  watch: {
    selectedEntityScreenCo: {
      handler(newVal, oldVal) { // 处理方法
        if (newVal) {
          this.popUpPosition(newVal) // 移动弹出框的位置
        }
      },
      deep: true // 深度监听
    }
  },
  mounted() { // 组件挂载完成处理函数
    this.popuper = this.$el.children[0] // 气泡框的dom
    if (this.selectedEntityScreenCo) { // 有位置数据时
      this.popUpPosition(this.selectedEntityScreenCo) // 移动弹出框的位置
    }
  },
  methods: {
    ...mapActions(['setShowPopup']),
    popUpPosition(cartesian2) { // 计算弹出框的位置，传入参数屏幕坐标
      // let isCartesian2 = cartesian2 instanceof this.$context.Cesium.Cartesian2
      if (this.popuper) {
        let x = cartesian2.x - this.popuper.clientWidth / 2
        let y = cartesian2.y - this.popuper.clientHeight - 30
        this.popuper.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)'
      }
    },
    closePopup() { // 关闭气泡弹框
      this.setShowPopup(false)
    }
  }
}
</script>

<style scoped>
/* 气泡容器样式 */
.popup {
  position: absolute;
  z-index: 100001;
  padding: 0;
  color: #fff;
  font-size: 14px;
  border-radius: 8px;
  background: #1b3153;
  width: auto;
  height: auto;
}
/* 气泡容器渲染前后的公用样式 */
.popup:after,
.popup:before {
  top: 100%;
  left: 50%;
  border: solid transparent;
  content: ' ';
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
/* 气泡容器渲染后的样式 */
.popup:after {
  border-color: rgba(136, 183, 213, 0);
  border-top-color: #1b3153;
  border-width: 12px;
  margin-left: -12px;
}
/* 气泡容器渲染前的样式 */
.popup:before {
  border-color: rgba(194, 225, 245, 0);
  border-top-color: #ccc;
  border-width: 13px;
  margin-left: -13px;
}
/* 气泡顶部的样式 */
.popup_top {
  background: #0f2343;
  padding: 0;
  height: 30px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
/* 气泡标题的样式 */
.title {
  height: 30px;
  line-height: 30px;
  margin: 0 10px;
  float: left;
  text-align: left;
}
/* 气泡关闭按钮的样式 */
.close {
  height: 30px;
  float: right;
  margin: 2px 5px;
  cursor: pointer;
}
/* 气泡内容的样式 */
.popup-content {
  margin: 5px 5px;
}
</style>
