<template>
  <!-- 刷卡记录 -->
  <div class="bs-content" style="overflow: inherit;">
    <div class="bs-left">
      <SrvSideBar @tigger-door='canClickSearch' :srvCfg='false'></SrvSideBar>
    </div>
    <div class="bs-main">
      <div class="bsMainChild">
        <div class="tab-content-alarm">
          <div class="feature-btn">
            <div class="input">
              <Input v-model="searchData.workNum" placeholder="请输入学工号" style="width: 200px;margin-right: 10px;"/>
            </div>
            <!--  :options='options1' -->
            <DatePicker type="datetime" @on-change="changeStartTime" :value="searchData.valueStart" format="yyyy-MM-dd HH:mm:ss" placeholder="开始日期" style="width: 218px"></DatePicker>
            <span style="margin:0 10px;">至</span>
            <!--  -->
            <DatePicker type="datetime" @on-change="changeEndTime" :value="searchData.valueEnd" format="yyyy-MM-dd HH:mm:ss" placeholder="结束日期" style="width: 218px"></DatePicker>
            <Select style="width:150px;margin:0px 10px;" v-model="searchData.option" placeholder="请选择">
              <Option v-for="item in this.searchOption" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Button type="ghost" icon="search" @click="search(1)" style="margin-left:14px;">搜索</Button>
            <!-- <Button type="ghost" icon="refresh" @click="refash">刷新</Button> -->
          </div>
          <div class="table-relative" ref="tableBox">
            <Table v-if = 'tableHeight && tableWidth' size="small" :columns = "importTitle" :data = "importData" :height = "tableHeight" :width = 'tableWidth'></Table>
          </div>
          <div class="page-style">
            <Page class="rt" show-sizer :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" :current='Number(startNum)' :total="Number(inPageNum)" :page-size="Number(pageLimit)" @on-change="pageChange" show-elevator show-total></Page>
          </div>
        </div>
        <!--模态框-->
        <Modal v-model="modal" title="录像回放" class='modelBox' :mask-closable="false">
          <!--  :startTime='Number(videoStartTime)' :endTime='Number(videoEndTime)'  -->
          <DoorPlaybackModal v-if="modal" :channels="channelsParam"></DoorPlaybackModal>
          <div class='videoShowOther'>
            <Button type="ghost" class='exitModel'>返回</Button>
          </div>
          <div slot='footer'></div>
        </Modal>
      </div>
    </div>
  </div>
