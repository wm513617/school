<template>
  <div id="retrieval">
    <Tabs @on-click="x => tab = x">
      <!-- <TabPane label="常规回放">
        <div>
          <Calendar width=260 @clicktest="clicktest" @range="daterange" style="margin:0 auto;" ref="calender" :showSign="sourceType===1" :daterange="sourceType===2"></Calendar>

          <div class="condition">
            <span>文件来源</span>
            <Select v-model="sourceType" style="width:160px" size="small">
              <Option v-for="item in sourceList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div v-if="sourceType===1">
            <div class="condition" v-if="tabVal=='playBack'">
              <span style='vertical-align:top;'>精确时间</span>
             <BStimePicker :datetime='timeVal' @timeChange='timeChange' :width='160' :height='26'></BStimePicker>
            </div>
            <div class="condition">
              <span v-if="tabVal=='playBack'">文件类型</span>
              <Select v-model="fileType" style="width:160px" size="small">
                <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>

            <div class="moewIf">
              <div class="eventCheck" v-if="fileType=='event'" style="padding:0 20px;">
                <div class="checkboxAll">
                  <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
                </div>
                <Checkbox-group v-model="checkAllGroup" class="checkboxGroup">
                  <Checkbox label="移动侦测"></Checkbox>
                  <Checkbox label="视频丢失"></Checkbox>
                  <Checkbox label="视频遮挡"></Checkbox>
                  <Checkbox label="报警输入"></Checkbox>
                </Checkbox-group>
              </div>

              <div class="condition" v-if="fileType=='recordFlag'">
                <span>标记名称</span>
                <Input v-model="signName" placeholder="请输入..." style="width: 160px" size="small" />
              </div>
            </div>
          </div>
          <div v-if="sourceType===2">
            <div class="condition">
              <span style='vertical-align:top;'>开始时间</span>
              <BStimePicker :datetime='sTime' @timeChange='sTimeChange' :width='160' :height='26'></BStimePicker>
            </div>
            <div class="condition">
              <span style='vertical-align:top;'>结束时间</span>
              <BStimePicker :datetime='eTime' @timeChange='eTimeChange' :width='160' :height='26'></BStimePicker>
            </div>
          </div>

          <div class="searchbtn">
            <Button type="primary" :disabled="!authInfo.searching" :loading="loading" v-if="tabVal=='playBack'" @click="videoFilter()" class="theme-btn">检索</Button>
          </div>
          <div class="case-message" v-if="isMessageShow">
            <div class="head">
              <span>案件信息</span>
            </div>
            <div class="content">
              <el-carousel :autoplay="false" indicator-position="none" height="500px">
                <el-carousel-item class="demo-carousel">
                  <div class="carose-one">
                    <p>事件名称: {{caseChecked.eventName}}</p>
                    <p>报警人: {{caseChecked.person}}</p>
                    <p>联系电话: {{caseChecked.phone}}</p>
                    <p>院系/单位: {{caseChecked.department}}</p>
                    <p>事发地点: {{caseChecked.incidentAddress}}</p>
                    <p>案件开始时间: {{$moment(caseChecked.alarmTime * 1000).format('YYYY-MM-DD HH:mm:ss')}}</p>
                    <p>案件结束时间: {{$moment(caseChecked.endTime * 1000).format('YYYY-MM-DD HH:mm:ss')}}</p>
                    <p>事件特征: {{caseChecked.description}}</p>
                  </div>
                </el-carousel-item>
                <el-carousel-item class="demo-carousel" v-for="(item, index) in caseChecked.images" :key="index">
                  <img :src="item">
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
          <slot></slot>
        </div>
      </TabPane>
      <TabPane label="智能回放" disabled>
      </TabPane> -->
      <TabPane label="案件信息">
          <div class="case-message">
            <!-- <div class="head"> -->
              <!-- <span>案件信息</span> -->
            <!-- </div> -->
            <div class="content">
              <el-carousel :autoplay="false" indicator-position="none" height="500px">
                <el-carousel-item class="demo-carousel">
                  <div class="carose-one">
                    <p>事件名称: {{caseChecked.eventName}}</p>
                    <p>报警人: {{caseChecked.person}}</p>
                    <p>联系电话: {{caseChecked.phone}}</p>
                    <p>院系/单位: {{caseChecked.department}}</p>
                    <p>事发地点: {{caseChecked.incidentAddress}}</p>
                    <p>案件开始时间: {{$moment(caseChecked.alarmTime * 1000).format('YYYY-MM-DD HH:mm:ss')}}</p>
                    <p>案件结束时间: {{$moment(caseChecked.endTime * 1000).format('YYYY-MM-DD HH:mm:ss')}}</p>
                    <p>事件特征: {{caseChecked.description}}</p>
                  </div>
                </el-carousel-item>
                <el-carousel-item class="demo-carousel" v-for="(item, index) in caseChecked.images" :key="index">
                  <img :src="item">
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
      </TabPane>
    </Tabs>

  </div>
