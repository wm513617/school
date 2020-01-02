<template>
  <div class="track-page" v-resize="resizeFun">
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
        <div class="time-date" ref='aaa'>
          <span class="search-label" style="line-height:32px;">时间段</span>
          <BSdateRange :datetime="startTime" @timeChange="startChange" :width='225' :height='32' style="margin-left:2px;"></BSdateRange>
          <span style="padding: 0 5px;line-height:32px;">至</span>
          <BSdateRange :datetime="endTime" @timeChange="endChange" :width='225' :height='32'></BSdateRange>
        </div>
        <div class="similar">
          <span class="search-label">相似度</span>
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
          <Button type="ghost" @click="pageCur = 1;search()"><i class="iconfont icon-jiansuozhong" style="font-size:12px;"></i> 检索</Button>
          <Button style="margin-left:15px" type="ghost" :disabled="trackList.length === 0" @click="trackAnimate"><i class="iconfont icon-guiji" style="font-size:12px;"></i> 轨迹刻画</Button>
        </div>
        </div>
      </div>
    </div>
    <div class="cartogram">
      <ul class="tab-header clearfix">
        <li :class="{active: !showList}" @click="showList = false">缩略图</li>
        <li :class="{active: showList}" @click="showList = true">列表</li>
      </ul>
      <div class="search-map" ref="tableBox">
        <t-map v-show="!showList" ref="tMap"></t-map>
        <div v-show="showList" style="position:relative;" ref="peopleTable">
          <!-- <bs-scroll ref="bsScrollOrg" style=" width: 100%;height: 100%;overflow: auto;"> -->
          <Table class="track-image" :columns="columns" :data="tableList" size="small" :height="tableS.h" :width="tableS.w"></Table>
          <!-- </bs-scroll> -->
          <!-- <Page :page-size="pageLimit" @on-page-size-change="pageSizeChange" @on-change="handlePageChange" :current="pageInfo.current" :total="pageInfo.count" :page-size-opts="$PageInfo.size" style="float:right;" show-sizer show-elevator show-total></Page> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import toTreeData from 'src/assets/js/toTreeData.js'
