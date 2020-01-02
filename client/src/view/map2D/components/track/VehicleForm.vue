<!-- 车辆轨迹查询表单 -->
<template>
  <div>
    <div class="trackContent">
      <Form :rules="validateRules" ref="vehicleCond" :model="vehicleCond" :label-width="75" label-position="left">
        <FormItem label="车牌号" prop="plateNumber">
          <Input v-model="vehicleCond.plateNumber" placeholder="" style="width:395px;" />
        </FormItem>
      </Form>
      <div class="cond-item">
        <div class="cond-label">时间段</div>
        <div style="margin-bottom: 24px;">
          <!-- <DatePicker type="datetime" placeholder="开始时间" style="width: 155px; margin-right: 10px;"></DatePicker> -->
          <BSdateRange :datetime="vehicleCond.startTime" @timeChange="startChange" :width='185' :height='32' style="display: inline-block;"></BSdateRange>
          <span>&nbsp;至&nbsp;</span>
          <!-- <DatePicker type="datetime" placeholder="结束时间" style="width: 155px; margin-left: 10px;"></DatePicker> -->
          <BSdateRange :datetime="vehicleCond.endTime" @timeChange="endChange" :width='185' :height='32' style="display: inline-block;"></BSdateRange>
        </div>
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
    </div>
    <div class="trackFoot">
      <Button type="primary" :disabled="!devList.length" @click="confirmSearch">确认</Button>
      <Button type="text" @click="cannelSearch">取消</Button>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import toTree from 'assets/js/toTreeData'
