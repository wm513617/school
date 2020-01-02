<template>
  <!-- 事件追踪 -->
  <div class="track-content">
    <!--  头部  -->
    <div class="header-box">
      <Button icon="plus" @click="openAddMod" >新建</Button>
      <Button icon="edit" @click="openEditMod" >修改</Button>
      <Button icon="trash-a" @click="delBtn" >删除</Button>
      <Button icon="refresh" @click="refresh">刷新</Button>
      <Button icon="cloud" @click="saveEvent" :disabled="againVideo">保存事件</Button>
      <Button icon="power" @click="closeBtn">结束追踪</Button>
      <Button icon="archive" @click="exportFiles" :disabled="!ids.length">导出</Button>
      <div style="float:right;">
        <Input v-model="seek" placeholder="请输入追踪事件名称、追踪镜头、关联事件编号" style="width: 280px;" />
        <DatePicker type="datetime" style="width: 200px" :options="dateLimit" v-model="startTime" :editable="false" :clearable="false"></DatePicker>
        <b>至</b>
        <DatePicker type="datetime" style="width: 200px" :options="dateLimit" v-model="endTime" :editable="false" :clearable="false"></DatePicker>
        <Button icon="ios-search" @click="search" style="margin-left:24px;">搜索</Button>
      </div>
    </div>
    <!--  表格部分  -->
    <div class="center-box">
      <div class="table-body">
        <Table size="small" :columns="receiveTitle" :data="receiveData" :height="tableHeight" @on-selection-change="receiveInSel"></Table>
      </div>
    </div>
    <!--  尾部分页  -->
    <div class="table-footer" style="text-align:right;">
      <Page show-sizer show-elevator show-total :page-size-opts="$PageInfo.size" :total="pageInfo.count" :page-size="pageInfo.limit" :current="pageInfo.cur" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
    </div>

    <!--  新建  -->
    <newlyBuild v-if="openModal" :openModal="openModal" :status="newlyBuildStatus" @openmodal="cancel" :buildList="buildList"></newlyBuild>
    <!--  追踪结果  -->
    <trinkingResults v-if="openModal2" :openModal2="openModal2" @openmoda2="cance2" :resultsList="resultsList"></trinkingResults>
    <!--  追踪详情  -->
    <trinkingDetail v-if="openModal3" :openModal3="openModal3" @openmoda3="cance3" :detailList="detailList"></trinkingDetail>
  </div>
</template>

