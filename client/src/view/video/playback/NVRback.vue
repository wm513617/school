<template>
  <div style="min-height:630px" class="nvrback">
    <div class="condition">
      <span>文件类型</span>
      <Select v-model="selNVR.recordType" style="width:176px" :disabled="true||isSyncCheck">
        <Option v-for="(item, i) in NVRSelList.fileTypeList" :value="item.value" :key="i">{{ item.label }}</Option>
      </Select>
    </div>
    <div class="condition" style="height: auto;">
      <span>通道号</span>
      <!-- <Select v-model="channel" multiple  :disabled="true"  collapse-tags style="width:176px">
          <Option v-for="item in NVRSelList.channelList" :key="item.value" :value="item.value">{{ item.label }}</Option>
        </Select> -->
      <Input v-model="channel" style="width: 176px;" :disabled="true" />
    </div>
    <div class="condition">
      <span>硬盘</span>
      <!-- <Select v-model="selNVR.diskNum" multiple :disabled="true" style="width:176px" size="small">
          <Option v-for="item in NVRSelList.diskNumList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select> -->
      <Input :value="'全部'" style="width: 176px;" :disabled="true" />
    </div>
    <div class="condition">
      <span>开始时间</span>
      <!-- <DatePicker :editable="false" type="datetime" @on-change="startTimeFn" v-model="selNVR.sTime" :options="endDate" format="yyyy-MM-dd HH:mm:ss" placeholder="选择时间" style="width: 216px"></DatePicker> -->
      <el-date-picker v-model="sTime" type="datetime" popper-class="dtp" placeholder="选择时间" size="mini" style="width: 176px" align="right"></el-date-picker>
    </div>

    <div class="condition">
      <span>结束时间</span>
      <!-- <DatePicker :editable="false" :disabled="isSyncCheck" type="datetime" @on-change="endTimeFn" v-model="selNVR.eTime" :options="endDate" format="yyyy-MM-dd HH:mm:ss" placeholder="选择时间" style="width: 216px"></DatePicker> -->
      <el-date-picker v-model="eTime" :disabled="isSyncCheck" type="datetime" popper-class="dtp" placeholder="选择时间" size="mini" style="width: 176px" align="right"></el-date-picker>
    </div>
    <div class="searchbtn">
      <Button type="primary" :loading="false" @click="videoFilter(-1)" class="theme-btn">检索</Button>
    </div>
    <div id="tableVideo" class="table filterList" v-if="tableData.length > 0">
      <table cellpadding="0" cellspacing="0">
        <thead>
          <tr>
            <td style="width: 9%;">操作</td>
            <td style="width: 23%;">开始时间</td>
            <td style="width: 18%;">录像时长</td>
            <td style="width: 19%;">文件大小</td>
            <td style="width: 19%;">文件类型</td>
            <td style="width: 12%;">盘号</td>
          </tr>
        </thead>
      </table>
      <div class="tbody">
        <!-- <div v-if="tableData.length === 0">暂无数据</div> -->
        <table cellpadding="0" cellspacing="0">
          <tbody>
            <tr v-for="(item,index) in filteredTableData" :key="index" @dblclick="playItem(item,index)">
              <td style="width: 9%;" @click="playItem(item, index)">
                <i class="iconfont  icon-play" style="color: #30acff"></i>
              </td>
              <td style="width: 23%;">{{item.sTime}}</td>
              <td style="width: 18%;">{{item.slotTime}}</td>
              <td style="width: 19%;">{{item.filesize}}</td>
              <td style="width: 19%;">{{NVRSelList.fileTypeObj[item.recordType]}}</td>
              <td style="width: 12%;">{{item.channel}}</td>
            </tr>
          </tbody>
        </table>
        <Page :total="total" @on-change="videoFilter" :page-size="5" :styles="{ 'float': 'right', marginRight: '19%', marginTop: '10px',marginBottom: '10px'}" simple></Page>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState, mapGetters } from 'vuex'
