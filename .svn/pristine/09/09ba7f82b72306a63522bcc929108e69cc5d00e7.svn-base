<template>
  <div v-if="show">
    <!-- 报警详情 | 路人详情 -->
    <div class='alarm-modal-mask'></div>
    <div class='alarm-wrap'>
      <div class='ivu-modal'>
        <div class='ivu-modal-content'>
          <div class='ivu-modal-header'>
            <div class='ivu-modal-header-inner'>{{title}}详情<i class="iconfont icon-close1" @click="$emit('close')"></i></div>
          </div>
          <div class='ivu-modal-body over'>
            <div v-if="zoomImg" class="cartogram">
              <i class="iconfont icon-narrow" @click="zoomImg=''"></i>
              <ImgZoom :imgSrc="zoomImg?zoomImg:'/static/noImg1.png'" :width="723" :height="530"></ImgZoom>
            </div>
            <div v-else class="cartogram">
              <ul class="tab-header clearfix">
                <li :class="{active: isInfo}" @click="showItem(1)">{{title}}信息</li>
                <li :class="{active: !isInfo}" @click="showItem(2)">人员录像</li>
              </ul>
              <div v-show="isInfo" class="alarm-info">
                <div v-if="type === 'passer'">
                  <div class="tabs-title"><i class="iconfont icon-Location"></i> {{picInfo.resName}}</div>
                  <div class="images clearfix" style="width:203px">
                    <div class="bg-cover" style="width:150px;">
                      <i class="iconfont icon-enlarge" @click="changeImage($event, picInfo.faceImage)" style="left:130px;"></i>
                      <i class="iconfont icon-icon-test" title="以图搜图" v-if="!picInfo.isTrackShow" @click="toRoute" style="left:107px;"></i>
                      <i class="iconfont icon-guijichaxun1" title="轨迹追踪" v-if="pageType === 'capture'" @click="toTrackRoute" :style="{left:picInfo.isTrackShow?'107px': '85px'}"></i>
                    </div>
                    <div class="image-box">
                      <img class="sing-img" :src="picInfo.faceImage?picInfo.faceImage:'/static/noImg1.png'" @error="imgErr" draggable="false" alt="无图片" style="width:auto;height:auto"/>
                    </div>
                  </div>
                  <div class="infos">
                    <div class="infos-item">
                      <i>抓拍时间:</i>
                      <span>{{picInfo.time?$moment.unix(picInfo.time).format('YYYY-MM-DD HH:mm:ss'):''}}</span>
                    </div>
                    <div class="infos-item">
                      <i>性别:</i>
                      <span>{{sex}}</span>
                    </div>
                    <div class="infos-item">
                      <i>年龄:</i>
                      <span>{{picInfo.age}}</span>
                    </div>
                  </div>
                </div>
                <div v-if="type === 'alarm'">
                  <div class="tabs-title"><i class="iconfont icon-Location"></i> {{picInfo.resName}}</div>
                  <div class="images clearfix">
                    <div class="two-image-box">
                      <img class="sing-img" :src="picInfo.faceImage?picInfo.faceImage:'/static/noImg1.png'" draggable="false" style="width:auto;height:auto" @error="imgErr" alt="无图片"/>
                    </div>
                    <div class="bg-cover">
                      <i class="iconfont icon-enlarge" @click="changeImage($event, picInfo.faceImage)"></i>
                      <i class="iconfont icon-icon-test" title="以图搜图" @click="toRoute"></i>
                      <i class="iconfont icon-guijichaxun1" title="轨迹追踪" v-if="pageType === 'capture'" @click="toTrackRoute" style="left:50px;"></i>
                    </div>
                    <div style="position:relative;">
                    <div class="two-image-box" style="margin-left:5px;">
                      <img class="sing-img next-image" :src="picInfo.userImage?picInfo.userImage:'/static/noImg1.png'" @error="imgErr" draggable="false" style="width:auto;height:auto" alt="无图片"/>
                    </div>
                    <i class="iconfont icon-enlarge to-back-color" @click="changeImage($event, picInfo.userImage)"></i>
                    </div>
                  </div>
                  <div class="infos">
                    <div class="infos-item">
                      <i>相似度:</i>
                      <span>{{picInfo.similar}}%</span>
                    </div>
                    <div class="infos-item">
                      <i>报警时间:</i>
                      <span>{{picInfo.time?$moment.unix(picInfo.time).format('YYYY-MM-DD HH:mm:ss'):''}}</span>
                    </div>
                    <div class="infos-item">
                      <i>底库信息:</i>
                      <span>{{picInfo.groupName}}</span>
                    </div>
                    <div class="infos-item">
                      <i>人员姓名:</i>
                      <span>{{picInfo.userName}}</span>
                    </div>
                    <div class="infos-item">
                      <i>性别:</i>
                      <span>{{sex}}</span>
                    </div>
                    <div class="infos-item">
                      <i>年龄:</i>
                      <span>{{picInfo.age}}</span>
                    </div>
                    <div class="infos-item">
                      <i>身份证号:</i>
                      <span>{{picInfo.userCode}}</span>
                    </div>
                    <div class="infos-item">
                      <i>备注:</i>
                      <span>{{picInfo.remark}}</span>
                    </div>
                    <div class="infos-item">
                      <i>布控时间:</i>
                      <span>{{picInfo.defenseTime}}</span>
                    </div>
                  </div>
                </div>
                <div class="large-img">
                  <div class="tabs-title">全景图</div>
                  <span v-if="!picInfo.hasOwnProperty('fullImage')" style="display: block;width: 409px;">未配置全景图</span>
                  <div v-else class="bg-cover">
                    <i class="iconfont icon-enlarge" :style="{width:!IsErrorImg?'100%':'201px'}" @click="changeImage($event, picInfo.fullImage)"></i>
                    <div class="full-image-box" :style="{width: type === 'passer' ? '417px': '409px'}">
                      <img :src="picInfo.fullImage?picInfo.fullImage:'/static/noImg1.png'" draggable="false" alt="无图片" @error="fullImgErr" style="width:auto;height:auto;" :style="{maxWidth: type === 'passer' ? '417px': '409px'}"/>
                    </div>
                  </div>
                </div>
              </div>
              <div v-show="!isInfo" class="person-video" style="width: 723px;height: 493px">
                <div class="person-title"><i class="iconfont icon-Location"></i> {{picInfo.resName}}</div>
                <div class="video-back">
                  <FaceBack :videoParam="backParam" :show="!isInfo" pluginHeight="calc(100% - 30px)" sliderW="490px"></FaceBack>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import FaceBack from 'components/vehicleFace/videoBack'
