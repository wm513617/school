<template>
    <div class="STRUCTURE_SETTING_SERVER" ref="tableBox">
      <TableTab ref="resTab" :tabs="resTabs" ></TableTab>
      <div v-if="activeFlag===0">
        <div class="header-button">
          <Button icon="plus" title="添加" @click="addServer">添加</Button>
          <Button :disabled="!selectList.length" @click="delServers" icon="trash-a" title="删除">删除</Button>
          <Button  @click="getServer(true)" icon="refresh" title="刷新">刷新</Button>
          <Button  :disabled="!selectList.length || selectList.length > 1" @click="exportApply"  title="导出申请"><i class="iconfont icon-daochushenqing" style="font-size: 12px;"></i>&nbsp;&nbsp;导出申请</Button>
          <Upload :action="uploadFiles" :headers="headerObj" name="file"
                  style="display: inline-block"
                  :show-upload-list="false"
                  :format="['dat']"
                  :on-success="importSuccess"
                  :on-format-error="formatError"
                  :on-exceeded-size="exceededSize">
            <Button  :disabled="!selectList.length || selectList.length > 1" title="导入授权"><i class="iconfont icon-daorushouquan" style="font-size: 12px;"></i>&nbsp;&nbsp;导入授权</Button>
          </Upload>
          <Button   :disabled=" selectList.length < 1 " :loading="startSearching"  @click="startSever"  title="启动服务">
            <i v-if="!startSearching" class="iconfont icon-qidongfenxi"  style="font-size:14px;"></i>
            &nbsp;&nbsp;启动服务</Button>
          <Button  :disabled="  selectList.length < 1 "  :loading="stopSearching" @click="stopSever"  title="停止服务">
            <i v-if="!stopSearching" class="iconfont icon-tingzhifenxi" style="font-size:14px;"></i>
            &nbsp;&nbsp;停止服务</Button>
        </div>
        <div class="content">
          <Table :columns="columns" :data="serverPageInfo.list" @on-selection-change="tableSelect" ref="tableRef" :height="tableHeight" size="small"></Table>
          <div class="page-warp">
            <div class="page">
              <Page :total="serverPageInfo.count" @on-change="pageChange" :current="tablePage.page" :page-size="tablePage.limit" show-total show-elevator></Page>
            </div>
          </div>
        </div>
        <div v-if="modal.showModal">
          <Modal v-model="modal.showModal" :mask-closable="false" :title="modal.isAdd ? '添加服务器' : '修改服务器'" :width="450" @on-cancel="cancelModel" @on-ok="submitForm">
            <Tabs :value="serverActive">
              <TabPane disabled label="服务器信息" name="服务器信息">
                <Form ref="modelForm" :model="modal.formData" :rules="modal.formRules" :label-width="100" label-position="left" style="padding:0 20px">
                  <Form-item style="height: 0; margin: 0;">
                    <Input name="serverPassword" type="password" style="width: 0; height: 0; overflow: hidden" :readonly="true"></Input>
                  </Form-item>
                  <Form-item label="算法厂商" prop="algorithm">
                    <!-- <Input v-model="modal.formData.algorithm" placeholder="请输入"></Input> -->
                    <Select v-model="modal.formData.algorithm" placeholder="请选择">
                      <Option v-for="item in modal.algorithmList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                  </Form-item>
                  <Form-item label="服务器名称" prop="name">
                    <Input v-model="modal.formData.name" placeholder="请输入"></Input>
                  </Form-item>
                  <Form-item label="服务器编号" prop="code">
                    <Input v-model="modal.formData.code" placeholder="请输入"></Input>
                  </Form-item>
                  <Form-item label="视频授权路数" prop="authNum">
                    <Input v-model="modal.formData.authNum" placeholder="请输入"></Input>
                  </Form-item>
                  <Form-item label="IP地址" prop="ip">
                    <Ipv4 v-model="modal.formData.ip" ref="ipv4"></Ipv4>
                  </Form-item>
                  <Form-item label="端口" prop="port">
                    <Input v-model="modal.formData.port" placeholder="请输入"></Input>
                  </Form-item>
                  <Form-item label="用户名" prop="username">
                    <input class="useOrpwd" type="text" v-model="modal.formData.username" placeholder="请输入" autocomplete="off"></input>
                  </Form-item>
                  <Form-item label="密码" prop="password">
                    <input name="serverPassword" class="useOrpwd" type="password" v-model="modal.formData.password" placeholder="请输入" autocomplete="new-password"></input>
                  </Form-item>
                </Form>
              </TabPane>
              <TabPane disabled label="资源绑定" name="资源绑定">
                <p>
                  选择资源，将资源添加至对应的服务器分析任务中
                 <span style="float: right">已选数量：{{selectServerResTree}} / 总数：{{serverResTreeTotal}}</span>
                </p>
                <div class="res-add-model" style="height:454px">
                  <bs-scroll ref="scroller" class="res-model-tree">
                    <VTree ref="resTree" :treeData="serverResTree" :options="modal.optionsTree" @handlecheckedChange="handlecheckedChange" @creatTreeEnd='expand' @loadMore="expand" @on-expand="expand">
                    </VTree>
                  </bs-scroll>
                </div>
              </TabPane>
            </Tabs>
            <div slot="footer">
              <Button type="ghost" style="margin-left: 8px" @click="cancelModel">取消</Button>
              <Button type="primary" v-show="showNext" @click="nextBindRes">下一步</Button>
              <Button type="primary" v-show="!showNext" @click="backServerEdit">上一步</Button>
              <Button type="primary" :loading="loading" v-show="!showNext" @click="submitForm">确定</Button>
            </div>
          </Modal>
        </div>
      </div>
      <div v-else>
        <div class="statusWatch">
          <ul>
            <li  v-for="(item,index) in monitoringListDatas" :key="index">
              <p style="margin-top: 15px;margin-bottom: 15px">
               {{ item.name }}
              </p>
              <div class="echartsBox">
                <Row>
                  <Col span="8">
                    <webSocketBSechart style="height:200px;width:100%" :options="item.objOption"></webSocketBSechart>
                  </Col>
                  <Col span="8">
                    <webSocketBSechart style="height:200px;width:100%" :options="item.objCpuOption"></webSocketBSechart>
                  </Col>
                  <Col span="8">
                    <webSocketBSechart style="height:200px;width:100%" :options="item.objMemoryOption"></webSocketBSechart>
                  </Col>
                </Row>
              </div>
            </li>
          </ul>
        </div>
      </div>

    </div>
