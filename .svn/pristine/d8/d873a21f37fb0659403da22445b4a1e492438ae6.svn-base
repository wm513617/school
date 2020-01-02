<template>
  <div class="bs-main serverTenRow main-page-bg" ref="tableBox">
    <div class="table-header">
      <Button v-if="$BShasPower('BS-SETTING-VEHICLE-SERVER')" type="ghost" @click="serverShow('add')" icon="plus">添加</Button>
      <Button v-if="$BShasPower('BS-SETTING-VEHICLE-SERVER')" type="ghost" @click="serverRemoveBatch" icon="trash-a" :disabled="isRemove">删除</Button>
    </div>
    <div class="table-content">
      <div class="table-body">
        <Table :height="tableHeight" size="small" :highlight-row="true" :columns="columnsServer" :data="serverList.list" @on-selection-change="serverCheck"></Table>
        <div class="table-footer">
          <div style="float: right;">
            <Page show-total show-elevator :total="serverList.count" :current="serverList.curPage" :page-size='serverList.limit' @on-change="changePage"></Page>
          </div>
        </div>
      </div>
    </div>
    <div v-if="hasServerModel">
      <Modal v-model="hasServerModel" :mask-closable="false" :title="title" :width="450">
        <div>
          <Form ref="serverValidate" :model="serverItem" :rules="serverRuleValidate" :label-width="100" label-position="left" style="padding:0 10px">
            <Form-item label="服务器名称" prop="name">
              <Input v-model="serverItem.name" placeholder="请输入"></Input>
            </Form-item>
            <Form-item label="服务器编号" prop="code">
              <Input v-model="serverItem.code" placeholder="请输入"></Input>
            </Form-item>
            <Form-item label="算法厂商" prop="vender">
              <Select v-model="serverItem.vender" placeholder="请选择">
                <Option v-for="item in venderList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </Form-item>
            <Form-item label="算法型号" prop="model">
              <Select v-model="serverItem.model" placeholder="请选择">
                <Option v-for="item in modelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </Form-item>
            <Form-item label="IP地址" prop="ip">
              <Bsipv4 v-model="serverItem.ip"></Bsipv4>
            </Form-item>
            <Form-item label="端口" prop="port">
              <Input v-model="serverItem.port" placeholder="请输入"></Input>
            </Form-item>
            <Form-item label="WEB端口" prop="webport">
              <Input v-model="serverItem.webport" placeholder="请输入"></Input>
            </Form-item>
          </Form>
        </div>
        <div slot="footer">
          <Button type="ghost" @click="serverCancel">取消</Button>
          <Button type="primary" @click="serverOk(title)">确定</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import Bsipv4 from '../../../components/BSIPV4.vue'
