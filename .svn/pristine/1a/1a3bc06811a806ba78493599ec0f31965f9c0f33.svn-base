<template>
  <div class="tab-content-alarm">
    <div class="feature-btn">
      <Button type="ghost" icon="plus" @click="openAddMod">添加</Button>
      <Button type="ghost" icon="edit" :disabled="isCannotClick" @click="editClick(0)">修改</Button>
      <Button type="ghost" icon="trash-a" :disabled="isCannotClick" @click="delAlarm">删除</Button>
      <Button type="ghost" icon="edit" :disabled="isCannotClick" @click="editClick(1)">批量修改</Button>
      <Button type="ghost" icon="refresh" @click="refresh">刷新</Button>
      <Input placeholder="按名称模糊查询" v-model="searchName" style="width: 250px;" class="rt">
        <Button slot="append" @click="search">搜索</Button>
      </Input>
      <Checkbox v-model="subDevice" class="lf" @on-change="getEquipmentAlarm">显示子机构设备</Checkbox>
    </div>
    <div class="car-list flex-1" style="padding-top:10px;">
      <div class="table-box" style="height: 100%;" ref="tableBox1">
        <Table size="small" :columns="importTitle" :data="equipmentList" :height="tableHeight" @on-selection-change="selectItem"></Table>
        <div class="table-footer">
          <div class="rt">
            <Page show-sizer :page-size-opts="$PageInfo.size" :show-total="true" :show-elevator="true" :page-size="pageLimit" :current="pageCur" @on-page-size-change="pageSizeChange" :total="pageTotal" @on-change="pageChange"></Page>
          </div>
        </div>
      </div>
    </div>
    <!--设备报警修改模态框-->
    <div v-if="exportEditMod">
      <Modal v-model="exportEditMod" :title="exportModTitle" width="480" :mask-closable="false">
        <Form :model="alarmEditInfo" :label-width="100" ref="alarmEditInfo" label-position="left" :rules="ruleValidate" style="padding: 0 10px;">
          <div v-if="exportModTitle === '设备报警修改'? true: false">
            <Form-item label="所属设备">
              <Input v-model="alarmEditInfo.name" disabled/>
            </Form-item>
            <Form-item label="报警类型">
              <Input v-model="alarmEditInfo.alarmType" disabled/>
            </Form-item>
          </div>
          <FormItem label="报警级别">
            <Select v-model="alarmEditInfo.level">
              <Option v-for="item in alarmLevel" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="ghost" @click="cancel">取消</Button>
          <Button type="primary" @click="exportConfirm('alarmEditInfo')">确定</Button>
        </div>
      </Modal>
    </div>
    <!-- 添加 弹框 -->
    <div v-if="isOpenAddMod">
      <AddModal :isOpen="isOpenAddMod" addModTitle="设备报警添加" type="deviceAlarm" :equipTree="deviceTree" :alarmHostTree="hostTree" :decodeTree="decodeTree" @close="close" @devTreeData='devTreeData' @addNewOne="addNewOne"></AddModal>
    </div>
  </div>
</template>

