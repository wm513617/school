<template>
  <!-- 历史追踪 -->
  <div class="track-content">
    <!--  头部  -->
    <div class="header-box">
      <Input v-model="seek" placeholder="请输入追踪事件名称、追踪镜头、关联事件编号" style="width: 280px;" />
      <DatePicker type="datetime" style="width: 200px" :options="dateLimit" v-model="startTime" :editable="false" :clearable="false" ></DatePicker>
      <b>至</b>
      <DatePicker type="datetime" style="width: 200px" :options="dateLimit" v-model="endTime" :editable="false" :clearable="false" ></DatePicker>
      <Button icon="search" @click="search">搜索</Button>
      <Button icon="android-download" @click="downloading" :disabled="disBtn">下载案件</Button>
      <Button icon="trash-a" @click="deletEvent">删除录像</Button>
      <Button icon="archive" @click="exportFiles" :disabled="!selEventData.length">导出</Button>
      <span class="memory" :style="memoryColor">录像存储空间： {{ memory.surplus || 0 }}GB / {{ memory.sum || 0 }}GB</span>
    </div>
    <!--  表格部分  -->
    <div class="center-box">
      <div class="table-body">
        <Table size="small" :columns="receiveTitle" :data="receiveData" :height="tableHeight" @on-selection-change="selectEvent" ></Table>
      </div>
    </div>
    <!--  尾部分页  -->
    <div class="table-footer" style="text-align:right;">
      <Page show-sizer show-elevator show-total :page-size-opts="$PageInfo.size" :total="pageInfo.count" :page-size="pageInfo.limit" :current="pageInfo.cur" @on-change="pageChange" @on-page-size-change="pageSizeChange" ></Page>
    </div>
    <!--  详情  -->
    <historyDetail v-if="openModal" :openModal="openModal" :formData="formData" @openmodal="cancel" ></historyDetail>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import historyDetail from './historyDetail'
