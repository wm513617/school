<template>
<div>
  <!-- 巡更 单兵 消息视频组件 -->
  <div id="oplay" :style="{width: width +'px', height: height + 'px'}">
    <video v-if="url && type==='video'" id="ovideo" :controls="controls" :autoplay="autoplay" :width="width+'px'" :height="height+'px'" :preload="preload" :loop="loop" :poster="sourceUrl">
      <source :src="sourceUrl"/>
    </video>
    <img v-if="url && type==='image'" id="oImg" :style="{maxWidth: width +'px', maxHeight: height + 'px'}" :src="sourceUrl" @click="setImage"/>
    <i v-if="!url" style="color:#2f2e2e;user-select:none;">无图片或录像</i>
  </div>
</div>
</template>
<script>
/**
 * url 视频或图片的ID,必须
 * type video/image  用于区别显示的是图片还是视频,必须
 * width 图片或视频区域的宽度,必须
 * height 图片或视频区域的高度,必须
 *
 * 视频相关参数
 * controls 是否显示控制按钮
 * autoplay 是否自动播放
 * poster 视频封面，播放时的封面图片
 * preload 预加载(true时启动加载)
 * loop 循环播放(true时循环播放)
 */
let divEle
export default {
  name: 'PatrolVideo',
  props: {
    url: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    controls: {
      type: Boolean,
      default: true
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 100
    },
    poster: {
      type: String,
      default: ''
    },
    preload: {
      type: Boolean,
      default: true
    },
    loop: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isfull: false,
      fullWidth: window.innerWidth,
      fullHeight: window.innerHeight
    }
  },
  computed: {
    sourceUrl() {
      return this.url
    }
  },
  methods: {
    setImage() {
      // 点击图片全屏显示
      this.fullWidth = window.innerWidth
      this.fullHeight = window.innerHeight
      this.isfull = true
      this.addElementImg()
    },
    addElementImg() { // 将全屏的dom添加到body上,解决遮罩层遮不住导航的问题
      divEle = document.createElement('div')
      divEle.innerHTML = `<div id='full-image-patrol' style='width: ${this.fullWidth}px; height: ${this.fullHeight}px'>` +
                        `<img src=${this.sourceUrl} id='fimg' draggable='false' style='width: auto; height: auto;max-width:${window.innerWidth}px;max-height: ${window.innerHeight}px' />` +
                        `<span id="patrol-image-close" class='icon iconfont icon-close1'></span>` +
                        `</div>`
      document.body.appendChild(divEle)
      const closeEle = document.getElementById('patrol-image-close')
      closeEle.onclick = () => {
        document.body.removeChild(divEle)
        divEle = null
        this.isfull = false
      }
    }
  },
  beforeDestroy() {
  }
}
</script>
<style scoped>
#oplay {
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items:center;
}

#oImg,
#fimg {
  width: auto;
  height: auto;
}
#fimg {
  max-width: 100%;
  max-height: 100%;
  display: inline-block;
}
</style>
<style>
#full-image-patrol {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items:center;
  z-index: 999999999999;
  /* iview的mask样式已经写到了99999999999，这里只能比这个高 */
}
#full-image-patrol .icon-close1 {
  position: absolute;
  right: 15px;
  top: 15px;
  color: #fff;
  cursor: pointer;
  font-size: 22px;
  width: 24px;
  height: 24px;
  text-align: center;
  line-height: 24px;
}
#full-image-patrol .icon-close1:hover {
  color: #fff;
  background-color: red;
}
</style>
