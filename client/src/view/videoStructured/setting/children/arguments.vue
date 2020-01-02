<template>
  <div class="argumentSet bs-main">
    <div class="title">视频编码参数</div>
    <!--<div class='row'>
      <span class="row-left">
        视频叠加结构化信息
      </span>
      <span class="row-right">
         <i-switch v-model="setting.isStartVideoAddMessage"/>
      </span>
    </div>-->
    <div class='row'>
      <span class="row-left">
        开启视频编码
      </span>
      <span class="row-right">
        <i-switch v-model="setting.isStartVideoCode"/>
      </span>
    </div>
    <div class='row'>
      <span class="row-left">
        视频编码等级
      </span>
      <span class="row-right">
        <Select v-model="setting.leaveVal" style="width:125px" class="rt">
          <Option v-for="item in modeList" :value="item.value" :key="item.value">{{ item.value }}</Option>
        </Select>

      </span>
    </div>
    <div class='row'>
      <span class="row-left">
        原图中绘制矩形框
      </span>
      <span class="row-right">
        <i-switch v-model="setting.isStartDrawBox"/>
      </span>
    </div>
    <div class="title">数据存储参数</div>
    <div class='row'>
      <span class="row-left">
       结构化数据保存
      </span>
      <span class="row-right">
        <Input-number :max="365" :min="1" v-model="setting.saveTime" style="width: 200px;"></Input-number>
        <span class="unit">天</span>
      </span>
    </div>
    <div class='row'>
      <Button type="primary" @click="save" class="save">保存</Button>
      <Button type="ghost" @click="recover">恢复默认值</Button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      setting: {
        // isStartVideoAddMessage: false, // 视频叠加结构化信息
        isStartVideoCode: false, // 开启视频编码
        isStartDrawBox: true, // 原图中绘制矩形框
        leaveVal: 3, // 视频等级值
        saveTime: 30 // 结构化数据保存
      },
      modeList: [
        { label: '纯编码', value: 0 },
        { label: '叠加检测框编码', value: 1 },
        { label: '叠加检测框+一级分类编码(英文)', value: 2 },
        { label: '叠加检测框+一级分类编码(中文)', value: 3 },
        { label: '加检测框+一级分类编码+识别信息(英文)', value: 4 },
        { label: '叠加检测框+一级分类编码+识别信息(中文)', value: 5 },
        { label: '实时流(全帧率)', value: 6 }
      ]
    }
  },
  methods: {
    ...mapActions('videoStructuredSetting', ['getVideoStructuredParam', 'setVideoStructuredParam', 'setDefaultVideoStructuredParamApi']),
    save() { // 保存修改
      this.setVideoStructuredParam({
        // superpose: this.setting.isStartVideoAddMessage ? 1 : 0,
        startCode: this.setting.isStartVideoCode ? 1 : 0,
        drawRectangle: this.setting.isStartDrawBox ? 1 : 0,
        codeClass: this.setting.leaveVal,
        saveTime: this.setting.saveTime
      }).then(res => {
        this.successMsg('资源信息参数修改成功')
      }).catch(err => {
        console.log(err)
      })
    },
    recover() { // 重置
      this.setDefaultVideoStructuredParamApi('').then(res => {
        if (res.status === 200) {
          // Object.assign(this.$data, this.$options.data())
          this.getParam()
        }
      })
    },
    getParam() {
      this.getVideoStructuredParam().then((res) => {
        /* if (res.superpose === 1) { // 视频叠加结构化信息
          this.setting.isStartVideoAddMessage = true
        } else {
          this.setting.isStartVideoAddMessage = false
        } */
        if (res.startCode === 1) {
          this.setting.isStartVideoCode = true
        } else {
          this.setting.isStartVideoCode = false
        }
        this.setting.leaveVal = res.codeClass
        if (res.drawRectangle === 1) {
          this.setting.isStartDrawBox = true
        } else {
          this.setting.isStartDrawBox = false
        }
        this.setting.saveTime = res.saveTime
        // eslint-disable-next-line handle-callback-err
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  computed: {
    ...mapState({
      getVideoStructuredParamVuex: ({videoStructuredSetting}) => videoStructuredSetting.videoStructuredParam

    })
  },
  created() {
    this.getParam()
  }
}
</script>

<style scoped>
  .argumentSet {
    flex-direction: column;
    background: #1c3054;
  }
  .title {
    font-size: 14px;
    height: 38px;
    line-height: 38px;
    padding-left: 24px;
    font-weight: normal;
  }
  .row {
    line-height: 32px;
    font-size: 12px;
    margin: 0 0 12px 48px;
  }
  .row-left {
    display: inline-block;
    width: 120px;
  }
  .help {
    margin: 0 0 12px 170px;
    color:aqua;
  }
  .unit {
    margin-left: 20px;
  }
  .save {
    margin: 0 50px;
  }
  button {
    width: 100px;
  }
</style>