<script>
import './alarmStyle.css'
import { numberValidate } from './allJs/formCheck.js'
import { mapState, mapGetters, mapActions } from 'vuex'
import AddModal from './AddModal'
export default {
  components: {
    AddModal
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
      tableHeight: 420,
      pageLimit: this.$PageInfo.limit,
      pageTotal: 0,
      pageCur: 1,
      subDevice: true,
      searchName: '',
      importTitle: [
        {
          type: 'selection',
          width: 60
        },
        {
          title: '设备名称',
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
          title: '设备类型',
          key: 'devType',
          ellipsis: true,
          // minWidth: 220,
          render: (h, params) => {
            let type = ''
            if (params.row.deviceType === 1) {
              type = '报警主机'
            } else if (params.row.deviceType === 5) {
              type = '解码器'
            } else {
              type = '视频设备'
            }
            return h('div', type)
          }
        },
        {
          title: '报警类型',
          key: 'alarmType',
          render: (h, params) => {
            let alarmType = this.allAlarmType[params.row.subtype]
            return h('div', alarmType)
          }
          // minWidth: 100
        },
        {
          title: '报警级别',
          key: 'level'
          // minWidth: 100
        }
      ],
      isCannotClick: true, // 按钮是否可点击
      selectData: [],
      isOpenAddMod: false,
      deviceTree: {},
      hostTree: {},
      decodeTree: {},
      affirmMethod: '手动一级确认',
      alarmEditInfo: {
        name: '',
        alarmType: '',
        level: 1
      },
      ruleValidate: {
        minintervaltime: [
          {required: true, validator: numberValidate(0, 7200), trigger: 'blur'}
        ]
      },
      exportEditMod: false,
      exportModTitle: '',
      equipmentList: [],
      refreshStatus: '',
      deviceType: 0,
      editStatus: '',
      selectDataIds: []
    }
  },
  computed: {
    ...mapGetters(['enabledTemp', 'alarmLevel']),
    ...mapState({
      addTreeData: ({ orgConfig }) => orgConfig.addTreeData,
      allAlarmType: ({ warningCount }) => warningCount.allAlarmType
      // deviceAlarmlist: ({ orgConfig }) => orgConfig.deviceAlarmlist
    })
  },
  watch: {
    activeOrgId: {
      handler(val) {
        if (val) {
          this.pageCur = 1
          this.getEquipmentAlarm()
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(['getEquipmentAlarmData', 'getEquipmentTreeData', 'addEquipmentData', 'recordLog', 'editDeviceAlarmData', 'deleteDeviceAlarmData', 'getOneAlarmTabNumber']),
    getEquipmentAlarm() {
      let data = {
        oid: this.activeOrgId,
        never: this.subDevice ? -1 : 0,
        seek: this.searchName,
        page: this.pageCur,
        limit: this.pageLimit,
        config: 0
      }
      this.getEquipmentAlarmData(data).then((res) => {
        this.equipmentList = JSON.parse(JSON.stringify(res.data))
        this.isCannotClick = true
        this.pageTotal = Number(res.headers['x-bsc-count'])
        this.getOneAlarmTabNumber({type: 'deviceAlarmNo', count: this.pageTotal})
        if (this.refreshStatus) {
          this.successMsg('刷新成功')
          this.refreshStatus = ''
        }
      }).catch(err => {
        console.log('logout error:' + err)
        this.errorMsg('设备报警获取失败')
      })
    },
    search() {
      this.getEquipmentAlarm()
    },
    // 刷新
    refresh() {
      this.getEquipmentAlarm()
      this.refreshStatus = true
    },
    devTreeData(val) {
      this.deviceTree = {}
      let param = {}
      if (val.decodeStatus) {
        param = {
          oid: this.activeOrgId,
          bigtype: 5
        }
        this.deviceType = 5
      } else if (val.hostStatus) {
        param = {
          oid: this.activeOrgId,
          bigtype: 1
        }
        this.deviceType = 1
      } else {
        param = {
          oid: this.activeOrgId
        }
        this.deviceType = 0
      }
      this.getEquipmentTreeData(param).then(res => {
        if (this.deviceType === 5) {
          this.decodeTree = res.data
        } else if (this.deviceType === 1) {
          this.hostTree = res.data
        } else {
          this.deviceTree = res.data
        }
      })
    },
    pageSizeChange(n) {
      this.pageLimit = n
      this.getEquipmentAlarm()
    },
    pageChange(page) {
      this.pageCur = page
      this.getEquipmentAlarm()
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
      if (data !== 1) {
        if (this.selectData.length !== 1) {
          this.$Modal.confirm({
            title: '提示',
            content: '一次只能修改一个！'
          })
          return
        }
      }
      if (data === 1 && this.selectData.length > 1) {
        this.exportModTitle = '批量修改设备报警'
        this.exportEditMod = true
        this.alarmEditInfo.level = 1
      } else if (data === 0 && this.selectData.length === 1) {
        this.exportModTitle = '设备报警修改'
        this.exportEditMod = true
        this.equipmentList.forEach((item, index) => {
          if (this.selectDataIds.length === 1 && item._id === this.selectDataIds[0]) {
            this.alarmEditInfo.name = item.name
            this.alarmEditInfo.level = item.level
            this.alarmEditInfo.alarmType = this.allAlarmType[item.subtype]
          }
        })
      } else {
        this.exportEditMod = false
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
          this.deleteDeviceAlarmData(deleteId).then((res) => {
            this.exportEditMod = false
            if (this.pageCur === Math.ceil(this.pageTotal / this.pageLimit) && (this.selectDataIds.length === this.pageLimit || this.selectDataIds.length === (this.pageTotal % this.pageLimit)) && this.pageCur !== 1) {
              this.pageCur -= 1
            }
            this.getEquipmentAlarm()
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
    exportConfirm(name) {
      this.exportEditMod = false
      const payload = {
        level: this.alarmEditInfo.level,
        // alarmtemplate: this.alarmEditInfo.alarmtemplate,
        // minintervaltime: this.alarmEditInfo.minintervaltime,
        // alarmaffirm: this.alarmEditInfo.alarmaffirm,
        ids: this.selectDataIds
      }
      this.editDeviceAlarmData(payload).then((res) => {
        this.getEquipmentAlarm()
      }).catch(err => {
        console.log('logout error:' + err)
        this.errorMsg('报警修改失败')
      })
    },
    // 添加弹框
    openAddMod() {
      let param = {
        oid: this.activeOrgId
      }
      this.getEquipmentTreeData(param).then(res => {
        this.deviceType = 0
        this.deviceTree = res.data
      })
      this.isOpenAddMod = true
    },
    // 添加报警
    addNewOne(data) {
      let objs = []
      objs = data.resNodes.map(item => {
        return {
          eid: item._id,
          name: item.name
        }
      })
      data.orgId = this.activeOrgId
      data.objs = objs
      let params = {
        objs: objs,
        orgId: this.activeOrgId,
        deviceType: this.deviceType,
        ...data.body
      }
      this.addEquipmentData(params).then(() => {
        this.recordMsg(data.resNodes, '报警添加', '设备报警添加')
        this.getEquipmentAlarm()
        this.close()
      }).catch(err => {
        this.warningMsg(err.response.data.message)
      })
    },
    close() {
      this.isOpenAddMod = false
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
    }
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox1'].offsetHeight - 35
    // this.alarmEditInfo.alarmtemplate = this.enabledTemp[0].value
  }
}
</script>

<style scoped lang='less'>
  .ivu-input-number {
    width: 100%;
  }
</style>
