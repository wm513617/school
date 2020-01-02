<template>
  <div class="res-table-video">
    <div class="table-header">
      <TableTab :tabs="videoTabs" @on-tab-click="deviceResTabClick" :isCount="true"></TableTab>
      <div class="table-header-actions clear">
        <div class="actions-btn">
          <Button type="ghost" v-if="$BShasPower('BS-SETTING-EQUIPMENT-VIDEO-MANAGE')" icon="plus" @click="addDeviceRes" :disabled="this.deviceId !== 'notExist' ? false : true">添加</Button>
          <Button id="res-modification" type="ghost" v-if="$BShasPower('BS-SETTING-EQUIPMENT-VIDEO-MANAGE')" icon="edit" @click="openEditDeviceResInfo" :disabled="!isDeviceResChecked">修改</Button>
          <Button type="ghost" v-if="$BShasPower('BS-SETTING-EQUIPMENT-VIDEO-MANAGE')" icon="trash-a" @click="openDeviceResDelModel" :disabled="!isDeviceResChecked">删除</Button>
          <Button type="ghost" icon="refresh" @click="refreshGetIp(deviceId)">刷新</Button>
          <Select style="width:120px" placeholder="同步通道名称" v-model="channelNameSyncSelect" v-show="activeResTab === 'video' && $BShasPower('BS-SETTING-EQUIPMENT-VIDEO-MANAGE')">
            <Option @click.native="selectChannelName" v-for="opt in channelNameSyncOpts" :value="opt.value" :key="opt.value">{{ opt.label }}</Option>
          </Select>
          <Select style="width:100px" placeholder="设置码流" v-model="batchStreamSelect" v-show="activeResTab === 'video' && $BShasPower('BS-SETTING-EQUIPMENT-VIDEO-MANAGE')">
            <Option @click.native="selectBatchStream" v-for="opt in batchStreamOpts" :value="opt.value" :key="opt.value">{{ opt.label }}</Option>
          </Select>
          <Button type="ghost" icon="chevron-up" v-if="isHide" style="float:right;margin-right:0;" @click="$emit('changeTable')"></Button>
          <Button type="ghost" icon="chevron-down" v-else style="float:right;margin-right:0;" @click="$emit('changeTable')"></Button>
        </div>
      </div>
    </div>
    <div class="table-relative" :style="{height: `${tableHeight}px`}">
      <div class="table-body">
        <Table size="small" :columns="deviceResColumns" :data="deviceAllResData[activeResTab]" @on-selection-change="selectDeviceResRow" :highlight-row="true" :height="tableHeight" width="100%"></Table>
      </div>
    </div>
    <!-- 报警输入弹窗 -->
    <!-- <AlarmInRes ref="AlarmInRes" :alarmInResShow="alarmInResShow" :isAlarmResEdit="isResEdit" :alarmInResFormData="alarmInResFormData" @save="saveAlarmInRes" @cancel="cancelAlarmInRes" :chanList="chanList" :deviceName="deviceName" :activeResName="activeResName" :activeChannelType="activeChannelType"></AlarmInRes> -->
    <!-- 报警输出弹窗 -->
    <!-- <AlarmOutRes ref="AlarmOutRes" :alarmOutResShow="alarmOutResShow" :isAlarmResEdit="isResEdit" :alarmOutResFormData="alarmOutResFormData" @save="saveAlarmInRes" @cancel="cancelAlarmInRes" :chanList="chanList" :deviceName="deviceName" :activeResName="activeResName"></AlarmOutRes> -->
    <!-- 视频通道弹窗 -->
    <VideoChanRes ref="VideoChanRes" :resShow="videoResShow" :isResEdit="isResEdit" :formData="videoResFormData" @save="saveAlarmInRes" @cancel="cancelAlarmInRes" :chanList="chanList" :deviceName="deviceName" :activeResName="activeResName"></VideoChanRes>
    <!-- 通用弹窗 -->
    <DecodeVoiceRes ref="DecodeVoiceRes" :resShow="intercomResShow" :isResEdit="isResEdit" :formData="intercomResFormData" @save="saveAlarmInRes" @cancel="cancelAlarmInRes" :chanList="chanList" :deviceName="deviceName" :activeResName="activeResName"></DecodeVoiceRes>
    <!-- 设备、监控点、智能 -->
    <!-- <DeviceAlarmRes ref="DeviceAlarmRes" :resShow="deviceAlarmShow" :isResEdit="isResEdit" :isDisabled="isReadOnly" :resFormData="deviceAlarmResFormData" @save="saveMonitoryAlarm" @cancel="cancelAlarmInRes" :chanList="chanList" :deviceName="deviceName" :activeResName="activeResName" :deviceAlarmTitle="deviceAlarmTitle" @confirm="confirm"></DeviceAlarmRes> -->
  </div>
