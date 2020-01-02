<template>
  <div class="history-container">
    <div class="history-header">
      <div class="operation-btn">
        <Button type="ghost" @click="downloadData" :disabled="getDisabled()" style="margin-right: 10px;"><i class="iconfont icon-export" style="font-size:12px;"></i>&nbsp;下载</Button>
        <Button type="ghost" @click="deleteData" :disabled="seletedData.length === 0"><i class="iconfont icon-delete" style="font-size:12px;"></i>&nbsp;删除</Button>
      </div>
      <div class="search-btn">
        <BSdateRange :datetime="intercomTime" @timeChange="intercomChange" :width='270' :height='32' style="margin-right: 10px;"></BSdateRange>
        <Input v-model="intercomEquipment" placeholder="请输入对讲设备名称" style="width: 260px; margin-right: 10px;"></Input>
        <Button type="ghost" @click="searchList" style="height: 32px;" :loading="searching"><i v-if="!searching" class="iconfont icon-jiansuozhong" style="font-size:14px;"></i>&nbsp;搜索</Button>
      </div>
    </div>
    <div class="result-box" ref="tableBox">
      <Table :height="tableHeight" @on-selection-change="selectionChange" :columns="dataColumnsBlock" :data="dataListBlock"></Table>
      <div class="pager">
        <Page show-sizer :show-total="true" :page-size="page.pageSize" :show-elevator="true" :total="page.total" :page-size-opts="$PageInfo.size" :current="page.pageCur" @on-change="handlePageChange" @on-page-size-change="handlePageSizeChange"></Page>
      </div>
    </div>
    <detailPage v-if="showDetailPage" @cancelPlayVideo="cancelPlayVideo"></detailPage>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters, mapState, mapActions } from 'vuex'
