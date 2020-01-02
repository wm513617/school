<template>
  <div class="compare-record-search">
    <!--筛选框-->
    <div class="compare-condition">
      <Form :model="condition" inline :label-width="70" label-position="left">
        <Form-item label="对比类型" class="firstRow">
          <Row>
            <Col span="20">
            <Select v-model="condition.type" placeholder="请选择" style="width: 100%;">
              <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </Col>
          </Row>
        </Form-item>
        <Form-item label="姓名" class="firstRow" :label-width="40">
          <Row>
            <Col span="20">
            <VInput v-model="condition.name" :maxlength="64" style="width: 100%;height: 32px;"></VInput>
            </Col>
          </Row>
        </Form-item>
        <Form-item label="性别" class="firstRow" :label-width="55">
          <Row>
            <Col span="20">
            <Select v-model="condition.gender" placeholder="请选择" style="width: 100%;">
              <Option v-for="item in genderList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </Col>
          </Row>
        </Form-item>
        <Form-item label="相似度 >" class="firstRow">
          <Row>
            <Col span="20">
            <Input-number :max="100" :min="1" v-model="condition.similarity" style="width: 100%;height: 32px;"></Input-number>
            </Col>%
          </Row>
        </Form-item>
        <Form-item label="年龄范围" class="firstRow">
          <Row>
            <Col span="10">
            <Input-number :max="99" :min="1" v-model="condition.min" style="width: 100%;height: 32px;"></Input-number>
            </Col>
            <Col span="4" style="text-align: center;">-</Col>
            <Col span="10">
            <Input-number :max="100" :min="condition.min" v-model="condition.max" style="width: 100%;height: 32px;"></Input-number>
            </Col>
          </Row>
        </Form-item>
        <Form-item label="时间段选择" class="secondRow" :label-width="80">
          <Row>
            <Col span="23">
            <DatePicker type="datetime" style="width: 170px" :options="{
                      disabledDate (date) {
                        return date && date.valueOf() > Date.now()
                      }
                    }" @on-clear="condition.start = '';" v-model="dateRange[0]" :clearable="false"></DatePicker>
            <b>至</b>
            <DatePicker type="datetime" style="width: 170px" :options="{
                      disabledDate (date) {
                        return date && date.valueOf() > Date.now()
                      }
                    }" @on-clear="condition.end = '';" v-model="dateRange[1]" :clearable="false"></DatePicker>
            </Col>
          </Row>
        </Form-item>
        <Form-item label="抓拍位置" class="secondRow">
          <Row>
            <Col span="22">
            <Select placeholder="点击选择抓拍位置" style="width: 100%;">
              <VTree ref="devTree" :treeData="devList" :options="{showInput: true}"></VTree>
            </Select>
            </Col>
          </Row>
        </Form-item>
        <Form-item>
          <Button type="ghost" icon="ios-search" @click="pageCur = 1;retrieval()" style="width: 100px; margin-right: 8px;height: 32px">搜索</Button>
          <Button type="ghost" @click="ExportCsv" style="width: 100px;height: 32px"><i class="ivu-icon iconfont icon-export" style="font-size:14px;"></i>&nbsp;导出</Button>
        </Form-item>
      </Form>
    </div>
    <!--内容显示框-->
    <div class="result-show">
      <Tabs :value="showType" @on-click="changeShowType">
        <TabPane label="缩略图" name="thumbnail" style="overflow:hidden;">

        </TabPane>
        <TabPane label="列表" name="list">

        </TabPane>
      </Tabs>
      <div class="operate">
        <Button type="ghost" @click="listSort($event, 'sort')" style="height: 32px;margin-right: 8px;">按时间排序</Button>
        <Button type="ghost" @click="listSort($event, 'simi')" style="height: 32px">按相似度排序</Button>
      </div>
    </div>
    <div class="contrastList" ref="tableBox">
      <div class="tips" :style="{'flex':1, 'lineHeight':tableHeight+'px','height':tableHeight+'px','text-align':'center'}" v-if="contrastList.length <= 0">
        暂无数据
      </div>

      <div style="flex:1;position:relative" v-if="contrastList.length>0" v-show="showType==='thumbnail'">
        <ul class="thumbnail-list clearfix">
          <li v-for="(item,index) of contrastList" :key="index">
            <ContrastItem :data="item" />
          </li>
        </ul>
        <div class="table-footer">
          <Page style="float:right" :current="pageCur" show-total :page-size="pageLimit" :total="pageTotal" show-elevator @on-change="handlePageChange"></Page>
        </div>
      </div>
      <div style="flex:1;position:relative;display:flex" v-if="contrastList.length>0" v-show="showType==='list'">
        <div style="flex:1">
          <Table :height="tableHeight" size="small" :row-class-name="rowClassName" highlight-row :columns="columns" :data="resultList" @on-row-click="showRowInfo"></Table>
          <div class="table-footer">
            <Page style="float:right" :current="pageCur" show-total :page-size="pageLimit" :total="pageTotal" show-elevator @on-change="handlePageChange"></Page>
          </div>
        </div>
        <div style="width:13%">
          <ContrastItem compare v-show="tableDetail.flag" :data="tableDetail.data" />
        </div>
      </div>
    </div>
    <BShumanDetail :show.sync="detailModal" :value="detailData" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import ContrastItem from '../common/ContrastItem'
