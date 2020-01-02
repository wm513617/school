<template>
  <div class="track-page">
    <!-- 以图搜图 -->
    <div class="track-condition clearfix">
      <div class="img-upload">
        <Upload :on-success="uploadSuccess" :on-error="uploadImgError" :on-format-error="formatError" :on-exceeded-size="exceededSize" action="/api/upload/file?type=image&category=temp" :max-size="2048" :format="['jpg','png','bmp','jpeg']" :show-upload-list="false">
          <img v-if="imageUrl" :src="imageUrl" style="width:52px;height:66px;"/>
          <div v-else class="img-up-icon">
            <i class="ivu-icon ivu-icon-ios-cloud-upload-outline"></i>
            <p>点击上传图片</p>
          </div>
          <p>支持JPG、JPEG、PNG、BMP格式的图片,大小不超过2M</p>
        </Upload>
      </div>
      <div class="condition">
        <div>
        <div class="time-date">
          <span class="search-label" style="line-height:32px;">时间段</span>
          <BSdateRange :datetime="startTime" @timeChange="startChange" :width='225' :height='32'></BSdateRange>
          <span style="padding: 0 5px;line-height:32px;">至</span>
          <BSdateRange :datetime="endTime" @timeChange="endChange" :width='225' :height='32'></BSdateRange>
        </div>
        <div class="similar">
          <span class="search-label">相似度</span>
          <!-- <Select v-model="similar" style="width:200px;">
            <Option v-for="(item,j) in pecentNum" :key="j" :value="item">{{item}}</Option>
          </Select> -->
          <InputNumber :max="95" :min="50" v-model="similar" style="width:200px;"></InputNumber>
          <div style="float: right; font-size: 16px; padding-top: 4px; padding-left: 5px;">%</div>
        </div>
        </div>
        <div>
        <div class="search-pos">
          <span class="search-label">抓拍位置</span>
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
          <Button type="ghost" @click="startSearch"><i class="iconfont icon-jiansuozhong" style="font-size:12px;"></i> 检索</Button>
          <Button style="margin-left:15px" type="ghost" :disabled="passerImageList.length === 0" @click="exportData"><i class="iconfont icon-export" style="font-size:12px;"></i> 导出</Button>
        </div>
        </div>
      </div>
    </div>
    <div class="search-image clearfix">
      <ul class="tab-header clearfix">
        <li class="active">缩略图</li>
      </ul>
      <div class="search-image-list">
        <div v-if="!(dataListBlock[this.pageCur-1] && dataListBlock[this.pageCur-1].length)" class="no-result">暂无数据</div>
        <SingImage v-for="(item,j) in dataListBlock[this.pageCur-1] || []" :key="j" :picInfo="item" type="image"></SingImage>
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
    <ExportList :isShow="isShowList" downType="image" @cancel="isShowList = false" :downInfo="downInfo" @startExport="startExport"></ExportList>
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
      cameraPosition: '',
      devList: toTreeData([]),
      similar: 75,
      pageLimit: this.$PageInfo.limit,
      pageCur: 1,
      imageUrl: '',
      dateLimit: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      },
      startTime: '',
      endTime: '',
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
      imageToSearch: state => state.veriface.imageToSearch,
      passerImageList: state => state.veriface.passerImageList,
      pageInfo: state => state.veriface.passerImagePageinfo,
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
    this.setDate()
    this.getVerifaceTree()
      .then(res => {
        this.devList = toTreeData([res.data])
        this.$nextTick(() => {
          if (this.imageToSearch) {
            this.imageUrl = this.imageToSearch
            this.startSearch()
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
  watch: {
    imageToSearch(news, old) {
      if (this.imageToSearch !== '' && news !== old) {
        this.imageUrl = this.imageToSearch
        this.startSearch()
      }
    },
    isExpand(val) {
      if (!val) {
        this.orgTreeSearch = this.changeCamera()
      }
    }
  },
  created() {
    this.getVerifaceParam()
  },
  methods: {
    ...mapMutations(['SET_IMAGE_URL', 'SET_IMAGES_LIST', 'SET_IMAGES_PAGE_INFO']),
    ...mapActions(['getVerifaceTree', 'getImagesCondition', 'getVerifaceParam', 'getPasserImagesCount']),
    setDate() {
      this.startTime = new Date(this.$moment(new Date()).format('YYYY-MM-DD') + ' 00:00:00')
      this.endTime = new Date()
    },
    removeUrl() {
      this.imageUrl = ''
      this.SET_IMAGE_URL('')
    },
    uploadSuccess(response, file, fileList) {
      this.imageUrl = response.path
      this.SET_IMAGE_URL('')
    },
    uploadImgError(err, file, fileList) {
      if (err) {}
      this.errorMsg('图片上传失败！')
      this.removeUrl()
    },
    formatError(file) {
      this.warningMsg('图片 ' + file.name + ' 格式不正确，请上传 jpg, png, bmp 或 jpeg 格式的图片。')
      this.removeUrl()
    },
    exceededSize(file) {
      this.warningMsg('图片 ' + file.name + ' 大小超过限制，请上传小于2M的图片。')
      this.removeUrl()
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
        this.imageUrl = ''
        this.warningMsg('未开启路人库!')
        return
      }
      if (!this.imageUrl) {
        this.warningMsg('图片为空！')
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
      const condition = {}
      condition.startTime = this.$moment(this.startTime).unix('X')
      condition.endTime = this.$moment(this.endTime).unix('X')
      if (parseInt(condition.endTime) - parseInt(condition.startTime) < 0) {
        this.warningMsg('开始时间不能大于结束时间！')
        return
      }
      if (this.imageToSearch) {
        condition.target = 'data' // 以库中存在的图片检索
      }
      condition.opId = this.opId
      condition.arrow = this.arrow
      condition.points = this.$refs.devTree.getSelectedDeepIds().toString() || ''
      condition.page = this.pageCur || 1
      condition.limit = this.pageLimit
      condition.image = this.imageUrl
      condition.similar = parseInt(this.similar)
      this.getImagesCondition(condition)
        .then(res => {
          if (res.data && res.data.length) {
            if (isCallByBtn) {
              this.getPasserImagesCount(condition).then(countRes => {
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
      const condition = {}
      condition.startTime = this.$moment(this.startTime).unix('X')
      condition.endTime = this.$moment(this.endTime).unix('X')
      if (parseInt(condition.endTime) - parseInt(condition.startTime) < 0) {
        this.warningMsg('开始时间不能大于结束时间！')
        return
      }
      condition.points = this.$refs.devTree ? this.$refs.devTree.getSelectedDeepIds().toString() : ''
      condition.page = this.pageCur || 1
      condition.limit = this.pageLimit
      condition.image = this.imageUrl
      condition.similar = parseInt(this.similar)
      const param = JSON.parse(JSON.stringify(condition))
      param.limit = this.pageInfo.count > 99999 ? 99999 : this.pageInfo.count
      param.tag = 'img' // 是否以图搜图的导出
      if (this.imageToSearch) {
        condition.redirect = 'data' // 以库中存在的图片导出
      }
      const str = []
      param.type = 'image'
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
    // this.SET_IMAGE_URL('')
    // this.SET_IMAGES_LIST([])
    // this.SET_IMAGES_PAGE_INFO()
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
  background-color: #1b3153;
}
.img-upload {
  float: left;
  text-align: center;
  padding: 12px 24px 8px;
  width: 423px;
  margin-left: 5px;
}
.img-upload .img-up-icon {
  background: rgb(60, 80, 115);
  width: 205px;
  margin-left: 52px;
  padding: 5px 0;
  margin-bottom: 8px;
  border-radius: 4px;
}
.img-upload i {
  font-size: 38px;
  cursor: pointer;
  color: #4699f9;
}
.condition {
  float: left;
  padding: 16px 24px;
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
}
.condition > div {
  padding-bottom: 16px;
}
.search-label {
  margin-right: 15px;
  text-align: right;
  width: 50px;
  display: inline-block;
}
.time-date {
  float: left;
  display: flex;
  flex-direction: row;
}
.similar {
  margin-left: 24px;
  float: left;
}
.search-pos {
  float: left;
}
.search-btn {
  float: left;
  margin-left: 90px;
}
.search-image {
  width: 100%;
  height: calc(100% - 112px);
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
.condition .camera-position {
  display: inline-block;
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
</style>
