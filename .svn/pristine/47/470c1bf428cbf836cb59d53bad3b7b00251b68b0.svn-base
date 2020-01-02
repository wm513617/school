<template>
  <div id="playDownload" class="bs-content" v-resize="resizeFn">
    <Spin fix v-if='isSpin' style='color:#fff;font-size: 16px;z-index: 10000000;background: rgba(0,0,0,0.3)'>
        <Icon type="load-c" size=24 class="demo-spin-icon-load"></Icon>
        <div>Loading</div>
    </Spin>
    <div class="left ">
      <div class="leftTop">
        <div class="input" style="width:100%;padding:10px;">
          <Input v-model="searchVal" icon="ios-search-strong" placeholder="请输入..." />
        </div>
        <div style="height:calc(100% - 52px)">
          <!-- <Organization :options="options" ref="org" :searchVal="searchVal" :synchro="true"></Organization> -->
          <Organization @spinChange="(val) => isSpin = val" :options="options" ref="org" :searchVal="searchVal" :synchro="true" :iconToggle="false"></Organization>
        </div>
      </div>
      <div class="leftBottom">

        <Checkbox-group v-model="dlType" class="radioGroup">
          <Checkbox label="图片" v-model="picSelect"></Checkbox>
          <Checkbox label="录像" v-model="recSelect"></Checkbox>
        </Checkbox-group>

        <div class="condition">
          <span>文件类型</span>
          <Select v-model="fileType" style="width:170px;" size="small" placement="top" ref="fileType">
            <Option v-for="item in typeList" :value="item.value" :key="item.label" v-show="item.display">{{ item.label }}</Option>
          </Select>
        </div>

        <div class="condition">
          <span>文件来源</span>
          <Select v-model="sourceType" style="width:170px;" size="small" placement="top" ref="sourceType">
            <Option v-for="item in sourceList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>

        <div class="condition">
          <span>开始时间</span>
          <!-- <el-date-picker v-model="startDate" type="datetime" popper-class="dtp" placeholder="选择日期和时间" size="mini" style="width: 170px"></el-date-picker> -->
          <BSdateRange  @timeChange="startTimeChange" :upside='true' :datetime="startDate" :width='170' :height='26'></BSdateRange>
          <!-- <Date-picker type="datetime" v-model="startDate" placeholder="选择日期和时间" placement="top" style="width: 170px" size="small" :clearable='clearable' :options="deteOptions"></Date-picker> -->
        </div>

        <div class="condition">
          <span>结束时间</span>
          <!-- <el-date-picker v-model="endDate" type="datetime" popper-class="dtp" placeholder="选择日期和时间" size="mini" style="width: 170px"></el-date-picker> -->
          <BSdateRange  @timeChange="endTimeChange" :upside='true' :datetime="endDate" :width='170' :height='26'></BSdateRange>
          <!-- <Date-picker type="datetime" v-model="endDate" placeholder="选择日期和时间" placement="top" style="width: 170px" size="small" :clearable='clearable' :options="deteOptions"></Date-picker> -->
        </div>

        <!-- <Button type="primary" :disabled="!authInfo.searching" @click="filter" class="filter theme-btn">查找</Button> -->
        <Button type="primary" @click="filter" class="filter theme-btn" :loading="searchLoading">查找</Button>

      </div>
    </div>

    <div class="right" ref="rightBox">
      <div class="table filterList">
        <!-- <Table :columns="fliColumns" :data="filterList" size="small" @on-selection-change="selectChange" height="352"></Table> -->
        <table cellpadding="0" cellspacing="0">
          <thead>
            <tr>
              <td style="width: 10%;">
                <Checkbox v-model="filterListAll" @on-change="selectChange('all')"></Checkbox>
              </td>
              <td style="width: 10%;">序号</td>
              <td style="width: 25%;">通道名称</td>
              <td style="width: 10%;">文件类型</td>
              <td style="width: 15%;">开始时间</td>
              <td style="width: 15%;">结束时间</td>
              <td style="width: 15%;">文件大小</td>
            </tr>
          </thead>
        </table>
        <bs-scroll class="tbody" :height="tbody + 'px'">
          <div v-if="filterList.length === 0" :style="{'line-height':tbody-2 +'px'}">暂无数据</div>
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr v-for="(item,index) in pageFilterList" :key="index">
                <td style="width: 10%;">
                  <Checkbox v-model="item.isChecked" @on-change="selectChange"></Checkbox>
                </td>
                <td style="width: 10%;">{{index+1}}</td>
                <td style="width: 25%;">{{item.name}}</td>
                <td style="width: 10%;">{{item.type | evtType}}</td>
                <td style="width: 15%;">{{item.startTime}}</td>
                <td style="width: 15%;">{{item.endTime}}</td>
                <td style="width: 15%;">{{item.size}}</td>
              </tr>
            </tbody>
          </table>
        </bs-scroll>

        <div style="background-color: #244575; width: 100%; padding: 3px 10px;">
          <Page :total="filterList.length" :current.sync="page" :page-size="pageSize" style="text-align: right;" show-sizer show-total :page-size-opts="this.$PageInfo.size" @on-page-size-change="pageChenge" ref="page"></Page>
        </div>

      </div>

      <div style="height:12px;background:#0c1b32;"></div>
      <header>
        <Button type="primary" @click="download" class="downloadBtn theme-btn" :disabled="!authInfo.downLoad ||selectList.length===0">下载</Button>
        <Button type="primary" @click="cancel()" class="downloadBtn theme-btn" :disabled="!authInfo.downLoad ||!activeItem||activeItem.state!=='下载中'">取消</Button>
        <Button type="primary" @click="cancelAll" class="downloadBtn theme-btn" :disabled="!authInfo.downLoad ||downloadData.length===0">全部取消</Button>
        <Button type="primary" @click="remove" class="downloadBtn theme-btn" :disabled="!authInfo.downLoad ||downloadList.length===0">清除</Button>
        <Checkbox v-model="display">仅显示下载中的任务</Checkbox>
      </header>
      <div class="table filterList">

        <!-- <Table :columns="dlColumns" :data="display?downloadData:downloadList" size="small" height="352"></Table> -->
        <table cellpadding="0" cellspacing="0">
          <thead>
            <tr>
              <td style="width: 5%;">序号</td>
              <td style="width: 19%;">通道名称</td>
              <td style="width: 10%;">文件类型</td>
              <td style="width: 15%;">开始时间</td>
              <td style="width: 15%;">结束时间</td>
              <td style="width: 12%;">文件大小</td>
              <td style="width: 12%;">下载状态</td>
              <td style="width: 12%;">下载进度</td>
            </tr>
          </thead>
        </table>
        <bs-scroll class="tbody" :height="tbody + 'px'">
          <div v-if="downloadList.length === 0" :style="{'line-height':tbody-2 +'px'}">暂无数据</div>
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr v-for="(item,index) in (display?downloadData:downloadList)" :key="index" @click="activeItem=item" @dblclick="reDownload(item)" :style="{background:activeItem.__id!==item.__id?'#1b3153':'#2b426b'}">
                <td style="width: 5%;">{{index+1}}</td>
                <td style="width: 19%;">{{item.name}}</td>
                <td style="width: 10%;">{{item.type||'其他'}}</td>
                <td style="width: 15%;">{{item.startTime}}</td>
                <td style="width: 15%;">{{item.endTime}}</td>
                <td style="width: 12%;">{{item.size}}</td>
                <td style="width: 12%;">{{item.state}}</td>
                <td style="width: 12%;">{{item.pre}}</td>
              </tr>
            </tbody>
          </table>
        </bs-scroll>

      </div>
    </div>
  </div>