import { batchDownloadVideoSegments } from 'src/components/videoComponentsNew/playback.js'
import detailPage from './modal/detailPage'
export default {
  components: { detailPage },
  data() {
    const self = this
    return {
      page: {
        pageCur: 1,
        pageSize: 100,
        total: 0
      },
      intercomEquipment: '', // 设备名称
      intercomTime: '', // 对讲时间
      tableHeight: '', // table高度
      searching: false, // 判断是否搜索中，搜索按钮根据结果变换
      showDetailPage: false, // 详情model是否显示
      downloadVideoPath: '', // 下载时弹框选中的本地保存路径
      dataColumnsBlock: [ // 列表表头信息
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '发起端',
          key: 'askName',
          align: 'center'
        },
        {
          title: '发起端IP地址',
          key: 'askIp',
          align: 'center'
        },
        {
          title: '发起端ID号',
          key: 'askId',
          align: 'center'
        },
        {
          title: '接收端',
          key: 'ackName',
          align: 'center'
        },
        {
          title: '接收端IP地址',
          key: 'ackIp',
          align: 'center'
        },
        {
          title: '接收端ID号',
          key: 'ackId',
          align: 'center'
        },
        {
          title: '对讲时间',
          key: 'startTime',
          align: 'center',
          render(h, params) {
            return h('div', {}, self.$moment.unix(params.row.startTime).format('YYYY-MM-DD HH:mm:ss'))
          }
        },
        {
          title: '处理状态',
          key: 'dealState',
          align: 'center',
          render(h, params) {
            return h('div', {}, params.row.dealState === 'open' ? '已接听' : '挂断') // 处理状态,open标识接听，close标识挂断
          }
        },
        {
          title: '操作',
          key: 'address',
          align: 'center',
          render(h, params) {
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
                      self.deleteData(params.row)
                      console.log(params)
                    }
                  }
                },
                '删除'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small',
                    disabled: params.row.dealState === 'close'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      self.downloadData(params.row)
                    }
                  }
                },
                '下载'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small',
                    disabled: params.row.dealState === 'close'
                  },
                  on: {
                    click: () => {
                      self.detailModal(params.row)
                    }
                  }
                },
                '详情'
              )
            ])
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['plugins']), // 插件  此处作用为弹出选择本地路径的弹框
    ...mapState({
      dataListBlock: ({ historyIntercom }) => historyIntercom.dataListBlock, // 对讲列表数据
      seletedData: ({ historyIntercom }) => historyIntercom.seletedData, // 对讲列表中选中的数据
      parameters: ({ platform }) => platform.parameters, // 参数
      downloadNum: ({ historyIntercom }) => historyIntercom.downloadNum, // 下载的最大条数
      currentPlayVideo: ({ historyIntercom }) => historyIntercom.currentPlayVideo,
      backParam: ({ historyIntercom }) => historyIntercom.backParam // 查询完资源数据后组装的数组
    })
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight - 40
  },
  watch: {
  },
  created() {
    this.search()
  },
  methods: {
    ...mapActions(['getVideoConf']),
    ...mapActions('historyIntercom', [
      'setSeletedData', // 存储选中的列表数据
      'setIntercomList', // 存储列表当前显示的数据
      'getHistoryIntercomList', // 获取历史对讲列表数据
      'exportHistoryIntercomDetail', // 下载
      'deleteHistoryIntercomDetail', // 删除
      'setDetailData', // 存储详情数据
      'setCurrentPlayVideo', // 存储当前选中的video
      'getIntercomResource' // 请求资源数据前的参数整理  --- 用该参数查询相关视频
    ]),
    cancelPlayVideo() {
      this.showDetailPage = false
    },
    handlePageChange(page) { // 页码改变操作
      this.page.pageCur = 1
      this.search(false)
    },
    handlePageSizeChange(size) { // 切换每页条数操作
      this.page.pageCur = 1
      this.page.pageSize = size
      this.search(false)
    },
    searchList() { // 页面搜索按钮点击事件
      this.page.pageCur = 1
      this.searching = true
      this.search()
    },
    search(isSearchAll = true) { // 执行搜索  isSearchAll的取值: true(更新总数量) false(不更新总数量)
      this.setIntercomList([])
      const condition = {
        time: this.$moment(this.intercomTime).unix('X') || '',
        name: this.intercomEquipment,
        page: this.page.pageCur,
        limit: this.page.pageSize
      }
      this.getHistoryIntercomList(condition).then(result => {
        this.searching = false
        if (result && result.data && result.data.length) {
          this.setIntercomList(result.data)
          if (isSearchAll) { this.page.total = result.data.length }
        }
      }).catch(err => {
        console.log(err)
        this.searching = false
      })
    },
    intercomChange(val) { // 对讲时间
      this.intercomTime = val.dateTimes
    },
    getPath() { // 弹出对话框    获取本地路径
      const state = JSON.parse(this.plugins.GetFileDirectory('请选择文件'))
      if (state.success) {
        console.log(state.DirName)
        return state.DirName
      } else {
        // this.errorMsg(获取保存位置出错！)
      }
    },
    deleteData(row) { // 删除数据   点击删除按钮后先进入该函数
      const self = this
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除该对讲数据？</p>',
        onOk: () => {
          const deleteList = []
          if (row && row.sender) {
            deleteList.push(row._id)
          } else {
            self.seletedData.forEach((item, index) => {
              deleteList.push(item._id)
            })
          }
          self.deleteHistoryIntercomDetail({ ids: deleteList }).then(result => {
            console.log(result)
            self.search()
            self.successMsg('删除对讲数据成功')
          }).catch(err => {
            console.log(err)
            self.errorMsg('删除对讲数据失败')
          })
        },
        onCancel: () => {}
      })
    },
    downloadData(row) { // 下载数据   点击下载按钮后先进入该函数
      if (!row || !row.sender) {
        const seletedList = _.pullAllBy(this.seletedData, [{senderVideo: '', receverVideo: ''}], function(value) {
          return value.senderVideo || value.receverVideo
        })
        if (seletedList.length > this.downloadNum) {
          this.$Notice.warning({ title: '提示', desc: '下载数量超过最大值10条，请重新选择！' })
          return
        }
      }
      if (!this.$store.getters.plugin.valid) {
        this.$Notice.warning({ title: '警告', desc: '请先下载插件，或当前浏览器不支持插件！' })
        return
      }
      this.getVideoConf() // 同步文件路径
      const downloadVideoPath = this.getPath()
      if (downloadVideoPath) {
        this.downloadVideoPath = downloadVideoPath
        this.getVideoParams(row)
      } else {
        this.$Notice.warning({ title: '提示', desc: '获取文件路径失败，请重新选择文件路径！' })
      }
    },
    detailModal(row) { // 详情    点击删除按钮后先进入该函数
      this.setCurrentPlayVideo('')
      this.showDetailPage = true
      this.setDetailData(row)
    },
    selectionChange(selection) { // 复选框触发事件
      this.setSeletedData(selection)
    },
    getDisabled() { // 判断当前选中的数据中，是否最少包含一条可下载视频的数据，若包含，则返回false，不包含则返回true
      if (this.seletedData && this.seletedData.length) {
        return !_.some(this.seletedData, (value, index) => {
          return value.dealState === 'open'
        })
      }
      return true
    },
    getVideoParams(row) { // 获取选中的视频参数数据
      this.getIntercomResource({ type: 'download', cur: row })
      this.downloadPlaybackVideos()
    },
    downloadPlaybackVideos() { // 下载回放视频
      let param = _.cloneDeep(this.parameters)
      batchDownloadVideoSegments(this.backParam, param, this.downloadVideoPath).then(res => {
        console.log('下载回放视频返回结果：', res)
        let errorNum = 0 // 下载失败数量
        for (const item of res) { // 遍历录像返回结果数据
          if (!item.success) {
            errorNum++
          }
        }
        if (errorNum) {
          let errMsg = '录像下载失败数量：' + errorNum
          this.errorMsg(errMsg)
        } else {
          let successMsg = '录像下载成功，保存位置：' + this.downloadVideoPath
          this.successMsg(successMsg)
        }
      }).catch(err => {
        console.log('下载回放视频失败：', err)
        this.errorMsg('下载回放视频失败')
      })
    }
  },
  beforeDestroy() {
  }
}
</script>

<style scoped>
  .history-container {
    padding: 16px 0;
    width: 100%;
    height: 100%;
    position: relative;
  }
  .history-header {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px 30px;
    background: #1c3053;
  }
  .search-btn {
    display: flex;
  }
  .result-box {
    width: 100%;
    height: calc(100% - 50px);
    position: relative;
    background: #1c3053;
    padding: 0 0 50px 0;
    overflow: hidden;
  }
  .pager {
    position: fixed;
    right: 0;
    bottom: 14px;
    left: 0;
    padding: 0 24px;
    text-align: right;
    background: #244575;
  }
</style>

<style lang="less">
  .ivu-modal-footer {
    display: none;
  }
  .disabled {
    color: hsla(0,0%,100%,.5);
    cursor: not-allowed!important;
  }
</style>