</template>
<script>
import './common.css'
import { mapState, mapActions } from 'vuex'
import SrvSideBar from './srvSideBar.vue'
import DoorPlaybackModal from './playback/doorPlaybackModal.vue'
export default {
  name: 'cardBlog',
  components: {
    SrvSideBar,
    DoorPlaybackModal
  },
  data() {
    return {
      // 绑定到前端同时发送给后端的数据
      searchData: {
        workNum: '',
        option: -1,
        valueStart: this.$moment().format('YYYY-MM-DD 00:00:00'),
        valueEnd: this.$moment().format('YYYY-MM-DD HH:mm:ss')
      },
      // 无用  保留
      valueStart: '',
      valueEnd: '',
      // 页面下拉框
      searchOption: [
        { label: '全部', value: -1 },
        { label: '普通人员', value: 0 },
        { label: '黑名单', value: 1 },
        { label: '重点关注', value: 2 }
      ],
      // 表格
      importTitle: [
        {
          title: '时间',
          key: 'time'
        },
        {
          title: '学工号',
          key: 'idNum'
        },
        {
          title: '进出方向',
          key: 'direction'
        },
        {
          title: '门禁',
          key: 'devName'
        },
        {
          title: '人员类型',
          key: 'peopleType'
        },
        {
          title: '是否开门',
          key: 'openStatus'
        },
        {
          title: '录像回放',
          key: 'playback',
          width: 120,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary'
                  },
                  on: {
                    click: () => {
                      this.videoSource(params.row)
                    }
                  }
                },
                '录像回放'
              )
            ])
          }
        }
      ],
      // 模态框
      modal: false,
      // 视频开始播放与结束播放时间
      videoEndTime: 0,
      videoStartTime: 0,
      // 分页
      inPageNum: '',
      pageLimit: this.$PageInfo.limit,
      startNum: 1,
      // 表格数据
      importData: [],
      // 列表高度
      tableHeight: '',
      tableWidth: '',
      // 传给录像组件的数据
      channelsParam: [],
      // 暂无用 保留
      options1: {},
      // 暂无用 保留
      options2: {},
      getTreeNode: ''
    }
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = this.$refs['tableBox'].offsetHeight
      this.tableWidth = this.$refs['tableBox'].offsetWidth
    })
  },
  computed: {
    ...mapState({
      searchList: ({ funDoor }) => funDoor.searchList,
      pageSort: ({ funDoor }) => funDoor.pageSortData,
      playBlackData: ({ funDoor }) => funDoor.videoPlayBlack
    }),
    plugin() {
      return this.$refs.videoPlay
    }
  },
  methods: {
    ...mapActions(['cardRecode', 'getVideoResource']),
    canClickSearch(doorId) {
      this.getTreeNode = doorId.id
    },
    // 页面搜索按钮
    search(n) {
      const params = {
        id: this.getTreeNode,
        data: {
          number: this.searchData.workNum,
          start: this.searchData.valueStart ? this.$moment(this.searchData.valueStart).unix() : '',
          end: this.searchData.valueEnd ? this.$moment(this.searchData.valueEnd).unix() : '',
          type: this.searchData.option === '-1' ? '' : this.searchData.option,
          page: n,
          limit: this.pageLimit
        }
      }
      if (params.data.start && params.data.end && params.data.start > params.data.end) {
        this.errorMsg('搜索开始时间不能大于结束时间')
      } else if (!this.getTreeNode) {
        this.errorMsg('请先选择门禁机构')
      } else {
        this.cardRecode(params)
          .then(res => {
            this.importData = this.searchList
            this.startNum = this.pageSort.current
            this.inPageNum = this.pageSort.counts
            this.pageLimit = this.pageSort.limits
          })
          .catch(err => {
            this.errorMsg('搜索修改门禁失败！')
            console.log('this.cardRecode :' + err)
          })
      }
    },
    // 点击录像回放  传数据给录像组件
    videoSource(row) {
      this.videoStartTime = parseInt(this.$moment(row.time).format('X')) - 20
      this.videoEndTime = parseInt(this.$moment(row.time).format('X')) + 20
      this.getVideoResource(row.doorNum)
        .then(res => {
          this.modal = true
          this.channelsParam = JSON.parse(JSON.stringify(this.playBlackData))
          this.channelsParam.forEach(item => {
            ;(item.startTime = this.videoStartTime)((item.endTime = this.videoEndTime))
          })
        })
        .catch(err => {
          if (err.response.data.code === 2001) {
            this.errorMsg(err.response.data.message)
          } else {
            this.errorMsg('获取门禁视频资源失败！')
          }
          console.log('this.getVideoResource :' + err)
        })
    },
    // modal取消
    cance() {
      this.modal = false
    },
    // 改变页面初始时间
    changeStartTime(val) {
      this.searchData.valueStart = val
    },
    // 改变页面结束时间
    changeEndTime(val) {
      this.searchData.valueEnd = val
    },
    // 分页功能
    pageChange(page) {
      this.search(page)
    },
    pageSizeChange(n) {
      this.pageLimit = n
      this.search(1)
    }
  }
}
</script>

<style lang="less" scoped>
.bsMainChild {
  width: 100%;
  height: 100%;
  .tab-content-alarm {
    width: 100%;
    height: 100%;
    background-color: #1c3053;
    display: flex;
    flex-direction: column;
    .feature-btn {
      height: 64px;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-left: 24px;
    }
    .table-relative {
      flex: 1;
      overflow-y: auto;
    }
    .page-style {
      height: 40px;
      line-height: 40px;
      padding-right: 16px;
      background-color: #244575;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }
  }
  .videoShowOther .videoList {
    width: 200px;
    height: 180px;
    text-align: center;
    margin-top: 20px;
  }
  .videoShowOther .videoList:first-child {
    margin: 0;
  }
  .videoShowOther .exitModel {
    width: 200px;
    font-size: 16px;
    text-align: center;
    height: 40px;
    margin: 15px 0px 0px 2px;
  }
}
</style>
