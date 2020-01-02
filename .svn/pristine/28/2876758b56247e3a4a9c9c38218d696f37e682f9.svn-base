<template>
  <div class="alarm-search">
    <div class="search-condition">
      <Form :model="condition" :rules="inforules" inline :label-width="85">
        <FormItem style="width:270px;margin-bottom:16px;" label="底库选择" prop="group">
          <Select v-model="condition.group">
            <Option value="all">全部</Option>
            <Option v-for="(item,j) in baseraryChange" :key="j" :value="item.label">{{item.value}}</Option>
          </Select>
        </FormItem>
        <FormItem style="width:270px;margin-bottom:20px;" label="姓名" prop="name">
          <Input type="text" v-model="condition.name" placeholder="请输入姓名">
          </Input>
        </FormItem>
        <FormItem style="width:270px;margin-bottom:16px;" label="性别" prop="gender">
          <Select v-model="condition.gender">
            <Option value="all">全部</Option>
            <Option value="2">男</Option>
            <Option value="1">女</Option>
          </Select>
        </FormItem>
        <FormItem style="width:270px;margin-bottom:16px;" label="相似度">
          <InputNumber :max="95" :min="50" v-model="similar" style="width: 90%"></InputNumber>
          <div style="float: right; width: 6%; font-size: 16px">%</div>
        </FormItem>
      </Form>
      <div class="search-time clearfix">
        <div class="time-date">
          <span class="search-label" style="line-height:32px;">时段选择</span>
          <BSdateRange :datetime="startTime" @timeChange="startChange" :width='225' :height='32'></BSdateRange>
          <span style="padding: 0 5px;line-height:32px;">至</span>
          <BSdateRange :datetime="endTime" @timeChange="endChange" :width='225' :height='32'></BSdateRange>
        </div>
        <div>
          <span class="search-pos">抓拍位置</span>
          <div class="camera-position">
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
        <div class="search-btn">
          <Button type="ghost" @click="startSearch()"><i class="iconfont icon-jiansuozhong" style="font-size:12px;"></i> 检索</Button>
          <Button type="ghost" :disabled="alarmList.length === 0" @click="exportData"><i class="iconfont icon-export" style="font-size:12px;"></i> 导出</Button>
        </div>
      </div>
    </div>
    <div class="cartogram">
      <ul class="tab-header clearfix">
        <li class="active">缩略图</li>
      </ul>
      <div class="search-img">
        <div class="search-image-list">
          <div v-if="!(dataListBlock[this.pageCur-1] && dataListBlock[this.pageCur-1].length)" class="no-result">暂无数据</div>
          <BaseImage v-for="(item,j) in dataListBlock[this.pageCur-1] || []" :key="j" :picInfo="item"></BaseImage>
        </div>
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
    <ExportList :isShow="isShowList" downType="alarm" @cancel="isShowList = false" :downInfo="downInfo" @startExport="startExport"></ExportList>
  </div>
