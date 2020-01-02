<template>
  <div class="serverConfig">
    <div class="bsMainChild">
      <div class="tab-content-alarm">
        <div class="feature-btn">
          <Button class="btn" v-if="$BShasPower('BS-SETTING-DOOR-SERVER')" @click="openModAdd(modalTitles[0])" type="ghost" icon="plus">添加</Button>
          <Button class="btn" v-if="$BShasPower('BS-SETTING-DOOR-SERVER')" :disabled="operateData" @click="openModMod(modalTitles[1])" type="ghost" icon="edit">修改</Button>
          <Button class="btn" v-if="$BShasPower('BS-SETTING-DOOR-SERVER')" :disabled="operateData" @click="delAlarm" type="ghost" icon="trash-a">删除</Button>
          <Button class="btn" v-if="$BShasPower('BS-SETTING-DOOR-SERVER')" :disabled="operateData" type="ghost" icon="ios-copy-outline">复制</Button>
          <Button class="btn" type="ghost" icon="refresh" @click="refash">刷新</Button>
        </div>
        <div class="table-relative" ref = 'tableBox'>
          <Table v-if = 'tableHeight && tableWidth' ref='currentRowTable' size = "small" :columns = "importTitle" :data = "dataSource" :height = "tableHeight" :width= 'tableWidth' :highlight-row = "true" @on-current-change = "alarmInSel"></Table>
        </div>
        <div class="page-style">
          <Page class="rt" show-sizer :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" :current="Number(current)" :total="Number(total)" :page-size="Number(limit)" @on-change="pageChange" show-elevator :show-total="true"></Page>
        </div>
      </div>
      <!--添加-->
      <Modal v-model="modal" :title="modalTitle" :mask-closable="false" width="500" @on-cancel='editCancel' class='modelStyle'>
        <Form :model="modalData" :label-width="130" :rules="formValidate" ref="modalData" label-position="left" style="padding: 0 20px;">
          <Form-item :label='labels[0]' prop='name'>
            <Input v-model="modalData.name" />
          </Form-item>
          <Form-item :label='labels[1]' prop='manufacturer'>
            <Select v-model="modalData.manufacturer">
              <Option v-for="item in this.factorys" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Form-item>
          <Form-item :label='labels[2]' prop='model'>
            <Select v-model="modalData.model">
              <Option v-for="item in this.types" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Form-item>
          <Form-item :label='labels[3]' prop='ip'>
            <IPV4 v-if="modal" v-model="modalData.ip" :isLegal="true" ref="ipv4"></IPV4>
          </Form-item>
          <Form-item :label='labels[4]' prop='deviceid'>
            <Input v-model="modalData.deviceid" />
          </Form-item>
          <Form-item :label='labels[5]' prop='cport'>
            <Input v-model="modalData.cport" />
          </Form-item>
          <Form-item :label='labels[6]' prop='username'>
            <Input v-model="modalData.username" />
          </Form-item>
          <Form-item :label='labels[7]' prop='password'>
            <Input type="password" v-model="modalData.password" />
          </Form-item>
          <Form-item label="是否控制远程开关门">
            <RadioGroup v-model="modalData.openDoor">
              <Radio label="1">是</Radio>
              <Radio label="2">否</Radio>
            </RadioGroup>
          </Form-item>
          <Form-item label="是否获取门禁机构">
            <RadioGroup v-model="modalData.institutions">
              <Radio label="1">是</Radio>
              <Radio label="2">否</Radio>
            </RadioGroup>
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="ghost" @click='editCancel'>取消</Button>
          <Button type="primary" :loading="sureLoading" @click='editOk' style="margin-left: 16px;">确定</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>
