<template>
  <div class="image-container">
    <div class="search-box">
      <div class="img-upload">
        <Upload :on-success="uploadSuccess" :on-error="uploadImgError" :on-format-error="formatError" :on-exceeded-size="exceededSize" action="/api/structure/identify/picsearchDiscern" :max-size="2048" :format="['jpg','png','bmp','jpeg']" :show-upload-list="false">
          <img v-if="uploadImageUrl" :src="uploadImageUrl" />
          <div v-else class="img-up-icon">
            <i class="ivu-icon ivu-icon-ios-cloud-upload-outline"></i>
            <p>点击上传图片</p>
          </div>
          <p>支持JPG、JPEG、PNG、BMP格式的图片,大小不超过2M</p>
        </Upload>
      </div>
      <div class="conditions">
        <div class="cond-item">
          <div>
            <div class="cond-item">
              <span class="cond-label">开始时间</span>
              <BSdateRange :datetime="startTime" @timeChange="startChange" :width='270' :height='32' style="margin-left:2px;"></BSdateRange>
            </div>
          </div>
          <div class="cond-item">
            <span class="cond-label">结束时间</span>
            <BSdateRange :datetime="endTime" @timeChange="endChange" :width='270' :height='32' style="margin-left:2px;"></BSdateRange>
          </div>
          <div class="cond-item">
            <span class="cond-label">相似度</span>
            <InputNumber :max="95" :min="50" :step="5" v-model="similar" style="width:240px;"></InputNumber>
            <div style="float: right; font-size: 16px; padding-top: 4px; padding-left: 5px;">%</div>
          </div>
        </div>
        <div class="cond-item">
          <div>
            <div class="cond-item">
              <span class="cond-label">选择通道</span>
              <div class="passageway-position">
                <div class="search">
                  <input v-model="orgTreeSearch" @focus="isExpand = true; orgTreeSearch = ''" @blur="isSelect? '': isExpand = false" :icon="isExpand ? 'arrow-up-b' : 'arrow-down-b'" type="text" class="input" placeholder="请输入..." ></input>
                  <button class="btn" @click.stop="isExpand = !isExpand; if (isExpand) { orgTreeSearch = '' }">
                    <Icon :type="isExpand ? 'arrow-up-b' : 'arrow-down-b'"></Icon>
                  </button>
                </div>
                <div :class="['search-tree-info', isExpand? '':'hidden']" @mouseenter.stop="isSelect = true" @mouseleave.stop="isSelect = false">
                  <VTree ref="channelTrees"
                    :searchVal="orgTreeSearch"
                    :treeData="devList"
                    :options="{showInput: true}"></VTree>
                </div>
              </div>
            </div>
          </div>
          <div class="cond-item-content">
            <Button type="ghost" @click="startSearch" style="margin-right:30px;" :loading="searching"><i v-if="!searching" class="iconfont icon-jiansuozhong" style="font-size:14px;"></i>&nbsp;检索</Button>
            <Button type="ghost" @click="exportData" :disabled="imageListBlock.length === 0"><i class="iconfont icon-export" style="font-size:12px;"></i>&nbsp;导出</Button>
          </div>
        </div>
      </div>
    </div>
    <div class="result-box">
      <div class="search-image-list">
        <div v-if="!(imageListBlock && imageListBlock.length)" class="no-result">暂无数据</div>
        <ImageCard v-for="(item,j) in imageListBlock[page.pageCur-1] || []" :key="j" :info="item" :isTrackPage="false" :targetType="item.type"></ImageCard>
      </div>
      <div class="pager">
        <Page show-total show-elevator :page-size="page.pageSize" :total="page.total" :current="page.pageCur" @on-change="handlePageChange"></Page>
      </div>
    </div>
    <ExportList :isShow="isShowList" downType="strucImage" :downInfo="downInfo" @cancel="isShowList = false"></ExportList>
  </div>
</template>

