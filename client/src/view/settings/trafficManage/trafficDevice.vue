<template>
  <div class="orgConfig">
    <div class="bsMainChild">
      <div class="tab-content-alarm">
        <div class="feature-btn">
          <Input v-model="inSearchName" placeholder="请输入设备编号、设备名称" style="width: 250px;margin-right: 10px;" class="rt">
          <Button slot="append" @click='getSearchDoor'>搜索</Button>
          </Input>
          <!-- <Button v-if="$BShasPower('BS-SETTING-TRAFFIC-DEVICE')" @click="alarmConfig" :disabled="!isChecked" type="ghost">获取</Button> -->
          <!-- <Button v-if="$BShasPower('BS-SETTING-TRAFFIC-DEVICE')" @click="alarmConfig" :disabled="!isChecked" type="ghost">报警配置</Button> -->
          <Checkbox v-model="isShowChild" @on-change="showChildfresh">显示子机构设备</Checkbox>
        </div>
        <div class="table-relative" :style="{height: tableWrrpHeight,overflow: 'auto'}" ref="tableBox">
          <div class="table-body access-control-system">
            <Table style="margin-top: 20px;" size="small" :columns="importTitle" :data="trafficLaneList" @on-selection-change="selectRow" :height="tableHeight"></Table>
          </div>
        </div>
        <div class="page-style">
          <Page class="rt" show-sizer :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" :current="trafficLane.curPage" :total="trafficLane.count" :page-size="trafficLane.limit" @on-change="pageChange" show-elevator show-total></Page>
        </div>
      </div>
      <!--报警配置模态框   -->
      <!-- <alarmConfigModal ref="AlarmConfig" :alarmModalShow="modal" :modalData="alarmFormData" @save="saveAlarm" @cancel="cancelAlarm"></alarmConfigModal> -->
    </div>
  </div>
