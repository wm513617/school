<template>
  <!--
      ! -againPlay: 同步  重新打开一组现场视频 使用方法： this.$refs.frame.againPlay(this.videoList)
      ! -close: 监听视频组件中的关闭视频 使用方法：在组件标签中进行  @close="fn"
      ! -props： 1. palyArr  当前视频数组(需要先修改再调用againPlay)    2. isMain 是否是在主显示区显示
    -->
  <div style="width:100%; height: 100%">
    <!-- pluginCount -->
    <video-frame :pluginCount="pluginCount" :defaultShowscreen="1" :slotHeight="0" :state.sync="state" @close='close' :clickInit="false" class="frame" ref="frame" style="height: 100%" @activeChange="avtiveChange" :bgColor="'#404040'"></video-frame>
    <div class="page-wrap" v-if="!isMain && pageTotal > 4">
      <Page :total="pageTotal" size="small" :page-size="4" :current='current' @on-change="pageChange"></Page>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import VideoFrame from './VideoFrame'
// import { elPagination } from 'element-ui'
// const count = [1, 4, 9, 16]
// const counts = [1, 2, 4]
export default {
  components: { VideoFrame },
  name: 'VideoFrames',
  data() {
    return {
      // 最大的窗口数量
      pluginCount: 16,
      // 是否显示窗口按钮
      toolbar: 'preview',
      // 多画面个数
      playCount: 1,
      // 当前页码
      current: 1,
      // 总共有多少个节点
      pageTotal: 0,
      // 视频的状态
      state: {
        // 是否播放
        isPlay: '',
        // 是否鸟瞰
        isBoost: '',
        // 是否打开伴音
        isVolumeOpen: '',
        // 是否是在录像
        isRecording: '',
        // 是否对讲
        isSpeech: '',
        // 是否正在轮训
        isPoll: '',
        // 音量
        volumeValue: 0,
        // 码流  main是主码流
        streamType: 'main'
      },
      palyArray: []
    }
  },
  computed: {
    // 获取视频对象
    plugin() {
      return this.$refs.frame
    },
    pluginData() {
      return this.$refs.frame.pluginData
    }
  },
  props: {
    /*
      插件默认类型
    */
    isMain: {
      type: Boolean,
      default: false
    },
    // 视频节点的数组
    palyArr: {
      type: Array,
      default: () => []
    },
    isPlay: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    ...mapMutations(['SET_FAVID', 'SET_ORGID']),
    avtiveChange(i) {
      if (this.pluginData[i]) {
        this.SET_ORGID(this.pluginData[i].id)
        this.SET_FAVID(this.pluginData[i].id)
      }
    },
    close(id) {
      this.palyArray = this.palyArray.filter(item => item.id !== id)
      this.$emit('close', this.palyArray)
    },
    // 监听当前页发生变化
    pageChange(page) {
      this.plugin.curPage = page - 1
    },
    stopAlls() {
      this.plugin.stopAll()
      this.pageSetting(this.palyArr)
    },
    // 一次播放一个或多个节点
    openAllPreviewClick(list) {
      // 遍历当前节点下的所有子节点 获取播放所需要的信息
      // if (list.length > this.plugin.showscreen) {
      //   list.splice(this.plugin.showscreen)
      //   this.$Notice.warning({ desc: '无空闲窗口显示更多通道！', title: '警告' })
      // }
      // 开启视频多个窗口
      this.plugin.openAll(list, '', 'noPower')
    },
    // 设置多窗口分割  获取页码总数
    pageSetting(arr = this.palyArr, isMain = this.isMain) {
      // 如果是主显示区
      const len = arr.length
      let num = 1
      if (isMain) {
        if (len > 9) {
          num = 16
        } else if (len > 4) {
          num = 9
        } else if (len > 1) {
          num = 4
        }
        this.plugin.setShowscreen(num, false)
      } else {
        if (len > 2) {
          num = 4
          this.pageTotal = len
        } else if (len > 1) {
          num = 2
        }
        this.plugin.setShowscreen(num)
      }
      // if (isMain) {
      //   this.pluginCount = 16
      //   this.toolbar = 'preview'
      //   // 在主显示区 node节点数量大于等于16时
      //   if (arr.length >= 16) {
      //     this.playCount = 16
      //     arr.length = 16
      //   } else {
      //     // 在主显示区 node节点数量小于于16时
      //     for (let i = 0, len = count.length; i < len; i++) {
      //       if (count[i] >= arr.length) {
      //         this.playCount = count[i]
      //         break
      //       }
      //     }
      //   }
      //   this.palyArray = arr
      //   this.plugin.setShowscreen(this.playCount)
      // } else { //  在次显示区显示
      //   this.pluginCount = 4
      //   this.toolbar = ''
      //   if (arr.length > 16) { arr.length = 16 }
      //   this.pageTotal = arr.length
      //   // 在次显示区显示时 分两种情况 node节点大于等于4 和 小于4的情况
      //   if (arr.length > 4) {
      //     // 显示多少个画面
      //     this.playCount = 4
      //     this.palyArray = []
      //     let arrs = []
      //     arr.forEach((item, i) => {
      //       if (i % 4 === 0 && i !== 0) {
      //         this.palyArray.push(arrs)
      //         arrs = []
      //       }
      //       arrs.push(item)
      //       if ((i === arr.length - 1) && i !== 0) {
      //         this.palyArray.push(arrs)
      //       }
      //     })
      //     this.plugin.setShowscreen(this.playCount)
      //   } else {
      //     // 小于4的情况
      //     for (let i = 0, len = counts.length; i < len; i++) {
      //       if (counts[i] >= arr.length) {
      //         // 显示多少个画面
      //         this.playCount = counts[i]
      //         break
      //       }
      //     }
      //     this.plugin.setShowscreen(this.playCount)
      //     this.palyArray = [arr]
      //   }
      // }
    },
    async againPlay(arr) {
      this.pageSetting(arr)
      this.openAllPreviewClick(arr)
    }
  },
  mounted() {
    this.pageSetting(this.palyArr)
    const tiems = setTimeout(() => {
      if (this.state.isPlay) {
        return
      }
      if (this.isMain) {
        this.openAllPreviewClick(this.palyArray)
      } else {
        this.openAllPreviewClick(this.palyArray[0])
      }
      clearTimeout(tiems)
    }, 5000)
  }
}
</script>
<style scoped>
.frame {
  /* width: 100%; */
  height: 100%;
  clear: both;
  /* display: flex; */
  flex: 1;
}
.page-wrap {
  width: 90%;
  height: 30px;
  text-align: right;
  line-height: 30px;
  padding-right: 40px;
  margin-left: 40px;
}
</style>
