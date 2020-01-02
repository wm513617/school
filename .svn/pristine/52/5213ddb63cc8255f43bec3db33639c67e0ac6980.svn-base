<template>
  <Modal v-model="isShow" :width="480" :title="addModTitle" :mask-closable="false" @on-visible-change="$emit('close')">
    <div style="height: 450px;">
      <div style="margin-top: -24px;">
        <div class="tabs" :class="{'tabs-focus': modTab === '1'}" @click="modTab = '1'">报警选择</div>
        <div class="tabs" :class="{'tabs-focus': modTab === '2'}" @click="modTab = '2'">报警设置</div>
      </div>
      <div v-if="(type === 'deviceAlarm') && (modTab === '1')" class="device-radio">
        <RadioGroup vertical @on-change="changeDevice" v-model="deviceRadio">
          <Radio label="视频设备" :disabled="devEquipStatus"></Radio>
          <Radio label="报警主机" :disabled="alarmHostStatus"></Radio>
          <Radio label="解码器" :disabled="decodeStatus"></Radio>
        </RadioGroup>
      </div>
      <div v-show=" modTab === '1'">
        <div v-if="type !== 'deviceAlarm'">
          <bs-scroll ref="inTreeScroll" style="width:100%;height:400px;overflow:auto;">
            <v-tree ref='inTree' @on-expand="inTreeExpand" :options="options" :treeData="deviceTree" :isSaveState='false' />
          </bs-scroll>
        </div>
        <div v-else>
          <div v-if="deviceRadio === '视频设备'">
            <bs-scroll ref="devEquipScroll" style="width:100%;height:400px;overflow:auto;">
              <bsr-tree :treeData="equipTree" ref="devEquipTree" @on-expand="devEquipExpand" @handlechecked="devEquipCheckNode" showCheckbox>
                <template slot-scope="{ node }">
                  <span :class="{'item': true, 'offline': (node.eid && node.status !== 1)}"  :title="node.name">
                    <i class="iconfont" :class="[getNodeIcon(node).class]" :title="getNodeIcon(node).title"></i>
                    {{node.name}}
                  </span>
                </template>
              </bsr-tree>
            </bs-scroll>
          </div>
          <div v-if="deviceRadio === '报警主机'">
            <bs-scroll ref="alarmHostScroll" style="width:100%;height:400px;overflow:auto;">
              <bsr-tree :treeData="alarmHostTree" ref="alarmHTree" @on-expand="alarmHostExpand" @handlechecked="alarmHostCheckNode" showCheckbox>
                <template slot-scope="{ node }">
                  <span :class="{'item': true, 'offline': (node.eid && node.status !== 1)}"  :title="node.name">
                    <i class="iconfont" :class="[getNodeIcon(node).class]" :title="getNodeIcon(node).title"></i>
                    {{node.name}}
                  </span>
                </template>
              </bsr-tree>
            </bs-scroll>
          </div>
          <div v-if="deviceRadio === '解码器'">
            <bs-scroll ref="decodeScroll" style="width:100%;height:400px;overflow:auto;">
              <bsr-tree :treeData="decodeTree" ref="deTree" @on-expand="decodeExpand" @handlechecked="decodeCheckNode" showCheckbox>
                <template slot-scope="{ node }">
                  <span :class="{'item': true, 'offline': (node.eid && node.status !== 1)}"  :title="node.name">
                    <i class="iconfont" :class="[getNodeIcon(node).class]" :title="getNodeIcon(node).title"></i>
                    {{node.name}}
                  </span>
                </template>
              </bsr-tree>
            </bs-scroll>
          </div>
        </div>
      </div>
      <div v-show="modTab === '2'" style="padding: 0 10px;">
        <!-- 报警输入alarmInput, 报警主机 alarmHost, 监控点报警 monitorAlarm, 智能报警 IntelligentAlarm, 设备报警 deviceAlarm -->
        <Form v-if="type === 'alarmInput' || type === 'alarmHost' || type === 'monitorAlarm' || type === 'IntelligentAlarm'" ref="addForm" :rules="ruleValidate" :model="alarmSetInfo" :label-width="95" label-position="left">
          <FormItem :label="type === 'alarmInput' || type === 'alarmHost' ? '报警子类型' : '报警类型'">
            <Select v-model="alarmSetInfo.subtype">
              <Option v-for="item in alarmSubType" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="报警级别">
            <Select v-model="alarmSetInfo.level">
              <Option v-for="item in alarmLevel" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="报警接收时间">
            <Select v-model="alarmSetInfo.alarmtemplate">
              <Option v-for="item in enabledTemp" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="报警接收间隔" prop="minintervaltime">
            <Input v-model.trim="alarmSetInfo.minintervaltime"></Input>
          </FormItem>
          <FormItem label="报警确认">
            <RadioGroup v-model="affirmMethod" vertical @on-change="changeAffirm">
              <Radio label="自动确认">自动确认
                <Input-number :min="0" :max="300" :disabled="!alarmSetInfo.alarmaffirm.autoaffirm.status" v-model="alarmSetInfo.alarmaffirm.autoaffirm.intervaltime"></Input-number>秒
              </Radio>
              <Radio label="手动一级确认"></Radio>
              <Radio label="手动二级确认"></Radio>
            </RadioGroup>
          </FormItem>
        </Form>
        <Form v-if="type === 'deviceAlarm'" :model="alarmSetInfo" :label-width="95" label-position="left">
          <FormItem label="报警类型">
            <Select v-model="alarmSetInfo.subtype">
              <Option v-for="item in alarmSubType" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="报警级别">
            <Select v-model="alarmSetInfo.level">
              <Option v-for="item in alarmLevel" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Form>
        <Form v-if="type === 'alarmOut'" ref="outAddForm" :rules="outRuleValidate" :model="alarmOutSet" :label-width="85" label-positioin="left">
          <FormItem label="输出类型">
            <Select v-model="alarmOutSet.outType">
              <Option v-for="item in outTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="持续时间" prop="duration">
            <Input v-model.trim="alarmOutSet.duration"></Input>
          </FormItem>
          <FormItem label="输出延时" prop="delay">
            <Input v-model.trim="alarmOutSet.delay"></Input>
          </FormItem>
        </Form>
      </div>
    </div>
    <div slot="footer">
      <Button type="ghost" @click="$emit('close')">取消</Button>
      <Button type="primary" @click="sureAdd">确定</Button>
    </div>
  </Modal>