</template>

<script>
import Organization from 'components/videoMenu/Organization.vue'
import { AV_NVRRECORD_OPEN, GB_AV_NVRRECORD_LIST, getDownID, GB_AV_NVRRECORD_OPEN } from '../../../../http/video.api.js'
import hook from '../playrecord/requestHook'
import EVENT_TYPE from '../eventType.static'
// import playbackData from '../playbackData'
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
export default {
  name: 'playDownload',
  components: {
    Organization
  },
  mixins: [hook],
  data() {
    return {
      isSpin: false, // 懒加载机构树遮罩
      searchLoading: false,
      tbody: 0,
      page: 1,
      pageSize: this.$PageInfo.limit,
      filterListAll: false,
      searchVal: '',
      options: {
        showSearch: false,
        showInput: true,
        // showFolder: false,
        showOpenPreview: false,
        showOpenAllPreview: false,
        showCollection: false,
        search: {
          onlyLeaf: true
        }
      },
      startDate: (() => {
        const date = new Date()
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        return date
      })(),
      endDate: new Date(),
      fileType: 'all',
      clearable: false,
      dlType: [],
      display: false,
      picSelect: false,
      recSelect: false,
      selectList: [],
      sourceType: 1,
      sourceList: [{ value: 1, label: '服务器' }, { value: 2, label: '前端设备' }],
      fliColumns: [
        { type: 'selection', width: 60 },
        { type: 'index', title: '序号', width: 60 },
        { title: '通道名称', key: 'name' },
        { title: '开始时间', width: '25%', key: 'startTime' },
        { title: '结束时间', width: '25%', key: 'endTime' },
        { title: '文件大小', width: '20%', key: 'size' }
      ],
      dlColumns: [
        { type: 'index', title: '序号', width: 60 },
        { title: '通道名称', width: '15%', key: 'name' },
        { title: '文件类型', key: 'type' },
        { title: '开始时间', width: '15%', key: 'startTime' },
        { title: '结束时间', width: '15%', key: 'endTime' },
        { title: '文件大小', key: 'size' },
        { title: '下载状态', width: '15%', key: 'state' },
        { title: '下载进度', width: '15%', key: 'pre' }
      ],
      filterList: [],
      timed: '',
      isTimed: false,
      path: '',
      activeItem: '',
      deteOptions: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now() + 600000
        }
      }
    }
  },
  computed: {
    ...mapGetters(['plugins', 'mapFilterList']),
    ...mapState({
      downloadList: ({ playback }) => playback.downloadList,
      parameters: ({ platform }) => platform.parameters
      // authInfo: ({ user }) => true || user.securityMonitorrole.playback.DownLoad
    }),
    authInfo() {
      return { downLoad: true }
    },
    downloadData() {
      return this.downloadList.filter(item => item.state === '下载中')
    },
    streamType() {
      const arr = []
      this.dlType.forEach(item => {
        if (item === '图片') {
          arr.push('pic')
        }
        if (item === '录像') {
          arr.push('all')
        }
      })
      return arr
    },
    typeList() {
      return [
        { value: 'all', display: this.picSelect || this.recSelect, label: '全部类型' },
        { value: 'timeRecord', display: this.picSelect, label: '定时抓图' },
        { value: 'event', display: this.picSelect, label: '事件抓图' },
        { value: 'vehicle', display: this.picSelect, label: '车辆抓图' },
        { value: 'face', display: this.picSelect, label: '人脸抓图' },
        { value: 'timeRecord', display: this.recSelect, label: '定时录像' },
        { value: 'event', display: this.recSelect, label: '事件录像' },
        // { value: 'vehicle', display: this.recSelect && this.sourceType === 1, label: '车辆录像' },
        // { value: 'face', display: this.recSelect && this.sourceType === 1, label: '人脸录像' },
        { value: 'manualRecord', display: this.recSelect && this.sourceType === 1, label: '手工录像' },
        { value: 'recordFlag', display: this.recSelect, label: '标记' }
      ]
    },
    pageFilterList() {
      const start = (this.page - 1) * this.pageSize
      const end = this.page * this.pageSize
      console.log(this.filterList.slice(start, end))
      return this.filterList.slice(start, end)
    }
  },
  filters: {
    evtType(v) {
      return EVENT_TYPE[v] || '其他'
    }
  },
  watch: {
    picSelect() {
      this.fileType = 'all'
    },
    recSelect() {
      this.fileType = 'all'
    },
    mapFilterList(m) {
      const diff = this.$lodash.differenceWith(m, this.filterList, (it1, it2) => {
        // return it1.id !== it2.id
        return it1.name === it2.name
      })
      this.filterList = this.filterList.concat(
        diff.map(item => {
          return {
            ...item,
            isChecked: false
          }
        })
      )
      this.filterListAll = false
      this.selectChange()
    }
  },
  methods: {
    ...mapActions([
      'recordDump',
      'backupDownloadList',
      'queryNVRRecordList',
      'queryRecordlist',
      'getPlatformID',
      'gbQueryRecordList',
      'gbRecordOpen',
      'setResource',
      'recordLog',
      'getCameraPower',
      'getVideoConf'
    ]),
    ...mapMutations([
      'ADD_DOWNLOADLIST',
      'UPDATE_PRE',
      'SET_RESOURCE',
      'CLEAR_RESOURCE',
      'CLOSE_DOWNLOAD',
      'REMOVE_DOWNLOAD',
      'RE_DOWNLOAD'
    ]),
    resizeFn() {
      this.tbody = (this.$refs.rightBox.offsetHeight - 32 - 40 - 20 - 50 - 32) / 2
    },
    startTimeChange(val) {
      this.startDate = val.dateTimes
      if (this.startDate.getTime() > this.endDate.getTime()) {
        this.endDate = this.startDate
      }
    },
    endTimeChange(val) {
      this.endDate = val.dateTimes
      if (this.startDate.getTime() > this.endDate.getTime()) {
        this.startDate = this.endDate
      }
    },
    pageChenge(n) {
      this.pageSize = n
    },
    async filter() {
      if (this.searchLoading) {
        return
      }
      this.CLEAR_RESOURCE()
      this.clearPageRequest()
      this.filterList = []
      this.page = 1
      if (this.streamType.length === 0) {
        this.$Notice.warning({ desc: '请至少勾选一种检索类型！', title: '警告' })
        return
      }
      var item = this.$refs.org.getSelectedNodes()
      item = item.filter(node => {
        return !node.children && 'eid' in node
      })
      if (!item || item.length <= 0) {
        this.$Notice.warning({ desc: '请选择一个摄像头！', title: '警告' })
        return
      }
      this.searchLoading = true
      let count = 0
      const allp = []
      const resultCount = {}
      item.forEach((value, i) => {
        this.streamType.forEach(item => {
          allp.push(
            this.singleSearch(value, item, count).then(res => {
              const result = resultCount[value._id]
              if (res === 'ok') {
                if (result !== 'fail') {
                  resultCount[value._id] = res
                }
              } else if (res === 'nodata') {
                if (!result) {
                  resultCount[value._id] = res
                }
              } else if (res === 'fail' || res === 'noPower') {
                resultCount[value._id] = res
              }
            })
          )
          count++
        })
      })
      await Promise.all(allp)
      this.searchLoading = false
      const msg = []
      const resultList = Object.values(resultCount)
      const fail = resultList.filter(item => item === 'fail').length
      const noPower = resultList.filter(item => item === 'noPower').length
      const nodata = resultList.filter(item => item === 'nodata').length
      if (fail !== 0) {
        msg.push(`${fail}个通道查询失败`)
      }
      if (noPower !== 0) {
        msg.push(`${noPower}个通道没有权限`)
      }
      if (nodata !== 0) {
        msg.push(`${nodata}个通道查询无数据`)
      }
      if (msg.length) {
        this.$Notice.warning({ title: '提示', desc: msg.join(',') })
      }
    },
    extraTypeControl(fileType) {
      if (fileType === 'event') {
        return ['alarmMoveSense', 'alarmVideoLost', 'videoMask', 'alarmInput']
      }
      return [fileType]
    },
    async singleSearch(node, streamType, index) {
      this.power = await this.getCameraPower(node._id)
      if (!this.power || !this.power.includes('download')) {
        return 'noPower'
      }
      if (this.sourceType === 2) {
        return this.singleSearchNVR(node, streamType, index)
      }

      if (node.nodeId) {
        return this.singleSearchGb(node, streamType, index)
      }
      const param = {
        devIp: node.eid.ip,
        channel: node.chan,
        devPort: node.eid.cport,
        streamType: streamType,
        eventType: this.extraTypeControl(this.fileType),
        typeName: '',
        typeContent: '',
        startTime: Date.parse(this.startDate) / 1000,
        endTime: Date.parse(this.endDate) / 1000,
        rows: 100,
        page: 1
      }
      // return new Promise(resolve => {
      //   this.pageRequest(param, index).then((res) => {
      //     res = JSON.parse(JSON.stringify(res))
      //     if (res.data === 'have no data') {
      //       resolve('nodata')
      //       return
      //     } else if (!res.data.result) {
      //       resolve('fail')
      //       return
      //     } else if (!res.data.result.eventList[0]) {
      //       resolve('nodata')
      //       return
      //     }
      //     const item = res.data.result
      //     item.nodeName = node.name
      //     this.SET_RESOURCE({
      //       index,
      //       item
      //     })
      //     resolve('ok')
      //   }).catch(err => {
      //     // this.$Notice.error({title: '提示', desc: '查询失败！'})
      //     resolve('fail')
      //     console.log(err)
      //   })
      // })
      return new Promise(resolve => {
        this.IPCPageQuery(param)
          .then(res => {
            res = JSON.parse(JSON.stringify(res))
            if (res === 'nodate') {
              resolve('nodata')
            }
            if (!res.data.result.eventList[0]) {
              resolve('nodata')
            }
            if (res === 'fail') {
              resolve('fail')
            }
            const item = res.data.result
            item.nodeName = node.name
            item.node = node
            this.SET_RESOURCE({
              index,
              item
            })
            resolve('ok')
          })
          .catch(err => {
            // this.$Notice.error({title: '提示', desc: '查询失败！'})
            resolve('fail')
            console.log(err)
          })
      })
    },
    singleSearchNVR(node, streamType, index) {
      // if (node.eid.type !== 'nvr') { // 暂时注释  2019/4/9 做前端国标下载与北京调试 注释此判断 国标设备没有type字段
      //   return Promise.resolve('fail')
      // }
      console.log(node, streamType, index, 'lasjdlas  这是下载啊 前端')
      let param = {}
      if (node.nodeId) {
        // 前端国标下载
        param = node
      } else {
        param = {
          recordType: this.fileType,
          rowId: 1,
          rowCount: 50,
          sTime: Date.parse(this.startDate) / 1000,
          eTime: Date.parse(this.endDate) / 1000,
          streamType: streamType,
          channel: node.chan,
          devIp: node.eid.ip,
          devPort: node.eid.cport
        }
      }
      return new Promise(resolve => {
        this.NVRPageQuery(param)
          .then(r => {
            if (r === 'nodate') {
              resolve('nodata')
            }
            if (r === 'fail') {
              resolve('fail')
            }
            this.SET_RESOURCE({
              index,
              item: {
                ...r,
                nodeName: node.name,
                node
              }
            })
            resolve('ok')
          })
          .catch(e => {
            resolve('fail')
          })
        // this.queryNVRRecordList(param).then(suc => {
        //   const result = suc.data
        //   if (!result.total) {
        //     resolve('nodata')
        //   } else {
        //     this.SET_RESOURCE({
        //       index,
        //       item: {
        //         ...result,
        //         nodeName: node.name,
        //         node
        //       }
        //     })
        //     resolve('ok')
        //   }
        // }).catch(e => {
        //   resolve('fail')
        // })
      })
    },
    async NVRPageQuery(param, res) {
      try {
        let suc
        if (param.nodeId) {
          // 前端国标下载
          let gbMessage = await getDownID(param.shareServer)
          // param.gbObj = gbMessage
          if (!gbMessage.data.serverId) {
            return this.$Notice.warning({ desc: `获取国标信息失败`, title: '警告' })
          }
          let gbObj = {
            gbDevIp: gbMessage.data.ip,
            gbDevPort: Number(gbMessage.data.port),
            platformID: gbMessage.data.serverId,
            gbDevId: param.nodeId,
            startTime: Date.parse(this.startDate) / 1000,
            endTime: Date.parse(this.endDate) / 1000
          }
          if (param.chan) {
            gbObj.channel = Number(param.chan)
          }
          suc = await GB_AV_NVRRECORD_LIST(gbObj).catch(() => 'fail')
          suc.data.recordList.forEach(res => {
            res.gbObj = gbObj
          })
        } else {
          suc = await this.queryNVRRecordList(param).catch(() => 'fail')
        }
        console.log(suc, 'suc guobaioaaa ')
        // const suc = await this.queryNVRRecordList(param).catch(() => 'fail')
        if (suc) {
          const result = suc.data
          if (!result.total) {
            return 'nodate'
          } else {
            if (res) {
              if (result.recordInfo) {
                res.recordInfo = [...res.recordInfo, ...result.recordInfo]
                res.rowCount = result.rowCount
                res.rowId = result.rowId
                res.total = result.total
              }
            } else {
              res = result
            }
            // if (result.rowCount && (result.total > result.rowCount + (result.rowId - 1) * 50)) {
            if (result.rowCount && result.rowCount >= 50) {
              return this.NVRPageQuery({ ...param, rowId: param.rowId + 1 }, res)
            } else {
              return res
            }
          }
        } else {
          return 'fail'
        }
      } catch (e) {
        return 'fail'
      }
    },
    async IPCPageQuery(param, res) {
      try {
        const suc = await this.queryRecordlist(param).catch(() => 'fail')
        if (suc) {
          const result = suc
          if (result.data === 'have no data' || result.data === 'no data') {
            return 'nodata'
          } else if (!result.data.result) {
            return 'fail'
          }
          // else if (!result.data.result.eventList[0]) {
          //   return 'nodata'
          // }
          if (result.data.result.eventList) {
            if (res) {
              res.data.result.eventList = [...res.data.result.eventList, ...result.data.result.eventList]
              res.data.result.page = result.data.result.page
              res.data.result.rows = result.data.result.rows
              res.data.result.total = result.data.result.total
            } else {
              res = result
            }
            if (res.data.result.total > 0 && result.data.result.eventList.length >= 100) {
              return this.IPCPageQuery({ ...param, page: param.page + 1 }, res)
            } else {
              return res
            }
          }
        } else {
          return 'fail'
        }
      } catch (e) {
        return 'fail'
      }
    },
    /**
     * 国标设备检索
     * node 检索的设备节点
     * streamType 码流类型
     * index 索引
     */
    async singleSearchGb(node, streamType, index) {
      const serverId = await this.getPlatformID(node.shareServer)
      let param = {
        recordType: this.fileType,
        gbPlaDevIp: serverId.ip, // 设备ip,
        gbPlaDevPort: serverId.port, // 设备端口,
        parentId: serverId.serverId, // 国标平台id,
        childId: node.nodeId, // 国标设备id,
        startTime: Date.parse(this.startDate) / 1000,
        endTime: Date.parse(this.endDate) / 1000,
        streamType: 'main',
        channel: node.chan
      }
      return new Promise(resolve => {
        this.gbQueryRecordList(param)
          .then(res => {
            if (res.data.result === 'error') {
              resolve('fail')
            }
            if (res.data.total === 0 || res.data.recordList.length === 0) {
              resolve('nodata')
            }
            this.setResource({
              index,
              item: {
                recordList: [...res.data.recordList],
                nodeName: node.name,
                node,
                param
              }
            })
            resolve('ok')
          })
          .catch(e => {
            resolve('fail')
          })
      })
    },
    download() {
      if (!this.$store.getters.plugin.valid) {
        this.$Notice.warning({ title: '警告', desc: '请先下载插件，或当前浏览器不支持插件！' })
        return
      }
      // const state = JSON.parse(this.plugins.GetFileDirectory('请选择文件'))
      // if (state.success) {
      //   this.path = state.DirName
      // } else {
      //   // this.$Notice.error({ title: '失败', desc: '获取保存位置出错！' })
      //   return
      // }
      this.getVideoConf() // 同步localStorage数据到本地配置
      let strFileDir = this.parameters.downloadVideoPath + '\\download.txt'
      let creatDir = this.plugins.SaveFileInfo(strFileDir, this.selectList[0].name)
      if (creatDir) {
        this.$Notice.warning({ desc: '创建目录文件失败', title: '警告' })
        return
      }
      this.path = this.parameters.downloadVideoPath
      this.$Notice.warning({ title: '提示', desc: `录像开始下载,下载路径为${this.path}` })
      const time = new Date().getTime()

      this.selectList.forEach((item, index) => {
        this.downloadDev(item, time + index)
      })
    },
    selectChange(list) {
      if (list === 'all') {
        this.filterList.forEach(item => {
          item.isChecked = this.filterListAll
        })
      }
      this.selectList = this.filterList.filter(node => {
        return node.isChecked
      })
    },
    async downloadDev(record, time) {
      let deviceIp = record.node.eid ? record.node.eid.ip : ''
      const format = this.parameters.downloadVideoType === 'BSR' ? '.bsr' : '.avi'
      let type = record.type
      const fileName = this.path + '\\' + record.name + '_' + time + format
      let param, openParam
      if (this.sourceType === 2) {
        // 前端录像
        if (record.node.nodeId) {
          // 前端录像 国标下载
          openParam = {
            gbDevIp: record.event.gbObj.gbDevIp,
            gbDevPort: record.event.gbObj.gbDevPort,
            gbPlatformID: record.event.gbObj.platformID,
            gbDeviceID: record.event.gbObj.gbDevId,
            startTime: record.event.startTime,
            endTime: record.event.endTime,
            streamType: 'main',
            downLoad: 'FrontDownload' // 回放固定字段
          }
          const res = await GB_AV_NVRRECORD_OPEN(openParam).catch(() => this.errorMsg('请求错误！'))
          if (!res) {
            return
          }
          param = {
            ip: res.data.TsIp,
            port: res.data.TsPort + '',
            fileName,
            beginTime: record.event.startTime + '',
            endTime: record.event.endTime + '',
            cmdStr: JSON.stringify({
              streamType: record.event.streamType,
              vendor: record.node.eid.manufacturer,
              session: '',
              ip: record.event.gbObj.gbDevIp,
              channel: record.event.channel,
              port: record.event.gbObj.gbDevPort + '',
              streamId: res.data.streamId
            })
          }
        } else {
          const eventType = record.type
          // 北京同事说目前就定时录像一种类型
          if (eventType === 'timeVideo') {
            type = 800
          } else {
            type = 512
          }
          const info = record.event
          openParam = {
            devIp: info.devIp,
            devPort: info.devPort,
            channel: info.channel,
            sTime: info.sTime,
            eTime: info.eTime,
            streamType: info.streamType,
            streamConnPort: record.node.eid.dport
          }
          deviceIp = info.devIp
          const res = await AV_NVRRECORD_OPEN(openParam).catch(() => this.errorMsg('请求错误！'))
          if (!res) {
            return
          }
          param = {
            ip: res.data.TsIp,
            port: res.data.TsPort + '',
            fileName,
            beginTime: info.sTime + '',
            endTime: info.eTime + '',
            cmdStr: JSON.stringify({
              streamType: info.streamType,
              vendor: record.node.eid.manufacturer,
              session: '',
              ip: info.devIp,
              channel: info.channel,
              port: info.devPort + '',
              streamId: res.data.streamId
            })
          }
        }
      } else {
        if (record.node && record.node.nodeId) {
          // 国标录像
          const info = record.event
          const { gbPlaDevIp, gbPlaDevPort, parentId, childId } = record.param
          openParam = {
            gbPlaDevIp,
            gbPlaDevPort,
            channel: info.channel,
            parentId,
            childId,
            startTime: info.startTime,
            endTime: info.endTime,
            streamType: info.streamType,
            downLoad: 'Download'
          }
          deviceIp = gbPlaDevIp
          const res = await this.gbRecordOpen(openParam).catch(() => this.errorMsg('请求错误！'))

          if (!res) {
            return
          }
          param = {
            ip: res.data.TsIp,
            port: res.data.TsPort + '',
            fileName,
            beginTime: info.startTime + '',
            endTime: info.endTime + '',
            cmdStr: JSON.stringify({
              streamId: res.data.streamId
            })
          }
        } else {
          // 中心录像
          const obj = {}
          obj.eventList = {}
          obj.eventList.timeInfo = {}
          obj.eventList.strmInfo = {}
          obj.eventList.timeInfo.startTime = record.event.evtTblInfo.startTime
          obj.eventList.timeInfo.endTime = record.event.evtTblInfo.endTime
          obj.eventList.strmInfo = record.event.strmInfo
          param = {
            ip: record.ip + '',
            port: 9000 + '',
            beginTime: record.event.evtTblInfo.startTime + '',
            endTime: record.event.evtTblInfo.endTime + '',
            fileName,
            cmdStr: JSON.stringify({
              params: {
                jsonrpc: '2.0',
                id: '1',
                method: 'brest',
                call: 'AV.Record.playopen',
                args: obj
              }
            })
          }
        }
      }
      this.recordDump(param).then(dump => {
        const item = {
          openParam: this.sourceType === 2 ? openParam : null, // 前端录像请求参数
          gbParam: record.node && record.node.nodeId ? openParam : null, // 下联设备录像请求参数
          param: param,
          name: record.name,
          startTime: record.startTime,
          endTime: record.endTime,
          size: record.size,
          type: EVENT_TYPE[type],
          pre: '--',
          dumpHandle: dump.DumpHandle,
          state: '',
          path: this.path
        }
        if (dump.success) {
          item.state = '下载中'
        } else {
          item.state = '下载失败'
        }
        this.setLog({ name: item.name, startTime: record.startTime, endTime: record.endTime, ip: deviceIp })
        this.ADD_DOWNLOADLIST(item)
        this.backupDownloadList()
      })
    },
    byteConversion(b) {
      const GB = 1024 * 1024 * 1024
      const MB = 1024 * 1024
      const KB = 1024
      if (b / GB >= 1) {
        return (b / GB).toFixed(2) + ' Gb'
      } else if (b / MB >= 1) {
        return (b / MB).toFixed(2) + ' Mb'
      } else if (b / KB >= 1) {
        return (b / KB).toFixed(2) + ' Kb'
      } else {
        return b + ' b'
      }
    },
    changeTime(t) {
      function addZero(n) {
        return n.toString().length < 2 ? '0' + n : '' + n
      }
      const date = t < new Date().getTime() ? new Date(t) : new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hours = date.getHours()
      const minutes = date.getMinutes()
      const secondes = date.getSeconds()
      return `${addZero(year)}-${addZero(month)}-${addZero(day)} ${addZero(hours)}:${addZero(minutes)}:${addZero(
        secondes
      )}`
    },
    getPre(item) {
      const handler = parseInt(item.dumpHandle)
      const timeInfo = JSON.parse(this.plugins.GetRecordDumpTime(handler))
      if (timeInfo.success) {
        const curInfo = JSON.parse(this.plugins.GetRecordDumpCurTime(handler))
        if (curInfo.success) {
          const alltime = timeInfo.msEnd - timeInfo.msBegin
          const cur = curInfo.msCur
          let dev = 0
          if (alltime > 600000) {
            dev = 60000
          } else if (alltime > 3600000) {
            dev = 300000
          }
          let res = (((cur - timeInfo.msBegin) / (alltime - dev)) * 100).toFixed(2)
          if (res >= 100) {
            res = 100.0
          } else if (res <= 0) {
            res = 0.0
          }
          return res + '%'
        }
      }
    },
    remove() {
      this.activeItem = ''
      this.REMOVE_DOWNLOAD()
    },
    cancel(item = this.activeItem) {
      if (!item) {
        return
      }
      if (item.state !== '下载中') {
        return
      }
      const handler = parseInt(item.dumpHandle)
      const res = JSON.parse(this.plugins.CloseRecordDump(handler))
      if (!res) {
        this.CLOSE_DOWNLOAD(item.dumpHandle)
      }
    },
    cancelAll() {
      this.downloadData.forEach(item => {
        this.cancel(item)
      })
    },
    async reDownload(item) {
      if (item.state !== '已取消') {
        return
      }
      if (item.openParam) {
        const res = await AV_NVRRECORD_OPEN(item.openParam).catch(() => this.errorMsg('请求错误！'))
        if (!res) {
          return
        }
        item = JSON.parse(JSON.stringify(item))
        item.param.ip = res.data.TsIp
        item.param.port = res.data.TsPort + ''
        let cmdStr = JSON.parse(item.param.cmdStr)
        cmdStr.streamId = res.data.streamId
        item.param.cmdStr = JSON.stringify(cmdStr)
      } else if (item.gbParam) {
        const res = await this.gbRecordOpen(item.gbParam).catch(() => this.errorMsg('请求错误！'))
        if (!res) {
          return
        }
        item = JSON.parse(JSON.stringify(item))
        item.param.ip = res.data.TsIp
        item.param.port = res.data.TsPort + ''
        let cmdStr = JSON.parse(item.param.cmdStr)
        cmdStr.streamId = res.data.streamId
        item.param.cmdStr = JSON.stringify(cmdStr)
      }
      let obj = {}
      this.recordDump(item.param).then(dump => {
        obj.dumpHandle = dump.DumpHandle
        if (dump.success) {
          obj.state = '下载中'
        } else {
          obj.state = '下载失败'
        }
        obj.__id = item.__id
        obj.param = item.param
        this.RE_DOWNLOAD(obj)
        this.backupDownloadList()
      })
    },
    setLog({ ip, name, startTime, endTime }) {
      const param = {
        logType: '操作日志',
        module: '录像回放',
        operateName: '录像下载',
        operateContent: `开始时间:${startTime},结束时间:${endTime}`,
        target: name,
        deviceIp: ip
      }
      this.recordLog(param)
    }
  },
  created() {
    this.CLEAR_RESOURCE()
  },
  mounted() {
    this.timed = setInterval(() => {
      this.downloadData.forEach(item => {
        this.UPDATE_PRE({
          id: item.__id,
          pre: this.getPre(item) || item.pre
        })
      })
      // this.$forceUpdate()
    }, 1000)
    // this.resize = () => {
    //   this.tbody = (this.$refs.rightBox.offsetHeight - 32 - 40 - 20 - 50 - 32) / 2
    // }
    this.md = e => {
      if (this.$refs) {
        this.$refs.sourceType.visible = false
        this.$refs.fileType.visible = false
      }
    }
    this.resizeFn()
    // window.addEventListener('resize', this.resize)
    window.addEventListener('mousedown', this.md)
  },
  beforeDestroy() {
    clearInterval(this.timed)
    // window.removeEventListener('resize', this.resize)
    window.removeEventListener('mousedown', this.md)
    this.resize = null
    this.CLEAR_RESOURCE()
  }
}
</script>

