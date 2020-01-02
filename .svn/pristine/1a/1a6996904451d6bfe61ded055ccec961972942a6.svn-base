<template>
  <div class="bs-main">
    <!-- 资源添加弹出框 -->
    <div v-if="resAddModal">
      <Modal :mask-closable="false" v-model="resAddModal" title="资源分配" width="450">
        <div class="res-add-model">
          <p>选择机构资源，将资源添加到当前机构下</p>
          <div class="res-model-tree" v-if="resAddModal === true">
            <bs-scroll ref="scroller">
              <VTree @on-expand="$refs.scroller.update()" ref="resTree" :treeData="resAddTreeData" :options="resAddTreeOptions">
              </VTree>
            </bs-scroll>
          </div>
        </div>
        <div slot="footer">
          <Button type="ghost" @click="resAddCancel">取消</Button>
          <Button type="primary" @click="resAddSave" :loading="modalloading">确认</Button>
        </div>
      </Modal>
    </div>
    <!-- 资源移动弹出框 -->
    <div v-if="resMoveModal">
      <Modal :mask-closable="false" v-model="resMoveModal" title="资源移动" width="450">
        <div class="res-add-model">
          <p>选择机构,将资源移动到当前机构下</p>
          <div class="res-model-tree">
            <bs-scroll ref="scroller">
              <VTree @on-expand="$refs.scroller.update()" :treeData="resMoveTreeData" :options="resMoveTreeOptions" @node-click="selectMoveOrg" :activeId="resMoveOrgId">
              </VTree>
            </bs-scroll>
          </div>
        </div>
        <div slot="footer">
          <Button type="ghost" @click="resMoveCancel">取消</Button>
          <Button type="primary" @click="resMoveSave" :loading="modalloading">确认</Button>
        </div>
      </Modal>
    </div>
    <!-- 资源修改弹出框 -->
    <div v-if="resEditModal">
      <Modal v-model="resEditModal" :mask-closable="false" title="通道编辑" width="450">
        <div class="res-edit-form">
          <Form label-position="left" :label-width="100" :model="resEditFormData" ref="resEditForm" :rules="resFormRole">
            <Form-item label="所属设备">
              {{ resEditFormInfo.deviceName }}
            </Form-item>
            <Form-item label="通道号">
              {{ resEditFormData.chan }}
            </Form-item>
            <Form-item label="所属机构">
              <Input v-model="resEditFormInfo.orgName" disabled></Input>
            </Form-item>
            </Form-item>
            <Form-item label="通道名称" prop="name">
              <Input v-model="resEditFormData.name"></Input>
            </Form-item>
            <Form-item label="监控点类型">
              <Select v-model="resEditFormData.monitortype">
                <Option v-for="opt in monitortypeOpts" :value="opt.value" :key="opt.value">{{ opt.label }}</Option>
              </Select>
            </Form-item>
            <Form-item label="实时视频码流">
              <Select v-model="resEditFormData.stream">
                <Option v-for="opt in streamOpts" :value="opt.value" :key="opt.value">{{ opt.label }}</Option>
              </Select>
            </Form-item>
            <Form-item label="键盘控制号" prop="keycode">
              <Input v-model="resEditFormData.keycode"></Input>
            </Form-item>
            <Form-item label="出/入口定义">
              <Select v-model="resEditFormData.passway">
                <Option v-for="opt in passwayList" :value="opt.value" :key="opt.value">{{ opt.label }}</Option>
              </Select>
            </Form-item>
            <Form-item label="分析类型">
              <Select v-model="resEditFormData.analysisType">
                <Option v-for="opt in analysisTypeList" :value="opt.value" :key="opt.value">{{ opt.label }}</Option>
              </Select>
            </Form-item>
            <Row class="check-input">
              <Col span="8">
              <Checkbox v-model="resEditFormData.isprerecord">预录时间</Checkbox>
              </Col>
              <Col span="16">
              <input v-model="resEditFormData.precord" :class="{redBorder: precordTip !== '', redBorderDis:!resEditFormData.isprerecord}" :disabled="!resEditFormData.isprerecord"></input>
              <span class="formTip">{{precordTip}}</span>
              </Col>
            </Row>
            <Row class="check-input">
              <Col span="8">
              <Checkbox v-model="resEditFormData.isdelayrecord">延录时间</Checkbox>
              </Col>
              <Col span="16">
              <input v-model="resEditFormData.delayrecord" :class="{redBorder: delayrecordTip !== '', redBorderDis:!resEditFormData.isdelayrecord}" :disabled="!resEditFormData.isdelayrecord"></input>
              <span class="formTip">{{delayrecordTip}}</span>
              </Col>
            </Row>
          </Form>
        </div>
        <div slot="footer">
          <Button type="ghost" @click="resEditCancel">取消</Button>
          <Button type="primary" @click="resEditSave" :loading="modalloading">确认</Button>
        </div>
      </Modal>
    </div>
    <div class="resource-right-table">
      <div class="table-header">
        <TableTab @on-tab-click="resTabClick" :tabs="resTabs" :isCount="true"></TableTab>
        <div class="table-header-actions clear">
          <div class="actions-btn">
            <Button v-if="$BShasPower('BS-SETTING-FACE-CHANNEL-MANAGE')" type="ghost" icon="plus" @click="resAddOpen" :disabled="isRootOrg">添加</Button>
            <Button v-if="$BShasPower('BS-SETTING-FACE-CHANNEL-MANAGE')" type="ghost" icon="trash-a" @click="resDelOpen" :disabled="!isResChecked">删除</Button>
            <Button v-if="$BShasPower('BS-SETTING-FACE-CHANNEL-MANAGE')" type="ghost" icon="arrow-move" @click="resMoveOpen" :disabled="!isResChecked">移动</Button>
            <Button type="ghost" icon="refresh" @click="resTableFresh">刷新</Button>
            <Select :disabled="resSelectIds.length<1" style="width:120px;margin-left:16px" placeholder="同步通道名称" v-model="channelNameSyncSelect">
              <Option @click.native="selectChannelName" v-for="opt in channelNameSyncOpts" :value="opt.value" :key="opt.value">{{ opt.label }}</Option>
            </Select>
            <Select :disabled="resSelectIds.length<1" style="width:100px" placeholder="设置码流" v-model="batchStreamSelect">
              <Option @click.native="selectBatchStream(opt)" v-for="opt in batchStreamOpts" :value="opt.value" :key="opt.value">{{ opt.label }}</Option>
            </Select>
            <Checkbox v-model="isShowChild" @on-change="showChildRefresh" style="margin-left:16px">显示子机构设备</Checkbox>
          </div>
          <div class="actions-search">
            <Input placeholder="请输入通道名称" style="width: 220px" v-model="filterKey">
            <Button slot="append" @click="seekResData(1)">搜索</Button>
            </Input>
          </div>
        </div>
      </div>
      <div class="table-relative" ref="tableBox">
        <div class="table-body table-cover">
          <Table size="small" :columns="resColumns" :height="tableHeight" :data="resourceTableData" :highlight-row="true" @on-selection-change="selectResRow" width="100%"></Table>
        </div>
      </div>
      <div class="table-footer">
        <div style="float: right;">
          <Page show-sizer :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" :total="resTabs[resActiveTab].number" :current="pageCur" :page-size="pageLimit" show-total show-elevator @on-change="changeResPage"></Page>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { save, read } from '../../../storage'
