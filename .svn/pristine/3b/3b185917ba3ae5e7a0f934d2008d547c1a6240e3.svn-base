<template>
  <div class="track-page">
    <!-- 条件检索 -->
    <div class="track-condition clearfix">
      <div class="condition">
        <div  class="time-date">
          <span class="search-label" style="line-height:32px;">时间段</span>
          <BSdateRange :datetime="startTime" @timeChange="startChange" :width='225' :height='32'></BSdateRange>
          <span style="padding: 0 5px;line-height:32px;">至</span>
          <BSdateRange :datetime="endTime" @timeChange="endChange" :width='225' :height='32'></BSdateRange>
        </div>
        <Form :model="condition" inline :label-width="60">
          <FormItem label="性别" prop="personSex" style="margin-bottom:16px;">
            <Select v-model="condition.gender" placeholder="请选择" style="width:240px;">
              <Option value="all">全部</Option>
              <Option value="2">男</Option>
              <Option value="1">女</Option>
            </Select>
          </FormItem>
          <FormItem label="年龄范围" style="margin-left:16px;margin-bottom:16px;">
            <Input-number :max="99"
              :min="0"
              v-model="condition.startAge"
              :formatter="value => parseInt(value)"
              class="age-num"></Input-number>
              <span class="age-size">至</span>
            <Input-number :max="100"
              :min="condition.startAge"
              v-model="condition.endAge"
              :formatter="value => parseInt(value)"
              class="age-num"></Input-number>
          </FormItem>
        </Form>
        <div class="search-tree-select">
          <span class="search-pos">抓拍位置</span>
          <div class="camera-position" style="margin-left: 12px;">
            <div class="search">
              <input v-model="orgTreeSearch" @focus="isExpand = true; orgTreeSearch = ''" @blur="isSelect? '': isExpand = false" :icon="isExpand ? 'arrow-up-b' : 'arrow-down-b'" type="text" class="input" placeholder="请输入..." ></input>
              <button class="btn" @click.stop="isExpand = !isExpand; if (isExpand) { orgTreeSearch = '' }">
                <Icon :type="isExpand ? 'arrow-up-b' : 'arrow-down-b'"></Icon>
              </button>
            </div>
            <div :class="['search-tree-info', isExpand? '':'hidden']" @mouseenter.stop="isSelect = true" @mouseleave.stop="isSelect = false">
                <VTree ref="devTree"
                  :searchVal="orgTreeSearch"
                  :treeData="devList"
                  :options="{showInput: true}"></VTree>
            </div>
          </div>
        </div>
        <Form :model="condition" inline :label-width="60">
          <FormItem label="入库状态" prop="writeSdk" style="margin-bottom:16px;">
            <Select v-model="condition.writeSdk" placeholder="请选择" style="width:240px;">
              <Option value="all">全部</Option>
              <Option value="1">入库成功</Option>
              <Option value="0">入库失败</Option>
            </Select>
          </FormItem>
          <Button class="search-btn" type="ghost" @click="startSearch"><i class="iconfont icon-jiansuozhong" style="font-size:12px;"></i> 检索</Button>
          <Button class="search-btn" type="ghost" :disabled="passerList.length === 0" @click="exportData"><i class="iconfont icon-export" style="font-size:12px;"></i> 导出</Button>
        </Form>
      </div>
    </div>
    <div class="search-image clearfix">
      <ul class="tab-header clearfix">
        <li class="active">缩略图</li>
      </ul>
      <div class="search-image-list">
        <div v-if="!(dataListBlock[this.pageCur-1] && dataListBlock[this.pageCur-1].length)" class="no-result">暂无数据</div>
        <SingImage v-for="(item,j) in dataListBlock[this.pageCur-1] || []" :key="j" :picInfo="item"></SingImage>
        <div class="pager">
          <ul class="page-list">
            <li class="page-item" title="上一页" @click="prevPage" :class="{'page-item-disabled': realPage <= 1}"><a :disabled="{'page-item-disabled': realPage <= 1}" :style="{'color': (realPage <= 1) ? '#666' : '#fff'}"><i class='iconfont icon-jiantou-copy'></i></a></li>
            <li v-for="i in pageNumForBlock" v-show="realPage <= realMaxPage" :key="i" class="page-item" :class="{'page-item-actived': pageCur === i}" @click="handlePageChange(i)"><a> {{10*dataBlockIndex+i}} </a></li>
            <li class="page-item" title="下一页" @click="nextPage" :class="{'page-item-disabled': realPage >= realMaxPage}"><a :disabled="{'page-item-disabled': realPage >= realMaxPage}" :style="{'color': (realPage >= realMaxPage) ? '#666' : '#fff'}"><i class='iconfont icon-jiantou'></i></a></li>
          </ul>
          <span style="margin-left:20px; padding-right:20px; float:right; line-height:2.5;">共 {{total || 0 }} 条</span>
        </div>
      </div>
    </div>
    <ExportList :isShow="isShowList" downType="passby" @cancel="isShowList = false" :downInfo="downInfo" @startExport="startExport"></ExportList>
  </div>
