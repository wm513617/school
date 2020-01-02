<template>
  <div class="stranger-record-search">
    <!--筛选框-->
    <div class="compare-condition">
      <Form :model="condition" inline :label-width="80" label-position="left">
        <!-- <Form-item label="系统类型">
                        <Row>
                          <Col span="20">
                            <Select v-model="condition.sys" placeholder="请选择" style="width:100%;">
                              <Option v-for="item in sysList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                          </Col>
                        </Row>
                      </Form-item> -->
        <Form-item label="时间段选择" style="width: 470px">
          <Row>
            <Col span="24">
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
        <Form-item label="抓拍位置">
          <Row>
            <Col span="24">
            <Select placeholder="点击选择抓拍位置" style="width: 100%;">
              <VTree ref="devTree" :treeData="devList" :options="{showInput: true}"></VTree>
            </Select>
            </Col>
          </Row>
        </Form-item>
        <Form-item>
          <Button type="ghost" icon="ios-search" @click="pageCur = 1;retrieval()" style="width: 100px;height:32px;">检索</Button>
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
        <Button type="ghost" @click="listSort($event, 'sort')">按时间排序</Button>
      </div>
    </div>

    <div class="contrastList" ref="tableBox">
      <div class="tips" :style="{ 'flex':1,'lineHeight':tableHeight+'px','height':tableHeight+'px','text-align':'center'}" v-if="resultList.length <= 0">
        暂无数据
      </div>
      <div style="flex:1;position:relative" v-if="resultList.length>0" v-show="showType==='thumbnail'">
        <ul class="thumbnail-list clearfix">
          <li v-for="item of resultList" :key="item._id">
            <div class="thumbnail">
              <div class="title">{{item.resourcePoint}}</div>
              <div class="content">
                <img :src="item.snapshot" @error="imgErr" />
                <div class="date">{{item.snapshotTime}}</div>
              </div>
            </div>
          </li>
        </ul>
        <div class="table-footer">
          <Page style="float:right" :current="pageCur" show-total :page-size="pageLimit" :total="pageTotal" show-elevator @on-change="handlePageChange"></Page>
        </div>
      </div>
      <div style="flex:1;position:relative" v-if="resultList.length>0" v-show="showType==='list'">
        <Row>
          <Col span="21">
          <Table :height="tableHeight" size="small" :row-class-name="rowClassName" highlight-row :columns="columns" :data="resultList" @on-row-click="showRowInfo"></Table>
          <div class="table-footer">
            <Page style="float:right" :current="pageCur" show-total :page-size="pageLimit" :total="pageTotal" show-elevator @on-change="handlePageChange"></Page>
          </div>
          </Col>
          <Col span="3">
          <div class="thumbnail">
            <div class="title">{{tableDetail.data.resourcePoint}}</div>
            <div style="width:100%; height: 136px;">
              <div class="content" v-show="tableDetail.flag">
                <img :src="tableDetail.data.snapshot" @error="imgErr" />
                <div class="date">{{tableDetail.data.snapshotTime}}</div>
              </div>
            </div>
          </div>
          </Col>
        </Row>
      </div>
    </div>
    <BShumanDetail :show.sync="detailModal" :value="detailData" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  components: {
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
      detailModal: false,
      detailData: {},
      tableHeight: 435,
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
        page: '',
        limit: '',
        sort: 2,
        simi: 2
      },
      sysList: [{ value: '0', label: '通行系统' }, { value: '1', label: '抓拍系统' }],
      columns: [
        {
          key: 'index',
          align: 'left',
          title: '序号',
          width: 60
        },
        {
          title: '对比时间',
          align: 'left',
          key: 'snapshotTime'
        },
        {
          title: '抓拍位置',
          align: 'left',
          key: 'resourcePoint'
        },
        {
          title: '操作',
          width: 120,
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
    })
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight - 68
  },
  methods: {
    ...mapActions(['getResTree', 'searchCompare']),
    showInfoModal(data) {
      this.detailModal = true
      this.detailData = data.row
      this.detailData.trackStart = this.condition.start
      this.detailData.trackEnd = this.condition.end
    },
    imgErr(e) {
      e.target.src = '/static/defaultFace.jpg'
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
      this.rowClassName = function() {}
      this.tableDetail.data = item
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
      this.$refs.devTree.getSelectedDeepIds().length > 0 &&
        (device = this.$refs.devTree
          .getSelectedDeepIds()
          .map((val, i) => {
            return i !== 0 ? '&device=' + val : val
          })
          .join(''))
      params.start = this.condition.start
      params.end = this.condition.end
      params.page = this.pageCur
      params.limit = this.pageLimit
      this.condition.sort !== 2 && (params.sort = this.condition.sort)
      this.condition.simi !== 2 && (params.simi = this.condition.simi)
      let payload = {
        url: '/human/inquiry/stranger?device=' + device,
        params: params
      }
      this.searchCompare(payload)
        .then(res => {
          if (!res.data[0]) {
            this.tableDetail.flag = false
            return
          }
          const moment = this.$moment
          this.tableDetail.data.snapshotTime = moment(parseInt(res.data[0].snapshotTime) * 1000).format(
            'YYYY-MM-DD HH:mm:ss'
          )
          this.tableDetail.data.resourcePoint = res.data[0].resourcePoint
          this.tableDetail.data.snapshot = res.data[0].snapshot
          this.rowClassName = function(row, index) {
            if (index === 0) {
              return 'ivu-table-row-highlight'
            }
            return ''
          }
          this.tableDetail.flag = true
        })
        .catch(err => {
          this.$Notice.warning({
            title: '检索失败',
            desc: err.response.data.message,
            duration: 1
          })
        })
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
.stranger-record-search {
  flex: 1;
  display: flex;
  flex-direction: column;
  .clearfix:after {
    content: '.';
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .compare-condition {
    padding: 12px 24px;
  }

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
        width: 12.5%;
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

  .thumbnail {
    padding-left: 10px;
    width: 100%;
    .title {
      width: 100%;
      height: 32px;
      line-height: 32px;
      background-color: #244575;
      color: #fff;
      text-indent: 10px;
      overflow: hidden;
    }
    .content {
      width: 100%;
      height: 0;
      padding: 0;
      padding-bottom: 100%;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        position: absolute;
      }
      .date {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        height: 26px;
        line-height: 26px;
        text-indent: 10px;
      }
    }
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
    margin: 0;
    width: 26%;
    margin-right: 20px;
  }
  .ivu-table-tip tr {
    height: 432px;
  }
}
.result-show /deep/ .ivu-tabs-nav .ivu-tabs-tab{
  padding:10px 24px;
}
</style>