</template>
<script>
import TableTab from '../tableTab'
// import AlarmInRes from '../modal/alarmInRes'
// import AlarmOutRes from '../modal/alarmOutRes'
import VideoChanRes from '../modal/videoChanRes'
import DecodeVoiceRes from '../modal/decodeVoiceRes'
// import DeviceAlarmRes from '../modal/deviceAlarmRes'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    TableTab,
    // AlarmInRes,
    // AlarmOutRes,
    VideoChanRes,
    DecodeVoiceRes
    // DeviceAlarmRes
  },
  props: {
    // 点击设备的ID
    deviceId: {
      type: String
    },
    // 点击设备的name
    deviceName: {
      type: String
    },
    // 设备数据用来控制资源tab是否显示
    hitDeviceInfo: {
      type: Object
    },
    tableHeight: {
      type: Number
    },
    isHide: {
      type: Boolean
    }
  },
  data() {
    return {
      // type: 0：视频通道 1：视频报警输入 2：视频报警输出通道 3：对讲通道 4：门禁通道 5：解码通道 6：音频通道 7：解码报警输入
      // 8：解码报警输出 9：报警主机报警输入 10：报警主机报警输出 11：消防输入防区 12：消防输出防区
      // 视频tab
      videoTabs: [
        {
          title: '视频通道',
          value: 'video',
          type: 0,
          disabled: false,
          active: true,
          number: 0,
          isHide: false
        }
        // {
        //   title: '报警输入',
        //   type: 1,
        //   value: 'alarmInput',
        //   disabled: false,
        //   active: false,
        //   number: 0,
        //   isHide: false
        // }, {
        //   title: '报警输出',
        //   type: 2,
        //   value: 'alarmOutput',
        //   disabled: false,
        //   active: false,
        //   number: 0,
        //   isHide: false
        // }, {
        //   title: '对讲通道',
        //   value: 'intercom',
        //   type: 3,
        //   disabled: false,
        //   active: false,
        //   number: 0,
        //   isHide: false
        // }, {
        //   title: '监控点报警',
        //   value: 'monitoryPointAlarm',
        //   type: null,
        //   disabled: false,
        //   active: false,
        //   number: 0,
        //   isHide: false
        // }, {
        //   title: '智能报警',
        //   value: 'intelligentAlarm',
        //   type: null,
        //   disabled: false,
        //   active: false,
        //   number: 0,
        //   isHide: false
        // }, {
        //   title: '设备报警',
        //   value: 'deviceAlarm',
        //   type: null,
        //   disabled: false,
        //   active: false,
        //   number: 0,
        //   isHide: false
        // }
      ],
      // 同步、码流按钮
      channelNameSyncOpts: [
        { value: 'center', label: '同步到中心' },
        { value: 'device', label: '同步到设备' }
      ],
      batchStreamOpts: [
        { value: 'main', label: '主码流' },
        { value: 'sub1', label: '子码流' },
        { value: 'sub2', label: '第三码流' }
      ],
      channelNameSyncSelect: '',
      batchStreamSelect: '',
      // 表格Columns
      deviceResColumns: [],
      // 视频通道
      videoChanResColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'left'
        }, {
          title: '通道号',
          key: 'chan',
          align: 'left'
        }, {
          title: '视频通道名称',
          key: 'name',
          align: 'left',
          render: (h, params) => {
            return h('span', {
              style: {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              },
              domProps: {
                title: params.row.name
              }
            }, params.row.name)
          }
        }, {
          title: '监控点类型',
          key: 'monitortype',
          align: 'left',
          render: (h, params) => {
            let text = ''
            switch (params.row.monitortype) {
              case 0:
                text = '枪机'
                break
              case 1:
                text = '红外枪机'
                break
              case 2:
                text = '半球'
                break
              case 3:
                text = '快球'
                break
              case 4:
                text = '全景'
                break
            }
            return h('span', text)
          }
        }, {
          title: '实时码流',
          key: 'stream',
          align: 'left',
          render: (h, params) => {
            let text = ''
            let t = params.row.stream
            if (t === 'main') {
              text = '主码流'
            } else if (t === 'sub1') {
              text = '子码流'
            } else if (t === 'sub2') {
              text = '第三码流'
            }
            return h('span', text)
          }
        }, {
          title: '设备IP',
          key: 'ip',
          align: 'left',
          ellipsis: true
        }
      ],
      // 报警输入
      alarmInResColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'left'
        }, {
          title: '防区编号',
          key: 'chan',
          align: 'left'
        }, {
          title: '报警输入名称',
          key: 'name',
          align: 'left',
          render: (h, params) => {
            return h('span', {
              style: {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              },
              domProps: {
                title: params.row.name
              }
            }, params.row.name)
          }
        }, {
          title: '级别',
          key: 'level',
          align: 'left'
        }, {
          title: '报警分类',
          key: 'alarmtype',
          align: 'left',
          render: (h, params) => {
            let text = ''
            this.enabledSort.map((item) => {
              if (item.value === params.row.alarmtype) {
                text = item.label
              }
            })
            return h('span', text)
          }
        }, {
          title: '布防时间',
          key: 'alarmtemplate',
          align: 'left',
          render: (h, params) => {
            let text = ''
            if (!params.row.alarmtemplate) {
              text = ''
            } else {
              this.enabledTemp.map((item) => {
                if (item.value === params.row.alarmtemplate) {
                  text = item.label
                }
              })
            }
            return h('span', text)
          }
        }, {
          title: '最大延时',
          key: 'maxdelaytime',
          align: 'left'
        }, {
          title: '最小间隔',
          key: 'minintervaltime',
          align: 'left'
        }
      ],
      // 报警输出
      alarmOutResColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'left'
        }, {
          title: '防区编号',
          key: 'chan',
          align: 'left'
        }, {
          title: '报警输出名称',
          key: 'name',
          align: 'left',
          render: (h, params) => {
            return h('span', {
              style: {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              },
              domProps: {
                title: params.row.name
              }
            }, params.row.name)
          }
        }, {
          title: '输出类型',
          key: 'alarmouttype',
          align: 'left',
          render: (h, params) => {
            let text = params.row.alarmouttype === '0' ? '常开' : '常闭'
            return h('span', text)
          }
        }, {
          title: '持续时间',
          key: 'durationtime',
          align: 'left'
        }, {
          title: '输出延时',
          key: 'exportdelaytime',
          align: 'left'
        }
      ],
      // 对讲通道
      intercomChanResColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'left'
        }, {
          title: '通道号',
          key: 'chan',
          align: 'left'
        }, {
          title: '对讲通道名称',
          key: 'name',
          align: 'left',
          render: (h, params) => {
            return h('span', {
              style: {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              },
              domProps: {
                title: params.row.name
              }
            }, params.row.name)
          }
        }, {
          title: '对讲类型',
          key: 'action',
          align: 'left',
          render: (h, params) => {
            return h('div', ['设备对讲'])
          }
        }
      ],
      // 监控点报警 、智能报警
      monitoryColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'left'
        }, {
          title: '通道号',
          key: 'chan',
          align: 'left'
        }, {
          title: '级别',
          key: 'level',
          align: 'left'
        }, {
          title: '报警分类',
          key: 'alarmtype',
          align: 'left',
          render: (h, params) => {
            let text = ''
            this.enabledSort.map((item) => {
              if (item.value === params.row.alarmtype) {
                text = item.label
              }
            })
            return h('span', text)
          }
        }, {
          title: '布防时间',
          key: 'alarmtemplate',
          align: 'left',
          render: (h, params) => {
            let text = ''
            if (!params.row.alarmtemplate) {
              text = ''
            } else {
              this.enabledTemp.map((item) => {
                if (item.value === params.row.alarmtemplate) {
                  text = item.label
                }
              })
            }
            return h('span', text)
          }
        }, {
          title: '最大延时',
          key: 'maxdelaytime',
          align: 'left'
        }, {
          title: '最小间隔',
          key: 'minintervaltime',
          align: 'left'
        }, {
          title: '报警详情',
          key: 'action',
          align: 'left',
          width: 150,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'ghost',
                  size: 'small'
                },
                on: {
                  click: (e) => {
                    e.stopPropagation()
                    this.alarmDetails(params.row)
                  }
                }
              }, '详情')
            ])
          }
        }
      ],
      // 设备报警
      deviceAlarmColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'left'
        }, {
          title: '级别',
          key: 'level',
          align: 'left'
        }, {
          title: '报警分类',
          key: 'alarmtype',
          align: 'left',
          render: (h, params) => {
            let text = ''
            this.enabledSort.map((item) => {
              if (item.value === params.row.alarmtype) {
                text = item.label
              }
            })
            return h('span', text)
          }
        }, {
          title: '布防时间',
          key: 'alarmtemplate',
          align: 'left',
          render: (h, params) => {
            let text = ''
            if (!params.row.alarmtemplate) {
              text = ''
            } else {
              this.enabledTemp.map((item) => {
                if (item.value === params.row.alarmtemplate) {
                  text = item.label
                }
              })
            }
            return h('span', text)
          }
        }, {
          title: '最大延时',
          key: 'maxdelaytime',
          align: 'left'
        }, {
          title: '最小间隔',
          key: 'minintervaltime',
          align: 'left'
        }, {
          title: '报警详情',
          key: 'action',
          align: 'left',
          width: 150,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'ghost',
                  size: 'small'
                },
                on: {
                  click: (e) => {
                    e.stopPropagation()
                    this.alarmDetails(params.row)
                  }
                }
              }, '详情')
            ])
          }
        }
      ],
      deviceAllResData: [],
      activeResTab: 'alarmInput',
      activeResName: '',
      activeChannelType: 0,
      deviceResSelectIds: [],
      isDeviceResChecked: false,
      // 报警输入的资源
      alarmInResShow: false,
      isResEdit: false,
      alarmInResFormData: {},
      alarmInResPlus: {
        // eid: '',
        // type: 1,
        // name: '',
        // chan: 1,
        level: 1,
        alarmtype: '',
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
      chanList: [],
      // 报警输出的资源
      alarmOutResShow: false,
      alarmOutResFormData: {},
      // 视频通道资源
      videoResShow: false,
      videoResFormData: {},
      // 对讲通道资源
      intercomResShow: false,
      intercomResFormData: {},
      // 监控点
      deviceAlarmShow: false,
      deviceAlarmResFormData: {},
      deviceAlarmTitle: '',
      alarmChanType: '',
      // 详情只读
      isReadOnly: false
    }
  },
  computed: {
    ...mapGetters(['enabledSort', 'enabledLevel', 'enabledTemp'])
  },
  created() {
    this.deviceResColumns = this.videoChanResColumns
    // 获取分类数据
    this.getSortData().then().catch((err) => {
      console.log('getSortData error: ' + err)
    })
    // 获取时间模板
    this.getAlarmTemp().then().catch((err) => {
      console.log('getAlarmTemp error: ' + err)
    })
    // 获取报警级别
    // this.getAlarmLevel()
  },
  watch: {
    // 监听设备变化
    deviceId(newId) {
      this.refreshDeviceResTable(newId)
      // 获取当前设备的信息改变TAB和TABLE的title
      // this.getDeviceInfo(newId).then(suc => {
      // console.log(suc)
      // this.deviceTabType = suc.bigtype
      // 报警主机下的资源
      // if (this.deviceTabType === 1) {
      // for (let d in this.videoTabs) {
      //   this.videoTabs[d].active = false
      // }
      this.activeResTab = this.videoTabs[0].value
      this.activeResName = this.videoTabs[0].title
      this.activeChannelType = this.videoTabs[0].type
      this.videoTabs[0].active = true
      // }
      // })
    },
    // 监听tab变化转换Columns
    activeResTab(newId) {
      if (this.activeResTab === 'alarmInput') {
        this.deviceResColumns = this.alarmInResColumns
      } else if (this.activeResTab === 'alarmOutput') {
        this.deviceResColumns = this.alarmOutResColumns
      } else if (this.activeResTab === 'video') {
        this.deviceResColumns = this.videoChanResColumns
      } else if (this.activeResTab === 'intercom') {
        this.deviceResColumns = this.intercomChanResColumns
      } else if (this.activeResTab === 'monitoryPointAlarm' || this.activeResTab === 'intelligentAlarm') {
        this.deviceResColumns = this.monitoryColumns
      } else if (this.activeResTab === 'deviceAlarm') {
        this.deviceResColumns = this.deviceAlarmColumns
      }
    }
    // hitDeviceInfo: {
    //   deep: true,
    //   handler: function(val, oldVal) {
    //     this.videoTabs[4].isHide = !val.monitorypointalarm
    //     this.videoTabs[6].isHide = !val.devicealarm
    //     this.videoTabs[5].isHide = !val.intelligentalarm
    //     if (val.defenseicount && val.defenseicount !== 0) {
    //       this.videoTabs[1].isHide = false
    //     } else {
    //       this.videoTabs[1].isHide = true
    //     }
    //     if (val.defenseocount && val.defenseocount !== 0) {
    //       this.videoTabs[2].isHide = false
    //     } else {
    //       this.videoTabs[2].isHide = true
    //     }
    //     if (val.intercomcount && val.intercomcount !== 0) {
    //       this.videoTabs[3].isHide = false
    //     } else {
    //       this.videoTabs[3].isHide = true
    //     }
    //   }
    // }
  },
  methods: {
    ...mapActions(['getSortData', 'getAlarmTemp', 'getAlarmLevel', 'getDeviceInfo', 'getResOfDeviceById', 'addOneResToDevice',
      'getNotOccupyChannel', 'deleteResource', 'getSingleResource', 'saveResourceInfo', 'getNotAlarmChannel',
      'addPointAlarm', 'editPointAlarm', 'deletePointAlarm', 'getOnePointAlarm', 'batchSetStreams', 'channelNameSync', 'getResIp',
      'recordLog'
    ]),
    // 点击tab
    deviceResTabClick(tab) {
      this.activeResTab = tab.obj.value
      this.activeResName = tab.obj.title
      this.activeChannelType = tab.obj.type
      this.deviceResSelectIds = []
      // this.alarmResSelectArr = []
      this.isDeviceResChecked = false
    },
    // 获取某一个设备下的资源列表
    refreshDeviceResTable(id) {
      if (id === 'notExist') {
        this.deviceAllResData = {}
        this.videoTabs[0].number = 0
        // for (let v = 0; v < this.videoTabs.length; v++) {
        //   this.videoTabs[v].number = 0
        // }
      } else {
        this.getResOfDeviceById(id).then(suc => {
          this.deviceAllResData = suc
          this.videoTabs[0].number = suc[this.videoTabs[0].value].length
          // for (let v = 0; v < this.videoTabs.length; v++) {
          //   if (suc[this.videoTabs[v].value]) {
          //     this.videoTabs[v].number = suc[this.videoTabs[v].value].length
          //   }
          // }
          // this.successMsg('数据刷新成功')
        }).catch((err) => {
          console.log('getResOfDeviceById error: ' + err)
        })
      }
      this.deviceResSelectIds = []
      // this.alarmResSelectArr = []
      this.isDeviceResChecked = false
    },
    // 资源的添加
    addDeviceRes() {
      this.isReadOnly = false
      this.isResEdit = false
      this.chanList = []
      if (this.activeResTab === 'monitoryPointAlarm' || this.activeResTab === 'intelligentAlarm') {
        // 获取未使用报警的视频通道号
        this.getNotAlarmChannel({ category: this.activeResTab, deviceId: this.deviceId }).then(suc => {
          if (suc.length === 0) {
            this.warningMsg('设备无多余通道,无法继续添加资源')
          } else {
            for (let i = 0; i < suc.length; i++) {
              this.chanList.push({ value: suc[i]._id, label: suc[i].chan })
            }
            // 添加报警
            this.addDeviceAlarmRes()
          }
        }).catch((err) => {
          console.log('getNotAlarmChannel error: ' + err)
        })
      } else if (this.activeResTab === 'deviceAlarm') {
        // 添加设备报警
        this.addDeviceAlarmRes()
      } else {
        // 获取指定设备下未占用的通道号
        this.getNotOccupyChannel({ type: this.activeChannelType, deviceId: this.deviceId }).then(suc => {
          if (suc.length === 0) {
            this.warningMsg('设备无多余通道,无法继续添加资源')
          } else {
            for (let i = 0; i < suc.length; i++) {
              this.chanList.push({ value: suc[i], label: suc[i] })
            }
            // 添加报警
            if (this.activeResTab === 'alarmInput') { this.addAlarmInput() } else if (this.activeResTab === 'alarmOutput') { this.addAlarmOutput() } else if (this.activeResTab === 'video') { this.addvideoRes() } else if (this.activeResTab === 'intercom') { this.addIntercomRes() }
          }
        }).catch((err) => {
          console.log('getNotOccupyChannel error: ' + err)
        })
      }
    },
    // 添加报警输入
    addAlarmInput() {
      this.alarmInResShow = true
      let alarmtype = ''
      let alarmtemplate = ''
      if (this.enabledSort.length !== 0) {
        alarmtype = this.enabledSort[0].value
      }
      if (this.enabledTemp.length !== 0) {
        alarmtemplate = this.enabledTemp[0].value
      }
      this.alarmInResFormData = Object.assign({}, this.alarmInResPlus, {
        eid: this.deviceId,
        type: 1,
        name: this.deviceName + '_' + this.activeResName + '_通道' + this.chanList[0].value,
        chan: this.chanList[0].value,
        alarmtemplate: alarmtemplate,
        alarmtype: alarmtype
      })
    },
    // 添加报警输出
    addAlarmOutput() {
      this.alarmOutResShow = true
      this.alarmOutResFormData = {
        eid: this.deviceId,
        type: 2,
        name: '',
        chan: '',
        alarmouttype: '0',
        durationtime: 10,
        exportdelaytime: 0
      }
    },
    // 添加视频通道 资源
    addvideoRes() {
      this.videoResShow = true
      this.videoResFormData = {
        eid: this.deviceId,
        type: this.activeChannelType,
        name: this.deviceName + '_' + this.activeResName + '_通道' + this.chanList[0].value,
        chan: this.chanList[0].value,
        monitortype: 0,
        stream: 'main',
        keycode: '',
        isprerecord: false,
        precord: 10,
        isdelayrecord: true,
        delayrecord: 30,
        monitoryPointGenera: 0 // 监控点类型  0 普通， 1 人脸抓拍， 2 车辆抓拍
      }
    },
    // 添加对讲通道 资源
    addIntercomRes() {
      this.intercomResShow = true
      this.intercomResFormData = {
        eid: this.deviceId,
        type: this.activeChannelType,
        name: this.deviceName + '_' + this.activeResName + '_通道' + this.chanList[0].value,
        chan: this.chanList[0].value
      }
    },
    // 监控点报警 资源
    addDeviceAlarmRes() {
      this.deviceAlarmShow = true
      this.deviceAlarmTitle = this.activeResName + '添加'
      let alarmtype = ''
      let alarmtemplate = ''
      if (this.enabledSort.length !== 0) {
        alarmtype = this.enabledSort[0].value
      }
      if (this.enabledTemp.length !== 0) {
        alarmtemplate = this.enabledTemp[0].value
      }
      if (this.activeResTab === 'monitoryPointAlarm' || this.activeResTab === 'intelligentAlarm') {
        this.deviceAlarmResFormData = Object.assign({}, this.alarmInResPlus, {
          // eid: this.deviceId,
          rid: this.chanList[0].value,
          chan: this.chanList[0].label,
          alarmtemplate: alarmtemplate,
          alarmtype: alarmtype,
          mapsign: { // 地图标识
            signflag: false
            // signtype: 0  // 0:图标,1:线,2:区域
          },
          type: []
        })
      } else {
        this.deviceAlarmResFormData = Object.assign({}, this.alarmInResPlus, {
          eid: this.deviceId,
          alarmtemplate: alarmtemplate,
          alarmtype: alarmtype,
          mapsign: { // 地图标识
            signflag: false
          },
          type: []
        })
      }
    },
    // 资源的修改
    openEditDeviceResInfo() {
      if (this.deviceResSelectIds.length !== 1) {
        this.$Modal.confirm({
          title: '提示',
          content: '一次只能修改一个！'
        })
        return
      }
      this.isReadOnly = false
      this.isResEdit = true
      if (this.activeResTab === 'monitoryPointAlarm' || this.activeResTab === 'intelligentAlarm' || this.activeResTab === 'deviceAlarm') {
        this.getAlarmChanType()
        this.getOnePointAlarm({ alarmChanType: this.alarmChanType, id: this.deviceResSelectIds[0] }).then(suc => {
          this.deviceAlarmTitle = this.activeResName + '修改'
          this.deviceAlarmShow = true
          this.deviceAlarmResFormData = JSON.parse(JSON.stringify(suc))
          if (this.activeResTab !== 'deviceAlarm') {
            this.deviceAlarmResFormData.rid = suc.rid._id
          }
        })
      } else {
        this.getSingleResource(this.deviceResSelectIds[0]).then(suc => {
          if (this.activeResTab === 'alarmInput') {
            this.alarmInResShow = true
            this.alarmInResFormData = Object.assign({}, this.alarmInResPlus, suc)
          } else if (this.activeResTab === 'alarmOutput') {
            this.alarmOutResShow = true
            this.alarmOutResFormData = suc
          } else if (this.activeResTab === 'video') {
            this.videoResShow = true
            this.videoResFormData = suc
          } else if (this.activeResTab === 'intercom') {
            this.intercomResShow = true
            this.intercomResFormData = suc
          }
        })
      }
    },
    modalReset(name) {
      if (this.activeResTab === 'alarmInput') {
        this.alarmInResShow = false
        this.$refs['AlarmInRes'].$refs[name].resetFields()
      } else if (this.activeResTab === 'alarmOutput') {
        this.alarmOutResShow = false
        this.$refs['AlarmOutRes'].$refs[name].resetFields()
      } else if (this.activeResTab === 'video') {
        this.videoResShow = false
        this.$refs['VideoChanRes'].$refs[name].resetFields()
      } else if (this.activeResTab === 'intercom') {
        this.intercomResShow = false
        this.$refs['DecodeVoiceRes'].$refs[name].resetFields()
      } else if (this.activeResTab === 'monitoryPointAlarm' || this.activeResTab === 'intelligentAlarm' || this.activeResTab === 'deviceAlarm') {
        this.deviceAlarmShow = false
      }
    },
    // 报警资源模态框的保存
    saveAlarmInRes(data, name) {
      let type = this.isResEdit ? '修改' : '添加'
      this.recordLog({
        logType: '管理日志',
        module: '设备管理',
        operateName: '设备' + type,
        operateContent: data.name,
        target: '视频设备-' + this.activeResName + '-' + type,
        deviceIp: data.ip
      })
      if (!this.isResEdit) {
        this.addOneResToDevice(data).then(() => {
          this.successMsg('资源添加成功')
          this.refreshDeviceResTable(this.deviceId)
          this.modalReset(name)
        }).catch((err) => {
          this.errorMsg(err)
          this.deviceResSelectIds = []
          console.log('addOneResToDevice error: ' + err)
        })
      } else {
        this.saveResourceInfo({ form: data, id: data._id }).then(() => {
          this.successMsg('资源信息修改成功')
          this.refreshDeviceResTable(this.deviceId)
          this.modalReset(name)
        }).catch((err) => {
          this.errorMsg(err)
          this.deviceResSelectIds = []
          console.log('saveResourceInfo error: ' + err)
        })
      }
    },
    // 报警资源模态框的取消
    cancelAlarmInRes(name) {
      this.modalReset(name)
    },
    // 资源的删除
    openDeviceResDelModel() {
      if (this.deviceResSelectIds.length === 0) {
        this.warningMsg('请选择所需要删除的资源')
      } else {
        this.createDeviceResDelModel()
      }
    },
    createDeviceResDelModel() {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除所选资源吗？</p>',
        onOk: () => {
          this.deviceResDelModelSave()
        },
        onCancel: () => {
          // this.deviceResSelectIds = []
        }
      })
    },
    deviceResDelModelSave() {
      let logName = []
      this.deviceResSelectIdsDel.forEach(item => {
        logName.push(item.name)
      })
      this.recordLog({
        logType: '管理日志',
        module: '设备管理',
        operateName: '设备删除',
        operateContent: logName.join(','),
        target: '解码器-解码通道-删除',
        deviceIp: this.deviceResSelectIds
      })
      if (this.activeResTab === 'monitoryPointAlarm' || this.activeResTab === 'intelligentAlarm' || this.activeResTab === 'deviceAlarm') {
        // 报警（监控点、智能、设备）
        this.getAlarmChanType()
        this.deletePointAlarm({ alarmChanType: this.alarmChanType, arrId: this.deviceResSelectIds }).then(suc => {
          this.successMsg('资源删除成功')
          this.refreshDeviceResTable(this.deviceId)
        }).catch((err) => {
          console.log('deletePointAlarm error: ' + err)
          this.errorMsg(err)
          // this.deviceResSelectIds = []
        })
      } else {
        // 普通资源删除
        this.deleteResource(this.deviceResSelectIds).then(suc => {
          this.successMsg('资源删除成功')
          this.refreshDeviceResTable(this.deviceId)
        }).catch((err) => {
          console.log('deleteResource error: ' + err)
          this.errorMsg(err)
          // this.deviceResSelectIds = []
        })
      }
    },
    // 勾选
    selectDeviceResRow(sels) {
      sels.length === 0 ? this.isDeviceResChecked = false : this.isDeviceResChecked = true
      this.deviceResSelectIds = []
      this.deviceResSelectIdsDel = []
      for (let sel of sels) {
        this.deviceResSelectIdsDel.push(sel)
        this.deviceResSelectIds.push(sel._id)
      }
    },
    // 同步通道名称
    selectChannelName() {
      if (this.deviceResSelectIds.length === 0) {
        this.warningMsg('请选择所需要同步的资源')
      } else {
        const contentText = '确认同步所选资源名称吗?'
        this.$Modal.confirm({
          title: '提示',
          content: contentText,
          onOk: () => {
            this.channelNameSync({
              syncTtype: this.channelNameSyncSelect,
              arrId: this.deviceResSelectIds
            }).then(suc => {
              this.successMsg('同步名称成功')
              this.refreshDeviceResTable(this.deviceId)
            }).catch((err) => {
              console.log('channelNameSync error: ' + err)
              this.errorMsg(err)
            })
          },
          onCancel: () => { }
        })
      }
    },
    // 批量设置主码流子码流
    selectBatchStream() {
      if (this.deviceResSelectIds.length === 0) {
        this.warningMsg('请选择所需要设置码流的资源')
      } else {
        console.log(this.channelNameSyncSelect)
        const contentText = '确认更改为所选资源码流吗?'
        this.$Modal.confirm({
          title: '提示',
          content: contentText,
          onOk: () => {
            this.batchSetStreams({
              streamType: this.batchStreamSelect,
              arrId: this.deviceResSelectIds
            }).then(suc => {
              this.successMsg('码流设置成功')
              this.refreshDeviceResTable(this.deviceId)
            }).catch((err) => {
              console.log('batchSetStreams error: ' + err)
              this.errorMsg(err)
            })
          },
          onCancel: () => { }
        })
      }
    },
    // 详情
    alarmDetails(data) {
      this.deviceAlarmTitle = this.activeResName + '详情'
      this.isResEdit = true
      this.isReadOnly = true
      this.deviceAlarmShow = true
      this.deviceAlarmResFormData = JSON.parse(JSON.stringify(data))
    },
    // 详情弹窗关闭
    confirm() {
      this.deviceAlarmShow = false
      // this.isReadOnly = false
    },
    // 监控点报警 资源 保存
    saveMonitoryAlarm(data, name) {
      this.getAlarmChanType()
      if (!this.isResEdit) {
        this.addPointAlarm({ data: data, alarmChanType: this.alarmChanType }).then(() => {
          this.successMsg('资源添加成功')
          this.refreshDeviceResTable(this.deviceId)
          this.modalReset(name)
        }).catch((err) => {
          this.errorMsg(err)
          this.deviceResSelectIds = []
          console.log('addPointAlarm error: ' + err)
        })
      } else {
        this.editPointAlarm({ data: data, alarmChanType: this.alarmChanType, id: data._id }).then(() => {
          this.successMsg('资源信息修改成功')
          this.refreshDeviceResTable(this.deviceId)
          this.modalReset(name)
        }).catch((err) => {
          this.errorMsg(err)
          this.deviceResSelectIds = []
          console.log('editPointAlarm error: ' + err)
        })
      }
    },
    // 三种报警（监控点、智能、设备）字段统一处理
    getAlarmChanType() {
      if (this.activeResTab === 'monitoryPointAlarm') {
        this.alarmChanType = 'monitorypointalarm'
      } else if (this.activeResTab === 'intelligentAlarm') {
        this.alarmChanType = 'intelligentalarm'
      } else if (this.activeResTab === 'deviceAlarm') {
        this.alarmChanType = 'devicealarm'
      }
    },
    // 视频通道刷新获取设备IP(即通道IP)
    refreshGetIp() {
      if (this.activeResTab === 'video') {
        if (this.deviceId === 'notExist') {
          this.deviceAllResData = {}
          this.videoTabs[0].number = 0
          // for (let v = 0; v < this.videoTabs.length; v++) {
          //   this.videoTabs[v].number = 0
          // }
        } else {
          this.getResIp(this.deviceId).then(suc => {
            this.getResOfDeviceById(this.deviceId).then(suc => {
              this.deviceAllResData = suc
              this.videoTabs[0].number = suc[this.videoTabs[0].value].length
              // for (let v = 0; v < this.videoTabs.length; v++) {
              //   if (suc[this.videoTabs[v].value]) {
              //     this.videoTabs[v].number = suc[this.videoTabs[v].value].length
              //   }
              // }
            }).catch((err) => {
              console.log('getResOfDeviceById error: ' + err)
            })
          }).catch((err) => {
            console.log('getResIp error: ' + err)
          })
        }
        this.deviceResSelectIds = []
        // this.alarmResSelectArr = []
        this.isDeviceResChecked = false
      } else {
        this.refreshDeviceResTable(this.deviceId)
      }
    }
  }
}
</script>
<style scoped>
.table-header-actions {
  height: 50px;
  padding: 0 10px;
  background-color: #1c3054;
  margin: 0;
}
/*按钮和inpu框*/
.actions-btn {
  width: 100%;
  float: left;
  margin-top: 10px;
}
.actions-btn .ivu-btn {
  margin-right: 10px;
  /*height: 32px;
  padding: 0 10px;*/
}
.actions-btn .ivu-select {
  margin-right: 10px;
}
/*视频通道弹出框样式*/
.res-add-form {
  /*margin-top: 20px;*/
  padding: 0px 10px;
}
.res-add-form .check-input .ivu-col-span-8 {
  width: 100px;
  height: 32px;
  line-height: 32px;
}
.res-add-form .check-input .ivu-col-span-16 {
  width: 296px;
  height: 56px;
}
.formTip {
  display: inline-block;
  color: red;
  height: 24px;
  line-height: 24px;
}
.check-input .ivu-col-span-16 input {
  display: inline-block;
  width: 100%;
  height: 32px;
  line-height: 1.5;
  padding: 4px 7px;
  font-size: 12px;
  border: 1px solid #5676a9;
  border-radius: 4px;
  color: #ffffff;
  background-color: #1c3053;
  cursor: text;
  transition: border 0.2s ease-in-out, background 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
  outline: none;
}
.check-input .ivu-col-span-16 input:hover {
  border: 1px solid #33b7e9;
}
.check-input .ivu-col-span-16 input:focus {
  border: 1px solid #33b7e9;
}
.check-input .ivu-col-span-16 .redBorder {
  border: 1px solid red;
}
.check-input .ivu-col-span-16 .redBorder:hover {
  border: 1px solid red;
}
.check-input .ivu-col-span-16 .redBorder:focus {
  border: 1px solid red;
}
.table-relative {
  position: relative;
}
.table-body {
  width: 100%;
  position: absolute;
}
</style>