export default {
  components: {
  },
  data() {
    return {
      // 这个是前端回放视频列表
      // tableData: [],
      // 前端回放总个数
      // total: 0,
      // 当前页数
      // rowId: 1,
      queryNode: null,
      // 当前是以多少条去分割
      segmenCount: 5,
      // 前端回放筛选条件
      sTime: (() => {
        const d = new Date()
        d.setHours(0)
        d.setMinutes(0)
        d.setSeconds(0)
        return d
      })(),
      eTime: new Date(),
      selNVR: {
        recordType: 'all',
        channel: [],
        diskNum: 'all',
        sTime: '',
        eTime: ''
      },
      NVRSelList: {
        fileTypeObj: {
          all: '全部',
          timeVideo: '定时',
          eventVideo: '事件',
          signVideo: '标记',
          vehicleVideo: '车辆',
          faceVideo: '人脸'
        },
        fileTypeList: [
          {
            value: 'all',
            label: '全部'
          },
          {
            value: 'timeVideo',
            label: '定时'
          },
          {
            value: 'eventVideo',
            label: '事件'
          },
          {
            value: 'signVideo',
            label: '标记'
          },
          {
            value: 'vehicleVideo',
            label: '车辆'
          },
          {
            value: 'faceVideo',
            label: '人脸'
          }
        ],
        channelList: [
          // {
          //   value: 'all',
          //   label: '全部',
          //   sel: false
          // },
          {
            value: '1',
            label: '通道1',
            sel: false
          },
          {
            value: '2',
            label: '通道2',
            sel: true
          },
          {
            value: '3',
            label: '通道3',
            sel: false
          },
          {
            value: '4',
            label: '通道4',
            sel: true
          },
          {
            value: '5',
            label: '通道5',
            sel: true
          },
          {
            value: '6',
            label: '通道6',
            sel: true
          }
        ],
        diskNumList: [
          {
            value: 'all',
            label: '全部'
          },
          {
            value: 'C',
            label: '硬盘C'
          },
          {
            value: 'D',
            label: '硬盘D'
          },
          {
            value: 'E',
            label: '硬盘E'
          }
        ]
      },
      channel: '',
      endDate: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      }
    }
  },
  props: {
    plugin: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    'selNVR.channel': (val, oldVal) => {
      if (val && val.length > 4) { this.selNVR.channel = oldVal }
    },
    isSyncCheck(s) {
      if (s) {
        this.selNVR.recordType = this.NVRSelList.fileTypeList[0].value
      }
    },
    curNode(val) {
      this.channel = this.curNode.chan
    }
  },
  computed: {
    ...mapState({
      curNode: ({ videoOrg }) => videoOrg.curNode,
      videoOrgData: ({ videoOrg }) => videoOrg.videoOrgData,
      isSync: ({ playback }) => playback.isSync,
      total: ({ playback }) => playback.nvrCount,
      rowId: ({ playback }) => playback.rowId,
      isSyncCheck: ({ playback }) => playback.isSyncCheck
    }),
    ...mapGetters(['nvrTableData']),
    filteredTableData() {
      return this.tableData[this.rowId - 1]
    },
    tableData() {
      return this.nvrTableData
    }
  },
  methods: {
    initCondition() {
      this.selNVR = {
        recordType: 'all',
        diskNum: 'all'
      }
      this.channel = ''
      this.sTime = (() => {
        const d = new Date()
        d.setHours(0)
        d.setMinutes(0)
        d.setSeconds(0)
        return d
      })()
      this.eTime = new Date()
      this.$store.commit('SET_NVRLIST', [])
    },
    querySync() {
      this.$parent.$emit('queryNVRSync', this.dateToTime(this.sTime))
    },
    // 进行索引
    videoFilter(rowId = 1) {
      if (!this.$store.getters.plugin.valid) {
        this.$Notice.warning({ title: '警告', desc: '请先下载插件，或当前浏览器不支持插件！' })
        return
      }
      if (this.tableData[rowId - 1]) {
        this.$store.commit('SET_ROWID', rowId)
        return
      }
      const sTime = this.dateToTime(this.sTime)
      if (this.isSyncCheck) {
        return this.$emit('queryNVR', sTime / 1000)
      }
      const eTime = this.dateToTime(this.eTime)
      if (sTime > eTime) {
        this.$Notice.warning({ title: '警告', desc: '开始时间不能大于结束时间！' })
        return
      }
      const obj = {
        recordType: this.selNVR.recordType, // 录像请求类型,
        sTime: parseInt(sTime / 1000), // 开始时间,
        eTime: parseInt(eTime / 1000), // 结束时间,
        rowId,
        rowCount: this.segmenCount
      }
      this.queryNode = this.curNode
      return this.$emit('queryNVR', obj)
    },
    // 点击视频列表
    playItem(item, index) {
      this.plugin.setPluginType('record')
      const obj = {
        devIp: item.item.devIp, // 设备ip,
        devPort: +item.item.devPort, // 设备端口,
        channel: item.item.channel, // 通道号,
        sTime: item.item.sTime, // 开始时间,
        eTime: item.item.eTime, // 结束时间,
        streamType: item.item.streamType, // 码流类型,
        streamConnPort: this.queryNode.eid.dport,
        item: item.item,
        node: this.queryNode
      }
      this.$emit('playNVR', obj)
    },
    startTimeFn(time) {
      this.selNVR.sTime = time
    },
    endTimeFn(time) {
      this.selNVR.eTime = time
    },
    // 将组件中的时间改成时间时间戳
    dateToTime(time) {
      return this.$moment(time).format('x')
    },
    // 将数组分割为二维数组
    segmenArr(arr = [], row) {
      const result = []
      const cp = JSON.parse(JSON.stringify(arr))
      while (cp.length > row) {
        result.push(cp.splice(0, row))
      }
      result.push(cp)
      return result
    }
  },
  created() {
    this.channel = this.curNode.chan
  },
  mounted() {
    // this.selNVR.sTime = this.$moment().format('YYYY-MM-DD') + ' 00:00:00'
    // this.selNVR.eTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
  }

}
</script>

