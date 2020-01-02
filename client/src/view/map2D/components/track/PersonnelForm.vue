<!-- 人员轨迹查询表单 -->
<template>
  <div>
    <div class="trackContent">
      <div class="img-upload">
          <Upload :on-success="uploadSuccess" :on-error="uploadImgError" :on-format-error="formatError" :on-exceeded-size="exceededSize" action="/api/upload/file?type=image&category=temp" :max-size="2048" :format="['jpg','png','bmp','jpeg']" :show-upload-list="false">
            <img v-if="imageUrl" :src="imageUrl" style="width:120px;height:140px;"/>
            <div v-else class="img-up-icon">
              <i class="ivu-icon ivu-icon-ios-cloud-upload-outline" style="font-size: 38px;"></i>
              <p>点击上传图片</p>
            </div>
            <div class="upload-tip">支持JPG、JPEG、PNG、BMP格式的图片,大小不超过2M</div>
          </Upload>
        </div>
        <div class="right-form">
          <div class="cond-item">
            <div class="cond-label">开始时间</div>
            <BSdateRange :datetime="veifaceCond.startTime" @timeChange="startChange" :width='262' :height='32' style="display: inline-block; margin-bottom: 24px;"></BSdateRange>
          </div>
          <div class="cond-item">
            <div class="cond-label">结束时间</div>
            <BSdateRange :datetime="veifaceCond.endTime" @timeChange="endChange" :width='262' :height='32' style="display: inline-block; margin-bottom: 24px;"></BSdateRange>
          </div>
          <div class="cond-item">
            <div class="cond-label">抓拍位置</div>
            <div style="margin-bottom: 24px;">
              <div class="search">
                <input v-model="orgTreeSearch" @focus="isExpand = true; orgTreeSearch = ''" @blur="isSelect? '': isExpand = false" @click="isExpand = !isExpand" :icon="isExpand ? 'arrow-up-b' : 'arrow-down-b'" type="text" class="input" placeholder="请输入..." ></input>
                <button class="btn" @click.stop="isExpand = !isExpand; if (isExpand) { orgTreeSearch = '' }">
                  <Icon :type="isExpand ? 'arrow-up-b' : 'arrow-down-b'" @click.stop="isExpand = !isExpand"></Icon>
                </button>
              </div>
              <div :class="['search-tree-info', isExpand? '':'hidden']" @mouseenter.stop="isSelect = true" @mouseleave.stop="isSelect = false">
                <VTree ref="devTree" :searchVal="orgTreeSearch" :treeData="devList" :options="{showInput: true}"></VTree>
              </div>
            </div>
          </div>
          <div class="cond-item">
            <div class="cond-label">相似度</div>
            <div style="display: inline-block; margin-bottom: 24px;">
              <InputNumber :max="95" :min="50" v-model="veifaceCond.similar" style="width:240px;"></InputNumber>
              <div style="float: right; font-size: 16px; padding-top: 4px; padding-left: 5px;">%</div>
            </div>
          </div>
        </div>
    </div>
    <div class="trackFoot">
      <Button type="primary" @click="searchTrack">轨迹刻画</Button>
      <Button type="text" @click="cannelSearch">取消</Button>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import toTree from 'assets/js/toTreeData'
