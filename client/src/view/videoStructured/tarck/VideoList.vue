<!-- 视频结构化追踪摄像机列表组件 -->
<template>
  <div>
    <DragX ref="dragx" title="摄像机列表" @close="closeVideoList" eventType="video" :position="initPosition">
      <Table class="video-table" border height="400" :columns="columns" :data="videoList" @on-selection-change="handleSelectionChange"></Table>
      <ul class="btn-group">
        <li><Button type="primary" @click="previewVideos"  :disabled="!(videoList && videoList.length)">预览</Button></li>
        <li><Button type="primary" @click="triggerSearch" :loading="searching" :disabled="!(videoList && videoList.length)">检索</Button></li>
      </ul>
    </DragX>
  </div>
</template>
<script>
import DragX from 'components/dragx/Dragx.vue'
export default {
  name: 'VideoList',
  components: { DragX },
  data() {
    return {
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          type: 'index',
          title: '序号',
          width: 75,
          align: 'center'
        },
        {
          title: '资源名称',
          key: 'name',
          render: (h, params) => {
            return h('span', {
              attrs: {
                title: params.row.name
              },
              domProps: {
                innerHTML: params.row.name
              },
              style: {
                width: '180px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }
            })
          }
        }
      ],
      initPosition: { // 摄像机列表初始化位置
        left: 4,
        right: 260
      }
    }
  },
  props: {
    visiable: { // 摄像机列表是否可见
      type: Boolean,
      default: false
    },
    searching: { // 摄像机列表是否可见
      type: Boolean,
      default: false
    },
    videoList: { // 摄像机列表
      type: Array,
      default: () => []
    },
    selectedVideos: { // 摄像机列表
      type: Array,
      default: () => []
    }
  },
  watch: {
    videoList: {
      handler(arr) {
        if (arr && arr.length) {
          this.maxVideoList() // 最大化视频列表
        }
      },
      deep: true
    }
  },
  methods: {
    closeVideoList() { // 关闭摄像机列表
      this.$emit('update:selectedVideos', []) // 清空选中视频资源
      this.$emit('update:videoList', []) // 清空摄像机列表
      this.$emit('update:visiable', false) // 更新列表显示状态
      this.$emit('update:searching', false) // 更新查询状态
    },
    maxVideoList() { // 最大化视频列表
      let dragx = this.$refs.dragx
      if (dragx && dragx.min) { // 列表当前是最小化时
        dragx.min = false
      }
    },
    handleSelectionChange(param) { // 处理选项改变
      // console.log('处理选项改变：', param)
      this.$emit('update:selectedVideos', param) // 清空选中视频资源
    },
    previewVideos() { // 预览视频
      if (this.selectedVideos && this.selectedVideos.length) {
        this.$emit('previewVideos', this.selectedVideos) // 选中的视频数据变化
      } else {
        this.warningMsg('请选择需要预览的视频资源')
      }
    },
    triggerSearch() {
      this.$emit('triggerSearch') // 触发查询
    }
  },
  beforeDestroy() {}
}
</script>
<style scoped>
.video-table {
  margin: 12px;
  width: 320px;
}
.btn-group {
  height: 38px;
  width: calc(100% - 32px);
  margin: 16px;
}
.btn-group >li {
  float: left;
  height: 38px;
  line-height: 38px;
  padding: 0 8px;
  width: 50%;
}
.btn-group >li:first-child {
  text-align: right;
}
.btn-group >li:last-child {
  text-align: left;
}
</style>