</template>

<script>
import NvrRetrievel from './NvrRetrievel.js'
import { mapState, mapActions } from 'vuex'
import { Carousel, CarouselItem } from 'element-ui'
export default {
  name: 'retrieval',
  components: {
    'el-carousel': Carousel,
    'el-carousel-item': CarouselItem
  },
  mixins: [NvrRetrievel],
  data() {
    return {
      setting: {
        autoplay: false,
        autoplaySpeed: 2000,
        dots: 'inside',
        radiusDot: false,
        trigger: 'hover',
        arrow: 'hover'
      },
      value1: 0,
      showName: 'playback',
      tab: 0,
      timeVal: (() => {
        const date = new Date()
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        return date
      })(),
      dateVal: new Date(),
      startTime: (() => {
        const date = new Date()
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        return date
      })(),
      endTime: new Date(),
      clearable: false,
      fileType: 'all',
      videoTypeList: [
        { value: 'all', label: '全部' },
        { value: 'manualRecord', label: '手工录像' },
        { value: 'timeRecord', label: '定时录像' },
        { value: 'event', label: '事件录像' },
        { value: 'recordFlag', label: '标记' }
        // { value: 'vehicle', label: '车辆' },
        // { value: 'face', label: '人脸' }
      ],
      pictoreTypeList: [
        { value: 'all', label: '全部' },
        { value: 'timeRecord', label: '定时抓图' },
        { value: 'event', label: '事件抓图' },
        { value: 'vehicle', label: '车辆抓图' },
        { value: 'face', label: '人脸抓图' }
      ],
      signName: '',
      checkAllGroup: [],
      // 选择的是中心录像还是前端录像
      sourceList: [{ value: 1, label: '服务器' }, { value: 2, label: '前端设备' }],
      sourceType: 1,
      rangeTime: null
    }
  },
  props: {
    tabVal: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      caseChecked: ({ dutyList }) => dutyList.caseChecked, // 案件处理 选中案件
      caseResChecked: ({ dutyList }) => dutyList.caseResChecked, // 案件处理 选中案件镜头
      authInfo: ({ user }) => {
        return { searching: true }
        // return user.securityMonitorrole.playback.normalPlayback
      },
      authInfo2: ({ user }) => {
        return { searching: false, downLoad: false }
        // return user.securityMonitorrole.playback.picPlayback
      },
      isNVR() {
        try {
          return this.curNode.eid.type === 'nvr'
        } catch (error) {
          return false
        }
      }
    }),
    // isMessageShow() {
    //   let isObj = obj => {
    //     for (const key in obj) {
    //       return true
    //     }
    //     return false
    //   }
    //   return this.$parent.$refs.videoMenu.menuTag === 'business' && isObj(this.caseChecked)
    // },
    selectedType() {
      return this.$lodash.find(this.videoTypeList, item => item.value === this.fileType).label
    },
    checkAll() {
      if (this.checkAllGroup.length === 4) {
        return true
      } else {
        return false
      }
    },
    indeterminate() {
      if (this.checkAllGroup.length < 4 && this.checkAllGroup.length > 0) {
        return true
      } else {
        return false
      }
    },
    typeList() {
      if (this.tabVal === 'playBack') {
        return this.videoTypeList
      } else if (this.tabVal === 'picture') {
        return this.pictoreTypeList
      }
      return []
    },
    eventtype() {
      if (this.fileType === 'event') {
        const arr = []
        this.checkAllGroup.forEach(item => {
          if (item === '移动侦测') {
            arr.push('alarmMoveSense')
          }
          if (item === '视频丢失') {
            arr.push('alarmVideoLost')
          }
          if (item === '视频遮挡') {
            arr.push('videoMask')
          }
          if (item === '报警输入') {
            arr.push('alarmInput')
          }
        })
        return arr
      } else {
        return [this.fileType]
      }
    },
    // 插件组件对象
    plugin() {
      return this.$parent.plugin
    }
  },
  watch: {
    fileType(f) {
      if (f === 'event') {
        this.checkAllGroup = ['移动侦测', '视频丢失', '视频遮挡', '报警输入']
      }
    },
    tab() {
      if (this.tab === 0) {
        // 智能回放备用
      } else {
        this.initCondition()
      }
    },
    // startTime() {
    //   if (this.toDateCheck(this.startTime).getTime() > this.toDateCheck(this.endTime).getTime()) {
    //     this.endTime = this.startTime
    //   }
    // },
    // endTime() {
    //   if (this.toDateCheck(this.startTime).getTime() > this.toDateCheck(this.endTime).getTime()) {
    //     this.startTime = this.endTime
    //   }
    // },
    // timeVal(val) {
    //   if (typeof val === 'object') {
    //     this.timeVal = val
    //   } else {
    //     const t = val.split(':')
    //     const date = new Date()
    //     date.setHours(t[0] || 0)
    //     date.setMinutes(t[1] || 0)
    //     date.setSeconds(t[2] || 0)
    //     this.timeVal = date
    //   }
    //   console.log(this.$moment(this.timeVal).format('hh:mm:ss'), typeof ('56654614515'))
    // },
    sourceType(val) {
      this.$emit('sourceTypeChange', val)
      if (val === 1) {
        this.setNvrList([])
        this.changeNvrTab(false)
        // this.$refs.calender.startDate = null
        // this.$refs.calender.endDate = null
        this.rangeTime = null
      } else {
        this.fileType = 'all'
        this.changeNvrTab(true)
        this.channel = this.curNode.chan
      }
    }
  },
  methods: {
    ...mapActions(['changeNvrTab', 'setNvrList', 'setRowid']),
    // 初始化检索信息
    initCondition() {
      this.timeVal = this.sTime = (() => {
        const date = new Date()
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        return date
      })()
      this.fileType = 'all'
      // this.$refs.calender.nowtime()
      this.channel = ''
      this.eTime = new Date()
      this.setNvrList([])
    },
    toDateCheck(d) {
      if (typeof d === 'string') {
        return this.$moment(d, 'HH:mm:ss').toDate()
      } else {
        return d
      }
    },
    clicktest(time, date) {
      this.dateVal = date
      this.$parent.calendarTime = date
      // this.$refs.calender.dateLimit.maxTime = new Date().getTime()
    },
    daterange(range) {
      this.rangeTime = range
      this.$parent.calendarTime = range.startDate
    },
    handleCheckAll() {
      if (this.checkAll && !this.indeterminate) {
        this.checkAll = false
        this.checkAllGroup = []
      } else if ((!this.checkAll && this.indeterminate) || (!this.checkAll && !this.indeterminate)) {
        this.checkAll = true
        this.indeterminate = false
        this.checkAllGroup = ['移动侦测', '视频丢失', '视频遮挡', '报警输入']
      }
    },
    showMsg(desc) {
      this.$Notice.warning({
        title: '警告',
        desc,
        duration: 3
      })
    },
    // 检索按钮事件
    videoFilter(page) {
      if (!this.$store.getters.plugin.valid) {
        this.$Notice.warning({ title: '警告', desc: '请先下载插件，或当前浏览器不支持插件！' })
        return
      }
      if (this.sourceType === 2) {
        this.nvrVideoFilter(page || -1)
        return
      }
      if (this.fileType === 'recordFlag' && !this.signName) {
        this.showMsg('请输入标记名称')
        return
      }
      if (this.eventtype.length === 0) {
        this.showMsg('请至少选择一个类型')
        return
      }
      if (this.fileType !== 'recordFlag') {
        this.signName = ''
      }
      this.dateVal.setHours(this.timeVal.getHours())
      this.dateVal.setMinutes(this.timeVal.getMinutes())
      this.dateVal.setSeconds(this.timeVal.getSeconds())
      if (this.dateVal.getTime() > new Date().getTime()) {
        this.$Notice.warning({ title: '警告', desc: '精确时间不能超过当前时间！' })
        return
      }
      let newEndTime
      if (this.dateVal.getHours() <= 12) {
        const _date = new Date(this.dateVal)
        _date.setHours(23)
        _date.setMinutes(59)
        _date.setSeconds(59)
        newEndTime = parseInt(_date.getTime() / 1000) + 1
      } else {
        newEndTime = Date.parse(this.dateVal) / 1000 + 12 * 60 * 60
      }
      const param = {
        // devIp: this.ip2int(node.eid.ip),
        // channel: node.chan,
        // devPort: node.eid.cport,
        // streamType: this.fileType,
        // streamType: 'main',
        streamType: 'all',
        eventType: this.eventtype,
        typeName: this.signName,
        typeContent: '',
        startTime: Date.parse(this.dateVal) / 1000 - 12 * 60 * 60,
        endTime: newEndTime,
        rows: 50,
        page: 1,
        time: Date.parse(this.dateVal) / 1000
      }
      this.$emit('on-query', param)
    },
    videoSingleSearch(node, eventtype) {
      const param = {
        devIp: this.ip2int(node.eid.ip),
        channel: node.chan,
        devPort: node.eid.cport,
        streamType: 'all',
        eventType: eventtype,
        typeName: this.signName,
        typeContent: '',
        startTime: Date.parse(this.dateVal) / 1000 - 12 * 60 * 60,
        endTime: Date.parse(this.dateVal) / 1000 + 12 * 60 * 60,
        rows: 50,
        page: 1
      }
      this.$emit('videoFilter', param, node, Date.parse(this.dateVal) / 1000)
      // this.$emit('videoFilter')
    },
    pictureFilter() {
      if (this.fileType === 'vehicle' || this.fileType === 'face') {
        return
      }
      if (!this.curNode) {
        return
      }
      this.startTime.setFullYear(this.dateVal.getFullYear())
      this.startTime.setMonth(this.dateVal.getMonth())
      this.startTime.setDate(this.dateVal.getDate())

      this.endTime.setFullYear(this.dateVal.getFullYear())
      this.endTime.setMonth(this.dateVal.getMonth())
      this.endTime.setDate(this.dateVal.getDate())

      this.pictureSingleSearch(this.curNode, this.eventtype)
    },
    pictureSingleSearch(node, eventtype) {
      // const param = {
      //     id: '',
      //     streamType: 'pic',
      //     eventType: eventtype,
      //     typeName: '',
      //     typeContent: '',
      //     startTime: Date.parse(this.startTime) / 1000 + '',
      //     endTime: Date.parse(this.endTime) / 1000 + '',
      //     rows: '100',
      //     page: '0'
      // }
      // this.$emit('pictureFilter', param, node)
      this.$emit('pictureFilter')
    },
    download() {
      this.$emit('download')
    },
    // IP转成整型
    ip2int(ip) {
      var num = 0
      ip = ip.split('.')
      num = Number(ip[0]) * 256 * 256 * 256 + Number(ip[1]) * 256 * 256 + Number(ip[2]) * 256 + Number(ip[3])
      num = num >>> 0
      return num
    },
    timeChange(val) {
      console.log(val, '555555555555')
      if (typeof val === 'object') {
        this.timeVal = val
      } else {
        const t = val.split(':')
        const date = new Date()
        date.setHours(t[0] || 0)
        date.setMinutes(t[1] || 0)
        date.setSeconds(t[2] || 0)
        this.timeVal = date
      }
    },
    startTimeChange(val) {
      if (this.toDateCheck(val).getTime() > this.toDateCheck(this.endTime).getTime()) {
        this.endTime = this.toDateCheck(val)
      }
      this.startTime = this.toDateCheck(val)
    },
    endTimeChange(val) {
      if (this.toDateCheck(this.startTime).getTime() > this.toDateCheck(val).getTime()) {
        this.startTime = this.toDateCheck(val)
      }
      this.endTime = this.toDateCheck(val)
    }
  },
  created() {
    this.showName = window.location.href.split('/')[window.location.href.split('/').length - 1]
  },
  mounted() {
    // this.$refs.calender.dateLimit.maxTime = new Date().getTime()
  },
  beforeDestroy() {}
}
</script>

