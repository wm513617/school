<template>
  <!--报警联动配置模态框-->
  <Modal v-model="alarmLink" title="联动配置" width="999" :mask-closable="false" @on-visible-change="$emit('close')">
    <Tabs type="card" v-model="itemIndex">
      <Tab-pane label="联动动作" name="0"></Tab-pane>
      <Tab-pane label="联动规则1" name="1"></Tab-pane>
      <Tab-pane label="联动规则2" name="2"></Tab-pane>
      <Tab-pane label="联动规则3" name="3"></Tab-pane>
      <Tab-pane label="联动规则4" name="4"></Tab-pane>
    </Tabs>
    <div class="link-main" v-show="itemIndex==='0'">
      <Form :model="linkData" label-position="left" :label-width="80" style="padding: 0 10px;width:330px;">
        <div v-if="isOne">
          <Form-item label="报警名称：">
            <p>{{resData.name}}</p>
          </Form-item>
        </div>
        <Form-item label="联动动作：">
          <Select v-model="linkOption">
            <Option v-for="item in linkActions" :key="item.value" :value="item.value">{{item.label}}</Option>
          </Select>
        </Form-item>
      </Form>
      <!--联动视频-->
      <div v-show="linkOption === 0" style="padding: 0 10px;display:flex;">
        <div>
          <div class="operation-btn">
            <div class="lf">选择视频源:</div>
            <div class="rt">
              <Checkbox v-model="isShowOther" @on-change="getTreeList">显示其他机构</Checkbox>
              <Button style="width: 70px;" type="ghost" @click="addVideoConfig">添加</Button>
            </div>
          </div>
          <Input v-model="searchVal" placeholder="按名称模糊查询" style="margin: 10px 0;" />
          <div class="org-tree">
            <bs-scroll ref="videoTreeScroll" style="width:100%;height:100%;overflow:auto;">
              <Tree-Search :treeData="videoTree" ref="videoTree" :searchVal="searchVal" isSearch isOnlyLeaf isFuzzy  @on-expand="videoTreeExpand" showCheckbox>
                <template slot-scope="{ node }">
                  <span :class="{'item': true, 'offline': (!node.nodeId && node.eid && node.status !== 1)}" :title="node.name">
                    <i class="iconfont" :class="[getNodeIcon(node).class]" :title="getNodeIcon(node).title"></i>
                    {{node.name}}
                  </span>
                </template>
              </Tree-Search>
              <!-- <bsr-tree :treeData="videoTree" ref="videoTree" @on-expand="videoTreeExpand" showCheckbox>
                <template slot-scope="{ node }">
                  <span :class="{'item': true, 'offline': (!node.nodeId && node.eid && node.status !== 1)}" :title="node.name">
                    <i class="iconfont" :class="[getNodeIcon(node).class]" :title="getNodeIcon(node).title"></i>
                    {{node.name}}
                  </span>
                </template>
              </bsr-tree> -->
            </bs-scroll>
          </div>
        </div>
        <div class="infor-list">
          <div class="infor-del">
            <Button style="width: 70px;" type="ghost" @click="delVideoConfig">删除</Button>
          </div>
          <div class="model-table">
            <Table border height="180" :columns="inforTitle" :data="linkData.actionVideo" size="small" @on-selection-change="alarmInSel"></Table>
          </div>
          <div v-if="cloudControl" style="width: 350px;">
            <div style="margin: 24px 0;">
              云台联动配置：
            </div>
            <div>
              <Form label-position="right" :label-width="120">
                <FormItem label="选择联动方式">
                  <Select v-model="cloudAction" @on-change="changeCloud">
                    <Option v-for="item in cloudActionList" :key="item.value" :value="item.value">{{item.label}}</Option>
                  </Select>
                </FormItem>
                <FormItem label="选择联动内容">
                  <Select v-model="cloudContent">
                    <Option v-for="item in cloudContentList[cloudAction]" :key="item" :value="item">{{item}}</Option>
                  </Select>
                </FormItem>
              </Form>
              <div style="text-align:right;">
                <Button style="width: 70px;" type="ghost"  @click="saveCloud">保存</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--联动报警输出-->
      <div v-show="linkOption === 1" style="padding: 0 10px;display:flex;">
        <div>
          <div class="operation-btn">
            <div class="lf">选择报警输出:</div>
            <div class="rt">
              <Checkbox v-model="isShowOther" @on-change="getTreeList">显示其他机构</Checkbox>
              <Button style="width: 70px;" type="ghost" @click="addExportConfig">添加</Button>
            </div>
          </div>
          <Input v-model="searchVal" placeholder="按名称模糊查询" style="margin: 10px 0;" />
          <div class="org-tree">
            <bs-scroll ref="linkOutScroll" style="width:100%;height: 100%;overflow: auto;">
              <Tree-Search :treeData="videoTree" ref="exportTree" :searchVal="searchVal" isSearch isOnlyLeaf isFuzzy  @on-expand="exportTreeExpand" showCheckbox>
                <template slot-scope="{ node }">
                  <span :class="{'item': true, 'offline': (!node.nodeId && node.eid && node.status !== 1)}" :title="node.name">
                    <i class="iconfont" :class="[getNodeIcon(node).class]" :title="getNodeIcon(node).title"></i>
                    {{node.name}}
                  </span>
                </template>
              </Tree-Search>
              <!-- <bsr-tree :treeData="videoTree" ref="exportTree" @on-expand="exportTreeExpand" showCheckbox>
                <template slot-scope="{ node }">
                  <span :class="{'item': true, 'offline': (!node.nodeId && node.eid && node.status !== 1)}" :title="node.name">
                    <i class="iconfont" :class="[getNodeIcon(node).class]" :title="getNodeIcon(node).title"></i>
                    {{node.name}}
                  </span>
                </template>
              </bsr-tree> -->
            </bs-scroll>
          </div>
        </div>
        <div class="infor-list">
          <div class="infor-del">
            <Button style="width: 70px;" type="ghost" @click="delExportConfig">删除</Button>
          </div>
          <div class="model-table">
            <Table border height="180" :columns="linkOut" :data="linkData.actionOutCtl" size="small" @on-selection-change="alarmInSel"></Table>
          </div>
        </div>
      </div>
      <!-- 联动邮件 -->
      <div v-show="linkOption === 2" style="padding: 0 10px;width:600px;">
        <Form label-position="left" :label-width="80">
          <FormItem label="收件人：">
            <Input v-model="linkData.actionEmail.receiver"></Input>
          </FormItem>
          <FormItem label="内容：">
            <Input type="textarea" :autosize="{minRows: 10, maxRows: 10}" v-model="linkData.actionEmail.content"></Input>
          </FormItem>
        </Form>
        <!-- <div style="text-align:right;">
          <Button style="width: 70px;" type="ghost" @click="saveLinkEmail">保存</Button>
        </div> -->
      </div>
      <!-- 联动电视墙 -->
      <div v-show="linkOption === 3" style="padding: 0 10px;width:600px;">
        <Form label-position="right" :label-width="132">
          <FormItem label="联动电视墙格局设置："></FormItem>
          <FormItem label="选择电视墙：">
            <Select v-model="tvValue" @on-change="getSceneList">
              <Option v-for="(item, index) in tvwallList" :value="item.value" :key="index">{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem label="选择联动场景：">
            <Select v-model="scene">
              <Option v-for="(item, index) in sceneList" :value="item.value" :key="index">{{item.label}}</Option>
            </Select>
          </FormItem>
        </Form>
        <div style="text-align:right;margin-top:156px;">
          <!-- <Button style="width: 70px;" type="ghost" @click="saveLinkWall">保存</Button> -->
        </div>
      </div>
    </div>
    <div v-for="(actionForList,index) in linkData.actionRule" :key="index">
      <div v-show="itemIndex===(index+1).toString()">
        <div class="pane-style">
          <Checkbox v-model="actionForList.status">启用</Checkbox>
          <Form label-position="left" :label-width="80" class="form-rule">
            <Form-item label="时间段">
              <Time-picker type="timerange" placement="bottom-end" placeholder="选择时间" :clearable="false" :editable="false" @on-change="editTime" :value="actionForList.timeRange" style="width: 350px"></Time-picker>
            </Form-item>
            <Form-item label="执行动作">
              <div class="do-action">
                <Checkbox v-model="actionForList.actionVideo">联动视频</Checkbox>
                <Checkbox v-model="actionForList.actionOutPut">报警输出</Checkbox>
                <Checkbox v-model="actionForList.actionEmail">联动邮件</Checkbox>
                <Checkbox v-model="actionForList.actionWall">联动电视墙</Checkbox>
              </div>
            </Form-item>
          </Form>
        </div>
      </div>
    </div>
    <div slot="footer">
      <Button type="ghost" @click="$emit('close')">取消</Button>
      <Button type="primary" @click="sureConfig">确定</Button>
    </div>
  </Modal>
</template>

<script>
import { toSecond, toHour } from './allJs/alarmFun.js'
// import { getNodeIcon } from 'components/BStree/commonMethods.js'
import { getNodeIcon } from 'components/BStreeNew/commonMethods.js'
import { mapActions } from 'vuex'
export default {
  props: {
    model: {
      type: Boolean,
      default: false
    },
    rootOrgId: { // 跟机构id
      type: String,
      default: ''
    },
    activeOrgId: { // 当前id
      type: String,
      default: ''
    },
    resData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    type: {
      type: String,
      default: 'resource'
    },
    isOne: { // 用于 消防报警 批量配置
      type: Boolean,
      default: true
    },
    ids: { // 消防报警 批量配置 选中资源 id
      type: String,
      default: ''
    }
  },
  data() {
    return {
      searchVal: '',
      alarmLink: this.model,
      itemIndex: '0',
      linkActions: [
        {label: '联动视频', value: 0},
        {label: '联动报警输出', value: 1},
        {label: '联动邮件', value: 2},
        {label: '联动电视墙', value: 3}
      ],
      linkOption: 0,
      isShowOther: false,
      options: {
        showCheckbox: true,
        showInput: true
      },
      channelTypes: '', // 区分 视频树 与 报警输出树
      videoTree: {},
      cloudControl: false, // 云台高级控制
      cloudIndex: 0, // 配置云台 联动镜头索引
      linkData: {
        actionVideo: [],
        actionOutCtl: [],
        actionEmail: {
          receiver: '',
          content: ''
        },
        actionWall: null,
        actionRule: [{
          status: false,
          beginTime: 0,
          endTime: 86399,
          timeRange: ['00:00:00', '23:59:59'],
          actionVideo: true,
          actionOutPut: false,
          actionEmail: false,
          actionWall: false
        }, {
          status: false,
          beginTime: 0,
          endTime: 86399,
          timeRange: ['00:00:00', '23:59:59'],
          actionVideo: true,
          actionOutPut: true,
          actionEmail: true,
          actionWall: true
        }, {
          status: false,
          beginTime: 0,
          endTime: 86399,
          timeRange: ['00:00:00', '23:59:59'],
          actionVideo: true,
          actionOutPut: true,
          actionEmail: true,
          actionWall: true
        }, {
          status: false,
          beginTime: 0,
          endTime: 86399,
          timeRange: ['00:00:00', '23:59:59'],
          actionVideo: true,
          actionOutPut: true,
          actionEmail: true,
          actionWall: true
        }]
      },
      actionRule: [{
        status: false,
        beginTime: 0,
        endTime: 86399,
        timeRange: ['00:00:00', '23:59:59'],
        actionVideo: true,
        actionOutPut: false,
        actionEmail: false,
        actionWall: false
      }, {
        status: false,
        beginTime: 0,
        endTime: 86399,
        timeRange: ['00:00:00', '23:59:59'],
        actionVideo: true,
        actionOutPut: true,
        actionEmail: true,
        actionWall: true
      }, {
        status: false,
        beginTime: 0,
        endTime: 86399,
        timeRange: ['00:00:00', '23:59:59'],
        actionVideo: true,
        actionOutPut: true,
        actionEmail: true,
        actionWall: true
      }, {
        status: false,
        beginTime: 0,
        endTime: 86399,
        timeRange: ['00:00:00', '23:59:59'],
        actionVideo: true,
        actionOutPut: true,
        actionEmail: true,
        actionWall: true
      }],
      inforTitle: [{
        type: 'selection',
        width: 40,
        align: 'center'
      }, {
        title: '监控点名称',
        width: 150,
        align: 'center',
        key: 'channelName',
        render: (h, params) => {
          return h('span', {
            style: {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            },
            domProps: {
              title: params.row.channelName
            }
          }, params.row.channelName)
        }
      }, {
        title: '主摄像机',
        key: 'Cameras',
        align: 'center',
        width: 70,
        render: (h, params) => {
          return h('div', [
            h('Radio', {
              props: {
                value: params.row.mainCamera
              },
              nativeOn: {
                click: (v) => {
                  this.isCameras()
                  this.$set(this.linkData.actionVideo[params.index], 'mainCamera', true)
                }
              }
            })
          ])
        }
      }, {
        title: '客户端',
        align: 'center',
        width: 60,
        key: 'client',
        render: (h, params) => {
          return h('div', [
            h('Checkbox', {
              props: {
                value: params.row.client
              },
              on: {
                'on-change': () => {
                  this.$set(this.linkData.actionVideo[params.index], 'client', !params.row.client)
                }
              }
            })
          ])
        }
      }, {
        title: '录像',
        align: 'center',
        width: 60,
        key: 'video',
        render: (h, params) => {
          return h('div', [
            h('Checkbox', {
              props: {
                value: params.row.record
              },
              on: {
                'on-change': () => {
                  this.$set(this.linkData.actionVideo[params.index], 'record', !params.row.record)
                }
              }
            })
          ])
        }
      }, {
        title: '电子地图',
        align: 'center',
        width: 70,
        key: 'map',
        render: (h, params) => {
          return h('div', [
            h('Checkbox', {
              props: {
                value: params.row.electronicMap
              },
              on: {
                'on-change': () => {
                  this.$set(this.linkData.actionVideo[params.index], 'electronicMap', !params.row.electronicMap)
                }
              }
            })
          ])
        }
      }, {
        title: '云台',
        align: 'center',
        width: 80,
        key: 'cloud',
        render: (h, params) => {
          return h('div', [
            h('Checkbox', {
              props: {
                value: params.row.cloud.status
              },
              style: {
                'vertical-align': 'middle',
                'margin-right': '8px'
              },
              on: {
                'on-change': () => {
                  this.linkData.actionVideo[params.index].cloud.status = !params.row.cloud.status
                }
              }
            }), h('a', {
              style: {
                'text-decoration': 'underline',
                color: '#4699f9'
              },
              on: {
                click: () => {
                  console.log(params.row, 22)
                  this.cloudAction = params.row.cloud.actionDetail ? JSON.parse(params.row.cloud.actionDetail).ctrlCmdEnum : this.cloudActionList[0].value
                  this.cloudContent = params.row.cloud.actionDetail ? JSON.parse(params.row.cloud.actionDetail).presetIndex || JSON.parse(params.row.cloud.actionDetail).route : 1
                  this.cloudIndex = params.index
                  this.cloudControl = true
                }
              }
            }, '高级')
          ])
        }
      }, {
        title: '电视墙',
        align: 'center',
        width: 60,
        key: 'tvWall',
        render: (h, params) => {
          return h('div', [
            h('Checkbox', {
              props: {
                value: params.row.videoWall
              },
              on: {
                'on-change': () => {
                  this.$set(this.linkData.actionVideo[params.index], 'videoWall', !params.row.videoWall)
                }
              }
            })
          ])
        }
      }],
      cloudAction: '',
      cloudContent: '',
      cloudActionList: [ // 云台联动方式
        {label: '预置位', value: 'gotoPreset'},
        {label: '巡航', value: 'runSeq'},
        {label: '轨迹', value: 'runCruise'}
      ],
      cloudContentList: { // 云台联动内容
        'gotoPreset': 255,
        'runSeq': 8,
        'runCruise': 5
      },
      wayOptions: [{
        value: 0,
        label: '手动'
      }, {
        value: 1,
        label: '自动'
      }],
      actionOptions: [{
        value: 0,
        label: '打开'
      }, {
        value: 1,
        label: '关闭'
      }],
      linkOut: [
        {
          type: 'selection',
          width: 40,
          align: 'center'
        },
        {
          title: '报警输出名称',
          width: 150,
          key: 'outPutName',
          align: 'center'
        },
        {
          title: '执行方式',
          width: 150,
          key: 'runMode',
          align: 'center',
          render: (h, params) => {
            return h('Select', {
              props: {
                value: params.row.runMode
              },
              on: {
                'on-change': (v) => {
                  this.$set(this.linkData.actionOutCtl[params.index], 'runMode', v)
                }
              }
            }, this.wayOptions.map(v => {
              return h('Option', {
                props: {
                  value: v.value,
                  key: v.value
                }
              }, v.label)
            }))
          }
        },
        {
          title: '执行动作',
          width: 150,
          key: 'runAction',
          align: 'center',
          render: (h, params) => {
            return h('Select', {
              props: {
                value: params.row.runAction
              },
              on: {
                'on-change': (v) => {
                  this.$set(this.linkData.actionOutCtl[params.index], 'runAction', v)
                }
              }
            }, this.actionOptions.map(v => {
              return h('Option', {
                props: {
                  value: v.value,
                  key: v.value
                }
              }, v.label)
            }))
          }
        },
        {
          title: '叠加图标',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Checkbox', {
                props: {
                  value: params.row.overlayIcon
                },
                on: {
                  'on-change': (v) => {
                    this.$set(this.linkData.actionOutCtl[params.index], 'overlayIcon', v)
                  }
                }
              })
            ])
          }
        }
      ],
      Inselect: [],
      tvValue: '',
      scene: '', // 电视墙场景
      tvwallList: [], // 电视墙列表
      sceneList: [], // 电视墙场景列表
      receiver: '', // 联动邮件接收人
      emailContent: '' // 邮件内容
    }
  },
  watch: {
    linkOption: {
      handler(val) {
        if (val === 0) {
          this.isShowOther = false
          this.channelTypes = '0'
          this.getTreeList()
        } else if (val === 1) {
          this.isShowOther = false
          this.channelTypes = '2,10'
          this.getTreeList()
        } else if (val === 2) {
          this.receiver = this.linkData.actionEmail ? this.linkData.actionEmail.receiver : ''
          this.emailContent = this.linkData.actionEmail ? this.linkData.actionEmail.content : ''
        } else if (val === 3) {
          this.sceneList = []
          this.tvValue = this.linkData.actionWall ? this.linkData.actionWall.wall : this.tvwallList[0].value
          this.getTvWallSceneList(this.tvValue).then(res => {
            const sceneList = res.data
            sceneList.forEach(item => {
              if (item.name !== '实时场景') {
                this.sceneList.push({label: item.name, value: item._id})
              }
            })
            this.scene = this.linkData.actionWall ? this.linkData.actionWall.scene : (this.sceneList[0] ? this.sceneList[0].value : '')
          }).catch(() => {
            this.warningMsg('获取电视墙场景失败')
          })
        }
      },
      immediate: true
    }
  },
  created() {
    this.getTvwallInfoList()
    if (this.isOne) {
      this.getResLinkAction()
    }
  },
  methods: {
    ...mapActions(['getDeviceTreeData', 'getTvWallList', 'getTvWallSceneList', 'getLinkActionData', 'saveLinkActionData', 'saveMoreLinkActionData']),
    getNodeIcon(item) {
      return getNodeIcon(item)
    },
    videoTreeExpand() {
      this.$refs.videoTreeScroll.update()
    },
    exportTreeExpand() {
      this.$refs.linkOutScroll.update()
    },
    // 获取 树
    getTreeList() {
      this.searchVal = ''
      let param = {
        orgtype: 0,
        channelTypes: this.channelTypes,
        never: this.isShowOther ? -1 : 0,
        oid: this.isShowOther ? this.rootOrgId : this.activeOrgId
      }
      if (this.isOne) {
        param.resId = this.resData._id
      }
      this.getDeviceTreeData(param).then(res => {
        this.videoTree = res.data
        this.$refs.videoTree.$refs.bsrtree.checkedIds = []
        this.$refs.exportTree.$refs.bsrtree.checkedIds = []
      }).catch(() => {
        this.warningMsg('获取资源树失败')
      })
    },
    // 获取 电视墙
    getTvwallInfoList() {
      this.getTvWallList().then(res => {
        const wallList = res.data
        wallList.forEach(item => {
          this.tvwallList.push({label: item.name, value: item._id, id: item._id})
        })
      }).catch(() => {
        this.warningMsg('获取电视墙失败')
      })
    },
    // 获取 电视墙 场景
    getSceneList() {
      this.sceneList = []
      this.getTvWallSceneList(this.tvValue).then(res => {
        const sceneList = res.data
        sceneList.forEach(item => {
          if (item.name !== '实时场景') {
            this.sceneList.push({label: item.name, value: item._id})
          }
        })
        this.$nextTick(() => {
          this.scene = this.sceneList.length ? this.sceneList[0].value : ''
        })
      }).catch(() => {
        this.warningMsg('获取电视墙场景失败')
      })
    },
    // 获取 该资源 联动配置
    getResLinkAction() {
      this.getLinkActionData(this.resData._id).then(res => {
        const data = res.data
        if (data) {
          this.linkData.actionVideo = data.actionVideo || []
          this.linkData.actionOutCtl = data.actionOutCtl || []
          this.linkData.actionEmail = data.actionEmail || this.linkData.actionEmail
          this.linkData.actionWall = data.actionWall || null
          this.linkData.actionRule = (data.actionRule && data.actionRule.length) ? data.actionRule : this.actionRule
          this.linkData.actionRule.forEach((item, index) => {
            item.timeRange = toHour(item.beginTime, item.endTime)
          })
        }
        // this.linkData = res.data
        console.log(this.linkData)
      }).catch(() => {
        this.warningMsg('获取联动配置失败')
      })
    },
    editTime(time) {
      let beginTime = time[0]
      let endTime = time[1]
      let timeSec = toSecond(beginTime, endTime)
      let index = Number(this.itemIndex) - 1
      this.linkData.actionRule[index].beginTime = timeSec[0]
      this.linkData.actionRule[index].endTime = timeSec[1]
    },
    // 数据为undefined，则范围空字符串
    returnBlankIfNull(item, key) {
      return item === undefined ? '' : item[key]
    },
    isCameras() {
      let isCameras = this.linkData.actionVideo
      isCameras.map(v => {
        v.mainCamera = false
      })
    },
    alarmInSel(selection) {
      this.Inselect = selection
    },
    // 联动——添加联动视频控制
    addVideoConfig() {
      let treeData = this.$refs.videoTree.getSelectedNodes()
      if (treeData.length !== 0) {
        let idInfo = []
        let count = 0
        let doubleName = []
        idInfo = treeData.filter(node => !node.isOrg).filter(node => !node.equip).filter(node => node.isrooot === undefined)
        if (idInfo.length === 0) {
          this.warningMsg('请勿勾选机构，应选择视频资源')
          count = 0
          return
        }
        count = idInfo.length
        let alllength = count + this.linkData.actionVideo.length
        if (alllength > 7) {
          this.warningMsg('最多仅可添加7个联动视频')
          count = 0
        } else {
          idInfo.map((v) => {
            let orgName = this.searchOrg(v.pid)
            let Vid = v._id
            let videoSet = {
              channelName: v.name,
              mainCamera: false,
              client: true,
              videoWall: true,
              electronicMap: true,
              record: true,
              cloud: {
                status: false
              },
              resource: Vid,
              orgId: v.pid,
              orgName: orgName
            }
            if (this.linkData.actionVideo.length === 0) {
              this.linkData.actionVideo.push(videoSet)
            } else {
              const result = this.linkData.actionVideo.some((item, index) => {
                return Vid === item.resource
              })
              if (!result) {
                this.linkData.actionVideo.push(videoSet)
              } else {
                doubleName.push(v.name)
              }
            }
            this.$refs.videoTree.$refs.bsrtree.checkedIds = []
          })
          if (doubleName.length !== 0) {
            this.$Notice.warning({
              title: '提示',
              desc: doubleName.join(',') + '  已添加，不能重复添加',
              top: 200
            })
          }
          count = 0
        }
      } else {
        this.warningMsg('请先选择视频资源')
      }
    },
    // 联动——删除联动视频控制
    delVideoConfig() {
      this.Inselect.map(item => {
        const result = this.linkData.actionVideo.some((Item) => {
          return item.resource === Item.resource
        })
        if (result) {
          this.linkData.actionVideo.map((Item, index) => {
            if (Item.resource === item.resource) {
              this.linkData.actionVideo.splice(index, 1)
            }
          })
        }
      })
      this.Inselect = []
    },
    // 1-8.联动——添加报警输出控制
    addExportConfig() {
      let treeData = this.$refs.exportTree.getSelectedNodes()
      if (treeData.length !== 0) {
        let count = 0
        let InvalidExport = []
        let doubleName = []
        InvalidExport = treeData.filter(node => !node.isOrg).filter(node => !node.equip)
        if (InvalidExport.length === 0) {
          this.warningMsg('请勿勾选机构，应选择视频资源')
          count = 0
          return
        }
        count = InvalidExport.length
        let alllength = count + this.linkData.actionOutCtl.length
        if (alllength > 7) {
          this.warningMsg('最多添加7个联动视频')
          count = 0
        } else {
          InvalidExport.map((v) => {
            let videoSet = {
              resource: v._id,
              outPutName: v.name,
              runMode: 0,
              runAction: 0,
              overlayIcon: false,
              outPutOrg: v.pid
            }
            if (this.linkData.actionOutCtl.length === 0) {
              this.linkData.actionOutCtl.push(videoSet)
            } else {
              const result = this.linkData.actionOutCtl.some((item, index) => {
                return v._id === item.resource
              })
              if (!result) {
                this.linkData.actionOutCtl.push(videoSet)
              } else {
                doubleName.push(v.name)
              }
            }
            this.$refs.exportTree.$refs.bsrtree.checkedIds = []
          })
          if (doubleName.length !== 0) {
            this.$Notice.warning({
              title: '提示',
              desc: doubleName.join(',') + '  已添加，不能重复添加',
              top: 200
            })
          }
          count = 0
        }
      } else {
        this.warningMsg('请先选择视频资源')
      }
    },
    // 删除 报警输出控制
    delExportConfig() {
      this.Inselect.map(item => {
        const result = this.linkData.actionOutCtl.some((Item) => {
          return item.resource === Item.resource
        })
        if (result) {
          this.linkData.actionOutCtl.map((Item, index) => {
            if (Item.resource === item.resource) {
              this.linkData.actionOutCtl.splice(index, 1)
            }
          })
        }
      })
      this.Inselect = []
    },
    // 查找父机构名称
    searchOrg(data) {
      const videoTree = [this.videoTree]
      let orgName
      let searchChild = (child) => {
        child.map((v) => {
          if (data === v._id) {
            orgName = v.name
          } else {
            if (v.children) {
              searchChild(v.children)
            }
          }
        })
      }
      searchChild(videoTree)
      return orgName
    },
    changeCloud() {
      this.cloudContent = 1
    },
    // 保存云台配置
    saveCloud() {
      let actions = {}
      if (this.cloudAction === 'gotoPreset') {
        actions = {ctrlCmdEnum: 'gotoPreset', presetIndex: this.cloudContent}
      } else {
        actions = {ctrlCmdEnum: this.cloudAction, route: this.cloudContent}
      }
      this.$set(this.linkData.actionVideo[this.cloudIndex].cloud, 'actionDetail', JSON.stringify(actions))
      // this.linkData.actionVideo[this.cloudIndex].cloud.actionDetail = JSON.stringify(actions)
      console.log(this.linkData.actionVideo[this.cloudIndex].cloud, 11)
      this.cloudControl = false
    },
    // 保存 联动邮件
    // saveLinkEmail() {
    //   this.linkData.actionEmail = {
    //     receiver: this.receiver,
    //     content: this.emailContent
    //   }
    // },
    // 保存 联动电视墙
    // saveLinkWall() {
    //   this.linkData.actionWall = {
    //     wall: this.tvValue,
    //     scene: this.scene
    //   }
    // },
    // 确定
    sureConfig() {
      this.linkData.actionWall = this.scene && {
        wall: this.tvValue,
        scene: this.scene
      }
      let crossStatus = this.crossTime()
      if (!crossStatus) { return }
      if (this.isOne) {
        let param = {
          id: this.resData._id,
          body: {
            config: this.type,
            ...this.linkData
          }
        }
        if (this.type === 'lane') {
          param.body.spare = this.resData.devChnId
          param.body.resource = this.resData._id
          param.body.type = 8
        }
        this.saveLinkActionData(param).then(res => {
          this.$emit('refrash')
          this.$emit('close')
        }).catch(err => {
          console.log(err)
          this.warningMsg('报警联动配置失败')
        })
      } else {
        let param = {
          ids: this.ids,
          body: {
            ...this.linkData
          }
        }
        this.saveMoreLinkActionData(param).then(res => {
          this.$emit('refrash')
          this.$emit('close')
        }).catch(err => {
          console.log(err)
          this.warningMsg('报警联动配置失败')
        })
      }
    },
    // 判断 联动规则 时间是否有交叉
    crossTime() {
      let timeArr = this.linkData.actionRule
      console.log(timeArr)
      let timeTrue = []
      timeArr.map((item, index) => {
        if (item.status === true) {
          timeTrue.push({
            startTime: item.beginTime,
            endTime: item.endTime
          })
        }
      })
      const erArr = []
      const set = new Set()
      timeTrue.forEach(n => {
        if (n.startTime !== null && n.endTime !== null) {
          set.add(n.startTime)
          set.add(n.endTime)
          erArr.push([n.startTime, n.endTime])
        }
      })
      const sortArr = Array.from(set).sort((a, b) => a - b)
      let flag = true
      if (sortArr.length !== timeTrue.length * 2) {
        flag = false
      } else {
        for (let i = 0; i < erArr.length; i++) {
          if (sortArr.indexOf(erArr[i][1]) - sortArr.indexOf(erArr[i][0]) > 1) {
            flag = false
            break
          }
        }
      }
      if (!flag) {
        this.warningMsg('联动时间有交叉,请修改时间')
      }
      return flag
    }
  }
}
</script>

<style scoped lang='less'>
.operation-btn {
  height: 38px;
  border-bottom: 2px solid #909090;
}

.operation-btn > div:first-child {
  font-size: 14px;
  height: 32px;
  line-height: 32px;
}
.org-tree {
  width: 330px;
  height: 450px;
  overflow: auto;
}
.infor-del {
  height: 40px;
  width: 100%;
}
.model-table {
  width: 100%;
  overflow: auto;
  border: 1px solid #5d5d5d;
}
.infor-list {
  margin-left: 12px;
}
.pane-style {
  padding: 0 10px;
}
.form-rule {
  margin-top: 15px;
}
.do-action {
  min-height: 300px;
  padding-left: 20px;
}
</style>
<style>
.link-main table .ivu-table-cell {
  padding-left: 0;
  padding-right: 0;
}
.link-main .ivu-checkbox-wrapper {
  margin-right: 0;
}
</style>
