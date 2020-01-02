<template>
  <div class="bs-resource-manage bs-content">
    <div class="resource-left bs-left">
      <BsOrgTree @call="getResDataClick" :orgType="0" orgTitle="机构资源" :isHandle="false"></BsOrgTree>
    </div>
    <div class="bs-main">
      <div class="resource-right-table">
        <div class="table-header">
          <TableTab ref="resTab" :tabs="resTabs" :isCount="true"></TableTab>
          <div class="table-header-actions clear">
            <div class="actions-btn">
              <Button type="ghost" icon="plus" @click="resAddOpen">添加</Button>
              <Button type="ghost" icon="edit" @click="resEditOpen" :disabled="!isResChecked">修改</Button>
              <Button type="ghost" icon="trash-a" @click="resDelOpen" :disabled="!isResChecked">删除</Button>
              <Button type="ghost" icon="" @click="rtspCfgOpen">配置</Button>
              <Button type="ghost" icon="refresh" @click="resTableFresh">刷新</Button>
              <Checkbox v-model="isShowChild" @on-change="showChildRefresh">显示子机构设备</Checkbox>
            </div>
            <div class="actions-search">
              <Input placeholder="请输入通道名称" style="width: 220px" v-model="filterKey" @keyup.enter.native="seekResData(1)">
              <Button slot="append" @click="seekResData(1)">搜索</Button>
              </Input>
            </div>
          </div>
        </div>
        <div class="table-relative" ref="tableBox">
          <div class="table-body">
            <Table size="small" :columns="tableColumns" :height="tableHeight" :data="resourceTableData" highlight-row @on-selection-change="selectResRow" width="100%" style="overflow:auto"></Table>
          </div>
          <div class="table-footer">
            <div style="float: right;">
              <Page :total="resourceCounts" :current="1" :page-size="pageLimit" show-total show-elevator @on-change="changeResPage" show-sizer :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange"></Page>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- rtsp流分配弹出框 -->
    <Modal :mask-closable="false" v-model="resAddModal" title='视频通道rtsp流分配' width="550" @on-cancel="resAddCancel">
      <div class="res-add-model">
        <p>选择通道
          <span style="float:right">{{'剩余数/总数: '+ (rtspcountAll-rtspNumber>=0 ? rtspcountAll-rtspNumber: 0) + '/' + rtspcountAll}}</span>
        </p>
        <p>
          <span style="float:right;">{{'勾选数：' + rtspCheckNumber}}</span>
        </p>
        <div class="res-model-tree" v-if="resAddModal === true">
          <bs-scroll ref="scroller">
            <VTree ref="resTree" @handlecheckedChange="treeCheckChange" :treeData="resAddTreeData" :options="resAddTreeOptions" @on-expand="$refs.scroller.update()">
            </VTree>
          </bs-scroll>
        </div>
      </div>
      <div slot="footer">
        <Button type="ghost" @click="resAddCancel">取消</Button>
        <Button type="primary" @click="resAddSave" :loading="modalloading">确认</Button>
      </div>
    </Modal>
    <!-- rtsp流修改弹出框 -->
    <Modal :mask-closable="false" v-model="rtspEditModal" title="视频通道rtsp流修改" width="550">
      <div class="res-edit-form">
        <Form label-position="left" :label-width="100" :model="rtspEditFormData" ref="rtspEditForm" :rules="rtspFormRole">
          <Form-item label="rtsp流地址" prop="rtspCount">
            <span>{{rtspEditFormData.rtspString}}</span><Input v-model="rtspEditFormData.rtspCount" style="width:50px;display:inlint-block"></Input>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button type="ghost" @click="rtspEditCancel">取消</Button>
        <Button type="primary" @click="resEditSave" :loading="modalloading">确认</Button>
      </div>
    </Modal>
    <!-- rtsp流配置弹出框 -->
    <RtspCfg ref="RtspCfg" :rtspFormData="rtspFormData" @cancel="rtspCfgCancel" @save="editRtspServer" :rtspCfgModalShow="rtspCfgModalShow"></RtspCfg>
  </div>