let bodyEle
export default {
  name: 'vehicleCond',
  data() {
    return {
      vehicleCond: {
        plateNumber: '', // 车牌号
        startTime: new Date(new Date().setHours(0, 0, 0, 0)), // 开始时间
        endTime: new Date() // 结束时间
      },
      validateRules: { // 表单校验规则
        plateNumber: [{ required: true, message: '请输入车牌号', trigger: 'blur' }]
      },
      devList: toTree([]),
      orgTreeSearch: '全部',
      isSelect: false,
      isExpand: false
    }
  },
  computed: {
    ...mapState({
    })
  },
  methods: {
    ...mapActions([
      'getVehicleCarTree',
      'getVerifaceTree', // 获取人像识别设备机构树
      'getVehicleInfo', // 获取单条车辆记录详情
      'setTrackCoordinates2D', // 设置2D轨迹坐标数组
      'changeShowTrackModal2D', // 设置是否显示轨迹弹出框
      'changeShowDrawTrack2D' // 设置是否显示轨迹绘制
    ]),
    ...mapActions('map2DApplyIX', [
      'setFaceHistoryTrackNodes' // 设置人像历史轨迹节点数据
    ]),
    cannelSearch() { // 取消查询
      this.changeShowTrackModal2D(false)
    },
    confirmSearch() { // 确认查询
      this.$refs.vehicleCond.validate(valid => {
        if (valid) { // 车辆轨迹查询条件表单校验通过
          console.log('车辆轨迹查询，校验通过！')
          this.$nextTick(() => {
            this.searcVehicleTrack()
          })
        } else {
          console.log('车辆轨迹查询，校验未通过！')
        }
      })
    },
    searcVehicleTrack() { // 查询车辆记录轨迹
      let channels = ''
      if (this.changeCamera() !== '全部') {
        channels = this.$refs.devTree.getSelectedDeepCameraCode().toString()
      }
      const param = {
        plateNumber: this.vehicleCond.plateNumber,
        startTime: this.$moment(this.vehicleCond.startTime).unix('X'),
        endTime: this.$moment(this.vehicleCond.endTime).unix('X'),
        cameraCode: channels
      }
      this.getVehicleInfo(param).then(res => {
        if (res && res.length > 0) {
          // let coordinates = this.getTaskTrackCoodinates(res) // 获取车辆任务轨迹坐标数组
          // if (coordinates && coordinates.length > 0) {
          //   this.setTrackCoordinates2D(coordinates) // 设置轨迹坐标数组
          //   this.changeShowDrawTrack2D(true) // 显示绘制轨迹
          // } else {
          //   this.errorMsg('车辆轨迹信息异常')
          // }
          this.getTrackLineCoords(res) // 获取轨迹线的坐标
          this.getTrackNodes(res) // 获取轨迹节点信息数据
        } else {
          this.errorMsg('没有查询到车辆轨迹信息')
        }
        this.resetForm() // 重置表单
        this.changeShowTrackModal2D(false) // 关闭轨迹查询弹窗
      }).catch(err => {
        console.log('获取车辆轨迹任务信息失败：', err)
        this.errorMsg('获取车辆轨迹任务信息失败')
        this.resetForm() // 重置表单
        this.changeShowTrackModal2D(false) // 关闭轨迹查询弹窗
      })
    },
    getTrackLineCoords(trackList) { // 获取轨迹线的坐标
      let lineCoords = []
      for (let index = trackList.length - 1; index >= 0; index--) {
        const item = trackList[index]
        if (item && item.point) {
          let point = item.point
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
        let pointId = item._id
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
            let point = item.point
            if (point) {
              let coord = this.getPointCoodinates(point) // 获取点位坐标
              if (coord && coord.length > 0) {
                // item.faceImage = '/image/roadVehicle/2019-10-23/vehiclePEMThhdNQG1571800360.jpg'
                // item.timestamp = 1571811412491
                // item.time = 1571811412
                // item.plateInfo = '京Q5EW21'
                // item.vehicleSpeed = '20'
                // item.vehicleType = 8
                // item.plateType = 2
                // item.vehicleColor = 1
                // item.limitSpeed = '20'
                node = {
                  pointId: pointId, // 设备标识
                  passImage: item.vehiclePic, // 最新经过抓拍图片地址
                  deviceName: item.name, // 设备名称 卡口
                  passCount: 1, // 经过次数
                  timestamp: item.time, // 最新经过时间 过车时间
                  time: item.time, // 最新经过时间 过车时间 1571811856
                  coordinates: coord, // 设备的坐标
                  info: item,
                  trackType: '2'
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
      if (point.loc) {
        coord = point.loc.split(',').map(item => Number(item))
      }
      return coord
    },
    resetForm() { // 重置表单
      this.vehicleCond.plateNumber = ''
      this.vehicleCond.startTime = new Date(new Date().setHours(0, 0, 0, 0))
      this.vehicleCond.endTime = new Date()
    },
    changeCamera() {
      const selectTree = this.$refs.devTree ? this.$refs.devTree.getSelectedDeepNameIds() : {}
      if (selectTree.name.length === 0 || selectTree.name.length === this.treeOptionNum) {
        return '全部'
      } else {
        return selectTree.name.join(';')
      }
    },
    getVehicleTree() {
      this.getVehicleCarTree().then(res => { // 获取车辆抓拍位置设备树
        this.devList = toTree([res])
        this.$nextTick(() => {
          const selectTree = this.$refs.devTree ? this.$refs.devTree.getSelectedDeepNameIds() : {}
          this.treeOptionNum = selectTree.count
          bodyEle = document.getElementsByTagName('body')[0]
          bodyEle.addEventListener('click', this.listenerClick)
        })
      }).catch(err => {
        console.log('获取车辆抓拍位置设备树出错', err)
      })
    },
    listenerClick(e) { // 监听单击事件处理
      if (e.target.classList.contains('input') || e.target.classList.contains('item') || e.target.classList.contains('treeliBox') || e.target.classList.contains('search-tree-info') || e.target.classList.contains('search')) {
        this.isExpand = true
      } else {
        this.isExpand = false
      }
    },
    startChange(val) {
      this.vehicleCond.startTime = val.dateTimes
      if (this.vehicleCond.startTime.getTime() > this.vehicleCond.endTime.getTime()) {
        this.vehicleCond.endTime = this.vehicleCond.startTime
      }
    },
    endChange(val) {
      this.vehicleCond.endTime = val.dateTimes
      if (this.vehicleCond.startTime.getTime() > this.vehicleCond.endTime.getTime()) {
        this.vehicleCond.startTime = this.vehicleCond.endTime
      }
    }
  },
  mounted() {
    this.getVehicleTree()
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
  beforeDestroy() {
    bodyEle && bodyEle.removeEventListener('click', this.listenerClick)
  }
}
</script>

<style scoped>
  /* 内容样式 */
  .trackContent {
    padding: 0 30px;
    min-height: 100px;
    height: auto;
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
  .search .input {
    width: 395px;
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
    width: 395px;
    max-height: 156px;
    overflow-y: auto;
    z-index: 99;
  }
  .search-tree-info.hidden {
    display: none;
  }
  .cond-label {
    width: 75px;
    font-size: 12px;
    line-height: 32px;
  }
  .cond-item {
    display: flex;
    flex-direction: row;
  }
</style>
