<template>
  <div class="awaiting-repair" v-resize="resize" ref='bsMain'>
    <div class="ar-button">
      <Button type="primary" size="small" icon="el-icon-plus" @click="addOpenModal">添加</Button>
      <Button type="primary" size="small" icon="el-icon-edit" @click="editOpenModal">修改</Button>
      <Button type="primary" size="small" icon="el-icon-remove-outline" @click="removeOrder">删除</Button>
      <Button type="primary" size="small" icon="el-icon-refresh" @click="refresh">刷新</Button>
      <Button type="primary" size="small" icon="el-icon-setting" @click="notarizeOpenModal">维修确认</Button>
      <div class="div-null"></div>
      <Input v-model="seek" placeholder="请输入内容" class="search-input" size="small"></Input>
      <DatePicker v-model="DatePickerValue" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="small" class="div-datetime"></DatePicker>
      <Button type="primary" size="small" icon="el-icon-search" @click="search">搜索</Button>
    </div>
    <div class="ar-table">
      <Table :data="workOrderData" style="width: 100%" :height="tableHeight" @selection-change="handleSelectionChange">
        <TableColumn type="selection" width="50" align="center"></TableColumn>
        <TableColumn label="序号" type="index" min-width="100" align="center"></TableColumn>
        <TableColumn label="工单编号" prop="serial" min-width="200"></TableColumn>
        <TableColumn label="报修时间" prop="repairsTime" min-width="150"></TableColumn>
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
import OrderDialog from './OrderDialog'
import { getWorkOrderListApi, removeEditWorkOrderApi } from '../../../http/workOrder.api.js'
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
      seek: '', // 搜索框
      workOrderData: [], // table数据
      tableHeight: 420,
      loading: false,
      DatePickerValue: [],
      limit: 25,
      page: 1,
      bscCount: 0,
      dialogVisible: false, // 弹窗显示
      orderTitle: '创建工单',
      ids: [], // table多选行id
      orderId: '' // 工单id
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
    tableOpenModal(scope) { // 工单详情
      this.orderTitle = '工单详情'
      this.orderId = scope.row._id
      this.dialogVisible = true
    },
    addOpenModal() { // 创建工单
      this.orderTitle = '创建工单'
      this.dialogVisible = true
    },
    editOpenModal() { // 修改工单
      if (this.ids.length === 1) {
        this.orderTitle = '修改工单'
        this.orderId = this.ids[0]
        this.dialogVisible = true
      } else {
        this.$Notice.warning({ title: '警告', desc: '请选择一个工单' })
      }
    },
    notarizeOpenModal() { // 维修确认
      if (this.ids.length === 1) {
        this.orderTitle = '维修确认'
        this.orderId = this.ids[0]
        this.dialogVisible = true
      } else {
        this.$Notice.warning({ title: '警告', desc: '请选择一个工单' })
      }
    },
    resize() { // 窗口大小调整
      const DOMBsMain = this.$refs['bsMain']
      this.tableHeight = DOMBsMain.offsetHeight - 96
    },
    cancel(val) { // 关闭工单弹窗
      this.dialogVisible = val
      this.getData()
    },
    // 刷新
    refresh() {
      this.getData('刷新')
    },
    // 删除工单
    removeOrder() {
      if (this.ids.length < 1) {
        this.$Notice.warning({ title: '警告', desc: '请选择工单' })
        return
      }
      removeEditWorkOrderApi(this.ids).then(res => {
        this.$Notice.success({ title: '成功', desc: '删除成功' })
        this.getData()
      }).catch(err => {
        console.log(err, '删除工单')
        this.$Notice.error({ title: '失败', desc: '删除失败' })
        this.getData()
      })
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
    // 获取Table数据
    getData(val) {
      this.loading = true
      const param = {
        status: 0,
        seek: this.seek,
        limit: this.limit,
        page: this.page,
        repairsReason: 5,
        startTime: this.DatePickerValue[0] ? parseInt(new Date(this.DatePickerValue[0]).getTime() / 1000) : parseInt(new Date().getTime() / 1000 - 7 * 24 * 3600),
        endTime: this.DatePickerValue[1] ? parseInt(new Date(this.DatePickerValue[1]).getTime() / 1000) : parseInt(new Date().getTime() / 1000)
      }
      getWorkOrderListApi(param).then(res => {
        this.bscCount = Number(res.headers['x-bsc-count']) || 0
        const status = ['待维修', '维修完成']
        const deviceTypeList = ['摄像机', '录像机', '报警主机', '消防主机', '报警探头', '消防探头', '报警柱', '报警箱', '闸机', '解码器', '网络键盘', '拼接控制器', '其他']
        const repairsReasonList = ['设备离线', '设备异常', '录像异常', '视频质量异常', '其他']
        this.workOrderData = res.data.map(item => {
          item.status = status[item.status] || ''
          item.deviceType = deviceTypeList[item.deviceType] || ''
          item.repairsReason = repairsReasonList[item.repairsReason] || ''
          item.repairsTime = item.repairsTime ? this.$moment(item.repairsTime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''
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
.awaiting-repair {
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
.div-null {
  flex: 1;
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
