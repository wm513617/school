<template>
  <!--视频通道资源 模态框-->
  <div v-if="resModal">
    <Modal :mask-closable="false" v-model="resModal" title="资源修改" width="500" @on-cancel="cancel('formData')">
      <Form :model="formData" :label-width="100" :rules="formValidate" ref="formData" label-position="left" style="padding: 0 20px;">
        <Form-item label="所属设备" style="word-wrap: break-word">
          {{ formData.eid.name }}
        </Form-item>
        <Form-item label="通道号">
          <Input v-model="formData.chan" :disabled="true"></Input>
        </Form-item>
        <Form-item label="所属机构">
          <Input v-model="formData.orgName" :disabled="true"></Input>
        </Form-item>
        <Form-item label="通道名称" prop="name">
          <Input v-model="formData.name"></Input>
        </Form-item>
        <Form-item label="监控点类型">
          <Select disabled v-model="formData.monitortype">
            <Option v-for="opt in monitortypeOpts" :value="opt.value" :key="opt.value">{{ opt.label }}</Option>
          </Select>
        </Form-item>
        <Form-item label="实时视频码流">
          <Select disabled v-model="formData.stream">
            <Option v-for="opt in raltimeStreamOpts" :value="opt.value" :key="opt.value">{{ opt.label }}</Option>
          </Select>
        </Form-item>
        <Form-item label="键盘控制号" prop="keycode">
          <Input disabled v-model="formData.keycode"></Input>
        </Form-item>
        <Form-item label="出/入口定义">
          <Select v-model="formData.passway">
            <Option v-for="opt in passwayList" :value="opt.value" :key="opt.value">{{ opt.label }}</Option>
          </Select>
        </Form-item>
        <Form-item label="预录时间">
          <Input disabled v-model="formData.precord"></Input>
        </Form-item>
        <Form-item label="延录时间">
          <Input disabled v-model="formData.delayrecord"></Input>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="ghost" @click="cancel('formData')">取消</Button>
        <Button type="primary" @click="save('formData')">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import deviceValidate from '../../settings/equipment/deviceValidate.js'
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
      resModal: false,
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
      passwayList: [{ label: '普通', value: 0 }, { label: '入口', value: 1 }, { label: '出口', value: 2 }],

      // 验证规则
      formValidate: {
        name: [
          { required: true, validator: deviceValidate.verifyName, trigger: 'change' },
          { validator: deviceValidate.noSpace, trigger: 'change' }
        ],
        keycode: [{ validator: codeTime, trigger: 'change' }]
      }
    }
  },
  props: {
    // 弹窗展示
    serverList: {
      type: Array
    },
    resShow: {
      type: Boolean,
      default: false
    },
    // 弹窗数据
    formData: {
      type: Object
    },
    orgActiveName: {
      type: String
    }
  },
  watch: {
    // 监听弹窗知否展示
    resShow(val) {
      if (val !== this.resModal) {
        this.resModal = val
      }
    }
  },
  methods: {
    // 取消
    cancel(name) {
      // this.$refs[name].resetFields()
      this.$emit('cancel', name)
    },
    // 保存
    save(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$emit('save', this.formData, name)
        }
      })
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
  width: 328px;
  height: 56px;
}
</style>