import _ from 'lodash'
let bodyEle
export default {
  name: 'PersonnelForm',
  data() {
    return {
      imageUrl: null,
      devList: toTree([]),
      dateLimit: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      },
      veifaceCond: {
        startTime: new Date(new Date().setHours(0, 0, 0, 0)),
        endTime: new Date(),
        similar: 75
      },
      orgTreeSearch: '全部',
      isExpand: false,
      isSelect: false,
      treeOptionNum: 0
    }
  },
  computed: {
    ...mapState({
      faceImageUrl: ({ mapAlarm }) => mapAlarm.faceImageUrl
    })
  },
  watch: {
    isExpand(val) {
      if (val) {
        this.orgTreeSearch = ''
      } else {
        this.orgTreeSearch = this.changeCamera()
      }
    },
    faceImageUrl(url) {
      url && (this.imageUrl = _.cloneDeep(url))
    }
  },
  mounted() {
    this.getVerifaceTree().then(res => { // 获取人像识别设备树
      this.devList = toTree([res.data])
      this.$nextTick(() => {
        const selectTree = this.$refs.devTree ? this.$refs.devTree.getSelectedDeepNameIds() : {}
        this.treeOptionNum = selectTree.count
        bodyEle = document.getElementsByTagName('body')[0]
        bodyEle.addEventListener('click', this.listenerClick)
      })
    }).catch(err => {
      console.log('获取人像识别设备树出错', err)
    })
  },
  methods: {
    ...mapMutations('mapAlarm', [
      'SET_FACE_IMAGE_URL' // 报警跳转轨迹追踪，路径存储
    ]),
    ...mapActions([
      'getVerifaceTree', // 获取人像识别设备机构树
      'changeShowTrackModal2D', // 设置是否显示轨迹弹出框
      'changeShowDrawTrack2D', // 设置是否显示轨迹绘制
      'setTrackCoordinates2D' // 设置2D轨迹坐标数组
    ]),
    ...mapActions('map2DApplyIX', [
      'getTrackCond', // 根据条件查询人像轨迹数据
      'setFaceHistoryTrackNodes' // 设置人像历史轨迹节点数据
    ]),
    changeCamera() {
      const selectTree = this.$refs.devTree ? this.$refs.devTree.getSelectedDeepNameIds() : {}
      if (selectTree.name.length === 0 || selectTree.name.length === this.treeOptionNum) {
        return '全部'
      } else {
        return selectTree.name.join(';')
      }
    },
    expand() {
      this.$refs.bsScrollOrg.update()
    },
    listenerClick(e) { // 监听单击事件处理
      if (e.target.classList.contains('input') || e.target.classList.contains('item') || e.target.classList.contains('treeliBox') || e.target.classList.contains('search-tree-info') || e.target.classList.contains('search')) {
        this.isExpand = true
      } else {
        this.isExpand = false
      }
    },
    startChange(val) {
      this.veifaceCond.startTime = val.dateTimes
      if (this.veifaceCond.startTime.getTime() > this.veifaceCond.endTime.getTime()) {
        this.veifaceCond.endTime = this.veifaceCond.startTime
      }
    },
    endChange(val) {
      this.veifaceCond.endTime = val.dateTimes
      if (this.veifaceCond.startTime.getTime() > this.veifaceCond.endTime.getTime()) {
        this.veifaceCond.startTime = this.veifaceCond.endTime
      }
    },
    uploadSuccess(response, file, fileList) { // 上传图片成功
      this.imageUrl = response.path
    },
    uploadImgError(err, file, fileList) { // 上传图片失败
      if (err) {
        console.log(err)
      }
      this.imageUrl = null
      this.errorMsg(file.message === 'ETIMEDOUT' ? '连接超时' : file.message)
    },
    formatError(file) { // 格式错误
      this.warningMsg('图片 ' + file.name + ' 格式不正确，请上传 jpg, png, bmp 或 jpeg 格式的图片。')
      this.imageUrl = null
    },
    exceededSize(file) { // 大小超过限制
      this.warningMsg('图片 ' + file.name + ' 大小超过限制，请上传小于2M的图片。')
      this.imageUrl = null
    },
    cannelSearch() { // 取消查询
      this.changeShowTrackModal2D(false) // 关闭轨迹查询弹框
    },
    searchTrack() { // 确认查询
      if (!this.imageUrl) {
        return this.errorMsg('请上传人员图片')
      }
      const curend = this.$moment(this.endTime).unix('X')
      const end = this.$moment(this.$moment(this.startTime).add(7, 'days')).unix('X')
      if (curend > end) {
        return this.warningMsg('时间段最大间隔为7天!')
      }
      const condition = {}
      condition.beginTime = this.$moment(this.veifaceCond.startTime).unix('X')
      condition.endTime = this.$moment(this.veifaceCond.endTime).unix('X')
      condition.isdefense = false
      condition.resStr = this.$refs.devTree.getSelectedDeepIds().toString() || ''
      condition.image = this.imageUrl
      condition.similar = parseInt(this.veifaceCond.similar)
      // console.log('人像识别轨迹查询条件：', condition)
      this.getTrackCond(condition).then(res => {
        if (res && res.length > 0) {
          // console.log('查询到的人像轨迹数据：', res)
          this.changeShowTrackModal2D(false) // 关闭轨迹查询弹框
          this.getTrackLineCoords(res) // 获取轨迹线的坐标
          this.getTrackNodes(res) // 获取轨迹节点信息数据
        } else {
          this.changeShowTrackModal2D(false) // 关闭轨迹查询弹框
          this.warningMsg('查询无结果！')
        }
      }).catch(() => {
        this.changeShowTrackModal2D(false) // 关闭轨迹查询弹框
        this.errorMsg('检索失败！')
      })
    },
    getTrackLineCoords(trackList) { // 获取轨迹线的坐标
      let lineCoords = []
      for (let index = trackList.length - 1; index >= 0; index--) {
        const item = trackList[index]
        if (item.res && item.res.point) {
          let point = item.res.point
          let coord = this.getPointCoodinates(point)
          if (coord && coord.length > 0) {
            lineCoords.push(coord)
          }
        }
      }
      // console.log('人脸轨迹线坐标数组：', lineCoords)
      if (lineCoords && lineCoords.length > 0) {
        this.setTrackCoordinates2D(lineCoords) // 设置轨迹坐标数组
        this.changeShowDrawTrack2D(true) // 显示绘制轨迹
      } else {
        if (this.trackList && this.trackList.length > 0) {
          this.warningMsg('无位置数据，请确认设备已添加到地图中！')
        }
      }
    },
    getTrackNodes(trackList) { // 获取轨迹节点信息数据
      let trackNodeMap = new Map() // 节点map(key: 人脸设备标识, value: 地图需要显示的信息对象：{pointId:设备标识, passImage:最新经过抓拍图片地址, similar:相似度, deviceName:设备名称, passCount:经过次数, timestamp:最新经过时间, coordinates:坐标})
      for (const item of trackList) {
        let pointId = item.res._id
        if (pointId) {
          let node = null
          if (trackNodeMap.has(pointId)) { // 节点map中已有设备信息
            node = trackNodeMap.get(pointId)
            node.passCount += 1
            if (node.timestamp < item.timestamp) {
              node.passImage = item.faceImage || node.passImage
              node.similar = item.similar || node.similar
            }
          } else { // 节点map中没有设备信息
            let point = item.res.point
            if (point) {
              let coord = this.getPointCoodinates(point) // 获取点位坐标
              if (coord && coord.length > 0) {
                node = {
                  pointId: pointId, // 设备标识
                  passImage: item.faceImage, // 最新经过抓拍图片地址
                  similar: item.similar, // 相似度
                  deviceName: item.resName, // 设备名称
                  passCount: 1, // 经过次数
                  time: item.time, // 识别时间
                  timestamp: item.timestamp, // 最新经过时间
                  coordinates: coord, // 设备的坐标
                  info: item,
                  trackType: '1', // 区分人脸和车辆
                  isFaceHistoryTrack: false // 区分人脸识别轨迹追踪和地图历史轨迹
                }
              }
            }
          }
          if (node) {
            trackNodeMap.set(pointId, node) // 将节点放入map中
          }
        }
      }
      let lineNodes = [...trackNodeMap.values()]
      // console.log('人脸轨迹线节点信息数组：', lineNodes)
      if (lineNodes && lineNodes.length > 0) {
        this.setFaceHistoryTrackNodes(lineNodes)
      }
    },
    getPointCoodinates(point) { // 获取点位坐标
      let coord = [] // 点位坐标数组
      let loc = ''
      if (point.hasOwnProperty('isouter') && point.isouter) { // 楼外点位
        loc = point.loc
      } else if (point.hasOwnProperty('bid') && point.bid && point.bid.center) { // 楼内点位
        loc = point.bid.center
      }
      if (loc) {
        coord = loc.split(',').map(item => Number(item))
      }
      return coord
    }
  },
  beforeDestroy() {
    this.SET_FACE_IMAGE_URL('')
    bodyEle && bodyEle.removeEventListener('click', this.listenerClick)
  }
}
</script>