</template>

<script>
import TableTab from '@src/components/videoStructured/videoStructuredSettingTab'
import Ipv4 from '@src/components/BSIPV4.vue'
import { mapActions, mapState, mapGetters, mapMutations} from 'vuex'
import videoStructured from './../../common/videoStructured'
import toTreeData from '@src/assets/js/toTreeData.js'
import webSocketBSechart from '@src/components/webSocketBSechart'
let IPinfo = JSON.parse(window.localStorage.getItem('IpInfo'))
let setInterValName
const formData = {
  algorithm: 'BSR-SM', // 算法
  name: '', // 服务器名称
  code: 1, // 编号
  authNum: 20, // 视频授权路数
  type: 1,
  ip: '0.0.0.0', // 视频结构化ip 地址
  rtspIp: window.location.hostname === 'localhost' ? IPinfo.IP : window.location.hostname, // , // 本地ip
  port: '', // 端口
  username: 'admin', // 视频结构化服务器用户名
  password: 'intedio', // 视频结构化服务器密码
  res: [ // 绑定的资源
    // {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Resource'
    // }
  ]
}
export default {
  components: {
    TableTab,
    Ipv4,
    webSocketBSechart
  },
  data() {
    const rules = {
      // 服务器名称 16个字符限制，支持数字、字母、下划线和汉字
      name: (rule, value, callback) => {
        const r = /^[\da-zA-Z\u4e00-\u9fa5_]{1,16}$/
        if (!value.length) {
          callback(new Error('请输入服务器名称!'))
        } else if (!r.test(value)) {
          callback(new Error('请输入16位以内的数字、字母、下划线或汉字!'))
        } else {
          callback()
        }
      },
      // 服务器的编号 999 个字符限制，支持数字、字母和下划线
      code: (rule, value, callback) => {
        const r = /^[1-9][\d]{0,3}$/
        if (!r.test(value)) {
          callback(new Error('可输入1-999!'))
        } else if (value > 999) {
          callback(new Error('请输入999位以内的数字'))
        } else {
          callback()
        }
      },
      authNum: (rule, value, callback) => {
        const r = /^[1-9][\d]{0,3}$/
        if (!r.test(value)) {
          callback(new Error('可输入1-999!'))
        } else if (value > 999) {
          callback(new Error('最多支持999路动态视频'))
        } else {
          callback()
        }
      },
      port: (rule, value, callback) => {
        if (!value || value.trim().length < 1) {
          callback(new Error('请输入端口号!'))
        }
        if (value > 65535) {
          callback(new Error('已超过端口最大长度!'))
        }
        if (value < 1) {
          callback(new Error('端口号为正整数!'))
        }
        callback()
      }
    }
    return {
      resTabs: [
        {
          value: '服务器',
          label: 0,
          isActive: true
        },
        {
          value: '状态监控',
          label: 1,
          isActive: false
        }
      ], // tab切换
      activeFlag: 0, // 默认显示激活的tab
      // 表格高度(自适应)
      tableHeight: 438,
      // table 标题
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '名称',
          align: 'center',
          key: 'name'
        },
        {
          title: '编号',
          align: 'center',
          key: 'code'
        },
        {
          title: '算法厂家',
          align: 'center',
          key: 'algorithm'
        },
        {
          title: 'IP地址',
          align: 'center',
          key: 'ip'
        },
        {
          title: '端口',
          align: 'center',
          key: 'port'
        },
        {
          title: '操作',
          key: '13',
          width: 220,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small',
                    disabled: false
                  },
                  domProps: {
                    //
                    id: 'amend' + this.serverPageInfo.list[params.index].IdIndex
                  },
                  style: {
                    marginLeft: '10px'
                  },
                  on: {
                    click: () => {
                      // console.log(params.index)
                      this.setServer(params.index)
                    }
                  }
                },
                '修改'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small',
                    disabled: false
                  },
                  domProps: {
                    //
                    id: 'sync' + this.serverPageInfo.list[params.index].IdIndex
                  },
                  style: {
                    marginLeft: '10px'
                  },
                  on: {
                    click: () => {
                      // console.log(params.row)
                      this.syncLibraryApi(params.row._id)
                        .then(res => {
                          console.log(res)
                          if (res.status === 200) {
                            this.$Notice.success({ title: '成功', desc: '同步成功!' })
                          } else {
                            this.$Notice.error({ title: '失败', desc: '同步失败！' })
                          }
                          /* if (res.data.length === 0) {
                            this.$Notice.success({ title: '成功', desc: '同步成功!' })
                          } else {
                            this.$Notice.warning({ title: '警告', desc: `其中${res.data.length}位同步未成功!` })
                          } */
                        })
                        .catch(() => {
                          this.$Notice.error({ title: '失败', desc: '同步失败！' })
                        })
                    }
                  }
                },
                '同步'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small',
                    disabled: false
                  },
                  domProps: {
                    //
                    id: 'delete' + this.serverPageInfo.list[params.index].IdIndex
                  },
                  style: {
                    marginLeft: '10px'
                  },
                  on: {
                    click: () => {
                      // console.log(params)
                      this.delServer(params.row)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      // table 数据
      //  tableServerList: [],
      // 选择的列表
      selectList: [],
      modal: { // 弹出框数据
        // 是否是添加
        isAdd: true,
        showModal: false,
        formData: {
          algorithm: 'BSR-SM', // 算法
          name: '', // 服务器名称
          code: 1, // 编号
          authNum: 20,
          type: 1,
          ip: '0.0.0.0',
          port: '',
          username: 'admin', // 视频结构化服务器用户名
          password: 'intedio', // 视频结构化服务器密码
          rtspIp: window.location.hostname === 'localhost' ? IPinfo.IP : window.location.hostname, // window.location.hostname,
          res: []
        },
        formRules: {
          name: [{ required: true, validator: rules.name, trigger: 'blur' }],
          code: [{ required: true, validator: rules.code, trigger: 'change' }],
          authNum: [{ required: true, validator: rules.authNum, trigger: 'change' }],
          port: [{ required: true, validator: rules.port, trigger: 'change' }],
          uname: [{ required: true, message: '不能为空', trigger: 'blur' }],
          pwd: [{ required: true, message: '不能为空', trigger: 'blur' }]
        },
        // 算法厂商算法
        algorithmList: [
          {
            value: 'BSR-SM',
            label: 'BSR-SM'
          }
        ],
        // 机构树
        orgTree: [],
        // 做完回显的机构树
        orgTreeSC: [],
        optionsTree: {
          showInput: true
        }
      },
      showNext: true,
      serverActive: '服务器信息',
      resTree: [],
      serverResTree: [],
      loading: false,
      tablePage: {
        page: 1,
        limit: 10
      },
      headerObj: { Authorization: '' },
      uploadFiles: '',
      serverResTreeTotal: 0,
      selectServerResTree: 0,
      startSearching: false,
      stopSearching: false
      // isDisableStartService: true, // 是否禁用启动服务
    //  isDisableStopService: true // 是否禁用停止启动服务
    }
  },
  computed: {
    ...mapState({
      serverPageInfo: state => state.videoStructuredSetting.serverPageInfo,
      monitoringListDatas: state => state.videoStructuredSetting.monitoringLists
    }),
    ...mapGetters(['accessToken'])
  },
  methods: {
    startSever() { // 开始启动服务
      this.startSearching = true
      let reqArr = []
      for (let item of this.selectList) {
        reqArr.push(item._id)
      }
      this.startService(reqArr).then(res => {
        this.startSearching = false
        for (let item of res.data.fail) {
          this.errorMsg(item.serverName + '启动服务失败')
        }
        for (let item of res.data.success) {
          this.successMsg(item.serverName + '启动服务成功')
        }
      }, err => {
        this.startSearching = false
        this.errorMsg('启动服务失败')
      })
    },
    stopSever() { // 停止服务
      this.stopSearching = true
      let reqArr = []
      for (let item of this.selectList) {
        reqArr.push(item._id)
      }
      this.stopService(reqArr).then(res => {
        this.stopSearching = false
        for (let item of res.data.fail) {
          this.errorMsg(item.serverName + '停止服务失败')
        }
        for (let item of res.data.success) {
          this.successMsg(item.serverName + '停止服务成功')
        }
      }, err => {
        this.stopSearching = false
        this.errorMsg('停止服务失败')
      })
    },
    handlecheckedChange() {
      this.selectServerResTree = this.$refs.resTree.getSelectedDeepIds().length
    },
    exportApply() {
      let params = {
        id: this.selectList[0]._id
      }
      this.exportAuthorizationFile(params).then(res => {
        window.open(res.data.url)
      }, err => {
        console.log(err)
      })
    },
    importSuccess(response) {
      // this.peopleValidate.image = response.path
    },
    formatError(file) {
      /* this.$Notice.warning({
        title: '图片格式不正确',
        desc: '图片 ' + file.name + ' 格式不正确，请上传 jpg, png, bmp 或 jpeg 格式的图片。'
      }) */
    },
    exceededSize(file) {
      /* this.$Notice.warning({
        title: '图片大小超过限制',
        desc: '图片 ' + file.name + ' 大小超过限制，请上传小于2M的图片。'
      }) */
    },
    tabToggles({index, tabs}) {
      // eslint-disable-next-line no-unused-vars
      let _t = this
      tabs.forEach(function(item, i) {
        if (i === index) {
          item.isActive = true
          _t.activeFlag = item.label
        } else {
          item.isActive = false
        }
      })
    },
    changeTableHeight() {
      this.$nextTick(() => {
        this.tableHeight = this.$refs['tableBox'].offsetHeight - 135
        this.$refs['resTab'].$on('toggles', this.tabToggles)
      })
    },
    ...mapActions('videoStructuredSetting', [
      'addVideoStructuredServer',
      'delVideoStructuredServer',
      'delVideoStructuredServers',
      'setVideoStructuredServer',
      'getVideoStructuredServer',
      'getVideoStructuredTree',
      'syncLibraryApi',
      'getSocketVideoStructuredChartsOption',
      'exportAuthorizationFile',
      'importAuthorizationFile',
      'startService',
      'stopService'
    ]),
    ...mapMutations('videoStructuredSetting', ['INIT_VIDEO_STRUCTURED_CHARTS_OPTION_Data_STATUS']),
    expand() {
      this.$refs.scroller.update()
    },
    // 获取服务器列表
    async getServer(isRefesh) {
      this.selectList = []
      let param = {
        limit: 10,
        page: this.tablePage.page
      }
      await this.getVideoStructuredServer(param) // 等待promise对象状态变为flulled时才往下执行
      if (isRefesh) {
        // eslint-disable-next-line standard/object-curly-even-spacing
        this.$Notice.success({title: '成功', desc: '刷新成功!' })
      }
    },
    // 点击添加服务器
    addServer() {
      // 获取结构化配置资源未绑定机构树(弹框选择资源机构)
      this.getVideoStructuredTree({_id: ''}).then(res => {
        this.resTree = toTreeData([res.data])
        this.serverResTreeTotal = res['headers']['x-tree-total']
        this.serverResTree = JSON.parse(JSON.stringify(this.resTree))
        videoStructured.selectTreeData([], this.serverResTree)
        this.modal.isAdd = true
        this.modal.showModal = true
        this.modal.formData = {
          algorithm: 'BSR-SM', // 算法
          name: '', // 服务器名称
          code: 1, // 编号
          authNum: 20,
          type: 1,
          ip: '0.0.0.0',
          rtspIp: window.location.hostname === 'localhost' ? IPinfo.IP : window.location.hostname, // window.location.hostname,
          port: '',
          username: 'admin', // 视频结构化服务器用户名
          password: 'intedio', // 视频结构化服务器密码
          res: [
          ]
        }
      }).catch(err => this.errorMsg(err.response.data.message))
    },
    // 点击修改服务器
    setServer(i) {
      // 获取结构化配置资源未绑定和已经绑定的机构树(弹框选择资源机构)
      const item = JSON.parse(JSON.stringify(this.serverPageInfo.list[i]))
      this.getVideoStructuredTree({_id: item._id}).then(res => {
        this.resTree = toTreeData([res.data])
        this.serverResTreeTotal = res['headers']['x-tree-total']
        this.serverResTree = JSON.parse(JSON.stringify(this.resTree))
        videoStructured.selectTreeData(item.res, this.serverResTree)
        if (item.res.length > 0) {
          item.res.forEach(id => {
            this.matchFun(this.modal.orgTreeSC, id)
          })
        }
        // 给formData赋值
        this.modal.formData = item
        this.modal.formData.rtspIp = window.location.hostname === 'localhost' ? IPinfo.IP : window.location.hostname // window.location.hostname
        this.modal.isAdd = false
        this.modal.showModal = true
      })
        .catch(err => this.errorMsg(err.response.data.message))
    },
    // 提交弹框表单
    submitForm() {
      this.modal.formData.rtspIp = window.location.hostname === 'localhost' ? IPinfo.IP : window.location.hostname // window.location.hostname
      this.modal.formData.res = this.$refs.resTree.getSelectedDeepIds() || []
      if (this.modal.formData.res.length > this.modal.formData.authNum) {
        this.warningMsg(`服务器最多绑定${this.modal.formData.authNum}路资源限制`)
        return
      }
      this.loading = true
      if (this.modal.isAdd) {
        this.modal.formData.rtspIp = window.location.hostname === 'localhost' ? IPinfo.IP : window.location.hostname// window.location.hostname
        this.addVideoStructuredServer(this.modal.formData)
          .then(res => {
            this.modal.showModal = false
            this.serverActive = '服务器信息'
            this.showNext = true
            this.loading = false
            this.$Notice.success({ title: '成功', desc: '添加服务器成功!' })
            this.getServer()
          })
          .catch(error => {
            this.loading = false
            // this.errorMsg(error.response.data.message || '网络连接失败')
            // this.getServer()
            if (typeof error.response.data.message === 'object') {
              let str = ''
              error.response.data.message.forEach(item => {
                str += item + ','
              })
              str += '重复绑定'
              this.$Notice.error({ title: '失败', desc: str })
            } else {
              this.$Notice.error({ title: '失败', desc: error.response.data.message })
            }
          })
      } else {
        this.setVideoStructuredServer({
          id: this.modal.formData._id,
          data: this.modal.formData
        })
          .then(res => {
            this.successMsg('修改成功')
            this.modal.showModal = false
            this.serverActive = '服务器信息'
            this.showNext = true
            this.loading = false
            this.getServer()
          })
          .catch(err => {
            // this.getServer()
            // console.error(err)
            this.errorMsg(err.response.data.message || '网络连接失败')
            this.loading = false
          })
        // console.log({ id: this.modal.formData._id, data: this.modal.formData })
      }
    },
    // 删除单个列表数据
    delServer({ _id }) {
      const that = this
      that.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除所选资源吗？</p>',
        onOk: () => {
          that
            .delVideoStructuredServer({ id: _id })
            .then(res => {
              if (this.selectList.length === this.serverPageInfo.list.length) { // 批量删除
                if (this.tablePage.page === this.serverPageInfo.pages) { // 从最后开始按照顺序删除
                  if (this.serverPageInfo.pages > 1) { // 若只有一页的话页码取当前页码
                    this.tablePage.page--
                  }
                }
              }
              that.getServer()
            })
            .catch(err => this.errorMsg(err.response.data.message))
        },
        onCancel: () => {}
      })
    },
    // 所勾选删除所有
    delServers() {
      const that = this
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除所选资源吗？</p>',
        onOk: () => {
          that
            .delVideoStructuredServers(this.selectList.map(item => item._id))
            .then(res => {
              if (this.selectList.length === this.serverPageInfo.list.length) { // 批量删除
                if (this.tablePage.page === this.serverPageInfo.pages) { // 从最后开始按照顺序删除
                  if (this.serverPageInfo.pages > 1) { // 若只有一页的话页码取当前页码
                    this.tablePage.page--
                  }
                }
              }
              this.getServer()
            })
            .catch(erros => {
              this.errorMsg(erros.response.data.message)
            })
        },
        onCancel: () => {}
      })
    },
    // 将选择的赋值给声明的变量
    tableSelect(value) { // 已选项的数据
      // console.log(value)
      this.selectList = value
      if (this.selectList.length === 1) {
        this.uploadFiles = '/api/structure/server/' + this.selectList[0]._id + '/import'
        // /api/structure/server/'+selectList.length+'/import
      } else {
        this.uploadFiles = ''
      }
      /* if (this.selectList.length === 0) { // 全部未勾选
        for (let item1 of this.serverPageInfo.list) {
          // 所有的选项开起禁用
          document.getElementById('amend' + item1.IdIndex).disabled = true
          document.getElementById('sync' + item1.IdIndex).disabled = true
          document.getElementById('delete' + item1.IdIndex).disabled = true
        }
      } else { // 已勾选某些选项
        let arrFilter = JSON.parse(JSON.stringify(this.serverPageInfo.list)) // copy table列表
        for (let i = 0; i < this.selectList.length; i++) {
          document.getElementById('amend' + this.selectList[i].IdIndex).disabled = false // 已选中的关闭禁用
          document.getElementById('sync' + this.selectList[i].IdIndex).disabled = false // 已选中的关闭禁用
          document.getElementById('delete' + this.selectList[i].IdIndex).disabled = false // 已选中的关闭禁用
          for (let n = 0; n < arrFilter.length; n++) {
            if (this.selectList[i].IdIndex === arrFilter[i].IdIndex) { // 删除已选中的选项
              arrFilter.splice(i, 1)
              break
            }
          }
        }
        for (let item of arrFilter) { // 获取未选中的选项添加禁用
          document.getElementById('amend' + item.IdIndex).disabled = true
          document.getElementById('sync' + item.IdIndex).disabled = true
          document.getElementById('delete' + item.IdIndex).disabled = true
        }
      } */
    },
    // 页码变化
    pageChange(page) {
      this.selectList = []
      this.tablePage.page = page
      this.getServer()
    },
    // 关闭弹出框 并清空状态
    cancelModel() {
      this.showNext = true
      this.serverActive = '服务器信息'
      this.modal.showModal = false
      this.modal.formData = JSON.parse(JSON.stringify(formData))
      this.$refs.modelForm.resetFields()
      this.modal.orgTreeSC = JSON.parse(JSON.stringify(this.modal.orgTree))
    },
    // 树的回显
    matchFun(tree, id) {
      tree.forEach(item => {
        if (item) {
          // console.log(`item._id===>${item._id} id===>${id}, ${item._id === id}`)
          if (item._id === id) {
            item.checked = true
          }
          if (item.children) {
            this.matchFun(item.children, id)
          }
        }
      })
    },
    nextBindRes() {
      this.$refs.modelForm.validate(valid => {
        if (valid) {
          let has = false
          this.serverPageInfo.list.map(item => {
            if (item.ip === this.modal.formData.ip && item.port === this.modal.formData.port) {
              has = true
            }
          })
          if (has && this.modal.isAdd) {
            this.warningMsg('该设备已存在！')
          } else {
            this.showNext = false
            this.serverActive = '资源绑定'
            this.selectServerResTree = this.$refs.resTree.getSelectedDeepIds().length
            // console.log(this.$refs.resTree.getSelectedDeepIds())
          }
        }
      })
    },
    backServerEdit() {
      this.showNext = true
      this.serverActive = '服务器信息'
    }
  },
  mounted() {
    this.changeTableHeight()
    this.getSocketVideoStructuredChartsOption()
    setInterValName = setInterval(() => {
      this.getSocketVideoStructuredChartsOption()
    }, 3000)
    window.addEventListener('resize', this.changeTableHeight)
  },
  created() {
    // this.getVideoStructuredOrgTree() // 获取视频机构资源树
    this.modal.formData = JSON.parse(JSON.stringify(formData))
    this.headerObj.Authorization = `Bearer ${this.accessToken}`
    this.getServer() // 获取服务器列表
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(setInterValName)
    this.INIT_VIDEO_STRUCTURED_CHARTS_OPTION_Data_STATUS()
    next()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.changeTableHeight)
    this.$refs['resTab'].$off('toggles')
  }
}
</script>

