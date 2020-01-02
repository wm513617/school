<!-- 单兵头像 -->
<template>
  <div>
    <div class="headCon"><img :src="iconUrl" @error="iconImageLoadErr"></div>
  </div>
</template>

<script>
import mapUtils from 'assets/3DMap/mapUtil.js'
export default {
  name: 'singleHead',
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      element: null,
      iconLoadError: false // 头像加载失败
    }
  },
  computed: {
    iconUrl() { // 头像地址
      return this.iconLoadError ? mapUtils.TDDEFAULTOPS.singleDefaultImg : this.data.photo
    },
    location() {
      return this.data.loc
    }
  },
  watch: {
    location: {
      handler(val) { // 处理方法
        if (val) {
          this.updateHeadLoc(val) // 移动弹出框的位置
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
    updateHeadLoc(location) { // 更新头像的位置
      let x = location.x - 100
      let y = location.y
      this.$el.children[0].style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)'
    },
    iconImageLoadErr() { // 头像加载失败
      this.iconLoadError = true
    }
  }
}
</script>

<style scoped>
.headCon {
  width: 100px;
  height: 100px;
  top: 50px;
  left: 50px;
  background: rgba(153, 153, 153, 0.3);
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
.headCon img{
  height: 100px;
  border-radius:50px
}
</style>
