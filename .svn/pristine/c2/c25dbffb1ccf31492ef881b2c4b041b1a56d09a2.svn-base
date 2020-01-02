<template>
  <!--智能、监控点详情 模态框-->
  <Modal id="deviceAlarm" :mask-closable="false" v-model="resModal" :title="deviceAlarmTitle" width="550" @on-cancel="cancel('formData')">
    <Form inline :model="formData" :label-width="75" :rules="formValidate" ref="formData" label-position="left">
      <Form-item label="所属设备" style="display:block;word-wrap: break-word">{{ deviceName }}</Form-item>
      <Form-item label="通道号" prop="chan" v-show="!isResEdit && activeResName !== '设备报警'">
        <Select v-model="formData.rid" @on-change="chanChange">
          <Option v-for="item in chanList" :value="item.value" :key="item.label">{{ item.label }}</Option>
        </Select>
      </Form-item>
      <Form-item label="通道号" prop="chan" v-show="(isResEdit || isDisabled) && activeResName !== '设备报警'">
        <Input v-model="formData.chan" :disabled="isResEdit || isDisabled"></Input>
      </Form-item>
      <Form-item label="布撤防时间">
        <Select v-model="formData.alarmtemplate" :disabled="isDisabled">
          <Option v-for="item in this.enabledTemp" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Form-item>
      <Form-item label="级别">
        <Select v-model="formData.level" :disabled="isDisabled">
          <Option v-for="item in enabledLevel" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Form-item>
      <Form-item label="最大延时" prop="maxdelaytime">
        <Input v-model="formData.maxdelaytime" :disabled="isDisabled"></Input>
      </Form-item>
      <Form-item label="报警分类">
        <Select v-model="formData.alarmtype" :disabled="isDisabled">
          <Option v-for="item in this.enabledSort" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Form-item>
      <Form-item label="最小间隔" prop="minintervaltime">
        <Input v-model="formData.minintervaltime" :disabled="isDisabled"></Input>
      </Form-item>
      <div style="display:flex">
        <!-- <div> -->
        <div style="width:225px;margin-left:20px" v-if="activeResName !== '设备报警' && formData.mapsign">
          <Checkbox v-model="formData.mapsign.signflag" :disabled="isDisabled">地图标识</Checkbox>
        </div>
        <!-- <div>
            <Select style="width:150px" v-model="formData.mapsign.signtype">
              <Option v-for="item in mapLogoList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div> -->
        <!-- </div> -->
        <div class="confirm" v-if="formData.alarmaffirm">
          <div style="width:75px;margin-left:10px">
            报警确认
          </div>
          <div>
            <Radio-group v-model="wayGroup" @on-change="showRadio">
              <Radio label="自动确认" :disabled="isDisabled"></Radio>
              <Input-number class="confirm-time" prop="maxDelay" :disabled="inputIsShow || isDisabled" :min="0" :max="3600" v-model="formData.alarmaffirm.autoaffirm.intervaltime"></Input-number>
              <br>
              <Radio label="手动确认" :disabled="isDisabled"></Radio>
            </Radio-group>
          </div>
        </div>
      </div>
      <!--监控点-->
      <!-- 'alarmMoveSense', 'videoMask', 'sceneSwitch', 'definitionAbnormal', 'brightnessAbnormal', 'noise', 'colorCast', 'signalLoss', 'screenFreeze' -->
      <div class="modalBottom" v-if="activeResName === '监控点报警'">
        <CheckboxGroup v-model="formData.type">
          <div class="rowStyle">
            <Checkbox label="alarmMoveSense" class="flexgrow" :disabled="isDisabled">
              <span>移动侦测</span>
            </Checkbox>
            <Checkbox label="brightnessAbnormal" class="flexgrow" :disabled="isDisabled">
              <span>亮度异常</span>
            </Checkbox>
            <Checkbox label="screenFreeze" class="flexgrow" :disabled="isDisabled">
              <span>画面冻结</span>
            </Checkbox>
          </div>
          <div class="rowStyle">
            <Checkbox label="videoMask" class="flexgrow" :disabled="isDisabled">
              <span>视频遮挡</span>
            </Checkbox>
            <Checkbox label="noise" class="flexgrow" :disabled="isDisabled">
              <span>噪声检测</span>
            </Checkbox>
            <Checkbox label="signalLoss" class="flexgrow" :disabled="isDisabled">
              <span>信号缺失</span>
            </Checkbox>
          </div>
          <div class="rowStyle">
            <Checkbox label="sceneSwitch" class="flexgrow" :disabled="isDisabled">
              <span>镜头位移</span>
            </Checkbox>
            <Checkbox label="colorCast" class="flexgrow" :disabled="isDisabled">
              <span>偏色检测</span>
            </Checkbox>
            <Checkbox label="definitionAbnormal" class="flexgrow" :disabled="isDisabled">
              <span>清晰度异常</span>
            </Checkbox>
          </div>
        </CheckboxGroup>
      </div>
      <!--智能报警-->
      <div class="modalBottom" v-if="activeResName === '智能报警'">
        <CheckboxGroup v-model="formData.type">
          <Row class="rowStyle">常规智能报警</Row>
          <div class="rowStyle">
            <Checkbox label="tripwire" class="flexgrow" :disabled="isDisabled">
              <span>拌线入侵</span>
            </Checkbox>
            <Checkbox label="perimeter" class="flexgrow" :disabled="isDisabled">
              <span>周界保护</span>
            </Checkbox>
            <Checkbox label="missingObject" class="flexgrow" :disabled="isDisabled">
              <span>物品丢失</span>
            </Checkbox>
          </div>
          <div class="rowStyle">
            <Checkbox label="leftObject" class="flexgrow" :disabled="isDisabled">
              <span>物品遗留</span>
            </Checkbox>
            <Checkbox label="loitering" class="flexgrow" :disabled="isDisabled">
              <span>非法停留</span>
            </Checkbox>
            <Checkbox label="retrogradeDetection" class="flexgrow" :disabled="isDisabled">
              <span>逆行检测</span>
            </Checkbox>
          </div>
          <div class="rowStyle">
            <Checkbox label="lingerDetection" class="flexgrow" :disabled="isDisabled">
              <span>徘徊检测</span>
            </Checkbox>
            <Checkbox label="doubleCordon" class="flexgrow" :disabled="isDisabled">
              <span>双警戒线</span>
            </Checkbox>
            <Checkbox label="areaInvade" class="flexgrow" :disabled="isDisabled">
              <span>区域入侵</span>
            </Checkbox>
          </div>
          <div class="rowStyle">
            <Checkbox label="fastMove" class="flexgrow" :disabled="isDisabled">
              <span>快速移动</span>
            </Checkbox>
            <Checkbox label="parkDetect" class="flexgrow" :disabled="isDisabled">
              <span>停车检测</span>
            </Checkbox>
            <Checkbox label="humanAssemble" class="flexgrow" :disabled="isDisabled">
              <span>人员聚集</span>
            </Checkbox>
          </div>
          <div class="rowStyle">
            <Checkbox label="objectMove" style="flex:1" :disabled="isDisabled">
              <span>物品搬移</span>
            </Checkbox>
          </div>
          <Row class="rowStyle">人脸分析</Row>
          <div class="rowStyle">
            <Checkbox label="dispatchHuman" class="flexgrow" :disabled="isDisabled">
              <span>布控人员</span>
            </Checkbox>
          </div>
          <Row class="rowStyle">车辆分析</Row>
          <div class="rowStyle">
            <Checkbox label="dispatchVehicle" class="flexgrow" :disabled="isDisabled">
              <span>布控车辆</span>
            </Checkbox>
          </div>
        </CheckboxGroup>
      </div>
      <!--设备-->
      <div class="modalBottom" v-if="activeResName === '设备报警'">
        <CheckboxGroup v-model="formData.type">
          <div class="rowStyle">
            <Checkbox label="hardDiskFailure" class="flexgrow" :disabled="isDisabled">
              <span>SD卡故障</span>
            </Checkbox>
            <Checkbox label="hardDiskFull" class="flexgrow" :disabled="isDisabled">
              <span>SD卡满</span>
            </Checkbox>
            <Checkbox label="networkDown" class="flexgrow" :disabled="isDisabled">
              <span>网络断开</span>
            </Checkbox>
          </div>
          <div class="rowStyle">
            <Checkbox label="ipConflict" class="flexgrow" :disabled="isDisabled">
              <span>IP冲突</span>
            </Checkbox>
            <Checkbox label="timeAbnormal" class="flexgrow" :disabled="isDisabled">
              <span>时间异常</span>
            </Checkbox>
            <Checkbox label="illegalNetworkAccess" class="flexgrow" :disabled="isDisabled">
              <span>非法网络访问</span>
            </Checkbox>
          </div>
        </CheckboxGroup>
      </div>
      <!-- <br>*此页详情内容为只读，修改操作无效</br> -->
    </Form>
    <div slot="footer">
      <Button type="ghost" v-if="!isDisabled" @click="cancel('formData')">取消</Button>
      <Button type="primary" v-if="!isDisabled" @click="save('formData')">确定</Button>
      <Button type="primary" v-if="isDisabled" @click="confirm('formData')">确认</Button>
    </div>
  </Modal>