import { download } from '@src/common/download.js'
import { getTrackingxg, getTrackingList, getMemory, getExportZip, deleteVideo } from '@src/http/business/tracking.api'
export default {
  name: 'historyChildren',
  data() {
    return {
      // 分页
      pageInfo: {
        cur: 1,
        count: 0,
        limit: 25
      },
      // 时间选择设置
      dateLimit: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      },
      seek: '', // 搜索框内容
      startTime: new Date(new Date().setHours(0, 0, 0, 0)),
      endTime: new Date(), // 开始和结束时间
      tableHeight: 500, // 表格相关配置
      receiveTitle: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '追踪事件名称',
          key: 'name',
          align: 'center',
          minWidth: 150
        },
        {
          title: '追踪镜头',
          key: 'resourceList',
          align: 'center',
          minWidth: 270,
          render: (h, params) => {
            let str = ''
            if (!params.row.mapList && params.row.mapList.length === 0) {
              str = '暂无数据'
            } else {
              params.row.mapList.forEach(item => {
                str += item.resource.name + '  '
              })
            }
            return h(
              'span',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: str
                }
              },
              str
            )
          }
        },
        {
          title: '追踪开始时间',
          key: 'startTime',
          minWidth: 150,
          align: 'center',
          render: (h, params) => {
            let text = params.row.startTime ? this.$moment(params.row.startTime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''
            return h('span', text)
          }
        },
        {
          title: '追踪结束时间',
          key: 'endTime',
          minWidth: 150,
          align: 'center',
          render: (h, params) => {
            let text = params.row.endTime ? this.$moment(params.row.endTime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''
            return h('span', text)
          }
        },
        {
          title: '关联事件编号',
          key: 'eventId',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            let name = ''
            if (params.row.eventId) {
              name = params.row.eventId.eventCode
            }
            return h('span', name)
          }
        },
        {
          title: '追踪状态',
          key: 'catchState',
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            let close = params.row.close === false ? '追踪中' : '已结束'
            return h(
              'span',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: close
                }
              },
              close
            )
          }
        },
        {
          title: '详情',
          key: 'config',
          minWidth: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    size: 'small',
                    disabled: !this.$BShasPower('BS-BUSINESS-RECEIVE-CONFG')
                  },
                  on: {
                    click: () => {
                      this.receivedispose(params.index, params.row)
                    }
                  }
                },
                '详情'
              )
            ])
          }
        }
      ],
      receiveData: [],
      Inselect: [],
      openModal: false, // 弹框配置
      titleBarText: '',
      memory: {}, // 空间大小 相关参数
      memoryColor: '', // 空间大小颜色
      selEventData: [],
      formData: {}, // 传给 详情 参数
      disBtn: true // 是否禁用【案件下载】按钮

    }
  },
  computed: {
    ...mapState({
      parameters: ({ platform }) => platform.parameters
    })
  },
  mounted() {
    this.getTableList()
    this.getMemory()
    const el = this.$el.querySelector('.center-box')
    this.tableHeight = el.offsetHeight
  },
  methods: {
    ...mapActions(['getVideoConf']),
    // 获取列表
    getTableList() {
      const param = {
        limit: this.pageInfo.limit,
        page: this.pageInfo.cur,
        close: 2
      }
      this.receiveData = []
      this.getTrackingList(param)
    },
    // 获取内存大小
    getMemory() {
      getMemory() // 内存容量接口
        .then(res => {
          this.memory = res.data
          if (res.data.percentage >= '90%') {
            this.memoryColor = 'color:red'
          } else if (res.data.percentage >= '80%') {
            this.memoryColor = 'color:yellow'
          } else {
            this.memoryColor = 'color:lawngreen'
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 下载事件
    downloading() {
      if (this.disBtn) { return }
      getExportZip(`${this.selEventData[0]._id}?type=find`)
        .then(res => {
          if (res.data.code === 200) {
            let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/business/tracking/exportZip/${this.selEventData[0]._id}`
            window.open(url)
          } else {
            this.errorMsg('未找到备份文件')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 搜索事件
    search() {
      if (Date.parse(this.startTime) > Date.parse(this.endTime)) {
        this.$Notice.warning({ title: '失败', desc: '开始时间不能大于结束时间，请重新输入' })
        return
      }
      let data = {
        startTime: Math.floor(Date.parse(this.startTime) / 1000),
        endTime: Math.floor(Date.parse(this.endTime) / 1000),
        seek: this.seek,
        limit: this.pageInfo.limit,
        page: this.pageInfo.cur,
        close: 2
      }
      this.getTrackingList(data)
    },
    // 底部分页事件
    pageChange(n) {
      this.pageInfo.cur = n
    },
    pageSizeChange(n) {
      this.pageInfo.limit = n
    },
    // 表格获取点击行信息
    selectEvent(item) {
      this.selEventData = item
      if (item.length === 1) {
        this.disBtn = false
      } else {
        this.disBtn = true
      }
    },
    // 详情弹框
    receivedispose(item, row) {
      this.openModal = true
      getTrackingxg(row._id)
        .then(res => {
          this.formData = this.$lodash.cloneDeep(res.data)
        })
        .catch(err => {
          console.log(err)
          this.$Notice.warning({ title: '警告', desc: '详情获取失败，请稍后重试' })
        })
    },
    cancel(row) {
      this.openModal = row
      this.formData = {}
    },
    // 删除录像
    deletEvent() {
      if (this.selEventData.length) {
        this.$Modal.confirm({
          title: '确认删除',
          content: '<p>是否确认删除该条数据录像</p>',
          onOk: () => {
            let _d = []
            this.selEventData.map(e => {
              _d.push(deleteVideo(e._id))
            })
            Promise.all(_d)
              .then(res => {
                this.$Notice.success({ title: '成功', desc: '删除成功' })
                this.getTableList()
              })
              .catch(err => {
                console.log(err)
                this.$Notice.warning({ title: '警告', desc: '删除失败' })
              })
          },
          onCancel: () => {}
        })
      } else {
        this.$Notice.warning({ title: '警告', desc: '请选择一个案件' })
      }
    },
    getTrackingList(data) { // 封装 获取列表
      getTrackingList(data)
        .then(res => {
          this.receiveData = []
          res.data.results.forEach(item => {
            if (item.close === true) {
              this.receiveData.push(item)
            }
          })
          this.pageInfo.count = parseFloat(res.headers['x-bsc-count'])
        })
        .catch(err => {
          console.log(err)
          this.$Notice.warning({ title: '警告', desc: '追踪事件列表请求错误，请重新尝试' })
        })
    },
    // 导出
    exportFiles() {
      if (!this.selEventData.length) { return }
      let _data = []
      this.selEventData.map(e => _data.push(e._id))
      let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/business/tracking/exportTracking/zip?trackingIds=${_data.join()}`
      let name = `${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.zip`
      download(url, name, () => {}, () => { this.errorMsg('导出文件下载失败！') })
    }
  },
  components: {
    historyDetail
  }
}
</script>

<style scoped lang="less">
.track-content {
  background: #1c3053;
  height: 100%;
  width: 100%;
}
.header-box {
  width: 100%;
  flex: 0 0 30px;
  padding: 0 24px;
  height: 30px;
  line-height: 30px;
  > button {
    margin-left: 15px;
  }
}
.center-box {
  position: relative;
  height: ~'calc(100% - 82px)';
  margin-top: 12px;
  width: 100%;
}
.memory {
  float: right;
  padding-right: 15px;
  padding-top: 5px;
  font-size: 14px;
}
</style>