import './row.css'
export default {
  components: {
    Bsipv4
  },
  data() {
    const validatePort = (rule, value, callback) => {
      if (value) {
        if ((Number(value) && Number(value) > 0 && Number(value) <= 65535) || Number(value) === 0) {
          return callback()
        } else {
          return callback(new Error('请输入有效数字'))
        }
      } else {
        return callback(new Error('不可以为空'))
      }
    }
    return {
      page: 1,
      title: '',
      serverData: {
        type: 1,
        name: '',
        code: '',
        vender: 'BSR-SM',
        model: '实时流算法',
        ip: '0.0.0.0',
        port: '',
        webport: ''
      },
      tableHeight: 433,
      serverItem: {},
      hasServerModel: false,
      serverCheckAll: [],
      columnsServer: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '名称',
          key: 'name',
          ellipsis: true
        },
        {
          title: '编号',
          key: 'code',
          ellipsis: true
        },
        {
          title: '算法厂商',
          key: 'vender',
          ellipsis: true
        },
        {
          title: '算法型号',
          key: 'model',
          ellipsis: true
        },
        {
          title: 'IP地址',
          key: 'ip',
          ellipsis: true
        },
        {
          title: '端口',
          key: 'port',
          ellipsis: true
        },
        {
          title: 'WEB端口',
          key: 'webport',
          ellipsis: true
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          render: (h, params) => {
            if (this.$BShasPower('BS-SETTING-VEHICLE-SERVER')) {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'ghost',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.serverShow('edit', params)
                      }
                    }
                  },
                  '修改'
                ),
                h(
                  'Button',
                  {
                    props: {
                      type: 'ghost',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.serverRemove(params)
                      }
                    }
                  },
                  '删除'
                )
              ])
            }
          }
        }
      ],
      serverRuleValidate: {
        name: [
          {
            required: true,
            validator: this.$bsValidate.validateStr,
            trigger: 'change'
          }
        ],
        code: [{ validator: this.$bsValidate.validateHasStr, trigger: 'change' }],
        vender: [{ required: true, message: '厂商不能为空', trigger: 'change' }],
        model: [{ required: true, message: '型号不能为空', trigger: 'change' }],
        ip: [{ required: true, message: 'ip地址不能为空', trigger: 'blur' }],
        port: [{ required: true, validator: validatePort, trigger: 'change' }],
        webport: [{ required: true, validator: validatePort, trigger: 'change' }]
      },
      venderList: [
        {
          value: 'BSR-SM',
          label: 'BSR-SM'
        }
      ],
      modelList: [
        {
          value: '实时流算法',
          label: '实时流算法'
        },
        {
          value: '图片分析',
          label: '图片分析'
        }
      ],
      // 按钮禁用
      isRemove: true
    }
  },
  computed: {
    ...mapState({
      serverList: state => state.vehicle.serverList
    }),
    ...mapGetters(['tipErrorConfig'])
  },
  methods: {
    ...mapActions(['getServerList', 'serverAdd', 'serverEdit', 'serverDelete', 'serverBatchDelete']),
    serverShow(str, param) {
      str === 'add' ? (this.title = '添加服务器') : (this.title = '修改服务器')
      str === 'add'
        ? (this.serverItem = JSON.parse(JSON.stringify(this.serverData)))
        : (this.serverItem = JSON.parse(JSON.stringify(param.row)))
      this.hasServerModel = true
    },
    serverCancel() {
      this.hasServerModel = false
      this.$refs['serverValidate'].resetFields()
    },
    serverOk(str) {
      this.$refs['serverValidate'].validate(valid => {
        if (!valid) {
          // this.$Notice.error({ title: '表单验证失败!' })
        } else {
          if (str === '添加服务器') {
            this.serverAdd(this.serverItem)
              .then(() => {
                this.getServerList(1)
                this.hasServerModel = false
                this.$refs['serverValidate'].resetFields()
                this.successMsg('添加成功')
              })
              .catch(err => {
                if (this.tipErrorConfig.show) {
                  this.$Notice.error({
                    title: '添加服务器失败!',
                    duration: this.tipErrorConfig.dur
                  })
                }
                console.log('serverAdd error: ' + err)
              })
          } else if (str === '修改服务器') {
            this.serverEdit(this.serverItem)
              .then(() => {
                this.getServerList(this.page)
                this.hasServerModel = false
                this.$refs['serverValidate'].resetFields()
                this.successMsg('修改成功')
              })
              .catch(err => {
                if (this.tipErrorConfig.show) {
                  this.$Notice.error({
                    title: '修改服务器失败!',
                    duration: this.tipErrorConfig.dur
                  })
                }
                console.log('serverEdit error: ' + err)
              })
          }
        }
      })
    },
    serverRemove(param) {
      const _this = this
      this.$Modal.confirm({
        title: '警告',
        content: '确定删除吗?',
        cancelText: '取消',
        onOk: function() {
          _this
            .serverDelete({ _id: param.row._id, type: 1 })
            .then(() => {
              if (_this.serverList.list.length === 1) {
                _this.getServerList(1)
                _this.page = 1
              } else {
                _this.getServerList(_this.page)
              }
            })
            .catch(err => {
              if (_this.tipErrorConfig.show) {
                _this.$Notice.error({
                  title: err.response.data.message,
                  duration: _this.tipErrorConfig.dur
                })
              }
              console.log('serverRemove error: ' + err)
            })
        }
      })
    },
    serverCheck(val) {
      this.serverCheckAll = val
      if (this.serverCheckAll.length > 0) {
        this.isRemove = false
      } else {
        this.isRemove = true
      }
    },
    serverRemoveBatch() {
      if (this.serverCheckAll.length > 0) {
        const _this = this
        this.$Modal.confirm({
          title: '警告',
          content: '确定删除吗?',
          cancelText: '取消',
          onOk: function() {
            const idList = []
            _this.serverCheckAll.forEach(item => {
              idList.push(item._id)
            })
            _this
              .serverBatchDelete({ idList: idList, type: 1 })
              .then(() => {
                if (_this.serverList.list.length === idList.length) {
                  if (_this.page === _this.serverList.pages) {
                    _this.getServerList(1)
                    _this.page = 1
                  } else {
                    _this.getServerList(_this.page)
                  }
                } else {
                  _this.getServerList(_this.page)
                }
              })
              .catch(err => {
                if (_this.tipErrorConfig.show) {
                  _this.$Notice.error({
                    title: err.response.data.message,
                    duration: _this.tipErrorConfig.dur
                  })
                }
                console.log('serverRemoveBatch error: ' + err)
              })
          }
        })
      }
    },
    changePage(n) {
      this.page = n
      this.getServerList(n)
    }
  },
  created() {
    this.getServerList(1)
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight - 95
  },
  watch: {}
}
</script>
<style scoped>
.serverTenRow .table-content {
  position: relative;
  height: 432px;
}

.serverTenRow .table-content .table-body {
  position: absolute;
  width: 100%;
  height: 100%;
}

.bs-main {
  flex-direction: column;
  overflow: hidden;
}
.table-header {
  padding: 12px 20px;
}

.table-header button {
  margin-right: 10px;
}
</style>
