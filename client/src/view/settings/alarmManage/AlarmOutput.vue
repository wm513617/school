<template>
  <div class="tab-content-alarm">
    <div class="feature-btn">
      <Button type="ghost" icon="plus" @click="openAddMod">添加</Button>
      <Button type="ghost" icon="edit" :disabled="isCannotClick" @click="editClick(0)">修改</Button>
      <Button type="ghost" icon="trash-a" :disabled="isCannotClick" @click="delAlarm">删除</Button>
      <Button type="ghost" icon="arrow-move" :disabled="isCannotClick" @click="moveToDevice">移动</Button>
      <Button type="ghost" icon="edit" :disabled="isCannotClick" @click="editClick(1)">批量修改</Button>
      <Button type="ghost" icon="refresh" @click="refresh">刷新</Button>
      <Input v-model="outSearchName" placeholder="按名称模糊查询" style="width: 250px;" class="rt">
        <Button slot="append" @click="search">搜索</Button>
      </Input>
      <Checkbox v-model="singleIn" class="lf" @on-change="getExportData">显示子机构设备</Checkbox>
    </div>
    <div class="car-list flex-1" style="padding-top:10px;">
      <div class="table-box" style="height: 100%;" ref="tableBox1">
        <Table size="small" :columns="importTitle" :data="exportData" :height="tableHeight" @on-selection-change="selectItem"></Table>
        <div class="table-footer">
          <div class="rt">
            <Page show-sizer :page-size-opts="$PageInfo.size" :show-total="true" :show-elevator="true" :page-size="outpageLimit" :current="outPageCur" @on-page-size-change="pageSizeChange" :total="outPageTotal" @on-change="pageChange"></Page>
          </div>
        </div>
      </div>
    </div>
    <!--报警输出修改模态框-->
    <div v-if="exportEditMod">
      <Modal v-model="exportEditMod" :title="exportModTitle" width="480" :mask-closable="false">
        <Form :model="exportForm" :label-width="80" ref="exportForm" label-position="left"  :rules="ruleValidate" style="padding: 0 10px;">
          <div v-if="exportModTitle === '报警输出修改'? true: false">
            <Form-item label="所属设备">
              <Input v-model="exportForm.mainname" disabled/>
            </Form-item>
            <Form-item label="输出编号">
              <Input v-model="exportForm.chan" disabled/>
            </Form-item>
            <Form-item label="输出名称" prop="name">
              <Input v-model="exportForm.name" />
            </Form-item>
          </div>
          <Form-item label="输出类型">
            <Select v-model="exportForm.alarmouttype">
              <!-- <Option value="1">常开</Option>
              <Option value="0">常闭</Option> -->
              <Option v-for="item in outTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Form-item>
          <Form-item label="持续时间" prop="durationtime">
            <Input v-model.trim="exportForm.durationtime" />
          </Form-item>
          <Form-item label="输出延时" prop="exportdelaytime">
            <Input v-model.trim="exportForm.exportdelaytime" />
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="ghost" @click="cancel">取消</Button>
          <Button type="primary" @click="exportConfirm">确定</Button>
        </div>
      </Modal>
    </div>
    <!-- 添加 弹框 -->
    <div v-if="isOpenAddMod">
      <AddModal :isOpen="isOpenAddMod" addModTitle="报警输出添加" type="alarmOut" :deviceTree="deviceTree" @close="close" @addNewOne="addNewOne"></AddModal>
    </div>
    <!-- 移动 弹框 -->
    <div v-if="isMove">
      <MoveDeviceModal :isOpen="isMove" @close="isMove = false" @moveDevice="moveDevice"></MoveDeviceModal>
    </div>
  </div>
</template>

