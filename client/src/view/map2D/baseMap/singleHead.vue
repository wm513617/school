<!-- 单兵头像 -->
<template>
  <div class="headCon" @click="showAttrTab"><img :src="iconUrl" @error="iconImageLoadErr"></div>
</template>

<script>
import { DEFAULTOPS } from 'assets/2DMap/meta/common'
import { mapActions } from 'vuex'
export default {
  name: 'singleHead',
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      headIcon: null, // 头像Overlay组件
      iconLoadError: false // 头像加载失败
    }
  },
  computed: {
    iconUrl() { // 头像地址
      return this.iconLoadError ? DEFAULTOPS.singleHeadImg : this.data.photo
    },
    location() {
      return this.data.loc
    }
  },
  watch: {
    location: {
      handler(newVal, oldVal) { // 处理方法
        if (newVal) {
          let flag = false // 是否与之前相同
          if (oldVal) {
            flag = newVal.toString() === oldVal.toString()
          }
          !flag && this.updateHeadLoc(newVal) // 位置与之前不相同时更新头像的位置
        }
      },
      deep: true // 深度监听
    }
  },
  mounted() { // 组件挂载完成处理函数
    if (this.location) { // 有位置数据时
      this.updateHeadLoc(this.location) // 更新头像的位置
    }
  },
  methods: {
    ...mapActions(['getSingleHeadDataById', 'setSelectedMapPointRes']),
    updateHeadLoc(location) { // 更新头像的位置
      // console.log('更新单兵头像位置：', location)
      let offsetX = -32 // x方向偏移量 -(this.$el.clientWidth / 2.0)
      let offsetY = -84 // y方向偏移量 -(this.$el.clientHeight + 20)
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
    iconImageLoadErr() { // 头像加载失败
      this.iconLoadError = true
    },
    showAttrTab() {
      this.getSingleHeadDataById(this.data.userId).then(res => {
        this.setSelectedMapPointRes(res)
      })
    }
  },
  beforeDestroy() {
    this.$context2D.map.removeOverlay(this.headIcon) // 移除头像Overlay
  }
}
</script>

<style scoped>
.headCon {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.5);
  -moz-border-radius: 32px;
  -webkit-border-radius: 32px;
  border-radius: 32px;
  position: absolute;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.headCon img{
  height: 64px;
  border-radius: 32px
}
</style>