<style scoped>
#playDownload {
  font-size: 12px;
  height: 100%;
  width: 100%;
  color: #fff;
  position: relative;
  overflow: hidden;
}
#playDownload:after {
  display: block;
  content: '';
  clear: both;
}
#playDownload > .left {
  height: calc(100% - 32px);
  width: 272px;
  position: absolute;
  /* overflow: auto; */
  /* margin-left: 20px; */
  /*margin-top: -10px;*/
  background: #1b3153;
}
#playDownload .left .leftTop {
  height: calc(100% - 250px);
  width: 100%;
  /* overflow: auto; */
  /* background: #1b3153; */
  /*border: 1px solid #e4e4e4;*/
}
#playDownload > .left .leftBottom {
  height: 250px;
  width: 100%;
  padding: 10px 16px;
  overflow: auto;
  border-top: 2px solid #263e69;
}

.condition {
  height: 24px;
  margin: 10px 0;
  width: 100%;
}
.condition > * {
  display: inline-block;
}
.condition > span {
  width: 65px;
  line-height: 24px;
  color: #fff;
}

.radioGroup {
  width: 100%;
  padding: 10px 20px;
  padding-left: 55px;
}
.radioGroup > * {
  margin: 0 15px;
}
button.filter {
  display: block;
  margin-left: 70px;
  margin-top: 10px;
  width: 100px;
}

