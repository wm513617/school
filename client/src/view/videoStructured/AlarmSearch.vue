<template>
  <div class="alarm-search">
    <div class="search-condition clearfix">
      <Form :model="controlTask" inline :label-width="85" style="float:left;">
        <FormItem style="width:270px;margin-bottom:0;" label="布控任务" prop="taskName">
          <Select v-model="controlTask.taskName" filterable>
            <Option value="all">全部</Option>
            <Option v-for="(item,j) in cotlTaskNameList" :key="j" :value="item.label">{{item.label}}</Option>
          </Select>
        </FormItem>
      </Form>
      <div class="search-time clearfix">
        <div class="time-date">
          <span class="search-label" style="line-height:32px;">开始时间</span>
          <BSdateRange :datetime="startTime" @timeChange="startChange" :width='225' :height='32'></BSdateRange>
          <span class="search-label" style="line-height:32px;">结束时间</span>
          <BSdateRange :datetime="endTime" @timeChange="endChange" :width='225' :height='32'></BSdateRange>
        </div>
        <div>
          <span class="search-pos">选择通道</span>
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
          <Button type="ghost" @click="search"><i class="iconfont icon-jiansuozhong" style="font-size:12px;"></i> 检索</Button>
          <Button type="ghost" :disabled="cotlMageAlarmList.length === 0" @click="exportData"><i class="iconfont icon-export" style="font-size:12px;"></i> 导出</Button>
        </div>
      </div>
    </div>
    <div class="cartogram">
      <div class="search-img">
        <div class="search-image-list">
          <div v-if="cotlMageAlarmList.length === 0" class="no-result">暂无数据</div>
          <ImageCard v-for="(item,j) in cotlMageAlarmList" :key="j" :info="item" targetType="1"></ImageCard>
        </div>
        <div  class="clearfix" style="width: 100%; background-color: #244575;">
          <Page :page-size="pageLimit" @on-page-size-change="pageSizeChange" @on-change="handlePageChange" :current="pageInfo.current" :total="pageInfo.count" :page-size-opts="$PageInfo.size" style="float:right;" show-sizer show-elevator show-total></Page>
        </div>
      </div>
    </div>
    <ExportList :isShow="isShowList" downType="strucAlarm" :downInfo="downInfo" @cancel="isShowList = false"></ExportList>
  </div>
