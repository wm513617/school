<template>
  <div class="duty-list">
    <div class="duty-list-left">
      <div class="duty-list-search">
        <div class="duty-list-search-input">
          <Select style="width:240px;margin:12px 12px 12px 24px;height: 32px;" v-model="model">
            <Option v-for="(item,index) in dutyOptions" :value="item.value" :key="index">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="search-btn">
          <Button style='height: 32px;margin-right: 8px'  @click="searchDutyList()">查看</Button>
          <Button style='height: 32px'  @click="exportData">导出</Button>
        </div>
      </div>
      <div ref="height" class="duty-list-table">
        <i-table :height='tableHeight' highlight-row :columns="dutylistColumns" :data="dutylistData" ref='table'></i-table>
      </div>
    </div>
    <div class="duty-list-today">
      <div class="duty-list-today-content">
        <div class="title">
          <span>今日值班</span>
          <span>{{todayDuty.date}}</span>
          <span>{{todayTime}}</span>
        </div>
        <div class="forms">
          <div class="forms-none" v-if="isShow">暂无数据</div>
          <div class="forms-box" v-show="!isShow" v-for='(val,index) in todayDuty.content' :key='index'>
            <h4>{{val.shift}}（{{val.dutytime}}）</h4>
            <div class="forms-box-content">
              <table cellpadding='0' cellspacing='0'>
                <tr style="background: #244575;">
                  <th style="width: 33%;">姓名</th>
                  <th style="width: 33%">职务</th>
                  <th style='width: 44%'>电话</th>
                </tr>
                <tr v-for='(con,index) in val.people' :key='index'>
                  <td>{{con.name}}</td>
                  <td>{{con.title}}</td>
                  <td>{{con.phone}}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="duty-notice">
        <div class="notice-title">
          值班公告
        </div>
        <div class="notice-con">
          <div class="content">
            {{noticeCon}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import moment from 'moment'
export default {
  data() {
    return {
      model: '',
      tableHeight: '',
      todayTime: '',
      holder: '',
      timer: null,
      isShow: false,
      dutylistColumns: [],
      noticeCon: ''
    }
  },
  computed: {
    ...mapState({
      dutyOptions: ({ dutyList }) => dutyList.dutyOptions,
      dutylistData: ({ dutyList }) => dutyList.dutylistData,
      todayDuty: ({ dutyList }) => dutyList.todayDuty
    })
  },
  methods: {
    ...mapActions(['getDutyList', 'getDutyByName', 'getNotice']),
    /**
     * table表头动态生成
     */
    setDutylistColumns(list) {
      console.log(list, '4444')
      this.dutylistColumns = []
      if (list.plans[0].template && list.plans[0].template.detail) {
        list.plans[0].template.detail.forEach((v, n) => {
          this.dutylistColumns.push({
            title: v.shiftName + '（' + v.startTime + '~' + v.endTime + '）',
            minWidth: 260,
            key: 'name' + n,
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
                    title: params.row['name' + n]
                  }
                },
                params.row['name' + n]
              )
            }
          })
        })
      }
      if (list.plans[0].planTimeType === 'month') {
        this.dutylistColumns.unshift({
          title: '日期',
          width: 125,
          key: 'date'
        })
      } else if (list.plans[0].planTimeType === 'week') {
        this.dutylistColumns.unshift({
          title: '星期',
          width: 125,
          key: 'week'
        })
      } else {
        this.dutylistColumns.unshift({
          title: '日期',
          width: 125,
          key: 'time'
        })
      }
    },
    exportData() {
      this.$refs.table.exportCsv({
        filename: this.model
      })
    },
    /**
     * 搜索框点击查看列表
     */
    searchDutyList() {
      console.log(this.dutylistData, '66666')
      this.getDutyByName({name: this.model}).then((res) => {
        if (res.data.plans[0]) {
          this.setDutylistColumns(res.data)
        }
        if (this.todayDuty.content) {
          this.isShow = !this.todayDuty.content[0]
        } else {
          this.isShow = true
        }
      }).catch(() => {
        this.isShow = true
        this.errorMsg('列表获取失败')
      })
    },
    resizefun() {
      this.tableHeight = this.$refs['height'].offsetHeight
    }
  },
  created() {
    // 页面初始化列表信息
    this.getDutyList().then((res) => {
      if (res.data.plans[0]) {
        this.setDutylistColumns(res.data)
      }
      if (this.todayDuty.content) {
        this.isShow = !this.todayDuty.content[0]
      } else {
        this.isShow = true
      }
      if (res.data.todayDuty.time) {
        this.todayTime = moment(res.data.todayDuty.time).format('H:mm:ss')
        this.timer = setInterval(() => {
          var todayTime = res.data.todayDuty.time
          this.todayTime = moment(todayTime).format('H:mm:ss')
          res.data.todayDuty.time += 1000
        }, 1000)
      }
      if (res.data.names[0]) {
        this.model = res.data.names[0]
      }
    }).catch(() => {
      this.isShow = true
      this.errorMsg('列表获取失败')
    })
    this.getNotice().then(res => {
      console.log(res, 'resresres')
      this.noticeCon = res.data.notice
    })
  },
  mounted() {
    // table表格高度只适应
    this.tableHeight = this.$refs['height'].offsetHeight
    window.addEventListener('resize', this.resizefun)
  },
  beforeDestroy() {
    clearInterval(this.timer)
    window.removeEventListener('resize', this.resizefun)
    this.resizefun = null
  }
}
</script>