#playDownload > .right {
  height: 100%;
  width: calc(100% - 272px - 16px);
  float: left;
  overflow: auto;
  padding: 0 0px 0 0;
  margin-left: calc(272px + 16px);
  background: #1c3054;
}
#playDownload > .right > header {
  height: 50px;
  width: 100%;
}
#playDownload > .right header > * {
  margin: 10px 10px;
}

#playDownload > .right > .table {
  /* max-width: 984px; */
  width: 100%;
}
#playDownload > .right > .table table {
  width: 100%;
}
.filterList table thead {
  width: 100%;
  background: #254576;
  height: 32px;
  line-height: 32px;
}
.filterList table thead td {
  padding: 0 18px;
  text-align: left;
}
.filterList .tbody {
  width: 100%;
  background: #1c3053;
  /* max-height: 320px; */
  height: calc((100% - 32px - 52px - 20px - 50px - 32px) / 2);
  line-height: 38px;
  border: 1px solid #203863;
  /* overflow: hidden; */
}
.filterList .tbody div {
  text-align: center;
  line-height: 250px;
}
.filterList .tbody tr:hover {
  background: #20365c;
  /* border-bottom: 1px solid #5d5d5d; */
}
.filterList .tbody tbody td {
  padding: 0 18px;
  text-align: left;
  /* border-bottom: 1px solid #263e69; */
  border-top: 1px solid rgba(58, 90, 139, 0.4);
}

