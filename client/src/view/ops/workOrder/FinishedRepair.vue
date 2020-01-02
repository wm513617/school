<template>
  <div class="finished-repair" v-resize="resize" ref='bsMain'>
    <div class="ar-button">
      <DatePicker v-model="DatePickerValue" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="small" class="div-datetime"></DatePicker>
      <Select v-model="repairsReason" placeholder="请选择" class="search-input" @change="changeRepairsReason">
        <Option v-for="item in causeList" :key="item.value" :label="item.label" :value="item.value"></Option>
      </Select>
      <Input v-model="seek" placeholder="请输入内容" class="search-input" size="small"></Input>
      <Button type="primary" size="small" icon="el-icon-search" @click="search">搜索</Button>
      <Button type="primary" size="small" icon="el-icon-download" @click="exportCSV">导出</Button>
    </div>
    <div class="ar-table">
      <Table :data="workOrderData" style="width: 100%" :height="tableHeight" @selection-change="handleSelectionChange">
        <TableColumn type="selection" width="50" align="center"></TableColumn>
        <TableColumn label="序号" type="index" min-width="100" align="center"></TableColumn>
        <TableColumn label="工单编号" prop="serial" min-width="150"></TableColumn>
        <TableColumn label="确认时间" prop="notarizeTime" min-width="150"></TableColumn>
        <TableColumn label="设备名称" prop="nameList" min-width="300" align="center" show-overflow-tooltip></TableColumn>
        <TableColumn label="报修原因" prop="repairsReason" min-width="100" align="center"></TableColumn>
        <TableColumn label="设备类型" prop="deviceType" min-width="100" align="center"></TableColumn>
        <TableColumn label="工单状态" prop="status" min-width="100" align="center"></TableColumn>
        <TableColumn label="上报人" prop="repairsName" min-width="100" align="center"></TableColumn>
        <TableColumn label="预计维修完成时间" prop="maintenanceTime" min-width="150" align="center"></TableColumn>
        <TableColumn min-width="100" label="详情" align="center">
          <template slot-scope="scope">
            <i class="el-icon-document" style="cursor: pointer" @click="tableOpenModal(scope)"></i>
          </template>
        </TableColumn>
      </Table>
    </div>
    <div class="page-footer">
      <Pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[25, 50, 100, 200]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="bscCount" background></Pagination>
    </div>
    <OrderDialog v-if="dialogVisible" :orderTitle="orderTitle" :orderId="orderId" :dialogVisible="dialogVisible" @cancel='cancel'></OrderDialog>
  </div>
