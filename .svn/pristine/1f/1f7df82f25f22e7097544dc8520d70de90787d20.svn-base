<template>
  <!--网络键盘模态框-->
  <Modal :mask-closable="false" v-model="shortMessageModal" width="500" :title="isEditDevice?'设备修改':'设备添加'" @on-cancel="cancel">
    <div>
      <Form ref="shortMessage" :model="shortMessageData" :rules="ruleDeviceForm" :label-width="100" label-position="left" style="padding: 0 20px;">
        <FormItem label="设备名称" prop="name">
          <Input v-model="shortMessageData.name" :minlength=1 :maxlength=64></Input>
        </FormItem>
        <Form-item label="厂商">
          <Select v-model="shortMessageData.manufacturer">
            <Option v-for="item in networkManufacturer" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Form-item>
        <Form-item label="型号">
          <Select v-model="shortMessageData.series">
            <Option v-for="item in seriesList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Form-item>
        <Form-item label="接入方式">
          <Select v-model="shortMessageData.ip">
            <Option v-for="item in accessList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Form-item>
        <Form-item label="端口" prop="cport">
          <Input v-model="shortMessageData.cport"></Input>
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
import deviceValidate from '../deviceValidate.js'
export default {
  components: {
  },
  data() {
    const nameValidator = (rule, value, callback) => {
      if (value.length >= 65) {
        this.shortMessageData.name = value.slice(0, 64)
        return callback(new Error('设备名称不能为空,小于64位字符'))
      } else {
        callback()
      }
    }
    return {
      shortMessageModal: false,
      shortMessageData: {},
      ruleDeviceForm: {
        name: [
          { required: true, validator: nameValidator, message: '设备名称不能为空,小于64位字符', trigger: 'change' },
          { validator: deviceValidate.verifyName, trigger: 'change' },
          { validator: deviceValidate.noSpace, trigger: 'change' }
        ],
        cport: [{ required: true, validator: deviceValidate.cport, trigger: 'change' }]
      },
      networkManufacturer: [{ value: 'jindi', label: '金迪' }],
      seriesList: [{ value: 'M1206B', label: 'M1206B' }],
      accessList: [
        {
          value: 'COM',
          label: '串口'
        }
      ]
    }
  },
  props: {
    // 弹窗展示
    shortMessageShow: {
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
    shortMessageShow(val) {
      if (val !== this.shortMessageModal) {
        this.shortMessageModal = val
      }
    },
    // 监听弹窗数据是否发生变化
    formData: {
      handler: function(val) {
        if (val) {
          this.shortMessageData = val
        }
      },
      deep: true
    }
  },
  methods: {
    // 取消
    cancel() {
      this.$refs['shortMessage'].resetFields()
      this.$emit('cancel')
    },
    // 确定
    save() {
      this.$refs['shortMessage'].validate(valid => {
        if (valid) {
          this.shortMessageData.cport = Number(this.shortMessageData.cport)
          this.$emit('save', this.shortMessageData, 'shortMessage')
        }
      })
    }
  }
}
</script>
<style scoped>
</style>
