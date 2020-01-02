<template>
  <div class="progress-bar">
    <ul :style="{marginLeft: marginLeft}"
        class="time-list">
      <li :style="{width: scale * 1000 * 60 * 60 + 'px'}"
          v-for="item in rangeList" :key="item">
        <span>{{item}}</span>
      </li>
    </ul>
    <Slider class="slider"
            :min="start"
            :max="end"
            show-tip="never"
            v-model="now">
    </Slider>
    <div>{{nowText}}</div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'ProgressBar',
  props: {
    value: {
      type: Number,
      default: 0
    },
    start: {
      type: Number,
      default: 1498483200000
    },
    end: {
      type: Number,
      default: 1498559400000
    }
  },
  data() {
    return {
      now: this.value,
      width: 0
    }
  },
  watch: {
    value(newValue) {
      this.now = newValue
    },
    now(newValue) {
      this.$emit('input', newValue)
    }
  },
  computed: {
    timeLen() {
      return this.end - this.start
    },
    nowText() {
      return moment(this.now).format('YYYY-MM-DD kk:mm:ss')
    },
    scale() {
      return 360 / this.timeLen
    },
    rangeList() {
      const arr = []
      for (let i = this.start; i < this.end; i += 1000 * 60 * 60) {
        arr.push(moment(i).hour())
      }
      return arr
    },
    marginLeft() {
      return `-${this.scale * (this.start % (1000 * 60 * 60))}px`
    }
  },
  created() {
    this.bindedOnResize = () => {
      const box = this.$el
      this.width = box.offsetWidth
    }
  },
  mounted() {
    const box = this.$el
    this.width = box.offsetWidth
    window.addEventListener('resize', this.bindedOnResize)
    // window.onresize = () => {
    //   this.width = box.offsetWidth
    // }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.bindedOnResize)
    this.bindedOnResize = null
  }
}
</script>

<style scoped>
.progress-bar {
  width: 100%;
  height: 100%;
}

.time-list {
  height: 10px;
  width: 200%;
}

.time-list li {
  height: 10px;
  float: left;
  text-align: center;
  border-left: 2px solid #ccc;
  position: relative;
}

.time-list li span {
  position: absolute;
  width: 20px;
  text-align: center;
  left: -50%;
  bottom: 100%;
}
</style>