</template>
<script>
import { Button, Input, DatePicker, Table, TableColumn, Pagination, Select, Option, Loading } from 'element-ui'
import { getWorkOrderListApi } from '../../../http/workOrder.api.js'
import OrderDialog from './OrderDialog'
export default {
  components: {
    Button,
    Input,
    DatePicker,
    Table,
    TableColumn,
    Pagination,
    Select,
    Option,
    Loading,
    OrderDialog
  },
  data() {
    return {
      DatePickerValue: '',
      workOrderData: [],
      loading: false,
      repairsReason: 5,
      causeList: [
        {label: '设备离线', value: 0},
        {label: '设备异常', value: 1},
        {label: '录像异常', value: 2},
        {label: '视频质量异常', value: 3},
        {label: '其他', value: 4},
        {label: '全部', value: 5}
      ],
      seek: '',
      tableHeight: 420,
      limit: 25,
      page: 1,
      bscCount: 0,
      dialogVisible: false,
      orderTitle: '工单详情',
      orderId: '',
      ids: [], // table多选行id
      elemIF: null
    }
  },
  mounted() {
    const DOMBsMain = this.$refs['bsMain']
    this.$nextTick(function() {
      this.tableHeight = DOMBsMain.offsetHeight - 96
    })
  },
  created() {
    this.getData()
  },
  computed: {
  },
  methods: {
    resize() {
      const DOMBsMain = this.$refs['bsMain']
      this.tableHeight = DOMBsMain.offsetHeight - 96
    },
    cancel(val) { // 关闭工单弹窗
      this.dialogVisible = val
      this.getData()
    },
    // table多选
    handleSelectionChange(val) {
      this.ids = val.map(({_id}) => {
        return _id
      })
    },
    // 搜索
    search() {
      this.getData('搜索')
    },
    exportCSV() { // 导出
      if (!this.elemIF) {
        this.elemIF = document.createElement('iframe')
      }
      let startTime = this.DatePickerValue[0] ? parseInt(new Date(this.DatePickerValue[0]).getTime() / 1000) : parseInt(new Date().getTime() / 1000 - 7 * 24 * 3600)
      let endTime = this.DatePickerValue[1] ? parseInt(new Date(this.DatePickerValue[1]).getTime() / 1000) : parseInt(new Date().getTime() / 1000)
      this.elemIF.src = `${window.origin}/api/setting/workmanagement/export?status=1&seek=${this.seek}&limit=${this.limit}&page=${this.page}&repairsReason=${this.repairsReason}&startTime=${startTime}&endTime=${endTime}`
      this.elemIF.style.display = 'none'
      document.body.appendChild(this.elemIF)
    },
    // 每页条数变化
    handleSizeChange(val) {
      this.limit = val
      this.getData()
    },
    // 当前页变化
    handleCurrentChange(val) {
      this.page = val
      this.getData()
    },
    changeRepairsReason(val) { // 改变报修原因
      this.repairsReason = val
      this.getData()
    },
    tableOpenModal(scope) { // 工单详情
      this.orderTitle = '工单详情'
      this.orderId = scope.row._id
      this.dialogVisible = true
    },
    // 获取Table数据
    getData(val) {
      this.loading = true
      const param = {
        status: 1,
        seek: this.seek,
        limit: this.limit,
        page: this.page,
        repairsReason: this.repairsReason,
        startTime: this.DatePickerValue[0] ? parseInt(new Date(this.DatePickerValue[0]).getTime() / 1000) : parseInt(new Date().getTime() / 1000 - 7 * 24 * 3600),
        endTime: this.DatePickerValue[1] ? parseInt(new Date(this.DatePickerValue[1]).getTime() / 1000) : parseInt(new Date().getTime() / 1000)
      }
      getWorkOrderListApi(param).then(res => {
        console.log(res, '维修完成res')
        this.bscCount = Number(res.headers['x-bsc-count']) || 0
        const status = ['待维修', '维修完成']
        const deviceTypeList = ['摄像机', '录像机', '报警主机', '消防主机', '报警探头', '消防探头', '报警柱', '报警箱', '闸机', '解码器', '网络键盘', '拼接控制器', '其他']
        const repairsReasonList = ['设备离线', '设备异常', '录像异常', '视频质量异常', '其他']
        this.workOrderData = res.data.map(item => {
          item.status = status[item.status] || ''
          item.deviceType = deviceTypeList[item.deviceType] || ''
          item.repairsReason = repairsReasonList[item.repairsReason] || ''
          item.notarizeTime = item.notarizeTime ? this.$moment(item.notarizeTime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''
          item.maintenanceTime = item.maintenanceTime ? this.$moment(item.maintenanceTime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''
          let deviceNameArry = []
          item.deviceList.forEach(v => {
            deviceNameArry.push(v.name)
          })
          item.nameList = deviceNameArry.join(',') // 从设备列表中拼接设备名称
          return item
        })
        this.loading = false
        if (val) {
          this.$Notice.success({ title: '成功', desc: val + '成功' })
        }
      }).catch(err => {
        console.log(err, 'err')
        this.loading = false
        if (val) {
          this.$Notice.error({ title: '失败', desc: val + '失败' })
        }
      })
    }
  },
  watch: {
  }
}
</script>
<style scoped>
.finished-repair {
  width: 100%;
  background: #1b3153;
}
.search-input {
  width: 240px;
  margin-right: 8px;
}
.ar-button {
  padding: 12px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
}
.div-datetime {
  margin-right: 8px;
}
.page-footer {
  height: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background: #244575;
  padding-right: 20px;
}
</style>
