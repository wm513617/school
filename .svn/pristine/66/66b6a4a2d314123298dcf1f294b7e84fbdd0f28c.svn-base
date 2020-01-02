<template>
  <div>
    <div v-for="(item,j) in list" :key="j">
        <Dragx v-if="item.show" :title="item.title" usageMode="map" @setzIndex="setIndex(j)" :active="item.active" :index="activeIndex" @close="close(j)" @titleMouseDown="titleMouseDown($event,j)" @titleMouseUp="titleMouseUp($event,j)" :modelType="modelType" eventType="video" :ref="'dragx' + j " @changeContext="clearModelId()" :canScale="modelType !== '3D'">
          <video-preview :ref="'pre-back'+j" :mapResource='item' @getType="getTitleType($event,j)"/>
        </Dragx>
    </div>
  </div>
</template>

<script>
import Dragx from 'components/dragx/Dragx.vue'
import videoPreview from 'components/video/map3Dvideo/PreviewBack.vue'
import { mapState, mapMutations } from 'vuex'
const PREVIEW = '视频预览----'
const PLAYBACK = '录像回放----'
export default {
  name: 'drag-video',
  components: {
    Dragx,
    videoPreview
  },
  props: {
    modelType: {
      type: String,
      default: '2D'
    }
  },
  data() {
    return {
      activeIndex: 3,
      list: []
    }
  },
  computed: {
    ...mapState({
      pointVideoList2D: ({ mapIndex }) => mapIndex.pointVideoList,
      activeModelId2D: ({ mapIndex }) => mapIndex.activeModelId,
      pointVideoList3D: ({ tdPoint }) => tdPoint.videoList,
      activeModelId3D: ({ mapIndex }) => mapIndex.activeModelId3D
    })
  },
  watch: {
    pointVideoList2D(val) {
      if (val.length > 0) {
        this.setVideoList(val)
      }
    },
    pointVideoList3D(val) {
      if (val.length > 0) {
        this.setVideoList(val)
      }
    },
    activeModelId2D(val) {
      this.activeChange(val)
    },
    activeModelId3D(val) {
      this.activeChange(val)
    }
  },
  methods: {
    ...mapMutations(['CHANGE_POINT_VIDEO_LIST', 'SET_VIDEO_LIST', 'CLEAR_ACTIVEMODEL_ID', 'CLEAR_ACTIVEMODEL_ID_3D']),
    getTitleType(type, index) {
      if (type === 'video') {
        this.list[index].title = PREVIEW + this.list[index].name
      }
      if (type === 'playBack') {
        this.list[index].title = PLAYBACK + this.list[index].name
      }
    },
    setIndex(j) {
      for (let i in this.list) {
        this.$set(this.list[i], 'active', false)
      }
      if (this.list[j]) { this.$set(this.list[j], 'active', true) }
    },
    clearList() { // 清空list
      const l = this.list.filter((item) => {
        return item.show
      })
      if (l.length <= 0) {
        this.list = []
        parseInt(this.modelType) === 2 ? this.CHANGE_POINT_VIDEO_LIST([]) : this.SET_VIDEO_LIST([])
      }
    },
    async close(j) {
      await this.$refs['pre-back' + j][0].$refs['mapVideo'].stop()
      this.$set(this.list[j], 'show', false)
      this.clearList()
    },
    setVideoList(val) {
      if (val && val.length <= 0) {
        this.list = []
        return
      }
      const param = JSON.parse(JSON.stringify(val))
      const arr = []
      let j = -1 // 第一个show为true的下标
      let n = 0 // 显示的窗口数
      let m = 0
      this.list.map((item, x) => {
        if (item.show) {
          n++
          m = x
        }
        if (n === 1 && j === -1) {
          j = x
        }
      })
      if (n > 3) { // 超过4个时 将第一个显示的窗口隐藏
        this.$set(this.list[j], 'show', false)
      }
      for (let i = 0; i < param.length; i++) {
        if (this.list[i] && this.list[i].show === false) { // 用list旧值 来判断新的赋值
          arr.push({
            ...param[i],
            active: false,
            show: false,
            title: PREVIEW + param[i].name
          })
        } else {
          if (i === m) {
            arr.push({
              ...param[i],
              active: true,
              show: true,
              title: PREVIEW + param[i].name
            })
          } else {
            arr.push({
              ...param[i],
              active: false,
              show: true,
              title: PREVIEW + param[i].name
            })
          }
        }
      }
      arr[arr.length - 1].active = true // /让最新的窗口层级最高
      this.list = arr
    },
    activeChange(val) {
      if (!val) { return }
      let j = -1 // 第一个show为true的下标
      let n = 0 // 显示的窗口数
      let isMinIndex = -1
      let isShowIndex = -1
      this.list.map((item, i) => {
        if (item.show) {
          n++
        }
        if (n === 1 && j === -1) {
          j = i
        }
        if (val === item._id) {
          if (item.show) {
            isMinIndex = i
          } else {
            isShowIndex = i
          }
        }
      })
      this.clearModelId()
      if (isMinIndex !== -1) {
        if (this.$refs['dragx' + isMinIndex][0]) { this.$refs['dragx' + isMinIndex][0].min = false }
        return
      }
      if (n >= 4) { // 超过4个时 将第一个显示的窗口隐藏
        this.$set(this.list[j], 'show', false)
      }
      if (isShowIndex !== -1) { this.$set(this.list[isShowIndex], 'show', true) }
    },
    titleMouseDown(e, j) {
      this.$refs['pre-back' + j][0].handleMouseDown()
    },
    titleMouseUp(e, j) {
      this.$refs['pre-back' + j][0].handleMouseUp()
    },
    clearModelId() {
      parseInt(this.modelType) === 2 ? this.CLEAR_ACTIVEMODEL_ID() : this.CLEAR_ACTIVEMODEL_ID_3D()
    }
  },
  mounted() {
    this.list = JSON.parse(JSON.stringify(this['pointVideoList' + parseInt(this.modelType) + 'D']))
    if (this.list.length > 0) {
      this.setVideoList(this.list)
    }
  }
}
</script>

<style scoped>
.map-box {
  width: 100%;
  height: 100%;
  z-index: 1000;
  position: absolute;
  border: 1px solid #000;
}
</style>
