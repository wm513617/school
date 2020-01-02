<template>
  <div class="box" style="height: 100%;width:100%;">
    <div class="mark"></div>
    <div ref="video" class="inbox" v-for="(item,index) in imgList" :style="{width: wd, height: ht}" :key="index" :class="{'active':index===active}">
      <img v-if="item" :src="item||''"/>
    </div>
    <div class="video-bottom">
      <div class="left">
        <i class="icon iconfont icon-preview-stopall" title="关闭全部预览" ></i>
        <i class="icon iconfont icon-screenshot" title="截图"></i>
        <!-- <i class="icon iconfont icon-screenshot" title="伴音"></i> -->
        <i class="icon iconfont icon-mute" title="音量"></i>
      </div>
      <div class="right">
        <i class="icon iconfont icon-full-screen dp-con" title="全屏"></i>
        <i class="icon iconfont icon-multi-screen"  title="画面分割"></i>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'verifaceVideoImgBg',
  props: {
    count: {
      type: Number,
      default: 4
    },
    active: {
      type: Number,
      default: 0
    },
    imgList: {
      type: Array
    }
  },
  data() {
    return {
    }
  },
  computed: {
    wd() {
      const wd = (100 / Math.sqrt(this.count)).toFixed(2)
      if (this.count === 3) {
        return `calc(33.3% - 4px)`
      } else if (this.count === 2) {
        return `calc(49% - 2px)`
      } else {
        return `calc(${wd}% - 2px)`
      }
    },
    ht() {
      if (this.count === 3) {
        return `calc(100% - 2px)`
      } else if (this.count === 2) {
        return `calc(100% - 2px)`
      } else {
        return this.wd
      }
    }
  }
}
</script>
<style lang="less" scoped>
.box {
  .mark {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 99;
    background: rgba(0, 0, 0, 0.3);
  }
  .inbox {
    position: relative;
    background: #404040;
    border: 1px solid #000;
    display: inline-block;
    &.active {
      border: 2px solid #348ff3;
    }
    img {
      width: 100%;
      height: 100%;
      position: absolute;
    }
  }
  .video-bottom {
    width: 100%;
    height: 56px;
    background-color: #1b3153;
    line-height: 56px;
    display: flex;
    .left, .right {
      float: left;
      width: 50%;
      height: 100%;
    }
    .right .iconfont {
      float: right;
    }
    .iconfont {
      padding: 0 8px;
      cursor: pointer;
      font-size: 20px;
    }
  }
}
</style>