<style scoped>
.condition {
  height: 32px;
  margin: 10px 0;
  width: 100%;
  padding: 0 20px;
}
.condition > * {
  display: inline-block;
}
.condition > span {
  width: 80px;
  line-height: 24px;
  color: #fff;
}

.moewIf {
  width: 100%;
  /*min-height: 160px;*/
}
.nosupport {
  line-height: 40px;
  text-align: center;
  font-size: 24px;
}
.searchbtn {
  text-align: center;
  margin-top: 20px;
}
.searchbtn > * {
  margin: 0 10px;
  width: 100px;
}

.checkboxGroup {
  display: inline-block;
  width: 170px;
}
.checkboxAll {
  display: inline-block;
  width: 80px;
  vertical-align: top;
}

/* 表单 */
#tableVideo {
  overflow-x: auto;
  width: 94%;
  margin-left: 3%;
  margin-top: 40px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
#tableVideo table {
  width: 100%;
}
#tableVideo .table table {
  width: 100%;
}
.filterList table thead {
  width: 100%;
  background: #254576;
  height: 32px;
}
.filterList table thead td {
  text-align: center;
}
.filterList table td {
  padding: 8px 0;
  text-align: center;
}
.filterList .tbody {
  background: #1b3153;
  /* height: auto; */
  /* min-height: 320px; */
  border: 1px solid #203863;
}
.filterList .tbody div {
  text-align: center;
}
.filterList .tbody tr:hover {
  background: #20365c;
}
.filterList .tbody tbody td {
  text-align: center;
  /* border-bottom: 1px solid #263e69; */
  border-top: 1px solid rgba(58, 90, 139, 0.4);
}
</style>
<style lang="less">
.el-date-picker {
  width: 292px;
  .el-picker-panel__content {
    width: 262px;
  }
}
.el-time-panel {
  width: 160px;
}
.dtp {
  &.el-picker-panel, .el-input__inner, .el-time-panel{
    color: #fff;
    border-color: #5676a9;
    background: #1C3053;
  }
  &.el-picker-panel{
    border-color: #4699f9;
  }
  .el-date-picker__time-header, .el-date-table th, .el-date-picker__header--bordered{
    border-bottom: 1px solid #4699f9;
  }
  &.el-popper[x-placement^=bottom] .popper__arrow::after{
    top: 0;
    border-bottom-color: #4699f9;
  }
  .el-picker-panel__footer, .el-time-panel__footer{
    display: none;
  }
  .el-picker-panel__icon-btn, .el-date-picker__header-label, .el-date-table th, .el-year-table td .cell, .el-month-table td .cell, .el-time-spinner__item.active:not(.disabled), .el-time-spinner__item{
    color: #fff;
  }
  .el-date-table td.next-month, .el-date-table td.prev-month{
    color: #606266;
  }
  .el-time-spinner__item:hover:not(.disabled):not(.active){
    background: #657ca8;
  }
  .el-time-panel__content::after, .el-time-panel__content::before {
    border-top: 1px solid #4699f9;
    border-bottom: 1px solid #4699f9;
  }
}
#retrieval {
  .el-input__suffix {
    right: 1px;
  }
  .is-disabled .el-input__inner{
    background: #535f77;
    color: #ccc;
    overflow: hidden;
  }
}
</style>
