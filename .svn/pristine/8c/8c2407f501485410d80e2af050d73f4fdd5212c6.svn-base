<template>
  <!--报警输入资源 模态框-->
  <div v-if="alarmInResModal">
    <Modal :mask-closable="false" v-model="alarmInResModal" :title="isAlarmResEdit?'资源修改':'资源添加'" width="500" @on-cancel="cancel('formData')">
      <Form :model="formData" :label-width="100" :rules="formValidate" ref="formData" label-position="left" style="padding: 0 20px;">
        <Form-item label="所属设备" style="word-wrap: break-word">{{ deviceName }}</Form-item>
        <Form-item label="防区名称" prop="name" v-if="!isPatch" key="input1">
          <Input v-model="formData.name"></Input>
        </Form-item>
        <Form-item label="设备回路" prop="devloop" v-if="activeChannelType===11">
          <!-- <Input v-model="formData.devloop" @on-change="chanDevloopChange"></Input> -->
          <InputNumber :min="0" :max="999" :precision="0" v-model="formData.devloop" @on-change="chanDevloopChange" style="width:317px"></InputNumber>
        </Form-item>
        <Form-item label="输入防区个数" prop="fireInputNum" v-if="activeChannelType === 11 && isPatch">
          <!-- <Input v-model="formData.fireInputNum"></Input> -->
          <InputNumber ref="InputNumber" :min="1" :max="999" :precision="0" v-model="formData.fireInputNum" style="width:317px"></InputNumber>
        </Form-item>
        <Form-item label="防区编号" v-show="activeChannelType !== 11 && !isAlarmResEdit" v-if="activeChannelType !== 11">
          <Select v-model="formData.chan" @on-change="chanChange">
            <Option v-for="item in chanList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Form-item>
        <Form-item label="防区编号" v-show="activeChannelType !== 11 && isAlarmResEdit" v-if="activeChannelType !== 11">
          <Input v-model="formData.chan" :disabled="isAlarmResEdit"></Input>
        </Form-item>
        <Form-item label="防区编号" prop="chan" v-show="activeChannelType === 11 && !isPatch" v-if="activeChannelType === 11">
          <!-- <Input v-model="formData.chan" :disabled="isAlarmResEdit" @on-change="chanDevloopChange"></Input> -->
          <InputNumber :min="0" :max="99999" :precision="0" v-model="formData.chan" :disabled="isAlarmResEdit" @on-change="chanDevloopChange" style="width:317px"></InputNumber>
        </Form-item>
        <Form-item label="防区起始编号" prop="chan" v-show="activeChannelType === 11 && isPatch" v-if="activeChannelType === 11">
          <!-- <Input v-model="formData.chan"></Input> -->
          <InputNumber :min="0" :max="99999" :precision="0" v-model="formData.chan" style="width:317px"></InputNumber>
        </Form-item>
        <Form-item label="级别">
          <Select v-model="formData.level">
            <Option v-for="item in enabledLevel" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Form-item>
        <Form-item label="报警分类" v-if="activeChannelType !== 11">
          <Select v-model="formData.alarmtype">
            <Option v-for="item in this.enabledSort" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Form-item>
        <Form-item label="布撤防时间">
          <Select v-model="formData.alarmtemplate">
            <Option v-for="item in this.enabledTemp" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Form-item>
        <Form-item label="最大延时" prop="maxdelaytime">
          <Input v-model="formData.maxdelaytime"></Input>
        </Form-item>
        <Form-item label="最小间隔" prop="minintervaltime">
          <Input v-model="formData.minintervaltime"></Input>
        </Form-item>
        <div class="confirm">
          <div style="width:100px;">
            <Checkbox v-model="formData.mapsign.signflag">地图标识</Checkbox>
          </div>
          <div>
            <Select style="width:150px" v-model="formData.mapsign.signtype" :disabled="!formData.mapsign.signflag">
              <Option v-for="item in mapLogoList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <!-- <div class="confirm-upload" v-if="formData.mapsign.signtype === 0">
          <img :src="'/api/upload?id='+formData.mapsign.signvalue" width="30px" style="border:1px dotted rgb(255, 255, 255)"></img>
          <Upload style="display:inline-block;margin-left:10px" ref="upload" action="/api/upload" name="file" :format="['jpg','png','bmp','jpeg']" :on-success="uploadLaneSuc" :on-format-error="laneFormatError" :show-upload-list="false">
            <Button type="ghost" icon="ios-cloud-upload-outline">上传</Button>
          </Upload>
        </div> -->
        </div>
        <div class="confirm">
          <div style="width:100px;">
            <!-- <Checkbox v-model="formData.alarmaffirm.affirmflag">报警确认</Checkbox> -->
            报警确认
          </div>
          <div>
            <Radio-group v-model="wayGroup" @on-change="showRadio">
              <Radio label="自动确认"></Radio>
              <Input-number class="confirm-time" prop="maxDelay" :disabled="inputIsShow" :min="0" :max="3600" v-model="formData.alarmaffirm.autoaffirm.intervaltime"></Input-number>
              <br>
              <Radio label="手动确认"></Radio>
            </Radio-group>
          </div>
        </div>
      </Form>
      <div slot="footer">
        <Button type="ghost" @click="cancel('formData')">取消</Button>
        <Button type="primary" :loading="isLoading" @click="save('formData')">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import deviceValidate from '../deviceValidate.js'