import ImgZoom from 'components/ImgZoom'
import { mapMutations } from 'vuex'
export default {
  components: { FaceBack, ImgZoom },
  data() {
    return {
      isInfo: true,
      zoomImg: '',
      title: '',
      backParam: {},
      IsErrorImg: false
    }
  },
  props: {
    type: {
      // alarm 报警 passer 路人
      type: String,
      default: 'alarm'
    },
    show: {
      type: Boolean,
      default: false
    },
    picInfo: {
      type: Object
    },
    pageType: { // capture 【实时抓拍】添加跳转到【轨迹追踪】
      type: String,
      default: ''
    }
  },
  mounted() {
    if (this.type === 'alarm') {
      this.title = '报警'
    } else {
      this.title = '路人'
    }
    document.onkeydown = event => {
      if (event.keyCode === 27) {
        this.zoomImg = ''
      }
    }
  },
  computed: {
    sex() {
      let sex = '男'
      if (Number(this.picInfo.gender) === 1) {
        sex = '女'
      }
      return sex
    }
  },
  methods: {
    ...mapMutations(['SET_IMAGE_URL', 'SET_TRACK_TMG_SER']),
    showItem(val) {
      if (val === 1) {
        // 报警信息 | 路人信息
        this.isInfo = true
      } else {
        // 录像回放
        this.isInfo = false
        this.backParam = {
          devIp: this.picInfo.resIp,
          devPort: parseInt(this.picInfo.resPort),
          channel: this.picInfo.resChannel,
          eventType: ['all'],
          typeName: '',
          typeContent: '',
          startTime: this.picInfo.time - 10,
          endTime: this.picInfo.time + 10,
          streamType: this.picInfo.stream || 'all'
        }
      }
    },
    changeImage(e, img) {
      if (!img) {
        this.warningMsg('图片不存在！')
      }
      this.zoomImg = img
    },
    toRoute() {
      this.$router.replace('/veriface/PasserSearch/searchpic')
      this.SET_IMAGE_URL(this.picInfo.faceImage)
      this.$emit('close')
    },
    imgErr(e) {
      e.target.src = '/static/noImg1.png'
    },
    fullImgErr(e) {
      this.IsErrorImg = true
      e.target.src = '/static/noImg1.png'
    },
    toTrackRoute() {
      this.$router.replace('/veriface/Track')
      this.SET_TRACK_TMG_SER(this.picInfo.faceImage + '-passer-tag')
      this.$emit('close')
    }
  },
  beforeDestroy() {
    this.zoomImg = ''
    document.onkeydown = null
  }
}
</script>
<style scoped>
.alarm-wrap {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
.alarm-modal-mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #000813;
  opacity: 0.7;
  height: 100%;
  z-index: 999;
}
.ivu-modal {
  position: absolute;
  left: calc(50% - 410px);
  top: calc(50% - 345px);
}
.ivu-modal-header-inner i {
  float: right;
  color: #fff;
  font-size: 16px;
  width: 20px;
  height: 20px;
  display: inline-block;
  cursor: pointer;
}
.ivu-modal-body {
  padding: 0;
}
.tabs-title {
  padding: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
.tabs-title > img {
  width: auto;
  height: auto;
  background: #0f2343;
}
.large-img {
  margin-left: 16px;
}
.large-img .bg-cover {
  position: relative;
}
.large-img .icon-enlarge {
  position: absolute;
  color: #fff;
  width: 100%;
  text-align: right;
  background-color: rgba(102, 102, 102, 0.3);
}
.large-img img {
  background: #0f2243;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 450px;
}
.alarm-info {
  display: flex;
  padding: 16px 24px;
}
.person-video,
.alarm-info {
  /* width: 732px; */
  height: 530px;
}
.person-video {
  width: 732px;
}
.alarm-info .images {
  display: flex;
}
.alarm-info .images .bg-cover {
  position: absolute;
  background-color: rgba(102, 102, 102, 0.3);
  width: 114px;
  height: 24px;
}
.alarm-info .images i {
  position: absolute;
  left: 94px;
  top: 0;
  color: #fff;
}
.alarm-info .images .icon-enlarge + .icon-icon-test {
  left: 72px;
}
.alarm-info .images .to-back-color.icon-enlarge {
  left: 5px;
  width: calc(100% - 5px);
  height: 24px;
  background-color: rgba(102, 102, 102, 0.3);
  text-align: right;
}
.image-box {
  width:150px;
  height:200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.two-image-box {
  width:114px;
  height:152px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.full-image-box {
  width:431px;
  height:300px;
}
.full-image-box img {
  width: auto;
  height: auto;
  max-width: 431px;
  max-height: 300px;
  background-color: #1b3153;
}
.alarm-info .images .sing-img {
  display: inline-block;
  cursor: pointer;
  width: auto;
  height: auto;
  max-width: 150px;
  max-height: 200px;
  background-color: #1b3153;
}
.alarm-info .images .two-image-box .sing-img {
  display: inline-block;
  cursor: pointer;
  width: auto;
  height: auto;
  max-width: 114px;
  max-height: 152px;
  background-color: #1b3153;
}
.alarm-info .infos {
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  padding-left: 10px;
}
.alarm-info .infos i {
  font-style: normal;
  display: inline-block;
  width: 75px;
}
.alarm-info .infos .infos-item {
  margin-bottom: 16px;
}
.cartogram {
  width: 100%;
  height: calc(100% - 152px);
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
.clearfix:after {
  content: '.';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.person-title {
  padding: 15px;
}
.video-back {
  height: calc(100% - 73px);
  padding: 0 15px;
}
.icon-narrow {
  position: absolute;
  right: 5px;
  z-index: 10;
}
</style>
