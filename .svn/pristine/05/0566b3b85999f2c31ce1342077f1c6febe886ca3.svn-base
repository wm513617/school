<template>
  <div class="single-content" >
    <div class="single-main">
      <div class="main-handle-top">
        <div class="handle-left">
          <Button v-if="$BShasPower('BS-PATROL-MESSAGE')" type="ghost" :disabled="isRemove" @click="removeMsgs" icon="trash-a" style="margin-right:8px;">删除</Button>
          <Button type="ghost" @click="refresh" icon="android-refresh">刷新</Button>
        </div>
        <div class="handle-right">
          <Input v-model="searchData.key" placeholder="发起人或者SN" style="width: 150px;margin-right:16px;"></Input>
          <DatePicker ref='startTime' type="date" @on-change="searchStartTimeChange"  placeholder="开始日期" :editable="false"></DatePicker>
          <span>至</span>
          <DatePicker ref='endTime' type="date" @on-change="searchEndTimeChange"  placeholder="结束日期" :editable="false"></DatePicker>
          <Button @click="searchSingle" icon="ios-search">搜索</Button>
        </div>
      </div>
      <div class="main-table" ref="tableBox" v-resize="resizeFun">
        <div class="main-table-content">
          <Table @on-selection-change="selectRow" size="small" highlight-row :columns="tableColumns" :data="singleList" :height="tableHeight"></Table>
        </div>
      </div>
      <div class="main-footer">
        <div style="float: right;">
          <Page show-sizer :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" :show-total="true" :page-size="pageLimit" :show-elevator="true" :total="pageInfo.count" :current="pageInfo.cur" @on-change="changePage"></Page>
        </div>
      </div>
    </div>
    <div v-if="isSingleVideo">
      <!-- <Modal v-model="isSingleVideo" width="640px" title="消息详情" :mask-closable="false">
        <div class="single-video" style="height:464px">
          <SinglePawn :videoParam="singleInfo"></SinglePawn>
        </div>
        <div slot="footer"></div>
      </Modal> -->
      <dragBoxs title="单兵视频" :mask-closable="false" @close="closeSingleVideo" :modalBorder="border">
        <div class="alarm-video" style="padding: 12px 6px">
          <Tabs :animated="false" @on-click="tabClick">
            <TabPane label="位置">
              <LocateInMap style="width:600px;height:432px;" type="patrol" :geo="patrolAlarmGeo"></LocateInMap>
            </TabPane>
            <TabPane label="视频">
              <div class="alarm-video" style="width:600px;height:444px;">
                <playbackPlugin :configuration="configuration" :defaultPane="1" ref="plugChildren"></playbackPlugin>
              </div>
            </TabPane>
          </Tabs>
        </div>
        <div class="infoRight" v-show="isSingleVideo">
          <div class="infoRightTittle">报警源信息</div>
          <div class="infoRightInfo infoRightInfo-top">
            <div class="infoDetail">
              <div class="infoLabel">报警人</div>
              <div class="infoValue">{{alarmDetail.sender}}</div>
            </div>
            <div class="infoDetail">
              <div class="infoLabel">报警类型</div>
              <div class="infoValue">单兵一键报警</div>
            </div>
            <div class="infoDetail">
              <div class="infoLabel">时间</div>
              <div class="infoValue">{{alarmDetail.time}}</div>
            </div>
          </div>
          <p style="width:100%;height:4px;border-bottom:1px solid #6f7d92"></p>
          <div class="infoRightInfo">
            <div class="infoDetail">
              <div class="infoLabel">警情处理</div>
              <div class="infoValue">
                <div class="infoValue">{{alarmAckContent.alarmDeal}}</div>
                <!-- <Select v-model="planAlarmSelId" size="small" style="width:174px" disabled>
                  <Option v-for="item in planAlarmList" :value="item.value" :key="item.value">{{item.label}}</Option>
                </Select> -->
              </div>
            </div>
            <div class="infoDetail" style="margin:12px 0 12px 0;display: inline-block;">
              <div class="infoLabel">警情确认</div>
              <div class="infoValue">
                <!-- <Select v-model="pointSelectionPlan" size="small" style="width:174px" disabled>
                  <Option @click.native="selectWarnPlan(item)" v-for="item in warnPlanListOpt" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select> -->
                <div class="infoValue">{{alarmAckContent.situationType}}</div>
              </div>
            </div>
            <div class="infoDetail">
              <div class="infoLabel">警情信息</div>
              <div class="infoValue">
                <Input v-model="alarmAckContent.alarmContent" type="textarea" :autosize="{minRows: 3,maxRows: 4}" disabled/>
              </div>
            </div>
          </div>
          <div class="foot-btn">
            <!-- <Button type="primary" @click="confirmAlarm('unProcess')">清除报警</Button>
            <Button type="primary" @click="confirmAlarm('process')">确认报警</Button> -->
          </div>
        </div>
      </dragBoxs>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import moment from 'moment'
