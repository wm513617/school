<template>
  <div class="bs-content">
    <div class="bs-main flex-column">
      <div class="main-handle flex-between topBar">
        <div class="handle-left">
          <Button type="ghost" @click="refresh">刷新</Button>
          <!-- <Button type="ghost" @click="removeTasks">删除</Button> -->
          <Button type="ghost" @click="exports">下载</Button>
        </div>
        <!-- 表格 -->
        <div class="handle-right">
          <div style='display:flex;'>
            <span style='vertical-align:top;margin: 6px 10px;'>开始时间</span>
            <DatePicker ref='startTime' type="datetime" @on-change="changeSearchStime" placeholder="开始日期" :editable="false"></DatePicker>
          </div>
          <div style='display:flex;'>
            <span style='vertical-align:top;margin: 6px 10px;'>结束时间</span>
            <DatePicker ref='endTime' type="datetime" @on-change="changeSearchEtime" placeholder="结束时间" :editable="false"></DatePicker>
          </div>
          <Button @click="searchTask" icon="ios-search">搜索</Button>
        </div>
      </div>
      <div ref="tableBox" class="flex-1">
        <div class="bs-table-box">
          <Table @on-selection-change="selectTask" size="small" :height="tableHeight" highlight-row ref="currentRowTable" :columns="tableColumns" :data="TalkBacklist"></Table>
          <div class="table-footer">
            <div style="float: right;">
              <Page :show-total="true" show-sizer :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" :page-size="pageLimit" :show-elevator="true" :total="pageInfo.count" :current="pageInfo.cur" @on-change="changePage"></Page>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 视频弹窗 -->
    <div v-if="isSingleVideo">
      <dragBoxs title="对讲视频" :mask-closable="false" @close="closeSingleVideo" :modalBorder="border">
        <div class="alarm-video" style="height:500px;width:700px;margin: 12px 12px;padding-bottom:50px;">
          <playbackPlugin class="videoPlugin" :configuration="configuration" :defaultPane="1" ref="plugChildren"></playbackPlugin>
        </div>
      </dragBoxs>
    </div>
  </div>