import TableTab from '../equipment/tableTab'
import toTreeData from 'assets/js/toTreeData.js'
import '../equipment/devicesRes.css'
import { mapState, mapActions } from 'vuex'
export default {
  components: {
    TableTab
  },
  prop: {
    isSearch: {
      type: Boolean
    }
  },
  data() {
    const codeTime = (rule, value, callback) => {
      const r = /^[0-9]*$/
      if (value === '' || value === undefined) {
        callback()
      }
      if (r.test(value)) {
        if (Number(value) > 65535) {
          return callback(new Error('超过最大值'))
        } else {
          callback()
        }
      } else {
        return callback(new Error('请输入有效数字'))
      }
    }
    const verifyName = (rule, value, callback) => {
      let nativecode = value.split('')
      let len = 0
      for (let i = 0; i < nativecode.length; i++) {
        let code = Number(nativecode[i].charCodeAt(0))
        if (code > 127) {
          len += 2
        } else {
          len++
        }
      }
      if (len > 256) {
        return callback(new Error('不能超过256位字符'))
      } else {
        callback()
      }
    }
    return {
      tableHeight: 435,
      pageLimit: this.$PageInfo.limit,
      pageCur: 1,
      resTabs: [
        {
          title: '视频通道',
          value: 0,
          disabled: false,
          active: true,
          number: 5
        }
      ],
      resColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'left'
        },
        {
          title: '序号',
          type: 'index',
          align: 'left',
          width: 60
        },
        {
          title: '通道名称',
          key: 'name',
          align: 'left',
          minWidth: 165
        },
        {
          title: '通道类型',
          key: 'type',
          align: 'left',
          minWidth: 60,
          render: (h, params) => {
            let text = ''
            switch (params.row.type) {
              case 0:
                text = '视频通道'
                break
              case 1:
                text = '报警输入'
                break
              case 2:
                text = '输出通道'
                break
              case 3:
                text = '对讲通道'
                break
              case 4:
                text = '门禁通道'
                break
            }
            return h('span', text)
          }
        },
        {
          title: '所属设备',
          key: 'device',
          minWidth: 60,
          align: 'left',
          render: (h, params) => {
            let text = ''
            if (params.row.eid) {
              text = params.row.eid.name
            } else {
              text = '...'
            }
            return h('span', text)
          }
        },
        {
          title: '设备IP',
          key: 'ip',
          align: 'left',
          minWidth: 110,
          render: (h, params) => {
            let text = params.row.ip
            return h('span', text)
          }
        },
        {
          title: '通道号',
          key: 'chan',
          align: 'left',
          minWidth: 50
        },
        {
          title: '监控点类型',
          key: 'monitortype',
          align: 'left',
          minWidth: 75,
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
        },
        {
          title: '出/入类型',
          key: 'passway',
          minWidth: 65,
          align: 'left',
          render: (h, params) => {
            let text = ''
            let n = params.row.passway
            if (n === 0) {
              text = '普通'
            } else if (n === 1) {
              text = '入口'
            } else if (n === 2) {
              text = '出口'
            }
            return h('span', text)
          }
        },
        {
          title: '实时码流',
          key: 'stream',
          align: 'left',
          minWidth: 60,
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
        },
        {
          title: '流地址',
          key: 'rtsp',
          align: 'left',
          minWidth: 145,
          ellipsis: true,
          render: (h, params) => {
            let text = ''
            text = params.row.rtsp ? params.row.rtsp.main : '......'
            return h('span', {
              attrs: {
                title: text
              }
            }, text)
          }
        },
        {
          title: '预录',
          key: 'isprerecord',
          align: 'left',
          minWidth: 40,
          render: (h, params) => {
            let text = ''
            if (!params.row.isprerecord) {
              text = '未开启'
            } else {
              text = params.row.precord
            }
            return h('span', text)
          }
        },
        {
          title: '延录',
          key: 'isdelayrecord',
          align: 'left',
          minWidth: 45,
          render: (h, params) => {
            let text = ''
            if (!params.row.isdelayrecord) {
              text = '未开启'
            } else {
              text = params.row.delayrecord
            }
            return h('span', text)
          }
        },
        {
          title: '操作',
          key: 'action',
          minWidth: 160,
          align: 'center',
          render: (h, params) => {
            if (this.$BShasPower('BS-SETTING-FACE-CHANNEL-MANAGE')) {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'ghost',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: e => {
                      e.stopPropagation()
                      this.resActiceId = params.row._id
                      this.resEditOpen(this.resActiceId)
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'ghost',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: e => {
                      e.stopPropagation()
                      this.resSelectIds = [params.row._id]
                      this.createResDelModel()
                    }
                  }
                }, '删除'),
                h('Button', {
                  props: {
                    type: 'ghost',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: e => {
                      e.stopPropagation()
                      this.resSelectIds = [params.row._id]
                      this.resMoveOpen()
                    }
                  }
                }, '移动')
              ])
            }
          }
        }
      ],
      resAddTreeData: [],
      resMoveTreeData: [],
      resAddTreeOptions: {
        showInput: true
      },
      resMoveTreeOptions: {
        showInput: false
      },
      resEditFormInfo: {
        deviceName: '设备名',
        orgName: '机构名'
      },
      resEditFormData: {
        name: '通道资源名称',
        chan: 0,
        monitortype: 0,
        stream: 'main',
        keycode: '',
        isprerecord: false,
        precord: 10,
        isdelayrecord: false,
        delayrecord: 10
      },
      passwayList: [
        { label: '普通', value: 0 },
        { label: '入口', value: 1 },
        { label: '出口', value: 2 }
      ],
      analysisTypeList: [
        { label: '通行系统', value: 0 },
        { label: '抓拍系统', value: 1 }
      ],
      resFormRole: {
        keycode: [{ validator: codeTime, trigger: 'change' }],
        name: [
          { required: true, message: '资源名称不能为空', trigger: 'change' },
          { validator: verifyName, trigger: 'change' }
        ]
      },
      monitortypeOpts: [
        {
          value: 0,
          label: '枪机'
        },
        {
          value: 1,
          label: '红外枪机'
        },
        {
          value: 2,
          label: '半球'
        },
        {
          value: 3,
          label: '快球'
        },
        {
          value: 4,
          label: '全景'
        }
      ],
      streamOpts: [
        {
          value: 'main',
          label: '主码流'
        },
        {
          value: 'sub1',
          label: '子码流'
        },
        {
          value: 'sub2',
          label: '第三码流'
        }
      ],
      channelNameSyncOpts: [
        {
          value: 'center',
          label: '同步到中心'
        },
        {
          value: 'device',
          label: '同步到设备'
        }
      ],
      batchStreamOpts: [
        {
          value: 'main',
          label: '主码流'
        },
        {
          value: 'sub1',
          label: '子码流'
        },
        {
          value: 'sub2',
          label: '第三码流'
        }
      ],
      batchStreamSelect: '',
      channelNameSyncSelect: '',
      resAddModal: false,
      resEditModal: false,
      resMoveModal: false,
      resSelectIds: [],
      resActiceId: '',
      resMoveOrgId: '',
      resActiveTab: 0,
      isAllResTree: false,
      isEditRes: false,
      isShowChild: true,
      pageSelect: 1,
      modalLoading: false,
      precordTip: '',
      delayrecordTip: '',
      filterKey: '',
      isResChecked: false,
      modalloading: false
    }
  },
  computed: {
    ...mapState({
      resourceTableData: ({ resource }) => resource.resourceTableData,
      resourceCounts: ({ resource }) => resource.resourceCounts,
      orgTreeData: ({ orgSetting }) => orgSetting.orgTreeData,
      isRootOrg: ({ orgSetting }) => orgSetting.isRootOrg,
      orgActiveName: ({ orgSetting }) => orgSetting.orgActiveName
    })
  },
  watch: {
    'resEditFormData.precord'(newval) {
      const r = /(^[1-9]([0-9]*)$|^[0-9]$)/
      if (newval === '' || newval === null) {
        this.precordTip = ''
      } else if (r.test(newval)) {
        if (Number(newval) > 30) {
          this.precordTip = '超出范围1-30'
        } else if (Number(newval) < 1) {
          this.precordTip = '超出范围1-30'
        } else {
          this.precordTip = ''
        }
      } else {
        this.precordTip = '请输入有效数字'
      }
    },
    'resEditFormData.delayrecord'(newval) {
      const r = /(^[1-9]([0-9]*)$|^[0-9]$)/
      if (newval === '' || newval === null) {
        this.precordTip = ''
      } else if (r.test(newval)) {
        if (Number(newval) > 3600) {
          this.delayrecordTip = '超出范围300-3600'
        } else if (Number(newval) < 300) {
          this.delayrecordTip = '超出范围300-3600'
        } else {
          this.delayrecordTip = ''
        }
      } else {
        this.delayrecordTip = '请输入有效数字'
      }
    }
  },
  methods: {
    ...mapActions([
      'getResourceByType',
      'getVideoResTree',
      'saveResourceToOrg',
      'deleteResource',
      'unbindResource',
      'getSingleResource',
      'getDeviceInfo',
      'getOrgName',
      'saveResourceInfo',
      'changeResourceOrg',
      'getRootId',
      'channelNameSync',
      'batchSetStreams'
    ]),
    seekResData(num) {
      this.isSearch = true
      this.pageCur = num || 1
      if (this.isShowChild) {
        this.getResourceByType({
          page: this.pageCur,
          limit: this.pageLimit,
          never: -1,
          type: this.resActiveTab,
          seek: this.filterKey
        })
          .then(suc => { })
          .catch(err => {
            console.log('batchSetStreams error: ' + err)
            this.$Notice.warning({
              title: '提示',
              desc: err,
              duration: 1,
              top: 200
            })
          })
      } else {
        this.getResourceByType({
          page: this.pageCur,
          limit: this.pageLimit,
          never: 0,
          type: this.resActiveTab,
          seek: this.filterKey
        })
          .then(suc => { })
          .catch(err => {
            console.log('getResourceByType error: ' + err)
            this.$Notice.warning({
              title: '提示',
              desc: err,
              duration: 1,
              top: 200
            })
          })
      }
    },
    getResData(num) {
      this.pageCur = num || 1
      if (this.isShowChild) {
        this.getResourceByType({
          page: this.pageCur,
          limit: this.pageLimit,
          never: -1,
          type: this.resActiveTab,
          seek: ''
        })
          .then(suc => {
            this.isResChecked = false
            this.resTabs[0].number = Number(suc.headers['x-bsc-count'])
          })
          .catch(err => {
            console.log('getResourceByType error: ' + err)
          })
      } else {
        this.getResourceByType({
          page: this.pageCur,
          limit: this.pageLimit,
          never: 0,
          type: this.resActiveTab,
          seek: ''
        })
          .then(suc => {
            this.resTabs[0].number = Number(suc.headers['x-bsc-count'])
          })
          .catch(err => {
            console.log('getResourceByType error: ' + err)
          })
      }
    },
    // 点击选择子机构按钮刷新
    showChildRefresh() {
      this.resTableFresh()
    },
    // 页面刷新获取当前页码
    resTableFresh() {
      this.getResData(this.pageSelect)
      this.filterKey = ''
      this.isResChecked = false
      this.resSelectIds = []
    },
    resTabClick(data) {
      this.resActiveTab = data.obj.value
      this.isSearch = false
      this.getResData(1)
      this.pageSelect = 1
      this.resSelectIds = []
    },
    changeResPage(n) {
      this.resSelectIds = []
      // 报警输出与报警输入数组合并
      if (this.isSearch) {
        this.seekResData(n)
      } else {
        this.getResData(n)
      }
      this.pageSelect = n
    },
    pageSizeChange(n) {
      this.pageLimit = n
      this.resSelectIds = []
      // 报警输出与报警输入数组合并
      if (this.isSearch) {
        this.seekResData()
      } else {
        this.getResData()
      }
    },
    // Modal的方法
    toggleResTree() {
      this.getVideoResTree({
        all: true,
        // intelligent: this.isAllResTree ? null : 2,
        type: 0,
        orgtype: 2,
        bigtype: 0
      })
        .then(suc => {
          this.resAddTreeData = []
          this.resAddTreeData = toTreeData([suc])
        })
        .catch(err => {
          console.log('getVideoResTree error: ' + err)
        })
    },
    resAddOpen() {
      this.resAddTreeData = []
      this.isAllResTree = false
      this.getVideoResTree({
        all: true,
        // intelligent: 2,
        type: 0,
        orgtype: 2,
        bigtype: 0
      })
        .then(suc => {
          this.resAddTreeData = []
          this.resAddTreeData = toTreeData([suc])
          this.resAddModal = true
        })
        .catch(err => {
          console.log('getVideoResTree error: ' + err)
        })
    },
    resAddSave() {
      let rids = this.$refs.resTree.getSelectedNodeIds()
      this.modalloading = true
      this.saveResourceToOrg(rids)
        .then(suc => {
          this.$Notice.success({
            title: '提示',
            desc: '资源分配成功',
            duration: 1
          })
          this.modalloading = false
          this.resAddModal = false
          this.resTableFresh()
        })
        .catch(err => {
          console.log('saveResourceToOrg error: ' + err)
          this.$Notice.error({
            title: '提示',
            desc: err,
            duration: 1
          })
          this.modalloading = false
        })
    },
    resAddCancel() {
      this.resAddModal = false
      this.resAddTreeData = []
    },
    selectResRow(sels) {
      if (sels.length === 0) {
        this.isResChecked = false
      } else {
        this.isResChecked = true
      }
      this.resSelectIds = []
      for (let sel of sels) {
        this.resSelectIds.push(sel._id)
      }
    },
    resMoveOpen() {
      if (this.resSelectIds.length === 0) {
        this.$Notice.warning({
          title: '提示',
          desc: '请选择所需要移动的资源',
          duration: 1
        })
      } else {
        this.resMoveModal = true
      }
      this.resMoveTreeData = JSON.parse(JSON.stringify(this.orgTreeData))
    },
    selectMoveOrg(node) {
      this.resMoveOrgId = node._id
    },
    resMoveSave() {
      this.modalloading = true
      this.changeResourceOrg({ arrId: this.resSelectIds, oid: this.resMoveOrgId })
        .then(suc => {
          this.$Notice.success({
            title: '提示',
            desc: '资源移动成功',
            duration: 1
          })
          this.modalloading = false
          this.resMoveModal = false
          this.resTableFresh()
        })
        .catch(err => {
          console.log('changeResourceOrg error: ' + err)
          this.$Notice.error({
            title: '提示',
            desc: err.response.data.message,
            duration: 1
          })
          this.modalloading = false
        })
    },
    resMoveCancel() {
      this.resMoveModal = false
    },
    resEditOpen(id) {
      // this.$refs.resEditForm.resetFields()
      // 此处同可直接获取页面初次加载的数据
      this.getSingleResource(id)
        .then(suc => {
          this.resEditFormData = JSON.parse(JSON.stringify(suc))
          if (!this.resEditFormData.stream) {
            this.resEditFormData.stream = 'main'
          }
          if (!this.resEditFormData.monitortype) {
            this.resEditFormData.monitortype = 0
          }
          this.resEditFormInfo.deviceName = suc.eid.name
          this.resEditFormInfo.orgName = this.orgActiveName
          // this.getDeviceInfo(suc.eid._id).then(suc => {
          //   this.resEditFormInfo.deviceName = suc.name
          //   this.getOrgName({type: 0, id: suc.oid}).then(suc => {
          //     this.resEditFormInfo.orgName = suc.name
          //   }).catch((err) => {
          //     console.log('getOrgName error: ' + err)
          //   })
          // }).catch((err) => {
          //   console.log('getDeviceInfo error: ' + err)
          // })
          this.resEditModal = true
        })
        .catch(err => {
          console.log('getSingleResource error: ' + err)
        })
    },
    resEditSave() {
      this.$refs.resEditForm.validate(valid => {
        if (valid && this.precordTip === '' && this.delayrecordTip === '') {
          this.modalloading = true
          const obj = {
            id: this.resActiceId,
            form: this.resEditFormData
          }
          this.saveResourceInfo(obj)
            .then(suc => {
              this.$Notice.success({
                title: '提示',
                desc: '资源信息修改成功',
                duration: 1
              })
              this.modalloading = false
              this.resEditModal = false
              this.resTableFresh()
            })
            .catch(err => {
              console.log('saveResourceInfo error: ' + err)
              this.$Notice.error({
                title: '提示',
                desc: err,
                duration: 1
              })
              this.modalloading = false
            })
        }
      })
    },
    resEditCancel() {
      this.resEditModal = false
      setTimeout(() => {
      }, 500)
    },
    resDelOpen() {
      if (this.resSelectIds.length === 0) {
        this.$Notice.warning({
          title: '提示',
          desc: '请选择所需要删除的资源',
          duration: 1
        })
      } else {
        this.createResDelModel()
      }
    },
    createResDelModel() {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除所选资源吗？</p>',
        onOk: () => {
          this.resDelSave()
        },
        onCancel: () => { }
      })
    },
    resDelSave() {
      this.unbindResource({
        arrId: this.resSelectIds,
        type: 2
      })
        .then(suc => {
          this.$Notice.success({
            title: '提示',
            desc: '删除成功',
            duration: 1
          })
          this.resTableFresh()
        })
        .catch(err => {
          console.log('unbindResource error: ' + err)
          this.$Notice.error({
            title: '提示',
            desc: err.response.data.message,
            duration: 1
          })
        })
    },
    // 同步通道名称
    selectChannelName() {
      if (this.resSelectIds.length === 0) {
        this.$Notice.warning({
          title: '提示',
          desc: '请选择所需要同步的资源',
          duration: 1
        })
      } else {
        const contentText = '<p>确定同步所选资源名称吗？</p>'
        this.$Modal.confirm({
          title: '提示',
          content: contentText,
          onOk: () => {
            this.channelNameSync({
              syncTtype: this.channelNameSyncSelect,
              arrId: this.resSelectIds
            })
              .then(suc => {
                this.$Notice.success({
                  title: '提示',
                  desc: '同步名称成功',
                  duration: 1
                })
                this.resTableFresh()
              })
              .catch(err => {
                console.log('channelNameSync error: ' + err)
                this.$Notice.error({
                  title: '提示',
                  desc: err.response.data.message,
                  duration: 1
                })
              })
          },
          onCancel: () => { }
        })
      }
    },
    // 批量设置主码流子码流
    selectBatchStream(opt) {
      if (this.resSelectIds.length === 0) {
        this.$Notice.warning({
          title: '提示',
          desc: '请选择所需要设置码流的资源',
          duration: 1
        })
      } else {
        const contentText =
          opt.value === 'main'
            ? '<p>确定将所选资源设置为主码流吗？</p>'
            : opt.value === 'sub1' ? '<p>确定将所选资源设置为子码流吗？</p>' : '<p>确定将所选资源设置为第三码流吗？</p>'
        this.$Modal.confirm({
          title: '提示',
          content: contentText,
          onOk: () => {
            this.batchSetStreams({
              streamType: opt.value,
              arrId: this.resSelectIds
            })
              .then(suc => {
                this.$Notice.success({
                  title: '提示',
                  desc: '码流设置成功',
                  duration: 1
                })
                this.resTableFresh()
              })
              .catch(err => {
                console.log('batchSetStreams error: ' + err)
                this.$Notice.error({
                  title: '提示',
                  desc: err,
                  duration: 1
                })
              })
          },
          onCancel: () => { }
        })
      }
    }
  },
  created() {
    this.getRootId()
    if (read('routerface') === 'face') { this.isSearch = false }
    this.getResData(1)
    save('routerface', 'noface')
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight
  }
}
</script>
<style scoped>
.bs-resource-manage {
  padding: 20px 20px;
  width: 100%;
  height: 100%;
}

