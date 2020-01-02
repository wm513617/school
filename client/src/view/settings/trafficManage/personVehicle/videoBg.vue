<template>
  <div class="box" style="height: 100%;width:100%;">
    <div class="mark"></div>
    <div ref="video" class="inbox" v-for="index in count" :style="{width: wd, height: ht}" :key="index" :class="{'active':(index-1)===active}">
      <img :src="imgList[index-1]||''" :id="'img' + (index - 1)" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'vehicleVideoImgBg',
  props: {
    count: {
      type: Number,
      default: 4
    },
    active: {
      type: Number,
      default: 0
    },
    imgList: Object
  },
  data() {
    return {}
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
  },
  watch: {
    imgList: {
      handler: val => {
        console.log(val, 51)
      },
      deep: true
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
      z-index: 1;
    }
  }
}
</style>