</template>
<script>
import './common.css'
// import alarmConfigModal from './alarmConfigModal'
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  name: 'orgConfig',
  // components: { alarmConfigModal },
  data() {
    return {
      // 表格
      importTitle: [
        {
          type: 'selection',
          width: 60,
          align: 'left'
        },
        {
          title: '设备编号',
          key: 'devChnId'
        },
        {
          title: '设备名称',
          key: 'devChnName'
        },
        {
          title: '厂商',
          key: 'devChnFactory'
        },
        {
          title: '设备类型',
          key: 'devChnType',
          render: (h, params) => {
            let devChnType = params.row.devChnType
            let text = ''
            switch (devChnType) {
              case '1':
                text = '枪机'
                break
              case '2':
                text = '球机'
                break
              case '3':
                text = '半球'
                break
              default:
                text = devChnType
            }
            return h('span', text)
          }
        },
        {
          title: '行车方向',
          key: 'devChnDirect',
          render: (h, params) => {
            let devChnDirect = params.row.devChnDirect
            let direction = ''
            switch (devChnDirect) {
              case '1':
                direction = '由东到西'
                break
              case '2':
                direction = '由西到东'
                break
              case '3':
                direction = '由南到北'
                break
              case '4':
                direction = '由北到南'
                break
              case '5':
                direction = '由东北到西南'
                break
              case '6':
                direction = '由西南到东北'
                break
              case '7':
                direction = '由东南到西北'
                break
              case '8':
                direction = '由西北到东南'
                break
              default:
                direction = '方向未知'
                break
            }
            return h('div', [h('p', {}, direction)])
          }
        },
        {
          title: '所属机构',
          key: 'deptName'
        }
      ],
      // 报警配置数据
      alarmFormData: {},
      initFormData: {
        level: 1,
        alarmtype: '', // 报警分类
        alarmtemplate: '',
        alarmaffirm: {
          // 报警确认
          affirmflag: true,
          autoaffirm: {
            status: false,
            intervaltime: 20
          },
          handaffirm: {
            status: true
          }
        }
      },
      // 报警配置 按钮禁用
      isChecked: false,
      // 勾中的数据行
      selectIds: [],
      // 搜索框中的内容
      inSearchName: '',
      // 勾选子机构
      isShowChild: false,
      // 弹出
      modal: false,
      limit: this.$PageInfo.limit,
      current: 1,
      // 列表高度
      tableHeight: 434,
      tableWrrpHeight: '100%'
    }
  },
  created() {
    // 获取分类数据
    this.getSortData()
      .then()
      .catch(err => {
        console.log('getSortData error: ' + err)
      })
    // 获取时间模板
    this.getAlarmTemp()
      .then()
      .catch(err => {
        console.log('getAlarmTemp error: ' + err)
      })
  },
  mounted() {
    const bodyHeight = this.$root.$el.clientHeight
    this.tableWrrpHeight = (bodyHeight - 210 < 520 ? 520 : bodyHeight - 210) + 'px'
    this.tableHeight = this.tableWrrpHeight.split('px')[0] - 20
  },
  computed: {
    ...mapState({
      trafficLane: ({ traffic }) => traffic.trafficLane,
      serverId: ({ traffic }) => traffic.serverId,
      departmentId: ({ traffic }) => traffic.departmentId,
      trafficDevType: ({ traffic }) => traffic.trafficDevType
    }),
    ...mapGetters(['enabledSort', 'enabledTemp']),
    trafficLaneList() {
      let filterList = []
      if (this.trafficDevType === 'hk') {
        // let arryList = []
        if (this.trafficLane.list) {
          this.trafficLane.list.map(item => {
            filterList.push({
              devChnId: item.hkDeviceIndexCode,
              devChnName: item.hkDeviceName,
              devChnFactory: item.devChnFactory,
              deptName: item.deptName
            })
          })
        }
      } else {
        filterList = JSON.parse(JSON.stringify(this.trafficLane.list))
      }
      return filterList
    }
  },
  watch: {
    departmentId() {
      this.refreshDevice(1)
    }
  },
  methods: {
    ...mapActions(['getSortData', 'getAlarmTemp', 'getTrafficSerLane', 'getTrafficAlarmcfg', 'trafficAlarmcfgBatch']),
    // 初始化弹窗数据
    initModal() {
      let alarmtype = ''
      let alarmtemplate = ''
      if (this.enabledSort.length !== 0) {
        alarmtype = this.enabledSort[0].value
      }
      if (this.enabledTemp.length !== 0) {
        alarmtemplate = this.enabledTemp[0].value
      }
      this.alarmFormData = Object.assign({}, this.initFormData, {
        alarmtemplate: alarmtemplate,
        alarmtype: alarmtype
      })
    },
    // 报警配置
    alarmConfig() {
      if (this.selectIds.length === 1) {
        this.getTrafficAlarmcfg({ sid: this.serverId, id: this.selectIds[0] })
          .then(res => {
            if (res) {
              this.alarmFormData = res
            } else {
              this.initModal()
            }
            this.modal = true
          })
          .catch(err => {
            this.errorMsg(err)
            console.log('getTrafficAlarmcfg error: ' + err)
          })
      } else {
        this.modal = true
        this.initModal()
      }
    },
    // modal取消
    cancelAlarm(name) {
      this.modal = false
      this.$refs['AlarmConfig'].$refs[name].resetFields()
      this.selectIds = []
    },
    // modal确定
    saveAlarm(data, name) {
      this.trafficAlarmcfgBatch({ body: data, sid: this.serverId, ids: this.selectIds })
        .then(() => {
          this.successMsg('报警配置成功!')
          this.modal = false
          this.$refs['AlarmConfig'].$refs[name].resetFields()
          this.selectIds = []
          this.isChecked = false
          this.refreshDevice(this.current)
        })
        .catch(err => {
          this.errorMsg('报警配置失败!')
          console.log('trafficAlarmcfgBatch error: ' + err)
        })
    },
    // 勾选
    selectRow(sels) {
      sels.length === 0 ? (this.isChecked = false) : (this.isChecked = true)
      this.selectIds = []
      for (let sel of sels) {
        this.selectIds.push(sel.devChnId)
      }
    },
    // 子机构勾选change
    showChildfresh() {
      this.refreshDevice(1)
    },
    // 刷新数据
    refreshDevice(page) {
      this.getTrafficSerLane({
        deptId: this.departmentId, // 所属部门id
        sid: this.serverId, // 智能交通服务器文档id
        recursive: this.isShowChild ? 1 : 0, // 是否获取子节点列表
        key: this.inSearchName, // 搜索查询关键字,
        page: page,
        limit: this.limit
      })
    },
    // 搜索门禁
    getSearchDoor() {
      this.refreshDevice(1)
    },
    // 改变页码
    pageChange(page) {
      this.current = page
      this.refreshDevice(page)
    },
    // 分页功能
    pageSizeChange(size) {
      this.limit = size
      this.refreshDevice(1)
    }
  }
}
</script>
<style scoped>
.orgConfig {
  flex: 1;
  background-color: #1c3053;
  position: relative;
}
.bsMainChild {
  width: 100%;
}

.rt {
  float: right;
}

.tab-content-alarm {
  width: 100%;
  padding: 0px;
  background: #1c3053;
}
.feature-btn {
  margin: 16px 0px 0px 24px;
  height: 33px;
  line-height: 33px;
}

.feature-btn > button {
  height: 32px;
  margin-right: 8px;
}

.ivu-table-column-center .ivu-btn span {
  color: #57a3f3;
  font-size: 14px;
}

.page-style {
  width: 100%;
  border-top: none;
  padding: 3px 12px;
  background: #244575;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}

.table-relative {
  position: relative;
  height: 454px;
  margin: 0px;
  width: 100%;
}
.table-body /deep/ tr th:first-child .ivu-table-cell{
  padding-left: 24px !important;
}
.table-body /deep/ tr td:first-child .ivu-table-cell{
  padding-left: 24px !important;
}
.table-body {
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.bs-main {
  background: #1c3053;
}

.bs-main > .ivu-tabs {
  background-color: #0a111c !important;
}
</style>
<style>
.orgConfig .table-relative .ivu-checkbox-wrapper {
  margin-right: 0 !important;
}
</style>
