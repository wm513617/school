<template>
  <div class="system-parameter">
    <h4>视频播放参数</h4>
    <div class="item-div">
      <label class="item-title">传输协议</label>
      <Select v-model="transportProtocol" style="width:300px">
        <Option v-for="item in transportList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </div>
    <div class="item-div">
      <label class="item-title">画质选择</label>
      <Select v-model="imageQuality" style="width:300px">
        <Option v-for="item in imageList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </div>
    <div class="item-div">
      <label class="item-title">回放切片</label>
      <Select v-model="playbackSlice" style="width:300px">
        <Option v-for="item in playbackSliceList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </div>
    <div class="footer">
      <Button type="primary" @click="submitBtn">确认</Button>
      <Button @click="cancelBtn">取消</Button>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {
      transportList: [
        { value: 'TCP', label: 'TCP' },
        { value: 'UDP', label: 'UDP' }
      ],
      transportProtocol: 'TCP',
      imageList: [
        // { value: 'auto', label: '自适应' }, // 自适应插件功能未实现
        { value: '流畅优先', label: '流畅优先' },
        { value: '画质优先', label: '画质优先' }
      ],
      imageQuality: '流畅优先',
      playbackSliceList: [ // 回放切片
        { value: '关', label: '关' },
        { value: '开', label: '开' }
      ],
      playbackSlice: '开'
    }
  },
  created() {
    if (this.plugins.valid) {
      this.getVideoConf()
    }
    this.getFormData()
  },
  computed: {
    ...mapState({
      parameters: ({ platform }) => platform.parameters
    }),
    ...mapGetters(['plugins'])
  },
  methods: {
    ...mapMutations(['SET_PLAYCONF']),
    ...mapActions(['getVideoConf']),
    submitBtn() {
      if (!this.plugins.valid) {
        this.$Notice.warning({ title: '警告', desc: '请先安装插件' })
        return
      }
      let playParameters = {
        transport: this.transportProtocol,
        picture: this.imageQuality,
        playbackSlice: this.playbackSlice
      }
      // window.localStorage.setItem('playConf', JSON.stringify(playParameters))
      this.$store.commit('SET_PLAYCONF', playParameters)
      let path = 'C:\\BC8100\\PlayConfig.ini'
      let saveStatus = this.plugins.SaveFileInfo(path, JSON.stringify(playParameters))
      if (saveStatus === 0) {
        this.$Notice.success({ title: '成功', desc: '保存成功' })
      }
    },
    cancelBtn() {
      this.getFormData()
    },
    getFormData() {
      this.transportProtocol = this.parameters.transport
      this.imageQuality = this.parameters.picture
      this.playbackSlice = this.parameters.playbackSlice
    }
  }
}
</script>
<style scoped>
.system-parameter {
  width: 100%;
  background: #1b3153;
}
h4 {
  font-size: 14px;
  height: 38px;
  line-height: 38px;
  background: #0f2243;
  padding-left: 24px;
  font-weight: normal;
  margin-bottom: 15px;
}
.item-div {
  margin: 20px 50px;
}
.item-title {
  display: inline-block;
  width: 150px;
}
.footer {
  margin: 30px 0 0 24px;
  width: 600px;
  text-align: right;
}
.footer button {
  width: 100px;
}
</style>
