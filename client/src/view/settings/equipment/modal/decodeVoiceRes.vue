<template>
  <!--解码通道、音频通道、资源 模态框-->
  <Modal :mask-closable="false" v-model="resModal" :title="isResEdit?'资源修改':'资源添加'" width="500" @on-cancel="cancel('formData')">
    <Form :model="formData" :label-width="100" :rules="formValidate" ref="formData" label-position="left" style="padding: 0 20px;">
      <Form-item label="所属设备" style="word-wrap: break-word">{{ deviceName }}</Form-item>
      <Form-item label="通道号" prop="chan" v-if="!isResEdit">
        <Select v-model="formData.chan" @on-change="chanChange">
          <Option v-for="item in chanList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Form-item>
      <Form-item label="通道号" prop="chan" v-if="isResEdit">
        <Input v-model="formData.chan" :disabled="isResEdit"></Input>
      </Form-item>
      <Form-item label="通道名称" prop="name">
        <Input v-model="formData.name"></Input>
      </Form-item>
      <Form-item label="对讲类型" v-show="this.activeResName === '对讲通道'">
        <Select value="设备对讲">
          <Option value="设备对讲">设备对讲</Option>
        </Select>
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
  data() {
    return {
      resModal: false,
      // 验证规则
      formValidate: {
        name: [
          { required: true, validator: deviceValidate.verifyResName, trigger: 'change' },
          { validator: deviceValidate.noSpace, trigger: 'change' }
        ]
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
</style>