<script>
import './server.css'
import IPV4 from '../../components/BSIPV4'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'serverConfig',
  components: {
    IPV4
  },
  data() {
    const checkName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('门禁设备名称不能为空'))
      } else if ((value + '').length > 20) {
        callback(new Error('门禁设备名称长度不能超过20！'))
      } else {
        callback()
      }
    }
    const checkIp = (rule, value, callback) => {
      if (!value) {
        callback(new Error('ip地址不能为空'))
      } else {
        callback()
      }
    }
    const checkPort = (rule, value, callback) => {
      const postTest = Number(value) > -1 && Number(value) < 65536
      if (value === '' || !postTest) {
        callback(new Error('端口不能为空,并且范围是0-65535的数字'))
      } else if (postTest) {
        callback()
      }
    }
    const checkNumber = (rule, value, callback) => {
      const postNumber = /^[1-9][0-9]{0,9}$/
      if (!value || !postNumber.test(value)) {
        callback(new Error('门禁设备编号不能为空,并且是小于11位的数字'))
      } else {
        callback()
      }
    }
    return {
      // 表格
      importTitle: [
        {
          title: '编号',
          key: 'deviceid',
          width: 200
        },
        {
          title: '名称',
          key: 'name',
          ellipsis: true
        },
        {
          title: '厂家',
          key: 'manufacturer',
          render: (h, params) => {
            let sys = ''
            switch (params.row.manufacturer) {
              case 'smed':
                sys = '斯麦尔达'
                break
              default:
                return
            }
            return h('div', [h('p', {}, sys)])
          }
        },
        {
          title: '型号',
          key: 'model',
          render: (h, params) => {
            let sys = ''
            switch (params.row.model) {
              case '0':
                sys = '门禁系统'
                break
              default:
                return
            }
            return h('div', [h('p', {}, sys)])
          }
        },
        {
          title: 'ip地址',
          key: 'ip',
          width: 200
        }
      ],
      // 表格数据
      dataSource: [],
      // 按钮
      addBtn: false,
      copyBtn: false,
      editBtn: false,
      // 弹出 添加或修改模态框
      modal: false,
      // 模态框title
      modalTitle: '',
      modalTitles: ['添加门禁设备', '修改门禁设备', '复制门禁设备'],
      // 模态框的内容
      labels: ['门禁设备名称', '门禁设备厂家', '门禁设备型号', 'ip地址', '门禁设备编号', '控制端口', '用户名', '密码'],
      // 模态框中的数据  接口直接用的
      modalData: {
        name: '',
        // manufacturer: 0,
        manufacturer: 'smed',
        // type: 0,
        model: '0',
        ip: '0.0.0.0',
        // number: '',
        deviceid: '',
        // port: '',
        cport: '4500',
        username: '',
        password: '',
        openDoor: '1',
        institutions: '1'
      },
      // 保存初始模态框数据
      saveModalData: {},
      // 表格焦点行数据
      chooseData: {},
      // 模态框中的 设备厂商
      factorys: [{ value: 'smed', label: '斯麦尔达' }],
      // 模态框中的 系统类型
      types: [{ value: '0', label: '门禁系统' }],
      // 表单验证
      formValidate: {
        name: [{ required: true, validator: checkName, trigger: 'change' }],
        ip: [{ required: true, validator: checkIp, trigger: 'change' }],
        cport: [{ required: true, validator: checkPort, trigger: 'change' }],
        deviceid: [{ required: true, validator: checkNumber, trigger: 'change' }],
        username: [{ required: true, message: '用户名不能为空', trigger: 'change' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'change' }]
      },
      // 分页
      total: '',
      limit: this.$PageInfo.limit,
      current: 1,
      // 列表高度
      tableHeight: '',
      tableWidth: '',
      sureLoading: false
    }
  },
  created() {
    // 获取表格保存数据
    this.getRowData()
    this.getDatas()
    this.saveModalData = this.$lodash.cloneDeep(this.modalData)
    this.$store.commit('CHANGE_OPERA_ALL', true)
  },
  mounted() {
    this.$nextTick(() => {
      console.log(this.$refs['tableBox'].offsetHeight)
      this.tableHeight = this.$refs['tableBox'].offsetHeight
      this.tableWidth = this.$refs['tableBox'].offsetWidth
    })
  },
  computed: {
    ...mapState({
      pageShowDatas: ({ sysDoor }) => sysDoor.pageShowData,
      operateData: ({ sysDoor }) => sysDoor.operateData
    })
  },
  methods: {
    ...mapMutations(['CHANGE_OPERA_ALL']),
    ...mapActions([
      'doorServerList',
      'addServerData',
      'getIdServerData',
      'modServerData',
      'delServerData',
      'getSrvLabeList'
    ]),
    // 公共方法 给分页和表格赋值（接口成功后）
    listsData() {
      this.total = this.pageShowDatas.counts
      this.current = this.pageShowDatas.current
    },
    // 点击添加 打开模态框
    openModAdd(value) {
      this.$store.commit('CHANGE_OPERA_ALL', true)
      this.$refs.modalData.resetFields()
      this.modal = this.addBtn = true
      this.sureLoading = false
      this.modalTitle = value
      this.modalData = this.$lodash.cloneDeep(this.saveModalData)
    },
    // 点击修改按钮 打开模态框
    openModMod(value) {
      this.$refs.modalData.resetFields()
      this.modal = this.editBtn = true
      this.sureLoading = false
      this.modalTitle = value
      this.getRowData()
    },
    // 刷新
    refash() {
      this.current = 1
      this.getDatas()
      this.$store.commit('CHANGE_OPERA_ALL', true)
    },
    // 删除按钮
    delAlarm() {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确定删除么？</p>',
        onOk: () => {
          this.delServerData(this.chooseData._id)
            .then(res => {
              this.getDatas()
              this.successMsg('门禁服务器删除成功！')
              this.$store.commit('CHANGE_OPERA_ALL', true)
            })
            .catch(err => {
              this.errorMsg('门禁服务器删除失败！')
              console.log('this.delServerData :' + err)
            })
        },
        onCancel: () => {
          this.$refs.currentRowTable.clearCurrentRow()
          this.$store.commit('CHANGE_OPERA_ALL', true)
        }
      })
    },
    // 获取表格保存数据
    getRowData() {
      if (this.chooseData._id) {
        this.getIdServerData(this.chooseData._id)
          .then(res => {
            this.modalData = res.data
          })
          .catch(err => {
            this.errorMsg('获取门禁数据失败！')
            console.log('this.getIdServerData :' + err)
          })
      }
    },
    // 模态框 取消按钮
    editCancel() {
      // this.$store.commit('CHANGE_OPERA_ALL', true)
      this.modal = this.addBtn = this.copyBtn = this.editBtn = false
      this.modalData = this.$lodash.cloneDeep(this.saveModalData)
      this.$refs.currentRowTable.clearCurrentRow()
      this.$refs.modalData.resetFields()
      this.$store.commit('CHANGE_OPERA_ALL', true)
    },
    // 获取服务器列表 报错当前页
    getDatas(emit) {
      const query = {
        page: this.current,
        limit: Number(this.limit)
      }
      this.doorServerList(query)
        .then(res => {
          this.dataSource = res
          this.listsData()
          // emit ? this.$emit('tigger-change', res) : ''
        })
        .catch(err => {
          console.log('this.doorServerList :' + err)
        })
    },
    // 模态框 确定
    editOk() {
      if (this.$refs.ipv4.warning !== '' || this.modalData.ip === '0.0.0.0') {
        return this.warningMsg('请填写合法的ip地址！')
      }
      if (this.modalData.name.length === 0 || this.modalData.name.length > 20) {
        return this.warningMsg('请正确填写门禁设备名称！')
      }
      if (this.addBtn) {
        this.$refs.modalData.validate(valid => {
          if (valid) {
            this.sureLoading = true
            this.addServerData(this.modalData)
              .then(res => {
                this.successMsg('添加门禁服务器成功！')
                this.sureLoading = false
                this.modal = this.addBtn = false
                this.getDatas(true)
              })
              .catch(err => {
                this.errorMsg('添加门禁失败！' + err.response.data.message)
                this.sureLoading = false
                console.log('this.addServerData :', err.response.data.message)
              })
          } else {
            // this.warningMsg('请填写正确的信息')
            this.sureLoading = false
          }
        })
      } else if (this.editBtn) {
        this.$refs.modalData.validate(valid => {
          if (valid) {
            this.modalData._id = this.chooseData._id
            this.modServerData(this.modalData)
              .then(res => {
                this.modal = this.editBtn = false
                this.$refs.currentRowTable.clearCurrentRow()
                this.$store.commit('CHANGE_OPERA_ALL', true)
                this.successMsg('修改门禁成功!')
                this.sureLoading = false
                this.getDatas()
              })
              .catch(err => {
                this.errorMsg('修改门禁失败！')
                this.sureLoading = false
                console.log('this.modServerData :' + err)
              })
          } else {
            // this.warningMsg('请填写正确的信息')
            this.sureLoading = false
          }
        })
      }
    },
    // 当前行
    alarmInSel(now, old) {
      this.$store.commit('CHANGE_OPERA_ALL', false)
      this.chooseData = now
    },
    // 切换页码
    pageChange(page) {
      this.current = page
      this.$store.commit('CHANGE_OPERA_ALL', true)
      this.getDatas()
    },
    // 分页功能
    pageSizeChange(page) {
      this.limit = page
      this.getDatas()
    }
  },
  destroyed() {
    this.$store.commit('CHANGE_OPERA_ALL', true)
  }
}
</script>
<style>
.serverConfig .ivu-table-wrapper {
  margin-top: 0 !important;
}
</style>

<style lang="less" scoped>
.serverConfig {
  width: 100%;
  height: 100%;
  .bsMainChild {
    height: 100%;
    width: 100%;
    .tab-content-alarm {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      background-color: #1c3053;
      .feature-btn {
        height: 64px;
        display: flex;
        flex-direction: row;
        height: 64px;
        align-items: center;
        margin-left: 24px;
        .btn {
          margin-right: 12px;
        }
      }
      .table-relative {
        flex: 1;
        overflow-y: auto;
      }
      .page-style {
        height: 40px;
        line-height: 40px;
        padding-right: 16px;
        background-color: #244575;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
      }
    }
  }
}
</style>