</template>
<script>
import patrol from '../../keepwatch/common/patrol'
import dragBoxs from '../../../components/dragx/Dragx.vue'
import { batchDownloadVideoSegments } from '../../../components/videoComponentsNew/playback'
import playbackPlugin from '../../../components/videoComponentsNew/playbackPlugin'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
// import { STORE_KEY_USERNAME } from '../../constants'
export default {
  components: {
    dragBoxs,
    playbackPlugin
  },
  data() {
    return {
      // 视频插件配置
      configuration: {
        progressBar: {
          totalTime: true
        },
        timeline: false,
        buttos: ['onTheWall', 'stopAll', 'xiazai']
      },
      isSingleVideo: false,
      border: '1px #0a111c solid',
      selectTaskList: [],
      modal: false,
      tableHeight: 435,
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
          align: 'center'
        },
        {
          title: '平台用户',
          key: 'webName',
          width: 200,
          align: 'center',
          render: (h, param) => {
            return h(
              'span',
              {
                attrs: {
                  title: param.row.webName
                }
              },
              param.row.webName
            )
          }
        },
        {
          title: '手机用户',
          key: 'realName',
          ellipsis: true,
          align: 'center',
          render: (h, param) => {
            return h(
              'span',
              {
                attrs: {
                  title: param.row.appName
                }
              },
              param.row.appName
            )
          }
        },
        {
          title: '类型',
          key: 'taskType',
          width: 200,
          align: 'center',
          render: (h, param) => {
            return h('span', '视频对讲')
          }
        },
        {
          title: '开始时间',
          key: 'startTime',
          width: 200,
          align: 'center',
          render: (h, param) => {
            return h('span', this.formatTime(param.row.startTime))
          }
        },
        {
          title: '结束时间',
          key: 'endTime',
          width: 200,
          align: 'center',
          render: (h, param) => {
            return h('span', this.formatTime(param.row.endTime))
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 300,
          align: 'center',
          render: (h, params) => {
            if (this.$BShasPower('BS-PATROL-TASK-MANAGE')) {
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
                        this.showVideo(params)
                      }
                    }
                  },
                  '播放'
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
                        this.deleteVideo(params)
                      }
                    }
                  },
                  '删除'
                )
              ])
            }
          }
        }
      ],
      searchData: {
        starttime: '',
        endtime: ''
      },
      orgInfo: {
        id: '',
        orgName: ''
      },
      pageLimit: this.$PageInfo.limit,
      hasPlay: false // 再页面中是否有过点击播放按钮的操作
    }
  },
  props: {
    oid: {
      type: String
    }
  },
  computed: {
    ...mapGetters(['plugins']),
    ...mapState({
      TalkBacklist: state => {
        return state.patrol.TalkBacklist
      },
      TalkBackMsg: state => {
        return state.patrol.TalkBackMsg
      },
      pageInfo: state => {
        return state.patrol.pageInfo
      },
      TalkUserlist: state => {
        return state.patrol.TalkUserlist
      },
      orgTreeData: state => {
        return state.orgSetting.orgTreeData
      },
      parameters: ({ platform }) => platform.parameters,
      strFilter: ({ videoOrg }) => videoOrg.strFilter
    })
  },
  watch: {
    oid: {
      handler(val) {
        this.orgInfo.id = val
      },
      deep: true
    }
  },
  created() {
    // 获取人员机构数
    this.UPDATE_PAGEINFO()
    console.log(this.pageInfo)
    this.getOrgTree(3).then(() => {
      this.searchTalkbackHistory({oid: this.orgTreeData[0]._id, page: this.pageInfo.cur, limit: this.pageLimit})
      this.orgInfo.id = this.orgTreeData[0]._id
    })
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight - 40
  },
  methods: {
    ...mapMutations(['UPDATE_PAGEINFO']),
    ...mapActions([
      'searchTaskList',
      'searchTalkbackHistory',
      'deleteTalkbackHistory',
      'getTalkBackList',
      'getOrgTree',
      'queryRecord',
      'recordDump'
    ]),
    // 时间格式转换
    formatTime(time) {
      if (time !== undefined) {
        var datetime = new Date(time)
        // 获取年月日时分秒值  slice(-2)过滤掉大于10日期前面的0
        var year = datetime.getFullYear()
        var month = ('0' + (datetime.getMonth() + 1)).slice(-2)
        var date = ('0' + datetime.getDate()).slice(-2)
        var hour = ('0' + datetime.getHours()).slice(-2)
        var minute = ('0' + datetime.getMinutes()).slice(-2)
        var second = ('0' + datetime.getSeconds()).slice(-2)
        // 拼接
        var result = `${year}-${month}-${date} ${hour}:${minute}:${second}`
        // 返回
        return result
      }
    },
    // 关闭视频弹窗
    closeSingleVideo() {
      this.isSingleVideo = false
    },
    // 变更检索时间
    changeSearchStime(time) {
      if (time) {
        this.searchData.starttime = Date.parse(time)
      } else {
        this.searchData.starttime = ''
      }
    },
    changeSearchEtime(time) {
      if (time) {
        this.searchData.endtime = Date.parse(time)
      } else {
        this.searchData.endtime = ''
      }
    },
    // 根据条件检索任务
    searchTask() {
      if (this.searchData.starttime > this.searchData.endtime) {
        this.$Notice.warning({
          title: '开始时间不能大于结束时间'
        })
      } else {
        console.log(this.searchData)
        let param = {
          // name: 'admin',
          starttime: this.searchData.starttime === 0 ? '' : this.searchData.starttime,
          endtime: this.searchData.endtime === 0 ? '' : this.searchData.endtime,
          page: this.pageInfo.cur,
          limit: this.pageLimit,
          oid: this.orgInfo.id
        }
        this.searchTalkbackHistory(param)
      }
    },
    selectTask(selection, index) {
      this.selectTaskList = selection
      console.log(selection)
    },
    // 刷新页面
    refresh() {
      this.$refs.startTime.handleClear()
      this.$refs.endTime.handleClear()
      this.searchTalkbackHistory({oid: this.orgInfo.id, page: this.pageInfo.cur, limit: this.pageLimit})
    },
    // 批量导出
    exports() {
      console.log('batchDownloadVideoSegments', this.parameters.downloadVideoPath)
      const videoType = this.parameters.downloadVideoType.toLowerCase()
      if (this.selectTaskList.length > 0) {
        let params = []
        let path = this.getPath()
        this.selectTaskList.map((item, index) => {
          let paramObj = {
            webName: item.webName,
            appName: item.appName,
            sn: item.sn,
            startTime: Math.floor(item.startTime / 1000),
            endTime: Math.floor(item.endTime / 1000),
            dsId: item.dsId,
            fileName: path + '\\' + this.$moment(new Date()).format('YYYYMMDDHHmmss') + index + '.' + videoType
          }
          params.push(paramObj)
        })
        this.$Notice.warning({ title: '提示', desc: `对讲开始下载，下载路径为${path}` })
        batchDownloadVideoSegments(params).then(res => {
          res.map((item, index) => {
            if (!item.success) {
              this.$Notice.error({ title: '失败', desc: `所选列表的第${index + 1}个文件下载失败` })
            }
          })
        })
      }
    },
    getPath() {
      if (!this.plugins.valid) {
        this.$Notice.warning({ title: '警告', desc: '请先安装插件' })
        return
      }
      const state = JSON.parse(this.plugins.GetFileDirectory('请选择文件'))
      if (state.success) {
        return state.DirName
      }
    },
    // 获取第N页数据
    changePage(n) {
      this.searchTalkbackHistory({oid: this.orgInfo.id, page: parseInt(n), limit: this.pageLimit})
    },
    pageSizeChange(n) {
      this.pageLimit = n
      this.searchTalkbackHistory({oid: this.orgInfo.id, page: this.pageInfo.cur, limit: parseInt(n)})
    },
    // 播放视频对讲
    showVideo(param) {
      let params = [{
        name: '',
        webName: param.row.webName,
        appName: param.row.appName,
        sn: param.row.sn,
        startTime: Math.floor(param.row.startTime / 1000),
        endTime: Math.floor(param.row.endTime / 1000),
        dsId: param.row.dsId,
        fileName: `${this.parameters.downloadVideoPath}\\demo.${this.parameters.downloadVideoType.toLowerCase()}`
      }]
      this.isSingleVideo = true
      this.$nextTick(() => {
        this.$refs.plugChildren.openPlayback(params)
      })
      // this.$refs.plugChildren.openPlayback(params)
      let _this = this
      // 如果页面播放过视频，则不再调用组件内部的打开音量功能
      if (!this.hasPlay) {
        setTimeout(() => {
          _this.$refs.plugChildren.volumeSwitch()
        }, 1000)
      }
      this.hasPlay = true
    },
    // 删除视频对讲
    deleteVideo(param) {
      this.$Modal.confirm({
        title: '删除确认',
        content: '确认删除视频对讲吗?',
        loading: true,
        onOk: () => {
          this.deleteTalkbackHistory({id: param.row._id}).then(res => {
            console.log('删除返回', res)
            if (res.status === 200) {
              this.$Notice.success({
                title: '删除成功'
              })
              this.searchTalkbackHistory({oid: this.orgTreeData[0]._id, page: this.pageInfo.cur, limit: this.pageLimit})
              this.$Modal.remove()
            }
          }).catch(error => {
            console.log('删除错误', error)
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .video-plugin .video-bottom .right .progress-bar .slide-mon-f[data-v-271c50f4] {
  opacity: 1;
}
/deep/ .videoPlugin .ivu-timeline-item-content {
  margin-right: 25px;
}
/deep/ .videoPlugin .single-video-plugin {
  height: 100% !important;
}
.videoPlugin {
  width: 285px;
  height: 175px;
  margin-top: 5px;
}
.bs-content {
  padding: 0;
}
.right-content {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.object-box {
  width:0;
  height: 0;
}
.flex-1 {
  position: relative;
  overflow: hidden;
}
.bs-table-box {
  position: absolute;
  left: 0;
  right: 0;
  height: 100%;
  background: #1c3053;
}
.ivu-table-tip{
  overflow-x: hidden !important;
}
.handle-left {
  flex: 0 0 300px;
  padding: 12px 24px;
}
.handle-left > Button {
  margin-right: 8px;
}
.alarm-video {
  display: flex;
  float: left;
  width: 500px;
  height: 500px;
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
    height: 154px;
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
  margin-top: 15px;
}
.foot-btn button {
  margin-left: 20px;
}
.handle-right {
  display: flex;
  flex: 1;
  justify-content: flex-end;
  padding: 12px 24px;
}
.topBar{
  background: #1b3153;
}
.handle-right > div {
  display: inline-block;
  margin: 0 10px;
}
.handle-right > Button {
  margin-left: 8px;
}
.ivu-date-picker {
  width: 170px;
}
.task-point {
  width: calc(~'100% - 40px');
  display: inline-block;
}
// 弹出框右侧样式
.modal-right {
  padding: 10px;
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 0;
  border-left: 1px solid #171717;
  right: -260px;
  width: 260px;
  height: 100%;
  background: #1c3053;
}
.modal-right .ivu-date-picker {
  width: 180px;
}
.point-tree {
  flex: 1;
  border: 1px solid #ccc;
  margin: 10px 0;
  overflow: auto;
}
.condition {
  height: 26px;
  margin: 26px 0;
  width: 100%;
}
.condition > * {
  display: inline-block;
}
.condition > span {
  width: 80px;
  line-height: 24px;
  color: #fff;
}
.black_over{
    // display: none;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #081526;
    z-index: 9999;
    opacity: 0.8;
}
/*弹框*/
.popup{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -300px;
    margin-top: -328px;
    width: 600px;
    height: 656px;
    background-color: #1b3153;
    z-index: 99999;
    border-radius: 10px;
    border: 1px solid #1b3153;
}
.modal-top{
    font-size: 14px;
    height: 38px;
    padding: 10px 24px;
    border-radius: 8px 8px 0 0;
    background-color: #0f2343;;
}
.control-bar i{
  margin-right: 10px;
  cursor: pointer;
}
.control-bar .volume{
  margin-right: 10px;
}
.control-bar .duration{
  float: right;
  margin-top: 7px;
}
</style>
<style>
.ivu-table-tip {
  overflow-x: hidden !important;
}
</style>
