<template>
  <div class="PersonnelTaffic">
  <div class="headerBar">
    <div style=" display: flex;">
      <div>
          <span>时间选择</span>
          <DatePicker type="datetime" @on-change='selectStart' :value="startTime" format="yyyy-MM-dd HH:mm:ss" placeholder="开始日期" style="width: 218px"></DatePicker>
          <span style="margin:0 10px;">至</span>
          <DatePicker type="datetime" :value="endTime" @on-change='selectEnd' format="yyyy-MM-dd HH:mm:ss" placeholder="结束日期" style="width: 218px"></DatePicker>
      </div>
      <div class="item" style="position:relative">
          <label style="width:60px;text-align:center">位置</label>
          <Select style="width:350px" placeholder="全部"
           filterable  clearable  label-in-value v-model="keyword" :max-tag-placeholder="maxTagPlaceholder"  :max-tag-count="1" multiple  @on-change="checkPosition">
              <Option v-for="(opt, index) in positionList"
                  :value="opt.label"  :key="index">{{ opt.label }}</Option>
            </Select>
        </div>
        <div style="display:flex;">
        <div class="item_2">
          <label style="width:60px;text-align:left;margin-left:10px;">姓名</label>
          <Input v-model="peopleDeviceParmas.name"  placeholder="请输入" style="margin-right:20px;"></Input>
        </div>
        <div class="item_2">
          <label style="width:100px;text-align:left">身份证号码</label>
          <Input v-model="peopleDeviceParmas.code" :maxlength="18"  placeholder="请输入" style="margin-right:20px;"></Input>
        </div>
        <div class="item_2">
          <Button  type="ghost" class="icon-jiansuozhong" :loading="loading" @click="search(true)" style="margin-right:10px;">
            检索
          </Button>
          <Button class="icon-export" @click="exportList" type="ghost">导出</Button>
        </div>
    </div>
    </div>
    <!-- 组织 -->
  </div>
  <!-- <Table border :columns="colAccess" :data="allDataAccess" :height="tableHeight" style="overflow: auto"></Table> -->
  <div class="table-relative" ref="tableBox" >
      <div class="table-body table-cover">
          <Table size="small" :columns="colAccess" :data="allDataAccess" :highlight-row="true" :height="tableHeight" ></Table>
      </div>
  </div>
  <div style="position:fixed;bottom:0;width: 100%;
    background: #244575;padding: 8px;">
    <div style="float: right;">
      <Page show-sizer :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" :total="page.total" :current="pageCur" :page-size="page.pageSize" show-total show-elevator @on-change="changePage"></Page>
    </div>
  </div>
  <!-- <Modal v-model="modal12" draggable scrollable width='50%' title="事件详情">
    <div style="display:flex">
      <div style="width:25%;margin-right:20px;">
        <div style="position:relative">
          <p><span class="iconfont icon-Location"></span>&nbsp;&nbsp;{{rowDataList.devName}}</p>
          <div style="width:110px;height:150px;border:1px solid #ddd;margin-top:10px">
            <img :src="rowDataList.photoUrl" alt="" style="width:100%;height:100%;border:1px solid #ddd;margin-top:10px">
          </div>
          <i class="icon iconfont icon-enlarge" @click="previewImg" style="cursor: pointer;position:absolute;top: 40px;left: 90px;"></i>
          <div style="width:110px;height:150px;border:1px solid #ddd;margin-top:10px;position:absolute;top:25px;left:115px">
            <img :src="rowDataList.livePhotoUrl" alt="" style="width:100%;height:100%;border:1px solid #ddd;margin-top:10px">
          </div>
          <i class="icon iconfont icon-enlarge" @click="previewImg" style="cursor: pointer;position:absolute;top: 40px;left: 205px;"></i>
        </div>
        <div>
        <div class="modalItem">
          <span>时间：</span>
          <span>{{this.$moment(rowDataList.createdTimeMs).format('YYYY-MM-DD HH:mm:ss')}}</span>
        </div>
        <div class="modalItem">
          <span>姓名：</span>
          <span>{{rowDataList.name}}</span>
        </div>
        <div class="modalItem">
          <span>性别：</span>
          <span>{{rowDataList.sex||'--'}}</span>
        </div>
        <div class="modalItem">
          <span>民族：</span>
          <span>{{rowDataList.ethnic}}</span>
        </div>
        <div class="modalItem">
          <span>身份证号：</span>
          <span>{{rowDataList.code}}</span>
        </div>
        <div class="modalItem">
          <span>身份证地址：</span>
          <span>{{rowDataList.address}}</span>
        </div>
        </div>
      </div>
      <div style="height:500px;width:70%" v-show="!isBigImg">
        <playbackP ref='playbackDom' :defaultPane='1' :configuration='configuration'></playbackP>
      </div>
      <div class="bigImgDiv" v-show='isBigImg'>
        <img :src="rowDataList.photoUrl"  alt="" class="preImg">
        <i class="icon iconfont icon-exit-full-screen" @click="previewImg" style="cursor: pointer;position:absolute;bottom: 6px;right: 10px;"></i>
      </div>
    </div>
  </Modal> -->
  <bs-modal v-model="modal12" title="事件详情" :width="'50%'" class="focus" :closable='false' :mask-closable="false"
              @on-ok="focusSave" @on-cancel="focusClose">
      <iframe v-if="modal12"></iframe>
      <div style="position:relative" v-if="rowDataList">
        <div class="model-main" >
          <div class="main-left">
            <div class="row">
              <i class="icon iconfont">&#xe72e;</i>
              <span>{{rowDataList.devName}}</span>
            </div>
            <div class="contrast">
            <div>
              <picturePreview
                              :url="rowDataList.photoUrl"
                              :imgStyle="{
                              width:'100%',
                              height:'100%'
                              }"
                              :isBodyShow="false"
                              @preview_x="isPreviewFuc"

              ></picturePreview>
            </div>
            <div>
              <picturePreview v-if="livePhotoShow"
                              :url="rowDataList.livePhotoUrl"
                              :imgStyle="{
                              width:'100%',
                              height:'100%'
                              }"
                              :isBodyShow="false"
                              @preview_x="isPreviewFuc1"

              ></picturePreview>
            </div>
          </div>
              <div class="row">
              <label for="">时间：</label>
              <span>{{this.$moment(rowDataList.createdTimeMs).format('YYYY-MM-DD HH:mm:ss')}}</span>
            </div>
            <div class="row">
              <label for="">姓名：</label>
              <span>{{rowDataList.name}}</span>
            </div>
            <div class="row">
              <label for="">性别：</label>
              <span>{{rowDataList.sex || '---'}}</span>
            </div>
            <div class="row">
              <label for="">民族:</label>
              <span>{{rowDataList.ethnic}}</span>
            </div>
            <div class="row">
              <label for="">身份证号:</label>
              <span>{{rowDataList.code}}</span>
            </div>
            <div class="row">
              <label for="">身份证地址:</label>
              <span>{{rowDataList.address}}</span>
            </div>
          </div>
          <div class="main-right">
            <div v-show="backVidowShow" style="width: 100%;height:100%;">
              <playbackP :configuration="configuration" :defaultPane='number1'
                               ref="pluginChildrenMonitoring"></playbackP>
            </div>

          </div>
        </div>
      </div>
    </bs-modal>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import picturePreview from '../picturePreview'
