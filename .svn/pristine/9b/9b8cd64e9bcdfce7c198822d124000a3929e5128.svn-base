<template>
  <!-- 案件管理 -->
  <div class="bs-content manage">
    <!-- 左侧导航栏 -->
    <div class="bs-left">
      <div class="sidebar">
        <ul class="config-list">
          <li style="list-style:none;" v-for="(config,index) in sideBarList" :key="index" :class="{active: config.isActive}" @click="sideBarActive(config)">{{config.name}}</li>
        </ul>
      </div>
    </div>
    <!-- 右侧列表 -->
    <div class="bs-mains">
      <!-- 实时案件 -->
      <div class="haha" v-if="sideBarList[0].isActive" style="width:100%;font-size:12px;height:100%;">
        <!-- 按钮栏 -->
        <div class="feature-btn">
          <!--v-if="$BShasPower('BS-BUSINESS-RECEIVE-CONFG')"-->
          <Button icon="plus" @click="openAddMod('新建案件')" >新建</Button>
          <Button icon="edit" @click="openEditMod('修改案件')" >修改</Button>
          <Button icon="trash-a" @click="delBtn" >删除</Button>
          <Button icon="refresh" @click="refresh">刷新</Button>
          <Button icon="cloud" @click="againKeep" :disabled="againVideo">保存案件</Button>
          <Button icon="power" @click="closeBtn">关闭案件</Button>
          <Button icon="printer" @click="printingBtn">打印案件</Button>
          <Button icon="archive" @click="exportFiles" :disabled="!Inselect.length">导出</Button>
          <div style="float:right;">
            <Input v-model="seek" placeholder="请输入案件名称、报警人、学号" clearable style="width: 200px;" />
            <DatePicker :options="options1" type="datetime" style="width: 200px" v-model="startTime" placeholder="请选择开始时间" :editable="false" :clearable="false"></DatePicker>
            <b>至</b>
            <DatePicker :options="options1" type="datetime" style="width: 200px" v-model="endTime" placeholder="请选择结束时间" :editable="false" :clearable="false"></DatePicker>
            <Button icon="ios-search" @click="search" style="margin-left:24px;">搜索</Button>
          </div>
        </div>
        <!-- 表格 -->
        <div class="table-relative">
          <div class="table-body">
            <Table size="small" :columns="receiveTitle" :data="receiveData" :height="tableHeight" @on-selection-change="receiveInSel"></Table>
          </div>
        </div>
        <!-- 分页栏 -->
        <div class="table-footer" style="text-align:right;">
          <Page show-sizer show-elevator show-total :page-size-opts="$PageInfo.size" :total="pageInfo.count" :page-size="pageInfo.limit" :current="pageInfo.cur" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
        </div>
      </div>
      <!-- 历史案件 -->
      <hostory v-if="sideBarList[1].isActive"></hostory>
    </div>

    <!-- 添加 / 修改 -->
    <caseModal :openModal="showAddEditModal" v-if="showAddEditModal" :modalTitle="modalTitle" :formData="eventInfoData"  @cancelModal="cancelModal"></caseModal>
    <!-- 案件详情 -->
    <eventsDelModal :openModal="showEventsModal" v-if="showEventsModal" :formData="eventInfoData" @cancelModal="cancelModal"></eventsDelModal>
    <!-- 案件进展 -->
    <caseProgress :openModal="showCaseModal" v-if="showCaseModal" :formData="eventInfoData" @cancelModal="cancelModal"></caseProgress>
    <!-- 结果详情 -->
    <resultDelModal :openModal="showResultModal" v-if="showResultModal" :formData="eventInfoData" @cancelModal="cancelModal"></resultDelModal>
  </div>
</template>

