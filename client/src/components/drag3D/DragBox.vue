<template>
  <div>
    <!-- map-box区域中多窗口拖拽实现 -->
    <Drag :onlySlot="true" v-for="(item,j) in list" :key="j" @setzIndex="setIndex(j)" :position="position[j]" :active="item.active" :index="activeIndex">
      <video-preview :mapResource='item.data' />
    </Drag>
  </div>
</template>

<script>
import Drag from '../DragBoxs.vue'
import videoPreview from './video'
import { mapState } from 'vuex'
export default {
  name: 'DragBox',
  components: {
    Drag,
    videoPreview
  },
  data() {
    return {
      activeIndex: 3,
      list: [],
      position: [
        {
          left: 300,
          top: 100
        },
        {
          left: 400,
          top: 200
        },
        {
          left: 500,
          top: 300
        },
        {
          left: 600,
          top: 400
        }
      ]
    }
  },
  computed: {
    ...mapState({
      videoList: ({ tdPoint }) => tdPoint.videoList
    })
  },
  watch: {
    videoList(val) {
      this.list = JSON.parse(JSON.stringify(val))
    },
    list: {
      handler(val) {
        if (val) {
          console.log(val)
          for (let i in val) {
            this.list[i].active = false
          }
          this.list[val.length - 1].active = true
        }
      }
    },
    deep: true
  },
  methods: {
    setIndex(j) {
      for (let i in this.list) {
        this.list[i].active = false
      }
      this.list[j].active = true
    }
  },
  mounted() {
    this.list = JSON.parse(JSON.stringify(this.videoList))
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
