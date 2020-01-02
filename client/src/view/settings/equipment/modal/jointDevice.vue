<template>
  <!--拼接控制器设备 模态框-->
  <Modal :mask-closable="false" v-model="jointDeviceModal" width="500" :title="isEditDevice?'设备修改':'设备添加'" @on-cancel="cancel">
    <div>
      <Form ref="jointDevice" :model="deviceFormData" :rules="ruleDeviceForm" :label-width="100" label-position="left" style="padding: 0 20px;">
        <FormItem label="设备名称" prop="name">
          <Input v-model="deviceFormData.name" :minlength=1 :maxlength=64></Input>
        </FormItem>
        <Form-item label="厂商">
          <Select v-model="deviceFormData.manufacturer">
            <Option v-for="item in jointManufacturer" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Form-item>
        <Form-item label="主机地址" prop="ip">
          <Bsipv4 v-model="deviceFormData.ip"></Bsipv4>
        </Form-item>
        <Form-item label="控制端口" prop="cport">
          <Input v-model="deviceFormData.cport" :minlength=1 :maxlength=5></Input>
        </Form-item>
        <Form-item label="输入通道数量" prop="jointinputcount">
          <Input v-model="deviceFormData.jointinputcount" :minlength=1 :maxlength=3></Input>
        </Form-item>
      </Form>
    </div>
    <div slot="footer">
      <Button type="ghost" @click="cancel">取消</Button>
      <Button type="primary" :loading="isModelLoading" @click="save('jointDevice')">确定</Button>
    </div>
  </Modal>
</template>
<script>
import Bsipv4 from '../../../../components/BSIPV4.vue'
import deviceValidate from '../deviceValidate.js'
export default {
  components: {
    Bsipv4
  },
  data() {
    const nameValidator = (rule, value, callback) => {
      if (value.length >= 65) {
        this.deviceFormData.name = value.slice(0, 64)
        return callback(new Error('设备名称不能为空,小于64位字符'))
      } else {
        callback()
      }
    }
    const jointValidator = (rule, value, callback) => {
      if (isNaN(+value) || value < 1 || value > 256) {
        return callback(new Error('数量范围：1--256'))
      } else {
        callback()
      }
    }
    return {
      jointDeviceModal: false,
      deviceFormData: {},
      ruleDeviceForm: {
        name: [
          { required: true, validator: nameValidator, message: '设备名称不能为空,小于64位字符', trigger: 'change' },
          { validator: deviceValidate.verifyName, trigger: 'change' },
          { validator: deviceValidate.noSpace, trigger: 'change' }
        ],
        cport: [{ required: true, validator: deviceValidate.dePort, trigger: 'change' }],
        ip: [{ required: true, message: 'ip地址不能为空', trigger: 'change' }],
        jointinputcount: [
          { required: true, validator: deviceValidate.deTalkcount, trigger: 'change' }
        ]
      },
      jointManufacturer: [{ value: 'Tricolor', label: '淳中科技' }],
      modelList: [{ value: 'BSR-K10C', label: 'BSR-K10C' }]
    }
  },
  props: {
    // 弹窗展示
    jointDeviceShow: {
      type: Boolean,
      default: false
    },
    // 添加 or 修改
    isEditDevice: {
      type: Boolean,
      default: false
    },
    // 弹窗数据
    formData: {
      type: Object
    },
    isModelLoading: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    // 监听弹窗知否展示
    jointDeviceShow(val) {
      if (val !== this.jointDeviceModal) {
        this.jointDeviceModal = val
      }
    },
    // 监听弹窗数据是否发生变化
    formData: {
      handler: function(val) {
        if (val) {
          this.deviceFormData = val
        }
      },
      deep: true
    }
  },
  methods: {
    // 取消
    cancel() {
      this.$refs['jointDevice'].resetFields()
      this.$emit('cancel')
    },
    // 确定
    save(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$emit('save', this.deviceFormData, name)
        }
      })
    }
  }
}
</script>
<style scoped>
</style>