</template>
<script>
import BsOrgTree from '../../../components/BSorgTree.vue'
import TableTab from './tableTab'
import toTreeData from 'assets/js/toTreeData.js'
import RtspCfg from './modal/rtspCfg'
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  components: {
    BsOrgTree,
    TableTab,
    RtspCfg
  },
  data() {
    const rtspCountsValidate = (rule, value, callback) => {
      let count
      this.getRtspCfg()
        .then(suc => {
          count = suc.rtspcount
          let r = /(^[1-9]([0-9]*)$|^[0-9]$)/
          if (value === '' || value === null || value === undefined) {
            return callback(new Error('不能为空'))
          }
          if (r.test(value)) {
            if (Number(value) > count) {
              return callback(new Error('超过最大值' + count))
            } else if (Number(value) < 0) {
              return callback(new Error('小于最小值0'))
            } else {
              callback()
            }
          } else {
            return callback(new Error('请输入有效数字'))
          }
        })
        .catch(err => {
          console.log('getRtspCfg error' + err)
        })
    }
    return {
      tableHeight: 435,
      resTabs: [
        {
          title: 'rtsp流配置',
          value: 0,
          disabled: false,
          active: true,
          number: 0,
          isHide: false
        }
      ],
      tableColumns: [],
      rtspColumns: [
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
          minWidth: 160,
          render: (h, params) => {
            return h(
              'span',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.name
                }
              },
              params.row.name
            )
          }
        },
        {
          title: '所属设备',
          key: 'device',
          minWidth: 120,
          align: 'left',
          ellipsis: true,
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
          minWidth: 120,
          render: (h, params) => {
            let text = params.row.ip
            return h('span', text)
          }
        },
        {
          title: '通道号',
          key: 'chan',
          align: 'left',
          width: 80
        },
        {
          title: 'rtsp流地址',
          key: 'rtsp',
          align: 'left',
          minWidth: 180,
          render: (h, params) => {
            let text = ''
            text = params.row.rtsp ? params.row.rtsp.main : ''
            return h('span', text)
          }
        }
      ],
      resAddTreeData: [],
      resAddTreeOptions: {
        showInput: true
      },
      rtspFromInfo: {},
      rtspEditFormData: {
        rtspCount: '',
        rtspString: ''
      },
      rtspFormRole: {
        rtspCount: [{ required: true, validator: rtspCountsValidate, trigger: 'change' }]
      },
      resAddModal: false,
      rtspEditModal: false,
      resSelectIds: [],
      resActiceId: '',
      resActiveTab: 0,
      isEditRes: false,
      isShowChild: true,
      pageSelect: 1,
      pageLimit: this.$PageInfo.limit,
      modalLoading: false,
      filterKey: '',
      isResChecked: false,
      modalloading: false,
      rtspFormData: {},
      rtspCfgModalShow: false,
      rtspcountAll: 0,
      rtspNumber: 0,
      initialNumber: 0,
      rtspCheckNumber: 0
    }
  },
  computed: {
    ...mapState({
      resourceTableData: ({ resource }) => resource.resourceTableData,
      resourceCounts: ({ resource }) => resource.resourceCounts
    }),
    ...mapGetters(['sysConfrole'])
  },
  watch: {},
  methods: {
    ...mapActions([
      'getResourceByType',
      'getVideoResTree',
      'saveResourceToOrg',
      'getSingleResource',
      'saveResourceInfo',
      'getRootId',
      'getRtspCfg',
      'editRtspCfg',
      'getRtspResourceTree',
      'delResourceRtsp',
      'addResourceRtsp',
      'getUnusedRtspData',
      'getRootRescounts',
      'saveRtspInfo'
    ]),
    getResDataClick() {
      this.isSearch = false
      this.isResChecked = false
      this.getResData(1)
    },
    seekResData(num) {
      this.isSearch = true
      this.getResourceByType({
        page: num,
        limit: this.pageLimit,
        never: this.isShowChild ? -1 : 0,
        type: this.resActiveTab,
        seek: this.filterKey
      })
        .then(suc => {})
        .catch(err => {
          console.log('getResourceByType error: ' + err)
          this.warningMsg(err)
        })
    },
    getResData(num) {
      let query = {
        page: num,
        limit: this.pageLimit,
        never: 0,
        type: this.resActiveTab,
        seek: ''
      }
      this.isShowChild && (query.never = -1)
      query.rtsp = 1
      this.getResourceByType(query)
        .then(suc => {
          if (this.tabIndex === 0) {
            let rtspCount = suc.data.length
            suc.data.forEach(item => {
              if (!item.rtsp) { rtspCount-- }
            })
            this.resTabs[0].number = Number(suc.headers['x-bsc-count'])
            this.resTabs[1].number = rtspCount
          } else {
            delete query.rtsp
            query.isCommit = 0
            this.getResourceByType(query).then(suc => {
              this.resTabs[0].number = Number(suc.data.length)
            })
            this.resTabs[this.tabIndex].number = Number(suc.headers['x-bsc-count'])
          }
        })
        .catch(err => {
          console.log('getResourceByType error: ' + err)
        })
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
      if (data.obj.title === 'rtsp流配置') {
        this.tableColumns = this.rtspColumns
      }
      this.isSearch = false
      this.getResData(1)
      this.pageSelect = 1
      this.resSelectIds = []
    },
    // 页码改变
    changeResPage(n) {
      // 报警输出与报警输入数组合并
      if (this.isSearch) {
        this.seekResData(n)
      } else {
        this.getResData(n)
      }
      this.pageSelect = n
    },
    // 切换每页条数时的回调
    pageSizeChange(size) {
      this.pageLimit = size
      this.changeResPage(1)
    },
    resAddOpen() {
      this.resAddTreeData = []
      this.getRtspResourceTree({
        all: true,
        type: 0,
        orgtype: 0,
        bigtype: 0,
        rtsp: 0
      })
        .then(suc => {
          this.resAddTreeData = []
          this.resAddTreeData = toTreeData([suc])
          const orgId = suc._id
          this.getRtspCfg().then(suc => {
            this.rtspcountAll = suc.rtspcount || 200
          })
          this.getRootRescounts({ type: this.resActiveTab, oid: orgId, never: -1, rtsp: 1, page: 1, limit: 100 })
            .then(suc => {
              this.rtspNumber = Number(suc.headers['x-bsc-count'])
              this.initialNumber = Number(suc.headers['x-bsc-count'])
            })
            .catch(err => {
              console.log('getResourceByType 813 error' + err)
            })
          this.resAddModal = true
        })
        .catch(err => {
          console.log('getVideoResTree error: ' + err)
        })
    },
    resAddSave() {
      let rids = this.$refs.resTree.getSelectedDeepIds()
      if (rids.length > 0) {
        if (this.rtspcountAll >= this.rtspNumber) {
          this.getUnusedRtspData(rids)
            .then(obj => {
              this.addResourceRtsp(obj.data)
                .then(suc => {
                  this.modalloading = false
                  this.resAddModal = false
                  this.rtspCheckNumber = 0
                  this.resTableFresh()
                  return this.successMsg('资源rtsp流添加成功')
                })
                .catch(err => {
                  this.modalloading = false
                  console.log('saveResourceToOrg error: ' + err)
                  return this.errorMsg(err)
                })
            })
            .catch(err => {
              this.resAddCancel()
              return this.warningMsg(err)
            })
        } else {
          return this.warningMsg('勾选的超过了剩余的rtsp流数量')
        }
      } else {
        return this.warningMsg('请选择资源')
      }
    },
    resAddCancel() {
      this.resAddModal = false
      this.rtspCheckNumber = 0
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
    resEditOpen() {
      if (this.resSelectIds.length !== 1) {
        this.$Modal.confirm({
          title: '提示',
          content: '一次只能修改一个！'
        })
      } else {
        this.resActiceId = this.resSelectIds[0]
        this.$refs.rtspEditForm.resetFields()
        // 此处同可直接获取页面初次加载的数据
        this.getSingleResource(this.resActiceId)
          .then(suc => {
            const rtspMain = suc.rtsp.main ? suc.rtsp.main : suc.rtsp.sub
            this.rtspEditFormData = {
              rtspCount: rtspMain.split('=').pop(),
              rtspString: rtspMain.split('=').shift() + '='
            }
            this.rtspEditModal = true
          })
          .catch(err => {
            console.log('getSingleResource error: ' + err)
          })
      }
    },
    resEditSave() {
      this.$refs.rtspEditForm.validate(valid => {
        if (valid) {
          this.saveRtspInfo({
            id: this.resActiceId,
            form: {
              rtsp: {
                main: this.rtspEditFormData.rtspString + this.rtspEditFormData.rtspCount,
                sub: ''
              }
            }
          })
            .then(suc => {
              this.successMsg('rtsp流修改成功')
              this.modalloading = false
              this.rtspEditModal = false
              this.resTableFresh()
            })
            .catch(err => {
              this.modalloading = false
              console.log('saveResourceInfo error: ' + err)
              this.errorMsg(err)
            })
        }
      })
    },
    rtspEditCancel() {
      this.rtspEditModal = false
      setTimeout(() => {
        this.$refs.rtspEditForm.resetFields()
      }, 500)
    },
    resDelOpen() {
      if (this.resSelectIds.length === 0) {
        this.warningMsg('请选择所需要删除的资源')
      } else {
        this.createResDelModel()
      }
    },
    createResDelModel() {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除所选资源吗？</p>',
        onOk: () => {
          this.rtspDelSave()
        },
        onCancel: () => {}
      })
    },
    rtspDelSave() {
      this.delResourceRtsp({ arrId: this.resSelectIds })
        .then(suc => {
          this.successMsg('删除成功')
          this.resTableFresh()
        })
        .catch(err => {
          console.log('rtspDelSave error: ' + err)
          this.errorMsg(err)
        })
    },
    // 配置rtsp流
    rtspCfgOpen() {
      this.rtspCfgModalShow = true
      this.getRtspCfg()
        .then(suc => {
          if (suc) {
            this.rtspFormData = JSON.parse(JSON.stringify(suc))
          } else {
            this.rtspFormData = {
              password: '123456',
              port: 554,
              rtspcount: 0,
              url: '0.0.0.0',
              username: 'Admin'
            }
          }
        })
        .catch(err => {
          this.errorMsg(err)
        })
    },
    editRtspServer(data, name) {
      let isIP = ip => {
        if (!ip) { return false }
        let str = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
        return str.test(ip)
      }
      if (!isIP(data.url)) {
        return this.errorMsg('url地址不能为空')
      }
      if (!data.port || +data.port < 0 || +data.port > 65535) {
        return this.errorMsg('端口不正确')
      }
      if (!data.username || data.username.length < 0 || data.username.length > 64) {
        return this.errorMsg('用户名长度为0-64个字符')
      }

      if (!data.password || data.password.length < 0 || data.password.length > 64) {
        return this.errorMsg('密码长度为0-64个字符')
      }
      this.editRtspCfg(data)
        .then(suc => {
          this.rtspCfgModalShow = false
          this.successMsg('rtsp流服务器配置成功')
          this.$refs['RtspCfg'].$refs[name].resetFields()
        })
        .catch(err => {
          return this.errorMsg(err)
        })
    },
    rtspCfgCancel(name) {
      this.rtspCfgModalShow = false
      this.$refs['RtspCfg'].$refs[name].resetFields()
    },
    // rtsp复选tree变化时计算出剩余数
    treeCheckChange() {
      let checkRes = this.$refs.resTree.getSelectedDeepIds()
      this.rtspCheckNumber = checkRes.length
      this.rtspNumber = this.initialNumber + checkRes.length
    }
  },
  created() {
    this.getRootId()
    for (let i = 0; i < this.resTabs.length; i++) {
      if (!this.resTabs[i].isHide) {
        if (this.resTabs[i].title === 'rtsp流配置') {
          this.tableColumns = this.rtspColumns
        }
      }
      break
    }
  },
  mounted() {
    this.$refs['resTab'].$on('on-tab-click', this.resTabClick)
    this.tableHeight = this.$refs['tableBox'].offsetHeight - 40
  },
  beforeDestroy() {
    this.$refs['resTab'].$off('on-tab-click')
  }
}
</script>
<style scoped>
.bs-resource-manage {
  padding: 20px 0;
  width: 100%;
  height: 100%;
}

.resource-right-table {
  min-width: 1300px;
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1c3053;
}

.resource-right {
  height: 100%;
}

/*按钮和inpu框*/

.table-header-actions {
  background-color: #1c3054;
  margin: 0;
  padding: 12px 20px;
}

/*按钮和inpu框*/

.actions-btn {
  float: left;
}

.actions-search {
  float: right;
}

.actions-btn .ivu-btn {
  margin-right: 10px;
  /*height: 32px;
  padding: 0 10px;*/
}

.actions-btn .ivu-select {
  margin-right: 10px;
}

/* table样式 */

.table-relative {
  position: relative;
  flex: 1;
}

/*修改弹出框内容样式*/

.res-add-model {
  padding: 0px 10px;
}

.res-edit-form {
  /*margin-top: 20px;*/
  padding: 0px 10px;
}

.res-edit-form .check-input .ivu-col-span-8 {
  width: 100px;
  height: 32px;
  line-height: 32px;
}

.res-edit-form .check-input .ivu-col-span-16 {
  width: 286px;
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
  transition: border 0.2s ease-in-out, background 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
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