<script>
import './alarmStyle.css'
import { numberValidate } from './allJs/formCheck.js'
import { mapGetters, mapActions, mapState } from 'vuex'
import AddModal from './AddModal'
import MoveDeviceModal from './MoveDeviceModal'
export default {
  components: {
    AddModal,
    MoveDeviceModal
  },
  props: {
    orgId: {
      type: String,
      default: ''
    },
    activeOrgId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      exportData: [],
      tableHeight: 420,
      outpageLimit: this.$PageInfo.limit,
      outPageTotal: 0,
      outPageCur: 1,
      outSearchName: '',
      singleIn: true,
      importTitle: [
        {
          type: 'selection',
          width: 60
        },
        {
          title: '报警输出名称',
          key: 'name,',
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
        },
        {
          title: '所属设备',
          key: 'mainname',
          ellipsis: true,
          // minWidth: 220,
          render: (h, params) => {
            let name = ''
            name = params.row.eid.name
            return h('div', name)
          }
        },
        {
          title: '设备类型',
          key: 'devType',
          ellipsis: true,
          // minWidth: 220,
          render: (h, params) => {
            let type = ''
            if (params.row.eid.type === 'alarmHost') {
              type = '报警主机'
            } else {
              type = params.row.eid.type
            }
            return h('div', type)
          }
        },
        {
          title: '报警输出编号',
          key: 'chan'
          // minWidth: 100
        },
        {
          title: '输出类型',
          key: 'alarmouttype',
          render: (h, params) => {
            let type = params.row.alarmouttype === '1' ? '常闭' : '常开'
            console.log('输出类型', params.row.alarmouttype)
            return h('div', type)
          }
          // minWidth: 100
        },
        {
          title: '持续时间',
          key: 'durationtime'
          // minWidth: 100
        },
        {
          title: '输出延时',
          key: 'exportdelaytime'
        }
      ],
      isCannotClick: true, // 按钮是否可点击
      selectData: [],
      selectDataIds: [],
      isOpenAddMod: false,
      deviceTree: [],
      exportEditMod: false,
      exportForm: {
        mainname: '',
        chan: '',
        name: '',
        durationtime: 10,
        exportdelaytime: 0,
        alarmouttype: '0',
        id: ''
      },
      outTypeList: [ // 报警输出类型
        {label: '常开', value: '0'},
        {label: '常闭', value: '1'}
      ],
      exportModTitle: '',
      ruleValidate: {
        durationtime: [
          {required: true, validator: numberValidate(0, 7200), trigger: 'blur'}
        ],
        exportdelaytime: [
          {required: true, validator: numberValidate(0, 7200), trigger: 'blur'}
        ]
      },
      refreshStatus: '',
      editStatus: '',
      isMove: false
    }
  },
  computed: {
    ...mapState({
      // exportOrigData: ({ orgConfig }) => orgConfig.alarmOutData,
      outPageNum: ({ orgConfig }) => orgConfig.outPageNum,
      addTreeData: ({ orgConfig }) => orgConfig.addTreeData
    }),
    ...mapGetters(['enabledTemp'])
  },
  watch: {
    activeOrgId: {
      handler(val) {
        if (val) {
          this.outPageCur = 1
          this.getExportData()
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(['getNormalAlarmInData', 'getNormalAlarmAddTree', 'addAlarmInputData', 'recordLog', 'deleteAlarmInputData', 'editAlarmInputData', 'editMoreAlarmInputData', 'changeResourceOrg', 'getOneAlarmTabNumber']),
    // 获取报警输出数据
    getExportData() {
      console.log('获取报警输出数据')
      let data = {
        oid: this.activeOrgId,
        never: this.singleIn ? -1 : 0,
        seek: this.outSearchName,
        page: this.outPageCur,
        limit: this.outpageLimit,
        channelTypes: '2,8,10'
      }
      this.getNormalAlarmInData(data).then((res) => {
        this.exportData = JSON.parse(JSON.stringify(res.data))
        this.isCannotClick = true
        this.outPageTotal = Number(res.headers['x-bsc-count'])
        this.getOneAlarmTabNumber({type: 'alarmOutputNo', count: this.outPageTotal})
        if (this.refreshStatus) {
          this.successMsg('刷新成功')
          this.refreshStatus = ''
        }
      }).catch(err => {
        console.log('logout error:' + err)
        this.errorMsg('报警输出获取失败')
      })
    },
    search() {
      this.getExportData()
    },
    // 刷新
    refresh() {
      this.getExportData()
      this.refreshStatus = true
    },
    pageSizeChange(n) {
      this.outpageLimit = n
      this.getExportData()
    },
    pageChange(page) {
      this.outPageCur = page
      this.getExportData()
    },
    selectItem(selection) {
      this.selectDataIds = []
      this.selectData = selection
      selection.forEach(item => {
        this.selectDataIds.push(item._id)
      })
      if (selection.length === 0) {
        this.isCannotClick = true
      } else {
        this.isCannotClick = false
      }
    },
    // 单条修改
    editClick(data) {
      console.log('修改报警输出', data)
      if (!data) {
        if (this.selectDataIds.length !== 1) {
          this.$Modal.confirm({
            title: '提示',
            content: '一次只能修改一个！'
          })
          return
        }
      }
      if (data) {
        this.exportModTitle = '报警输出批量修改'
        this.exportEditMod = true
        this.editStatus = true
      } else {
        this.exportModTitle = '报警输出修改'
        this.exportEditMod = true
        this.editStatus = false
        this.exportData.forEach((item, index) => {
          if (this.selectDataIds.length === 1 && item._id === this.selectDataIds[0]) {
            // this.exportForm = item
            // this.exportForm.mainname = item.eid.name
            // this.exportForm = Object.assign({}, this.exportForm, this.selectData[0])
            // this.exportForm.mainname = this.selectData[0].eid.name
            this.exportForm = {
              mainname: item.eid.name,
              chan: item.chan,
              name: item.name,
              durationtime: item.durationtime,
              exportdelaytime: item.exportdelaytime,
              alarmouttype: item.alarmouttype,
              id: item.id
            }
          }
        })
      }
    },
    // 删除按钮
    delAlarm() {
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除吗?</p>',
        loading: true,
        onOk: () => {
          let deleteId = this.selectDataIds.join(',')
          this.deleteAlarmInputData(deleteId).then((res) => {
            this.exportEditMod = false
            if (this.outPageCur === Math.ceil(this.outPageTotal / this.outpageLimit) && (this.selectDataIds.length === this.outpageLimit || this.selectDataIds.length === (this.outPageTotal % this.outpageLimit)) && this.outPageCur !== 1) {
              this.outPageCur -= 1
            }
            this.getExportData()
          }).catch(err => {
            console.log('logout error:' + err)
            this.errorMsg('删除失败')
          })
          setTimeout(() => {
            this.$Modal.remove()
          }, 0)
        }
      })
    },
    // 修改弹框
    cancel() {
      this.exportEditMod = false
    },
    // 修改
    exportConfirm() {
      this.$refs['exportForm'].validate(valid => {
        if (valid) {
          if (this.editStatus) {
            let deleteId = this.selectDataIds.join(',')
            const payload = {
              durationtime: this.exportForm.durationtime,
              exportdelaytime: this.exportForm.exportdelaytime,
              alarmouttype: this.exportForm.alarmouttype
            }
            const param = {
              body: payload,
              ids: deleteId
            }
            this.editMoreAlarmInputData(param).then((res) => {
              this.exportEditMod = false
              this.getExportData()
            }).catch(err => {
              console.log('logout error:' + err)
              this.errorMsg('报警批量修改失败')
            })
          } else {
            let deleteId = this.selectDataIds.join(',')
            const payload = {
              name: this.exportForm.name,
              durationtime: this.exportForm.durationtime,
              exportdelaytime: this.exportForm.exportdelaytime,
              alarmouttype: this.exportForm.alarmouttype
              // _id: deleteId
            }
            const param = {
              body: payload,
              _id: deleteId
            }
            this.editAlarmInputData(param).then((res) => {
              this.exportEditMod = false
              this.getExportData()
            }).catch(err => {
              console.log('logout error:' + err)
              this.errorMsg('报警修改失败')
            })
          }
        }
      })
    },
    // 添加弹框
    openAddMod() {
      console.log('树id', this.orgId)
      let param = {
        oid: this.orgId,
        orgtype: 0,
        channelTypes: '2,8,10',
        bigTypes: '0,1,5',
        alarmOutput: '1'
      }
      this.getNormalAlarmAddTree(param).then(res => {
        this.deviceTree = [res.data]
      })
      this.isOpenAddMod = true
    },
    close() {
      this.isOpenAddMod = false
    },
    // 添加报警
    addNewOne(data) {
      let params = {
        oid: this.activeOrgId,
        rids: data.resNodes.map(item => item._id),
        body: data.body
      }
      this.addAlarmInputData(params).then(() => {
        this.recordMsg(data.resNodes, '报警添加', '报警输出添加')
        this.getExportData()
        this.close()
      })
    },
    recordMsg(selectList, operateName, operateContent) {
      if (selectList instanceof Array) {
        let targets = []
        let deviceIps = []
        selectList.forEach(item => {
          targets.push(item.name)
          deviceIps.push(item.ip)
        })
        const param = {
          logType: '管理日志',
          module: '报警管理',
          operateName: operateName,
          operateContent: operateContent,
          target: targets.join(','),
          deviceIp: deviceIps.join(',')
        }
        this.recordLog(param)
      } else {
        const param = {
          logType: '管理日志',
          module: '报警管理',
          operateName: operateName,
          operateContent: operateContent,
          target: selectList.name,
          deviceIp: selectList.ip
        }
        this.recordLog(param)
      }
    },
    // 点击 移动按钮
    moveToDevice() {
      this.isMove = true
    },
    // 确认移动
    moveDevice(oid) {
      let param = {
        oid: oid,
        arrId: this.selectDataIds || []
      }
      this.changeResourceOrg(param).then(suc => {
        this.isMove = false
        this.selectDataIds = []
        this.getExportData()
        this.successMsg('资源移动成功')
      }).catch(err => {
        this.errorMsg('资源移动失败')
        console.log(err)
      })
    }
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox1'].offsetHeight - 35
  }
}
</script>

<style scoped lang=''>

</style>
