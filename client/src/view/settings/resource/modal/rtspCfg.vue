<template>
  <!--rtsp流服务器配置 模态框-->
  <Modal :mask-closable="false" v-model="showModal" width="500" title="rtsp流服务器配置" @on-cancel="cancel('rtspCfg')">
    <div>
      <Form ref="rtspCfg" :model="formData" :rules="ruleDeviceForm" :label-width="100" label-position="left" style="padding: 0 20px;">
        <Form-item label="地址" prop="url">
          <Bsipv4 v-model="formData.url" :disabled="true"></Bsipv4>
        </Form-item>
        <Form-item label="端口" prop="port">
          <Input v-model="formData.port"></Input>
        </Form-item>
        <Form-item label="用户名" prop="username">
          <Input v-model="formData.username"></Input>
        </Form-item>
        <Form-item label="密码" prop="password">
          <Input v-model="formData.password" type="password"></Input>
        </Form-item>
        <Form-item label="视频流数量" prop="rtspcount">
          <Input-number :min="0" :max="1000" v-model="formData.rtspcount" style="width:316px"></Input-number>
        </Form-item>
      </Form>
    </div>
    <div slot="footer">
      <Button type="ghost" @click="cancel('rtspCfg')">取消</Button>
      <Button type="primary" @click="save('rtspCfg')">确定</Button>
    </div>
  </Modal>
</template>
<script>
import deviceValidate from '../../equipment/deviceValidate.js'
import Bsipv4 from '../../../../components/BSIPV4'
export default {
  components: {
    Bsipv4
  },
  data() {
    return {
      showModal: false,
      formData: {},
      ruleDeviceForm: {
        url: [{ required: true, message: 'ip地址不能为空', trigger: 'change' }],
        port: [{ required: true, validator: deviceValidate.dePort, trigger: 'change' }],
        username: [{ required: true, validator: deviceValidate.verifyName, trigger: 'change' }],
        password: [{ required: true, validator: deviceValidate.verifyName, trigger: 'change' }]
      }
    }
  },
  props: {
    // 弹窗显示
    rtspCfgModalShow: {
      type: Boolean,
      default: false
    },
    // 弹窗数据
    rtspFormData: {
      type: Object
    }
  },
  watch: {
    // 监听弹窗显示
    rtspCfgModalShow: {
      handler: function(val) {
        if (val !== this.showModal) {
          this.showModal = val
        }
      },
      deep: true
    },
    // 监听弹窗数据是否发生变化
    rtspFormData: {
      handler: function(val) {
        console.log(val)
        if (val) {
          this.formData = val
        }
      },
      deep: true
    }
  },
  methods: {
    // 取消
    cancel(name) {
      this.$refs['rtspCfg'].resetFields()
      this.$emit('cancel', name)
    },
    // 确定
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
</style>
