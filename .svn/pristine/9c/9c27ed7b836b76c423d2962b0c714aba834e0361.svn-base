<template>
  <!--视频通道资源 模态框-->
  <Modal :mask-closable="false" v-model="resModal" :title="isResEdit?'资源修改':'资源添加'" width="500" @on-cancel="cancel('formData')">
    <Form :model="formData" :label-width="100" :rules="formValidate" ref="formData" label-position="left" style="padding: 0 20px;">
      <Form-item label="所属设备" style="word-wrap: break-word">
        {{ deviceName }}
      </Form-item>
      <Form-item label="通道号" prop="chan" v-if="!isResEdit">
        <Select v-model="formData.chan" @on-change="chanChange">
          <Option v-for="opt in chanList" :value="opt.value" :key="opt.value">{{opt.label}}</Option>
        </Select>
      </Form-item>
      <Form-item label="通道号" prop="chan" v-show="isResEdit">
        <Input v-model="formData.chan" :disabled="isResEdit"></Input>
      </Form-item>
      <!-- <Form-item label="通道号" v-show="isResEdit">{{ editShowChan }}</Form-item> -->
      <Form-item label="通道名称" prop="name">
        <Input v-model="formData.name"></Input>
      </Form-item>
      <Form-item label="监控点类型">
        <Select v-model="formData.monitortype" style="width:120px" >
          <Option v-for="opt in monitortypeOpts" :value="opt.value" :key="opt.value">{{ opt.label }}</Option>
        </Select>
        <Select v-model="formData.monitoryPointGenera" style="width:192px">
          <Option v-for="opt in monitoryPointGeneras" :value="opt.value" :key="opt.value">{{ opt.label }}</Option>
        </Select>
      </Form-item>
      <Form-item label="实时视频码流">
        <Select v-model="formData.stream">
          <Option v-for="opt in raltimeStreamOpts" :value="opt.value" :key="opt.value">{{ opt.label }}</Option>
        </Select>
      </Form-item>
      <Form-item label="键盘控制号" prop="keycode">
        <Input v-model="formData.keycode"></Input>
      </Form-item>
      <Row class="check-input">
        <Col span="8">
        <Checkbox v-model="formData.isprerecord">预录时间</Checkbox>
        </Col>
        <Col span="16">
        <Input-number :disabled="!formData.isprerecord" :min="5" :max="30" v-model="formData.precord" style="width:316px"></Input-number>
        </Col>
      </Row>
      <Row class="check-input">
        <Col span="8">
        <Checkbox v-model="formData.isdelayrecord">延录时间</Checkbox>
        </Col>
        <Col span="16">
        <Input-number :disabled="!formData.isdelayrecord" :min="10" :max="1800" v-model="formData.delayrecord" style="width:316px"></Input-number>
        </Col>
      </Row>
    </Form>
    <div slot="footer">
      <Button type="ghost" @click="cancel('formData')">取消</Button>
      <Button type="primary" @click="save('formData')">确定</Button>
    </div>
  </Modal>
</template>
<script>
import deviceValidate from '../deviceValidate.js'
export default {
  data() {
    // 键盘控制号0-65535
    const codeTime = (rule, value, callback) => {
      let r = /(^[1-9]([0-9]*)$|^[0-9]$)/
      if (value === '' || value === undefined) {
        callback()
      }
      if (r.test(value)) {
        if (Number(value) > 65535) {
          return callback(new Error('超过最大值'))
        } else {
          callback()
        }
      } else {
        return callback(new Error('请输入有效数字'))
      }
    }
    return {
      configuration: {
        0: [
          { value: 0, label: '普通' },
          { value: 1, label: '人脸抓拍' },
          { value: 2, label: '车辆抓拍' }
        ],
        1: [{ value: 0, label: '普通' }],
        2: [{ value: 0, label: '普通' }],
        3: [{ value: 0, label: '普通' }],
        4: [{ value: 0, label: '普通' }]
      },
      resModal: false,
      monitoryPointGeneras: [
        { value: 0, label: '普通' },
        { value: 1, label: '人脸抓拍' },
        { value: 2, label: '车辆抓拍' }
      ],
      monitortypeOpts: [
        { value: 0, label: '枪机' },
        { value: 1, label: '红外枪机' },
        { value: 2, label: '半球' },
        { value: 3, label: '快球' },
        { value: 4, label: '全景' }
      ],
      raltimeStreamOpts: [
        { value: 'main', label: '主码流' },
        { value: 'sub1', label: '子码流' },
        { value: 'sub2', label: '第三码流' }
      ],
      // 验证规则
      formValidate: {
        name: [
          { required: true, validator: deviceValidate.verifyResName, trigger: 'change' },
          { validator: deviceValidate.noSpace, trigger: 'change' }
        ],
        keycode: [{ validator: codeTime, trigger: 'change' }]
      }
      // formData: {}
    }
  },
  props: {
    // 弹窗展示
    resShow: {
      type: Boolean,
      default: false
    },
    // 添加 or 修改
    isResEdit: {
      type: Boolean,
      default: false
    },
    // 弹窗数据
    formData: {
      type: Object
    },
    // 通道号列表
    chanList: {
      type: Array
    },
    // 设备名称
    deviceName: {
      type: String
    },
    // 资源tab名称
    activeResName: {
      type: String
    }
  },
  watch: {
    // 监听弹窗知否展示
    resShow(val) {
      if (val !== this.resModal) {
        this.resModal = val
      }
    },
    'formData.monitortype': {
      deep: true,
      handler(val) {
        this.monitoryPointGeneras = this.configuration[val]
        if (document.getElementById('res-modification') === document.activeElement) { // 修改一进来 不改选中项
          return
        }
        this.formData.monitoryPointGenera = 0
      }
    }
    // 监听弹窗数据是否发生变化
    // resFormData: {
    //   handler: function (val) {
    //     if (val) {
    //       this.formData = val
    //     }
    //   },
    //   deep: true
    // }
  },
  methods: {
    // 取消
    cancel(name) {
      // this.$refs[name].resetFields()
      this.$emit('cancel', name)
    },
    // 保存
    save(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$emit('save', this.formData, name)
        }
      })
    },
    // 名称
    chanChange(val) {
      this.formData.name = this.deviceName + '_' + this.activeResName + '_通道' + val
    }
  }
}
</script>
<style scoped>
.confirm {
  margin-bottom: 10px;
  display: flex;
}

.confirm-time {
  width: 150px;
  margin-left: 20px;
}
.confirm-upload {
  height: 30px;
  display: flex;
  margin-left: 20px;
}
.check-input .ivu-col-span-8 {
  width: 100px;
  height: 32px;
  line-height: 32px;
}
.check-input .ivu-col-span-16 {
  width: 316px;
  height: 56px;
}
</style>
