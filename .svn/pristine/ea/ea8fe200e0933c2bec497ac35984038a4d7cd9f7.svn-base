<template>
  <div class="bs-main serverTenRow main-page-bg">
    <div class="table-header">
      <Button v-if="$BShasPower('BS-SETTING-FACE-SERVER')" type="ghost" @click="serverShow('add')" icon="plus">添加</Button>
      <Button v-if="$BShasPower('BS-SETTING-FACE-SERVER')" type="ghost" @click="serverRemoveBatch" icon="trash-a" :disabled="isRemove">删除</Button>
    </div>
    <div class="table-content">
      <div class="table-body">
        <Table height="412" size="small" :highlight-row="true" :columns="columnsServer" :data="serverList.list" @on-selection-change="serverCheck"></Table>
      </div>
    </div>
    <div class="table-footer">
      <div style="float: right;">
        <Page show-total show-elevator :total="serverList.count" :current="serverList.curPage" :page-size='serverList.limit' @on-change="changePage"></Page>
      </div>
    </div>
    <div v-if="hasServerModel">
      <Modal v-model="hasServerModel" :mask-closable="false" :title="title" :width="450" @on-cancel="serverCancel">
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
            <Form-item label="IP地址" prop="ip">
              <Bsipv4 ref="ipv4" :isLegal="true" v-model="serverItem.ip"></Bsipv4>
            </Form-item>
            <Form-item label="端口" prop="port">
              <Input v-model="serverItem.port" placeholder="请输入"></Input>
            </Form-item>
            <Form-item label="用户名" prop="username">
              <Input v-model="serverItem.username" placeholder="请输入"></Input>
            </Form-item>
            <Form-item label="密码" prop="password">
              <Input v-model="serverItem.password" type="password" placeholder="请输入"></Input>
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
import '../carPage/row.css'
export default {
  components: {
    Bsipv4
  },
  data() {
    const validatePort = (rule, value, callback) => {
      if (value) {
        if (Number(value) && Number(value) > 0 && Number(value) <= 65535) {
          return callback()
        } else if (Number(value) === 0) {
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
        type: 0,
        name: '',
        code: '',
        vender: 'BSR-KS',
        ip: '0.0.0.0',
        port: '',
        username: '',
        password: ''
      },
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
          title: '操作',
          key: 'action',
          width: 150,
          render: (h, params) => {
            if (this.$BShasPower('BS-SETTING-FACE-SERVER')) {
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
                    click: () => {
                      this.serverShow('edit', params)
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {
                    type: 'ghost',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.serverRemove(params)
                    }
                  }
                }, '删除')
              ])
            }
          }
        }
      ],
      serverRuleValidate: {
        name: [
          { required: true, validator: this.$bsValidate.validateStr, trigger: 'change' }
        ],
        code: [
          { validator: this.$bsValidate.validateHasStr, trigger: 'change' }
        ],
        vender: [
          { required: true, message: '厂商不能为空', trigger: 'change' }
        ],
        ip: [
          { required: true, message: 'ip地址不能为空', trigger: 'blur' }
        ],
        port: [
          { required: true, validator: validatePort, trigger: 'change' }
        ],
        username: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      venderList: [
        {
          value: 'BSR-KS',
          label: 'BSR-KS'
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
    ...mapActions(['getFaceServerList', 'serverAdd', 'serverEdit', 'serverDelete', 'serverBatchDelete']),
    serverShow(str, param) {
      str === 'add' ? this.title = '添加服务器' : this.title = '修改服务器'
      str === 'add' ? this.serverItem = JSON.parse(JSON.stringify(this.serverData)) : this.serverItem = JSON.parse(JSON.stringify(param.row))
      this.hasServerModel = true
    },
    serverCancel() {
      this.hasServerModel = false
      this.$refs['serverValidate'].resetFields()
    },
    serverOk(str) {
      this.$refs['serverValidate'].validate((valid) => {
        if (!valid) {
          // this.$Notice.error({title: '表单验证失败!'})
        } else {
          if (this.$refs.ipv4.warning !== '') {
            return this.warningMsg('请填写合法的ip地址！')
          }
          if (str === '添加服务器') {
            this.serverAdd(this.serverItem).then(() => {
              this.getFaceServerList(1)
              this.hasServerModel = false
              this.$refs['serverValidate'].resetFields()
              this.successMsg('添加成功')
            }).catch((err) => {
              if (this.tipErrorConfig.show) {
                this.$Notice.error({ title: '添加服务器失败!', duration: this.tipErrorConfig.dur })
              }
              console.log('serverAdd error: ' + err)
            })
          } else if (str === '修改服务器') {
            this.serverEdit(this.serverItem).then(() => {
              this.getFaceServerList(this.page)
              this.hasServerModel = false
              this.$refs['serverValidate'].resetFields()
              this.successMsg('修改成功')
            }).catch((err) => {
              if (this.tipErrorConfig.show) {
                this.$Notice.error({ title: '修改服务器失败!', duration: this.tipErrorConfig.dur })
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
          _this.serverDelete({ _id: param.row._id, type: 2 }).then(() => {
            if (_this.serverList.list.length === 1) {
              _this.getFaceServerList(1)
              _this.page = 1
            } else {
              _this.getFaceServerList(_this.page)
            }
            this.successMsg('删除成功')
          }).catch(err => {
            if (_this.tipErrorConfig.show) {
              _this.$Notice.error({ title: err.response.data.message, duration: _this.tipErrorConfig.dur })
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
            let idList = []
            _this.serverCheckAll.forEach(item => {
              idList.push(item._id)
            })
            _this.serverBatchDelete({ idList: idList, type: 2 }).then(() => {
              _this.isRemove = true
              if (_this.serverList.list.length === idList.length) {
                if (_this.page === _this.serverList.pages) {
                  _this.getFaceServerList(1)
                  _this.page = 1
                } else {
                  _this.getFaceServerList(_this.page)
                }
              } else {
                _this.getFaceServerList(_this.page)
              }
              this.successMsg('删除成功')
            }).catch(err => {
              if (_this.tipErrorConfig.show) {
                _this.$Notice.error({ title: err.response.data.message, duration: _this.tipErrorConfig.dur })
              }
              console.log('serverRemoveBatch error: ' + err)
            })
          }
        })
      }
    },
    changePage(n) {
      this.page = n
      this.getFaceServerList(n)
    }
  },
  created() {
    this.getFaceServerList(1)
  },
  watch: {
  }
}
</script>
<style scoped>
  .serverTenRow .table-content {
    position: relative;
    height: 412px;
  }

  .serverTenRow .table-content .table-body {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .bs-main {
    flex-direction: column;
    position: relative;
  }

  .table-header {
    padding: 12px 24px;
  }

  .table-header button {
    margin-right: 10px;
  }
  .table-footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
