<template>
  <div class="argumentSet bs-main">
    <div class="title">抓拍参数</div>
    <div class='row'>
      <span class="row-left">
        抓拍图片：
      </span>
      <span class="row-right">
        <RadioGroup v-model="setting.pattern">
            <Radio label='face,full'>人脸图 + 全景图</Radio>
            <Radio label='face'>人脸图</Radio>
        </RadioGroup>
      </span>
    </div>
    <div class='row'>
      <span class="row-left">
        输出图片模式：
      </span>
      <span class="row-right">
        <Select v-model="setting.output" style="width:125px" class="rt">
          <Option v-for="item in modeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </span>
    </div>
    <div class='help'>
      选择是按固定时间间隔输出图片还是按质量输出图片，全量模式可能出现重复图片
    </div>
    <div class='row'>
      <span class="row-left">
        是否开启路人库：
      </span>
      <span class="row-right">
        <i-switch v-model="setting.passby"/>
      </span>
    </div>
    <div class='help'>
      不开启路人库的情况下，【路人检索】【轨迹分析】模块不能使用，但是可以节省存储空间
    </div>
    <!-- <div class='row'>
      <span class="row-left">
        叠加显示ROI区域：
      </span>
      <span class="row-right">
        <i-switch v-model="setting.roi" :disabled='true'/>
      </span>
    </div>
    <div class='row'>
      <span class="row-left">
        叠加显示人脸框：
      </span>
      <span class="row-right">
        <i-switch v-model="setting.faceFrame" :disabled='true'/>
      </span>
    </div> -->
    <div class="title">存储参数</div>
    <div class='row'>
      <span class="row-left">
        抓拍图片保存天数：
      </span>
      <span class="row-right">
        <Input-number :max="365" :min="1" v-model="setting.saveTime" style="width: 200px;"></Input-number>
        <span class="unit">天</span>
      </span>
    </div>
    <div class='row'>
      <span class="row-left">
        路人库容量：
      </span>
      <span class="row-right">
        <Input-number :max="1000" :min="10" v-model="setting.capacity" style="width: 200px;"></Input-number>
        <span class="unit">万</span>
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
        pattern: 'face,full',
        output: 1,
        passby: true,
        roi: false,
        faceFrame: false,
        saveTime: 30,
        capacity: 1000
      },
      modeList: [
        { label: '按质量筛选', value: 1 },
        { label: '全量模式', value: 2 }
      ]
    }
  },
  computed: {
    ...mapState({
      verifaceParam: ({ veriface }) => veriface.verifaceParam
    })
  },
  watch: {
    'setting.saveTime'(newVal, oldVal) {
      if (typeof newVal === 'number') {
        this.setting.saveTime < 1 && (this.setting.saveTime = 1)
      } else {
        this.setting.saveTime = 1
      }
    },
    'setting.capacity'(newVal, oldVal) {
      console.log(newVal, 'newVal')
      if (typeof newVal === 'number') {
        this.setting.capacity < 10 && (this.setting.capacity = 10)
      } else {
        this.setting.capacity = 10
      }
    }
  },
  methods: {
    ...mapActions(['getVerifaceParam', 'setVerifaceParam']),
    recover() {
      this.setting = {
        pattern: 'face,full',
        output: 1,
        passby: true,
        roi: false,
        faceFrame: false,
        saveTime: 30,
        capacity: 1000
      }
      this.setVerifaceParam(this.setting).then(() => {
        this.$Notice.success({ title: '成功', desc: '恢复默认值成功!' })
      }).catch(() => {
        this.$Notice.error({ title: '失败', desc: '恢复默认值失败!' })
      })
    },
    save() {
      this.setVerifaceParam(this.setting).then(() => {
        this.$Notice.success({ title: '成功', desc: '保存成功!' })
      }).catch(() => {
        this.$Notice.error({ title: '失败', desc: '保存失败!' })
      })
    }
  },
  created() {
    this.getVerifaceParam().then(() => {
      this.setting = JSON.parse(JSON.stringify(this.verifaceParam))
    })
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
