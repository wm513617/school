<template>
  <div class="bs-content">
    <div class="object-box">
      <object ref="videoObj" type="application/x-webplayercontrol" id="videoObj" style="width:0;height:0;"></object>
    </div>
    <div class="bs-main flex-column">
      <div class="main-handle flex-between topBar">
        <div class="handle-left">
          <Button type="ghost" @click="refresh">刷新</Button>
          <!-- <Button type="ghost" @click="removeTasks">删除</Button> -->
          <Button type="ghost" @click="exports">下载</Button>
        </div>
        <div class="handle-right">
          <Input v-model="searchData.taskTitle" placeholder="请输入" style="width: 150px"></Input>
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
          <Table @on-selection-change="selectTask" size="small" :height="tableHeight" highlight-row ref="currentRowTable" :columns="tableColumns" :data="PhoneAudiolist"></Table>
          <div class="table-footer">
            <div style="float: right;">
              <Page :show-total="true" show-sizer :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" :page-size="pageLimit" :show-elevator="true" :total="pageInfo.count" :current="pageInfo.cur" @on-change="changePage"></Page>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 语音播放弹窗 -->
    <div v-if="videoModal">
      <dragBoxs title="广播" :mask-closable="false" @close="closeSingleVideo" :modalBorder="border">
        <div v-if="videoModal" style="width:700px;margin:20px;">
          <div>{{audioInfo.phoneAudioInfo.webName}} —— <span v-for="(item, index) in audioInfo.phoneAudioInfo.phoneInfo" :key="index">{{item.name}} </span></div>
          <div>{{formatTime(audioInfo.evtTblInfo.startTime * 1000)}} To {{formatTime(audioInfo.evtTblInfo.endTime * 1000)}}</div>
          <Slider v-model="audioProgress" @on-change="setAudioProgress"></Slider>
          <div class="control-bar">
            <i class="icon iconfont" :class="[voiceState.isPlay ? 'icon-pause' : 'icon-play']" @click="PlayorPause" :title="voiceState.isPlay ? '暂停' : '播放'"></i>
            <i class="icon iconfont icon-stop" title="停止" @click="StopPlay()"></i>
            <i class="icon iconfont icon-xiazai" title="下载" @click="DownloadAudio(audioInfo)"></i>
            <div class="volume" style="display:inline-block;">
              <i class="icon iconfont" :class="[voiceState.isVolume? 'icon-mute': 'icon-volume']"  @click="AdjustVolume" title="音量"></i>
              <div class="slider-box" style="width:80px;height:40px;display:inline-block;vertical-align: middle;" v-show="!voiceState.isVolume">
                <slider color="#20adff" v-model="volume" @on-input="setVolume"></slider>
              </div>
            </div>
            <div class="duration">{{playProgress}} / {{playTime}}</div>
          </div>
        </div>
      </dragBoxs>
    </div>
  </div>