</template>
<script>
import UUID from '../../assets/common/UUID'
import _ from 'lodash'
import BaseImage from './alarmsearch/BaseImage.vue'
import ExportList from './common/ExportList'
import toTreeData from 'src/assets/js/toTreeData.js'
import { mapState, mapMutations, mapActions } from 'vuex'
let bodyEle
export default {
  components: { BaseImage, ExportList },
  data() {
    return {
      condition: {
        group: 'all',
        name: '',
        gender: 'all'
      },
      similar: 75,
      startTime: this.beforeDawn(),
      endTime: new Date(),
      dateLimit: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      },
      devList: toTreeData([]),
      inforules: {
        name: [{ validator: this.validateName, trigger: 'change' }]
      },
      pageLimit: this.$PageInfo.limit,
      pageCur: 1,
      orgTreeSearch: '全部',
      isExpand: false,
      isSelect: false,
      treeOptionNum: 0,
      isSave: false,
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
  mounted() {
    this.getVerifaceTree()
      .then(res => {
        // 获取设备树
        this.devList = toTreeData([res.data])
        this.$nextTick(() => {
          if (this.defaultSearch) {
            // 是否直接检索
            this.startSearch()
            this.isSave = true
            this.SET_DEFAULT_SEARCH(false)
          }
          const selectTree = this.$refs.devTree ? this.$refs.devTree.getSelectedDeepNameIds() : {}
          this.treeOptionNum = selectTree.count
          bodyEle = document.getElementsByTagName('body')[0]
          bodyEle.addEventListener('click', this.listenerClick)
        })
      })
      .catch(err => {
        console.log('获取设备树出错', err)
      })
  },
  activated() {
    this.startTime = this.beforeDawn()
    this.endTime = new Date()
    this.$nextTick(() => {
      if (this.defaultSearch) {
        // 是否直接检索
        if (this.isSave) {
          this.startSearch()
          this.SET_DEFAULT_SEARCH(false)
        }
      }
    })
  },
  created() {
    this.getbaserary()
    this.getVerifaceParam()
  },
  watch: {
    isExpand(val) {
      if (!val) {
        this.orgTreeSearch = this.changeCamera()
      }
    }
  },
  computed: {
    ...mapState({
      alarmList: state => state.veriface.alarmList,
      baserary: state => state.veriface.baserary,
      defaultSearch: state => state.veriface.defaultSearch,
      verifaceParam: state => state.veriface.verifaceParam
    }),
    passerby() {
      return this.verifaceParam.passby
    },
    baseraryChange() {
      let list = JSON.parse(JSON.stringify(this.baserary))
      for (let i = 0; i < list.length; i++) {
        if (list[i].value === '路人库') {
          list.splice(i, 1)
        }
      }
      return list
    },
    realPage() { // 真实页数
      let realPage = this.dataBlockNum ? this.pageCur + this.dataBlockIndex * 10 : 0 // 真实页数
      return realPage
    }
  },
  methods: {
    ...mapMutations(['SET_ALARM_LIST', 'SET_DEFAULT_SEARCH', 'SET_ALARM_PAGE_INFO']),
    ...mapActions(['getVerifaceTree', 'getbaserary', 'getAlarmCondition', 'getVerifaceParam', 'getAlarmCount']),
    beforeDawn() {
      const start = new Date()
      start.setHours(0)
      start.setMinutes(0)
      start.setSeconds(0)
      start.setMilliseconds(0)
      return start
    },
    handlePageChange(page) {
      this.pageCur = page
    },
    changeCamera() {
      const selectTree = this.$refs.devTree ? this.$refs.devTree.getSelectedDeepNameIds() : {}
      if (selectTree.name.length === 0 || selectTree.name.length === this.treeOptionNum) {
        return '全部'
      } else {
        return selectTree.name.join(';')
      }
    },
    // 点击检索按钮
    startSearch() {
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
      if (!this.startTime) {
        this.warningMsg('开始时间不能为空！')
        return
      }
      if (!this.endTime) {
        this.warningMsg('结束时间不能为空！')
        return
      }
      this.condition.startTime = this.$moment(this.startTime).unix('X')
      this.condition.endTime = this.$moment(this.endTime).unix('X')
      if (parseInt(this.condition.endTime) - parseInt(this.condition.startTime) < 0) {
        this.warningMsg('开始时间不能大于结束时间！')
        return
      }
      this.condition.points = this.$refs.devTree.getSelectedDeepIds().toString() || ''
      this.condition.limit = this.pageLimit
      this.condition.similar = parseInt(this.similar)
      this.condition.opId = this.opId
      this.condition.arrow = this.arrow
      this.getAlarmCondition(this.condition)
        .then(res => {
          if (res.data && res.data.length) {
            if (isCallByBtn) {
              this.getAlarmCount(this.condition).then(countRes => {
                console.log('根据条件查询到报警数量信息：', countRes)
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
      param.limit = this.total > 99999 ? 99999 : this.total
      param.type = 'alarm'
      const str = []
      for (const item in param) {
        str.push(`${item}=${param[item]}`)
      }
      this.isShowList = true
      this.downInfo = str.join('&')
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
    validateName(rule, value, callback) {
      if (value.indexOf(' ') !== -1) {
        return callback(new Error('不能输入空格'))
      }
      let strlen = 0
      for (let i = 0; i < value.length; i++) {
        if (value.charCodeAt(i) > 255) {
          strlen += 2
        } else {
          strlen++
        }
      }
      if (strlen > 16) {
        return callback(new Error('请输入小于16位字符的内容'))
      } else {
        return callback()
      }
    },
    listenerClick(e) {
      if (e.target.classList.contains('input') || e.target.classList.contains('item') || e.target.classList.contains('treeliBox') || e.target.classList.contains('search-tree-info') || e.target.classList.contains('search')) {
        this.isExpand = true
      } else {
        this.isExpand = false
      }
    },
    startExport() {
      if (parseInt(this.total) >= 1000) {
        this.warningMsg('由于数据量较多，导出时间较长，请耐心等待!')
      }
    }
  },
  beforeDestroy() {
    // this.SET_ALARM_LIST([])
    // this.SET_ALARM_PAGE_INFO()
    bodyEle.removeEventListener('click', this.listenerClick)
  }
}
</script>
<style scoped>
.alarm-search {
  padding: 16px 0;
  width: 100%;
  height: 100%;
}
.search-condition {
  width: 100%;
  padding: 16px 0;
  background-color: #1b3153;
}
.search-time > div {
  float: left;
}
.search-time .time-date {
  display: flex;
  flex-direction: row;
}
.search-label {
  margin-left: 24px;
  margin-right: 10px;
}
.search-pos {
  margin-left: 36px;
  margin-right: 10px;
}
.search-btn {
  margin-left: 24px;
}
.search-btn > button {
  margin-left: 16px;
}
.clearfix:after {
  content: '.';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.cartogram {
  width: 100%;
  height: calc(100% - 115px);
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
.search-img {
  width: 100%;
  height: calc(100% - 36px);
  background-color: #1b3153;
  padding: 16px;
}

.search-image-list {
  width: 100%;
  height: calc(100% - 35px);
  overflow: auto;
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
.alarm-search .search-condition .camera-position {
  display: inline-block;
}
.alarm-search .search-condition .search .input {
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
.alarm-search .search-condition .input:focus {
  border-color: #6badfa;
  outline: 0;
  box-shadow: 0 0 0 0 #6badfa;
}
.alarm-search .search-condition .search .btn {
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
.alarm-search .search-tree-info {
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
.alarm-search .search-tree-info.hidden {
  display: none;
}
.el-pagination.is-background li{
  background-color: #3c5073 !important;
  color: #fff !important;
}
.el-pagination.is-background li.active{
  background-color: #4699f9 !important;
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
</style>
