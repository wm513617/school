<template>
  <div class="video-buttons" :style="{width: width, height: height}">
    <div class="playback-speed"  @mouseenter.stop="(showSpeed=true)" @mouseleave="showSpeed = false" v-if="(buttonName ==='playbackSpeed')">
      <span>
        <i class="icon iconfont" :class="[disable?'disable':'', selectedSpeed.icon]" title="播放速度" style="font-size:17px;"></i>
      </span>
      <ul v-show="showSpeed&&(!disable)" class="iconspeed" style="z-index:999">
        <i></i>
        <li v-for="(speed, i) in speedList" :key='i' @click="clickSpeed(speed)" :class="{active: speed.label===selectedSpeed.label}">{{speed.label}}</li>
      </ul>
    </div>
    <div v-if="(buttonName ==='forward')">
      <i class="icon iconfont icon-frame-forward" @click="setPlayerMode" title="逐帧进"></i>
    </div>
  </div>
</template>
<script>
export default {
  name: 'video-buttons-template',
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    disable: {
      // 是否禁用
      type: Boolean,
      default: true
    },
    buttonName: {
      type: String,
      default: 'playbackSpeed'
      // playbackSpeed : 播放速度 forward: 逐帧进
    }
  },
  data() {
    return {
      showSpeed: false, // 播放速度列表
      selectedSpeed: { value: { nRate: 1, nScale: 1 }, label: '1', icon: 'icon-speed', control: 3 }, // 播放速度图标
      speedList: [
        // 新加流控协议字段 1：暂停，2：停止，3 一倍速 4 二倍速 5 四倍速 6 八倍速 7 16倍速 8 1/2倍速 9 1/4倍速  10 1/8倍速 11 1/16倍速
        { value: { nRate: 1, nScale: 16 }, label: '1/16', icon: 'icon-1-16', control: 11 },
        { value: { nRate: 1, nScale: 8 }, label: '1/8', icon: 'icon-1-8', control: 10 },
        { value: { nRate: 1, nScale: 4 }, label: '1/4', icon: 'icon-1-4', control: 9 },
        { value: { nRate: 1, nScale: 2 }, label: '1/2', icon: 'icon-1-2', control: 8 },
        { value: { nRate: 1, nScale: 1 }, label: '1', icon: 'icon-speed', control: 3 },
        { value: { nRate: 2, nScale: 1 }, label: '2', icon: 'icon-2', control: 4 },
        { value: { nRate: 4, nScale: 1 }, label: '4', icon: 'icon-4', control: 5 },
        { value: { nRate: 8, nScale: 1 }, label: '8', icon: 'icon-8', control: 6 },
        { value: { nRate: 16, nScale: 1 }, label: '16', icon: 'icon-16', control: 7 }
      ]
    }
  },
  methods: {
    clickSpeed(speed) {
      this.selectedSpeed = speed
      this.$emit('playbackSpeed', speed)
    },
    setPlayerMode() {
      this.$emit('setPlayerMode')
    }
  },
  mounted() {
  }
}
</script>
<style lang="less" scoped>
  .video-buttons {
    display: inline-block;
    div {
      display: inline-block;
      cursor: pointer;
    }
    text-align: center;
    .active {
      color: #fa8a3b!important;
    }
    .disable {
      cursor: not-allowed;
      color: #9298a4;
    }
    .playback-speed {
      position: relative;
      display: inline-block;
      width: 100%;
      height: 100%;
      ul.iconspeed {
        bottom: 1px;
        left: 30px;
        background: #335589;
        width: 191px;
        /* padding-top: 30px; */
        height: 40px;
        line-height: 40px;
        border-radius: 3px;
        li:hover {
          color: #fa8a3b;
        }
        li {
          color: #fff;
          // height: 24px;
          line-height: 12px;
          text-align: center;
          cursor: pointer;
          position: relative;
          display: inline-block;
          padding: 0 14px;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
        }

        li:last-child {
          border-right: 0;
        }

        i {
          display: block;
          position: absolute;
          background: #335589;
          width: 14px;
          height: 14px;
          z-index: 0;
          transform: rotate(45deg);
          bottom: 13px;
          left: 183px;
        }
        position: absolute;
        width: 380px;
        i {
          left: -7px;
        }
      }
    }
  }
</style>