export default {
  components: {
    ContrastItem
  },
  created() {
    // 获取初始时间段
    this.dateOC(false)
    // 获取人脸资源机构树
    this.getResTree(this.condition.sys).catch(err => {
      this.$Notice.warning({
        title: '获取人脸资源机构树失败',
        desc: err.response.data.message,
        duration: 1
      })
    })
  },
  data() {
    return {
      tableHeight: 435,
      detailModal: false,
      detailData: {},
      showType: 'thumbnail',
      tableDetail: {
        flag: false,
        data: {}
      },
      pageLimit: 20,
      pageCur: 1,
      dateRange: [this.beforeDawn(), new Date()],
      condition: {
        sys: '1',
        device: '',
        start: 0,
        end: 0,
        type: 'all',
        name: '',
        gender: 'all',
        min: 0,
        max: 100,
        similarity: 78,
        page: '',
        limit: '',
        sort: 2,
        simi: 2
      },
      sysList: [{ value: '0', label: '通行系统' }, { value: '1', label: '抓拍系统' }],
      genderList: [{ value: 'all', label: '全部' }, { value: '1', label: '男' }, { value: '0', label: '女' }],
      columns: [
        {
          key: 'index',
          width: 80,
          align: 'center',
          title: '序号'
        },
        {
          title: '对比时间',
          key: 'snapshotTime',
          width: 180
        },
        {
          title: '抓拍位置',
          key: 'resourcePoint'
        },
        {
          title: '出入口',
          key: 'passway'
        },
        {
          title: '入库人员姓名',
          key: 'username',
          width: 120,
          ellipsis: true
        },
        {
          title: '性别',
          key: 'gender'
        },
        {
          title: '年龄',
          key: 'age'
        },
        {
          title: '身份证号',
          key: 'idNumber',
          width: 180,
          ellipsis: true
        },
        {
          title: '对比类型',
          key: 'mold'
        },
        {
          title: '相似程度',
          key: 'similarity'
        },
        {
          title: '操作',
          render: (h, params) => {
            return h(
              'Button',
              {
                props: {
                  type: 'ghost',
                  size: 'small'
                },
                on: {
                  click: e => {
                    e.stopPropagation()
                    this.showInfoModal(params)
                  }
                }
              },
              '查看'
            )
          }
        }
      ],
      resultList: [],
      devList: []
    }
  },
  watch: {
    faceResTree: {
      handler(val) {
        this.devList = this.$lodash.cloneDeep(val)
      },
      deep: true
    },
    compareList: {
      handler(val) {
        this.resultList = this.$lodash.cloneDeep(val)
      },
      deep: true
    },
    'condition.sys'(val) {
      this.getResTree(val).catch(err => {
        this.$Notice.warning({
          title: '获取人脸资源机构树失败',
          desc: err.response.data.message,
          duration: 1
        })
      })
    }
  },
  computed: {
    ...mapState({
      faceResTree: state => state.face.faceResTree,
      pageTotal: state => state.face.pageTotal,
      compareList: state => state.face.compareList
    }),
    typeList() {
      if (this.condition.sys === '1') {
        return [
          { value: 'all', label: '全部' },
          { value: '3', label: '黑名单' },
          { value: '4', label: '白名单' },
          { value: '5', label: '布控' }
        ]
      } else {
        return [
          { value: 'all', label: '全部' },
          { value: '0', label: '员工' },
          { value: '1', label: '访客' },
          { value: '2', label: 'VIP' }
        ]
      }
    },
    contrastList() {
      return this.resultList.map(val => {
        return {
          similarity: val.similarity, // 相似度
          type: val.mold, // 类型黑白名单等
          device: val.resourcePoint, // 那个镜头拍下的
          capture: val.snapshot, // 实时抓拍的照片
          captureTime: val.snapshotTime, // 识别的时间
          picture: val.picture, // 底库照片
          name: val.username, // 姓名
          gender: val.gender, // 性别
          age: val.age // 年龄
        }
      })
    }
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight - 40
  },
  methods: {
    ...mapActions(['getResTree', 'searchCompare', 'searchCompareExport']),
    ExportCsv() {
      const params = {}
      params.sys = this.condition.sys
      params.type = this.condition.type
      this.$refs.devTree.getSelectedDeepIds().length > 0 &&
        (params.device = this.$refs.devTree
          .getSelectedDeepIds()
          .map((val, i) => {
            return i !== 0 ? '&device=' + val : val
          })
          .join(''))
      params.start = this.condition.start
      params.end = this.condition.end
      this.condition.gender !== 'all' && (params.gender = this.condition.gender)
      this.condition.name && (params.name = this.condition.name)
      this.condition.min && (params.min = this.condition.min)
      this.condition.max && (params.max = this.condition.max)
      this.condition.similarity && (params.similarity = this.condition.similarity)
      params.page = this.pageCur
      params.limit = this.pageLimit
      params.export = 1
      this.condition.sort !== 2 && (params.sort = this.condition.sort)
      this.condition.simi !== 2 && (params.simi = this.condition.simi)
      let payload = {
        url: '/human/inquiry',
        params: params
      }
      this.searchCompareExport(payload).then(res => {
        let exportData = res.data.map(item => {
          return {
            snapshotTime: '~' + this.$moment.unix(Number(item.snapshotTime)).format('YYYY-MM-DD HH:mm:ss'),
            resourcePoint: item.resourcePoint,
            username: item.username,
            gender: item.gender,
            age: item.age,
            idNumber: '~' + item.idNumber,
            type: item.type,
            similarity: item.similarity + '%'
          }
        })
        let csvData = {
          title: ['时间', '抓拍位置', '人员姓名', '性别', '年龄', '身份证号', '对比类型', '相似程度'],
          titleForKey: ['snapshotTime', 'resourcePoint', 'username', 'gender', 'age', 'idNumber', 'type', 'similarity'],
          data: exportData
        }
        this.$bsValidate.exportCsv(csvData, '人员抓拍对比统计')
      })
    },
    showInfoModal(data) {
      this.detailModal = true
      this.detailData = data.row
      this.detailData.trackStart = this.condition.start
      this.detailData.trackEnd = this.condition.end
    },
    listSort(e, type) {
      this.pageCur = 1
      if (type === 'sort') {
        this.condition['simi'] = 2
      } else {
        this.condition['sort'] = 2
      }
      this.condition[type] = this.condition[type] === 0 ? 1 : 0
      this.retrieval()
    },
    // table中row单击事件
    showRowInfo(item) {
      this.tableDetail.data = {
        similarity: item.similarity,
        type: item.mold,
        device: item.resourcePoint,
        capture: item.snapshot,
        captureTime: item.snapshotTime,
        picture: item.picture,
        name: item.username,
        gender: item.gender,
        age: item.age
      }
      this.rowClassName = function() {}
    },
    dateOC(flag) {
      // 日期选择面板关闭触发
      if (!flag) {
        this.condition.start = Date.parse(this.dateRange[0]) / 1000
        this.condition.end = Date.parse(this.dateRange[1]) / 1000
      }
    },
    handlePageChange(page) {
      this.tableDetail.flag = false
      this.pageCur = page
      this.retrieval()
    },
    retrieval() {
      const params = {}
      let device = ''
      params.sys = this.condition.sys
      params.type = this.condition.type
      this.$refs.devTree.getSelectedDeepIds().length > 0 &&
        (device = this.$refs.devTree
          .getSelectedDeepIds()
          .map((val, i) => {
            return i !== 0 ? '&device=' + val : val
          })
          .join(''))
      params.start = this.condition.start
      params.end = this.condition.end
      this.condition.gender !== 'all' && (params.gender = this.condition.gender)
      this.condition.name && (params.name = this.condition.name)
      this.condition.min && (params.min = this.condition.min)
      this.condition.max && (params.max = this.condition.max)
      this.condition.similarity && (params.similarity = this.condition.similarity)
      params.page = this.pageCur
      params.limit = this.pageLimit
      this.condition.sort !== 2 && (params.sort = this.condition.sort)
      this.condition.simi !== 2 && (params.simi = this.condition.simi)
      let payload = {
        url: '/human/inquiry?device=' + device,
        params: params
      }
      this.searchCompare(payload)
        .then(res => {
          if (!res.data[0]) {
            this.tableDetail.flag = false
            return
          }
          this.rowClassName = function(row, index) {
            if (index === 0) {
              return 'ivu-table-row-highlight'
            }
            return ''
          }
          this.tableDetail.flag = true
          const moment = this.$moment
          this.tableDetail.data = {
            similarity: res.data[0].similarity,
            type: res.data[0].type,
            device: res.data[0].resourcePoint,
            capture: res.data[0].snapshot,
            captureTime: moment(parseInt(res.data[0].snapshotTime) * 1000).format('YYYY-MM-DD HH:mm:ss'),
            picture: res.data[0].picture,
            name: res.data[0].username,
            gender: res.data[0].gender,
            age: res.data[0].age
          }
        })
        .catch(err => {
          this.$Notice.warning({
            title: '检索失败',
            desc: err.response.data.message,
            duration: 1
          })
        })
    },
    handleAge() {
      this.condition.min = parseInt(this.condition.min)
      this.condition.max = parseInt(this.condition.max)
      // 限定第二个年龄值小于第一个则等于第一个
      this.condition.max < this.condition.min && (this.condition.max = this.condition.min)
    },
    handleSimilarity() {
      this.condition.similarity < 0 && (this.condition.similarity = 0)
      this.condition.similarity > 100 && (this.condition.similarity = 100)
    },
    beforeDawn() {
      let start = new Date()
      start.setHours(0)
      start.setMinutes(0)
      start.setSeconds(0)
      start.setMilliseconds(0)
      return start
    },
    changeShowType(val) {
      this.showType = val
    },
    rowClassName() {}
  }
}
</script>

