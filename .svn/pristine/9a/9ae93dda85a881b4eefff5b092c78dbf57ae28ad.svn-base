<template>
  <div class="system-parameter">
    <h4>存储配置</h4>
    <div class="item-div">
      <label class="item-title">抓图格式</label>
      <Select v-model="screenshot" style="width:300px">
        <Option v-for="item in captureImgList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </div>
    <div class="item-div">
      <label class="item-title">抓图保存路径</label>
      <Input v-model="screenshotPath" style="width: 300px" disabled/>
      <Button type="primary" @click="getImgPath" class="browse-btn">浏览</Button>
    </div>
    <div class="item-div">
      <label class="item-title">录像格式</label>
      <Select v-model="videotape" style="width:300px">
        <Option v-for="item in recordFormatList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </div>
    <div class="item-div">
      <label class="item-title">录像保存路径</label>
      <Input v-model="localVideoPath" style="width: 300px" disabled/>
      <Button type="primary" @click="getRecordPath" class="browse-btn">浏览</Button>
    </div>
    <div class="item-div">
      <label class="item-title">录像下载格式</label>
      <Select v-model="downloadVideoType" style="width:300px">
        <Option v-for="item in downloadList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </div>
    <div class="item-div">
      <label class="item-title">录像下载保存路径</label>
      <Input v-model="downloadVideoPath" style="width: 300px" disabled/>
      <Button type="primary" @click="getDownloadPath" class="browse-btn">浏览</Button>
    </div>
    <div class="item-div">
      <label class="item-title">案件下载格式</label>
      <Select v-model="caseDownLoadType" style="width:300px">
        <Option v-for="item in downloadList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </div>
    <div class="item-div">
      <label class="item-title">案件下载保存路径</label>
      <Input v-model="caseDownLoadPath" style="width: 300px" disabled/>
      <Button type="primary" @click="getcaseDownLoadPath" class="browse-btn">浏览</Button>
    </div>
    <div class="footer">
      <Button type="primary" @click="submitBtn">确认</Button>
      <Button @click="cancelBtn">取消</Button>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  data() {
    return {
      captureImgList: [{
        value: 'JPG',
        label: 'JPG'
      },
      {
        value: 'BMP',
        label: 'BMP'
      }],
      recordFormatList: [{
        value: 'AVI',
        label: 'AVI'
      },
      // { // MP4插件功能未实现
      //   value: 'MP4',
      //   label: 'MP4'
      // },
      {
        value: 'BSR',
        label: 'BSR'
      }],
      downloadList: [{
        value: 'AVI',
        label: 'AVI'
      },
      // { // MP4插件功能未实现
      //   value: 'MP4',
      //   label: 'MP4'
      // },
      {
        value: 'BSR',
        label: 'BSR'
      }],
      screenshot: 'JPG',
      videotape: 'AVI',
      downloadVideoType: 'AVI',
      caseDownLoadType: 'AVI',
      screenshotPath: 'C:\\BC8100\\Capture',
      localVideoPath: 'C:\\BC8100\\Rerord',
      downloadVideoPath: 'C:\\BC8100\\Download',
      caseDownLoadPath: 'C:\\BC8100\\CaseDownload'
    }
  },
  created() {
    if (this.plugins.valid) {
      this.getVideoConf()
    }
    this.initialParameters()
  },
  computed: {
    ...mapGetters(['plugins']),
    ...mapState({
      parameters: ({ platform }) => platform.parameters
    })
  },
  methods: {
    ...mapMutations(['SET_VIDEOCONF']),
    ...mapActions(['getVideoConf']),
    getImgPath() {
      const pathName = this.getPath()
      pathName && (this.screenshotPath = pathName)
    },
    getRecordPath() {
      const pathName = this.getPath()
      pathName && (this.localVideoPath = pathName)
    },
    getDownloadPath() {
      const pathName = this.getPath()
      pathName && (this.downloadVideoPath = pathName)
    },
    getcaseDownLoadPath() {
      const pathName = this.getPath()
      pathName && (this.caseDownLoadPath = pathName)
    },
    getPath() {
      if (!this.plugins.valid) {
        this.$Notice.warning({ title: '警告', desc: '请先安装插件' })
        return
      }
      const state = JSON.parse(this.plugins.GetFileDirectory('请选择文件'))
      if (state.success) {
        return state.DirName
      } else {
        // this.$Notice.error({ title: '失败', desc: '获取保存位置出错！' })

      }
    },
    initialParameters() { //  获取store中参数
      this.screenshot = this.parameters.screenshot
      this.videotape = this.parameters.videotape
      this.downloadVideoType = this.parameters.downloadVideoType
      this.screenshotPath = this.parameters.screenshotPath
      this.localVideoPath = this.parameters.localVideoPath
      this.downloadVideoPath = this.parameters.downloadVideoPath
      this.caseDownLoadType = this.parameters.caseDownLoadType
      this.caseDownLoadPath = this.parameters.caseDownLoadPath
    },
    submitBtn() {
      if (!this.plugins.valid) {
        this.$Notice.warning({ title: '警告', desc: '请先安装插件' })
        return
      }
      let videoParameters = {
        screenshot: this.screenshot,
        videotape: this.videotape,
        downloadVideoType: this.downloadVideoType,
        screenshotPath: this.screenshotPath,
        localVideoPath: this.localVideoPath,
        downloadVideoPath: this.downloadVideoPath,
        caseDownLoadType: this.caseDownLoadType,
        caseDownLoadPath: this.caseDownLoadPath
      }
      // window.localStorage.setItem('videoConf', JSON.stringify(videoParameters))
      this.$store.commit('SET_VIDEOCONF', videoParameters)
      let path = 'C:\\BC8100\\VideoConfig.ini'
      let saveStatus = this.plugins.SaveFileInfo(path, JSON.stringify(videoParameters))
      if (saveStatus === 0) {
        this.$Notice.success({ title: '成功', desc: '保存成功' })
      }
    },
    cancelBtn() {
      this.initialParameters()
    }
  },
  watch: {
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
.browse-btn {
  margin-left: 12px;
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
