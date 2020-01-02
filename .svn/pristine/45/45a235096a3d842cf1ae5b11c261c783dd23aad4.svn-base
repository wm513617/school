<template>
  <!--网络键盘模态框-->
  <Modal :mask-closable="false" v-model="keyboarDeviceModal" width="500" :title="isEditDevice?'设备修改':'设备添加'" @on-cancel="cancel">
    <div>
      <Form ref="KeyboardDevice" :model="deviceFormData" :rules="ruleDeviceForm" :label-width="100" label-position="left" style="padding: 0 20px;">
        <FormItem label="设备名称" prop="name">
          <Input v-model="deviceFormData.name" :minlength=1 :maxlength=64></Input>
        </FormItem>
        <Form-item label="设备厂商">
          <Select v-model="deviceFormData.manufacturer">
            <Option v-for="item in networkManufacturer" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Form-item>
        <Form-item label="设备型号">
          <Select v-model="deviceFormData.model">
            <Option v-for="item in modelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Form-item>
        <Form-item label="主机地址" prop="ip">
          <Bsipv4 v-model="deviceFormData.ip"></Bsipv4>
        </Form-item>
        <Form-item label="控制端口" prop="cport">
          <Input v-model="deviceFormData.cport" :minlength=1 :maxlength=5></Input>
        </Form-item>
      </Form>
    </div>
    <div slot="footer">
      <Button type="ghost" @click="cancel">取消</Button>
      <Button type="primary" @click="save">确定</Button>
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
    return {
      keyboarDeviceModal: false,
      deviceFormData: {},
      ruleDeviceForm: {
        name: [
          { required: true, validator: nameValidator, message: '设备名称不能为空,小于64位字符', trigger: 'change' },
          { validator: deviceValidate.verifyName, trigger: 'change' },
          { validator: deviceValidate.noSpace, trigger: 'change' }
        ],
        cport: [{ required: true, validator: deviceValidate.dePort, trigger: 'change' }],
        ip: [{ required: true, message: 'ip地址不能为空', trigger: 'change' }]
      },
      networkManufacturer: [{ value: 'bstar', label: '蓝色星际' }],
      modelList: [{ value: 'BSR-K10C', label: 'BSR-K10C' }]
    }
  },
  props: {
    // 弹窗展示
    keyboardDeviceShow: {
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
    }
  },
  watch: {
    // 监听弹窗知否展示
    keyboardDeviceShow(val) {
      if (val !== this.keyboarDeviceModal) {
        this.keyboarDeviceModal = val
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
      this.$refs['KeyboardDevice'].resetFields()
      this.$emit('cancel')
    },
    // 确定
    save() {
      this.$refs['KeyboardDevice'].validate(valid => {
        if (valid) {
          this.$emit('save', this.deviceFormData, 'KeyboardDevice')
        }
      })
    }
  }
}
</script>
<style scoped>
</style>