<style lang="less" scoped>
  @bgcolor: #1c3053;
  .STRUCTURE_SETTING_SERVER {
    flex: 1;
    background: @bgcolor;
    .header-button {
      width: 100%;
      padding: 12px 24px;
      .ivu-btn {
        margin-right: 10px;
        background-color: #3c5073;
      }
    }
    .content {
      padding: 0px;
      .page-warp {
        width: 100%;
        height: 40px;
        background: #244575;
        // line-height: 40px;
        padding: 3px 10px;
        .page {
          float: right;
        }
      }
    }
  }
  .res-add-model {
    padding: 0px 10px;
  }

  .res-model-tree {
    height: 350px;
    width: 400px;
    margin-top: 20px;
  }
  .statusWatch{
    padding: 15px;
  }
.useOrpwd{
  display: inline-block;
  width: 100%;
  height: 32px;
  line-height: 1.5;
  padding: 4px 7px;
  font-size: 12px;
  border: 1px solid #5676a9;
  border-radius: 4px;
  color: #ffffff;
  background-color: #1b3153;
  background-image: none;
  position: relative;
  cursor: text;
  transition: border 0.2s ease-in-out, background 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  -webkit-box-shadow: 0 0 0px 1000px #1b3153 inset;
  -webkit-text-fill-color: #ffffff;
  caret-color: #ffffff;
}
  .useOrpwd:hover{
    border-color: #6badfa;
  }
  .useOrpwd:focus {
    border-color: #6badfa;
    outline: 0;
    box-shadow: 0 0 0 2px rgba(70, 153, 249, 0.2);
    -webkit-box-shadow: 0 0 0px 1000px #1b3153 inset;
    -webkit-text-fill-color: #ffffff;
    caret-color: #ffffff;
  }
  .useOrpwd::-webkit-input-placeholder{
    color: rgba(255,255,255,.7);
  }
</style>
