<template>
  <div id="controler">
    <div class="yunnan">
      <div class="title">云台控制</div>
      <div class="yunnanCtrl">
        <BasicsCtrl :showMore='showMore'></BasicsCtrl>
      </div>

    </div>
    <div class="kx"></div>
    <div class="imageEdjust">
      <div class="title" style="position: relative;">
        图像调节
        <i class="iconfont icon-fuwei" style="position: absolute;right: 15px;" title="恢复默认图像" @click="reDefault"></i>
      </div>
      <!-- <div class="model">
        <div @click="modelTag='standard'" :class="{'active':modelTag==='standard'}"><i class="iconfont icon-standard"></i>&nbsp; 标准</div>
        <div @click="modelTag='bright'" :class="{'active':modelTag==='bright'}"><i class="iconfont icon-bright"></i>&nbsp; 亮丽</div>
        <div @click="modelTag='soft'" :class="{'active':modelTag==='soft'}"><i class="iconfont icon-soft"></i>&nbsp; 柔和</div>
      </div> -->
      <div class="slider">
        <b>亮度</b>
        <div class="slider-box">
          <slider color="#20a1ff" :range="true" :size="100" :minValue='0' :showInput="true" @on-mouseup='setpiccfg' @change="setpiccfg" v-model="brightness">
          </slider>
        </div>
      </div>

      <div class="slider">
        <b>锐度</b>
        <div class="slider-box">
          <slider color="#20a1ff" :range="true" :size="100" :minValue='0' :showInput="true" @on-mouseup='setpiccfg' @change="setpiccfg" v-model="sharpness">
          </slider>
        </div>
      </div>

      <div class="slider">
        <b>色度</b>
        <div class="slider-box">
          <slider color="#20a1ff" :range="true" :size="100" :minValue='0' :showInput="true" @on-mouseup='setpiccfg' @change="setpiccfg" v-model="hue">
          </slider>
        </div>
      </div>

      <div class="slider">
        <b>饱和度</b>
        <div class="slider-box">
          <slider color="#20a1ff" :range="true" :size="100" :minValue='0' :showInput="true" @on-mouseup='setpiccfg' @change="setpiccfg" v-model="saturation">
          </slider>
        </div>
      </div>

      <div class="slider">
        <b>对比度</b>
        <div class="slider-box">
          <slider color="#20a1ff" :range="true" :size="100" :minValue='0' :showInput="true" @on-mouseup='setpiccfg' @change="setpiccfg" v-model="contrast">
          </slider>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
// import { GET_PICCFG, SET_PICCFG } from '../../../http/video.api.js'
import Slider from '../../../components/Slider'
import BasicsCtrl from './BasicsCtrl'
export default {
  components: {
    Slider,
    BasicsCtrl
  },
  data() {
    return {
      showMore: true,
      // 亮度 Brightness
      brightness: 50,
      // 锐度 Sharpness
      sharpness: 50,
      // 色度 Chroma
      hue: 50,
      // 饱和度 Saturation
      saturation: 50,
      // 对比度 Contrast
      contrast: 50,
      modelTag: 'standard'
    }
  },
  computed: {
    plugin() {
      return this.$parent.$parent.$parent.$refs.frame
    }
  },
  watch: {
    'plugin.activedIndex'() {
      if (!this.plugin.pluginState.isPlay) {
        this.initpiccfg()
        return
      }
      this.getpiccfg()
    },
    'plugin.pluginState.isPlay'(b) {
      // if (!this.plugin.pluginState.isPlay) {
      //   this.initpiccfg()
      //   return
      // }
      this.getpiccfg()
    }
  },
  methods: {
    initpiccfg() {
      this.brightness = 50
      this.sharpness = 50
      this.hue = 50
      this.saturation = 50
      this.contrast = 50
    },
    getpiccfg() {
      this.initpiccfg()
      const res = this.plugin.pluginData[this.plugin.activedIndex]
      if (!res) { return }
      const param = {
        devIp: res.ip,
        port: res.port,
        channel: res.channel
      }
      this.$nextTick(() => {
        this.plugin.GetPlayerPicParam(param)
          .then(res => {
            const data = JSON.parse(res)
            if (!data.success) { return }
            this.brightness = +data.Brightness || 50
            this.sharpness = +data.Sharpness || 50
            this.hue = +data.Chroma || 50
            this.saturation = +data.Saturation || 50
            this.contrast = +data.Contrast || 50
          }).catch(err => err)
      })
    },
    _setpiccfg() {
      if (!this.plugin.pluginState.isPlay) { return }
      // const res = this.plugin.pluginData[this.plugin.activedIndex]
      const param = {
        Brightness: this.brightness + '',
        // Sharpness: this.sharpness,
        Chroma: this.hue + '',
        Saturation: this.saturation + '',
        Contrast: this.contrast + ''
      }
      // // 亮度 Brightness
      // brightness: 50,
      // // 锐度 Sharpness
      // sharpness: 50,
      // // 色度 Chroma
      // hue: 50,
      // // 饱和度 Saturation
      // saturation: 50,
      // // 对比度 Contrast
      // contrast: 50,
      this.plugin.SetPlayerPicParam(JSON.stringify(param)).then(item => {
      })
    },
    /**
     * 恢复默认图像
     */
    reDefault() {
      if (!this.plugin.pluginState.isPlay) { return }
      const param = this.plugin.plugin.picConfig
      param && this.plugin.SetPlayerPicParam(param)
      this.getpiccfg()
    }
  },
  created() {
    // 使用lodash的防抖动方法
    this.setpiccfg = this.$lodash.debounce(this._setpiccfg.bind(this), 50)
  },
  beforeDestroy() {
    delete this.setpiccfg
  }
}
</script>

<style scoped>
#controler {
  width: 100%;
  height: 100%;
  background: #1b3153;
}

.yunnan {
  width: 100%;
  /*height: 60%;*/
  margin-bottom: 15px;
  background: #1b3153;
}

.imageEdjust {
  width: 100%;
  min-height: 220px;
  overflow: auto;
  background: #1b3153;
}

.yunnan .title,
.imageEdjust .title {
  height: 36px;
  line-height: 36px;
  color: #fff;
  background: #0f2343;
  padding: 0 20px;
  text-align: center;
  font-size: 14px;
}

.yunnan .title {
  margin-bottom: 20px;
}

.imageEdjust .slider {
  width: 100%;
  height: 40px;
  padding: 5px 10px;
}

.yunnanCtrl {
  height: calc(100% - 56px);
}

.yunnanCtrl:after,
.dome-box:after,
.imageEdjust .slider:after,
.clearFloat:after {
  display: block;
  content: "";
  clear: both;
}
.slider b {
  float: left;
  height: 30px;
  line-height: 30px;
  width: 40px;
  text-align: center;
  font-weight: normal;
  user-select: none;
}

.slider .slider-box {
  float: left;
  width: 210px;
}

.slider input[type="text"] {
  margin: 0 !important;
}
.kx {
  width: 100%;
  height: 16px;
  background: #0c1b32;
}
.model {
  width: 100%;
  margin: 10px 0;
  height: 30px;
}
.model > div {
  display: inline-block;
  width: 26%;
  height: 30px;
  background: #3c5073;
  color: #cacaca;
  margin: 0 3%;
  border-radius: 3px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
}
.model > div.active {
  color: #fff;
  background: #4699f9;
}
</style>