<style lang="less" scoped>
.duty-list {
  width: 100%;
  height: 100%;
}
.duty-list-left {
  width: calc(~'100% - 900px');
  height: 100%;
  background: #1b3153;
  display: inline-block;
  vertical-align: top;
  position: relative;
  .duty-list-table {
    position: absolute;
    width: 100%;
    height: calc(~'100% - 56px');
    /deep/ .ivu-table-cell {
      padding-left: 24px !important;
    }
  }
}

.duty-list-search {
  width: 100%;
  display: flex;
}
.search-btn {
  margin-top: 12px;
}
.duty-list-today {
  width: 863px;
  box-sizing: content-box;
  height: 100%;
  background: #0c1b32;
  padding: 0 16px;
  display: inline-block;
}
.duty-notice{
  float: left;
  width: 513px;
  height: 100%;
  background: #1b3153;
}
.notice-title{
  height: 38px;
  width: 100%;
  background: #0f2343;
  line-height: 38px;
  font-size: 14px;
  text-align: center;
}
.notice-con{
  width: 100%;
  height: 100%;
  padding: 16px;
  .content{
    width: 100%;
    text-indent:2em;
    min-height: 400px;
    background: #244575;
    border: 1px solid #0f2343;
    word-wrap: break-word;
  }
}
.duty-list-today-content {
  float: left;
  width: 350px;
  height: 100%;
  background: #1b3153;
}
.forms-none {
  text-align: center;
  margin-top: 200px;
  padding-bottom: 100px;
}
.title {
  height: 38px;
  width: 100%;
  background: #0f2343;
  line-height: 38px;
  font-size: 14px;
}
.title span:first-child {
  padding-left: 24px;
}
.title span:nth-child(2) {
  padding-right: 12px;
  float: right;
}
.title span:nth-child(3) {
  padding-right: 16px;
  float: right;
}
.forms {
  width: 100%;
  height: calc(~'100% - 38px');
  overflow-y: auto;
}
.forms-box {
  margin: 0 16px;
}
.forms-box h4 {
  font-size: 12px;
  padding-top: 24px;
  padding-bottom: 12px;
}
.forms-box-content {
  width: 100%;
}
.forms-box-content table {
  width: 100%;
  border: 1px solid #244575;
}
.forms-box-content table th {
  height: 32px;
  text-align: left;
  padding-left: 16px;
  border-bottom: 1px solid #244575;
}
.forms-box-content table td {
  height: 38px;
  padding-left: 16px;
  border-bottom: 1px solid #244575;
}
.forms-box-content table tr:last-child td {
  border-bottom: 0;
}
</style>