</template>
<script>
import ImageCard from './common/ImageCard'
import ExportList from './common/ExportList'
import toTreeData from 'src/assets/js/toTreeData.js'
import { mapState, mapActions, mapMutations } from 'vuex'
let bodyEle
export default {
  components: { ImageCard, ExportList },
  data() {
    return {
      controlTask: {
        taskName: 'all'
      },
      startTime: this.beforeDawn(),
      endTime: new Date(),
      devList: toTreeData([]),
      pageLimit: this.$PageInfo.limit,
      pageCur: 1,
      orgTreeSearch: '全部',
      isExpand: false,
      isSelect: false,
      treeOptionNum: 0,
      isShowList: false,
      downInfo: {}
    }
  },
  mounted() {
    this.getVideoStructTree().then(res => { // 获取设备树
      this.devList = toTreeData([res.data])
      this.$nextTick(() => {
        const selectTree = this.$refs.devTree ? this.$refs.devTree.getSelectedDeepNameIds() : {}
        this.treeOptionNum = selectTree.count
        // 是否跳转路径，默认检索
        if (this.defaultSearch) {
          this.search()
        }
        bodyEle = document.getElementsByTagName('body')[0]
        bodyEle.addEventListener('click', this.listenerClick)
      })
    }).catch(err => {
      console.log('获取设备树出错', err)
    })
  },
  activated() {
    this.startTime = this.beforeDawn()
    this.endTime = new Date()
    // 是否跳转路径，默认检索
  },
  created() {
    this.getCotlMageTask({page: 1, limit: 100}).then(res => { // 获取布控任务列表
      if (res.data && res.data.total && (res.data.total > 100)) {
        this.getCotlMageTask({page: 1, limit: res.data.total})
      }
    })
  },
  watch: {
    isExpand(val) {
      if (val) {
        this.orgTreeSearch = ''
      } else {
        this.orgTreeSearch = this.changeCamera()
      }
    }
  },
  computed: {
    ...mapState({
      cotlMageAlarmList: ({ videoStructured }) => videoStructured.cotlMageAlarmList,
      cotlTaskNameList: ({ videoStructured }) => videoStructured.cotlTaskNameList,
      pageInfo: ({ videoStructured }) => videoStructured.structAlarmPageinfo,
      defaultSearch: ({ videoStructured }) => videoStructured.defaultStructAlarmSearch
    })
  },
  methods: {
    ...mapMutations(['SET_COLMAGE_ALARM_LIST', 'SET_STRUCT_ALARM_PAGE_INFO', 'SET_DEFAULT_STRUCT_ALARM_SEARCH']),
    ...mapActions(['getVideoStructTree', 'getCotlMageTask', 'getStructAlarmData']),
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
    handlePageChange(page) {
      this.pageCur = page
      this.search()
    },
    pageSizeChange(n) {
      this.pageCur = 1
      this.pageLimit = n
      this.search()
    },
    search() {
      if (!this.checkTime()) {
        this.warningMsg('时间段最大间隔为7天!')
        return
      }
      let param = {}
      let data = {}
      data.startTime = this.$moment(this.startTime).valueOf()
      data.endTime = this.$moment(this.endTime).unix('X') * 1000 + 999
      if (parseInt(data.endTime) - parseInt(data.startTime) < 0) {
        this.warningMsg('开始时间不能大于结束时间！')
        return
      }
      param.page = this.pageCur || 1
      param.limit = this.pageLimit
      const videoChannel = this.$refs.devTree.getSelectedDeepIds().toString() || ''
      if (videoChannel && videoChannel !== 'all') {
        data.videoChannel = videoChannel
      }
      if (this.controlTask.taskName !== 'all') {
        data.taskName = this.controlTask.taskName
      }
      this.getStructAlarmData({ ...param, data: data }).then(res => {
        if (!(res.data && res.data.length)) {
          this.warningMsg('查询无结果！')
        }
      }).catch(() => {
        this.errorMsg('检索失败！')
      })
    },
    exportData() {
      let data = {}
      data.startTime = this.$moment(this.startTime).valueOf()
      data.endTime = this.$moment(this.endTime).valueOf()
      if (parseInt(data.endTime) - parseInt(data.startTime) < 0) {
        this.warningMsg('开始时间不能大于结束时间！')
        return
      }
      const videoChannel = this.$refs.devTree.getSelectedDeepIds().toString() || ''
      if (videoChannel && videoChannel !== 'all') {
        data.videoChannel = videoChannel
      }
      if (this.controlTask.taskName !== 'all') {
        data.taskName = this.controlTask.taskName
      }
      this.downInfo = data
      this.isShowList = true
    },
    startChange(val) {
      this.startTime = val.dateTimes
      if (this.startTime.getTime() > this.endTime.getTime()) {
        this.endTime = this.startTime
      }
    },
    endChange(val) {
      this.endTime = val.dateTimes
      if (this.startTime.getTime() > this.endTime.getTime()) {
        this.startTime = this.endTime
      }
    },
    checkTime() {
      const curend = this.$moment(this.endTime).unix('X')
      const end = this.$moment(this.$moment(this.startTime).add(7, 'days')).unix('X')
      if (curend > end) {
        this.endTime = new Date(end * 1000)
        return false
      }
      return true
    },
    listenerClick(e) {
      if (e.target.classList.contains('input') || e.target.classList.contains('item') || e.target.classList.contains('treeliBox') || e.target.classList.contains('search-tree-info') || e.target.classList.contains('search')) {
        this.isExpand = true
      } else {
        this.isExpand = false
      }
    }
  },
  beforeDestroy() {
    this.SET_COLMAGE_ALARM_LIST([])
    this.SET_STRUCT_ALARM_PAGE_INFO({
      current: 1,
      count: 0,
      limit: 100
    })
    this.SET_DEFAULT_STRUCT_ALARM_SEARCH(false)
    bodyEle && bodyEle.removeEventListener('click', this.listenerClick)
  }
}
</script>
<style>
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
  height: calc(100% - 81px);
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
  height: 100%;
  background-color: #1b3153;
  margin-top: 16px;
}

.search-image-list {
  width: 100%;
  height: calc(100% - 35px);
  padding: 16px;
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
  width:390px;
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
  width: 390px;
  max-height: 372px;
  overflow-y: auto;
  z-index: 1;
}
.alarm-search .search-tree-info.hidden {
  display: none;
}
</style>