</template>

<script>
/* type: 报警子类型（alarmInput, alarmHost, fireAlarm, monitorAlarm, IntelligentAlarm, deviceAlarm, alarmOut, alarmHelp, transportation, faceAlarm） */
import { numberValidate } from './allJs/formCheck.js'
import { mapGetters } from 'vuex'
import { getNodeIcon } from 'components/BStree/commonMethods.js'
export default {
  props: {
    isOpen: { // 弹框打开状态
      type: Boolean,
      default: false
    },
    addModTitle: { // 弹框标题
      type: String,
      default: ''
    },
    deviceTree: { // 设备 机构树
      type: Array,
      default: () => {
        return []
      }
    },
    equipTree: {
      type: Object,
      default: () => {
        return {}
      }
    },
    alarmHostTree: {
      type: Object,
      default: () => {
        return {}
      }
    },
    decodeTree: {
      type: Object,
      default: () => {
        return {}
      }
    },
    type: { // 报警类别
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isShow: this.isOpen,
      modTab: '1',
      options: {
        showCheckbox: true,
        showInput: true
      },
      alarmSubType: [], // 报警子类型
      alarmInputSubType: [
        {label: '报警求助', value: 'helpSeek'}
      ], // 报警输入子类型
      alarmHostSubType: [ // 报警主机子类型
        {label: '周界报警', value: 'perimeterAlarm'},
        {label: '入侵报警', value: 'intrusionAlarm'},
        {label: '电子围栏', value: 'electricFence'}
      ],
      monitorAlarmSubType: [ // 监控点报警类型
        {label: '移动侦测', value: 'alarmMoveSense'},
        {label: '亮度异常', value: 'brightnessAbnormal'},
        {label: '画面冻结', value: 'screenFreeze'},
        {label: '视频遮挡', value: 'videoMask'},
        {label: '噪声检测', value: 'noise'},
        {label: '信号缺失', value: 'signalLoss'},
        {label: '镜头位移', value: 'sceneSwitch'},
        {label: '偏色检测', value: 'colorCast'},
        {label: '清晰度异常', value: 'definitionAbnormal'}
      ],
      IntelligentAlarmSubType: [ // 智能报警类型
        {label: '拌线入侵', value: 'tripwire'},
        {label: '周界保护', value: 'perimeter'},
        {label: '物品丢失', value: 'missingObject'},
        {label: '物品遗留', value: 'leftObject'},
        {label: '非法停留', value: 'loitering'},
        {label: '逆行检测', value: 'retrogradeDetection'},
        {label: '徘徊检测', value: 'lingerDetection'},
        {label: '双警戒线', value: 'doubleCordon'},
        {label: '区域入侵', value: 'areaInvade'},
        {label: '快速移动', value: 'fastMove'},
        {label: '停车检测', value: 'parkDetect'},
        {label: '人员聚集', value: 'humanAssemble'},
        {label: '物品搬移', value: 'objectMove'}
      ],
      deviceAlarmSubType: [
        {label: 'SD卡故障', value: 'sdCardFailure'},
        {label: 'SD卡满', value: 'sdCardFull'},
        {label: '网络断开', value: 'networkDown'},
        {label: 'IP冲突', value: 'ipConflict'},
        {label: '时间异常', value: 'timeAbnormal'},
        {label: '非法网络访问', value: 'illegalNetworkAccess'}
      ],
      affirmMethod: '手动一级确认',
      alarmSetInfo: {
        subtype: '',
        level: 1,
        alarmtemplate: '',
        minintervaltime: 0,
        alarmaffirm: {
          autoaffirm: {
            status: false,
            intervaltime: 20
          },
          handaffirm: {
            status: true
          },
          handaffirm2: {
            status: false
          }
        }
      },
      outTypeList: [ // 报警输出类型
        {label: '常开', value: '0'},
        {label: '常闭', value: '1'}
      ],
      alarmOutSet: {
        outType: '0',
        duration: 10,
        delay: 0
      },
      ruleValidate: {
        minintervaltime: [
          {required: true, validator: numberValidate(0, 7200), trigger: 'blur'}
        ]
      },
      outRuleValidate: {
        duration: [
          {required: true, validator: numberValidate(0, 7200), trigger: 'blur'}
        ],
        delay: [
          {required: true, validator: numberValidate(0, 7200), trigger: 'blur'}
        ]
      },
      deviceRadio: '视频设备',
      devRadioStatus: {
        videoStatus: true,
        hostStatus: false,
        decodeStatus: false
      },
      devEquipStatus: false,
      alarmHostStatus: false,
      decodeStatus: false
    }
  },
  computed: {
    ...mapGetters(['enabledTemp', 'alarmLevel'])
  },
  created() {
    this.alarmSetInfo.alarmtemplate = this.enabledTemp[0].value
    switch (this.type) {
      case 'alarmInput':
        this.alarmSubType = this.alarmInputSubType
        break
      case 'alarmHost':
        this.alarmSubType = this.alarmHostSubType
        break
      case 'monitorAlarm':
        this.alarmSubType = this.monitorAlarmSubType
        break
      case 'IntelligentAlarm':
        this.alarmSubType = this.IntelligentAlarmSubType
        break
      case 'deviceAlarm':
        this.alarmSubType = this.deviceAlarmSubType
        break
    }
    this.alarmSetInfo.subtype = this.alarmSubType.length ? this.alarmSubType[0].value : ''
  },
  methods: {
    /**
     * 获取选中节点的id集合
     * @method funCheckNode/sysCheckNode
     * @param {Array} data 选中节点的id集合
     */
    devEquipCheckNode(data) {
      if (data.length > 0) {
        this.alarmHostStatus = true
        this.decodeStatus = true
      } else {
        this.alarmHostStatus = false
        this.decodeStatus = false
      }
    },
    alarmHostCheckNode(data) {
      if (data.length > 0) {
        this.devEquipStatus = true
        this.decodeStatus = true
      } else {
        this.devEquipStatus = false
        this.decodeStatus = false
      }
    },
    decodeCheckNode(data) {
      if (data.length > 0) {
        this.devEquipStatus = true
        this.alarmHostStatus = true
      } else {
        this.devEquipStatus = false
        this.alarmHostStatus = false
      }
    },
    getNodeIcon(item) {
      return getNodeIcon(item)
    },
    inTreeExpand() {
      this.$refs.inTreeScroll.update()
    },
    devEquipExpand() {
      this.$refs.devEquipScroll.update()
    },
    alarmHostExpand() {
      this.$refs.alarmHostScroll.update()
    },
    decodeExpand() {
      this.$refs.decodeScroll.update()
    },
    sureAdd() {
      // 获取 机构树 选中节点
      let nodes = []
      let resNodes = []
      if (this.type === 'deviceAlarm') {
        if (this.deviceRadio === '视频设备') {
          nodes = this.$refs.devEquipTree.getSelectedNodes()
        } else if (this.deviceRadio === '报警主机') {
          nodes = this.$refs.alarmHTree.getSelectedNodes()
        } else {
          nodes = this.$refs.deTree.getSelectedNodes()
        }
        resNodes = nodes.filter(node => !node.isOrg)
      } else {
        nodes = this.$refs.inTree.getSelectedNodes()
        resNodes = nodes.filter(node => !node.isOrg).filter(node => !node.equip).filter(node => node.isroot === undefined)
      }
      if (resNodes.length !== 0) {
        // 表单校验
        let ref = this.type === 'alarmOut' ? 'outAddForm' : 'addForm'
        if (this.type === 'alarmOut') {
          this.$refs['outAddForm'].validate(valid => {
            if (valid) {
              const payload = {
                alarmouttype: this.alarmOutSet.outType,
                durationtime: Number(this.alarmOutSet.duration),
                exportdelaytime: Number(this.alarmOutSet.delay)
              }
              this.$emit('addNewOne', {resNodes: resNodes, body: payload})
            }
          })
        } else if (this.type === 'deviceAlarm') {
          this.$emit('addNewOne', {resNodes: resNodes, body: this.alarmSetInfo})
        } else {
          this.$refs[ref].validate(valid => {
            if (valid) {
              this.alarmSetInfo.minintervaltime = Number(this.alarmSetInfo.minintervaltime)
              this.$emit('addNewOne', {resNodes: resNodes, body: this.alarmSetInfo})
            }
          })
        }
      } else {
        this.errorMsg('请勾选资源')
      }
    },
    changeAffirm(val) {
      switch (val) {
        case '自动确认':
          this.alarmSetInfo.alarmaffirm.autoaffirm.status = true
          this.alarmSetInfo.alarmaffirm.handaffirm.status = false
          this.alarmSetInfo.alarmaffirm.handaffirm2.status = false
          break
        case '手动一级确认':
          this.alarmSetInfo.alarmaffirm.autoaffirm.status = false
          this.alarmSetInfo.alarmaffirm.handaffirm.status = true
          this.alarmSetInfo.alarmaffirm.handaffirm2.status = false
          break
        case '手动二级确认':
          this.alarmSetInfo.alarmaffirm.autoaffirm.status = false
          this.alarmSetInfo.alarmaffirm.handaffirm.status = false
          this.alarmSetInfo.alarmaffirm.handaffirm2.status = true
          break
      }
    },
    changeDevice(val) {
      switch (val) {
        case '视频设备':
          this.devRadioStatus.videoStatus = true
          this.devRadioStatus.hostStatus = false
          this.devRadioStatus.decodeStatus = false
          break
        case '报警主机':
          this.devRadioStatus.videoStatus = false
          this.devRadioStatus.hostStatus = true
          this.devRadioStatus.decodeStatus = false
          break
        case '解码器':
          this.devRadioStatus.videoStatus = false
          this.devRadioStatus.hostStatus = false
          this.devRadioStatus.decodeStatus = true
          break
      }
      this.$emit('devTreeData', this.devRadioStatus)
    }
  }
}
</script>

<style scoped lang='less'>
.tabs {
  width: 88px;
  height: 43px;
  line-height: 43px;
  font-size: 14px;
  box-sizing: border-box;
  color: #8597ad;
  text-align: center;
  display: inline-block;
  cursor: pointer;
  &:hover {
    color: #57a3f3;
  }
}
.tabs-focus {
  color: #fff;
  border-top: 2px solid #57a3f3;
}
.ivu-input-number {
  width: 100%;
}
.ivu-modal {
  width: 480px;
}
.device-radio label {
  float: left;
}
</style>