<style lang="less" scoped>
.compare-record-search {
  flex: 1;
  display: flex;
  flex-direction: column;

  .contrastList {
    display: flex;
    flex: 1;
    position: relative;
    overflow: hidden;
    .thumbnail-list {
      position: absolute;
      width: 100%;
      bottom: 40px;
      top: 0px;
      list-style: none;
      overflow: auto;
      li {
        list-style: none;
        float: left;
        width: 20%;
        padding: 10px;
        display: flex;
      }
    }
    .table-footer {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
    }
    .ivu-row {
      .table-footer {
        bottom: -40px;
      }
    }
  }
  .clearfix:after {
    content: '.';
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .compare-condition {
    display: flex;
    align-items: center;
    padding-left: 24px;
  }
  .page-warp {
    height: 48px;
    padding-top: 8px;
    border: 1px solid #5d5d5d;
    border-top: none;
    .left-info {
      display: inline-block;
      height: 32px;
      line-height: 32px;
      margin-left: 10px;
      font-size: 0.75rem;
    }
    .ivu-page {
      float: right;
      margin-right: 10px;
    }
  }
  .result-show {
    flex: 0 0 55px;
    position: relative;
  }
  .operate {
    display: inline;
    position: absolute;
    top: 4px;
    right: 12px;
  }
  .tab-container {
    padding: 15px;
  }
  .info-content {
    margin-bottom: 25px;
    border: 1px solid #ddd;
    padding: 10px;
  }
  .photo {
    width: 100%;
    height: 100%;
  }
  .photo-table {
    width: 100%;
    height: 100%;
  }
  .similary {
    z-index: 10;
    margin-top: 15%;
  }
  .degree {
    position: absolute;
    bottom: 43%;
    left: 0;
    display: inline-block;
    width: 100%;
    text-align: center;
  }
  .blacklist-flag {
    position: absolute;
    right: -10%;
    top: -10%;
  }
  .listType {
    width: 49px;
    height: 42px;
    position: absolute;
    left: 40%;
    top: -4%;
  }
  .snapshot-type {
    text-align: right;
  }
  .snapshot-photo,
  .store {
    height: 145px;
    text-align: center;
  }
  .prob {
    margin: 10px auto;
    width: 75px;
    position: relative;
  }
  .ivu-form-item {
    margin-right: 0;
    width: 24%;
    margin-bottom: 16px;
  }
  .ivu-table-tip tr {
    height: 432px;
  }

  .compare-condition .firstRow.ivu-form-item {
    margin-right: 0;
    width: 17%;
    margin-top: 14px;
  }
  .compare-condition .secondRow.ivu-form-item {
    margin-right: 0;
    width: 460px;
    margin-bottom: 14px;
  }
}
</style>
