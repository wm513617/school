<template>
  <!--报警输出资源 模态框-->
  <Modal :mask-closable="false" v-model="alarmResModal" :title="isAlarmResEdit?'资源修改':'资源添加'" width="500" @on-cancel="cancel('formData')">
    <Form :model="alarmOutResFormData" :label-width="100" :rules="formValidate" ref="formData" label-position="left" style="padding: 0 20px;">
      <Form-item label="所属设备" style="word-wrap: break-word">{{ deviceName }}</Form-item>
      <Form-item label="防区编号" prop="chan" v-if="!isAlarmResEdit">
        <Select v-model="alarmOutResFormData.chan" @on-change="chanChange">
          <Option v-for="item in chanList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Form-item>
      <Form-item label="防区编号" prop="chan" v-show="isAlarmResEdit">
        <Input v-model="alarmOutResFormData.chan" :disabled="isAlarmResEdit"></Input>
      </Form-item>
      <Form-item label="防区名称" prop="name">
        <Input v-model="alarmOutResFormData.name"></Input>
      </Form-item>
      <Form-item label="输出类型">
        <Select v-model="alarmOutResFormData.alarmouttype">
          <Option value="0">常开</Option>
          <Option value="1">常闭</Option>
        </Select>
      </Form-item>
      <Form-item label="持续时间" prop="durationtime">
        <Input v-model="alarmOutResFormData.durationtime"></Input>
      </Form-item>
      <Form-item label="输出延时" prop="exportdelaytime">
        <Input v-model="alarmOutResFormData.exportdelaytime"></Input>
      </Form-item>
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
  name: 'alarmOutRes',
  components: {
  },
  computed: {
  },
  data() {
    // 0-3600
    const continueTimeRule = (rule, value, callback) => {
      let r = /(^[1-9]([0-9]*)$|^[0-9]$)/
      if (value === '') {
        return callback(new Error('持续时间不能为空'))
      }
      if (r.test(value)) {
        if (Number(value) > 3600) {
          return callback(new Error('持续时间超过最大值'))
        } else {
          callback()
        }
      } else {
        return callback(new Error('请输入有效数字'))
      }
    }
    // 0-3600
    const outputDelayRule = (rule, value, callback) => {
      let r = /(^[1-9]([0-9]*)$|^[0-9]$)/
      if (value === '') {
        return callback(new Error('输出延时不能为空'))
      }
      if (r.test(value)) {
        if (Number(value) > 3600) {
          return callback(new Error('输出延时超过最大值'))
        } else {
          callback()
        }
      } else {
        return callback(new Error('请输入有效数字'))
      }
    }
    return {
      alarmResModal: false,
      // 验证规则
      formValidate: {
        name: [
          { required: true, validator: deviceValidate.verifyResName, trigger: 'change' },
          { validator: deviceValidate.noSpace, trigger: 'change' }
        ],
        durationtime: [{ required: true, validator: continueTimeRule, trigger: 'change' }],
        exportdelaytime: [{ required: true, validator: outputDelayRule, trigger: 'change' }]
      },
      formData: {}
    }
  },
  props: {
    // 弹窗展示
    alarmOutResShow: {
      type: Boolean,
      default: false
    },
    // 添加 or  修改
    isAlarmResEdit: {
      type: Boolean,
      default: false
    },
    // 弹窗数据
    alarmOutResFormData: {
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
    alarmOutResShow(val) {
      if (val !== this.alarmResModal) {
        this.alarmResModal = val
      }
    }
    // // 监听弹窗数据是否发生变化
    // alarmOutResFormData: {
    //   handler: val => {
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
          // Number(this.formData.durationtime)
          // Number(this.formData.exportdelaytime)
          this.$emit('save', this.alarmOutResFormData, name)
        }
      })
    },
    // 名称
    chanChange(val) {
      this.alarmOutResFormData.name = this.deviceName + '_' + this.activeResName + '_通道' + val
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
</style>
