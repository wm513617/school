<template>
  <div v-if="show">
    <bs-cover v-model="show">
      <div class='alarm-modal-mask'></div>
      <div class='alarm-wrap'>
        <div class='ivu-modal'>
          <div class='ivu-modal-content'>
            <div class='ivu-modal-header'>
              <div class='ivu-modal-header-inner'>核验详情<i class="iconfont icon-close1" @click="$emit('close')"></i></div>
            </div>
            <div class='ivu-modal-body over'>
              <div v-if="zoomImg" class="cartogram">
                <i class="iconfont icon-narrow" @click="zoomImg=''"></i>
                <ImgZoom :imgSrc="zoomImg?zoomImg:'/static/noImg1.png'" :width="723" :height="530"></ImgZoom>
              </div>
              <div v-else class="cartogram">
                <div class="alarm-info" style="flex-direction: column;">
                  <div style="display: flex;height:60%">
                    <div v-if="type === 'passer'" style="width:100%">
                      <div class="tabs-title">车辆抓拍照片</div>
                      <div class="images clearfix">
                        <div class="bg-cover" style="width:672px;">
                          <i class="iconfont icon-enlarge" @click="changeImage($event, picInfo.vehiclePic)"></i>
                          <!-- <i class="iconfont icon-icon-test" title="以图搜图" @click="toRoute" style="left:107px;"></i> -->
                        </div>
                        <div class="image-box">
                          <img class="sing-img" :src="picInfo.vehiclePic?picInfo.vehiclePic:'/static/noImg1.png'" @error="imgErr" draggable="false" alt="无图片" style="width:100%;height:100%"/>
                        </div>
                      </div>
                      <div class="infos">
                        <div class="infos-item">
                          <i>时间:</i>
                          <span>{{$moment(parseInt(picInfo.time) * 1000).format("YYYY-MM-DD HH:mm:ss")}}</span>
                        </div>
                        <div class="infos-item">
                          <i>位置:</i>
                          <span>{{picInfo.gateName}}</span>
                        </div>
                        <div class="infos-item">
                          <i>识别号牌:</i>
                          <span>{{picInfo.plateNo}}</span>
                        </div>
                      </div>
                    </div>
                    <div v-if="type === 'alarm'">
                      <div class="tabs-title">驾驶员照片</div>
                      <div class="images clearfix">
                        <div class="two-image-box">
                          <img class="sing-img" :src="picInfo.driverPic?picInfo.driverPic:'/static/noImg1.png'" draggable="false" style="width:auto;height:auto" @error="imgErr" alt="无图片"/>
                        </div>
                        <div class="bg-cover">
                          <i class="iconfont icon-enlarge" @click="changeImage($event, picInfo.driverPic)"></i>
                        </div>
                        <div style="position:relative;">
                          <div class="two-image-box">
                            <img class="sing-img next-image" :src="picInfo.recordDriverPic?picInfo.recordDriverPic:'/static/noImg1.png'" @error="imgErr" draggable="false" style="width:auto;height:auto" alt="无图片"/>
                          </div>
                          <div class="bg-cover" style="top:0px;right:0px">
                            <i class="iconfont icon-enlarge to-back-color" @click="changeImage($event, picInfo.recordDriverPic)"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="type === 'alarm'" style="width:100%">
                      <div class="tabs-title">车辆抓拍照片</div>
                      <div class="images clearfix" style="height:90%">
                        <div class="two-image-box" style="width:100%;height:100%">
                          <img class="sing-img next-image" :src="picInfo.vehiclePic?picInfo.vehiclePic:'/static/noImg1.png'" @error="imgErr" draggable="false" style="width:100%;height:100%;max-width:none;max-height:none" alt="无图片"/>
                        </div>
                        <div class="bg-cover" style="width:441px">
                          <i class="iconfont icon-enlarge to-back-color" @click="changeImage($event, picInfo.vehiclePic)"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="type === 'alarm'">
                    <div class="infos" style="float:left;margin-right: 16px;">
                      <div class="infos-item">
                        <i>时间:</i>
                        <span>{{$moment(parseInt(picInfo.time) * 1000).format("YYYY-MM-DD HH:mm:ss")}}</span>
                      </div>
                      <div class="infos-item">
                        <i>位置:</i>
                        <span>{{picInfo.gateName}}</span>
                      </div>
                      <div class="infos-item">
                        <i>识别号牌:</i>
                        <span>{{picInfo.plateNo}}</span>
                      </div>
                      <div class="infos-item">
                        <i>相似度:</i>
                        <span>{{picInfo.similar}}%</span>
                      </div>
                      <div class="infos-item">
                        <i>核验结果:</i>
                        <span>{{picInfo.checkResult === 1 ? '成功' : '失败'}}</span>
                      </div>
                    </div>
                    <div class="infos">
                      <div class="infos-item">
                        <i>驾驶员姓名:</i>
                        <span>{{picInfo.recordName}}</span>
                      </div>
                      <!-- <div class="infos-item">
                        <i>车辆品牌:</i>
                        <span>{{picInfo.brand}}</span>
                      </div> -->
                      <div class="infos-item">
                        <i>备案号牌:</i>
                        <span>{{picInfo.recordPlateNo}}</span>
                      </div>
                      <div class="infos-item">
                        <i>联系方式:</i>
                        <span>{{picInfo.recordContact}}</span>
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
    </bs-cover>
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
    }
  },
  mounted() {
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
    ...mapMutations(['SET_IMAGE_URL']),
    /**
     * 点击放大图片
     */
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
  font-size: 16px;
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
  width: 723px;
  height: 530px;
}
.person-video {
  width: 723px;
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
  right: 20px;
  top: 0;
  color: #fff;
}
.alarm-info .images .icon-enlarge + .icon-icon-test {
  left: 70px;
}
.alarm-info .images .to-back-color.icon-enlarge {
  left: 5px;
  width: calc(100% - 5px);
  height: 24px;
  text-align: right;
}
.image-box {
  width:100%;
  height:100%;
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
  max-width: 674px;
  max-height: 330px;
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