.bs-main {
  padding: 0;
  background-color: #1c3053;
  overflow: hidden;
}

.resource-right-table {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.resource-right {
  height: 100%;
}

/*按钮和inpu框*/

.table-header-actions {
  /* height: 50px; */
  margin: 12px 10px 12px 24px;
  background-color: #1c3054;
}

/*按钮和inpu框*/

.actions-btn {
  float: left;
  /* margin-top: 10px; */
}

.actions-search {
  float: right;
  /* margin-top: 9px; */
}

.actions-btn .ivu-btn {
  margin-right: 8px;
}

.actions-btn .ivu-select {
  margin-right: 8px;
}

/* table样式 */

.table-relative {
  position: relative;
  flex: 1;
}

.table-body {
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

/*修改弹出框内容样式*/

.res-add-model {
  padding: 0px 10px;
}

.res-edit-form {
  padding: 0px 10px;
}

.res-edit-form .check-input .ivu-col-span-8 {
  width: 100px;
  height: 32px;
  line-height: 32px;
}

.res-edit-form .check-input .ivu-col-span-16 {
  width: calc(100% - 100px);
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
.check-input .redBorderDis {
  cursor: not-allowed;
}
.check-input .redBorderDis:hover {
  cursor: not-allowed;
}

.res-model-tree {
  height: 450px;
  width: 400px;
  margin-top: 20px;
  overflow: hidden;
}

.clear:after {
  content: '';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
</style>
