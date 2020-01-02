<template>
  <div class="VARIFACE_SETTING_SERVER" ref="tableBox">
    <div class="header-button">
      <Button icon="plus" title="添加" @click="addServer">添加</Button>
      <Button :disabled="!selectList.length" @click="delServers" icon="trash-a" title="删除">删除</Button>
    </div>
    <div class="content">
      <Table :columns="columns" :data="tableList" @on-selection-change="tableSelect" ref="tableRef" :height="tableHeight" size="small"></Table>
      <div class="page-warp">
        <div class="page">
          <Page :total="page.count" @on-change="pageChange" :current="page.cur" :page-size="page.limit" show-total show-elevator></Page>
        </div>
      </div>
    </div>
    <div v-if="modal.showModal">
      <Modal v-model="modal.showModal" :mask-closable="false" :title="modal.isAdd ? '添加服务器' : '修改服务器'" :width="450" @on-cancel="cancelModel" @on-ok="submitForm">
        <Tabs :value="serverActive">
          <TabPane disabled label="服务器信息" name="服务器信息">
            <Form ref="modelForm" :model="modal.formData" :rules="modal.formRules" :label-width="100" label-position="left" style="padding:0 20px">
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
              <Form-item label="服务器限制" prop="limit">
                <Input v-model="modal.formData.limit" placeholder="请输入"></Input>
              </Form-item>
              <Form-item label="分析类型" prop="AnalysisType" :disabled="true">
                <Input v-model="modal.formData.AnalysisType" placeholder="请输入" :disabled="true"></Input>
              </Form-item>
              <Form-item label="IP地址" prop="ip">
                <Ipv4 v-model="modal.formData.ip" ref="ipv4"></Ipv4>
              </Form-item>
              <Form-item label="端口" prop="port">
                <Input v-model="modal.formData.port" placeholder="请输入"></Input>
              </Form-item>
            </Form>
          </TabPane>
          <TabPane disabled label="资源绑定" name="资源绑定">
            <p>选择资源，将资源添加至对应的服务器分析任务中</p>
            <div class="res-add-model" style="height:350px">
              <bs-scroll ref="scroller" class="res-model-tree">
                <VTree ref="resTree" :treeData="serverResTree" :options="modal.optionsTree" @creatTreeEnd='expand' @loadMore="expand" @on-expand="expand">
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
</template>

<script >
import Ipv4 from 'components/BSIPV4.vue'
import { mapActions, mapState } from 'vuex'
import veriface from './../common/veriface.js'
import toTreeData from '../../../assets/js/toTreeData.js'