<script>
import _ from 'lodash'
import toTreeData from 'src/assets/js/toTreeData.js'
import ImageCard from './common/ImageCard'
import { mapState, mapActions } from 'vuex'
import ExportList from './common/ExportList'
let bodyEle
export default {
  components: { ImageCard, ExportList },
  data() {
    return {
      page: {
        pageCur: 1, // 当前页数
        pageSize: this.$PageInfo.limit, // 每页显示的数量
        total: 0 // 总数据
      },
      devList: toTreeData([]), // 生成树结构
      similar: 90, // 相似度
      startTime: '', // 开始时间
      endTime: '', // 结束时间
      orgTreeSearch: '全部', // 选择通道默认值
      isExpand: false, // 选择通道下拉列表是否显示
      isSelect: false, // 鼠标移入移出判断
      treeOptionNum: 0, // 选择通道下拉列表选中的节点数量
      isShowList: false, // 是否显示导出弹框
      searching: false, // 检索中
      uploadImageUrl: '', // 图片路径
      downInfo: {} // 导出参数
    }
  },
  computed: {
    ...mapState({
      imageCurrentUrl: ({ videoStructuredImageSearch }) => videoStructuredImageSearch.imageCurrentUrl, // 跳转的图片路径
      imageListBlock: ({ videoStructuredImageSearch }) => videoStructuredImageSearch.imageListBlock, // 当前显示的数据
      imageList: ({ videoStructuredImageSearch }) => videoStructuredImageSearch.imageList // 总数据
    })
  },
  mounted() {
    this.setDate() // 初始化时间
    this.getPassagewayData().then(res => {
      // 获取通道树
      this.devList = toTreeData([res.data])
      this.$nextTick(() => {
        const selectTree = this.$refs.channelTrees ? this.$refs.channelTrees.getSelectedDeepNameIds() : {}
        this.treeOptionNum = selectTree.count // 节点数量
        bodyEle = document.getElementsByTagName('body')[0]
        bodyEle.addEventListener('click', this.listenerClick) // 节点添加click事件
        if (this.imageCurrentUrl) {
          this.isSearch()
        }
      })
    }).catch(err => {
      if (this.imageCurrentUrl) {
        this.isSearch()
      }
      console.log('获取设备树出错', err)
    })
  },
  watch: {
    isExpand(val) {
      // 监听存储已选择的通道数据
      if (val) {
        this.orgTreeSearch = ''
      } else {
        this.orgTreeSearch = this.changeCamera()
      }
    },
    imageCurrentUrl(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.isSearch()
      }
    }
  },
  created() {
  },
  methods: {
    ...mapActions('videoStructuredImageSearch', ['getPassagewayData', 'getImagesConditionSearch', 'setImageUrl', 'setImageList', 'setImageListBlock']),
    setDate() {
      this.startTime = new Date(this.$moment(new Date()).format('YYYY-MM-DD') + ' 00:00:00')
      this.endTime = new Date()
    },
    isSearch() {
      this.uploadImageUrl = _.cloneDeep(this.imageCurrentUrl)
      this.setImageUrl('')
      this.startSearch() // 如果已存在路径，则为其他页面跳转检索，直接执行检索功能
    },
    removeUrl() {
      // 删除图片路径
      this.uploadImageUrl = ''
    },
    uploadSuccess(response, file, fileList) {
      // 判断识别是否正常
      if (response.errorCode !== '0' && response.message) {
        this.errorMsg('图片识别失败')
        response.binImageUrl = ''
      }
      // 保存图片路径    type标识上传的图片
      this.uploadImageUrl = response.binImageUrl
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
      // 组装已选择的通道数据
      const selectTree = this.$refs.channelTrees ? this.$refs.channelTrees.getSelectedDeepNameIds() : {}
      if (selectTree.name.length === 0 || selectTree.name.length === this.treeOptionNum) {
        return '全部'
      } else {
        return selectTree.name.join(';')
      }
    },
    startSearch() { // 点击检索按钮
      const end = this.$moment(this.$moment(this.startTime).add(7, 'days')).unix('X')
      const curend = this.$moment(this.endTime).unix('X')
      if (curend > end) {
        this.warningMsg('时间段最大间隔为7天!')
        return
      }
      this.page.total = 0
      this.page.pageCur = 1
      this.search()
    },
    handlePageChange(page) { // 页码改变操作
      console.log(page)
      this.page.pageCur = page
    },
    checkSearchParam() { // 检索或导出时的参数校验
      if (!this.uploadImageUrl) {
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
      let channels = ''
      if (this.changeCamera() !== '全部') {
        channels = this.$refs.channelTrees.getSelectedDeepIds().toString()
      }
      const condition = {
        startTime: this.$moment(this.startTime).unix() * 1000,
        endTime: this.$moment(this.endTime).unix() * 1000 + 999,
        imageUrl: this.uploadImageUrl,
        score: this.similar,
        videoChannel: channels
      }
      if (parseInt(condition.endTime) - parseInt(condition.startTime) < 0) {
        this.warningMsg('开始时间不能大于结束时间！')
        return
      }
      return condition
    },
    search(isCallByBtn = true) { // 检索
      const param = this.checkSearchParam()
      if (!param) { return }
      this.setImageListBlock([])
      this.searching = true
      this.getImagesConditionSearch(param)
        .then(res => {
          this.searching = false
          const self = this
          if (res.data && res.data.length) {
            self.setImageList(res.data) // 缓存所有数据
            self.setImageListBlock(_.chunk(self.imageList, self.page.pageSize)) // 通过当前页面可显示最大数量过滤当前可显示的数据
            self.page.total = self.imageList.length // 总数量
            self.page.pageCur = 1 // 当前显示页数
          } else {
            console.log(this.imageListBlock)
            this.warningMsg('查询无结果！')
          }
        })
        .catch(() => {
          this.searching = false
          this.errorMsg('检索失败！')
        })
    },
    exportData() { // 导出数据
      const param = this.checkSearchParam()
      if (!param) { return }
      this.downInfo = param
      this.isShowList = true
    },
    startChange(val) { // 开始时间
      this.startTime = val.dateTimes
      if (this.startTime.getTime() > this.endTime.getTime()) {
        this.endTime = this.startTime
      }
      this.checkTime('s')
    },
    endChange(val) { // 结束时间
      this.endTime = val.dateTimes
      if (this.startTime.getTime() > this.endTime.getTime()) {
        this.startTime = this.endTime
      }
      this.checkTime('v')
    },
    checkTime(s) { // 校验时间
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
    listenerClick(e) { // 添加下拉列表的接听
      if (e.target.classList.contains('input') || e.target.classList.contains('item') || e.target.classList.contains('treeliBox') || e.target.classList.contains('search-tree-info') || e.target.classList.contains('search')) {
        this.isExpand = true
      } else {
        this.isExpand = false
      }
    }
  },
  beforeDestroy() {
    // 出页面时， 清空图片路径、当前数据、总数据、移出监听事件
    this.setImageList([])
    this.setImageListBlock([])
    bodyEle && bodyEle.removeEventListener('click', this.listenerClick)
  }
}
</script>

<style scoped>
  .image-container {
    padding: 16px 16px;
    width: 100%;
    height: 100%;
    position: relative;
  }
  .search-box {
    width: 100%;
    height: 136px;
    display: flex;
    flex-direction: row;
  }
  .img-upload {
    text-align: center;
    padding: 8px;
    margin-right: 8px;
    border-radius: 4px;
    background: #1b3153;
    width: 336px;
    height: 136px;
  }
  .img-upload i {
    font-size: 56px;
    cursor: pointer;
    color: #4699f9;
  }
  .img-upload img {
    display: block;
    margin: 0 auto;
    height: 84px;
    margin-bottom: 8px;
    /* width: 65px; */
    /* height: 65px; */
    cursor: pointer;
  }
  .img-upload .img-up-icon {
    background: rgb(60, 80, 115);
    width: 205px;
    margin-left: 52px;
    padding: 5px 0;
    margin-bottom: 8px;
    border-radius: 4px;
  }
  .conditions {
    width: calc(100% - 336px);
    background: #1b3153;
    border-radius: 4px;
    min-width: 1000px;
  }
  .cond-item {
    display: flex;
    flex-direction: row;
    padding: 12px 24px 0 24px;
  }
  .cond-label{
    line-height: 32px;
    font-size: 14px;
    width: 75px;
  }
  .cond-item-content {
    width: 326px;
    padding: 12px 0 0 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
  .result-box {
    width: 100%;
    height: calc(100% - 144px);
    margin-top: 8px;
    background: #1b3153;
    position: relative;
  }
  .conditions .passageway-position {
    display: inline-block;
  }
  .conditions .search .input {
    width: 668px;
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
  .conditions .input:focus {
    border-color: #6badfa;
    outline: 0;
    box-shadow: 0 0 0 0 #6badfa;
  }
  .conditions .search .btn {
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
    width: 668px;
    max-height: 372px;
    overflow-y: auto;
    z-index: 1;
  }
  .search-tree-info.hidden {
    display: none;
  }
  .search-image-list {
    width: 100%;
    height: calc(100% - 38px);
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
  .pager {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0 24px;
    text-align: right;
    background: #244575;
    height: 38px;
    line-height: 36px;
  }
</style>