</template>
<script>
import UUID from 'assets/common/UUID'
import _ from 'lodash'
import toTreeData from 'src/assets/js/toTreeData.js'
import SingImage from '../passer/SingImage'
import ExportList from '../common/ExportList'
import { mapState, mapMutations, mapActions } from 'vuex'
let bodyEle
export default {
  components: { SingImage, ExportList },
  data() {
    return {
      devList: toTreeData([]),
      condition: {
        startTime: '' || this.$moment(this.$moment().format('YYYY-MM-DD')).unix('X'),
        endTime: '' || this.$moment().unix('X'),
        gender: 'all',
        startAge: 0,
        endAge: 100,
        points: '',
        group: 'stranger',
        page: '',
        limit: 100,
        writeSdk: 'all'
      },
      startTime: '',
      endTime: '',
      dateLimit: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      },
      pageLimit: this.$PageInfo.limit,
      pageCur: 1,
      orgTreeSearch: '全部',
      isExpand: false,
      isSelect: false,
      treeOptionNum: 0,
      opId: '',
      arrow: 1,
      dataListBlock: [],
      pageSize: 100, // 每页数量
      blockSize: 1000, // 每区域块数量
      dataBlockIndex: 0, // 数据区块索引
      realMaxPage: 0, // 实际最大页数
      dataBlockNum: 0, // 数据块的个数
      pageNumForBlock: 0, // 当前数据块的页数
      total: 0, // 数据总数
      isShowList: false,
      downInfo: ''
    }
  },
  computed: {
    ...mapState({
      passerList: state => state.veriface.passerList,
      pageInfo: state => state.veriface.passerPageinfo,
      defaultSearch: state => state.veriface.defaultSearch,
      verifaceParam: state => state.veriface.verifaceParam
    }),
    passerby() {
      return this.verifaceParam.passby
    },
    realPage() { // 真实页数
      let realPage = this.dataBlockNum ? this.pageCur + this.dataBlockIndex * 10 : 0 // 真实页数
      return realPage
    }
  },
  mounted() {
    if (this.passerby) {
      this.getVerifaceTree()
        .then(res => {
          // 获取设备树
          this.devList = toTreeData([res.data])
          this.$nextTick(() => {
            const selectTree = this.$refs.devTree ? this.$refs.devTree.getSelectedDeepNameIds() : {}
            this.treeOptionNum = selectTree.count
            if (this.defaultSearch) {
              // 是否直接检索
              this.startTime = this.beforeDawn()
              this.endTime = new Date()
              this.startSearch()
              this.SET_DEFAULT_SEARCH(false)
            }
            bodyEle = document.getElementsByTagName('body')[0]
            bodyEle.addEventListener('click', this.listenerClick)
          })
        })
        .catch(err => {
          console.log('获取设备树出错', err)
        })
    }
  },
  watch: {
    isExpand(val) {
      if (!val) {
        this.orgTreeSearch = this.changeCamera()
      }
    }
  },
  created() {
    this.setDate() // 设置默认时间段为近一个月
    this.getVerifaceParam()
  },
  methods: {
    ...mapMutations(['SET_PASSER_LIST', 'SET_DEFAULT_SEARCH', 'SET_PASSER_CONDITION']),
    ...mapActions(['getVerifaceTree', 'getPasserCondition', 'getVerifaceParam', 'gettPasserCount']),
    listenerClick(e) {
      console.log(e.target.classList, 'contains')
      if (e.target.classList.contains('input') || e.target.classList.contains('item') || e.target.classList.contains('treeliBox') || e.target.classList.contains('search-tree-info') || e.target.classList.contains('search')) {
        this.isExpand = true
      } else {
        this.isExpand = false
      }
    },
    setDate() {
      this.startTime = this.$moment(new Date()).format('YYYY-MM-DD') + ' 00:00:00'
      this.endTime = new Date()
    },
    beforeDawn() {
      const start = new Date()
      start.setHours(0)
      start.setMinutes(0)
      start.setSeconds(0)
      start.setMilliseconds(0)
      return start
    },
    changeCamera() {
      const selectTree = this.$refs.devTree ? this.$refs.devTree.getSelectedDeepNameIds() : {}
      if (selectTree.name.length === 0 || selectTree.name.length === this.treeOptionNum) {
        return '全部'
      } else {
        return selectTree.name.join(';')
      }
    },
    startSearch() { // 点击检索按钮
      // const end = this.$moment(this.$moment(this.startTime).add(7, 'days')).unix('X')
      // const curend = this.$moment(this.endTime).unix('X')
      // if (curend > end) {
      //   this.warningMsg('时间段最大间隔为7天!')
      //   return
      // }
      this.arrow = 1
      this.total = 0
      this.pageCur = 1
      this.opId = UUID()
      this.dataBlockIndex = 0
      this.search()
    },
    nextPage() { // 下一页操作
      // console.log('执行下一页！')
      if (this.realPage < this.realMaxPage) { // 不是最大页时
        if (this.pageCur === this.pageNumForBlock && this.dataBlockIndex < this.dataBlockNum - 1) { // 数据块里最后一页并且数据块不是最后一个时，跳转到下一个数据块
          this.arrow = 1
          this.dataBlockIndex++
          this.dataBlockIndex = this.dataBlockIndex <= this.dataBlockNum - 1 ? this.dataBlockIndex : this.dataBlockNum - 1
          this.search(false)
        } else { // 不是数据块里的最大页时，跳转到数据块里的下一页
          let page = this.pageCur + 1
          this.handlePageChange(page)
        }
      }
    },
    prevPage() { // 上一页操作
      // console.log('执行上一页！')
      if (this.realPage > 1) { // 不是真实第一页
        if (this.pageCur === 1 && this.dataBlockIndex) { // 数据块里的第一页数据，并且数据块不是第一个，查询上一个数据块
          this.arrow = 0
          this.dataBlockIndex--
          this.dataBlockIndex = this.dataBlockIndex >= 0 ? this.dataBlockIndex : 0
          this.search(false)
        } else { // 不是数据块里的第一页时，切换到数据块里的上一页
          let page = this.pageCur - 1
          this.handlePageChange(page)
        }
      }
    },
    search(isCallByBtn = true) {
      this.pageNumForBlock = 0
      if (!this.passerby) {
        this.warningMsg('未开启路人库!')
        return
      }
      if (!this.startTime) {
        this.warningMsg('开始时间不能为空！')
        return
      }
      if (!this.endTime) {
        this.warningMsg('结束时间不能为空！')
        return
      }
      if (this.condition.startAge === null || this.condition.endAge === null) {
        this.warningMsg('年龄范围不能为空！')
        return
      }
      if (this.condition.writeSdk !== 'all') {
        this.condition.writeSdk = String(this.condition.writeSdk)
      }
      this.condition.opId = this.opId
      this.condition.arrow = this.arrow
      this.condition.startTime = this.$moment(this.startTime).unix('X')
      this.condition.endTime = this.$moment(this.endTime).unix('X')
      if (parseInt(this.condition.endTime) - parseInt(this.condition.startTime) < 0) {
        this.warningMsg('开始时间不能大于结束时间！')
        return
      }
      this.condition.points = this.$refs.devTree.getSelectedDeepIds().toString() || ''
      this.condition.page = Number(this.pageCur) || 1
      this.condition.limit = Number(this.pageLimit)
      const param = {
        ...this.condition
      }
      if (param.writeSdk === 'all') {
        delete param.writeSdk
      }
      this.getPasserCondition(param)
        .then(res => {
          if (res.data && res.data.length) {
            if (isCallByBtn) {
              this.gettPasserCount(param).then(countRes => {
                // console.log('根据条件查询到报警数量信息：', countRes)
                this.total = Number(countRes.data)
                this.realMaxPage = Math.ceil(this.total / this.pageSize) // 真实最大页数
                this.dataBlockNum = Math.ceil(this.total / this.blockSize) // 数据块数
              })
            }
            this.pageNumForBlock = Math.ceil(res.data.length / this.pageSize)
            this.dataListBlock = _.chunk(res.data, this.pageLimit)
            if (isCallByBtn) { // 通过点击查询按钮查询时
              this.dataBlockIndex = 0
            }
            this.pageCur = 1
          } else {
            this.warningMsg('查询无结果！')
          }
        })
        .catch(() => {
          this.errorMsg('检索失败！')
        })
    },
    handlePageChange(page) {
      this.pageCur = page
    },
    exportData() {
      if (parseInt(this.total) > 10000) {
        this.warningMsg('每次最多导出10000条数据！')
        return
      }
      this.condition.startTime = this.$moment(this.startTime).unix('X')
      this.condition.endTime = this.$moment(this.endTime).unix('X')
      if (parseInt(this.condition.endTime) - parseInt(this.condition.startTime) < 0) {
        this.warningMsg('开始时间不能大于结束时间！')
        return
      }
      this.condition.points = this.$refs.devTree ? this.$refs.devTree.getSelectedDeepIds().toString() : ''
      const param = JSON.parse(JSON.stringify(this.condition))
      param.type = 'passby'
      if (param.writeSdk === 'all') {
        delete param.writeSdk
      }
      param.limit = this.pageInfo.count > 99999 ? 99999 : this.pageInfo.count
      const str = []
      for (const item in param) {
        str.push(`${item}=${param[item]}`)
      }
      this.downInfo = str.join('&')
      this.isShowList = true
    },
    startChange(val) {
      this.startTime = val.dateTimes
      if (this.startTime.getTime() > this.endTime.getTime()) {
        this.endTime = this.startTime
      }
      this.checkTime('s')
    },
    endChange(val) {
      this.endTime = val.dateTimes
      if (this.startTime.getTime() > this.endTime.getTime()) {
        this.startTime = this.endTime
      }
      this.checkTime('v')
    },
    checkTime(s) {
      if (s === 's') {
        const curend = this.$moment(this.endTime).unix('X')
        const end = this.$moment(this.$moment(this.startTime).add(7, 'days')).unix('X')
        if (curend > end) {
          this.endTime = new Date(end * 1000)
          this.warningMsg('时间段最大间隔为7天!')
        }
      } else {
        const curstart = this.$moment(this.startTime).unix('X')
        const start = this.$moment(this.$moment(this.endTime).subtract(7, 'days')).unix('X')
        if (curstart < start) {
          this.startTime = new Date(start * 1000)
          this.warningMsg('时间段最大间隔为7天!')
        }
      }
    },
    startExport() {
      if (parseInt(this.total) >= 1000) {
        this.warningMsg('由于数据量较多，导出时间较长，请耐心等待!')
      }
    }
  },
  beforeDestroy() {
    // this.SET_PASSER_LIST([])
    // this.SET_PASSER_CONDITION()
    bodyEle.removeEventListener('click', this.listenerClick)
  }
}
</script>
<style scoped>
.track-page {
  width: 100%;
  height: 100%;
}
.track-condition {
  width: 100%;
}
.condition {
  width: 100%;
  padding: 16px 24px;
  padding-bottom: 0;
  background-color: #1b3153;
}
.age-size {
  margin: 0 5px;
  float: left;
  width: 16px;
  display: block;
  height: 32px;
}
.age-num {
  width: 64px;
  height: 32px;
  float: left;
}
.search-btn {
  margin-left: 24px;
}
.search-image {
  width: 100%;
  height: calc(100% - 114px);
  background-color: #1b3153;
}
.tab-header {
  width: 100%;
  list-style: none;
  outline: none;
  background: #0f2243;
}
.tab-header li {
  height: 38px;
  float: left;
  padding: 0 24px;
  line-height: 38px;
  font-size: 14px;
  border-top: 2px solid #0f2343;
  outline: none;
  cursor: pointer;
  color: #8c8e98;
}
.tab-header .active {
  color: #fff;
  border-top: 2px solid #0f2243;
  background: #1c3054;
}
.search-image-list {
  width: 100%;
  height: calc(100% - 80px);
  overflow: auto;
  padding: 12px 24px;
  display: flex;
  flex-wrap: wrap;
  align-content: start;
  align-items: start;
}
.search-image-list .no-result {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.clearfix:after {
  content: '.';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.condition .time-date {
  float:left;
  display: flex;
  flex-direction: row;
  margin-right: 23px;
}
.condition .time-date .search-label {
  margin-right: 9px;
  width: 50px;
  display: inline-block;
  text-align: right;
}
.condition .search .input {
  width:470px;
  display: inline-block;
  height: 32px;
  line-height: 1.5;
  padding: 4px 7px;
  font-size: 12px;
  border: 1px solid #5676a9;
  border-radius: 4px;
  color: #ffffff;
  background-color: #1b3153;
  background-image: none;
  position: relative;
  cursor: text;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.condition .input:focus {
  border-color: #6badfa;
  outline: 0;
  box-shadow: 0 0 0 0 #6badfa;
}
.condition .search .btn {
  border: none;
  font-size: 14px;
  background: transparent;
  color: #fff;
  outline: none;
  cursor: pointer;
  position: relative;
  right: 19px;
  top: 1px;
}
.search-tree-info {
  position: absolute;
  border: #4699f9 1px solid;
  border-radius: 4px;
  padding: 5px;
  margin-top: 8px;
  background-color: #1b3153;
  width: 470px;
  max-height: 372px;
  overflow-y: auto;
  z-index: 1;
}
.search-tree-info.hidden {
  display: none;
}
.pager {
  position: absolute;
  right: 24px;
  bottom: 20px;
}
.page-list {
  float: right;
  list-style: none;
  padding: 0px;
  margin: 0px;
}
.page-item {
  display: inline-block;
  vertical-align: middle;
  min-width: 32px;
  height: 32px;
  line-height: 30px;
  margin-right: 4px;
  text-align: center;
  background: rgb(60, 80, 115);
  user-select: none;
  cursor: pointer;
  font-family: Arial;
  list-style: none;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(86, 118, 169);
  border-image: initial;
  border-radius: 4px;
  transition: border 0.2s ease-in-out, color 0.2s ease-in-out;
}
.page-list li:hover {
  background: rgb(27, 49, 83);
  border-color: rgb(70, 153, 249);
}
.page-item a {
  color: rgb(255, 255, 255);
  margin: 0px 6px;
  text-decoration: none;
  cursor: pointer;
  background: transparent;
  outline: none;
  transition: color 0.2s ease;
}
.page-item-disabled {
  cursor: not-allowed;
}
.page-item-actived {
  background: rgb(27, 49, 83);
  border-color: rgb(70, 153, 249);
}
.search-tree-select .search-pos {
  line-height:32px;
}
.search-tree-select {
  float: left;
  display: flex;
  margin-right: 12px;
  margin-bottom: 16px;
}
</style>