.downloadBtn {
  width: 100px;
}
.downloadBtn[disabled] {
  background: #535f77;
  color: #cacaca;
}

.table .ivu-table-small td {
  height: 34px;
}
</style>
<style lang="less">
.dtp {
  &.el-picker-panel,
  .el-input__inner,
  .el-time-panel {
    color: #fff;
    border-color: #5676a9;
    background: #1c3053;
  }
  &.el-picker-panel {
    border-color: #4699f9;
  }
  .el-date-picker__time-header,
  .el-date-table th,
  .el-date-picker__header--bordered {
    border-bottom: 1px solid #4699f9;
  }
  &.el-popper[x-placement^='top'] .popper__arrow::after {
    bottom: 0;
    border-top-color: #4699f9;
  }
  .el-picker-panel__footer,
  .el-time-panel__footer {
    display: none;
  }
  .el-picker-panel__icon-btn,
  .el-date-picker__header-label,
  .el-date-table th,
  .el-year-table td .cell,
  .el-month-table td .cell,
  .el-time-spinner__item.active:not(.disabled),
  .el-time-spinner__item {
    color: #fff;
  }
  .el-date-table td.next-month,
  .el-date-table td.prev-month {
    color: #606266;
  }
  .el-time-spinner__item:hover:not(.disabled):not(.active) {
    background: #657ca8;
  }
  .el-time-panel__content::after,
  .el-time-panel__content::before {
    border-top: 1px solid #4699f9;
    border-bottom: 1px solid #4699f9;
  }
  .el-popper[x-placement^='top'] {
    margin-bottom: 5px;
  }
}
#playDownload {
  .el-input__suffix {
    right: 1px;
  }
  .is-disabled .el-input__inner {
    background: #535f77;
    color: #ccc;
    overflow: hidden;
  }
  .el-input__inner {
    background: transparent;
    color: #fff;
    padding-left: 8px;
    border-color: #5676a9;
  }
  .el-input__prefix {
    display: none;
  }
  .ivu-select-small.ivu-select-single .ivu-select-selection {
    box-sizing: content-box;
  }
  .ivu-select-small.ivu-select-single .ivu-select-selection .ivu-select-placeholder,
  .ivu-select-small.ivu-select-single .ivu-select-selection .ivu-select-selected-value {
    line-height: 26px;
  }
}
#playDownload .ivu-input-wrapper-small .ivu-input-icon {
  height: 26px;
  width: 32px;
  line-height: 26px;
}
</style>
