<template>
  <!--报警主机设备 模态框-->
  <Modal :mask-closable="false" v-model="alarmDeviceModal" width="500" :title="isEditDevice?'设备修改':'设备添加'" @on-cancel="cancel">
    <!-- <div>
      <Button-group>
        <Button :type="deviceModalState.pageOneShow ? 'primary' : 'ghost'" @click="modalPageClick('P1')">1 - 基础信息</Button>
        <Button :type="deviceModalState.pageTwoShow ? 'primary' : 'ghost'" @click="modalPageClick('P2')">2 - 设备信息</Button>
      </Button-group>
    </div> -->
    <div>
      <Form ref="alarmDevice" :model="deviceFormData" :rules="ruleDeviceForm" :label-width="100" label-position="left" style="padding: 0 20px;">
        <FormItem label="设备名称" prop="name">
          <Input v-model="deviceFormData.name" :minlength=1 :maxlength=64></Input>
        </FormItem>
        <Form-item label="设备厂商">
          <Select v-model="deviceFormData.manufacturer">
            <Option v-for="item in alarmManufacturerList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Form-item>
        <Form-item label="设备型号">
          <Select v-model="deviceFormData.model">
            <Option v-for="item in alarmModelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Form-item>
        <Form-item label="服务器地址" prop="intranetIp" v-if="deviceFormData.manufacturer === 'guangtuo'">
          <Bsipv4 v-model="deviceFormData.intranetIp"></Bsipv4>
        </Form-item>
        <Form-item label="主机地址" prop="ip">
          <Bsipv4 v-model="deviceFormData.ip"></Bsipv4>
        </Form-item>
        <Form-item label="服务器端口" prop="intranetPort" v-if="deviceFormData.manufacturer === 'guangtuo'">
          <Input v-model="deviceFormData.intranetPort" :minlength=1 :maxlength=5></Input>
        </Form-item>
        <Form-item label="控制端口" prop="cport">
          <Input v-model="deviceFormData.cport" :minlength=1 :maxlength=5></Input>
        </Form-item>
        <Form-item label="用户名">
          <Input v-model="deviceFormData.username" :minlength=1 :maxlength=64></Input>
        </Form-item>
        <Form-item label="密码">
          <Input v-model="deviceFormData.password" type="password" :minlength=1 :maxlength=64></Input>
        </Form-item>
        <Form-item label="报警防区个数" prop="defenseicount">
          <Input v-model="deviceFormData.defenseicount"></Input>
        </Form-item>
        <Form-item label="报警输出个数" prop="defenseocount">
          <Input v-model="deviceFormData.defenseocount"></Input>
        </Form-item>
      </Form>
    </div>
    <div slot="footer">
      <Button type="ghost" @click="cancel">取消</Button>
      <Button type="primary" @click="save('alarmDevice')">确定</Button>
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
    return {
      videoParameterList: {
        shike: ['SK239G', 'SK-216G-IP'],
        guangtuo: ['SM200']
      }, // 视频设备参数表
      alarmDeviceModal: false,
      deviceFormData: {},
      ruleDeviceForm: {
        name: [
          { required: true, message: '设备名称不能为空', trigger: 'change' },
          { validator: deviceValidate.verifyName, trigger: 'change' },
          { validator: deviceValidate.noSpace, trigger: 'change' }
        ],
        cport: [
          { required: true, validator: deviceValidate.dePort, trigger: 'change' }
        ],
        intranetIp: [
          { required: true, message: 'ip地址不能为空', trigger: 'change' }
        ],
        ip: [
          { required: true, message: 'ip地址不能为空', trigger: 'change' }
        ],
        username: [
          { required: true, message: '用户名不能为空', trigger: 'change' },
          { validator: deviceValidate.verifyName, trigger: 'change' },
          { validator: deviceValidate.noSpace, trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'change' },
          { validator: deviceValidate.verifyName, trigger: 'change' },
          { validator: deviceValidate.noSpace, trigger: 'change' }
        ],
        defenseicount: [
          { validator: deviceValidate.deIpcount, trigger: 'change' }
        ],
        defenseocount: [
          { validator: deviceValidate.deIpcount, trigger: 'change' }
        ]
      },
      alarmManufacturerList: [
        {
          value: 'shike',
          label: 'SHIKE'
        },
        {
          value: 'guangtuo',
          label: '广拓'
        }
        // ,
        // {
        //   value: '斯麦尔达',
        //   label: '斯麦尔达'
        // }
      ],
      alarmModelList: [
        {
          value: 'SK239G',
          label: 'SK239G'
        },
        {
          value: 'SK-216G-IP',
          label: 'SK-216G-IP'
        }
      ],
      alarmModelList1: [
        {
          value: 'SK239G',
          label: 'SK239G'
        },
        {
          value: 'SK-216G-IP',
          label: 'SK-216G-IP'
        }
      ],
      alarmModelList2: [
        {
          value: '门禁系统',
          label: '门禁系统'
        }
      ]
    }
  },
  props: {
    // 弹窗展示
    alarmDeviceShow: {
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
    alarmDeviceShow(val) {
      if (val !== this.alarmDeviceModal) {
        this.alarmDeviceModal = val
      }
    },
    // 厂商，型号联动
    'deviceFormData.manufacturer'(val) {
      this.alarmModelList = this.videoParameterList[val].map(item => {
        return {
          value: item,
          label: item
        }
      })
      if (document.getElementById('Modification') === document.activeElement) {
        return
      }
      this.deviceFormData.model = this.videoParameterList[val][0]
      this.deviceFormData.intranetIp = '0.0.0.0'
      // if (val === 'shike') {

      //   this.alarmModelList = this.alarmModelList1
      //   this.deviceFormData.model = 'SK239G'
      // } else {
      //   this.alarmModelList = this.alarmModelList2
      //   this.deviceFormData.model = '门禁系统'
      // }
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
      // this.alarmDeviceModal = false
      this.$refs['alarmDevice'].resetFields()
      this.$emit('cancel')
    },
    // 保存
    save(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.deviceFormData.manufacturer !== 'guangtuo') {
            this.deviceFormData.intranetIp = ''
          }
          this.$emit('save', this.deviceFormData, name)
        }
      })
    }
  }
}
</script>
<style scoped>

</style>