<style scoped>
#retrieval {
  width: 100%;
  height: calc(100%);
  background: #1b3153;
}
#retrieval > .title {
  width: 100%;
  height: 36px;
  background: #0f2343;
  /* border: 1px solid #444; */
  line-height: 36px;
  color: #fffafa;
  font-size: 14px;
  margin-bottom: 20px;
  padding: 0 20px;
}

.condition {
  height: 26px;
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
  max-height: 360px;
  overflow-y: auto;
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
/* #photoTable {
  height: 80px;
} */
/* 表单 */
#tableVideo {
  overflow-x: auto;
  width: 94%;
  margin-left: 3%;
  margin-top: 20px;
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
@media (max-width: 1800px) {
  .searchbtn {
    margin-top: 10px;
  }
  .filterList table td {
    padding: 4px 0;
  }
  .filterList .tbody tbody td {
    line-height: 1;
  }
  #tableVideo {
    margin-top: 10px;
  }
}
</style>
<style lang="less">
#retrieval {
  .ivu-select-small.ivu-select-single .ivu-select-selection {
    box-sizing: content-box;
  }
  .ivu-select-small.ivu-select-single .ivu-select-selection .ivu-select-placeholder,
  .ivu-select-small.ivu-select-single .ivu-select-selection .ivu-select-selected-value {
    line-height: 26px;
  }
}

#retrieval {
  .ivu-tabs {
    height: 100%;
  }
}
#retrieval .ivu-input-wrapper-small .ivu-input-icon {
    height: 26px;
    width: 32px;
    line-height: 26px;
}
#retrieval {
  .case-message {
    width: 100%;
    // height: 200px;
    margin-top: 16px;
    .head {
      height: 35px;
      line-height: 35px;
      font-size: 16px;
      background-color: #0F2343;
    }
    .content {
      height: 310px;
      .demo-carousel {
        height: 310px;
        width: 100%;
        img {
          width: 100%;
        }
        .carose-one {
          margin-left: 8px;
          p {
            font-size: 16px;
            margin-top: 12px;
          }
        }
      }
    }
  }
}

</style>
