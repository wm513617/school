<template>
  <div class="stranger-record-search">
    <!--筛选框-->
    <div class="compare-condition">
      <Form :model="condition" inline :label-width="80">
        <Form-item label="时间段选择">
          <Row>
            <Col span="24">
            <Date-picker :options="{
                disabledDate (date) {
                  return date && date.valueOf() > Date.now()
                }
              }" @on-open-change="dateOC" @on-clear="condition.start = '';condition.end = '';" style="width:100%;" type="datetimerange" v-model="dateRange" :clearable="false"></Date-picker>
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
          <Button type="ghost" @click="pageCur = 1;retrieval()" style="width: 100px">检索</Button>
        </Form-item>
      </Form>
    </div>
    <!--内容显示框-->
    <div class="result-show">
      <Tabs value="thumbnail">
        <TabPane label="缩略图" name="thumbnail">
          <div class="tips" v-if="resultList.length <= 0">
            暂无数据
          </div>
          <ul class="thumbnail-list clearfix" v-if="resultList.length > 0">
            <li v-for="item of resultList">
              <div class="thumbnail">
                <div class="title">{{item.resourcePoint}}</div>
                <div class="content">
                  <img :src="item.snapshot" @error="imgErr" />
                  <div class="date">{{item.snapshotTime}}</div>
                </div>
              </div>
            </li>
          </ul>
          <div class="page-warp clearfix" style="border: none;" v-if="resultList.length > 0">
            <!--<span class="left-info">显示 {{resultList[0].index}} - {{resultList[resultList.length - 1].index}} 条，共{{pageTotal}}条记录</span>-->
            <Page :current="pageCur" show-total :page-size="pageLimit" :total="pageTotal" show-elevator @on-change="handlePageChange"></Page>
          </div>
        </TabPane>
        <TabPane label="列表" name="list">
          <Row>
            <Col span="22">
            <Table size="small" :row-class-name="rowClassName" highlight-row :columns="columns" :data="resultList" @on-row-click="showRowInfo"></Table>
            <div class="page-warp clearfix" v-if="resultList.length > 0">
              <!--<span class="left-info">显示 {{resultList[0].index}} - {{resultList[resultList.length - 1].index}} 条，共{{pageTotal}}条记录</span>-->
              <Page :current="pageCur" show-total :page-size="pageLimit" :total="pageTotal" show-elevator @on-change="handlePageChange"></Page>
            </div>
            </Col>
            <Col span="2">
            <div class="thumbnail">
              <div class="title">{{tableDetail.data.resourcePoint}}</div>
              <div style="width:100%; height: 136px; background: #171717;">
                <div class="content" v-show="tableDetail.flag">
                  <img :src="tableDetail.data.snapshot" @error="imgErr" />
                  <div class="date">{{tableDetail.data.snapshotTime}}</div>
                </div>
              </div>
            </div>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
      <div class="operate">
        <Button type="ghost" @click="listSort($event, 'sort')">按时间排序</Button>
      </div>
    </div>
    <BShumanDetail :show.sync="detailModal" :value="detailData" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import BStabs from 'components/tabs/BStabs'
import BStabPane from 'components/tabs/BStabPane'
import ContrastItem from '../../face/common/ContrastItem'
import VTree from 'components/tree/VTree'
import VInput from 'components/common/VInput'
import BShumanDetail from 'components/BShumanDetail'
export default {
  components: {
    BStabs,
    BStabPane,
    ContrastItem,
    VTree,
    VInput,
    BShumanDetail
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
      tableDetail: {
        flag: false,
        data: {}
      },
      pageLimit: 20,
      pageCur: 1,
      dateRange: [this.beforeDawn(), new Date()],
      condition: {
        sys: '0',
        device: '',
        start: 0,
        end: 0,
        page: '',
        limit: '',
        sort: 2,
        simi: 2
      },
      sysList: [
        { value: '0', label: '通行系统' },
        { value: '1', label: '抓拍系统' }
      ],
      columns: [
        {
          key: 'index',
          align: 'left',
          title: '序号'
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
      devList: [
        {
          expand: true,
          title: '机构1',
          checked: true,
          _id: 1,
          children: [
            {
              title: '子机构 1-0',
              expand: true,
              _id: 2,
              children: [
                {
                  title: 'leaf',
                  _id: 3
                },
                {
                  title: 'leaf',
                  _id: 4
                }
              ]
            },
            {
              title: 'parent 1-1',
              expand: true,
              _id: 5,
              children: [
                {
                  title: '<span style="color: red">leaf</span>',
                  _id: 6,
                  children: [
                    {
                      title: '孙子吉',
                      _id: 8
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
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
      this.rowClassName = function() { }
      this.tableDetail.flag = true
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
      params.sys = this.condition.sys
      this.$refs.devTree.getSelectedDeepIds().length > 0 &&
        (params.device = this.$refs.devTree
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
      var payload = {
        url: '/human/inquiry/stranger',
        params: params
      }
      this.searchCompare(payload)
        .then(res => {
          if (!res.data[0]) {
            this.tableDetail.flag = false
            return
          }
          const moment = this.$moment
          this.tableDetail.data.snapshotTime = moment(
            parseInt(res.data[0].snapshotTime) * 1000
          ).format('YYYY-MM-DD HH:mm:ss')
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
      var start = new Date()
      start.setHours(0)
      start.setMinutes(0)
      start.setSeconds(0)
      start.setMilliseconds(0)
      return start
    },
    rowClassName() { }
  }
}
</script>

<style lang="less" scoped>
.stranger-record-search{
  flex:1;
}
.clearfix:after {
  content: '.';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.compare-condition {
  padding: 10px 20px 0;
}

.thumbnail {
  padding-left: 10px;
  width: 100%;
  .title {
    width: 100%;
    height: 40px;
    line-height: 40px;
    background-color: #5d5d5d;
    color: #fff;
    text-indent: 10px;
  }
  .content {
    width: 100%;
    height: 0;
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
    float: left;
  }
  .ivu-page {
    float: right;
    margin-right: 10px;
  }
}

.result-show {
  position: relative;
  .tips {
    text-align: center;
    line-height: 432px;
  }
  .thumbnail-list {
    width: 100%;
    list-style: none;
    li {
      float: left;
      width: 10%;
      padding: 10px;
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
  margin-right: 0;
  width: 26%;
  margin-bottom: 20px;
}
</style>