import dragBoxs from 'components/dragx/Dragx.vue'
import playbackPlugin from '../../components/videoComponentsNew/playbackPlugin'
import LocateInMap from '../../components/map/LocateInMap'
export default {
  components: {
    dragBoxs,
    playbackPlugin,
    LocateInMap
  },
  data() {
    return {
      singleInfoData: [
        {
          appName: '',
          sn: '',
          startTime: '',
          dsId: '',
          webName: '',
          endTime: '',
          videoSegmentsIndex: 0,
          name: ''
        }
      ],
      patrolAlarmGeo: '',
      // 视频插件配置
      configuration: {
        progressBar: {
          totalTime: true
        },
        timeline: false,
        buttos: ['onTheWall', 'stopAll']
      },
      alarmAckContent: {},
      border: '1px #0a111c solid',
      selectedPlan: {
        value: '',
        label: '',
        content: ''
      },
      planAlarmSelId: '',
      alarmDetail: {},
      pointSelectionPlan: '',
      selectData: [],
      isRemove: true,
      isSingleVideo: false,
      pageLimit: this.$PageInfo.limit,
      getType: 1,
      orgInfo: {
        id: '',
        name: ''
      },
      searchData: {
        key: '',
        startTime: '',
        endTime: '',
        org: '',
        recipient: ''
      },
      tableHeight: 0,
      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          type: 'index',
          title: '序号',
          width: 70,
          align: 'center',
          ellipsis: true
        },
        {
          key: 'recipient',
          title: '发起人',
          align: 'center',
          ellipsis: true
        },
        {
          key: 'webName',
          title: '接收人',
          align: 'center',
          ellipsis: true
        },
        {
          title: '时间',
          align: 'center',
          ellipsis: true,
          render: (h, param) => {
            return h('span', moment(param.row.createdAt).format('YYYY-MM-DD HH:mm'))
          }
        },
        {
          key: 'sn',
          title: '设备SN码',
          align: 'center',
          ellipsis: true
        },
        {
          type: 'action',
          title: '操作',
          align: 'center',
          width: 150,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.showVideo(params.row)
                    }
                  }
                },
                '查看'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params.row)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ]
    }
  },
  props: {
    orgId: {
      type: String
    }
  },
  computed: {
    ...mapState({
      singleList: state => state.patrol.singleList,
      orgTreeData: ({ orgSetting }) => {
        return orgSetting.orgTreeData
      },
      pageInfo: state => state.patrol.pageInfo
    }),
    paramData: function() {
      const param = JSON.parse(JSON.stringify(this.searchData))
      param.startTime = param.startTime ? this.$moment(param.startTime).format('X') : ''
      param.endTime = param.endTime ? String(Number(this.$moment(param.endTime).format('X')) + 86400) : ''
      param.limit = this.pageLimit
      return param
    }
  },
  created() {
    this.getOrgTree(3)
    this.getSingleList({ org: this.orgId, limit: this.pageLimit })
    this.getalarmDealList()
    this.getAlarmTypeList()
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight + 44
  },
  methods: {
    ...mapMutations(['UPDATE_PAGEINFO']),
    ...mapActions(['getSingleList', 'getSingleInfo', 'getOrgTree', 'recordLog', 'deleteWarnning', 'deleteAllWarnning', 'updatePatrolAlarm', 'getMapAlarmDealList', 'getPrearranged', 'updatePatrolAlarm']),
    tabClick(val) {
      if (val === 1) {
        this.$refs.plugChildren.openPlayback(this.singleInfoData)
      }
    },
    /**
     * 单兵视频模态框判断
     * @method closeSingleVideo
     * @param {Object}
     */
    closeSingleVideo() {
      this.isSingleVideo = false
    },
    // 警情确认
    confirmAlarm(data) {
      if (this.pointSelectionPlan || data === 'unProcess') {
        // this.$Modal.confirm({
        //   title: '提示',
        //   content: `<p>确定执行吗？</p>`,
        // onOk: () => {
        const alarmSureInfo = {
          alarmDeal: this.planAlarmSelId,
          situationType: this.selectedPlan.label,
          alarmContent: this.selectedPlan.content
        }
        if (data === 'ignore') {
          this.dealState = 'ignore'
        } else if (data === 'process') {
          this.dealState = 'process'
        } else {
          this.dealState = 'unProcess'
        }
        const param = {
          id: this.singlePawnId,
          planId: this.selectedPlan.value,
          planName: this.selectedPlan.label,
          planDeal: this.planAlarmSelId,
          remark: this.selectedPlan.content,
          dealState: this.dealState,
          ackContent: JSON.stringify(alarmSureInfo)
        }
        // this.updateTaskMessage(param)
        // .then(res => {
        this.successMsg('报警确认成功')
        this.videoModal = false
        this.closeSingleVideo(param.id)
        this.updatePatrolAlarm({
          id: this.singleUniqueId,
          dealState: this.dealState,
          ackContent: JSON.stringify(alarmSureInfo)
        }).catch(err => this.errorMsg(err.response.data.message))
        // })
        // .catch(err => this.errorMsg(err.response.data.message))
      }
      //   })
      // } else {
      //   this.errorMsg('请选择警情')
      // }
    },
    /**
     * 切换一键报警警情类型
     */
    selectWarnPlan(data) {
      this.selectedPlan.label = data.label
      this.selectedPlan.value = data.value
      this.selectedPlan.content = data.content
    },
    // 警情处理列表
    getalarmDealList() {
      this.getMapAlarmDealList({ page: 1, limit: 100, type: 'fire' }).then(res => {
        let alarmDealList = []
        res.data.forEach(item => {
          alarmDealList.push({ label: item.name, value: item.name })
          this.planAlarmList = alarmDealList
        })
      }).catch(err => {
        console.log('getFireAlarmDealList error: ', err)
        this.errorMsg('警情处理列表获取失败')
      })
    },
    // 警情确认列表
    getAlarmTypeList() {
      this.getPrearranged({ page: 1, limit: 50 }).then(res => {
        let warnAlarmList = []
        res.data.forEach(item => {
          warnAlarmList.push({ label: item.name, value: item._id, content: item.content })
          this.warnPlanListOpt = warnAlarmList
        })
      }).catch(err => {
        console.log('getAlarmTypeList error: ', err)
        this.errorMsg('警情确认列表获取失败')
      })
    },
    /**
     * 刷新
     * @method refresh
     */
    refresh() {
      this.orgInfo.id = ''
      this.getType = 1
      this.paramData.org = ''
      this.searchData.key = ''
      this.$refs.startTime.handleClear()
      this.$refs.endTime.handleClear()
      this.getSingleList({ limit: this.pageLimit })
    },
    /**
     * 查看视频详情
     * @method showVideo
     * @param {Object} data 详情信息
     */
    showVideo(data) {
      const time = moment(data.createdAt).format('YYYY-MM-DD HH:mm')
      this.alarmDetail.time = time
      this.alarmDetail.sender = data.recipient
      this.getSingleInfo({ id: data._id }).then(res => {
        this.alarmAckContent = res.data.ackContent ? JSON.parse(res.data.ackContent) : ''
        this.singleInfoData = [{
          appName: res.data.userName,
          sn: res.data.sn,
          startTime: res.data.time,
          dsId: res.data.storage,
          webName: res.data.webName,
          endTime: parseInt(res.data.time) + 600,
          videoSegmentsIndex: 0,
          name: '一键报警'
        }]
        if (res.data.geo) {
          this.patrolAlarmGeo = `${res.data.geo.lon},${res.data.geo.lat}`
        } else {
          this.$Notice.warning({
            title: '未获取到经纬度'
          })
          this.patrolAlarmGeo = ''
        }
        console.log(this.singleInfoData, 'singleInfoData')
        this.isSingleVideo = true
        // this.$nextTick(() => {
        // this.$refs.plugChildren.openPlayback(singleInfoData)
        // })
        this.recordLog({logType: '操作日志', module: '电子巡查', operateName: '接收消息', operateContent: '接收消息+ 单兵账号', target: this.singleInfoData.name})
      })
    },
    /**
     * 根据页码获取详情
     * @method searchStartTimeChange
     * @param {Object} n 页码
     */
    changePage(n) {
      let param = Object.assign(this.paramData, { page: n })
      this.getSingleList(param)
    },
    pageSizeChange(n) {
      this.pageLimit = n
      let param = Object.assign(this.paramData, { page: 1 })
      this.getSingleList(param)
    },
    /**
     * 单条删除
     * @method remove
     * @param {Object} item 单条信息
     */
    remove(item) {
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>确认删除消息吗?</p>',
        loading: true,
        onOk: () => {
          this.deleteWarnning({id: item._id}).then(res => {
            this.$Notice.success({
              title: '删除成功'
            })
            this.$Modal.remove()
            this.getSingleList({ limit: this.pageLimit })
          })
            .catch(err => console.log(err))
        }
      })
    },
    selectRow(rows) {
      if (rows.length > 0) {
        this.isRemove = false
      } else {
        this.isRemove = true
      }
      this.selectData = rows
    },
    removeMsgs() {
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>确认删除消息吗?</p>',
        loading: true,
        onOk: () => {
          const ids = []
          this.selectData.map(item => {
            ids.push(item._id)
          })
          this.deleteAllWarnning(ids).then(res => {
            if (this.selectData.length) {
              this.isRemove = true
            }
            this.$Notice.success({
              title: '删除成功'
            })
            this.$Modal.remove()
            this.getSingleList({ limit: this.pageLimit })
          })
        }
      })
    },
    /**
     * 根据条件进行搜索
     * @method searchSingle
     */
    searchSingle() {
      if (this.paramData.startTime > this.paramData.endTime) {
        this.$Notice.warning({
          title: '开始时间不能大于结束时间'
        })
      }
      if ((this.paramData.endTime - this.paramData.startTime) / 86400 > 30) {
        this.$Notice.warning({
          title: '日期范围不能大于一个月'
        })
      } else {
        this.getType = 2
        this.orgInfo.id = ''
        this.paramData.page = 1
        this.getSingleList(this.paramData)
      }
    },
    /**
     * 根据开始结束时间进行查询
     * @method searchStartTimeChange
     * @param {Object} time 时间
     */
    searchStartTimeChange(time) {
      this.searchData.startTime = time
    },
    searchEndTimeChange(time) {
      this.searchData.endTime = time
    },
    /**
     * 表格高度调节
     * @method resizeFun
     */
    resizeFun() {
      this.tableHeight = this.$refs['tableBox'].offsetHeight
    }
  }
}
</script>

