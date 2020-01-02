<template>
 <div class="video-hierachy" @mousedown="clickHierachy" :style="{width: hierachyWidth, height: hierachyHeight}">
   <iframe ref="videoHierachyIframe" class="video-hierachy-uniqueness-dfk" :style="{'z-index': zIndex }"></iframe>
   <div ref="videoHierachyDiv" :style="{position: 'absolute',left: 0,top: 0,width: '100%',height: '100%','z-index': zIndex + 1}">
    <slot></slot>
   </div>
 </div>
</template>
<script>
export default {
  name: 'video-hierarchy',
  props: {
    zIndex: {
      // iframe标签层级
      type: Number,
      default: 9
    },
    hierachyWidth: {
      type: String,
      default: '100%'
    },
    hierachyHeight: {
      type: String,
      default: '100%'
    }
  },
  methods: {
    clickHierachy() {
      let dom = window.document.querySelectorAll('.video-hierachy-uniqueness-dfk')
      dom.forEach((item, index) => {
        item.style.zIndex = this.zIndex + index
        item.style.display = 'none'
      })
      this.$refs.videoHierachyIframe.style.zIndex = this.zIndex + 2 + dom.length + 1
      this.$refs.videoHierachyIframe.style.display = 'block'
      this.$refs.videoHierachyDiv.style.zIndex = this.zIndex + 3 + dom.length + 1
    }
  },
  mounted() {
    this.clickHierachy()
  }
}
</script>
<style lang="less" scoped>
  .video-hierachy {
    position: relative;
    iframe {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border: 0px;
    }
  }
</style>
