<template>
  <div class="PersonnelTaffic">
  <div class="headerBar">
    <div style=" display: flex;">
      <div>
          <span >时间选择</span>
          <DatePicker type="datetime" @on-change='selectStart' :value="startTime" format="yyyy-MM-dd HH:mm:ss" placeholder="开始日期" style="width: 218px"></DatePicker>
          <span style="margin:0 10px;">至</span>
          <DatePicker type="datetime" :value="endTime" @on-change='selectEnd' format="yyyy-MM-dd HH:mm:ss" placeholder="结束日期" style="width: 218px"></DatePicker>
      </div>
      <div class="item" style="position:relative">
          <label style="width:60px;text-align:center">位置</label>
          <Select style="width:350px" placeholder="全部"
           filterable :max-tag-placeholder="maxTagPlaceholder"  :max-tag-count="1" multiple label-in-value  @on-change="checkPosition" @on-query-change="keywordChange">
              <Option v-for="(opt, index) in positionList"
                  :value="opt.label"  :key="index">{{opt.label}}</Option>
            </Select>
        </div>
        <div class="item_2" style="width:280px">
          <label style="width:110px;text-align:center">验证方式</label>
          <Select v-model="validator" placeholder="请选择" style="margin-right:20px;">
               <Option v-for="item in verifyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="item_2">
          <label style="width:100px;text-align:left">事件描述</label>
          <Input v-model="accessRecords.description" :maxlength="32"  placeholder="请输入" style="margin-right:20px;"></Input>
        </div>
    </div>
    <!-- 组织 -->
    <div style="margin-top:15px;display:flex">
        <div class="item_2">
          <label style="width:75px;text-align:left">组织</label>
           <el-input
            placeholder="请输入"
            size='small'
            :disabled="validatorStatus"
            v-model="orgText"
             @focus="dropZ" @blur="closeDropZ"
             style="margin-right:20px;">
          </el-input>
          <div style="position:absolute;top: 123px;left: 93px;z-index: 1;max-height: 350px;overflow: auto;width:234px;font-size: 14px"
           v-show="isDropZ">
            <el-tree
              class="filter-tree"
              node-key="id"
              :data="orgTreeData"
              @node-click="handleOrgNode"
              :style="{background: '#1b3153',border:'1px solid #5676a9'}"
              default-expand-all
              :filter-node-method="filterNode"
              ref="tree3">
               <span  slot-scope="{node, data}" class="tree_content">
                <span>
                  <span class="iconfont icon-organise"></span>
                  <span>{{data.name}}</span>
                </span>
              </span>
            </el-tree>
           </div>
        </div>
        <div class="item_2">
          <label style="width:60px;text-align:left">姓名</label>
          <Input v-model="accessRecords.name" :maxlength="16"  placeholder="请输入" style="margin-right:20px;"></Input>
        </div>
        <div class="item_2">
          <label style="width:100px;text-align:left">人员编号</label>
          <Input v-model="accessRecords.uid" :maxlength="32" placeholder="请输入" style="margin-right:20px;"></Input>
        </div>
         <div class="item_2">
          <label style="width:100px;text-align:left">人员类型</label>
          <Select v-model="persontype" placeholder="请选择" :disabled="validatorStatus" style="margin-right:20px;">
              <Option value="0">黑名单</Option>
              <Option value="1">灰名单</Option>
              <Option value="2">白名单</Option>
              <Option value="3">全部</Option>
          </Select>
        </div>
        <div class="item_2">
          <Button  type="ghost" class="icon-jiansuozhong" @click="search(true)" style="margin-right:10px;">
            检索
          </Button>
          <Button class="icon-export" @click="exportList" type="ghost">导出</Button>
        </div>
    </div>
  </div>
    <!-- <Table border :columns="colAccess" :data="allDataAccess.list" :height='tableHeight' style="overflow: auto" ></Table> -->
    <div class="table-relative" ref="tableBox" >
      <div class="table-body table-cover">
          <Table size="small" :columns="colAccess" :data="allDataAccess" :highlight-row="true" :height="tableHeight" ></Table>
      </div>
  </div>
  <div style="position:fixed;bottom:0;width: 100%;
    background: #244575;
    padding: 8px;">
    <div style="float: right;">
      <Page show-sizer :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" :total="page.total" :current="pageCur" :page-size="page.pageSize" @on-change="changePage" show-elevator show-total></Page>
    </div>
  </div>
  <!-- <Modal v-model="modal12" draggable scrollable width='50%' title="事件详情">
    <div style="display:flex">
      <div style="width:25%;margin-right:20px;">
        <div style="position:relative">
          <!-- 将来可能显示两张图 -->
          <!-- <p><span class="iconfont icon-Location"></span>&nbsp;&nbsp;{{rowDataList.addressName}}</p> -->
          <!-- <img :src="rowDataList.userData.image" alt="" style="width:110px;height:150px;border:1px solid #ddd;margin-top:10px"> -->
          <!-- <img :src="rowDataList.currentUrl" alt="" style="width:110px;height:150px;border:1px solid #ddd;margin-top:10px">
          <i class="icon iconfont icon-enlarge" @click="previewImg" style="cursor: pointer;position:absolute;top: 40px;left: 90px;"></i>
        </div>
        <div>
          <div class="modalItem">
          <span>验证方式：</span>
          <span>{{rowDataList.validator}}</span>
        </div>
        <div class="modalItem">
          <span>时间：</span>
          <span>{{this.$moment(rowDataList.eventTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
        </div>
        <div class="modalItem">
          <span>姓名：</span>
          <span>{{rowDataList.name}}</span>
        </div>
        <div class="modalItem">
          <span>性别：</span>
          <span>{{rowDataList.sex === 2 ? '女' : '男'}}</span>
        </div>
        <div class="modalItem">
          <span>手机号码：</span>
          <span>{{rowDataList.userData.phone||'--'}}</span>
        </div>
        <div class="modalItem">
          <span>人员卡号：</span>
          <span>{{rowDataList.card}}</span>
        </div>
        <div class="modalItem">
          <span>人员编号：</span>
          <span>{{rowDataList.uid}}</span>
        </div>
        <div class="modalItem">
          <span>人员类型：</span>
          <span>{{rowDataList.type === 2 ? '白名单' : (rowDataList.type === 1 ? '灰名单' : '黑名单') }}</span>
        </div>
        <div class="modalItem">
          <span>所属组织：</span>
          <span>{{rowDataList.org.name}}</span>
        </div>
        </div>
      </div>
      <div style="height:500px;width:70%" v-show="!isBigImg">
        <playbackP ref='playbackDom' :defaultPane='1' :configuration='configuration'></playbackP>
      </div>
      <div class="bigImgDiv" v-show='isBigImg'>
        <img :src="rowDataList.userData.image"  alt="" class="preImg">
        <i class="icon iconfont icon-exit-full-screen" @click="previewImg" style="cursor: pointer;position:absolute;bottom: 6px;right: 10px;"></i>
      </div>
    </div>
  </Modal> --> -->
  <bs-modal v-model="modal12" title="事件详情" :width="'50%'" class="focus" :closable='false' :mask-closable="false"
              @on-ok="focusSave" @on-cancel="focusClose">
      <iframe v-if="modal12"></iframe>
      <div style="position:relative" v-if="rowDataList">
        <div class="model-main" >
          <div class="main-left">
            <div class="row">
              <i class="icon iconfont">&#xe72e;</i>
              <span>{{rowDataList.addressName}}</span>
            </div>
            <div class="row" style='width: 110px; height: 140px;background:#ccc;padding:0;margin-bottom:15px;'>
              <picturePreview
                              :url="rowDataList.currentUrl"
                              :imgStyle="{
                              width:'100%',
                              height:'100%'
                              }"
                              :isBodyShow="false"
                              @preview_x="isPreviewFuc"

              ></picturePreview>
            </div>
            <div class="row">
              <label for="">验证方式：</label>
              <span>{{rowDataList.validator}}</span>
            </div>
            <div class="row">
              <label for="">时间：</label>
              <span>{{this.$moment(rowDataList.eventTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
            </div>
            <div class="row">
              <label for="">姓名：</label>
              <span>{{rowDataList.name}}</span>
            </div>
            <div class="row">
              <label for="">性别：</label>
              <span>{{rowDataList.sex === 1 ? '男' : (rowDataList.sex === 2 ? '女' : '')}}</span>
            </div>
            <div class="row">
              <label for="">手机号码：</label>
              <span>{{rowDataList.phone ? rowDataList.phone : ''}}</span>
            </div>
            <div class="row">
              <label for="">人员卡号：</label>
              <span>{{rowDataList.card}}</span>
            </div>
            <div class="row">
              <label for="">人员编码：</label>
              <span>{{rowDataList.uid}}</span>
            </div>
            <div class="row">
              <label for="">人员类型：</label>
              <span>{{rowDataList.type === 2 ? '白名单' : (rowDataList.type === 1 ? '灰名单' : '黑名单') }}</span>
            </div>
            <div class="row">
              <label for="">所属组织：</label>
              <span>{{rowDataList.org ? rowDataList.org.name : ''}}</span>
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

import playbackP from '../../../components/videoComponentsNew/playbackPlugin'
import picturePreview from '../picturePreview'
import { JSONToExcelConvertor } from '../jsonToExcel'

export default {
  components: {
    picturePreview,
    playbackP
  },
  data() {
    return {
      backVidowShow: true,
      filterText: '',
      number1: 1,
      positionList: [], // 位置数组
      keyword: '', // 搜索关键字
      tableHeight: 435, // table高度
      orgText: '',
      addressType: [], // 所有位置数组
      modal12: false,
      loading: false,
      isBigImg: false, // 是否显示预览
      isDropTree: false,
      isDropZ: false,
      persontype: '3',
      activeorgID: '',
      agencyId: '',
      orgAgencyId: '',
      validator: '白名单比中',
      validatorStatus: false,
      locTreeData: [], // 位置
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      verifyList: [
        {
          value: '仅卡',
          label: '仅卡'
        },
        {
          value: '指纹',
          label: '指纹'
        },
        {
          value: '白名单比中',
          label: '白名单比中'
        },
        {
          value: '陌生人',
          label: '陌生人'
        },
        {
          value: '非活体攻击',
          label: '非活体攻击'
        },
        {
          value: '密码攻击',
          label: '密码攻击'
        },
        {
          value: '白名单异常-人像有效期无效',
          label: '白名单异常-人像有效期无效'
        },
        {
          value: '白名单异常-不在有效时间范围',
          label: '白名单异常-不在有效时间范围'
        },
        {
          value: '白名单异常-无设备权限',
          label: '白名单异常-无设备权限'
        },
        {
          value: '黑名单警告',
          label: '黑名单警告'
        },
        {
          value: '其他',
          label: '其他'
        }
      ],
      page: {
        total: 0,
        current: 1,
        pageSize: this.$PageInfo.limit
      },
      pageCur: 1,
      // 视频配置
      configuration: {
        progressBar: {
          totalTime: true
        },
        timeline: false,
        buttos: ['stopAll']
      },
      orgTreeData: [], // 机构
      startTime: this.$moment(new Date(new Date().toLocaleDateString()).getTime()).format('YYYY-MM-DD HH:mm:ss'),
      endTime: this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      options: {
        showFolder: true
      },
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
          render: (h, params) => {
            return h('div', [
              h('strong', this.$moment(params.row.createdTimeMs).format('YYYY-MM-DD HH:mm:ss'))
            ])
          }
        },
        {
          title: '位置',
          key: 'addressName'
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '人员编号',
          key: 'uid',
          width: 300
        },
        {
          title: '人员卡号',
          key: 'card'
        },
        {
          title: '组织',
          key: 'orgName',
          render: (h, params) => {
            let text = ''
            if (params.row.org) {
              text = params.row.org.name
            }
            return h('span', text)
          }
        },
        {
          title: '事件描述',
          key: 'description'
        },
        {
          title: '验证方式',
          key: 'validator'
        },
        {
          title: '查看详情',
          key: 'details',
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
        org: {
          name: ''
        },
        type: '',
        uid: '',
        card: '',
        eventTime: '',
        userData: {
          sex: '',
          phone: ''
        },
        address: {
          name: ''
        }
      }, // 行数据
      allDataAccess: [], // 通行记录总数据
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
        type: [0, 1, 2]
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
        this.accessRecords.type = [0, 1, 2]
      } else {
        this.accessRecords.type = [Number(val)]
      }
    },
    // 组织筛选
    orgText(val) {
      this.$refs.tree3.filter(val)
    },
    validator(val) {
      if (val === '陌生人' || val === '非活体攻击' || val === '密码攻击') {
        this.validatorStatus = true
        // this.accessRecords.type = []
        this.accessRecords.org = ''
      } else {
        this.validatorStatus = false
        this.accessRecords.org = this.activeorgID
      }
      this.accessRecords.validator = [val]
    }
  },
  mounted() {
    this.accessRecords.validator = [this.validator]
    this.tableHeight = Number(this.$refs['tableBox'].offsetHeight - 200)
    console.log(this.tableHeight)
    window.addEventListener('resize', this.resizefun)
    // 组织
    this.getOrgTree(10).then(res => {
      if (res) {
        this.orgTreeData = [res.data]
        this.orgText = this.orgTreeData[0].name
        this.activeorgID = this.orgTreeData[0]._id
        this.accessRecords.org = this.orgTreeData[0]._id
        this.search()
      }
    })
  },
  methods: {
    ...mapActions(['getPassgeListData', 'getOrgTree', 'getDoorTreeList', 'exportPassage', 'getCameraInfo', 'getAllDevice']),
    selectStart(val) {
      // console.log(val)
      this.startTime = val
    },
    isPreviewFuc(event) {
      this.backVidowShow = event
    },
    selectEnd(val) {
      this.endTime = val
    },
    // 位置下拉框
    maxTagPlaceholder(num) {
      return '已选' + (num + 1) + '条'
    },
    resizefun() {
      this.tableHeight = Number(this.$refs['tableBox'].offsetHeight - 200)
    },
    focusSave() {
      this.modal12 = false
      this.rowDataList = ''
    },
    focusClose() {
      this.modal12 = false
      this.rowDataList = ''
    },
    // 位置下拉框
    checkPosition(value) {
      this.accessRecords.address.type = ''
      this.accessRecords.address.arr = []
      if (value) {
        this.addressType.forEach((item) => {
          value.forEach(i => {
            if (item.name === i.label) {
              this.accessRecords.address.type = item.type
              this.accessRecords.address.arr.push(item._id)
            }
          })
        })
      }
      console.log(this.accessRecords.address)
    },
    // 清空位置搜索框
    keywordChange(query) {
      if (query === '') {
        this.keyword = ''
      }
    },
    // 预览图片
    previewImg() {
      this.isBigImg = !this.isBigImg
    },
    dropZ() {
      this.isDropZ = true
      this.orgText = ''
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
      return data.name.indexOf(value) !== -1
    },
    // 检索
    search() {
      // 获取通行记录列表
      this.loading = true
      this.accessRecords.startTime = this.$moment(this.startTime).valueOf()
      this.accessRecords.endTime = this.$moment(this.endTime).valueOf()
      console.log(this.accessRecords.startTime, this.accessRecords.endTime)
      // 获取通信记录列表
      if (this.accessRecords.startTime > this.accessRecords.endTime || this.accessRecords.startTime === this.accessRecords.endTime) {
        this.errorMsg('开始时间不能大于结束时间!')
      } else {
        this.getPassgeListData(this.accessRecords)
          .then(res => {
            if (res.data.code === 200) {
              console.log(res)
              this.allDataAccess = res.data.list
              this.page.total = res.data.length
              this.loading = false
            } else if (res.data.length === 0) {
              this.errorMsg('查询记录为空!')
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    // 通行记录列表导出
    exportList() {
      this.accessRecords.startTime = this.$moment(this.startTime).valueOf()
      this.accessRecords.endTime = this.$moment(this.endTime).valueOf()
      var headerData = [
        { value: '时间', type: 'createdTimeMs' },
        { value: '位置', type: 'addressName' },
        { value: '姓名', type: 'name' },
        { value: '人员编号', type: 'uid' },
        { value: '人员卡号', type: 'card' },
        { value: '组织', type: 'orgName' },
        { value: '事件描述', type: 'description' },
        { value: '验证方式', type: 'validator' }
      ]
      this.exportPassage(this.accessRecords).then(res => {
        console.log(res)
        res.data.list.map(item => {
          item.createdTimeMs = this.$moment(item.createdTimeMs).format('YYYY-MM-DD HH:mm:ss')
          if (item.org) {
            item['orgName'] = item.org.name
          }
        })
        let list = res.data.list
        console.log(list)
        // console.log(list)
        JSONToExcelConvertor(list, '通行统计', headerData)
      })
    },
    // 获取视频信息
    getCamera(row) {
      this.modal12 = true
      this.getCameraInfo({ camera: row.camera[0] }).then(res => {
        this.rowDataList = Object.assign({}, this.rowDataList, row)
        let playInfo = []
        if (res.data.data.length > 0) {
          playInfo.push({
            channel: res.data.data[0].chan,
            startTime: Math.floor(row.createdTimeMs / 1000) - 60,
            endTime: Math.floor(row.createdTimeMs / 1000) + 60,
            devIp: res.data.data[0].ip,
            name: res.data.data[0].name,
            devPort: res.data.data[0].port,
            // eventType: ['all'],
            streamType: 'main',
            resId: row.camera[0]
          })
          this.$nextTick(() => {
            this.$refs.pluginChildrenMonitoring.openPlayback(playInfo)
          })
        }
      })
    },
    // 分页
    changePage(val) {
      this.accessRecords.pageNum = val
      this.getPassgeListData(this.accessRecords)
        .then(res => {
          this.allDataAccess = JSON.parse(JSON.stringify(res.data.list))
        })
        .catch(() => {})
    },
    pageSizeChange(event) {
      this.accessRecords.pageSize = event
      this.getPassgeListData(this.accessRecords)
        .then(res => {
          this.allDataAccess = JSON.parse(JSON.stringify(res.data.list))
        })
        .catch(() => {})
    },
    // 组织机构树
    handleOrgNode(node, mark) {
      this.accessRecords.org = node._id
      this.orgText = node.name
      this.orgTreeData.forEach((item, index) => {
        if (node._id === item._id) {
          this.orgAgencyId = ''
        } else {
          this.orgAgencyId = node._id
        }
      })
    },
    getAllDeviceFuc() {
      this.getAllDevice().then(res => {
        if (res.code === 200) {
          this.addressType = res.arr
          res.arr.forEach(item => {
            this.positionList.push({
              value: item._id,
              label: item.name
            })
          })
          console.log(this.positionList)
        }
      })
    }
  },
  created() {
    this.getAllDeviceFuc()
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
      padding-bottom: 13px;
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
  /* font-size: 16px; */
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
  height: 120px;
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
