<template>
  <div v-if="openModal">
    <Modal v-model="openModal" title="选择案件" :closable="false" :mask="false" :mask-closable="false" width='1000px'>
      <div class="case-top">
        <div style="text-align:right; padding-top: 5px">
          <Input v-model="seek" placeholder="请输入报警人、事件名称" style="width: 200px;" />
          <DatePicker :options="options1" type="datetime" style="width: 200px" v-model="startTime" :editable="false" :clearable="false"></DatePicker>
          <b>至</b>
          <DatePicker :options="options1" type="datetime" style="width: 200px" v-model="endTime" :editable="false" :clearable="false"></DatePicker>
          <Button type="ghost" icon="ios-search" @click="search" style="margin-left:24px; margin-right: 25px">搜索</Button>
        </div>
      </div>
      <div class="table-body">
        <Table size="small" :columns="receiveTitle" :data="receiveData" height="400" @on-selection-change="receiveInSel"></Table>
      </div>
      <div slot="footer">
        <div class="newModal">
          <Button type="ghost" @click="cancel" >取消</Button>
          <Button type="primary" style="margin-left: 16px;" :disabl="!rowid.length" @click="saveBtn">确定</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getSearchList, setCaseAlarmDetails, getCaseAlarmDetails } from '../../http/business/caseProcessing.api'
export default {
  name: 'caseDlalog',
  props: {
    openModal: {
      // 是否打开弹窗
      type: Boolean,
      default: false
    },
    caseList: {
      // 数据接收
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      seek: '',
      startTime: this.$moment(new Date(new Date().toLocaleDateString()).getTime()).format('YYYY-MM-DD HH:mm:ss'),
      endTime: this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      // 时间选择不能大于当前日期
      options1: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      },
      // 表格相关参数
      receiveTitle: [
        {
          type: 'selection',
          align: 'center',
          width: 60
        },
        {
          title: '案件编号',
          key: 'eventCode',
          align: 'center',
          minWidth: 80
        },
        {
          title: '案件名称',
          key: 'eventName',
          align: 'center',
          minWidth: 100
        },
        {
          title: '报警人',
          key: 'person',
          align: 'center',
          minWidth: 60
        },
        {
          title: '学号',
          key: 'studentNum',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '联系电话',
          key: 'phone',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '报警时间',
          key: 'alarmTime',
          minWidth: 150,
          align: 'center',
          render: (h, params) => {
            var text = params.row.alarmTime
              ? this.$moment(params.row.alarmTime * 1000).format('YYYY-MM-DD HH:mm:ss')
              : ''
            return h('span', text)
          }
        }
      ],
      receiveData: [],
      rowid: []
    }
  },
  methods: {
    // 取消
    cancel() {
      this.$emit('update:openModal', false)
    },
    // 确定
    saveBtn() {
      if (this.rowid.length !== 1) {
        this.warningMsg('请选择一个案件')
        return
      }
      // 先请求详情
      getCaseAlarmDetails(this.rowid[0]._id)
        .then(res => {
          let structuredTrack = this.$lodash.cloneDeep(res.data.structuredTrack)
          this.caseList.map(e => {
            if (e.startTime && e.endTime && e.startTime < e.endTime) {
              structuredTrack.push({
                resource: e.resId,
                startTime: e.startTime,
                endTime: e.endTime
              })
            }
          })
          structuredTrack.sort((a, b) => a.startTime - b.startTime)
          // 请求修改接口
          setCaseAlarmDetails(this.rowid[0]._id, { structuredTrack })
            .then(res => {
              this.$emit('update:openModal', false)
              this.successMsg('结构化追踪标记添加成功')
            })
            .catch(err => {
              console.log(err)
              this.errorMsg('保存失败，请稍后尝试')
            })
        })
        .catch(err => {
          console.log(err)
          this.errorMsg('保存失败，请稍后尝试')
        })
    },
    // 搜索
    search() {
      if (Date.parse(this.startTime) > Date.parse(this.endTime)) {
        this.warningMsg('开始时间不能大于结束时间，请重新输入')
      } else {
        let data = {
          startTime: Date.parse(this.startTime) / 1000 || '',
          endTime: Date.parse(this.endTime) / 1000 || '',
          name: this.seek
        }
        getSearchList(data)
          .then(res => {
            this.receiveData = res.data
          })
          .catch(err => {
            console.log(err)
            this.warningMsg('查询失败，请稍后重试')
          })
      }
    },
    // 表格选中
    receiveInSel(item) {
      this.rowid = item
    }
  }
}
</script>

<style scoped lang="less">
.case-top {
  width: 100%;
  height: 60px;
}
</style>
