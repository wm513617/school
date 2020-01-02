<template>
  <div class="track-container">
    <div class="map-box">
      <t-map class="map-container" :drawActive="drawActive" :trackCoordinates="trackCoordinates" @drawFinish="drawFinish"></t-map>
      <div class="search-container">
        <div class="img-upload" title="支持JPG、JPEG、PNG、BMP格式的图片,大小不超过2M">
            <Upload action="/api/structure/identify/picsearchDiscern" :max-size="2048" :format="['jpg','png','bmp','jpeg']" :show-upload-list="false" :on-success="uploadSuccess" :on-error="uploadImgError" :on-format-error="formatError" :on-exceeded-size="exceededSize" >
            <div v-if="uploadImgUrl" class="img-box"><img :src="uploadImgUrl" style="width:52px;height:66px;"/></div>
            <div v-else class="img-up-icon">
              <i class="ivu-icon ivu-icon-ios-cloud-upload-outline"></i>
              <p>点击上传图片</p>
            </div>
          </Upload>
        </div>
        <div class="conditions">
          <div class="left-cond">
            <div>
              <div class="cond-item">
                <span class="cond-label">开始时间</span>
                <BSdateRange :datetime="searchCond.startTime" @timeChange="startChange" :width='225' :height='32' style="margin-left:2px;"></BSdateRange>
              </div>
            </div>
            <div class="cond-item">
              <span class="cond-label">相似度</span>
              <InputNumber :max="95" :min="50" :step="5" v-model="searchCond.score" style="width:205px;"></InputNumber>
              <div style="float: right; font-size: 16px; padding-top: 4px; padding-left: 5px;">%</div>
            </div>
          </div>
          <div class="right-cond">
            <div>
              <div class="cond-item">
                <span class="cond-label">结束时间</span>
                <BSdateRange :datetime="searchCond.endTime" @timeChange="endChange" :width='225' :height='32' style="margin-left:2px;"></BSdateRange>
              </div>
            </div>
            <div class="cond-item">
              <Button type="primary" @click="drawAreaChooseVideo"><i class="iconfont icon-kuangxuan1" style="font-size:14px;"></i>&nbsp;地图选点</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="result-box">
      <div class="target">
        <div class="header">
          <div class="header-title">结构化目标</div>
          <div class="header-btnlist"></div>
        </div>
        <div class="content">
          <div v-if="!(targetPageList && targetPageList.length)" class="no-result">暂无数据</div>
          <ImageCard v-for="(item, index) in targetPageList[targetPageInfo.current - 1] || []" :key="index" :info="item" :isTrackPage="true" targetType="objtive" style="margin: 8px 16px;" @collect="handleCollectChange"></ImageCard>
        </div>
        <div class="footer">
          <Page :total="targetPageInfo.count" :page-size="targetPageInfo.pageSize" :current="targetPageInfo.current" @on-change="handleResultPageChange" show-elevator show-total/>
        </div>
      </div>
      <div class="clue">
        <div class="header">
          <div class="header-title">结构化线索</div>
          <div class="header-btnlist">
            <ul>
              <li><Checkbox :disabled="!(this.clueList && this.clueList.length)" v-model="isSelectClueAll" @on-change="handleSelectedAllClue">全选</Checkbox></li>
              <li><Button type="ghost" :disabled="!(this.clueCheckList && this.clueCheckList.length)" @click="showCaseModal = true;"><i class="iconfont icon-save" style="font-size:12px;"></i>&nbsp;保存至</Button></li>
              <li><Button type="ghost" :disabled="!(this.clueCheckList && this.clueCheckList.length)" @click="downloadPlaybackVideos"><i class="iconfont icon-xiazai" style="font-size:12px;"></i>&nbsp;下载</Button></li>
              <li><Button type="ghost" :disabled="!(this.clueCheckList && this.clueCheckList.length)" @click="playVideosRecords"><i class="iconfont icon-playback" style="font-size:14px;"></i>&nbsp;回放</Button></li>
            </ul>
          </div>
        </div>
        <div class="clue-content">
          <div v-if="!(clueList && clueList.length)" class="no-result">暂无数据</div>
          <ImageCard v-for="(item, index) in clueList || []" :key="index" :info="item" :isTrackPage="true" targetType="clue" style="margin: 8px 16px;" @remove="handleRemoveCollect" @select="handleClueSelectionChange"></ImageCard>
        </div>
      </div>
    </div>
    <VideoList v-if="showVideoList" :visiable.sync="showVideoList" :searching.sync="isSearching" :videoList.sync="queryVideoList" :selectedVideos.sync="selectedVideos" @selectedVideoChange="handleSelectedVideoChange" @previewVideos="handlePreviewVideos" @triggerSearch="handleTriggerSearch"/>
    <VideosPreview v-if="showVideosPreview" :visiable.sync="showVideosPreview" :videos.sync="videoPlayList"/>
    <VideosPlayback v-if="showVideosPlayback" :visiable.sync="showVideosPlayback" :videos.sync="videoPlayBackList"/>
    <CaseDlalog :openModal.sync="showCaseModal" :caseList="clueCheckVideoParams" />
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState, mapActions, mapMutations} from 'vuex'
import TMap from './tarck/TMap'
import VideoList from './tarck/VideoList'
import VideosPreview from './tarck/VideosPreview'
import VideosPlayback from './tarck/VideosPlayback'
import ImageCard from './common/ImageCard'
import CaseDlalog from 'view/business/caseDlalog'
import {batchDownloadVideoSegments} from 'components/videoComponentsNew/playback.js'
import highLight from 'assets/2DMap/feature/edit/highLight'
export default {
  components: { TMap, VideoList, ImageCard, VideosPreview, CaseDlalog, VideosPlayback },
  data() {
    return {
      targetPageInfo: { // 结构化目标-分页信息
        count: 0, // 总数
        pageSize: 20, // 每页数量
        current: 1 // 当前页
      },
      searchCond: { // 查询条件
        startTime: new Date(new Date().setHours(0, 0, 0, 0)), // 查询开始时间
        endTime: new Date(), // 查询结束时间
        score: 90, // 相似度
        videoChannel: '' // 视频通道
      },
      isSelectClueAll: false, // 线索是否全选
      uploadImgUrl: '', // 上传图片地址
      drawActive: false, // 绘制状态
      showVideoList: false, // 显示摄像机列表
      queryVideoList: [], // 查询到的摄像机列表
      selectedVideos: [], // 选中的视频资源
      isSearching: false,
      targetList: [], // 结构化目标数据列表
      targetPageList: [], // 结构化目标当前页数据列表
      clueList: [], // 结构化线索数据列表
      showVideosPreview: false, // 显示视频预览
      showVideosPlayback: false, // 显示视频回放
      clueCheckList: [], // 结构化线索选中数据
      clueCheckVideoParams: [], // 结构化线索选中视频参数
      videoResMap: new Map(), // 视频资源map（key: 资源唯一标识，value: 资源数据）
      trackCoordinates: [], // 轨迹坐标数组
      videoPlayList: [], // 视频预览播放列表
      videoPlayBackList: [], // 视频回放播放列表
      showCaseModal: false // 是否显示案件弹框
    }
  },
  computed: {
    ...mapState({
      parameters: ({ platform }) => platform.parameters, // 视频存储参数
      imageUrl: ({ videoStructuredImageSearch }) => videoStructuredImageSearch.imageUrl // 图片路径
    })
  },
  watch: {
    targetList: { // 结构化目标数据列表变化
      handler(arr) {
        if (arr && arr.length) {
          this.targetPageInfo.count = arr.length
          this.targetPageList = _.chunk(arr, this.targetPageInfo.pageSize)
        } else {
          this.initTargetPageInfo() // 初始化结构化目标分页数据
        }
      },
      deep: true
    },
    clueCheckList: { // 结构化线索选中数据变化
      handler(arr) {
        this.updateClueCheckVideoParams() // 更新线索选中视频参数
        if (this.clueList && arr) {
          if (this.clueList.length !== arr.length) {
            this.isSelectClueAll = false
          }
        }
      },
      deep: true
    },
    selectedVideos: { // 选中的视频资源变化
      handler(arr) {
        this.handleSelectedVideoChange(arr) // 处理选中视频资源变化
      },
      deep: true
    },
    showVideoList(val) {
      if (!val) {
        this.setSelectPointHeightLightFeatures([]) // 清空选中的点位标记
      }
    }
  },
  created() {
  },
  mounted() {
    this.uploadImgUrl = _.cloneDeep(this.imageUrl) // 初始化拷贝跳转传入的图片地址
    this.setUploadImageUrl('') // 清空跳转传入的图片
    this.getVideoConf() // 获取视频存储
  },
  methods: {
    ...mapActions(['getCommonResourceById', 'getVideoConf']),
    ...mapActions('structuredTrack', ['getStructuredVideosInArea']),
    ...mapActions('videoStructuredImageSearch', ['getImagesConditionSearch', 'setUploadImageUrl']),
    ...mapMutations('structuredTrack', {setSelectPointHeightLightFeatures: 'SET_SELECT_POINT_HEIGHTLIGHT_FEATURES'}),
    startChange(val) { // 开始时间
      this.searchCond.startTime = val.dateTimes
      if (this.searchCond.startTime.getTime() > this.searchCond.endTime.getTime()) {
        this.searchCond.endTime = this.searchCond.startTime
      }
      this.checkTime('s')
    },
    endChange(val) { // 结束时间
      this.searchCond.endTime = val.dateTimes
      if (this.searchCond.startTime.getTime() > this.searchCond.endTime.getTime()) {
        this.searchCond.startTime = this.searchCond.endTime
      }
      this.checkTime('v')
    },
    checkTime(s) { // 校验时间
      if (s === 's') {
        const curend = this.$moment(this.searchCond.endTime).unix('X')
        const end = this.$moment(this.$moment(this.searchCond.startTime).add(7, 'days')).unix('X')
        if (curend > end) {
          this.searchCond.endTime = new Date(end * 1000)
          this.warningMsg('时间段最大间隔为7天!')
        }
      } else {
        const curstart = this.$moment(this.searchCond.startTime).unix('X')
        const start = this.$moment(this.$moment(this.searchCond.endTime).subtract(7, 'days')).unix('X')
        if (curstart < start) {
          this.searchCond.startTime = new Date(start * 1000)
          this.warningMsg('时间段最大间隔为7天!')
        }
      }
    },
    uploadSuccess(response, file, fileList) { // 图片上传成功处理函数
      if (response.errorCode !== '0') {
        this.uploadImgUrl = ''
        this.errorMsg('图片识别失败！')
        return
      }
      this.uploadImgUrl = response.binImageUrl
    },
    uploadImgError(err, file, fileList) { // 图片上传失败处理函数
      if (err) {}
      this.errorMsg('图片上传失败！')
      this.removeUrl()
    },
    formatError(file) { // 图片格式错误处理函数
      this.warningMsg('图片 ' + file.name + ' 格式不正确，请上传 jpg, png, bmp 或 jpeg 格式的图片。')
      this.removeUrl()
    },
    exceededSize(file) { // 图片超过大小处理函数
      this.warningMsg('图片 ' + file.name + ' 大小超过限制，请上传小于2M的图片。')
      this.removeUrl()
    },
    handleResultPageChange(page) { // 结构化目标-处理当前页改变
      this.targetPageInfo.current = page // 改变当前页
    },
    drawAreaChooseVideo() { // 绘制区域选取摄像机
      /* if (this.queryVideoList.length >= 16) {
        this.warningMsg('最多选取16个摄像机')
        return
      } */
      this.drawActive = true
    },
    drawFinish(param) { // 绘制完成
      this.drawActive = false
      if (param.wkt) {
        this.getStructuredVideosInArea({ wkt: param.wkt }).then((videoArr) => {
          // console.log('区域内的视频数据：', JSON.parse(JSON.stringify(videoArr)))
          if (videoArr && videoArr.length) {
            this.showVideoList = true
            let map = new Map()
            // for (const videoRes of this.queryVideoList) { // 遍历查询到的视频列表数据
            //   let clonedRes = _.cloneDeep(videoRes)
            //   clonedRes._checked = true // 数据设置中默认选中
            //   map.set(clonedRes._id, clonedRes)
            // }
            for (const videoRes of videoArr) { // 遍历区域内的视频数据
              let clonedRes = _.cloneDeep(videoRes)
              clonedRes._checked = true // 数据设置中默认选中
              map.set(clonedRes._id, clonedRes)
            }
            /* if ([...map.values()] && [...map.values()].length > 16) {
              this.warningMsg('仅可框选16个视频点位')
            } */
            let uniqueArr = [...map.values()] // [...map.values()].slice(0, 16) // 限制摄像机个数16个
            // console.log('去重后的视频列表：', JSON.parse(JSON.stringify(uniqueArr)))
            this.queryVideoList = uniqueArr
            this.initSelectedVideo(this.queryVideoList)
            let selectPointHeightLightFeatures = []
            for (let item of this.selectedVideos) {
              let center = item.point.geo || item.point.loc
              let centerCoordinates = center.split(',').map(item => Number(item))
              let feature = highLight.getLocateFeature(item.point._id, centerCoordinates)
              selectPointHeightLightFeatures.push(feature)
            }
            this.setSelectPointHeightLightFeatures(selectPointHeightLightFeatures)
          } else {
            this.warningMsg('区域内无视频资源')
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    closeVideoList() { // 关闭摄像机列表
      this.showVideoList = false
      this.queryVideoList = [] // 清空查询到的视频资源数据
      this.selectedVideos = [] // 清空选中的视频资源数据
    },
    initSelectedVideo(videos) { // 初始化选中视频数据
      // let channels = []
      let selectedResArr = [] // 保存选中的视频资源
      for (let i = 0; i < videos.length; i++) {
        const video = _.cloneDeep(videos[i])
        if (video._checked) {
          selectedResArr.push(video)
        }
      }
      this.selectedVideos = selectedResArr
    },
    handleSelectedVideoChange(videos) { // 处理选中视频资源变化
      // console.log('选中视频资源变化：', JSON.parse(JSON.stringify(videos)))
      let channels = []
      for (let i = 0; i < videos.length; i++) {
        const video = videos[i]
        if (video && video._id) {
          let channel = video._id
          channels.push(channel)
        }
      }
      this.searchCond.videoChannel = channels.toString()
      // console.log('选中视频通道数据：', this.searchCond.videoChannel)
    },
    handlePreviewVideos(videos) { // 处理视频预览
      let videoArr = _.cloneDeep(videos) // 深拷贝视频数据
      if (videoArr && videoArr.length) {
        let videoPlayArr = [] // 视频播放参数列表
        for (const videoRes of videoArr) { // 遍历视频资源数据
          if (videoRes && videoRes.eid) {
            let videoPaly = { // 视频播放参数
              devIp: videoRes.eid.ip,
              devPort: videoRes.eid.cport,
              channel: Number(videoRes.chan),
              streamType: videoRes.stream,
              cameraName: videoRes.name,
              resId: videoRes._id
            }
            videoPlayArr.push(videoPaly)
          }
        }
        this.videoPlayList = videoPlayArr // 更新视频播放参数列表
        this.showVideosPreview = true // 显示视频预览
      }
    },
    handleTriggerSearch() { // 处理查询触发
      if (!this.uploadImgUrl) {
        this.warningMsg('图片不能为空！')
        return
      }
      if (!this.searchCond.startTime) {
        this.warningMsg('开始时间不能为空！')
        return
      }
      if (!this.searchCond.endTime) {
        this.warningMsg('结束时间不能为空！')
        return
      }
      this.targetList = [] // 清空结构化目标数据列表
      // this.clueList = [] // 清空结构化线索数据列表
      this.isSearching = true
      let queryConds = JSON.parse(JSON.stringify(this.searchCond))
      queryConds.startTime = this.$moment(this.searchCond.startTime).unix() * 1000
      queryConds.endTime = this.$moment(this.searchCond.endTime).unix() * 1000 + 999
      queryConds.imageUrl = this.uploadImgUrl
      // console.log('结构化搜索查询条件：', JSON.parse(JSON.stringify(queryConds)))
      this.getImagesConditionSearch(queryConds).then(res => {
        this.isSearching = false
        // console.log('机构化追踪检索结果：', res.data)
        this.targetList = (res.data && res.data.length) ? res.data : []
        if (!(this.targetList && this.targetList.length)) {
          this.warningMsg('查询无结果')
        }
      }).catch(err => {
        console.log('机构化追踪检索失败：', err)
        this.isSearching = false
        this.errorMsg('检索失败！')
      })
    },
    initTargetPageInfo() { // 初始化分页条件
      this.targetPageList = []
      this.trackCoordinates = []
      this.targetPageInfo = {
        count: 0, // 总数
        pageSize: 20, // 每页数量
        current: 1 // 当前页
      }
    },
    async handleCollectChange(param) { // 处理收藏变化
      console.log('处理收藏变化数据：', JSON.parse(JSON.stringify(param)))
      if (param.resourceId && !this.videoResMap.has(param.resourceId)) {
        let videoRes = await this.getCommonResourceById(param.resourceId)
        this.videoResMap.set(videoRes._id, videoRes)
      } else {
        console.log('处理收藏变化数据：no resourceId')
      }
      let pageList = this.targetPageList[this.targetPageInfo.current - 1] // 结构化目标当前页数据
      pageList.map(item => param.smallImageUrl === item.smallImageUrl ? (item.collect = param.collect) : item)
      let newClueList = _.cloneDeep(this.clueList) // 深拷贝结构化线索数据
      if (param.collect) { // 收藏目标时
        let clue = _.cloneDeep(param)
        clue.checked = this.isSelectClueAll
        // 由于再次检索不清空线索，所以在收藏的时候判断一下，要收藏的是否在线索中已经存在
        let add = true
        for (let i = 0; i < newClueList.length; i++) {
          if (param.smallImageUrl === newClueList[i].smallImageUrl) {
            add = false
            break
          }
        }
        add && newClueList.push(clue)
      } else { // 取消收藏目标时
        newClueList = newClueList.filter(item => param.smallImageUrl !== item.smallImageUrl) // 过滤掉取消的目标数据
      }
      newClueList.sort((item1, item2) => { // 结标化线索安抓拍时间正序排序
        return item1.captureTime - item2.captureTime
      })
      this.clueList = newClueList
      this.updateClueCoordinates() // 更新线索坐标数据
    },
    handleRemoveCollect(param) { // 处理目标收藏移除
      let pageList = _.cloneDeep(this.targetPageList[this.targetPageInfo.current - 1]) // 结构化目标当前页数据
      pageList.map(item => param.smallImageUrl === item.smallImageUrl ? (item.collect = !param.collect) : item)
      this.targetPageList[this.targetPageInfo.current - 1] = pageList
      this.clueList = this.clueList.filter(item => param.smallImageUrl !== item.smallImageUrl) // 过滤掉取消的目标数据
      this.clueCheckList = this.clueCheckList.filter(item => param.smallImageUrl !== item.smallImageUrl) // 过滤掉取消的线索选中数据
      this.updateClueCoordinates() // 更新线索坐标数据
    },
    handleClueSelectionChange(param) { // 处理结构化线索选中数据变化
      let clues = _.cloneDeep(this.clueList) // 结构化目标当前页数据
      clues.map(item => param.smallImageUrl === item.smallImageUrl ? (item.checked = param.checked) : item)
      this.clueList = clues
      if (param.checked) { // 选中线索
        let clue = _.cloneDeep(param)
        this.clueCheckList.push(clue)
      } else { // 取消收藏目标时
        this.clueCheckList = this.clueCheckList.filter(item => param.smallImageUrl !== item.smallImageUrl) // 过滤掉取消的目标数据
      }
    },
    handleSelectedAllClue(flag) { // 处理全选结构化线索
      let clues = _.cloneDeep(this.clueList)
      if (flag) { // 全选时
        clues.map(item => {
          item.checked = true
          return item
        })
        this.clueCheckList = clues
      } else { // 取消全选时
        this.clueCheckList = []
        clues.map(item => {
          item.checked = false
          return item
        })
      }
      this.clueList = clues
    },
    updateClueCoordinates() { // 更新线索位置坐标
      // console.log('更新前的线索位置坐标：', JSON.parse(JSON.stringify(this.trackCoordinates)))
      let coordinatesArr = [] // 线索位置坐标数据
      for (const clue of this.clueList) {
        if (clue && clue.resourceId) {
          let videoRes = this.videoResMap.get(clue.resourceId)
          if (videoRes && videoRes.point && videoRes.point.loc) {
            let coordinates = videoRes.point.loc.split(',').map(item => Number(item)) // 新位置坐标
            if (coordinatesArr && coordinatesArr.length) {
              let previousCoordinates = coordinatesArr[coordinatesArr.length - 1].toString() // 最后一个位置坐标
              if (coordinates.toString() === previousCoordinates.toString()) { // 新位置与之前位置相同时，不进行处理
                continue
              }
            }
            if (coordinates && coordinates.length === 2) { // 新位置坐标有效时
              coordinatesArr.push(coordinates)
            }
          }
        }
      }
      this.trackCoordinates = coordinatesArr
      // console.log('更新后的线索位置坐标：', JSON.parse(JSON.stringify(this.trackCoordinates)))
    },
    updateClueCheckVideoParams() { // 更新选中线索的视频参数数据
      let vdieoParams = []
      for (const clue of this.clueCheckList) { // 遍历选中的线索数据
        if (clue && clue.resourceId) {
          let videoRes = this.videoResMap.get(clue.resourceId) // 获取视频资源数据
          if (videoRes && videoRes.eid) {
            let captureTime = Math.ceil(clue.captureTime / 1000.0) // 抓拍时间
            let vdieoParam = {
              _id: videoRes._id, // 资源标识
              resId: videoRes._id, // 资源标识
              name: videoRes.name,
              channel: Number(videoRes.chan),
              devIp: videoRes.eid.ip,
              devPort: videoRes.eid.cport,
              streamType: videoRes.stream,
              startTime: captureTime - 10, // 开始时间
              endTime: captureTime + 10 // 结束时间
            }
            vdieoParams.push(vdieoParam)
          }
        }
      }
      this.clueCheckVideoParams = vdieoParams
    },
    downloadPlaybackVideos() { // 下载回放视频
      batchDownloadVideoSegments(this.clueCheckVideoParams, this.parameters).then(res => {
        console.log('下载回放视频返回结果：', res)
        let errorNum = 0 // 下载失败数量
        for (const item of res) { // 遍历录像返回结果数据
          if (!item.success) {
            errorNum++
          }
        }
        if (errorNum) {
          let errMsg = '录像下载失败数量：' + errorNum
          this.errorMsg(errMsg)
        } else {
          let successMsg = this.parameters && this.parameters.downloadVideoPath ? ('录像下载成功，保存位置：' + this.parameters.downloadVideoPath) : '录像下载成功'
          this.successMsg(successMsg)
        }
      }).catch(err => {
        console.log('下载回放视频失败：', err)
        this.errorMsg('下载回放视频失败')
      })
    },
    playVideosRecords() { // 播放视频录像
      this.showVideosPlayback = true // 显示视频回放
      this.videoPlayBackList = _.cloneDeep(this.clueCheckVideoParams) // 拷贝视频参数
      console.log('回放的视频参数：', JSON.parse(JSON.stringify(this.videoPlayBackList)))
    }
  },
  beforeDestroy() {
  }
}
</script>

<style scoped>
  .track-container {
    padding: 16px 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
  }
  .track-container > div {
    height: 100%;
    margin-right: 16px;
  }
  .map-box {
    width: 50%;
    position: relative;
  }
  .map-container {
    width: 100%;
    height: 100%;
  }
  .search-container {
    position: absolute;
    top: 0px;
    width: 100%;
    height: 125px;
    background: rgba(27, 49, 83, 0.5);
    display: flex;
    flex-direction: row;
  }
  .img-upload {
    text-align: center;
    padding: 8px;
    margin: 8px;
    border-radius: 4px;
    background: rgb(60, 80, 115);
    width: 96px;
    height: 109px;
  }
  .img-upload i {
    font-size: 56px;
    cursor: pointer;
    color: #4699f9;
  }
  .img-box {
    width: 80px;
    height: 85px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .img-box img{
    display: inline-block;
    cursor: pointer;
    width: auto;
    height: auto;
    max-width: 80px;
    max-height: 85px;
  }
  .conditions {
    margin: 8px;
    display: flex;
    flex-direction: row;
    width: calc(100% - 112px);
    background: rgb(60, 80, 115);
    border-radius: 4px;
  }
  .conditions > div {
    width: 50%;
    display: flex;
    flex-direction: column;
  }
  .cond-item {
    display: flex;
    flex-direction: row;
    padding: 16px 24px 0 24px;
  }
  .cond-label{
    line-height: 32px;
    font-size: 14px;
    width: 75px;
  }
  .result-box {
    width: 50%;
    display: flex;
    flex-direction: column;
  }
  .result-box > div {
    width: 100%;
    height: calc(50% - 4px);
  }
  .target {
    margin-bottom: 8px;
  }
  .header {
    height: 38px;
    width: 100%;
    background: #0f2243;
    display: flex;
    flex-direction: row;
  }
  .header-title {
    width: 90px;
    height: 100%;
    text-align: center;
    line-height: 38px;
    background: #1b3153;
    font-size: 14px;
  }
  .header-btnlist {
    width: calc(100% - 90px);
  }
  .header-btnlist > ul {
    float: right;
    height: 38px;
  }
  .header-btnlist > ul >li {
    float: left;
    height: 38px;
    padding: 0 8px;
    line-height: 38px;
  }
  .header-btnlist > ul >li:last-child {
    padding-right: 0px;
  }
  .content {
    height: calc(100% - 77px);
    width: 100%;
    background: #1b3153;
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
    align-content: start;
    align-items: start;
  }
  .clue-content {
    height: calc(100% - 38px);
    width: 100%;
    background: #1b3153;
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
    align-content: start;
    align-items: start;
  }
  .no-result {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .footer {
    height: 39px;
    width: 100%;
    padding: 3px 12px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    background: #244575;
  }
</style>
