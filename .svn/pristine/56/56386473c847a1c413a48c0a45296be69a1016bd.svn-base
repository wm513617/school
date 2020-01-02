<template>
  <div>
    <VideoPlugin style="height: calc(100% - 138px)" ref="plugin"></VideoPlugin>
    <TimeLine :recordInfo="recordInfo" :value="timelineValue" @ondrag="drag" :canForward="false"></TimeLine>
  </div>
</template>
<script>
import VideoPlugin from './VideoPlugin'
import TimeLine from '../TimeLine'
import store from './pluginStore'
import { mapMutations } from 'vuex'
export default {
  name: 'VideoTimeLine',
  store,
  components: {
    VideoPlugin,
    TimeLine
  },
  data() {
    return {
      recordInfo: [],
      timelineValue: 0,
      line: {
        start: 1493004000000,
        end: 1493004000000
      }
    }
  },
  computed: {
    plugin() {
      return this.$refs.plugin
    }
  },
  methods: {
    ...mapMutations(['SET_PLUGIN_TYPE']),
    now() {
      return new Date().getTime()
    },
    startTimer() {
      this.timer = setInterval(() => {
        const now = this.now()
        this.timelineValue = now
        this.line.end = now
      }, 1000)
    },
    drag(time) {
      this.closePreview()
      this.openRecord()
      this.seekRecord(time)
    },
    openPreview() {
      this.SET_PLUGIN_TYPE('preview')
      this.plugin.open()
    },
    closePreview() {
      this.SET_PLUGIN_TYPE('preview')
      this.plugin.stop()
    },
    openRecord() {
      this.SET_PLUGIN_TYPE('record')
      this.plugin.open()
    },
    closeRecord() {
      this.SET_PLUGIN_TYPE('record')
      this.plugin.stop()
    },
    seekRecord() {
      this.SET_PLUGIN_TYPE('record')
    }
  },
  mounted() {
    this.recordInfo = [{
      timedVideo: [this.line],
      eventVideo: []
    }]
    this.startTimer()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  }
}
</script>