<script>
import hostory from './historyCaseManagement'
import caseModal from './caseModal'
import eventsDelModal from './eventsDelModal'
import resultDelModal from './resultDelModal'
import caseProgress from './caseProgress'
import {
  getRemotedownload,
  getSearchList,
  deleteCaseManage,
  setCaseAlarmDetails,
  getCaseAlarmDetails,
  gudgingDown
} from '@src/http/business/caseProcessing.api.js'
import { download } from '@src/common/download.js'
export default {
  components: { hostory, caseModal, eventsDelModal, resultDelModal, caseProgress },
  data() {
    return {
      // 导航切换
      sideBarList: [
        {
          name: '实时案件',
          isActive: true,
          roleTabs: 'receive',
          vIf: 'BS-BUSINESS-RECEIVE-PAGE'
        },
        {
          name: '历史案件',
          isActive: false,
          roleTabs: 'history',
          vIf: 'BS-BUSINESS-HISTORY-PAGE'
        }
      ],
      // 表格高度
      tableHeight: 500,
      // 搜索框信息
      seek: '',
      startTime: '',
      endTime: '',
      // 时间选择不能大于当前日期
      options1: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      },
      // 表格相关参数
      receiveTitle: [
        {
          type: 'selection',
          align: 'center',
          width: 60
        },
        {
          title: '案件编号',
          key: 'eventCode',
          align: 'center',
          minWidth: 100
        },
        {
          title: '案件名称',
          key: 'eventName',
          align: 'center',
          minWidth: 250,
          render: (h, params) => {
            return h(
              'span',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.eventName
                }
              },
              params.row.eventName
            )
          }
        },
        {
          title: '报案人',
          key: 'person',
          align: 'center',
          minWidth: 80,
          render: (h, params) => {
            return h(
              'span',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.person
                }
              },
              params.row.person
            )
          }
        },
        {
          title: '学号',
          key: 'studentNum',
          minWidth: 100,
          align: 'center',
          render: (h, params) => {
            return h(
              'span',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.studentNum
                }
              },
              params.row.studentNum
            )
          }
        },
        {
          title: '联系电话',
          key: 'phone',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '登记时间',
          key: 'alarmTime',
          minWidth: 150,
          align: 'center',
          render: (h, params) => {
            let text = params.row.alarmTime
              ? this.$moment(params.row.alarmTime * 1000).format('YYYY-MM-DD HH:mm:ss')
              : ''
            return h('span', text)
          }
        },
        {
          title: '是否调取录像',
          key: 'isRecode',
          minWidth: 80,
          align: 'center',
          render: (h, params) => {
            let name = ''
            if (params.row.isRecode) {
              name = '是'
            } else {
              name = '否'
            }
            return h('span', name)
          }
        },
        {
          title: '录像保存状态',
          key: 'isSave',
          minWidth: 60,
          align: 'center',
          render: (h, params) => {
            let name = ''
            switch (params.row.isSave) {
              case 0:
                name = '未保存'
                break
              case 1:
                name = '保存中'
                break
              case 2:
                name = '保存成功'
                break
              default:
                name = '保存失败'
                break
            }
            return h('span', name)
          }
        },
        {
          title: '详情',
          key: 'config',
          minWidth: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'ghost',
                    size: 'small',
                    disabled: !this.$BShasPower('BS-BUSINESS-RECEIVE-CONFG')
                  },
                  style: {
                    marginRight: '10px'
                  },
                  on: {
                    click: () => {
                      this.receivedispose(params.row)
                    }
                  }
                },
                '案件详情'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'ghost',
                    size: 'small',
                    disabled: !this.$BShasPower('BS-BUSINESS-RECEIVE-CONFG')
                  },
                  style: {
                    marginRight: '10px'
                  },
                  on: {
                    click: () => {
                      this.caseprogress(params.row)
                    }
                  }
                },
                '案件进展'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'ghost',
                    size: 'small',
                    disabled: !this.$BShasPower('BS-BUSINESS-RECEIVE-CONFG')
                  },
                  on: {
                    click: () => {
                      this.showmessage(params.row)
                    }
                  }
                },
                '结果详情'
              )
            ])
          }
        }
      ],
      receiveData: [],
      showAddEditModal: false, // 显示添加或者修改弹窗
      showEventsModal: false, // 显示事件详情弹窗
      showResultModal: false, // 显示结果详情弹窗
      showCaseModal: false, // 案件进展
      modalTitle: '', // 弹框名字
      Inselect: [], // 选择事件长度
      eventInfoData: {}, // 结果详情/案件进展 data
      // 分页
      pageInfo: {
        cur: 1,
        count: 0,
        limit: 25
      },
      againVideo: true // 重新保存案件是否禁用
    }
  },
  mounted() {
    this.getTable()
    // 配置表格高度
    this.$nextTick(() => {
      const el = this.$el.querySelector('.table-relative')
      this.tableHeight = el.offsetHeight
    })
  },
  methods: {
    // 获取列表
    getTable(v) {
      if (Date.parse(this.startTime) > Date.parse(this.endTime)) {
        this.errorMsg('开始时间不能大于结束时间，请重新输入')
        return
      }
      const param = {
        startTime: this.startTime ? Math.floor(Date.parse(this.startTime) / 1000) : '',
        endTime: this.endTime ? Math.floor(Date.parse(this.endTime) / 1000) : '',
        name: this.seek,
        limit: this.pageInfo.limit,
        page: this.pageInfo.cur
        // close: 1
      }
      this.Inselect = []
      getSearchList(param)
        .then(res => {
          this.receiveData = res.data
          this.pageInfo.count = parseFloat(res.headers['x-bsc-count'])
          if (v) {
            this.successMsg(v + '成功')
          }
        })
        .catch(err => {
          console.log(err)
          if (v) {
            this.errorMsg(v + '失败')
          } else {
            this.errorMsg('获取案件管理列表失败')
          }
        })
    },
    // 搜索
    search() {
      this.getTable('搜索')
    },
    // 刷新
    refresh() {
      this.seek = ''
      this.startTime = ''
      this.endTime = ''
      this.pageInfo.limit = 25
      this.pageInfo.cur = 1
      this.pageInfo.count = 0
      this.getTable('刷新')
    },
    // 删除
    delBtn() {
      let ids = []
      this.Inselect.map(item => {
        ids.push(item._id)
      })
      if (ids.length > 0) {
        this.$Modal.confirm({
          title: '确认删除',
          content: '<p>删除案件后，案件的录像文件也会删除。请确认是否删除选中的案件？</p>',
          onOk: () => {
            deleteCaseManage(ids)
              .then(res => {
                this.successMsg('删除成功')
                this.getTable()
              })
              .catch(err => {
                console.log(err)
                this.errorMsg('删除失败')
                this.getTable()
              })
          },
          onCancel: () => {
            this.$Message.info('已取消')
          }
        })
      } else {
        this.warningMsg('请选择案件')
      }
    },
    // 关闭事件
    closeBtn() {
      if (this.Inselect.length !== 1) {
        this.warningMsg('请选择一个案件')
        return
      }
      setCaseAlarmDetails(this.Inselect[0]._id, { close: true })
        .then(res => {
          this.successMsg('关闭成功')
          this.getTable()
        })
        .catch(err => {
          console.log(err)
          this.errorMsg('关闭失败')
          this.getTable()
        })
    },
    // 左侧'实时案件'和'历史案件'TAB切换
    sideBarActive(config) {
      if (config.roleTabs === 'receive') {
        this.sideBarList[0].isActive = true
        this.sideBarList[1].isActive = false
        this.seek = ''
        this.startTime = ''
        this.endTime = ''
        this.pageInfo.limit = 25
        this.pageInfo.cur = 1
        this.pageInfo.count = 0
        this.getTable()
      } else if (config.roleTabs === 'history') {
        this.sideBarList[0].isActive = false
        this.sideBarList[1].isActive = true
      }
    },
    // 新建
    openAddMod(title) {
      this.modalTitle = title
      this.showAddEditModal = true
    },
    // 修改
    openEditMod(title) {
      if (this.Inselect.length < 1) {
        this.warningMsg('请选择一个案件')
      } else if (this.Inselect.length > 1) {
        this.warningMsg('一次只能选择一个案件')
      } else {
        this.getCaseAlarmDetails(this.Inselect[0]._id, '数据获取失败，请稍后尝试')
        this.modalTitle = title
        this.showAddEditModal = true
      }
    },
    // 打印事件
    printingBtn() {
      if (this.Inselect.length === 1) {
        let template = ''
        // debugger
        this.Inselect.forEach(item => {
          template += `<div>
               <div class="print-top">
                 <span>案件信息</span>
               </div>
               <div class="print-box">
                 <div class="print-left">
                   <div><span>事件名称：</span><span>${item.eventName}</span></div>
                   <div><span>报警人：</span><span>${item.person}</span></div>
                   <div><span>性别：</span><span>${item.gender === 2 ? '女' : '男'}</span></div>
                   <div><span>年龄：</span><span>${item.age ? item.age : ''}</span></div>
                   <div><span>民族/国籍：</span><span>${item.nationality}</span></div>
                   <div><span>院系/单位：</span><span>${item.department}</span></div>
                   <div><span>住址：</span><span>${item.address}</span></div>
                   <div><span>联系电话：</span><span>${item.phone}</span></div>
                   <div><span>备注：</span><span>${item.mark}</span></div>
                 </div>
                 <div class="print-right">
                   <div><span>事发地点：</span><span>${item.incidentAddress}</span></div>
                   <div><span>学号：</span><span>${item.studentNum}</span></div>
                   <div><span>身份证号：</span><span>${item.identityNum}</span></div>
                   <div><span>是否调取录像：</span><span>${item.isRecode === true ? '是' : '否'}</span></div>
                   <div><span>案件开始时间：</span><span>${item.startTime ? this.$moment(item.startTime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''}</span></div>
                   <div><span>案件结束时间：</span><span>${item.endTime ? this.$moment(item.endTime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''}</span></div>
                   <div><span>登记时间：</span><span>${item.createTime ? this.$moment(item.createTime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''}</span></div>
                   <div><span style="float:left">事件特征：</span><span style="width: 200px;display: inline-block;word-wrap: break-word;">${item.description}</span></div>
                 </div>
               </div>
             </div>`
        })
        const el = document.createElement('div')
        el.innerHTML = template
        document.body.appendChild(el)
        window.print()
        document.body.removeChild(el)
      } else {
        this.warningMsg('请选择一个案件')
      }
    },
    // 重新保存录像
    againKeep() {
      if (this.againVideo) {
        return
      }
      gudgingDown()
        .then(res => {
          // 判断当前下载线程是否在占用
          if (res.data) {
            // 未被占用
            this.getRemotedownload()
          } else {
            this.$Modal.confirm({
              title: '事件备份确认',
              content:
                '<p style="font-size:14px;padding-bottom:5px;">服务器正在备份其他事件</p><p style="font-size:14px;padding-bottom:5px;">若<span style="color: #ed3f14;font-size:14px;"> 确定 </span>备份当前事件</p><p style="font-size:14px;padding-bottom:5px;">服务器将取消正在备份事件</p>',
              onOk: () => {
                this.getRemotedownload()
              },
              onCancel: () => {}
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 服务器备份
    getRemotedownload() {
      getRemotedownload(this.Inselect[0]._id)
        .then(res => {
          this.successMsg('开始重新保存该案件')
        })
        .catch(err => {
          console.log(err)
          this.errorMsg('重新保存事件失败，请稍后重试')
        })
    },
    // 表格选择框
    receiveInSel(select) {
      this.Inselect = select
      if (this.Inselect.length === 1) {
        this.againVideo = false
      } else {
        this.againVideo = true
      }
    },
    // 案件详情
    receivedispose(value) {
      this.showEventsModal = true
      this.getCaseAlarmDetails(value._id, '案件详情数据获取失败，请稍后尝试')
    },
    // 结果详情
    showmessage(value) {
      this.showResultModal = true
      this.getCaseAlarmDetails(value._id, '结果详情数据获取失败，请稍后尝试')
    },
    // 案件进展
    caseprogress(value) {
      this.showCaseModal = true
      this.getCaseAlarmDetails(value._id, '案件进展数据获取失败，请稍后尝试')
    },
    getCaseAlarmDetails(id, msg) {
      // 封装获取数据
      getCaseAlarmDetails(id)
        .then(res => {
          this.eventInfoData = res.data
        })
        .catch(err => {
          console.log(err)
          this.errorMsg('msg')
        })
    },
    // 关闭弹窗
    cancelModal() {
      this.showAddEditModal = false
      this.showEventsModal = false
      this.showResultModal = false
      this.showCaseModal = false
      this.eventInfoData = {}
      this.getTable()
    },
    // 分页
    pageChange(n) {
      this.pageInfo.cur = n
      this.getTable()
    },
    pageSizeChange(n) {
      this.pageInfo.limit = n
      this.getTable()
    },
    // 导出
    exportFiles() {
      let _data = []
      if (!this.Inselect.length) { return }
      this.Inselect.map(e => _data.push(e._id))
      let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/business/alarm/exportAlarm/zip?alarmEventIds=${_data.join()}`
      let name = `${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.zip`
      download(url, name, () => {}, () => { this.errorMsg('导出文件下载失败！') })
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 100%;
  height: auto;
}
.table-relative {
  position: relative;
  height: calc(100% - 74px);
  margin-top: 12px;
  width: 100%;
}
.config-list li {
  list-style: none;
  position: relative;
  cursor: pointer;
  height: 40px;
  line-height: 39px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  border-right: 2px solid transparent;
  background: #1c3053;
  border-top: 1px solid rgba(58, 90, 139, 0.4);
  /* border-bottom: 1px solid rgba(58, 90, 139, 0.4); */
  padding: 0 0 0 40px;
}
.config-list li:hover {
  background: #2b426b;
  color: #ffffff;
}
.sidebar > .config-list > .active {
  color: #4699f9;
  border-right: 2px solid #4699f9;
  background-color: #2f497a;
  z-index: 2;
}
.bs-content {
  width: 100%;
  position: relative;
  display: flex;
}
.bs-mains {
  flex-grow: 1;
  overflow: hidden;
  width: 100%;
  background: #1c3053;
  min-height: 670px;
  padding: 12px 0 0 0;
}
.haha {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1c3053;
  height: 100%;
}
.feature-btn {
  width: 100%;
  padding: 0 24px;
  height: 30px;
  line-height: 30px;
}
.feature-btn > button {
  margin-right: 15px;
}
</style>
<style lang="less">
@media print {
  #app-main {
    display: none;
  }
}
.print-top {
  width: 100%;
  height: 50px;
  font-size: 18px;
  border-bottom: 1px solid #000;
  span {
    line-height: 50px;
    padding-left: 25px;
  }
}
.print-box {
  margin-top: 25px;
  width: 100%;
  height: 800px;
  border-bottom: 1px solid #000;
  .print-left {
    width: 40%;
    height: 100%;
    float: left;
    div {
      font-size: 16px;
      height: 70px;
    }
  }
  .print-right {
    width: 40%;
    height: 100%;
    float: left;
    div {
      font-size: 16px;
      height: 70px;
    }
  }
}
</style>