import playbackP from '../../../components/videoComponentsNew/playbackPlugin'
import { JSONToExcelConvertor } from '../jsonToExcel'

export default {
  components: {
    picturePreview,
    playbackP
  },
  data() {
    return {
      livePhotoShow: true,
      backVidowShow: true,
      number1: 1,
      positionList: [], // 位置数组
      keyword: '', // 搜索关键字
      tableHeight: 435, // table高度
      peopleDevice: [], // 所有人证机设备
      modal12: false,
      loading: false,
      isBigImg: false, // 是否显示预览
      isDropTree: false,
      isDropZ: false,
      peopleDeviceParmas: {
        pageSize: this.$PageInfo.limit,
        pageNum: 1,
        startTime: 0,
        endTime: 0,
        name: '',
        devName: '',
        code: ''
      },
      page: {
        total: 0,
        current: 1,
        pageSize: this.$PageInfo.limit
      },
      pageCur: 1,
      pageLimit: this.$PageInfo.limit,
      persontype: '3',
      // 视频配置
      configuration: {
        progressBar: {
          totalTime: true
        },
        timeline: false,
        buttos: ['stopAll']
      },
      startTime: this.$moment(new Date(new Date().toLocaleDateString()).getTime()).format('YYYY-MM-DD HH:mm:ss'),
      endTime: this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      colAccess: [
        {
          type: 'index',
          title: '序号',
          width: 100,
          align: 'center'
        },
        {
          title: '时间',
          key: 'createdTimeMs',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('strong', this.$moment(params.row.createdTimeMs).format('YYYY-MM-DD HH:mm:ss'))
            ])
          }
        },
        {
          title: '位置',
          key: 'devName',
          align: 'center'
        },
        {
          title: '姓名',
          key: 'name',
          align: 'center'
        },
        {
          title: '身份证号',
          key: 'code',
          width: 300,
          align: 'center'
        },
        {
          title: '性别',
          key: 'sex',
          align: 'center',
          render: (h, params) => {
            let text = params.row.sex
            return h('div', text)
          }
        },
        {
          title: '民族',
          key: 'ethnic',
          align: 'center'
        },
        {
          title: '查看详情',
          key: 'details',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'ghost',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.getCamera(params.row)
                    }
                  }
                },
                '详情'
              )
            ])
          }
        }
      ],
      rowDataList: {
        validator: '',
        name: '',
        orgName: '',
        type: '',
        uid: '',
        card: '',
        eventTime: '',
        livePhotoUrl: '',
        photoUrl: '',
        sex: '',
        address: {
          name: ''
        }
      }, // 行数据
      allDataAccess: [], // 人证记录总数据
      accessRecords: {
        pageSize: this.$PageInfo.limit,
        pageNum: 1,
        startTime: 0,
        endTime: 0,
        address: {
          type: '',
          arr: []
        },
        validator: [],
        description: '',
        org: '',
        name: '',
        uid: '',
        type: [0, 1]
      }
    }
  },
  computed: {
    backVidowShow_: function() {
      return this.backVidowShow
    }
  },
  watch: {
    persontype: function(val) {
      if (Number(val) === 3) {
        this.accessRecords.type = [0, 1]
      } else {
        this.accessRecords.type = [Number(val)]
      }
    },
    // 位置模糊匹配
    positionList: function(val) {
      if (this.keyword) {
        return this.positionList.filter(value => {
          return value.includes(this.keyword)
        })
      }
    }
  },
  mounted() {
    this.peopleDeviceParmas.startTime = this.$moment(this.startTime).valueOf()
    this.peopleDeviceParmas.endTime = this.$moment(this.endTime).valueOf()
    this.accessRecords.validator = [this.validator]
    this.tableHeight = Number(this.$refs['tableBox'].offsetHeight - 150)
    window.addEventListener('resize', this.resizefun)
    this.getPeopleCardList(this.peopleDeviceParmas)
      .then(res => {
        this.page.total = res.length
        this.allDataAccess = res.list
      })
      .catch(() => {})
  },
  methods: {
    ...mapActions(['getPassgeListData', 'getOrgTree', 'getDoorTreeList', 'exportPDPassage', 'getCameraInfo', 'getPeopleCardList', 'getDevicePeopleAll']),
    selectStart(val) {
      // console.log(val)
      this.startTime = val
    },
    selectEnd(val) {
      this.endTime = val
    },
    pageSizeChange(event) {
      this.peopleDeviceParmas.pageSize = event
      this.getPeopleCardList(this.peopleDeviceParmas)
        .then(res => {
          this.allDataAccess = JSON.parse(JSON.stringify(res.list))
        })
        .catch(() => {})
    },
    // 位置下拉框
    maxTagPlaceholder(num) {
      return '已选' + (num + 1) + '条'
    },
    isPreviewFuc(event) {
      this.backVidowShow = event
      this.livePhotoShow = !this.livePhotoShow
    },
    isPreviewFuc1(event) {
      this.backVidowShow = event
      this.livePhotoShow = true
    },
    resizefun() {
      this.tableHeight = Number(this.$refs['tableBox'].offsetHeight - 150)
    },
    focusSave() {
      this.modal12 = false
      this.rowDataList = ''
      this.livePhotoShow = true
    },
    focusClose() {
      this.modal12 = false
      this.rowDataList = ''
      this.livePhotoShow = true
    },
    // 位置下拉框
    checkPosition(value) {
      console.log(value)
      if (value !== []) {
        this.peopleDevice.forEach(i => {
          value.forEach(item => {
            if (i.label === item.label) {
              this.peopleDeviceParmas.devName = i.label
            }
          })
        })
        console.log(this.peopleDeviceParmas.devName)
      }
    },
    // 预览图片
    previewImg() {
      this.isBigImg = !this.isBigImg
    },
    dropZ() {
      this.isDropZ = true
    },
    closeDropZ() {
      setTimeout(() => {
        this.isDropZ = false
      }, 500)
    },
    filterNode(value, data) {
      if (!value) {
        return true
      }
      return data.label.indexOf(value) !== -1
    },
    // 检索
    search() {
      // 获取人证记录列表
      this.loading = true
      this.peopleDeviceParmas.startTime = this.$moment(this.startTime).valueOf()
      this.peopleDeviceParmas.endTime = this.$moment(this.endTime).valueOf()
      // 获取人证记录列表
      this.getPeopleCardList(this.peopleDeviceParmas)
        .then(res => {
          if (res.code === 200) {
            this.page.total = res.length
            this.allDataAccess = JSON.parse(JSON.stringify(res.list))
            this.loading = false
          } else {
            this.errorMsg('检索失败')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 人证记录列表导出
    exportList() {
      this.peopleDeviceParmas.startTime = this.$moment(this.startTime).valueOf()
      this.peopleDeviceParmas.endTime = this.$moment(this.endTime).valueOf()
      var headerData = [
        { value: '时间', type: 'createdTimeMs' },
        { value: '位置', type: 'devName' },
        { value: '姓名', type: 'name' },
        { value: '身份证号码', type: 'code' },
        { value: '性别', type: 'sex' },
        { value: '名族', type: 'ethnic' }
      ]
      this.exportPDPassage(this.peopleDeviceParmas).then(res => {
        console.log(res)
        res.list.map(item => {
          item.createdTimeMs = this.$moment(Date.now(item.createdTimeMs)).format('YYYY-MM-DD HH:mm:ss')
        })
        let list = res.list
        JSONToExcelConvertor(list, '通行统计', headerData)
      })
    },
    // 获取视频信息
    getCamera(row) {
      this.modal12 = true
      this.getCameraInfo({ camera: row.cameraData[0] }).then(res => {
        this.rowDataList = Object.assign({}, this.rowDataList, row)
        let playInfo = []
        if (res.data.data.length > 0) {
          playInfo.push({
            name: res.data.data[0].name,
            channel: res.data.data[0].chan,
            devIp: res.data.data[0].ip,
            devPort: res.data.data[0].port,
            startTime: Math.floor(row.createdTimeMs / 1000) - 10,
            endTime: Math.floor(row.createdTimeMs / 1000) + 10,
            streamType: 'main',
            resId: row.cameraData[0]
            // occurrenceTime: 1564372200
          })
          this.$nextTick(() => {
            this.$refs.pluginChildrenMonitoring.openPlayback(playInfo)
          })
        }
      })
    },
    // 分页
    changePage(val) {
      console.log(val)
      this.peopleDeviceParmas.pageNum = val
      this.getPeopleCardList(this.peopleDeviceParmas)
        .then(res => {
          this.allDataAccess = JSON.parse(JSON.stringify(res.list))
          this.page.total = res.length
        })
        .catch(() => {})
    },
    getDevicePeopleAllFuc() {
      this.getDevicePeopleAll().then(res => {
        if (res.code === 200) {
          this.peopleDevice = res.data
          res.data.forEach(item => {
            this.positionList.push({
              value: item.value,
              label: item.label
            })
          })
        }
      })
    }
  },
  created() {
    this.getDevicePeopleAllFuc()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizefun)
    this.resizefun = null
  }
}
</script>
<style lang='less' scoped>
  ::-webkit-scrollbar-thumb {
    /*background: none;*/
  }

  ::-webkit-scrollbar {
    background: none;
  }

  .monitor {
    width: 100%;
    height: 100%;
    display: flex;
    padding: 16px 0;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    flex-direction: column;
    .main {
      flex: 1;
      display: flex;
      .main-left {
        width: 272px;
        height: 100%;
        margin-right: 16px;
        background: #1b3153;
        .main-left-title {
          width: 100%;
          height: 38px;
          padding: 0 20px;
          background: #0f2243;
          text-align: center;
          line-height: 38px;
          font-size: 14px;
        }
      }
      .main-con {
        flex: 1;
        background: #1b3153;
      }
      .main-right {
        width: 402px;
        height: 100%;
        margin-left: 16px;
        background: #1b3153;
        .main-con-title {
          width: 100%;
          height: 38px;
          background: #0f2243;
          padding: 0 20px;
          line-height: 38px;
          .left {
            float: left;
            color: #fff;
            span {
              color: #449cf6;
              padding: 0 5px;
            }
          }
          .right {
            float: right;
            color: #fff;
          }
          .right:hover {
            color: #449cf6;
          }
        }
        .right-con {
          width: 100%;
          height: ~'calc(100% - 38px)';
          padding: 10px;
          overflow-y: auto;
          .con-item {
            width: 100%;
            height: 180px;
            border: 1px solid #449cf6;
            margin-bottom: 12px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            i {
              padding: 0 10px;
            }
            .item-dress {
              width: 100%;
              padding: 10px 20px;
            }
            .item-con {
              flex: 1;
              display: flex;
              .item-left {
                width: 150px;
                height: 100%;
                padding: 8px 24px;
                // background: #ccc;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
              .item-right {
                flex: 1;
                span {
                  display: block;
                  width: 100%;
                  padding: 8px;
                  padding-left: 10px;
                }
              }
            }
          }
        }
      }
    }
    .monitor-bottom {
      height: 150px;
      width: 100%;
      margin-top: 16px;
      display: flex;
      .bottom-left {
        flex: 1;
        margin-right: 16px;
        background: #1b3153;

        position: relative;
      }
      .img-box {
        width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        position: absolute;
        white-space: nowrap;
        cursor: pointer;
        height: 100%;
        padding: 8px;
      }
      .bottom-right {
        flex: 1;
        background: #1b3153;
        overflow-x: auto;
        position: relative;
      }
      .image {
        width: 115px;
        height: 100%;
        background: #ccc;

        display: inline-block;
        margin: 0 5px;
        position: relative;
        .title {
          position: absolute;
          width: 100%;
          z-index: 10;
          height: 15px;
          text-align: center;
          line-height: 15px;
          color: #fff;
          background: rgba(0, 0, 0, 0.5);
          opacity: 0.5;
        }
        .dress {
          top: 0;
        }
        .name {
          bottom: 0;
        }
        img {
          width: 115px;
          height: 100%;
        }
      }
    }
  }

  .ivu-modal-body .model-main {
    width: 100%;
    height: 470px;
    display: flex;
    .main-left {
      width: 250px;
      float: left;
      padding-right: 10px;
      .contrast {
        width: 100%;
        height: 150px;
        display: flex;
        padding-bottom: 10px;
        justify-content: space-between;
        div {
          width: 48%;
          height: 100%;
        }
        img {
          width: 45%;
          height: 100%;
        }
      }
    }
    .main-right {
     // width: 570px;
      //height: 300px;
      flex: 1;
      background: #ccc;
      // float: left;
    }
    .row {
      padding-bottom: 20px;
      label {
        width: 100px;
        display: inline-block;
      }
    }
  }

  .ivu-modal-body .model2-main {
    width: 100%;
    height: 550px;
    .dress {
      width: 100%;
      padding-bottom: 15px;
    }
    .main-top {
      width: 100%;
      height: 400px;
      .main-image {
        width: 250px;
        height: 100%;
        float: left;
        .contrast {
          width: 100%;
          height: 150px;
          display: flex;
          div {
            width: 100%;
            height: 100%;
          }
          img {
            width: 50%;
            height: 100%;
          }
        }
        .image {
          width: 100%;
          height: 250px;
          background: red;
        }
      }
      .main-video {
        float: left;
        width: 570px;
        height: 100%;
        background: #ccc;
      }
    }
    .main-bottom {
      .row {
        float: left;
        width: 50%;
        padding-bottom: 15px;
        label {
          width: 100px;
          display: inline-block;
        }
      }
    }
  }

  .mouseDownCurse {
    cursor: grab !important;
  }
  iframe {
    background-color: transparent;
    position: absolute;
    z-index: 0;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border: 0 none;
  }
</style>

<style scoped>
.table-relative {
  position: relative;
  height: 100%;
  flex: 1;
}

.table-body {
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.PersonnelTaffic {
  width: 100%;
}
.preImg {
  width: 100%;
  height: 100%;
  border: 1px solid #ddd;
  /* position: absolute;
  top: 0; */
}
.bigImgDiv {
  width: 100%;
  height: 500px;
  background: transparent;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.PersonnelTaffic .el-input__inner {
  height: 30px !important;
}
.tableStyle {
  height: 700px;
}
.modalItem {
  height: 35px;
  line-height: 35px;
}
/*这里的样式引用校园平台的资源client\src\assets\fonts */
@import '../../../assets/fonts/iconfont.css';
.PersonnelTaffic * {
  font-size: 12px;
}
.PersonnelTaffic .labelText {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  padding-right: 8px;
}
.PersonnelTaffic {
  height: 100%;
  width: 100%;
}
.tree_content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.PersonnelTaffic .el-tree {
  /* 树的背景颜色 */
  overflow-y: auto;
  overflow-x: hidden;
  background-color: transparent;
  color: #fff;
}
.PersonnelTaffic .el-tree::-webkit-scrollbar-track {
  border-radius: 5px;
}
.PersonnelTaffic .el-tree::-webkit-scrollbar-track-piece {
  background-color: #14284b;
}
.PersonnelTaffic .el-tree::-webkit-scrollbar-thumb {
  background-color: #657ca8;
  border-radius: 5px;
}
.PersonnelTaffic .el-tree >>> .el-tree-node__content .el-icon-caret-right.is-leaf {
  color: transparent;
}
.PersonnelTaffic .el-tree >>> .el-tree-node__content .el-icon-caret-right {
  font-size: 18px;
  color: #fff;
}
.PersonnelTaffic >>> .el-tree-node__content {
  /* item的高度 */
  background-color: transparent;
  height: 36px;
  position: relative;
}
.PersonnelTaffic >>> .el-tree-node__content:hover {
  /* 树的鼠标移入样式 */
  background-color: rgb(42, 67, 106);
}
.PersonnelTaffic >>> .el-tree-node__content::after {
  /* 分割线 */
  content: '';
  display: block;
  position: absolute;
  width: 90%;
  height: 0;
  border-top: 1px solid rgba(58, 90, 139, 0.4);
  bottom: 0;
  left: 50%;
  margin-left: -45%;
}
.PersonnelTaffic .el-tree-node {
  position: relative;
}
.PersonnelTaffic .BStreeNew {
  /* 树的图标和文字的公共样式 */
  background-color: transparent;
  color: #fff;
  line-height: 20px;
  padding: 3px 0;
  text-align: left;
  vertical-align: middle;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: #fff;
  width: 100%;
}
.PersonnelTaffic .BStreeNew.online {
  /* 在线 */
  color: #fff;
}
.PersonnelTaffic .BStreeNew.outline {
  /* 离线 */
  color: rgb(79, 98, 129);
}
.PersonnelTaffic .BStreeNew.off {
  /* 停用 */
  color: gold;
}
.PersonnelTaffic .BStreeNew.playing {
  /* 预览 */
  color: #4699f9;
}
.PersonnelTaffic .BStreeNew .streeIcon {
  /* 树的图标样式 */
  display: inline-block;
  text-decoration: none;
  border-radius: 3px;
  padding-right: 3px;
}
.PersonnelTaffic .BStreeNew .streeIcon > i {
  font-size: 16px;
}
.PersonnelTaffic .BStreeNew .streeIcon.rightIcon {
  position: absolute;
  right: 5px;
  background-color: rgb(42, 67, 106);
  display: none;
}
.PersonnelTaffic .BStreeNew .streeIcon.rightIcon.center-video {
  background-color: #1b3153;
  display: inline;
}
.PersonnelTaffic .el-tree-node__content:hover .BStreeNew .rightIcon.center-video {
  display: none;
}
.PersonnelTaffic .el-tree-node__content:hover .BStreeNew .rightIcon {
  display: inline;
}
.PersonnelTaffic .BStreeNew .streeIcon.rightIcon > i {
  padding: 0 3px;
  margin-left: 5px;
}
.PersonnelTaffic .BStreeNew .streeIcon.rightIcon > i:hover {
  color: #449af8;
}
.PersonnelTaffic .BStreeNew .treeText {
  /* 树的文字样式 */
  text-overflow: ellipsis;
  display: inline-block;
  /* width: calc(100% - 75px); */
  width: 192px;
}
.PersonnelTaffic >>> .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  /* 选中的样式 */
  background-color: rgb(42, 67, 106);
}
.headerBar {
  width: 100%;
  height: 75px;
  background: rgba(26, 50, 82, 1);
  margin: 15px 0;
  padding: 20px 50px;
}
.headerBar .item {
  width: 300px;
  display: flex;
  height: 32px;
  line-height: 32px;
}
.item_2 {
  width: 220px;
  display: flex;
  height: 32px;
  line-height: 32px;
}
</style>