<script>
import newlyBuild from './newlyBuild/newlyBuild'
import trinkingResults from './newlyBuild/trinkingResults'
import trinkingDetail from './newlyBuild/trinkingDetail'
import {
  delectTracking,
  getTrackingxg,
  putTracking,
  getTrackingList,
  getRemotedownload
} from '@src/http/business/tracking.api'
import { download } from '@src/common/download.js'
import { gudgingDown } from '@src/http/business/caseProcessing.api.js'
export default {
  name: 'trackingChildren',
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
            if (!params.row.mapList || (params.row.mapList && params.row.mapList.length === 0)) {
              str = '暂无数据'
            } else {
              params.row.mapList.forEach(item => {
                str += item.resource.name + '  '
              })
            }
            return h('span', {
              style: {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              },
              domProps: { title: str }
            }, str)
          }
        },
        { title: '追踪开始时间',
          key: 'startTime',
          minWidth: 150,
          align: 'center',
          render: (h, params) => {
            let text = params.row.startTime ? this.$moment(params.row.startTime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''
            return h('span', text)
          } },
        { title: '追踪结束时间',
          key: 'endTime',
          minWidth: 150,
          align: 'center',
          render: (h, params) => {
            let text = params.row.endTime ? this.$moment(params.row.endTime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''
            return h('span', text)
          } },
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
          minWidth: 120,
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
                  style: {
                    marginRight: '10px'
                  },
                  on: {
                    click: () => {
                      this.receivedispose(params.index, params.row)
                    }
                  }
                },
                '追踪详情'
              ),
              h(
                'Button',
                {
                  props: {
                    size: 'small',
                    disabled: !this.$BShasPower('BS-BUSINESS-RECEIVE-CONFG')
                  },
                  on: {
                    click: () => {
                      this.showmessage(params.index, params.row)
                    }
                  }
                },
                '追踪结果'
              )
            ])
          }
        }
      ],
      receiveData: [],
      Inselect: [],
      openModal: false, // 弹框配置
      openModal2: false, // 追踪弹框
      openModal3: false, // 追踪详情
      detailobj: {}, // 详情数据保存
      newlyBuildStatus: true, // 新建/修改弹窗状态 新建：true；修改：false
      ids: [],
      resultsList: {}, // 追踪结果 data
      detailList: {}, // 追踪详情 data
      buildList: {}, // 修改弹窗 data
      againVideo: true // 是否禁用 保存案件
    }
  },
  created() {
    this.getTableList()
  },
  mounted() {
    // 配置表格高度
    const el = this.$el.querySelector('.center-box')
    this.tableHeight = el.offsetHeight
  },
  methods: {
    // 获取列表
    getTableList() {
      const param = {
        limit: this.pageInfo.limit,
        page: this.pageInfo.cur,
        close: 1
      }
      this.getTrackingList(param)
    },
    // 新建
    openAddMod() {
      this.openModal = true
      this.newlyBuildStatus = true
    },
    // 修改
    openEditMod() {
      if (this.ids.length === 1) {
        this.openModal = true
        this.newlyBuildStatus = false
        getTrackingxg(this.ids[0])
          .then(res => {
            this.buildList = this.$lodash.cloneDeep(res.data)
          })
          .catch(err => {
            console.log(err)
            this.$Notice.warning({ title: '警告', desc: '获取详情失败，请稍后重试' })
          })
      } else if (this.ids.length < 1) {
        this.$Notice.warning({ title: '警告', desc: '请选择一个案件' })
      } else {
        this.$Notice.warning({ title: '警告', desc: '请最多选择一个案件' })
      }
    },
    // 新建修改弹框
    cancel(row) {
      this.openModal = false
    },
    // 追踪结果
    cance2(row) {
      this.openModal2 = false
      this.resultsList = {}
    },
    // 追踪详情
    cance3(row) {
      this.openModal3 = false
      this.detailList = {}
    },
    // 删除
    delBtn() {
      if (this.ids.length > 0) {
        this.$Modal.confirm({
          title: '确认删除',
          content: '<p>删除事件后，事件的追踪记录也会删除。请确认是否删除选中的事件？</p>',
          onOk: () => {
            delectTracking(this.ids).then(res => {
              if (res.statusText === 'OK') {
                this.$Notice.success({ title: '成功', desc: '删除成功' })
                this.getTableList()
              }
            })
          },
          onCancel: () => {
            this.$Message.info('已取消')
          }
        })
      } else {
        this.$Notice.warning({ title: '警告', desc: '请选择案件' })
      }
    },
    // 刷新
    refresh() {
      this.startTime = new Date(new Date().setHours(0, 0, 0, 0))
      this.endTime = new Date()
      this.seek = ''
      this.getTableList()
    },
    // 结束追踪
    closeBtn() {
      let obj = {
        close: true
      }
      if (this.ids.length === 1) {
        putTracking(this.ids, obj)
          .then(res => {
            this.getTableList()
          })
          .catch(err => {
            console.log(err)
            this.$Notice.warning({ title: '井盖', desc: '事件结束失败，请稍后重试' })
          })
      } else if (this.ids.length < 1) {
        this.$Notice.warning({ title: '警告', desc: '请选择一个案件' })
      } else {
        this.$Notice.warning({ title: '警告', desc: '请最多选择一个案件' })
      }
    },
    // 搜索
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
        close: 1
      }
      this.getTrackingList(data)
    },
    // 表格获取点击行信息
    receiveInSel(item, row) {
      this.ids = []
      item.forEach(item => {
        this.ids.push(item._id)
      })
      // 一次仅能保存一个事件
      if (item.length === 1) {
        this.againVideo = false
      } else {
        this.againVideo = true
      }
    },
    // 追踪详情
    receivedispose(item, row) {
      this.openModal3 = true
      getTrackingxg(row._id)
        .then(res => {
          this.detailList = this.$lodash.cloneDeep(res.data)
        })
        .catch(err => {
          console.log(err)
          this.$Notice.warning({ title: '警告', desc: '获取详情失败，请稍后重试' })
        })
    },
    // 追踪结果
    showmessage(item, value) {
      this.openModal2 = true
      getTrackingxg(value._id)
        .then(res => {
          this.resultsList = this.$lodash.cloneDeep(res.data)
        })
        .catch(err => {
          console.log(err)
          this.$Notice.warning({ title: '警告', desc: '获取详情失败，请稍后重试' })
        })
    },
    // 底部分页事件
    pageChange(n) {
      this.pageInfo.cur = n
      this.getTableList()
    },
    pageSizeChange(n) {
      this.pageInfo.limit = n
      this.getTableList()
    },
    // 保存事件到服务器上
    saveEvent() {
      if (this.againVideo) { return }
      gudgingDown()
        .then(res => {
          // 判断当前下载线程是否在占用
          if (res.data) { // 未被占用
            this.getRemotedownload()
          } else {
            this.$Modal.confirm({
              title: '事件备份确认',
              content: '<p style="font-size:14px;padding-bottom:5px;">服务器正在备份其他事件</p><p style="font-size:14px;padding-bottom:5px;">若<span style="color: #ed3f14;font-size:14px;"> 确定 </span>备份当前事件</p><p style="font-size:14px;padding-bottom:5px;">服务器将取消正在备份事件</p>',
              onOk: () => {
                this.getRemotedownload()
              },
              onCancel: () => { }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getRemotedownload() {
      getRemotedownload(this.ids[0])
        .then(res => {
          this.successMsg('开始保存该事件')
        })
        .catch(err => {
          console.log(err)
          this.errorMsg('保存事件失败，请稍后重试')
        })
    },
    getTrackingList(data) { // 封装获取列表
      getTrackingList(data)
        .then(res => {
          this.receiveData = []
          res.data.results.map(item => {
            if (item.close === false) {
              this.receiveData.push(item)
            }
          })
          this.pageInfo.count = parseFloat(res.headers['x-bsc-count'])
        })
        .catch(err => {
          console.log(err)
          this.$Notice.warning({ title: '请求结果', desc: '追踪事件列表请求错误，请重新尝试' })
        })
    },
    // 导出
    exportFiles() {
      if (!this.ids.length) { return }
      let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/business/tracking/exportTracking/zip?trackingIds=${this.ids.join()}`
      let name = `${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.zip`
      download(url, name, () => {}, () => { this.errorMsg('导出文件下载失败！') })
    }
  },
  components: {
    newlyBuild,
    trinkingResults,
    trinkingDetail
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
  padding: 0 24px;
  height: 30px;
  line-height: 30px;
  > button {
    margin-right: 15px;
  }
}
.center-box {
  position: relative;
  height: ~'calc(100% - 82px)';
  margin-top: 12px;
  width: 100%;
}
</style>
