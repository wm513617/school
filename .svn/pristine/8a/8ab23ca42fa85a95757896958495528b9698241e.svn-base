<template>
<div class="diagnose-serve bs-content">
    <div class="ds-main" ref='height'>
        <div class="ds-main-header">
            <Button type='ghost' class='commonStyle ivu-btn ivu-btn-ghost' icon="ivu-icon ivu-icon-plus" @click="serveAdd" :disabled="isServeOnly">添加</Button>
            <Button type="ghost" class='commonStyle ivu-btn ivu-btn-ghost' icon="edit" @click="updateServe" :disabled="isServeChecked">修改</Button>
            <Button type='ghost' class='commonStyle ivu-btn ivu-btn-ghost' icon="ios-trash-outline" @click="deleteServe" :disabled="isServeChecked">删除</Button>
            <Button type="ghost" class='commonStyle ivu-btn ivu-btn-ghost' icon="android-refresh" @click="refreshList">刷新</Button>
        </div>
        <div class="ds-main-list">
          <div class="ds-table">
            <Table highlight-row size="small" :columns="serveColumns" :data="serveListData" :height="tableHeight" @on-selection-change="selectServeRow"></Table>
          </div>
        </div>
        <div class="ds-main-page">
            <Page class="rt" show-sizer :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" :current='Number(startNum)' :total="Number(inPageNum)" :page-size="Number(pageLimit)" @on-change="pageChange" show-elevator show-total></Page>
        </div>
        <Modal v-model="serveModal" :title="isServeAdd ? '添加服务器' : '修改服务器'" @on-ok="determine" @on-cancel="cancel">
            <Form ref="serverFormData" :model="serverFormData" :rules="ruleValidate" :label-width="80" label-position="left" style="margin:0px 12px">
                <FormItem label="服务器类型" prop="type">
                    <Select v-model="serverFormData.type" placeholder="请输入服务类型">
                        <Option v-for="(v, n) in serveTypes" :value="v.value" :key="n">{{v.label}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="名称" prop="name">
                    <Input v-model="serverFormData.name" placeholder="请输入名称"></Input>
                </FormItem>
                <FormItem label="IP地址" prop="ip">
                    <Bsipv4 v-model="serverFormData.ip" v-if="isSingleAdd || isEditDevice"></Bsipv4>
                </FormItem>
                <FormItem label="端口" prop="port">
                    <Input v-model="serverFormData.port" placeholder="请输入端口" :minlength=1 :maxlength=5></Input>
                </FormItem>
                <FormItem label="备注信息" prop="remark">
                    <Input v-model="serverFormData.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="备注信息..."></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type='ghost' class='ivu-btn ivu-btn-ghost' @click="cancel">取消</Button>
                <Button type='primary' class='ivu-btn ivu-btn-ghost' @click="determine('serverFormData')">确定</Button>
            </div>
        </Modal>
    </div>
</div>
</template>

<script>
import Bsipv4 from 'src/components/BSIPV4.vue'
import { mapState, mapActions } from 'vuex'
import deviceValidate from '../equipment/deviceValidate.js'
export default {
  components: {
    Bsipv4
  },
  data() {
    return {
      // 弹出框form表单数据
      serverFormData: {
        type: '',
        name: '',
        ip: '0.0.0.0',
        port: '8061',
        remark: ''
      },
      serveTypes: [
        {
          value: '0',
          label: '视频诊断服务器'
        }
      ],
      ruleValidate: {
        name: [
          { required: true, message: '请输入名称', trigger: 'change' },
          { type: 'string', max: 64, message: '名称不能超过64字符', trigger: 'change' },
          { validator: deviceValidate.noSpace, trigger: 'change' }
        ],
        ip: [{ required: true, message: '请输入IP地址', trigger: 'change' }],
        port: [{ required: true, validator: deviceValidate.dePort, trigger: 'change' }],
        remark: [
          { message: 'Please enter a personal introduction', trigger: 'change' },
          { type: 'string', max: 128, message: '不能超过128个字符', trigger: 'change' }
        ]
      },
      // 表头
      serveColumns: [
        {
          type: 'selection',
          width: 90,
          align: 'center'
        },
        {
          type: 'index',
          width: 200,
          align: 'center',
          title: '序号'
        },
        {
          title: '服务器名称',
          key: 'name',
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
                  title: params.row['name']
                }
              },
              params.row['name']
            )
          }
        },
        {
          title: 'IP地址',
          key: 'ip'
        },
        {
          title: '端口',
          key: 'port'
        },
        {
          title: '备注',
          key: 'remark',
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
                  title: params.row['remark']
                }
              },
              params.row['remark']
            )
          }
        }
      ],
      // 页码
      startNum: 1,
      // 数据总条数
      inPageNum: '',
      // 每页条数
      pageLimit: this.$PageInfo.limit,
      // 表格高度
      tableHeight: '',
      // 添加、修改框是否显示
      serveModal: false,
      // 是否为添加
      isServeAdd: true,
      // 修改按钮置灰
      isServeChecked: true,
      isSingleAdd: true,
      // 选中项id
      selectedIndex: [],
      isServeOnly: false
    }
  },
  computed: {
    ...mapState({
      // 服务器列表数据
      serveListData: ({ opsConfig }) => opsConfig.serveListData,
      serveUpdateData: ({ opsConfig }) => opsConfig.serveUpdateData
    })
  },
  methods: {
    ...mapActions([
      'getServeListData',
      'postServeDataAdd',
      'putServeDataUpdate',
      'removeServeDataDelete',
      'getServeDetails'
    ]),
    /**
    添加、修改确定按钮
     */
    determine(name) {
      // 添加服务器
      if (this.isServeAdd) {
        this.$refs[name].validate(valid => {
          if (valid) {
            this.serverFormData.port = Number(this.serverFormData.port)
            this.postServeDataAdd(this.serverFormData)
              .then(res => {
                this.successMsg('添加成功')
                this.getServeList()
                this.serveModal = false
              })
              .catch(() => {
                this.errorMsg('添加服务器失败')
              })
          }
        })
      } else {
        // 修改服务器
        this.$refs[name].validate(valid => {
          if (valid) {
            // const body = JSON.parse(JSON.stringify(this.serverFormData))
            this.serverFormData.port = Number(this.serverFormData.port)
            this.putServeDataUpdate({ id: this.selectedIndex[0], content: this.serverFormData })
              .then(res => {
                this.successMsg('修改成功')
                this.getServeList()
                this.serveModal = false
                this.isServeChecked = true
              })
              .catch(() => {
                this.errorMsg('修改服务器失败')
              })
          }
        })
      }
    },
    /**
    弹出框点击取消按钮
     */
    cancel() {
      this.serveModal = false
    },
    /**
    获取服务器列表
     */
    getServeList(n) {
      const query = {
        pagesize: this.pageLimit, // 每页条数
        page: this.startNum, // 页码
        type: 0 // 类型
      }
      this.getServeListData(query)
        .then(res => {
          this.inPageNum = this.serveListData.length
          if (n === 1) {
            this.successMsg('刷新成功')
          }
          if (this.inPageNum === 0) {
            this.isServeChecked = true
            this.isServeOnly = false
          } else if (this.inPageNum === 1) {
            this.isServeOnly = true
          }
        })
        .catch(() => {
          if (n === 1) {
            this.errorMsg('刷新失败')
          } else {
            this.errorMsg('列表获取失败')
          }
        })
    },
    /**
    点击添加按钮
     */
    serveAdd() {
      this.serveModal = true
      this.isServeAdd = true
      this.$refs['serverFormData'].resetFields()
    },
    /**
    点击修改按钮
    */
    updateServe() {
      if (this.selectedIndex.length !== 1) {
        this.$Modal.confirm({
          title: '提示',
          content: '一次只能修改一个！'
        })
      } else {
        this.serveModal = true
        this.isServeAdd = false
        // 修改数据挂载
        this.getServeDetails(this.selectedIndex[0])
          .then(() => {
            // console.log(this.serveUpdateData, '选中行数据')
            this.serverFormData.port = Number(this.serveUpdateData.port)
            this.serverFormData.name = this.serveUpdateData.name
            this.serverFormData.ip = this.serveUpdateData.ip
            this.serverFormData.remark = this.serveUpdateData.remark
          })
          .catch(() => {
            this.errorMsg('获取修改详情失败')
          })
      }
    },
    /**
     点击删除按钮
     */
    deleteServe() {
      if (this.selectedIndex.length === 0) {
        this.warningMsg('请选择需要删除的服务器')
        return
      }
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除所选维修单位吗？</p>',
        onOk: () => {
          this.serveDelete()
        },
        onCancel: () => {}
      })
    },
    /**
     * 删除所选项
     */
    serveDelete() {
      this.removeServeDataDelete(this.selectedIndex)
        .then(() => {
          this.successMsg('删除成功')
          // this.isServeChecked = false
          this.getServeList()
        })
        .catch(() => {
          this.errorMsg('删除失败')
        })
    },
    /**
     刷新列表
     */
    refreshList() {
      this.getServeList(1)
      this.isServeChecked = true
    },
    /**
     选中项改变执行
     */
    selectServeRow(sel) {
      this.selectedIndex = []
      if (sel.length === 0) {
        this.isServeChecked = true
      } else {
        this.isServeChecked = false
      }
      sel.forEach((v, n) => {
        this.selectedIndex.push(v._id)
      })
    },
    /**
     * 每页条数改变
     */
    pageSizeChange(n) {
      this.pageLimit = n
      this.getServeList()
    },
    /**
     * 页码改变调用
     */
    pageChange(n) {
      this.startNum = n
      this.getServeList()
    },
    /**
     * 表格高度自适应
     */
    resizefun() {
      this.tableHeight = this.$refs['height'].offsetHeight - 103
    }
  },
  created() {
    this.getServeList()
    this.serverFormData.type = this.serveTypes[0].value
  },
  mounted() {
    this.tableHeight = this.$refs['height'].offsetHeight - 103
    window.addEventListener('resize', this.resizefun)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizefun)
    this.resizefun = null
  }
}
</script>

<style scoped>
.ds-main {
  width: 100%;
  height: 100%;
  flex: 1;
  min-height: 678px;
  background: #1c3053;
  position: relative;
  overflow: hidden;
}
.ds-main-list {
  position: relative;
  width: 100%;
  height: calc(100% - 103px);
}
.ds-table {
  position: absolute;
  width: 100%;
  box-sizing: border-box;
}
.ds-main-header {
  padding: 16px 0 16px 24px;
}
.commonStyle {
  margin-right: 8px;
  height: 32px;
  /* line-height: 32px; */
}
.ds-main-page {
  width: 100%;
  border-top: none;
  padding: 3px 24px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #244575;
}
.rt {
  float: right;
}
</style>