export default {
  name: 'alarmInRes',
  components: {
  },
  computed: {
    ...mapGetters(['enabledSort', 'enabledTemp'])
  },
  data() {
    const verifyName = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('不能为空'))
      } else {
        callback()
      }
    }
    const inputNum = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('不能为空'))
      } else if (value === 0) {
        return callback(new Error('最小值为1'))
      } else {
        callback()
      }
    }
    return {
      mapLogoList: [
        { value: 0, label: '图标' },
        { value: 1, label: '线' },
        { value: 2, label: '区域' }
      ],
      enabledLevel: [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
        { label: '8', value: 8 },
        { label: '9', value: 9 }
      ],
      alarmInResModal: false,
      // 验证规则
      formValidate: {
        name: [
          { required: true, validator: deviceValidate.verifyResName, trigger: 'change' },
          { validator: deviceValidate.noSpace, trigger: 'change' }
        ],
        devloop: [
          { required: true, validator: verifyName, trigger: 'change' }
        ],
        fireInputNum: [
          { required: true, validator: inputNum, trigger: 'change' }
        ],
        chan: [
          { required: true, validator: verifyName, trigger: 'change' }
        ],
        maxdelaytime: [{ required: true, validator: deviceValidate.maxDelayRule, trigger: 'change' }],
        minintervaltime: [{ required: true, validator: deviceValidate.maxDelayRule, trigger: 'change' }]
      },
      formData: {
        eid: '',
        type: 9,
        name: '',
        chan: 0,
        level: 1,
        devloop: 0, // 设备回路
        fireInputNum: 1, // 输入防区个数
        alarmtype: '', // 报警分类
        alarmtemplate: '',
        maxdelaytime: 300,
        minintervaltime: 300,
        mapsign: { // 地图标识
          signflag: false,
          signtype: 0 // 0:图标,1:线,2:区域
          // signvalue: ''
        },
        alarmaffirm: { // 报警确认
          affirmflag: true,
          autoaffirm: {
            status: false,
            intervaltime: 20
          },
          handaffirm: {
            status: true
          }
        }
      },
      wayGroup: '',
      inputIsShow: false
    }
  },
  props: {
    // 弹窗展示
    alarmInResShow: {
      type: Boolean,
      default: false
    },
    // 添加 or 修改
    isAlarmResEdit: {
      type: Boolean,
      default: false
    },
    // 弹窗数据
    alarmInResFormData: {
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
    },
    // 资源tab类型
    activeChannelType: {
      type: Number,
      default: 0
    },
    isPatch: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    // 监听弹窗知否展示
    alarmInResShow(val) {
      if (val !== this.alarmInResModal) {
        this.alarmInResModal = val
        // this.$refs.formData.$forceUpdate()
      }
    },
    // 监听弹窗数据是否发生变化
    alarmInResFormData: {
      handler: function(val) {
        if (val) {
          this.formData = JSON.parse(JSON.stringify(val))
          if (this.formData.alarmaffirm.autoaffirm.status) {
            this.wayGroup = '自动确认'
            this.inputIsShow = false
          } else {
            this.wayGroup = '手动确认'
            this.inputIsShow = true
          }
        }
      },
      deep: true
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
      this.$refs[name].validate((valid) => {
        if (valid) {
          let formData = JSON.parse(JSON.stringify(this.formData))
          if (formData.alarmtemplate === '') {
            delete formData.alarmtemplate
          }
          if (formData.alarmtype === '') {
            delete formData.alarmtype
          }
          if (formData.devloop) {
            let devloop = formData.devloop.toString()
            formData.devloop = devloop
          }
          if (this.isPatch) {
            this.$emit('savePatch', formData, name)
          } else {
            this.$emit('save', formData, name)
          }
        } else {
          console.log('验证失败')
        }
      })
    },
    // 名称
    chanChange(val) {
      this.formData.name = this.deviceName + '_' + this.activeResName + '_通道' + val
    },
    // 消防主机单个添加时名称的变化
    chanDevloopChange() {
      this.formData.name = this.deviceName + '_' + this.activeResName + '_' + this.formData.devloop + '_' + this.formData.chan
    },
    // 手动确认，自动确认转换
    showRadio(select) {
      if (select === '手动确认') {
        this.inputIsShow = true
        this.formData.alarmaffirm.autoaffirm.status = false
        this.formData.alarmaffirm.handaffirm.status = true
      } else {
        this.inputIsShow = false
        this.formData.alarmaffirm.autoaffirm.status = true
        this.formData.alarmaffirm.handaffirm.status = false
      }
    }
    // 上传图片
    // uploadLaneSuc(response) {
    //   this.formData.mapsign.signvalue = response.id
    // },
    // 上传图片的限制类型
    // laneFormatError(file) {
    //   this.warningMsg('文件 ' + file.name + ' 格式不正确，请上传 jpg, png, bmp 或 jpeg 格式的图片。')
    // }
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