</template>
<script>
import { mapGetters } from 'vuex'
import '../devicesRes.css'
import deviceValidate from '../deviceValidate.js'
export default {
  data() {
    return {
      resModal: false,
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
      // 验证规则
      formValidate: {
        maxdelaytime: [{ required: true, validator: deviceValidate.maxDelayRule, trigger: 'change' }],
        minintervaltime: [{ required: true, validator: deviceValidate.maxDelayRule, trigger: 'change' }]
      },
      // formData: {}
      wayGroup: '',
      inputIsShow: false,
      formData: {
        rid: '',
        name: '',
        chan: 1,
        level: 1,
        type: [],
        alarmtype: '', // 报警分类
        alarmtemplate: '',
        maxdelaytime: 300,
        minintervaltime: 300,
        mapsign: { // 地图标识
          signflag: false
          // signtype: 0  // 0:图标,1:线,2:区域
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
      }
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
    isDisabled: {
      type: Boolean,
      default: false
    },
    // 弹窗数据
    resFormData: {
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
    // 弹窗名称
    deviceAlarmTitle: {
      type: String
    }
  },
  computed: {
    ...mapGetters(['enabledSort', 'enabledTemp'])
  },
  watch: {
    // 监听弹窗知否展示
    resShow(val) {
      if (val !== this.resModal) {
        this.resModal = val
      }
    },
    // 监听弹窗数据是否发生变化
    resFormData: {
      handler: function(val) {
        if (val) {
          this.formData = JSON.parse(JSON.stringify(this.resFormData))
          if (this.formData.alarmaffirm) {
            if (this.formData.alarmaffirm.autoaffirm.status) {
              this.wayGroup = '自动确认'
              this.inputIsShow = false
            } else {
              this.wayGroup = '手动确认'
              this.inputIsShow = true
            }
          }
        }
      },
      deep: true
    }
  },
  methods: {
    // 取消
    cancel(name) {
      this.$refs[name].resetFields()
      // this.$refs['DeviceAlarmRes'].$refs[name].resetFields()
      this.$emit('cancel', name)
    },
    // 保存
    save(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.formData.alarmtemplate === '') {
            delete this.formData.alarmtemplate
          }
          this.$emit('save', this.formData, name)
        }
      })
    },
    // 详情确认按钮
    confirm() {
      this.$emit('confirm')
    },
    // 通道号变换
    chanChange(val) {
      this.chanList.forEach(item => {
        if (item.value === val) {
          this.formData.chan = item.label
          this.formData.rid = val
        }
      })
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
  }
}
</script>
<style scoped>
.confirm {
  margin-bottom: 10px;
  display: flex;
  margin-left: 20px;
}

.confirm-time {
  width: 70px;
  /* margin-left: 10px; */
}
.confirm-upload {
  height: 30px;
  display: flex;
  margin-left: 20px;
}
.modalBottom {
  border: 1px solid #aaa;
  margin: 20px;
}
.modalBottom .rowStyle {
  margin: 20px 0px 20px 40px;
  display: flex;
}
.modalBottom .rowStyle .flexgrow {
  flex: 1;
}
</style>
