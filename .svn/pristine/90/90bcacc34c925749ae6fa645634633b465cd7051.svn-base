import Vue from 'vue'
import { mapMutations, mapActions } from 'vuex'
import store from '../../../store'
import router from '../../../router'
export default class {
  /**
   * 构造方法
   * @param context $
   */
  constructor(context) {
    this.jq = context
  }

  /**
   * 默认属性
   */
  defaultOps() {
    return {
    }
  }

  /**
   * 挂载组件
   * @param node 当前选中元素
   * @param fontColor 报警头像文字颜色
   * @param borderColor 报警头像边框颜色
   */
  addComponent(node, fontColor, borderColor) {
    let options = this.getComponentOptions(node, fontColor, borderColor)
    let MyComponent = Vue.extend(options)
    let itemComponent = new MyComponent()
    itemComponent.$store = store
    itemComponent.router = router
    itemComponent.$mount('#' + node.faceType + node.pointId)
  }

  /**
   * 生成vue组件
   * @param node 当前选中元素
   * @param fontColor 报警头像文字颜色
   * @param borderColor 报警头像边框颜色
   */
  getComponentOptions(node, fontColor, borderColor) {
    const self = this
    let options = {
      template: this.getinnerContent(node),
      methods: {
        ...mapMutations('fengMapAlarm', ['REMOVE_USER_FACEALARM_TRAIL']),
        ...mapActions('fengMapFace', ['setDetailModel', 'setShowDetailModel', 'deleteIdFaceHeadDatas']),
        ...mapActions('fengMapLine', ['deleteLineRealTrackLoc']),
        // 人像轨迹、车辆节点点击弹出详情框
        openFaceCarModel(event, type) {
          this.jq('.fm-control-popmarker').css('z-index', 1)
          this.jq(event.currentTarget).parents('.fm-control-popmarker').css('z-index', 10)
          if (type) {
            console.log('人像轨迹、车辆节点点击弹出详情框：faceType----' + this.node.faceType + '----pointId----' + this.node.pointId)
            const nodeInfo = self.changeShowModel(node)
            this.setDetailModel(nodeInfo)
            this.setShowDetailModel(nodeInfo.faceType)
          }
        },
        // 报警轨迹头像关闭轨迹
        closeFaceAlarmTrack() {
          console.log('关闭轨迹')
          this.deleteIdFaceHeadDatas(this.node.id)
          this.deleteLineRealTrackLoc([this.node.id])
          this.REMOVE_USER_FACEALARM_TRAIL(this.node.userId)
        }
      },
      data() {
        return {
          jq: self.jq,
          node: node, // 节点数据{pointId:设备标识, passImage:最新经过抓拍图片地址, similar:相似度, deviceName:设备名称, passCount:经过次数, timestamp:最新经过时间, coordinates:坐标}
          showClose: false, // 报警轨迹头像是否显示关闭按钮 根据鼠标移入移出变化
          fontColor: fontColor, // 字体颜色
          borderColor: borderColor // 边框颜色
        }
      }
    }
    return options
  }

  /**
   * 获取弹框的内容 innerHTML
   * @param node 当前选中元素
   */
  getinnerContent(node) {
    let content = ''
    // faceType 当前渲染头像的类型    faceSnap 抓拍图片  alarmTrack 报警轨迹头像 single 单兵 personTrack 人像历史轨迹节点 vehicleTrack 车辆轨迹节点
    switch (node.faceType) {
      // 报警轨迹头像
      case 'alarmTrack':
        content = `<div class="face-head" @mouseenter="showClose = true" @mouseleave="showClose = false">
          <div :style="{color: fontColor}">
            <div class="face-label" :title="node.userName">{{node.userName}}</div>
            <i class="iconfont icon-fail" v-if="showClose" title="关闭轨迹" style="cursor: pointer;" @click="closeFaceAlarmTrack"></i>
          </div>
          <div class="headCon" :style="{borderColor: borderColor}"><img :src="node.userImage"></div>
        </div>`
        break
      // 人像历史轨迹节点 车辆轨迹节点
      case 'personTrack': case 'vehicleTrack':
        content = `<div class="popup" @click="openFaceCarModel($event)">
        <div class="contentContainer">
          <div class="contentTop">
            <div class="img-box" @click.stop="openFaceCarModel($event, 'changeShowModel')">
              <img :src="node.passImage">
            </div>
            <div class="similarity" v-if="node.hasOwnProperty('similar')"><span>{{node.similar}}%</span></div>
          </div>
          <div class="contentBottom">
            <div class="time">{{$moment.unix(node.time).format('YYYY-MM-DD HH:mm:ss')}}</div>
            <div class="des">{{node.deviceName}}</div>
            <span>{{node.passCount}}次</span>
          </div>
        </div>
        <div class="triangle_bottom">
          <i class="colors"></i>
          <i class="trans"></i>
        </div>
      </div>`
        break
    }
    return content
  }

  /**
   * 人像轨迹、车辆节点点击弹出详情框显示内容
   * @param node 当前选中元素
   */
  changeShowModel(node) {
    const nodeInfo = {
      faceType: node.faceType, // 设备标识
      pointId: node.pointId, // 设备标识
      faceImage: node.info.faceImage, // 最新经过抓拍图片地址
      timestamp: node.info.timestamp, // 时间戳
      time: node.info.time, // 时间
      isTrackShow: true // 区分轨迹头像 为true时不显示以图搜图按钮
    }
    if (node.faceType === 'vehicleTrack') {
      nodeInfo.resName = node.info.name // 设备名称 卡口
      nodeInfo.plateInfo = node.info.plateInfo // 车牌号码
      nodeInfo.vehicleSpeed = node.info.vehicleSpeed // 过车速度
      nodeInfo.vehicleType = node.info.vehicleType // 车型
      nodeInfo.plateType = node.info.plateType // 车辆品牌
      nodeInfo.vehicleColor = node.info.vehicleColor // 车辆颜色
      nodeInfo.limitSpeed = node.info.limitSpeed // 限制速度
      nodeInfo.faceImage = node.info.vehiclePic // 最新经过抓拍图片地址
    } else if (node.faceType === 'personTrack') {
      nodeInfo.resName = node.info.resName // 设备名称 卡口
      nodeInfo.fullImage = node.info.fullImage // 全景图
      nodeInfo.similar = node.info.similar // 相似度
      nodeInfo.age = node.info.age // 年龄
      nodeInfo.gender = node.info.gender // 性别
      nodeInfo.resIp = node.info.resIp // 视频IP
      nodeInfo.resPort = node.info.resPort // 视频端口
      nodeInfo.resChannel = node.info.resChannel // 视频通道
      nodeInfo.faceImage = node.info.faceImage // 最新经过抓拍图片地址
    }
    return nodeInfo
  }
}