<style lang="less"  scoped>
.single-content{
  display: flex;
  flex: 1;
  .single-left{
    flex: 0 0 272px;
    background: #1b3153;
    margin-right: 16px;
    overflow: hidden;
    min-height: 670px;
  }
  .single-main{
    flex: 1;
    display: flex;
    min-height: 670px;
    flex-direction:column;
    background: #1c3053;
    .handle-right{
      float: right;
      padding: 12px 24px;
      Button {
        margin-left: 16px;
      }
    }
    .handle-left{
      float: left;
      padding: 12px 24px;
      button {
        height: 32px;
      }
    }
  }
  .main-table{
    flex: 1;
    .main-table-content{
      width: calc(~'100% - 288px');
      background: #1c3053;
      display: flex;
      // height: 100%;
      flex-direction: column;
      position: absolute;
    }
  }
  .main-footer{
      padding: 3px 10px;
      background-color: #244575;
      border: none;
      height: 40px;
  }
  .single-video{
    height: 600px;
  }
}

.alarm-video {
  display: flex;
  float: left;
  width: 612px;
  height: 510px;
}
.infoRight {
  float: right;
  padding: 12px 24px;
  .infoRightTittle {
    height: 26px;
    line-height: 26px;
    margin: 10px 88px;
  }
  .infoRightInfo {
    height: 180px;
    .infoDetail {
      width: 100%;
      height: 26px;
      line-height: 26px;
      clear: both;
      .infoLabel {
        width: 74px;
        float: left;
      }
      .alarmHostBtn {
        width: 100%;
        float: left;
        margin: 12px 0;
      }
      .infoValue {
        float: left;
        .infoValueHeight {
          width: 100%;
          height: 100px;
          border: 1px solid #444;
          padding-left: 5px;
          .alarmIncountItem {
            cursor: pointer;
            height: 22px;
            line-height: 22px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &:hover {
              color: #20adff;
            }
          }
        }
      }
    }
  }
}
.foot-btn {
  height: 24px;
}
.foot-btn button {
  margin-left: 20px;
}
</style>
