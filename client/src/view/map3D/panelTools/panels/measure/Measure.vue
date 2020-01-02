<!-- 量算面板 -->
<template>
  <div>
    <div>
      <Select v-model="selectedMode" placeholder="请选量算模式" size="small" class="select-mode" @on-change="changeMeasureClampMode">
        <Option v-for="item in clampModes" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <div class="button-group">
        <Button type="text" size="small" @click="measureDistance">测距</Button>
        <Button type="text" size="small" @click="measureArea">测面</Button>
        <Button type="text" size="small" :disabled="selectedMode === 1" @click="measureHeight">测高</Button>
      </div>
    </div>
  </div>
</template>

<script>
import MeatureTools from './MeatureTools'
import { mapState } from 'vuex'
export default {
  name: 'Measure',
  data() {
    return {
      clampModes: [
        {label: '空间量算', value: 0},
        {label: '贴地量算', value: 1}
      ],
      selectedMode: 0,
      meatureTools: null
    }
  },
  computed: {
    ...mapState({
      ready: ({ tdIndex }) => tdIndex.ready // 三维地图是否加载完成的标识
    })
  },
  watch: {
    ready(flag) {
      if (flag) {
        this.initMeasureTools() // 初始化量算工具
      }
    }
  },
  mounted() {
    if (this.ready) {
      this.initMeasureTools() // 初始化量算工具
    }
  },
  beforeDestroy() {
    this.meatureTools && this.meatureTools.relieveMeasureListeners() // 解除测量工具的监听
  },
  methods: {
    initMeasureTools() {
      if (!this.$context.viewer.scene.pickPositionSupported) {
        this.errorMsg('不支持深度拾取,量算功能无法使用(无法进行鼠标交互绘制)！')
        return
      }
      this.meatureTools = new MeatureTools(this.$context, this.selectedMode) // 构造量算工具
    },
    changeMeasureClampMode(mode) { // 改变量算贴对象模式
      this.meatureTools && this.meatureTools.changeClampMode(mode)
    },
    measureDistance() { // 测距
      this.meatureTools && this.meatureTools.activeMeasureDistance()
    },
    measureArea() { // 测面
      this.meatureTools && this.meatureTools.activeMeasureArea()
    },
    measureHeight() { // 测高
      this.meatureTools && this.meatureTools.activeMeasureHeight()
    }
  }
}
</script>

<style scoped>
  .select-mode {
    padding: 4px;
  }
  .button-group {
    padding: 0px 4px 4px 4px;
  }
</style>