<style scoped>
/* 内容样式 */
.trackContent {
  padding: 0 12px;
  min-height: 100px;
  height: auto;
  display: flex;
}
.img-upload {
  text-align: center;
  width: 160px;
}
.img-upload .img-up-icon {
  background: rgb(60, 80, 115);
  height: 150px;
  border-radius: 4px;
  padding-top: 48px;
  margin-bottom: 12px;
  cursor: pointer;
}
.upload-tip {
  font-size: 12px;
}
.right-form {
  flex: 1;
  margin-left: 24px;
}
.cond-item {
  display: flex;
  flex-direction: row;
}
.cond-label {
  width: 75px;
  font-size: 12px;
  line-height: 32px;
}
 .search .input {
  width: 252px;
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
 .search .input:focus {
  border-color: #6badfa;
  outline: 0;
  box-shadow: 0 0 0 0 #6badfa;
}
.search .btn {
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
  width: 252px;
  max-height: 156px;
  overflow-y: auto;
  z-index: 99;
}
.search-tree-info.hidden {
  display: none;
}
/* 尾部部样式 */
.trackFoot {
  background: #0f2343;
  height: 40px;
  padding: 0 24px;
  margin: 0 -6px -24px -6px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px
}
.trackFoot button {
  height: 30px;
  float: right;
  margin: 5px 8px 5px 8px;
}
.trackFoot button:first-child {
  float: right;
  margin-right: 0;
}
</style>