</template>
<script>
import patrol from '../../keepwatch/common/patrol'
import dragBoxs from '../../../components/dragx/Dragx.vue'
import playBack from '../../../components/bsvue/videoImp/playback'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
// import { STORE_KEY_USERNAME } from '../../constants'
export default {
  components: {
    dragBoxs
  },
  data() {
    return {
      // 语音控制状态
      voiceState: {
        isPlay: true,
        isVolume: true
      },
      dsId: '',
      videoModal: false,
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
          title: '发起人',
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
          title: '参与人',
          key: 'realName',
          ellipsis: true,
          align: 'center',
          render: (h, param) => {
            let str = param.row.phoneAudioInfo.map(item => {
              return item.name
            }).toString()
            return h(
              'span',
              {
                attrs: {
                  title: str
                }
              },
              str
            )
          }
        },
        {
          title: '类型',
          key: 'taskType',
          width: 200,
          align: 'center',
          render: (h, param) => {
            return h('span', param.row.taskType === 2 ? '自由模式' : '固定模式')
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
                        this.audioIntercom(params)
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
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.deleteAudio(params)
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
        taskTitle: '',
        realName: '',
        startTime: '',
        endTime: ''
      },
      orgInfo: {
        id: '',
        orgName: ''
      },
      pageLimit: this.$PageInfo.limit,
      audioProgress: 0,
      volume: 0,
      audioInfo: {},
      currentStartTime: '', // 当前打开音频的开始时间
      currentEndTime: '', // 当前打开音频的结束时间
      duration: '', // 音频时间长度
      playTime: '00:00:00', // 播放时长
      playProgress: '00:00:00', // 播放进度
      playCurTime: '', // 暂停时的当前播放时间
      playTimer: null,
      isStop: false, // 音频停止播放的标识
      dsIp: ''
    }
  },
  computed: {
    ...mapGetters(['plugins']),
    ...mapState({
      PhoneAudiolist: state => {
        return state.patrol.PhoneAudiolist
      },
      PhoneAudioDsip: state => {
        return state.patrol.PhoneAudioDsip
      },
      PhoneAudioMsg: state => {
        return state.patrol.PhoneAudioMsg
      },
      pageInfo: state => {
        return state.patrol.pageInfo
      },
      orgTreeData: state => {
        return state.orgSetting.orgTreeData
      },
      parameters: ({ platform }) => platform.parameters
    })
  },
  created() {
    // 获取人员机构数
    this.UPDATE_PAGEINFO()
    this.getOrgTree(3).then(() => {
      let param = {
        oid: this.orgTreeData[0]._id,
        startTime: 0,
        endTime: Date.parse(new Date()),
        page: this.pageInfo.cur,
        limit: this.pageLimit
      }
      this.searchPhoneAudio(param)
    })
    // 获取dsId
    // 获取dsid
    this.getDisId().then(res => {
      if (res.data.dsId !== undefined) {
        this.dsId = res.data.dsId
      }
    })
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight - 40
  },
  methods: {
    ...mapMutations(['UPDATE_PAGEINFO']),
    ...mapActions([
      'searchTaskList',
      'getOrgTree',
      'searchPhoneAudio',
      'getDisId',
      'getAudioStrmInfo',
      'deletePhoneAudio'
    ]),
    // 是否显示音量调节
    AdjustVolume() {
      let videoObj = this.$refs.videoObj
      this.voiceState.isVolume = !this.voiceState.isVolume
      if (this.voiceState.isVolume) {
        videoObj.StopPlayerSound()
      } else {
        videoObj.OpenPlayerSound()
      }
    },
    // 时间格式转换
    formatTime(time) {
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
    },
    // 将秒转换成时分秒
    formatSecToTime(s) {
      let t
      if (s > -1) {
        var hour = Math.floor(s / 3600)
        var min = Math.floor(s / 60) % 60
        var sec = s % 60
        if (hour < 10) {
          t = '0' + hour + ':'
        } else {
          t = hour + ':'
        }
        if (min < 10) {
          t += '0'
        }
        t += min + ':'
        if (sec < 10) {
          t += '0'
        }
        t += sec.toFixed(0)
      }
      return t
    },
    // 获取广播开流信息
    async getAudioStrm(param) {
      let strm = ''
      let params = {
        keyName: param.webName,
        dsId: this.dsId,
        startTime: Math.floor(param.startTime / 1000),
        endTime: Math.floor(param.endTime / 1000),
        talkMode: 2,
        page: this.pageInfo.cur,
        rows: this.pageLimit
      }
      await this.getAudioStrmInfo(params).then(res => {
        strm = res
      })
      return strm
    },
    // 关闭弹窗
    closeSingleVideo() {
      this.videoModal = false
      this.StopAudio()
      this.audioProgress = 0
      this.playProgress = '00:00:00'
    },
    // 变更检索时间
    changeSearchStime(time) {
      if (time) {
        this.searchData.startTime = Date.parse(time)
      } else {
        this.searchData.startTime = ''
      }
    },
    changeSearchEtime(time) {
      if (time) {
        this.searchData.endTime = Date.parse(time)
      } else {
        this.searchData.endTime = ''
      }
    },
    // 根据条件检索任务
    searchTask() {
      if (this.searchData.startTime > this.searchData.endTime) {
        this.$Notice.warning({
          title: '开始时间不能大于结束时间'
        })
      } else {
        let param = {
          webName: this.searchData.taskTitle,
          oid: this.orgTreeData[0]._id,
          startTime: this.searchData.startTime,
          endTime: this.searchData.endTime,
          page: this.pageInfo.cur,
          limit: this.pageLimit
        }
        this.searchPhoneAudio(param)
      }
    },
    selectTask(selection) {
      this.selectTaskList = selection
    },
    // 刷新页面
    refresh() {
      this.searchData.taskTitle = ''
      this.$refs.startTime.handleClear()
      this.$refs.endTime.handleClear()
      let param = {
        oid: this.orgTreeData[0]._id,
        startTime: 0,
        endTime: Date.parse(new Date()),
        page: this.pageInfo.cur,
        limit: this.pageLimit
      }
      this.searchPhoneAudio(param)
    },
    // 批量导出
    exports() {
      if (this.selectTaskList.length > 0) {
        let videoObj = this.$refs.videoObj
        let path = this.getPath()
        // const videoType = this.parameters.downloadAudioType.toLowerCase()
        if (path === undefined) {
          return
        }
        this.selectTaskList.map((item, index) => {
          let videoName = this.$moment(new Date()).format('YYYYMMDDHHmmss') + index + '.aac'
          this.getAudioStrm(item).then(res => {
            let strmData = {}
            let eventLen = res.data.eventList.length
            if (eventLen > 1) {
              strmData = res.data.eventList[eventLen - 1]
            } else if (eventLen > 0 && eventLen <= 1) {
              strmData = res.data.eventList[0]
            } else {
              return
            }
            let param = {
              startTime: strmData.evtTblInfo.startTime,
              endTime: strmData.evtTblInfo.endTime,
              strmInfo: strmData.strmInfo,
              dsIp: res.data.dsIp,
              path: path + '\\' + videoName.toString()
            }
            let objresult = playBack.download(videoObj, param)
            if (objresult === -1) {
              this.$Notice.warning({ desc: '下载失败', title: '警告' })
            } else {
              this.$Notice.warning({ title: '提示', desc: `广播开始下载，下载路径为${path}` })
            }
          }).catch(err => {
            console.log('下载错误', err)
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
    // 接听音频对讲
    audioIntercom(data) {
      this.getAudioStrm(data.row).then(res => {
        if (res.data === 'no data.') {
          this.$Notice.warning({ title: '警告', desc: '未查询到广播' })
          return false
        }
        let eventLen = res.data.eventList.length
        if (eventLen > 1) {
          this.videoModal = true
          this.audioInfo = res.data.eventList[eventLen - 1]
          this.dsIp = res.data.dsIp
          this.PlayAudio(res.data.eventList[eventLen - 1].evtTblInfo.startTime, res.data.eventList[eventLen - 1].evtTblInfo.endTime)
        } else if (eventLen > 0 && eventLen <= 1) {
          this.videoModal = true
          this.audioInfo = res.data.eventList[0]
          this.dsIp = res.data.dsIp
          this.PlayAudio(res.data.eventList[0].evtTblInfo.startTime, res.data.eventList[0].evtTblInfo.endTime)
        } else {
          this.$Notice.warning({ title: '警告', desc: '未查询到广播' })
          return false
        }
      })
    },
    // 删除音频对讲
    deleteAudio(param) {
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>确认删除广播对讲吗?</p>',
        loading: true,
        onOk: () => {
          this.deletePhoneAudio({id: param.row._id}).then(res => {
            if (res.status === 200) {
              let param = {
                oid: this.orgTreeData[0]._id,
                startTime: 0,
                endTime: Date.parse(new Date()),
                page: this.pageInfo.cur,
                limit: this.pageLimit
              }
              this.searchPhoneAudio(param)
            }
          })
        }
      })
    },
    // 音频开始播放
    PlayAudio(startTime, endTime) {
      this.voiceState.isPlay = true
      let videoObj = this.$refs.videoObj
      let param = {
        startTime: startTime,
        endTime: endTime,
        strmInfo: this.audioInfo.strmInfo,
        dsIp: this.dsIp
      }
      playBack.open(videoObj, param)
      // 获取音频长度
      let videoTime = JSON.parse(videoObj.GetRecordPlayerTime())
      if (videoTime.success) {
        this.currentStartTime = videoTime.msBegin / 1000
        this.currentEndTime = videoTime.msEnd / 1000
        // 音频时间长度
        this.duration = parseInt(this.currentEndTime - this.currentStartTime)
        // 音频长度换算为播放时间
        this.playTime = this.formatSecToTime(this.duration)
      }
      // 自动打开伴音
      videoObj.OpenPlayerSound()
      this.voiceState.isVolume = false
      // 设置默认音量
      videoObj.SetPlayerVolume(50)
      let volumeInfo = JSON.parse(videoObj.GetPlayerVolume())
      if (volumeInfo.success) {
        this.volume = volumeInfo.Volume
      }
      // 设置进度条
      this.SetProgress()
    },
    // 设置进度条
    SetProgress() {
      let videoObj = this.$refs.videoObj
      let _this = this
      this.playTimer = setInterval(function() {
        let playCurTime = JSON.parse(videoObj.GetSpeechPlayerCurTime())
        console.log(playCurTime)
        if (playCurTime.success) {
          // 播放时长每秒变化
          _this.playProgress = _this.formatSecToTime(playCurTime.msCur / 1000 - _this.currentStartTime)
          // 进度条每移动1%时所占播放时长
          let sliderCompany = _this.duration / 100
          // 设置播放进度条的每秒变化
          _this.audioProgress = (playCurTime.msCur / 1000 - _this.currentStartTime) / sliderCompany
          if (parseInt((playCurTime.msCur / 1000 - _this.currentStartTime).toFixed(0)) > parseInt(_this.duration.toFixed(0))) {
            _this.StopPlay()
          }
        }
      }, 1000)
    },
    clearTimer() {
      clearInterval(this.playTimer)
    },
    // 播放或暂停
    PlayorPause() {
      let videoObj = this.$refs.videoObj
      if (this.isStop) {
        this.PlayAudio(this.audioInfo.evtTblInfo.startTime, this.audioInfo.evtTblInfo.endTime)
        this.isStop = false
      } else {
        if (!this.voiceState.isPlay) {
          this.voiceState.isPlay = true
          playBack.resume(videoObj)
          // 设置播放进度条的每秒变化
          this.SetProgress()
        } else {
          this.voiceState.isPlay = false
          playBack.pause(videoObj)
          this.clearTimer()
        }
      }
    },
    // 点击停止播放
    StopPlay() {
      this.audioProgress = 0
      this.isStop = true
      this.playProgress = '00:00:00'
      this.StopAudio()
    },
    // 音频停止播放
    StopAudio() {
      this.clearTimer()
      let videoObj = this.$refs.videoObj
      playBack.stop(videoObj)
      this.voiceState.isPlay = false
    },
    // 下载音频
    DownloadAudio(downloadInfo) {
      let videoObj = this.$refs.videoObj
      let path = this.getPath()
      // const videoType = this.parameters.downloadAudioType.toLowerCase()
      let videoName = this.$moment(new Date()).format('YYYYMMDDHHmmss') + '.aac'
      let pathName = path + '\\' + videoName.toString()
      if (path === undefined) {
        return
      }
      let param = {
        startTime: downloadInfo.evtTblInfo.startTime,
        endTime: downloadInfo.evtTblInfo.endTime,
        strmInfo: downloadInfo.strmInfo,
        dsIp: this.dsIp,
        path: pathName
      }
      let objresult = playBack.download(videoObj, param)
      if (objresult === -1) {
        this.$Notice.warning({ desc: '下载失败', title: '警告' })
      } else {
        this.$Notice.warning({ title: '提示', desc: `广播开始下载，下载路径为${pathName}` })
      }
    },
    // 设置音频进度
    setAudioProgress(v) {
      // 进度条每移动1%时所占播放时长
      let sliderCompany = this.duration / 100
      // 根据进度条位置算目前播放开始时间
      let playStarTime = this.currentStartTime + sliderCompany * v
      // 获取当前开始时间对应的音频播放时长
      this.playProgress = this.formatSecToTime(sliderCompany * v)
      this.StopAudio()
      let videoObj = this.$refs.videoObj
      let param = {
        startTime: playStarTime,
        endTime: this.currentEndTime,
        strmInfo: this.audioInfo.strmInfo,
        dsIp: this.dsIp
      }
      playBack.open(videoObj, param)
      // 设置播放进度条的每秒变化
      this.SetProgress()
      this.voiceState.isPlay = true
    },
    // 设置音量
    setVolume(v) {
      let videoObj = this.$refs.videoObj
      videoObj.SetPlayerVolume(v)
    },
    // 获取第N页数据
    changePage(n) {
      let param = {
        webName: this.searchData.taskTitle,
        oid: this.orgTreeData[0]._id,
        startTime: this.searchData.startTime,
        endTime: this.searchData.endTime,
        page: parseInt(n),
        limit: this.pageLimit
      }
      this.searchPhoneAudio(param)
    },
    pageSizeChange(n) {
      this.pageLimit = n
      let param = {
        webName: this.searchData.taskTitle,
        oid: this.orgTreeData[0]._id,
        startTime: this.searchData.startTime,
        endTime: this.searchData.endTime,
        page: this.pageInfo.cur,
        limit: parseInt(n)
      }
      this.searchPhoneAudio(param)
    }
  },
  beforeDestroy() {
    this.clearTimer()
  }
}
</script>

<style lang="less"  scoped>
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