import TMap from './map/TMap'
import { mapState, mapMutations, mapActions } from 'vuex'
let bodyEle
export default {
  components: { TMap },
  data() {
    return {
      similar: 75,
      startTime: this.beforeDawn(),
      endTime: new Date(),
      dateLimit: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      },
      devList: toTreeData([]),
      imageUrl: '',
      showList: false,
      columns: [
        {
          title: '序号',
          align: 'center',
          type: 'index',
          width: 80
        },
        {
          title: '抓拍图像',
          align: 'center',
          key: 'faceImage',
          className: 'img-td',
          render: (h, params) => {
            return h('img', {
              class: params.row.class,
              attrs: {
                src: params.row.faceImage
              },
              on: {
                click: function() {
                  if (params.row.error || !params.row.faceImage) {
                    return false
                  }
                  let str = 'big-img'
                  if (params.index === 0) {
                    str += '-first'
                  } else if (params.index === 1) {
                    str += '-second'
                  } else if (params.index === params.row.length - 1) {
                    params.index === 2 ? str += '-thirdlast' : str += '-last'
                  } else if (params.index === params.row.length - 2) {
                    str += '-sedlast'
                  }

                  const index = params.row.class.indexOf(str)
                  if (index === -1) {
                    params.row.class.push(str)
                  } else {
                    params.row.class.pop()
                  }
                },
                error: function() {
                  params.row.error = true
                }
              }
            })
          }
        },
        {
          title: '抓拍时间',
          align: 'center',
          key: 'timestamp'
        },
        {
          title: '抓拍位置',
          align: 'center',
          key: 'resName'
        },
        {
          title: '年龄',
          align: 'center',
          key: 'age'
        },
        {
          title: '性别',
          key: 'gender',
          align: 'center'
        },
        {
          title: '相似度',
          align: 'center',
          key: 'similar'
        }
      ],
      pageLimit: this.$PageInfo.limit,
      pageCur: 1,
      orgTreeSearch: '全部',
      isExpand: false,
      isSelect: false,
      treeOptionNum: 0,
      tableS: {}
    }
  },
  mounted() {
    this.getVerifaceTree()
      .then(res => {
        // 获取设备树
        this.devList = toTreeData([res.data])
        this.$nextTick(() => {
          if (this.trackImgToSer) {
            this.imageUrl = this.trackImgToSer.split('-passer-tag')[0]
            this.search()
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
    this.resizeFun()
  },
  computed: {
    ...mapState({
      trackImgToSer: state => state.veriface.trackImgToSer,
      trackList: ({ veriface }) => veriface.trackList, // 人脸轨迹数据
      pageInfo: state => state.veriface.trackPageinfo,
      verifaceParam: state => state.veriface.verifaceParam
    }),
    // pecentNum() {
    //   const list = []
    //   let item = 50
    //   for (let i = 0; item < 100; i++) {
    //     list.push(item + '%')
    //     item += 5
    //   }
    //   return list
    // },
    tableList() {
      const list = JSON.parse(JSON.stringify(this.trackList))
      for (let i = 0; i < list.length; i++) {
        list[i].timestamp = list[i].timestamp ? this.$moment.unix(this.$moment(Number(list[i].timestamp)).unix()).format('YYYY-MM-DD HH:mm:ss') : ''
        list[i].gender = list[i].gender === '1' ? '女' : list[i].gender === '2' ? '男' : ' '
        list[i].similar = list[i].similar + '%'
        list[i].class = ['people-img']
        list[i].length = list.length
      }
      return list
    },
    passerby() {
      return this.verifaceParam.passby
    }
  },
  created() {
    this.getVerifaceParam()
  },
  watch: {
    isExpand(val) {
      if (!val) {
        this.orgTreeSearch = this.changeCamera()
      }
    }
  },
  methods: {
    ...mapMutations(['SET_TRACK_TMG_SER', 'SET_TRACK_LIST', 'SET_TRACK_PAGE_INFO']),
    ...mapActions(['getVerifaceTree', 'getTrackCondition', 'getVerifaceParam']),
    beforeDawn() {
      const start = new Date()
      start.setHours(0)
      start.setMinutes(0)
      start.setSeconds(0)
      start.setMilliseconds(0)
      return start
    },
    removeUrl() {
      this.imageUrl = ''
      this.SET_TRACK_TMG_SER('')
    },
    uploadSuccess(response, file, fileList) {
      this.imageUrl = response.path
      this.SET_TRACK_TMG_SER('')
    },
    uploadImgError(err, file, fileList) {
      if (err) {
      }
      this.removeUrl()
      this.errorMsg(file.message === 'ETIMEDOUT' ? '连接超时' : file.message)
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
    search() {
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
      if (this.trackList && this.trackList.length > 0) {
        this.clearTrack() // 清空之前的轨迹
      }
      const condition = {}
      condition.beginTime = this.$moment(this.startTime).unix('X')
      condition.endTime = this.$moment(this.endTime).unix('X')
      if (parseInt(condition.endTime) - parseInt(condition.startTime) < 0) {
        this.warningMsg('开始时间不能大于结束时间！')
        return
      }
      if (this.trackImgToSer) {
        condition.isdefense = true // 查询历史报警信息
        condition.target = 'data' // 跳转后，以图搜图
        const reg = /-passer-tag/
        if (reg.test(this.trackImgToSer)) {
          condition.isdefense = false
        }
      } else {
        condition.isdefense = false
      }
      condition.page = this.pageCur || 1
      condition.limit = this.pageLimit
      condition.resStr = this.$refs.devTree.getSelectedDeepIds().toString() || ''
      condition.image = this.imageUrl
      condition.similar = parseInt(this.similar)
      this.getTrackCondition(condition)
        .then(res => {
          if (res.data.length === 0) {
            this.warningMsg('查询无结果！')
          }
        })
        .catch(() => {
          this.errorMsg('检索失败！')
        })
    },
    trackAnimate() {
      // 轨迹动画
      if (this.trackList && this.trackList.length > 0) {
        let tMap = this.$refs.tMap
        if (tMap && tMap.trackAnimate) {
          tMap.trackAnimate() // 控制轨迹动画
        }
      }
    },
    clearTrack() {
      // 清除轨迹绘制
      let tMap = this.$refs.tMap
      if (tMap && tMap.clearTrack) {
        tMap.clearTrack() // 清除绘制轨迹
      }
    },
    pageSizeChange(n) {
      this.pageCur = 1
      this.pageLimit = n
      this.search()
    },
    handlePageChange(page) {
      this.pageCur = page
      this.search()
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
    resizeFun() {
      this.tableS = {
        h: this.$refs['tableBox'].offsetHeight,
        w: this.$refs['peopleTable'].offsetWidth
      }
    }
  },
  beforeDestroy() {
    this.SET_TRACK_TMG_SER('')
    this.SET_TRACK_LIST([])
    this.SET_TRACK_PAGE_INFO()
    bodyEle.removeEventListener('click', this.listenerClick)
    this.resizeFun = null
  }
}
</script>
<style scoped>
.track-page {
  padding: 16px 0;
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
  width: 482px;
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
.img-upload img {
  width: 65px;
  height: 65px;
  cursor: pointer;
}
.condition {
  float: left;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
}
.search-label {
  margin-right: 15px;
  width: 50px;
  display: inline-block;
  text-align: right;
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
  margin-top: 16px;
}
.search-btn {
  float: left;
  margin-top: 16px;
  margin-left: 90px;
}
.cartogram {
  width: 100%;
  height: calc(100% - 112px);
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
.search-map {
  width: 100%;
  height: calc(100% - 38px);
  background-color: #1b3153;
}
.clearfix:after {
  content: '.';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.track-page .track-condition .camera-position {
  display: inline-block;
}
.track-page .track-condition .search .input {
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
.track-page .track-condition .input:focus {
  border-color: #6badfa;
  outline: 0;
  box-shadow: 0 0 0 0 #6badfa;
}
.track-page .track-condition .search .btn {
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
.track-page .track-condition .search-tree-info {
  position: absolute;
  border: #4699f9 1px solid;
  border-radius: 4px;
  padding: 5px;
  margin-top: 8px;
  background-color: #1b3153;
  width: 470px;
  max-height: 372px;
  overflow-y: auto;
  z-index: 99;
}
.track-page .track-condition .search-tree-info.hidden {
  display: none;
}
</style>
<style>
.track-image .img-td {
  position: relative;
  overflow: inherit;
}
.track-image .people-img {
  display: inline-block;
  outline: none;
  height: 32px;
  width: 32px;
  cursor: pointer;
}
.track-image .people-img.big-img,
.track-image .people-img.big-img-first,
.track-image .people-img.big-img-second,
.track-image .people-img.big-img-last,
.track-image .people-img.big-img-sedlast,
.track-image .people-img.big-img-thirdlast {
  position: absolute;
  width: 120px;
  height: 150px;
  left: 50%;
  z-index: 1;
}
.track-image .big-img {
  top: 50%;
  transform: translate(-50%, -50%);
}
.track-image .big-img-first {
  top: 0;
  transform: translate(-50%, 0);
}
.track-image .big-img-second {
  top: 0;
  transform: translate(-50%, -38px);
}
.track-image .big-img-last {
  top: 38px;
  transform: translate(-50%, -100%);
}
.track-image .people-img.big-img-sedlast {
  top: 76px;
  transform: translate(-50%, -100%);
}
.track-image .people-img.big-img-thirdlast {
  top: 0;
  transform: translate(-50%, -76px);
}
.track-image .ivu-table {
  overflow-y: auto;
}
</style>