const formData = {
  algorithm: 'BSR-KSSDK', // 算法
  name: '', // 服务器名称
  code: '', // 编号
  limit: 13,
  AnalysisType: '实时流',
  type: 1,
  ip: '0.0.0.0',
  rtspIp: window.location.hostname,
  port: '',
  uname: '',
  pwd: '',
  res: [
    // {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Resource'
    // }
  ]
}
export default {
  components: {
    Ipv4
  },
  props: {
    temp: {}
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
      // 服务器的编号 16 个字符限制，支持数字、字母和下划线
      code: (rule, value, callback) => {
        const r = /^[\da-zA-Z_]{1,16}$/
        if (!value.length) {
          callback(new Error('请输入服务器编号!'))
        } else if (!r.test(value)) {
          callback(new Error('请输入16位以内的数字、字母或下划线!'))
        } else {
          callback()
        }
      },
      limit: (rule, value, callback) => {
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
                    size: 'small'
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
                    size: 'small'
                  },
                  style: {
                    marginLeft: '10px'
                  },
                  on: {
                    click: () => {
                      // console.log(params)
                      this.syncLibraryApi(params.row._id)
                        .then(res => {
                          if (res.data.length === 0) {
                            this.$Notice.success({ title: '成功', desc: '同步成功!' })
                          } else {
                            this.$Notice.warning({ title: '警告', desc: `其中${res.data.length}位同步未成功!` })
                          }
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
                    size: 'small'
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
      tableList: [],
      // 选择的列表
      selectList: [],
      modal: {
        // 是否是添加
        isAdd: true,
        showModal: false,
        formData: {
          algorithm: 'BSR-KSSDK', // 算法
          name: '', // 服务器名称
          code: '', // 编号
          limit: 0,
          AnalysisType: '实时流',
          type: 1,
          ip: '0.0.0.0',
          port: '',
          uname: '',
          rtspIp: window.location.hostname,
          pwd: '',
          res: [
            // {
            //   type: Schema.Types.ObjectId,
            //   ref: 'Resource'
            // }
          ]
        },
        formRules: {
          name: [{ required: true, validator: rules.name, trigger: 'blur' }],
          code: [{ required: true, validator: rules.code, trigger: 'change' }],
          limit: [{ required: true, validator: rules.limit, trigger: 'change' }],
          port: [{ required: true, validator: rules.port, trigger: 'change' }],
          uname: [{ required: true, message: '不能为空', trigger: 'blur' }],
          pwd: [{ required: true, message: '不能为空', trigger: 'blur' }]
        },
        // 算法厂商算法
        algorithmList: [
          {
            value: 'BSR-KSSDK',
            label: 'BSR-KSSDK'
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
      loading: false
    }
  },
  computed: {
    ...mapState({
      verifaceResTree: state => state.veriface.faceResTree,
      page: state => state.veriface.serverPageInfo
    })
  },
  methods: {
    ...mapActions([
      'addVerifaceServer',
      'delVerifaceServer',
      'delVerifaceServers',
      'setVerifaceServer',
      'getVerifaceServer',
      'getVerifaceTree',
      'syncLibraryApi',
      'getVerifaceOrgTree'
    ]),
    expand() {
      this.$refs.scroller.update()
    },
    // 获取服务器列表
    getServer(page) {
      let param = {
        limit: 10
      }
      if (page) {
        param.page = page
      }
      this.getVerifaceServer(param)
        .then(res => {
          this.tableList = res.data.results
        })
        .catch(() => {
          this.$Notice.error({ title: '错误', desc: '获取服务器列表失败!' })
        })
    },
    // 点击添加服务器
    addServer() {
      this.serverResTree = JSON.parse(JSON.stringify(this.resTree))
      veriface.selectTreeData([], this.serverResTree)
      this.modal.isAdd = true
      this.modal.showModal = true
      this.modal.formData = {
        algorithm: 'BSR-KSSDK', // 算法
        name: '', // 服务器名称
        code: '', // 编号
        limit: 13,
        AnalysisType: '实时流',
        type: 1,
        ip: '0.0.0.0',
        rtspIp: window.location.hostname,
        port: '',
        uname: '',
        pwd: '',
        res: [
          // {
          //   type: Schema.Types.ObjectId,
          //   ref: 'Resource'
          // }
        ]
      }
    },
    // 点击修改服务器
    setServer(i) {
      this.serverResTree = JSON.parse(JSON.stringify(this.resTree))
      const item = JSON.parse(JSON.stringify(this.tableList[i]))
      veriface.selectTreeData(item.res, this.serverResTree)
      if (item.res.length > 0) {
        item.res.forEach(id => {
          this.matchFun(this.modal.orgTreeSC, id)
        })
      }
      this.modal.formData = item
      this.modal.formData.rtspIp = window.location.hostname
      this.modal.isAdd = false
      this.modal.showModal = true
    },
    // 提交表单
    submitForm() {
      // console.log(this.$refs.resTree.getSelectedNodeIds())
      // return
      this.modal.formData.rtspIp = window.location.hostname
      this.modal.formData.res = this.$refs.resTree.getSelectedDeepIds() || []
      if (this.modal.formData.res.length > this.modal.formData.limit) {
        this.warningMsg(`服务器最多绑定${this.modal.formData.limit}路资源限制`)
        return
      }
      this.loading = true
      if (this.modal.isAdd) {
        this.modal.formData.rtspIp = window.location.hostname
        this.addVerifaceServer(this.modal.formData)
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
            this.getServer()
            if (typeof error.response.data.message === 'object') {
              let str = ''
              error.response.data.message.forEach(item => {
                str += item + ','
              })
              str += '重复绑定'
              this.$Notice.error({ title: '失败', desc: str })
              return
            }
            this.$Notice.error({ title: '失败', desc: '添加失败！' })
          })
      } else {
        this.setVerifaceServer({
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
            this.getServer()
            console.error(err)
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
            .delVerifaceServer({ id: _id })
            .then(res => {
              that.getServer()
            })
            .catch(err => this.errorMsg(err.response.data.message))
        },
        onCancel: () => {}
      })
    },
    // 所勾选删除
    delServers() {
      // console.log('===>', this.selectList.map(item => item._id))
      const that = this
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除所选资源吗？</p>',
        onOk: () => {
          that
            .delVerifaceServers(this.selectList.map(item => item._id))
            .then(res => {
              this.getServer()
            })
            .catch(erros => {
              this.errorMsg(erros.response.data.message)
              console.log('delVerifaceServers===>', erros)
            })
        },
        onCancel: () => {}
      })
    },
    // 将选择的赋值给声明的变量
    tableSelect(value) {
      // console.log(value)
      this.selectList = value
    },
    // 页码变化
    pageChange(page) {
      this.getServer(page)
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
          this.tableList.map(item => {
            if (item.ip === this.modal.formData.ip && item.port === this.modal.formData.port) {
              has = true
            }
          })
          if (has && this.modal.isAdd) {
            this.warningMsg('该设备已存在！')
          } else {
            this.showNext = false
            this.serverActive = '资源绑定'
          }
        }
      })
    },
    backServerEdit() {
      this.showNext = true
      this.serverActive = '服务器信息'
    }
  },
  created() {
    this.getVerifaceOrgTree()
    this.modal.formData = JSON.parse(JSON.stringify(formData))
    this.getServer()
    this.getVerifaceTree()
      .then(res => {
        this.resTree = toTreeData([res.data])
      })
      .catch(err => this.errorMsg(err.response.data.message))
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight - 95
  }
}
</script>

<style lang="less" scoped>
@bgcolor: #1c3053;
.VARIFACE_SETTING_SERVER {
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
</style>
